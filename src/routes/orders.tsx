import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { ORDER_STATUS_FLOW, formatStatus, statusToneClass, type OrderStatus } from "@/lib/order-status";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Live Order · ReStok" },
      { name: "description", content: "Track your wholesale order live with ETA and driver location." },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ to: "/orders/track/$id", params: { id: "demo" } });
  },
  component: OrderHistoryPage,
});

type OrderRow = {
  id: string;
  retailer_id: string;
  subtotal: number;
  delivery_fee: number;
  platform_fee: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};
type ItemRow = { id: string; order_id: string; name: string; unit_price: number; qty: number };
type RetailerRow = { id: string; name: string };

function OrderHistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [retailers, setRetailers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: os } = await supabase
        .from("orders")
        .select("id,retailer_id,subtotal,delivery_fee,platform_fee,total,status,created_at")
        .eq("licensee_id", user.id)
        .order("created_at", { ascending: false });
      const list = (os ?? []) as OrderRow[];
      setOrders(list);
      if (list.length) {
        const orderIds = list.map((o) => o.id);
        const retailerIds = Array.from(new Set(list.map((o) => o.retailer_id)));
        const [{ data: its }, { data: rs }] = await Promise.all([
          supabase.from("order_items").select("*").in("order_id", orderIds),
          supabase.from("retailers").select("id,name").in("id", retailerIds),
        ]);
        setItems((its ?? []) as ItemRow[]);
        setRetailers(Object.fromEntries(((rs ?? []) as RetailerRow[]).map((r) => [r.id, r.name])));
      }
    };
    void load();
    const ch = supabase
      .channel(`my-orders-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `licensee_id=eq.${user.id}` },
        () => { void load(); },
      )
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  if (loading) return <Centered>Loading…</Centered>;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5">
          <Link to="/" className="bg-brand-gradient rounded-lg px-3 py-1 text-[15px] font-black tracking-tight text-white">
            ReStok
          </Link>
          <nav className="flex items-center gap-4 text-xs font-bold">
            <Link to="/" className="text-muted-foreground hover:text-foreground">Marketplace</Link>
            <Link to="/orders" className="text-foreground">Orders</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="mb-1 text-2xl font-black text-foreground">Your orders</h1>
            <p className="text-sm text-muted-foreground">
              Live status updates from your retailers. Multi-retailer carts are split into separate orders.
            </p>
          </div>
          <Link
            to="/orders/track/$id"
            params={{ id: "demo" }}
            className="rounded-full bg-success px-4 py-2 text-xs font-bold text-success-foreground shadow-soft hover:opacity-90"
          >
            🚚 View live tracking demo
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-10 text-center shadow-soft">
            <div className="mb-2 text-4xl">📦</div>
            <div className="text-base font-bold text-foreground">No orders yet</div>
            <div className="mt-1 text-sm text-muted-foreground">Place your first wholesale order from the marketplace — or preview the live tracking screen above.</div>
            <Link to="/" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              Browse marketplace
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => {
              const lines = items.filter((i) => i.order_id === o.id);
              return (
                <div key={o.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">
                        {new Date(o.created_at).toLocaleString()}
                      </div>
                      <div className="text-base font-bold text-foreground">{retailers[o.retailer_id] ?? "Retailer"}</div>
                      <div className="text-[11px] text-muted-foreground">Order #{o.id.slice(0, 8)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to="/orders/track/$id"
                        params={{ id: o.id }}
                        className="rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground hover:opacity-90"
                      >
                        Track live
                      </Link>
                      <div className={`rounded-full px-3 py-1 text-xs font-bold ${statusToneClass(o.status)}`}>
                        {formatStatus(o.status)}
                      </div>
                    </div>
                  </div>

                  <StatusTimeline status={o.status} />

                  <ul className="mt-4 space-y-1 text-sm">
                    {lines.map((l) => (
                      <li key={l.id} className="flex justify-between text-foreground">
                        <span>{l.qty}× {l.name}</span>
                        <span className="text-muted-foreground">${(Number(l.unit_price) * l.qty).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 border-t border-border pt-3 text-xs">
                    <Row label="Subtotal" value={`$${Number(o.subtotal).toFixed(2)}`} />
                    <Row label="Delivery" value={`$${Number(o.delivery_fee).toFixed(2)}`} />
                    <Row label="Platform fee (3.5%)" value={`$${Number(o.platform_fee).toFixed(2)}`} />
                    <Row label="Total" value={`$${Number(o.total).toFixed(2)}`} bold />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatusTimeline({ status }: { status: OrderStatus }) {
  if (status === "cancelled") {
    return <div className="text-xs font-bold text-destructive">Order cancelled</div>;
  }
  const idx = ORDER_STATUS_FLOW.indexOf(status);
  return (
    <div className="flex items-center gap-1">
      {ORDER_STATUS_FLOW.map((s, i) => {
        const reached = i <= idx;
        return (
          <div key={s} className="flex flex-1 items-center gap-1">
            <div
              className={`h-2 flex-1 rounded-full ${reached ? "bg-primary" : "bg-muted"}`}
              title={formatStatus(s)}
            />
          </div>
        );
      })}
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "mt-1 text-sm font-extrabold text-foreground" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{children}</div>;
}
