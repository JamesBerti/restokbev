import { ChevronRight, Sparkles } from "lucide-react";

type Insight = {
  dotColor: string;
  category: string;
  headline: string;
  body: string;
};

const INSIGHTS: Insight[] = [
  {
    dotColor: "#f43f5e",
    category: "Trend",
    headline: "Rosé demand up 34%",
    body: "Across Vancouver venues this month. Stock up before the summer weekend rush.",
  },
  {
    dotColor: "#3b82f6",
    category: "Reorder",
    headline: "Chardonnay due Thursday",
    body: "Based on your 6-day reorder cycle. Quails Gate Chardonnay was last ordered 6 days ago.",
  },
  {
    dotColor: "#22c55e",
    category: "Pairing",
    headline: "Pinot Noir loves salmon",
    body: "BC Pinot Noir pairs perfectly with salmon, mushroom risotto, and duck confit.",
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
        padding: "12px 16px",
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={11} color="#a16207" strokeWidth={2.5} />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#a16207",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              AI Market Trends
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              color: "#a16207",
              opacity: 0.6,
            }}
          >
            Powered by ReStok AI
          </span>
        </div>

        {/* Cards */}
        <div
          className="flex gap-2.5 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`.mt-scroll::-webkit-scrollbar { display: none; }`}</style>
          <div
            className="mt-scroll flex gap-2.5 overflow-x-auto"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            {INSIGHTS.map((ins) => (
              <div
                key={ins.category}
                className="relative shrink-0"
                style={{
                  width: 160,
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "10px 12px",
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: ins.dotColor }}
                  />
                  <span
                    style={{
                      fontSize: 8,
                      textTransform: "uppercase",
                      color: "#94a3b8",
                      fontWeight: 700,
                      letterSpacing: "0.8px",
                    }}
                  >
                    {ins.category}
                  </span>
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#111318",
                    lineHeight: 1.3,
                  }}
                >
                  {ins.headline}
                </div>
                <div
                  className="mt-1"
                  style={{
                    fontSize: 10,
                    color: "#64748b",
                    lineHeight: 1.5,
                    paddingRight: 12,
                  }}
                >
                  {ins.body}
                </div>
                <ChevronRight
                  size={12}
                  color="#94a3b8"
                  strokeWidth={2}
                  style={{ position: "absolute", right: 8, bottom: 8 }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
