import { Link } from "@tanstack/react-router";
import { ChevronRight, LayoutGrid, CheckCheck, Truck } from "lucide-react";

const STEPS = [
  {
    icon: LayoutGrid,
    bg: "#1a56db",
    label: "Browse",
    sub: "Live inventory from BC private retailers",
  },
  {
    icon: CheckCheck,
    bg: "#16a34a",
    label: "Approve",
    sub: "Best price found. Your retailer confirms in under 30 minutes.",
  },
  {
    icon: Truck,
    bg: "#0f1e3d",
    label: "Delivered",
    sub: "Same-day to your back door",
  },
];

export function HowItWorks() {
  return (
    <section
      className="w-full"
      style={{ background: "#f8fafc", padding: "14px 16px" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex flex-1 items-center gap-2">
                <div className="flex flex-1 items-start gap-2">
                  <div
                    className="flex shrink-0 items-center justify-center"
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: s.bg,
                    }}
                  >
                    <Icon size={14} color="#ffffff" strokeWidth={2.25} />
                  </div>
                  <div className="min-w-0">
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#111318", lineHeight: 1.2 }}>
                      {s.label}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.35, marginTop: 1 }}>
                      {s.sub}
                    </div>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={14} color="#94a3b8" strokeWidth={2} className="shrink-0" />
                )}
              </div>
            );
          })}
        </div>
        <div
          className="mt-3 text-center"
          style={{ fontSize: 10.5, color: "#64748b" }}
        >
          Built on BC's 2026 licensee-to-licensee regulation —{" "}
          <Link
            to="/about"
            className="font-semibold underline hover:text-foreground"
            style={{ color: "#0f1e3d" }}
          >
            see how it works
          </Link>
          .
        </div>
      </div>
    </section>
  );
}
