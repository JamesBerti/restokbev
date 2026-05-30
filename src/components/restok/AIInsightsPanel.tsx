import { useEffect, useState } from "react";
import type { Cart } from "@/lib/restok-data";

type Insight = {
  icon: string;
  title: string;
  body: string;
  trend: "up" | "down" | "flat";
};

const INSIGHTS: Record<"trends" | "reorder" | "pairing", Insight[]> = {
  trends: [
    { icon: "🌹", title: "Rosé season is on", body: "Okanagan rosé orders are up 41% week-over-week as patio season opens. Stock 2-3 SKUs before the long weekend.", trend: "up" },
    { icon: "🥃", title: "Premium tequila surging", body: "Casamigos and Patron reorders up 35% YoY across Kelowna venues. Move tequila to the front of the back-bar.", trend: "up" },
    { icon: "💧", title: "Seltzers outpacing cider", body: "Hard seltzer 12-packs now account for 18% of platform volume — up from 11% last May.", trend: "up" },
  ],
  reorder: [
    { icon: "🔄", title: "You usually reorder Pinot Noir", body: "Based on similar Okanagan restaurants, Peak Cellars Pinot Noir is a strong weekly reorder. Last restocked: 9 days ago.", trend: "flat" },
    { icon: "📈", title: "Trending in your area", body: "Hendrick's Gin is being reordered by 6 nearby venues this week. G&T programs are heating up.", trend: "up" },
    { icon: "⏳", title: "Low-stock alert", body: "Blue Mountain Brut: only 6 cases left platform-wide, no restock until fall. Lock it in this week.", trend: "up" },
  ],
  pairing: [
    { icon: "🥩", title: "Steak frites + Cab Franc", body: "O'Rourke Cabernet Franc holds up beautifully against grilled red meat. Cross-sell at $14 by-the-glass.", trend: "up" },
    { icon: "🦪", title: "Oysters + Tantalus Riesling", body: "Electric acidity cuts through brine. Pair on a $32 dozen+glass tasting flight.", trend: "up" },
    { icon: "🌮", title: "Tacos + Casamigos margaritas", body: "Premium tequila in your house marg pushes ticket size up 22% on average.", trend: "up" },
  ],
};

const TABS = [
  { key: "trends", label: "📈 Market Trends" },
  { key: "reorder", label: "🔄 Reorder Tips" },
  { key: "pairing", label: "🍽️ Food Pairing" },
] as const;

export function AIInsightsPanel({ cart: _cart }: { cart: Cart }) {
  const [mode, setMode] = useState<"trends" | "reorder" | "pairing">("trends");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Insight[]>([]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setItems(INSIGHTS[mode]);
      setLoading(false);
    }, 350);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-gradient rounded-md px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white">
            ✦ AI Insights
          </div>
          <span className="text-[13px] text-muted-foreground">
            Tailored to your venue
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const active = mode === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setMode(t.key)}
                className={`rounded-md border px-3 py-1 text-xs font-semibold transition ${
                  active
                    ? "border-primary bg-primary-light text-primary-dark"
                    : "border-border bg-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-20 flex-1 animate-pulse rounded-xl bg-surface-muted"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((ins, i) => (
            <div
              key={i}
              className="animate-fade-up flex-1 basis-[220px] rounded-xl border border-border bg-surface-muted p-3.5"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ins.icon}</span>
                  <span className="text-xs font-bold text-foreground">
                    {ins.title}
                  </span>
                </div>
                {ins.trend === "up" && (
                  <span className="whitespace-nowrap text-[11px] font-bold text-teal">
                    ↑ Up
                  </span>
                )}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">
                {ins.body}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
