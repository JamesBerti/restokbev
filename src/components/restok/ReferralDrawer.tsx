import { useState } from "react";
import { X, Utensils, Store, Briefcase, Copy, Check } from "lucide-react";

const REFERRAL_LINK = "https://restok.ca/r/your-venue";

function Card({
  icon,
  title,
  body,
  badge,
  cta,
  ctaOutlined,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  badge: string;
  cta: string;
  ctaOutlined?: boolean;
}) {
  return (
    <div
      className="rounded-[12px] bg-white p-4"
      style={{ border: "1px solid #e2e8f0", borderLeft: "3px solid #f59e0b" }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[8px]"
            style={{ background: "rgba(245,158,11,0.12)", color: "#b45309" }}
          >
            {icon}
          </div>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{title}</h3>
        </div>
        <span
          className="rounded-full px-2 py-0.5"
          style={{
            background: "#fef3c7",
            color: "#92400e",
            fontSize: 10,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.45, marginBottom: 12 }}>{body}</p>
      <button
        className="w-full rounded-[8px] py-2 transition active:scale-[0.99]"
        style={
          ctaOutlined
            ? { border: "1px solid #cbd5e1", color: "#0f172a", background: "#ffffff", fontSize: 12, fontWeight: 700 }
            : { background: "#22c55e", color: "#042010", fontSize: 12, fontWeight: 700 }
        }
      >
        {cta}
      </button>
    </div>
  );
}

export function ReferralDrawer({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 z-[999] bg-black/40" />
      <aside className="animate-slide-in-right fixed right-0 top-0 z-[1000] flex h-full w-full max-w-[420px] flex-col bg-[#f8fafc]">
        <header
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "#0f1e3d" }}
        >
          <h2 style={{ color: "#ffffff", fontWeight: 800, fontSize: 18 }}>Refer & Earn</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          <Card
            icon={<Utensils size={16} />}
            title="Refer a Licensee"
            body="They get $25 off their first order. You get $50 order credit."
            badge="Earn $50"
            cta="Share Link"
          />
          <Card
            icon={<Store size={16} />}
            title="Bring a Retailer to ReStok"
            body="They get 90 days Retailer Pro free. You get $75 credit after their first 3 orders."
            badge="Earn $75"
            cta="Share Link"
          />
          <Card
            icon={<Briefcase size={16} />}
            title="Know an Industry Partner?"
            body="Consultants earn 1% of transaction fees for 12 months from referred venues."
            badge="1% Commission"
            cta="Apply to Partner"
            ctaOutlined
          />

          {/* Stats card */}
          <div className="rounded-[12px] bg-white p-4" style={{ border: "1px solid #e2e8f0" }}>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                { label: "Referrals Sent", val: "4", color: "#0f172a" },
                { label: "Confirmed", val: "2", color: "#0f172a" },
                { label: "Credits Earned", val: "$100", color: "#16a34a" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 600, marginTop: 2 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={copy}
              className="flex w-full items-center justify-center gap-2 rounded-[8px] py-2.5 transition active:scale-[0.99]"
              style={{ background: "#0f172a", color: "#ffffff", fontSize: 12, fontWeight: 700 }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy My Link"}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
