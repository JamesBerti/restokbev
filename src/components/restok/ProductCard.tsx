import { useState } from "react";
import { Badge } from "./Badge";
import type { Product } from "@/lib/restok-data";

type Props = {
  product: Product;
  qty: number;
  onAdd: (p: Product) => void;
  onRemove: (p: Product) => void;
};

export function ProductCard({ product: p, qty, onAdd, onRemove }: Props) {
  const [hovered, setHovered] = useState(false);
  const lowStock = p.stock <= 10;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col overflow-hidden rounded-2xl border-[1.5px] bg-surface transition-all duration-200 ${
        hovered
          ? "-translate-y-0.5 border-primary shadow-medium"
          : "border-border shadow-soft"
      }`}
    >
      <div className="relative flex h-[100px] shrink-0 items-center justify-center bg-gradient-to-br from-[#F0F7FF] to-primary-light text-[44px]">
        {p.img}
        {p.badge && (
          <div className="absolute left-2 top-2">
            <Badge text={p.badge} />
          </div>
        )}
        <div
          className={`absolute right-2 top-2 text-[11px] font-bold ${
            p.aiTrend === "up"
              ? "text-teal"
              : p.aiTrend === "down"
                ? "text-destructive"
                : "text-muted-foreground"
          }`}
        >
          {p.aiTrend === "up" ? "↑" : p.aiTrend === "down" ? "↓" : "→"}
        </div>
        {lowStock && (
          <div className="absolute inset-x-0 bottom-2 text-center">
            <span className="rounded-full bg-destructive-soft px-2 py-[2px] text-[9px] font-extrabold text-destructive">
              Only {p.stock} left
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="text-[13px] font-bold leading-tight text-foreground">
          {p.name}
        </div>
        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
          <span>🏪</span> {p.retailer}
        </div>
        <div className="mb-2 mt-1 text-[11px] leading-snug text-muted-foreground">
          {p.description}
        </div>

        <div className="mb-2 flex items-start gap-1.5 rounded-md border border-primary/20 bg-primary-light px-2.5 py-1.5">
          <span className="mt-px shrink-0 text-[11px] font-extrabold text-primary">
            ✦
          </span>
          <span className="text-[11px] leading-snug text-primary-dark">
            {p.aiNote}
          </span>
        </div>

        <div className="mb-2.5 flex items-center gap-2">
          <span className="text-xs font-bold text-gold">★ {p.rating}</span>
          <span className="text-[11px] text-muted-foreground">
            ({p.reviews})
          </span>
          <span className="ml-auto rounded-full bg-teal-soft px-2 py-[2px] text-[11px] font-semibold text-teal">
            🕐 {p.delivery}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <div className="text-[17px] font-extrabold text-foreground">
              ${p.price.toFixed(2)}
            </div>
            {p.ldbFloor > 0 && (
              <div className="text-[10px] leading-tight text-muted-foreground">
                LDB floor <span className="line-through">${p.ldbFloor.toFixed(2)}</span>
                {p.ldbFloor > p.price && (
                  <span className="ml-1 font-bold text-success">
                    save ${(p.ldbFloor - p.price).toFixed(2)}
                  </span>
                )}
              </div>
            )}
          </div>

          {qty === 0 ? (
            <button
              onClick={() => onAdd(p)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-2xl font-light text-primary-foreground shadow-glow transition active:scale-95"
              aria-label="Add to cart"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onRemove(p)}
                className="h-[30px] w-[30px] rounded-full border border-border bg-muted text-lg font-bold text-foreground transition active:scale-95"
              >
                −
              </button>
              <span className="min-w-[18px] text-center text-[15px] font-extrabold text-foreground">
                {qty}
              </span>
              <button
                onClick={() => onAdd(p)}
                className="h-[30px] w-[30px] rounded-full bg-primary text-lg text-primary-foreground shadow-glow transition active:scale-95"
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
