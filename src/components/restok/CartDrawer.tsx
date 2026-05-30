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
};

export function CartDrawer({
  cart,
  products,
  onAdd,
  onRemove,
  onClose,
  onCheckout,
}: Props) {
  const items = Object.entries(cart).filter(([, q]) => q > 0);
  const subtotal = items.reduce((s, [id, q]) => {
    const p = products.find((p) => p.id === id);
    return s + (p ? p.price * q : 0);
  }, 0);
  const platformFee = subtotal * PLATFORM_FEE_RATE;
  const total = subtotal + DELIVERY_FEE + platformFee;
  const count = items.reduce((s, [, q]) => s + q, 0);

  return (
    <div className="animate-slide-in-right fixed bottom-0 right-0 top-0 z-[1000] flex w-full max-w-[400px] flex-col border-l border-border bg-surface shadow-2xl">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <div className="text-lg font-extrabold text-foreground">Your Order</div>
          {items.length > 0 && (
            <div className="text-xs text-muted-foreground">{count} items</div>
          )}
        </div>
        <button
          onClick={onClose}
          className="h-8 w-8 rounded-full bg-muted text-sm text-muted-foreground transition active:scale-95"
          aria-label="Close cart"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="mt-16 text-center text-muted-foreground">
            <div className="mb-3 text-5xl">🛒</div>
            <div className="text-[15px] font-semibold">Your cart is empty</div>
            <div className="mt-1.5 text-[13px]">Browse products and tap + to add</div>
          </div>
        ) : (
          items.map(([id, qty]) => {
            const p = products.find((p) => p.id === id);
            if (!p) return null;
            return (
              <div key={id} className="mb-3.5 flex items-center gap-3 border-b border-border pb-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-[26px]">
                  {p.img}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold leading-tight text-foreground">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground">{p.retailer}</div>
                  <div className="mt-0.5 text-[13px] font-bold text-primary">
                    ${(p.price * qty).toFixed(2)}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => onRemove(p)}
                    className="h-6 w-6 rounded-full border border-border bg-muted text-sm font-bold text-foreground"
                  >
                    −
                  </button>
                  <span className="min-w-[16px] text-center text-sm font-extrabold text-foreground">
                    {qty}
                  </span>
                  <button
                    onClick={() => onAdd(p)}
                    className="h-6 w-6 rounded-full bg-primary text-sm text-primary-foreground"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-border px-6 pb-7 pt-4">
          {(
            [
              ["Subtotal", `$${subtotal.toFixed(2)}`],
              ["Delivery fee", `$${DELIVERY_FEE.toFixed(2)}`],
              ["Platform fee (3.5%)", `$${platformFee.toFixed(2)}`],
            ] as const
          ).map(([l, v]) => (
            <div key={l} className="mb-1.5 flex justify-between text-[13px]">
              <span className="text-muted-foreground">{l}</span>
              <span className="font-semibold text-foreground">{v}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t border-border pt-2.5">
            <span className="text-base font-extrabold text-foreground">Total</span>
            <span className="text-base font-extrabold text-primary">${total.toFixed(2)}</span>
          </div>
          <div className="mb-4 mt-1 text-[10px] leading-snug text-muted-foreground">
            All prices at or above LDB wholesale floor. LCRB compliant. Platform fee charged to retailer on settlement.
          </div>
          <button
            onClick={onCheckout}
            className="bg-cta-gradient w-full rounded-xl py-3.5 text-[15px] font-extrabold text-white shadow-glow transition active:scale-95"
          >
            Place Order · ${total.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
