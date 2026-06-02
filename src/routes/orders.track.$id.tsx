import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

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

// Route shape — a gentle curve across the map for the driver to follow.
// Coordinates are in a 0–100 viewBox space.
const ROUTE_POINTS: Array<[number, number]> = [
  [12, 78],
  [22, 72],
  [30, 60],
  [38, 55],
  [48, 50],
  [56, 42],
  [64, 38],
  [72, 30],
  [82, 24],
  [88, 18],
];

function pointAt(t: number): { x: number; y: number; seg: number } {
  // t in [0,1] across the polyline by segment length.
  const lens = [];
  let total = 0;
  for (let i = 0; i < ROUTE_POINTS.length - 1; i++) {
    const [x1, y1] = ROUTE_POINTS[i];
    const [x2, y2] = ROUTE_POINTS[i + 1];
    const d = Math.hypot(x2 - x1, y2 - y1);
    lens.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (target <= lens[i]) {
      const f = target / lens[i];
      const [x1, y1] = ROUTE_POINTS[i];
      const [x2, y2] = ROUTE_POINTS[i + 1];
      return { x: x1 + (x2 - x1) * f, y: y1 + (y2 - y1) * f, seg: i };
    }
    target -= lens[i];
  }
  const [x, y] = ROUTE_POINTS[ROUTE_POINTS.length - 1];
  return { x, y, seg: ROUTE_POINTS.length - 2 };
}

function pathD(points: Array<[number, number]>): string {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}

function LiveTrackPage() {
  const { id } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [retailerName, setRetailerName] = useState<string>("Retailer");
  const [savings, setSavings] = useState<number>(0);

  // Animation: progress along route, 0..1
  const [t, setT] = useState(0);
  const startedAt = useRef<number>(Date.now());
  const TOTAL_MINUTES = 22; // demo ETA

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    const load = async () => {
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

      // Compute LDB savings from current product floors.
      if (lines.length) {
        const ids = lines.map((l) => l.product_id);
        const { data: prods } = await supabase
          .from("products")
          .select("id,ldb_floor,price")
          .in("id", ids);
        const byId = new Map((prods ?? []).map((p: any) => [p.id, p]));
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

  // Drive the animation loop — loops continuously so the demo never "ends".
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const elapsed = (Date.now() - startedAt.current) / 1000;
      // Full traversal every ~28s, then loops.
      const next = (elapsed % 28) / 28;
      setT(next);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pos = useMemo(() => pointAt(t), [t]);
  const completedPath = useMemo(() => {
    const passed = ROUTE_POINTS.slice(0, pos.seg + 1);
    return pathD([...passed, [pos.x, pos.y]]);
  }, [pos]);
  const remainingPath = useMemo(() => {
    const ahead: Array<[number, number]> = [[pos.x, pos.y], ...ROUTE_POINTS.slice(pos.seg + 1)];
    return pathD(ahead);
  }, [pos]);

  // ETA countdown — driven by t so it visibly shrinks during the loop.
  const minutesLeft = Math.max(0, Math.round(TOTAL_MINUTES * (1 - t)));
  const secondsLeft = Math.max(0, Math.floor(TOTAL_MINUTES * (1 - t) * 60) % 60);

  const orderNum = `RS-${id.slice(0, 6).toUpperCase()}`;
  const orderName = items.length
    ? items.map((l) => l.name.split(" ").slice(0, 2).join(" ")).slice(0, 2).join(" + ") +
      (items.length > 2 ? ` +${items.length - 2}` : "")
    : "Wholesale order";

  const created = order ? new Date(order.created_at) : new Date();
  const tsApproved = fmtTime(created);
  const tsConfirmed = fmtTime(new Date(created.getTime() + 4 * 60_000));
  const tsEnRoute = fmtTime(new Date(created.getTime() + 12 * 60_000));

  if (loading) return <Centered>Loading…</Centered>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-10 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[720px] items-center justify-between px-5">
          <Link to="/orders" className="text-sm font-bold text-muted-foreground hover:text-foreground">
            ← Orders
          </Link>
          <Link to="/" className="bg-brand-gradient rounded-lg px-3 py-1 text-[15px] font-black tracking-tight text-white">
            ReStok
          </Link>
          <div className="w-12" />
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-5 py-6">
        {/* Header card */}
        <section className="mb-5">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: '"DM Mono", ui-monospace, monospace' }}>
            Order {orderNum}
          </div>
          <h1 className="mt-1 text-[26px] font-black leading-tight text-foreground">{orderName}</h1>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-sm text-muted-foreground">Arriving in</span>
            <span
              className="text-[34px] leading-none text-success"
              style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 600, fontStyle: "italic" }}
            >
              {minutesLeft}:{secondsLeft.toString().padStart(2, "0")}
            </span>
            <span className="text-sm text-muted-foreground">min</span>
          </div>
        </section>

        {/* Map */}
        <section className="overflow-hidden rounded-3xl border border-border bg-surface shadow-soft">
          <div className="relative aspect-[5/4] w-full bg-[oklch(0.96_0.005_250)]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              {/* Street grid */}
              <defs>
                <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                  <path d="M 8 0 L 0 0 0 8" fill="none" stroke="oklch(0.9 0.005 250)" strokeWidth="0.35" />
                </pattern>
                <pattern id="grid-major" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="oklch(0.85 0.005 250)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              <rect width="100" height="100" fill="url(#grid-major)" />

              {/* Subtle "main roads" */}
              <line x1="0" y1="64" x2="100" y2="50" stroke="oklch(0.82 0.01 250)" strokeWidth="1.2" />
              <line x1="40" y1="0" x2="55" y2="100" stroke="oklch(0.82 0.01 250)" strokeWidth="1.2" />

              {/* Remaining route — dashed green ahead */}
              <path
                d={remainingPath}
                fill="none"
                stroke="var(--success)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeDasharray="2 2"
                opacity="0.65"
              />
              {/* Completed path — solid green trailing */}
              <path
                d={completedPath}
                fill="none"
                stroke="var(--success)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Retailer marker — dark */}
              <g>
                <circle cx={ROUTE_POINTS[0][0]} cy={ROUTE_POINTS[0][1]} r="3.4" fill="oklch(0.2 0.02 260)" />
                <text x={ROUTE_POINTS[0][0]} y={ROUTE_POINTS[0][1] + 1.2} textAnchor="middle" fontSize="3" fontWeight="800" fill="white">
                  M
                </text>
              </g>
              {/* Venue marker — green */}
              <g>
                <circle
                  cx={ROUTE_POINTS[ROUTE_POINTS.length - 1][0]}
                  cy={ROUTE_POINTS[ROUTE_POINTS.length - 1][1]}
                  r="3.4"
                  fill="var(--success)"
                />
                <text
                  x={ROUTE_POINTS[ROUTE_POINTS.length - 1][0]}
                  y={ROUTE_POINTS[ROUTE_POINTS.length - 1][1] + 1.2}
                  textAnchor="middle"
                  fontSize="3"
                  fontWeight="800"
                  fill="white"
                >
                  B
                </text>
              </g>

              {/* Driver dot — red, with pulse */}
              <g style={{ transition: "transform 60ms linear" }}>
                <circle cx={pos.x} cy={pos.y} r="3.6" fill="oklch(0.62 0.22 25)" opacity="0.25">
                  <animate attributeName="r" values="3.6;6;3.6" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.45;0;0.45" dur="1.6s" repeatCount="indefinite" />
                </circle>
                <circle cx={pos.x} cy={pos.y} r="2.2" fill="oklch(0.62 0.22 25)" stroke="white" strokeWidth="0.6" />
              </g>
            </svg>

            {/* Map labels overlay */}
            <div className="pointer-events-none absolute left-3 bottom-3 rounded-md bg-surface/90 px-2 py-1 text-[10px] font-bold text-foreground shadow-soft">
              {retailerName.split(" ")[0]} · Pickup
            </div>
            <div className="pointer-events-none absolute right-3 top-3 rounded-md bg-success/95 px-2 py-1 text-[10px] font-bold text-success-foreground shadow-soft">
              Botanist Bar · Dropoff
            </div>
          </div>
        </section>

        {/* Progress tracker */}
        <section className="mt-5 rounded-3xl border border-border bg-surface p-5 shadow-soft">
          <Stage done label="Order Approved" sub={tsApproved} />
          <Connector done />
          <Stage done label="Retailer Confirmed" sub={tsConfirmed} />
          <Connector done />
          <Stage active label="Driver En Route" sub="Now" />
          <Connector />
          <Stage label="Delivered to Back Door" sub={`ETA ${minutesLeft} min`} />
        </section>

        {/* Savings strip */}
        <section className="mt-5 rounded-2xl bg-success-soft p-5 ring-1 ring-success/20">
          <div className="flex items-baseline justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-success">You saved vs LDB</div>
            <div
              className="text-2xl text-success"
              style={{ fontFamily: '"Fraunces", ui-serif, Georgia, serif', fontWeight: 700 }}
            >
              ${savings.toFixed(2)}
            </div>
          </div>
          <ul className="mt-2 space-y-0.5 text-[13px] text-foreground/80">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>{i.qty}× {i.name}</span>
              </li>
            ))}
            {items.length === 0 && <li className="text-muted-foreground">No items.</li>}
          </ul>
        </section>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-[720px] items-center justify-around px-4 py-2">
          <BottomLink to="/" emoji="🛒" label="Shop" />
          <BottomLink to="/orders" emoji="📦" label="Orders" active />
          <BottomLink to="/orders" emoji="👤" label="Account" />
        </div>
      </nav>
    </div>
  );
}

function Stage({ label, sub, done, active }: { label: string; sub: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex h-7 w-7 items-center justify-center">
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-success/40" />
        )}
        <span
          className={`relative h-3.5 w-3.5 rounded-full ${
            done || active ? "bg-success" : "bg-muted"
          } ${active ? "ring-4 ring-success/30" : ""}`}
        />
      </div>
      <div className="flex-1">
        <div className={`text-sm font-bold ${done || active ? "text-foreground" : "text-muted-foreground"}`}>
          {label}
        </div>
        <div className={`text-xs ${active ? "text-success font-bold" : "text-muted-foreground"}`}>{sub}</div>
      </div>
    </div>
  );
}

function Connector({ done }: { done?: boolean }) {
  return <div className={`ml-[13px] h-5 w-0.5 ${done ? "bg-success" : "bg-muted"}`} />;
}

function BottomLink({
  to,
  emoji,
  label,
  active,
}: {
  to: string;
  emoji: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-bold ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
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
