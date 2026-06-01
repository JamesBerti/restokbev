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
  { key: "trends", label: "MARKET TRENDS" },
  { key: "reorder", label: "REORDER TIPS" },
  { key: "pairing", label: "FOOD PAIRING" },
] as const;

type Mode = (typeof TABS)[number]["key"];

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
        if (res.error) setError(res.error);
        setItems(res.insights);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load insights.");
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
    <div className="mb-6 rounded-[18px] border border-[color:var(--color-gold)]/30 bg-gold-soft p-5 shadow-soft">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono inline-flex items-center gap-1.5 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-medium tracking-wider text-gold">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-gold" />
            AI INSIGHTS
          </span>
          <span className="font-display text-[15px] italic text-foreground">Live merchandising signals</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {TABS.map((t) => {
            const active = mode === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setMode(t.key)}
                className={`font-mono rounded-md border px-3 py-1.5 text-[10px] font-medium tracking-wider transition ${
                  active
                    ? "border-[color:var(--color-gold)] bg-white text-[color:var(--color-gold)]"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
              className="h-20 flex-1 animate-pulse rounded-xl bg-white/60"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((ins, i) => (
            <div
              key={`${mode}-${i}`}
              className="animate-fade-up flex-1 basis-[220px] rounded-xl border border-border bg-white p-4"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ins.icon}</span>
                  <span className="text-xs font-bold text-foreground">{ins.title}</span>
                </div>
                {ins.trend === "up" && (
                  <span className="font-mono whitespace-nowrap text-[10px] font-medium text-success">↑ UP</span>
                )}
                {ins.trend === "down" && (
                  <span className="font-mono whitespace-nowrap text-[10px] font-medium text-destructive">↓ DOWN</span>
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
