import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { CATEGORIES } from "@/lib/restok-data";
import { ORDER_STATUS_FLOW, formatStatus, nextStatus, statusToneClass, type OrderStatus } from "@/lib/order-status";

export const Route = createFileRoute("/retailer")({
  component: RetailerDashboard,
});

type DbProduct = {
  id: string;
  retailer_id: string;
  name: string;
  category: string;
  price: number;
  ldb_floor: number;
  stock: number;
  badge: string | null;
  img: string;
  description: string;
};

type RetailerRow = { id: string; name: string; neighborhood: string | null };

const EMPTY: Omit<DbProduct, "id"> = {
  retailer_id: "",
  name: "",
  category: "Red Wine",
  price: 0,
  ldb_floor: 0,
  stock: 0,
  badge: null,
  img: "🍷",
  description: "",
};

function RetailerDashboard() {
  const { user, roles, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [retailer, setRetailer] = useState<RetailerRow | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<DbProduct, "id">>(EMPTY);
  const [msg, setMsg] = useState("");

  const myRoles = roles.filter((r) => r.role === "retailer");
  const approved = myRoles.find((r) => r.status === "approved");
  const pending = myRoles.find((r) => r.status === "pending");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const approvedRetailerId = approved?.retailer_id ?? null;
  useEffect(() => {
    if (!approvedRetailerId) return;
    supabase.from("retailers").select("id, name, neighborhood").eq("id", approvedRetailerId).maybeSingle()
      .then(({ data }) => setRetailer(data as RetailerRow | null));
    const load = () =>
      supabase.from("products").select("*").eq("retailer_id", approvedRetailerId).order("name")
        .then(({ data }) => setProducts((data ?? []) as DbProduct[]));
    load();
    const ch = supabase.channel(`retailer-${approvedRetailerId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `retailer_id=eq.${approvedRetailerId}` }, load)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [approvedRetailerId]);

  const startNew = () => {
    setEditingId("new");
    setDraft({ ...EMPTY, retailer_id: approved!.retailer_id! });
  };
  const startEdit = (p: DbProduct) => {
    setEditingId(p.id);
    const { id: _id, ...rest } = p;
    setDraft(rest);
  };
  const save = async () => {
    setMsg("");
    const payload = { ...draft, price: Number(draft.price), ldb_floor: Number(draft.ldb_floor), stock: Number(draft.stock) };
    if (payload.price < payload.ldb_floor) return setMsg("Price must meet or exceed LDB floor.");
    const res = editingId === "new"
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", editingId!);
    if (res.error) return setMsg(res.error.message);
    setEditingId(null);
  };
  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) setMsg(error.message);
  };
  const adjustStock = async (p: DbProduct, delta: number) => {
    const next = Math.max(0, p.stock + delta);
    const { error } = await supabase.from("products").update({ stock: next }).eq("id", p.id);
    if (error) setMsg(error.message);
  };

  if (loading) return <Centered>Loading…</Centered>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-[1100px] px-5 py-8">
        {!myRoles.length && (
          <Card>
            <div className="text-base font-bold text-foreground">You're not registered as a retailer.</div>
            <div className="mt-1 text-sm text-muted-foreground">Sign up as a retailer to manage products.</div>
            <Link to="/signup" className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">Sign up</Link>
          </Card>
        )}
        {pending && !approved && (
          <Card>
            <div className="text-base font-bold text-foreground">Awaiting admin approval</div>
            <div className="mt-1 text-sm text-muted-foreground">
              Your retailer account is in review. You'll be able to add and manage products once approved.
            </div>
          </Card>
        )}
        {approved && retailer && (
          <>
            <OrdersPanel retailerId={approved.retailer_id!} />
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Retailer dashboard</div>
                <h1 className="text-2xl font-black text-foreground">{retailer.name}</h1>
                <div className="text-sm text-muted-foreground">{retailer.neighborhood}</div>
              </div>
              <button onClick={startNew} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-glow">
                + Add product
              </button>
            </div>

            {msg && <div className="mb-4 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{msg}</div>}

            {editingId && <Editor draft={draft} setDraft={setDraft} onCancel={() => setEditingId(null)} onSave={save} />}

            <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Product</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">LDB floor</th>
                    <th className="px-4 py-3">Stock</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="px-4 py-3"><span className="mr-2">{p.img}</span>{p.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                      <td className="px-4 py-3">${Number(p.price).toFixed(2)}</td>
                      <td className="px-4 py-3 text-muted-foreground">${Number(p.ldb_floor).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => adjustStock(p, -1)} className="h-6 w-6 rounded-full border border-border text-sm">−</button>
                          <span className={`min-w-[28px] text-center font-bold ${p.stock <= 10 ? "text-destructive" : "text-foreground"}`}>{p.stock}</span>
                          <button onClick={() => adjustStock(p, 1)} className="h-6 w-6 rounded-full bg-primary text-sm text-primary-foreground">+</button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => startEdit(p)} className="mr-2 text-xs font-bold text-primary">Edit</button>
                        <button onClick={() => remove(p.id)} className="text-xs font-bold text-destructive">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {!products.length && (
                    <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No products yet. Click "Add product" to start.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function Editor({ draft, setDraft, onCancel, onSave }: {
  draft: Omit<DbProduct, "id">; setDraft: (d: Omit<DbProduct, "id">) => void; onCancel: () => void; onSave: () => void;
}) {
  const update = <K extends keyof typeof draft>(k: K, v: (typeof draft)[K]) => setDraft({ ...draft, [k]: v });
  return (
    <div className="mb-5 rounded-2xl border border-primary/30 bg-primary-light p-5">
      <div className="mb-3 text-sm font-bold text-foreground">Product details</div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Name"><input value={draft.name} onChange={(e) => update("name", e.target.value)} className={inputCls} /></Field>
        <Field label="Category">
          <select value={draft.category} onChange={(e) => update("category", e.target.value)} className={inputCls}>
            {CATEGORIES.filter((c) => c.label !== "All").map((c) => <option key={c.label}>{c.label}</option>)}
          </select>
        </Field>
        <Field label="Price"><input type="number" step="0.01" value={draft.price} onChange={(e) => update("price", Number(e.target.value))} className={inputCls} /></Field>
        <Field label="LDB floor"><input type="number" step="0.01" value={draft.ldb_floor} onChange={(e) => update("ldb_floor", Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Stock"><input type="number" value={draft.stock} onChange={(e) => update("stock", Number(e.target.value))} className={inputCls} /></Field>
        <Field label="Emoji"><input value={draft.img} onChange={(e) => update("img", e.target.value)} className={inputCls} /></Field>
        <Field label="Badge (optional)"><input value={draft.badge ?? ""} onChange={(e) => update("badge", e.target.value || null)} className={inputCls} /></Field>
        <Field label="Description" full><textarea value={draft.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} h-20`} /></Field>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold">Cancel</button>
        <button onClick={onSave} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow">Save</button>
      </div>
    </div>
  );
}

const inputCls = "w-full rounded-lg border-[1.5px] border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">{children}</div>;
}
function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">{children}</div>;
}
function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-5">
        <Link to="/" className="bg-brand-gradient rounded-lg px-3 py-1 text-[15px] font-black tracking-tight text-white">ReStok</Link>
        <nav className="flex items-center gap-4 text-xs font-bold">
          <Link to="/" className="text-muted-foreground hover:text-foreground">Marketplace</Link>
          <Link to="/retailer" className="text-foreground">Retailer</Link>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">Admin</Link>
        </nav>
      </div>
    </header>
  );
}

type OrderRow = {
  id: string;
  licensee_id: string;
  subtotal: number;
  total: number;
  status: OrderStatus;
  created_at: string;
};
type ItemRow = { id: string; order_id: string; name: string; unit_price: number; qty: number };

function OrdersPanel({ retailerId }: { retailerId: string }) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data: os } = await supabase
        .from("orders")
        .select("id,licensee_id,subtotal,total,status,created_at")
        .eq("retailer_id", retailerId)
        .order("created_at", { ascending: false })
        .limit(50);
      const list = (os ?? []) as OrderRow[];
      setOrders(list);
      if (list.length) {
        const { data: its } = await supabase
          .from("order_items").select("*").in("order_id", list.map((o) => o.id));
        setItems((its ?? []) as ItemRow[]);
      }
    };
    void load();
    const ch = supabase
      .channel(`retailer-orders-${retailerId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `retailer_id=eq.${retailerId}` }, () => { void load(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [retailerId]);

  const advance = async (o: OrderRow) => {
    const next = nextStatus(o.status);
    if (!next) return;
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", o.id);
    if (error) setErr(error.message);
  };

  const active = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const done = orders.filter((o) => o.status === "delivered" || o.status === "cancelled");

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Incoming orders</div>
          <h2 className="text-lg font-black text-foreground">{active.length} active · {done.length} completed</h2>
        </div>
      </div>
      {err && <div className="mb-3 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{err}</div>}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground shadow-soft">
          No orders yet. Once a licensee checks out, orders will appear here in real time.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {[...active, ...done].map((o) => {
            const lines = items.filter((i) => i.order_id === o.id);
            const next = nextStatus(o.status);
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs font-bold text-foreground">Order #{o.id.slice(0, 8)}</div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusToneClass(o.status)}`}>
                    {formatStatus(o.status)}
                  </span>
                </div>
                <ul className="mb-2 space-y-0.5 text-xs">
                  {lines.map((l) => (
                    <li key={l.id} className="flex justify-between">
                      <span className="text-foreground">{l.qty}× {l.name}</span>
                      <span className="text-muted-foreground">${(Number(l.unit_price) * l.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-extrabold text-foreground">${Number(o.total).toFixed(2)}</span>
                  {next ? (
                    <button onClick={() => advance(o)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
                      Mark {formatStatus(next)}
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-muted-foreground">Complete</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-4 text-[11px] text-muted-foreground">Status flow: {ORDER_STATUS_FLOW.map(formatStatus).join(" → ")}</div>
    </section>
  );
}
