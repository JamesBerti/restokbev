import {
  DELIVERY_FEE,
  PLATFORM_FEE_RATE,
  type Cart,
  type Product,
} from "@/lib/restok-data";

type Props = {
  cart: Cart;
  products: Product[];
  onAdd: (p: Product) => void;
  onRemove: (p: Product) => void;
  onClose: () => void;
  onCheckout: () => void;
  placing?: boolean;
  error?: string | null;
};

export function CartDrawer({
  cart,
  products,
  onAdd,
  onRemove,
  onClose,
  onCheckout,
  placing,
  error,
}: Props) {
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const subtotal = items.reduce((s, [id, q]) => {
    const p = products.find((p) => p.id === id);
    return s + (p ? p.price * q : 0);
  }, 0);
  const platformFee = subtotal * PLATFORM_FEE_RATE;
  const total = subtotal + DELIVERY_FEE + platformFee;
  const count = items.reduce((s, [, q]) => s + q, 0);

  // Group items by retailer
  const groups = new Map<string, { retailer: string; lines: { p: Product; qty: number }[]; saved: number }>();
  for (const [id, qty] of items) {
    const p = products.find((pp) => pp.id === id);
    if (!p) continue;
    const g = groups.get(p.retailer) ?? { retailer: p.retailer, lines: [], saved: 0 };
    g.lines.push({ p, qty });
    const sav = Number(p.badge?.replace(/[^\d.]/g, "")) || 0;
    g.saved += sav * qty;
    groups.set(p.retailer, g);
  }
  const totalSaved = Array.from(groups.values()).reduce((s, g) => s + g.saved, 0);

  return (
    <div className="animate-slide-in-right fixed bottom-0 right-0 top-0 z-[1000] flex w-full max-w-[420px] flex-col border-l border-border bg-surface shadow-large">
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div>
          <div className="text-[17px] font-bold text-foreground">Your Order</div>
          {items.length > 0 && (
            <div className="font-mono mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
              {count} ITEM{count > 1 ? "S" : ""}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-full border border-border bg-surface text-sm text-muted-foreground transition hover:border-foreground active:scale-95"
          aria-label="Close cart"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {items.length === 0 ? (
          <div className="mt-20 text-center text-muted-foreground">
            <div className="mb-3 text-5xl">🛒</div>
            <div className="text-[15px] font-bold text-foreground">Your cart is empty</div>
            <div className="mt-1.5 text-[13px]">Browse products and tap + to add</div>
          </div>
        ) : (
          Array.from(groups.values()).map((g) => (
            <div key={g.retailer} className="mb-5 last:mb-0">
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-muted text-xs">🏪</span>
                <div className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{g.retailer}</div>
              </div>
              {g.lines.map(({ p, qty }) => (
                <div key={p.id} className="mb-3 flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-2xl">
                    {p.img}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-bold leading-tight text-foreground">{p.name}</div>
                    <div className="font-display mt-1 text-[15px] text-foreground">${(p.price * qty).toFixed(2)}</div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      onClick={() => onRemove(p)}
                      className="h-7 w-7 rounded-lg border border-border bg-surface text-sm font-bold text-foreground hover:border-foreground"
                    >
                      −
                    </button>
                    <span className="font-mono min-w-[18px] text-center text-[13px] text-foreground">{qty}</span>
                    <button
                      onClick={() => onAdd(p)}
                      className="h-7 w-7 rounded-lg bg-primary text-sm text-primary-foreground shadow-glow"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border px-6 pb-7 pt-5">
          {totalSaved > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[color:var(--color-success-border)] bg-success-soft px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-success">You save</span>
              </div>
              <div className="font-display text-[19px] text-success">${totalSaved.toFixed(2)}</div>
            </div>
          )}

          {(
            [
              ["Subtotal", `$${subtotal.toFixed(2)}`],
              ["Delivery fee", `$${DELIVERY_FEE.toFixed(2)}`],
              ["Platform fee (3.5%)", `$${platformFee.toFixed(2)}`],
            ] as const
          ).map(([l, v]) => (
            <div key={l} className="mb-1.5 flex justify-between text-[13px]">
              <span className="text-muted-foreground">{l}</span>
              <span className="font-mono text-foreground">{v}</span>
            </div>
          ))}
          <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3">
            <span className="text-[15px] font-bold text-foreground">Total</span>
            <span className="font-display text-[24px] text-foreground">${total.toFixed(2)}</span>
          </div>

          <div className="mt-3 mb-4 flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Delivery ETA · Today before 5pm</span>
          </div>

          {error && (
            <div className="mb-3 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">{error}</div>
          )}
          <button
            onClick={onCheckout}
            disabled={placing}
            className="w-full rounded-xl bg-foreground py-4 text-[14px] font-extrabold tracking-wide text-background transition hover:bg-ink-soft active:scale-[0.99] disabled:opacity-60"
          >
            {placing ? "Placing order…" : `Approve Order · $${total.toFixed(2)}`}
          </button>
          <div className="font-mono mt-3 text-[9px] uppercase tracking-wider leading-snug text-muted-foreground">
            LDB-compliant pricing · LCRB-licensed delivery · Platform fee charged to retailer
          </div>
        </div>
      )}
    </div>
  );
}
