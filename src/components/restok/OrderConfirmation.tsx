import { useEffect, useRef, useState } from "react";

type Props = {
  total: number;
  onDone: () => void;
};

const STAGES = [
  {
    icon: "📋",
    label: "Order received",
    sub: "Confirming with retailer...",
  },
  {
    icon: "📦",
    label: "Order confirmed",
    sub: "Retailer is preparing your order...",
  },
  {
    icon: "🚗",
    label: "Out for delivery",
    sub: "On its way to your venue!",
  },
];

export function OrderConfirmation({ total, onDone }: Props) {
  const [stage, setStage] = useState(0);
  const num = useRef(`RS-${Math.floor(Math.random() * 90000 + 10000)}`);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1200);
    const t2 = setTimeout(() => setStage(2), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const current = STAGES[stage];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/45 p-4">
      <div className="animate-pop-in w-full max-w-[420px] rounded-3xl border border-border bg-surface p-9 text-center shadow-large">
        <div className="mb-3.5 text-[60px]">{current.icon}</div>
        <div className="mb-1 text-xl font-extrabold text-foreground">
          {current.label}
        </div>
        <div className="mb-6 text-[13px] text-muted-foreground">
          {current.sub}
        </div>

        <div className="mb-5 rounded-2xl border border-primary/20 bg-primary-light px-5 py-4 text-left">
          {(
            [
              ["Order #", num.current],
              ["Est. delivery", "45–60 min"],
              ["Total charged", `$${total.toFixed(2)}`],
            ] as const
          ).map(([l, v]) => (
            <div key={l} className="mb-1.5 flex justify-between text-xs">
              <span className="text-muted-foreground">{l}</span>
              <span className="font-bold text-foreground">{v}</span>
            </div>
          ))}
        </div>

        <div className="mb-5 flex gap-1.5">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                i <= stage ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onDone}
          className="w-full rounded-xl bg-foreground py-3 text-sm font-bold text-background transition active:scale-95"
        >
          Back to Browse
        </button>
      </div>
    </div>
  );
}
