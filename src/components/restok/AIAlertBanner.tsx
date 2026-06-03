import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, RefreshCw, TrendingUp, Gift } from "lucide-react";

type Card = {
  id: string;
  dotColor: string;
  pulse?: boolean;
  Icon: typeof AlertTriangle;
  iconColor: string;
  iconBg: string;
  line1: React.ReactNode;
  line2: React.ReactNode;
  cta: string;
  ctaStyle: React.CSSProperties;
};

const CARDS: Card[] = [
  {
    id: "par",
    dotColor: "#f59e0b",
    pulse: true,
    Icon: AlertTriangle,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.15)",
    line1: "Your cellar is running low",
    line2: <span style={{ color: "#4ade80" }}>3 items below par — $38 saved</span>,
    cta: "Approve",
    ctaStyle: { background: "#22c55e", color: "#042010" },
  },
  {
    id: "price",
    dotColor: "#60a5fa",
    Icon: BarChart3,
    iconColor: "#60a5fa",
    iconBg: "rgba(96,165,250,0.15)",
    line1: "Best price found across 4 retailers",
    line2: (
      <>
        Burrowing Owl Pinot Noir —{" "}
        <span style={{ color: "#4ade80" }}>$14 under LDB</span>
      </>
    ),
    cta: "Add to Cart",
    ctaStyle: { background: "#1a56db", color: "#ffffff" },
  },
  {
    id: "reorder",
    dotColor: "#22c55e",
    Icon: RefreshCw,
    iconColor: "#22c55e",
    iconBg: "rgba(34,197,94,0.15)",
    line1: "Your usual Tuesday order is due",
    line2: "Quails Gate Chardonnay — last ordered 6 days ago",
    cta: "Reorder",
    ctaStyle: { background: "#1a56db", color: "#ffffff" },
  },
  {
    id: "season",
    dotColor: "#a78bfa",
    Icon: TrendingUp,
    iconColor: "#a78bfa",
    iconBg: "rgba(167,139,250,0.15)",
    line1: "Rosé demand up 34% across Vancouver venues",
    line2: "Stock up before the weekend rush",
    cta: "Browse Rosé",
    ctaStyle: { background: "transparent", color: "#ffffff", border: "1px solid rgba(255,255,255,0.5)" },
  },
  {
    id: "refer",
    dotColor: "#f59e0b",
    Icon: Gift,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.15)",
    line1: "Refer a venue and earn $50 credit",
    line2: "Share your link — they get $25 off their first order",
    cta: "Share Link",
    ctaStyle: { background: "#f59e0b", color: "#1a1303" },
  },
];

export function AIAlertBanner() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % CARDS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto mt-3 max-w-[1200px] px-3">
      <section
        className="relative overflow-hidden rounded-[12px] bg-[#0f1e3d]"
        style={{ height: 76 }}
      >
        {/* Blobs */}
        <div
          aria-hidden
          className="animate-blob-a pointer-events-none absolute -right-[15px] -top-[20px] h-[70px] w-[100px] rounded-full"
          style={{ background: "rgba(59,130,246,0.28)", filter: "blur(20px)" }}
        />
        <div
          aria-hidden
          className="animate-blob-b pointer-events-none absolute -bottom-[15px] -left-[8px] h-[65px] w-[80px] rounded-full"
          style={{ background: "rgba(22,163,74,0.2)", filter: "blur(20px)" }}
        />

        {/* Sliding track */}
        <div
          className="relative z-[1] flex h-full transition-transform duration-500 ease-out"
          style={{ width: `${CARDS.length * 100}%`, transform: `translateX(-${active * (100 / CARDS.length)}%)` }}
        >
          {CARDS.map((c) => (
            <div
              key={c.id}
              className="flex h-full items-center gap-2.5 px-3"
              style={{ width: `${100 / CARDS.length}%` }}
            >
              {/* Dot */}
              <span
                className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${c.pulse ? "animate-pulse" : ""}`}
                style={{ background: c.dotColor }}
              />
              {/* Icon badge */}
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px]"
                style={{ background: c.iconBg }}
              >
                <c.Icon size={16} color={c.iconColor} strokeWidth={2.25} />
              </div>
              {/* Text */}
              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-white"
                  style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}
                >
                  {c.line1}
                </div>
                <div
                  className="truncate"
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.3, marginTop: 2 }}
                >
                  {c.line2}
                </div>
              </div>
              {/* CTA */}
              <button
                className="shrink-0 rounded-full px-3 py-1.5 transition active:scale-95"
                style={{ fontSize: 10, fontWeight: 700, ...c.ctaStyle }}
              >
                {c.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dots */}
      <div className="mt-1.5 flex justify-center gap-1">
        {CARDS.map((c, i) => (
          <button
            key={c.id}
            aria-label={`Show card ${i + 1}`}
            onClick={() => setActive(i)}
            className="h-1.5 w-1.5 rounded-full transition"
            style={{ background: i === active ? "#ffffff" : "rgba(255,255,255,0.3)" }}
          />
        ))}
      </div>
    </div>
  );
}
