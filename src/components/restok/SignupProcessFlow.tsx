type Step = { n: number; label: string; desc: string };

const LICENSEE_STEPS: Step[] = [
  { n: 1, label: "Create Account", desc: "Enter your LCRB licence number and business details." },
  { n: 2, label: "Licence Verified", desc: "We confirm your LCRB licence is valid and active." },
  { n: 3, label: "Browse Live Inventory", desc: "See real-time stock from BC retailers near your venue." },
  { n: 4, label: "Place Your First Order", desc: "Approve in one tap. AI finds the best price automatically." },
  { n: 5, label: "Delivered in 90 Min", desc: "Track your order live from retailer to back door." },
];

const RETAILER_STEPS: Step[] = [
  { n: 1, label: "Create Account", desc: "Enter your LCRB retail licence number and store details." },
  { n: 2, label: "Store Verified", desc: "We confirm your retail licence and add your store to the network." },
  { n: 3, label: "Review Terms", desc: "Confirm listing terms and payout details." },
  { n: 4, label: "Add Your Products", desc: "Connect your online store, POS, or send a file." },
  { n: 5, label: "Receive Orders", desc: "Get instant notifications when a licensee orders from your store." },
  { n: 6, label: "Get Paid", desc: "ReStok handles payment and transfers your earnings via Stripe." },
];

export function SignupProcessFlow({ kind }: { kind: "licensee" | "retailer" }) {
  const steps = kind === "retailer" ? RETAILER_STEPS : LICENSEE_STEPS;
  return (
    <div className="mb-5 rounded-xl border border-border bg-[#f8fafc] p-4">
      <div className="mb-3 text-[13px] font-bold text-foreground">What happens next</div>
      <div className="flex items-start gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex flex-1 items-start gap-2">
            <div className="flex flex-1 flex-col items-center text-center">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold text-white"
                style={{ background: "#1a56db" }}
              >
                {s.n}
              </div>
              <div className="mt-1.5 text-[11px] font-bold text-foreground leading-tight">{s.label}</div>
              <div className="mt-0.5 text-[10px] leading-snug" style={{ color: "#64748b" }}>{s.desc}</div>
            </div>
            {i < steps.length - 1 && (
              <div className="mt-3 h-[2px] flex-1 min-w-[8px]" style={{ background: "#e2e8f0" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
