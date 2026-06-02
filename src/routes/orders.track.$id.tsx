import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Wordmark } from "@/components/restok/Wordmark";

export const Route = createFileRoute("/orders/track/$id")({
  head: () => ({
    meta: [
      { title: "Live Order · ReStok" },
      { name: "description", content: "Live driver tracking and ETA for your wholesale delivery." },
    ],
  }),
  component: LiveTrackPage,
});

type OrderRow = {
  id: string;
  retailer_id: string;
  subtotal: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
};
type ItemRow = { id: string; name: string; unit_price: number; qty: number; product_id: string };

// Normalized route waypoints in [0,1] x [0,1] over the canvas
const ROUTE: Array<[number, number]> = [
  [0.16, 0.26],
  [0.28, 0.32],
  [0.42, 0.4],
  [0.55, 0.5],
  [0.66, 0.6],
  [0.76, 0.7],
];

function pointAt(t: number, w: number, h: number) {
  const lens: number[] = [];
  let total = 0;
  for (let i = 0; i < ROUTE.length - 1; i++) {
    const dx = (ROUTE[i + 1][0] - ROUTE[i][0]) * w;
    const dy = (ROUTE[i + 1][1] - ROUTE[i][1]) * h;
    const d = Math.hypot(dx, dy);
    lens.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i]) {
      const f = target / lens[i];
      return {
        x: (ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * f) * w,
        y: (ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * f) * h,
        seg: i,
      };
    }
    target -= lens[i];
  }
  return { x: ROUTE.at(-1)![0] * w, y: ROUTE.at(-1)![1] * h, seg: ROUTE.length - 2 };
}

function LiveTrackPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [retailerName, setRetailerName] = useState<string>("Marquis Wine Cellars");
  const [savings, setSavings] = useState<number>(38);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [t, setT] = useState(0.25);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    if (!loading && !user && id !== "demo") navigate({ to: "/login" });
  }, [loading, user, navigate, id]);

  useEffect(() => {
    const load = async () => {
      if (id === "demo") {
        const now = new Date();
        setOrder({
          id: "demo-2847",
          retailer_id: "demo",
          subtotal: 312,
          total: 342.92,
          status: "out_for_delivery",
          created_at: new Date(now.getTime() - 14 * 60_000).toISOString(),
          updated_at: now.toISOString(),
        });
        setRetailerName("Marquis Wine Cellars");
        setItems([
          { id: "d1", product_id: "p1", name: "Pinot Noir", unit_price: 38, qty: 6 },
          { id: "d2", product_id: "p2", name: "Chardonnay", unit_price: 36, qty: 2 },
          { id: "d3", product_id: "p3", name: "Gin", unit_price: 52, qty: 1 },
        ]);
        setSavings(38);
        return;
      }

      const { data: o } = await supabase
        .from("orders")
        .select("id,retailer_id,subtotal,total,status,created_at,updated_at")
        .eq("id", id)
        .maybeSingle();
      if (!o) return;
      setOrder(o as OrderRow);

      const [{ data: its }, { data: r }] = await Promise.all([
        supabase.from("order_items").select("id,name,unit_price,qty,product_id").eq("order_id", id),
        supabase.from("retailers").select("name").eq("id", o.retailer_id).maybeSingle(),
      ]);
      const lines = (its ?? []) as ItemRow[];
      setItems(lines);
      if (r?.name) setRetailerName(r.name);

      if (lines.length) {
        const ids = lines.map((l) => l.product_id);
        const { data: prods } = await supabase
          .from("products")
          .select("id,ldb_floor,price")
          .in("id", ids);
        const byId = new Map((prods ?? []).map((p: { id: string; ldb_floor: number; price: number }) => [p.id, p]));
        const total = lines.reduce((s, l) => {
          const p = byId.get(l.product_id);
          if (!p) return s;
          const diff = Math.max(0, Number(p.ldb_floor) - Number(l.unit_price));
          return s + diff * l.qty;
        }, 0);
        setSavings(+total.toFixed(2));
      }
    };
    void load();
  }, [id]);

  // Drive driver progress: from 0.25 → 1, loop back
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      const cycle = (elapsed % 34) / 34; // 34s cycle matches ETA countdown
      setT(0.25 + cycle * 0.75);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Draw the map on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssW = canvas.clientWidth;
    const cssH = 108;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    // bg
    ctx.fillStyle = "#eef2f7";
    ctx.fillRect(0, 0, cssW, cssH);

    // street grid
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < cssW; x += 14) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, cssH); ctx.stroke();
    }
    for (let y = 0; y < cssH; y += 14) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(cssW, y); ctx.stroke();
    }

    // route polyline
    const driver = pointAt(t, cssW, cssH);

    // Remaining (dashed)
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = "#bfdbfe";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(driver.x, driver.y);
    for (let i = driver.seg + 1; i < ROUTE.length; i++) {
      ctx.lineTo(ROUTE[i][0] * cssW, ROUTE[i][1] * cssH);
    }
    ctx.stroke();

    // Completed (solid)
    ctx.setLineDash([]);
    ctx.strokeStyle = "#1a56db";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(ROUTE[0][0] * cssW, ROUTE[0][1] * cssH);
    for (let i = 1; i <= driver.seg; i++) {
      ctx.lineTo(ROUTE[i][0] * cssW, ROUTE[i][1] * cssH);
    }
    ctx.lineTo(driver.x, driver.y);
    ctx.stroke();

    // Retailer M dot
    const rx = ROUTE[0][0] * cssW, ry = ROUTE[0][1] * cssH;
    ctx.fillStyle = "#0f1e3d";
    ctx.beginPath(); ctx.arc(rx, ry, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "600 6px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Marquis", rx, ry - 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 6px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("M", rx, ry + 2);

    // Venue B dot
    const vx = ROUTE.at(-1)![0] * cssW, vy = ROUTE.at(-1)![1] * cssH;
    ctx.fillStyle = "#16a34a";
    ctx.beginPath(); ctx.arc(vx, vy, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#166534";
    ctx.font = "600 6px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Botanist", vx, vy - 8);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 6px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("B", vx, vy + 2);

    // Driver dot
    ctx.fillStyle = "#dc2626";
    ctx.beginPath(); ctx.arc(driver.x, driver.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(driver.x, driver.y, 2, 0, Math.PI * 2); ctx.fill();
  }, [t]);

  // ETA: 34 → 1
  const eta = Math.max(1, Math.round(34 * (1 - (t - 0.25) / 0.75)));

  const orderNum = `RS-${(order?.id ?? id).slice(0, 4).toUpperCase()}`;
  const created = order ? new Date(order.created_at) : new Date();
  const tsApproved = fmtTime(created);
  const tsConfirmed = fmtTime(new Date(created.getTime() + 2 * 60_000));

  const productLine = items.map((i) => i.name).slice(0, 3).join(" · ") || "Pinot Noir · Chardonnay · Gin";

  if (loading) return <Centered>Loading…</Centered>;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Nav bar — same as all screens */}
      <header className="bg-nav-navy sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-5">
          <Link to="/orders" className="text-[11px] font-semibold text-white/70 hover:text-white">
            ← Orders
          </Link>
          <Wordmark />
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px]">
        {/* Order header */}
        <section
          className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ background: "#ffffff", borderBottom: "0.5px solid #e2e8f0" }}
        >
          <div>
            <div
              className="uppercase"
              style={{ color: "#94a3b8", fontSize: "8px", letterSpacing: "1px", fontWeight: 600 }}
            >
              Order {orderNum}
            </div>
            <div style={{ color: "#0f172a", fontSize: "12px", fontWeight: 800, marginTop: 2 }}>
              Friday Restock
            </div>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span
                className="inline-block h-[6px] w-[6px] animate-pulse rounded-full"
                style={{ background: "#16a34a" }}
              />
              <span style={{ color: "#94a3b8", fontSize: "8px", fontWeight: 500 }}>
                Driver en route · {retailerName} → Botanist Bar
              </span>
            </div>
          </div>
          <div className="text-right">
            <div style={{ color: "#1a56db", fontSize: "18px", fontWeight: 700, lineHeight: 1 }}>{eta}</div>
            <div style={{ color: "#94a3b8", fontSize: "8px", marginTop: 2 }}>min</div>
            <div style={{ color: "#94a3b8", fontSize: "8px", marginTop: 2 }}>to Botanist Bar</div>
          </div>
        </section>

        {/* Map canvas */}
        <section className="w-full">
          <canvas ref={canvasRef} className="block w-full" style={{ height: 108 }} />
        </section>

        {/* Progress tracker */}
        <section className="px-5 py-4">
          <Step done first label="Order Approved" time={tsApproved} />
          <Step done label="Retailer Confirmed" sublabel={`${retailerName.split(" ")[0]} Wine confirmed`} time={tsConfirmed} />
          <Step active label="Driver En Route" time="Now" timeColor="#1a56db" />
          <Step muted last label="Delivered to Back Door" time="~ 5:16 PM" />
        </section>

        {/* Savings strip */}
        <section
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "#f0fdf4", borderTop: "0.5px solid #bbf7d0" }}
        >
          <div>
            <div
              className="uppercase"
              style={{ color: "#166534", fontSize: "8px", fontWeight: 700, letterSpacing: "0.8px" }}
            >
              Saved vs LDB
            </div>
            <div style={{ color: "#94a3b8", fontSize: "8px", marginTop: 2 }}>{productLine}</div>
          </div>
          <div style={{ color: "#16a34a", fontSize: "16px", fontWeight: 700 }}>
            ${savings.toFixed(0)}
          </div>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#e2e8f0] bg-white">
        <div className="mx-auto flex max-w-[720px] items-center justify-around px-4 py-2">
          <BottomLink to="/" emoji="🛒" label="Shop" />
          <BottomLink to="/orders/track/$id" params={{ id: "demo" }} emoji="📦" label="Orders" active />
          <BottomLink to="/orders" emoji="👤" label="Account" />
        </div>
      </nav>
    </div>
  );
}

function Step({
  label,
  sublabel,
  time,
  timeColor,
  done,
  active,
  muted,
  first,
  last,
}: {
  label: string;
  sublabel?: string;
  time: string;
  timeColor?: string;
  done?: boolean;
  active?: boolean;
  muted?: boolean;
  first?: boolean;
  last?: boolean;
}) {
  const dotStyle: React.CSSProperties = active
    ? {
        background: "#ffffff",
        border: "1.5px solid #1a56db",
        boxShadow: "0 0 0 2px #bfdbfe",
      }
    : done
      ? { background: "#1a56db", border: "1px solid #1a56db" }
      : { background: "#ffffff", border: "1px solid #e2e8f0" };

  const lineColor = done ? "#1a56db" : "#e2e8f0";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div style={{ width: 10, height: 10, borderRadius: "50%", ...dotStyle }} />
        {!last && <div style={{ width: 1.5, flex: 1, background: lineColor, minHeight: 24 }} />}
      </div>
      <div className={`flex-1 ${first ? "" : ""} ${last ? "" : "pb-3"}`}>
        <div
          style={{
            color: muted ? "#94a3b8" : "#0f172a",
            fontWeight: muted ? 500 : 700,
            fontSize: "9px",
          }}
        >
          {label}
        </div>
        {sublabel && (
          <div style={{ color: "#94a3b8", fontSize: "8px", marginTop: 1 }}>{sublabel}</div>
        )}
        <div
          style={{
            color: timeColor ?? "#94a3b8",
            fontSize: "8px",
            fontWeight: timeColor ? 700 : 500,
            marginTop: 1,
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

function BottomLink({
  to,
  emoji,
  label,
  active,
  params,
}: {
  to: string;
  emoji: string;
  label: string;
  active?: boolean;
  params?: Record<string, string>;
}) {
  return (
    <Link
      to={to}
      params={params as never}
      className="flex flex-1 flex-col items-center gap-0.5 rounded-lg px-3 py-1.5"
      style={{ color: active ? "#1a56db" : "#94a3b8", fontSize: "10px", fontWeight: 600 }}
    >
      <span className="text-lg leading-none">{emoji}</span>
      {label}
    </Link>
  );
}

function fmtTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{children}</div>;
}
