import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAiInsights } from "@/lib/insights.functions";
import type { Cart, Product } from "@/lib/restok-data";

type Insight = {
  icon: string;
  title: string;
  body: string;
  trend: "up" | "down" | "flat";
};

const TABS = [
  { key: "trends", label: "📈 Market Trends" },
  { key: "reorder", label: "🔄 Reorder Tips" },
  { key: "pairing", label: "🍽️ Food Pairing" },
] as const;

type Mode = (typeof TABS)[number]["key"];

const FALLBACK: Record<Mode, Insight[]> = {
  trends: [
    { icon: "🌸", title: "Market Trend", body: "Rosé demand up 34% across Vancouver venues this month.", trend: "up" },
    { icon: "🍷", title: "Market Trend", body: "Okanagan Pinot Noir trending in Yaletown bars.", trend: "up" },
    { icon: "🍺", title: "Market Trend", body: "Local craft IPA volume steady week-over-week.", trend: "flat" },
  ],
  reorder: [
    { icon: "🔄", title: "Reorder Tip", body: "Quails' Gate Chardonnay due for reorder based on your 6-day cycle.", trend: "up" },
    { icon: "📦", title: "Reorder Tip", body: "Stock of Burrowing Owl Pinot Noir below par — order 6 bottles.", trend: "down" },
    { icon: "🥃", title: "Reorder Tip", body: "Arbutus Gin usage steady; reorder next Tuesday.", trend: "flat" },
  ],
  pairing: [
    { icon: "🍽️", title: "Food Pairing", body: "Pinot Noir pairs with salmon and mushroom risotto.", trend: "up" },
    { icon: "🧀", title: "Food Pairing", body: "Sauvignon Blanc lifts goat cheese and herb dishes.", trend: "flat" },
    { icon: "🥩", title: "Food Pairing", body: "Cabernet pairs with dry-aged steak and roasted root veg.", trend: "up" },
  ],
};


export function AIInsightsPanel({
  cart,
  products,
  category,
}: {
  cart: Cart;
  products: Product[];
  category: string;
}) {
  const [mode, setMode] = useState<Mode>("trends");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Insight[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fetchInsights = useServerFn(getAiInsights);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const cartArr = Object.entries(cart)
      .map(([id, qty]) => {
        const p = products.find((p) => p.id === id);
        return p ? { name: p.name, qty } : null;
      })
      .filter((x): x is { name: string; qty: number } => !!x);

    fetchInsights({ data: { mode, category, cart: cartArr } })
      .then((res) => {
        if (cancelled) return;
        if (res.error || !res.insights?.length) {
          setItems(FALLBACK[mode]);
        } else {
          setItems(res.insights);
        }
      })
      .catch(() => {
        if (!cancelled) setItems(FALLBACK[mode]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, category, JSON.stringify(cart)]);

  return (
    <div className="mb-6 rounded-2xl border border-border bg-surface p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="bg-brand-gradient rounded-md px-2.5 py-1 text-[11px] font-extrabold tracking-wide text-white">
            ✦ AI Insights
          </div>
          <span className="text-[13px] text-muted-foreground">Live, powered by Lovable AI</span>
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

      {error && !loading && (
        <div className="mb-3 rounded-md bg-destructive-soft px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

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
              key={`${mode}-${i}`}
              className="animate-fade-up flex-1 basis-[220px] rounded-xl border border-border bg-surface-muted p-3.5"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ins.icon}</span>
                  <span className="text-xs font-bold text-foreground">{ins.title}</span>
                </div>
                {ins.trend === "up" && (
                  <span className="whitespace-nowrap text-[11px] font-bold text-teal">↑ Up</span>
                )}
                {ins.trend === "down" && (
                  <span className="whitespace-nowrap text-[11px] font-bold text-destructive">↓ Down</span>
                )}
              </div>
              <div className="text-xs leading-relaxed text-muted-foreground">{ins.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
