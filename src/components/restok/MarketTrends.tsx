import { Sparkles, TrendingUp, RefreshCw, Wallet } from "lucide-react";
import type { ComponentType } from "react";

type Insight = {
  label: string;
  accent: string;
  accentSoft: string;
  Icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  headline: string;
  body: string;
};

const INSIGHTS: Insight[] = [
  {
    label: "Demand Signal",
    accent: "#f43f5e",
    accentSoft: "rgba(244,63,94,0.12)",
    Icon: TrendingUp,
    headline: "Stock Rosé before the long weekend.",
    body: "Patios like yours sold 34% more Rosé last July. You have 2 cases left and are projected to run out by Friday.",
  },
  {
    label: "Reorder Due",
    accent: "#1a56db",
    accentSoft: "rgba(26,86,219,0.12)",
    Icon: RefreshCw,
    headline: "House Chardonnay runs out Thursday.",
    body: "Your 6-day sales cycle says reorder now. ReStok found the best available retailer price today.",
  },
  {
    label: "Margin Finder",
    accent: "#22c55e",
    accentSoft: "rgba(34,197,94,0.12)",
    Icon: Wallet,
    headline: "Same Pinot. Better price.",
    body: "Your usual Pinot is available for less this week through another approved retailer. Switch and protect margin.",
  },
];

export function MarketTrends() {
  return (
    <section
      className="w-full"
      style={{
        background: "#fffbeb",
        borderTop: "1px solid #fde68a",
        borderBottom: "1px solid #fde68a",
        padding: "14px 16px",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={12} color="#a16207" strokeWidth={2.5} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#a16207",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              AI Insights for Your Venue
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              color: "#a16207",
              opacity: 0.65,
            }}
          >
            Example insights shown for demonstration
          </span>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {INSIGHTS.map((ins) => {
            const Icon = ins.Icon;
            return (
              <div
                key={ins.label}
                className="group relative flex flex-col transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "12px 14px",
                  boxShadow: "0 1px 2px rgba(15,30,61,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 10px 24px rgba(15,30,61,0.10)";
                  e.currentTarget.style.borderColor = ins.accent;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 1px 2px rgba(15,30,61,0.04)";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      background: ins.accentSoft,
                    }}
                  >
                    <Icon size={13} color={ins.accent} strokeWidth={2.5} />
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      textTransform: "uppercase",
                      color: ins.accent,
                      fontWeight: 700,
                      letterSpacing: "0.9px",
                    }}
                  >
                    {ins.label}
                  </span>
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f1e3d",
                    lineHeight: 1.3,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {ins.headline}
                </div>
                <div
                  className="mt-1.5"
                  style={{
                    fontSize: 11,
                    color: "#64748b",
                    lineHeight: 1.5,
                  }}
                >
                  {ins.body}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
