import { useState } from "react";

type Method = "store" | "pos" | "file";

const OPTIONS: { id: Method; title: string; body: string; recommended?: boolean }[] = [
  {
    id: "store",
    title: "Use your online store",
    body: "We'll read your public catalogue. Your prices stay current automatically. Nothing to install.",
    recommended: true,
  },
  {
    id: "pos",
    title: "Connect your point of sale",
    body: "Stock and pricing sync straight from your till. Some systems need a plan that includes API access.",
  },
  {
    id: "file",
    title: "Send us a product file",
    body: "Export from any POS. We'll set up a nightly refresh so you never do it twice.",
  },
];

export function CatalogConnect({ onFinish }: { onFinish?: () => void }) {
  const [selected, setSelected] = useState<Method>("store");

  return (
    <div className="w-full">
      {/* Progress indicator */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Step 4 of 6
        </div>
        <div className="text-[11px] text-muted-foreground">Add your products</div>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${(4 / 6) * 100}%` }} />
      </div>

      <h2 className="mb-1 text-2xl font-black text-foreground">Add your products</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Pick whatever's easiest. You can switch methods any time.
      </p>

      <div className="flex flex-col gap-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={`rounded-xl border-[1.5px] p-4 text-left transition ${
                active ? "border-primary bg-primary-light" : "border-border bg-background hover:border-primary/40"
              } ${opt.recommended ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-bold text-foreground">{opt.title}</div>
                {opt.recommended && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white"
                    style={{ background: "#16a34a", letterSpacing: "1px" }}
                  >
                    Recommended
                  </span>
                )}
              </div>
              <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{opt.body}</div>
            </button>
          );
        })}
      </div>

      <div className="my-5 h-px w-full bg-border" />

      <div className="rounded-xl border border-border bg-[#f8fafc] p-4">
        <div className="text-sm font-bold text-foreground">
          Not sure? We'll build your catalogue for you.
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          30 minutes with a founding-retailer specialist.
        </div>
        <a
          href="mailto:support@restokbev.ca?subject=Book%20a%20catalogue%20call"
          className="mt-3 inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background hover:opacity-90"
        >
          Book a call
        </a>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onFinish}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground shadow-glow"
        >
          Continue
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="text-xs font-semibold text-muted-foreground underline hover:text-foreground"
        >
          Skip for now
        </button>
      </div>

      <p className="mt-4 text-center text-[11px] text-muted-foreground">
        You can finish signing up and add products later.
      </p>
    </div>
  );
}
