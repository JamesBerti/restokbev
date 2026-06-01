import { useState } from "react";
import type { Product } from "@/lib/restok-data";

type Props = {
  product: Product;
  qty: number;
  onAdd: (p: Product) => void;
  onRemove: (p: Product) => void;
};

function categoryClass(cat: string) {
  switch (cat) {
    case "Red Wine": return "cat-red";
    case "White Wine": return "cat-white";
    case "Rosé": return "cat-rose";
    case "Sparkling": return "cat-sparkling";
    case "Beer": return "cat-beer";
    case "Cider": return "cat-beer";
    case "Whisky":
    case "Vodka & Gin":
    case "Rum":
    case "Tequila & Mezcal": return "cat-spirits";
    case "RTD & Seltzers": return "cat-rtd";
    default: return "cat-default";
  }
}

function parseDescription(desc: string) {
  // Encoded as "Producer • Region • Vintage"
  const parts = desc.split("•").map((s) => s.trim()).filter(Boolean);
  return {
    producer: parts[0] ?? "",
    region: parts[1] ?? "",
    vintage: parts[2] ?? "",
  };
}

export function ProductCard({ product: p, qty, onAdd, onRemove }: Props) {
  const [hovered, setHovered] = useState(false);
  const lowStock = p.stock <= 10;
  const savings = Math.max(0, p.ldbFloor && p.badge?.startsWith("Save")
    ? Number(p.badge.replace(/[^\d.]/g, "")) || 0
    : 0);
  const { producer, region, vintage } = parseDescription(p.description);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col overflow-hidden rounded-[18px] border border-border bg-surface transition-all duration-200 ${
        hovered ? "-translate-y-[3px] shadow-medium" : "shadow-soft"
      }`}
    >
      <div className={`relative flex h-[140px] shrink-0 items-center justify-center text-[64px] ${categoryClass(p.category)}`}>
        <span className="drop-shadow-sm">{p.img}</span>

        {savings > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-[3px] text-[9px] font-bold uppercase tracking-wide text-primary-foreground shadow-sm">
            Save ${savings}
          </span>
        )}

        <span className="font-mono absolute bottom-2.5 left-2.5 rounded-full bg-white/80 px-2 py-[3px] text-[8px] font-medium text-foreground backdrop-blur">
          {p.retailer}
        </span>

        {lowStock && (
          <span className="font-mono absolute bottom-2.5 right-2.5 rounded-full bg-destructive-soft px-2 py-[3px] text-[8px] font-medium text-destructive">
            ONLY {p.stock} LEFT
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <div className="text-[13px] font-bold leading-snug text-foreground">{p.name}</div>
          {(producer || region || vintage) && (
            <div className="mt-1 text-[11px] leading-snug text-muted-foreground">
              {[producer, region, vintage].filter(Boolean).join(" · ")}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="font-display text-[22px] leading-none text-foreground">
              ${p.price.toFixed(2)}
            </div>
            {savings > 0 && (
              <div className="font-mono mt-1 text-[9px] font-medium uppercase tracking-wider text-success">
                Save ${savings} vs LDB
              </div>
            )}
          </div>
          {qty === 0 ? (
            <button
              onClick={() => onAdd(p)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-base font-light text-background transition hover:bg-primary active:scale-95"
              aria-label="Add to cart"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onRemove(p)}
                className="h-7 w-7 rounded-lg border border-border bg-surface text-sm font-bold text-foreground transition hover:border-foreground active:scale-95"
              >
                −
              </button>
              <span className="font-mono min-w-[18px] text-center text-[13px] font-medium text-foreground">
                {qty}
              </span>
              <button
                onClick={() => onAdd(p)}
                className="h-7 w-7 rounded-lg bg-primary text-sm text-primary-foreground shadow-glow transition active:scale-95"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
