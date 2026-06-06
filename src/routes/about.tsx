import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, TrendingUp, AlertTriangle, Search, CheckCheck, MapPin, Store } from "lucide-react";
import { Wordmark } from "@/components/restok/Wordmark";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About ReStok — BC's First Wholesale Beverage Marketplace" },
      { name: "description", content: "Built by a BC wine industry insider. ReStok connects 10,000+ licensees with 700+ private retailers — live inventory, AI pricing, 90-minute delivery." },
      { property: "og:title", content: "About ReStok — Built for the industry by the industry" },
      { property: "og:description", content: "BC's first AI-powered wholesale beverage marketplace, built under the May 2026 licensee-to-licensee trial." },
    ],
  }),
  component: AboutPage,
});

const STATS = [
  { v: "10,000+", l: "BC Licensees" },
  { v: "700+", l: "Private Retailers" },
  { v: "$10K+", l: "Saved Per Venue Per Year" },
  { v: "90 Min", l: "Average Delivery" },
];

const PROBLEMS = [
  { icon: Phone, title: "Manual and fragmented", desc: "Phone calls, faxes, and spreadsheets across dozens of retailers. Every order is a logistics project." },
  { icon: TrendingUp, title: "Systematically overpaying", desc: "Without live price comparison, BC venues consistently pay above the best available wholesale price.", badge: "$103M collective BC overpayment annually" },
  { icon: AlertTriangle, title: "Running dry mid-service", desc: "No live stock visibility means weekend stockouts, missed covers, and frustrated guests." },
];

const STEPS = [
  { icon: Search, label: "Browse", desc: "Live inventory from 700+ BC retailers" },
  { icon: CheckCheck, label: "Approve", desc: "AI finds the best price. One tap to confirm." },
  { icon: MapPin, label: "Track", desc: "Watch your driver in real time from store to door." },
  { icon: Store, label: "Delivered", desc: "At your back door in under 90 minutes." },
];

const WHY_NOW = [
  { title: "First mover — weeks not months", desc: "The May 2026 trial just opened. We were ready on day one — competitors are months away." },
  { title: "Zero infrastructure existed", desc: "No incumbent platform, no legacy player. We are building the rails the entire industry will run on." },
  { title: "Compliance built in from day one", desc: "Every transaction is LCRB-compliant. LDB floor pricing enforced. Audit trails automatic." },
  { title: "Data moat from transaction one", desc: "Every order trains our AI on real BC beverage demand. The advantage compounds." },
];

const CREDS = ["Sommelier", "Winery Operator", "Wine Buyer", "Trade Sales", "Okanagan BC"];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#1a56db" }}>
      {children}
    </span>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-3 text-foreground" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "34px", lineHeight: 1.15, letterSpacing: "-0.6px" }}>
      {children}
    </h2>
  );
}

function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-nav-navy sticky top-0 z-[100] shadow-soft">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3.5 px-5">
          <Wordmark />
          <div className="ml-auto flex items-center gap-3 text-xs font-semibold">
            <Link to="/" className="text-white/70 hover:text-white">Marketplace</Link>
            <Link to="/faq" className="text-white/70 hover:text-white">FAQ</Link>
            <Link to="/login" className="text-white/70 hover:text-white">Sign in</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-20" style={{ background: "#0f1e3d" }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #1a56db 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #16a34a 0%, transparent 70%)" }}
        />
        <div className="relative mx-auto max-w-[1100px]">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            BC's First Wholesale Beverage Marketplace
          </span>
          <h1 className="mt-5 text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "52px", lineHeight: 1.05, letterSpacing: "-1.2px" }}>
            Built for the industry<br />by the industry.
          </h1>
          <p className="mt-5 max-w-[680px] text-[16px] text-white/65" style={{ lineHeight: 1.65 }}>
            ReStok was built by a BC wine industry insider with over a decade on every side of the trade — from the cellar to the floor to the sales call.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/5 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l} className="bg-[#0f1e3d] p-5">
                <div className="text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "28px", letterSpacing: "-0.5px" }}>{s.v}</div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-white/55">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="px-5 py-20" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>The Problem</SectionLabel>
          <H2>The industry still runs on phone calls.</H2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="rounded-xl border border-border bg-surface p-6 shadow-soft">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: "#1a56db" }}>
                    <Icon size={20} color="#ffffff" strokeWidth={2} />
                  </div>
                  <div className="mt-4 text-[16px] font-bold text-foreground">{p.title}</div>
                  <p className="mt-2 text-[13px]" style={{ color: "#64748b", lineHeight: 1.65 }}>{p.desc}</p>
                  {p.badge && (
                    <div className="mt-4 inline-block rounded-md px-3 py-1.5 text-[11px] font-bold" style={{ background: "#dcfce7", color: "#15803d" }}>
                      {p.badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>How It Works</SectionLabel>
          <H2>As easy as ordering dinner to your door.</H2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-surface p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: i === 3 ? "#16a34a" : "#1a56db" }}>
                      <Icon size={18} color="#ffffff" strokeWidth={2.25} />
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Step {i + 1}</div>
                  </div>
                  <div className="mt-4 text-[16px] font-bold text-foreground">{s.label}</div>
                  <p className="mt-1.5 text-[13px]" style={{ color: "#64748b", lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="px-5 py-20" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Why Now</SectionLabel>
          <H2>A door opened that has never been open before.</H2>
          <p className="mt-5 max-w-[760px] text-[15px]" style={{ color: "#64748b", lineHeight: 1.7 }}>
            On May 29 2026 the BC government launched a licensee-to-licensee trial that for the first time allows licensed restaurants and bars to purchase wholesale directly from private liquor retailers. A century-old market structure changed overnight. ReStok exists to build the infrastructure that change demands.
          </p>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {WHY_NOW.map((w) => (
              <div key={w.title} className="rounded-xl border border-border bg-surface p-6 shadow-soft">
                <div className="text-[16px] font-bold text-foreground">{w.title}</div>
                <p className="mt-2 text-[13px]" style={{ color: "#64748b", lineHeight: 1.65 }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel>Pricing</SectionLabel>
          <H2>Simple pricing. Both sides of the marketplace.</H2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
              <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Licensee Free Tier</div>
              <div className="mt-3 text-foreground" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "36px", letterSpacing: "-0.5px" }}>$0<span className="text-[14px] font-semibold" style={{ color: "#64748b" }}>/mo</span></div>
              <p className="mt-3 text-[13px]" style={{ color: "#64748b", lineHeight: 1.6 }}>Full marketplace access. Live inventory. LDB floor pricing. Pay-as-you-go.</p>
            </div>
            <div className="rounded-xl border-2 p-6 shadow-glow" style={{ borderColor: "#16a34a", background: "#f0fdf4" }}>
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#15803d" }}>Licensee Pro</div>
                <div className="rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white" style={{ background: "#16a34a" }}>First 90 days free</div>
              </div>
              <div className="mt-3 text-foreground" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "36px", letterSpacing: "-0.5px" }}>$99<span className="text-[14px] font-semibold" style={{ color: "#64748b" }}>/mo</span></div>
              <p className="mt-3 text-[13px]" style={{ color: "#475569", lineHeight: 1.6 }}>AI par intelligence, predictive reordering, spend analytics, recurring orders.</p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-6 shadow-soft">
              <div className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "#64748b" }}>Retailer</div>
              <div className="mt-3 text-foreground" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "36px", letterSpacing: "-0.5px" }}>3.5%<span className="text-[14px] font-semibold" style={{ color: "#64748b" }}>/order</span></div>
              <p className="mt-3 text-[13px]" style={{ color: "#64748b", lineHeight: 1.6 }}>No monthly fee. Charged only on settled incremental revenue ReStok delivers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="px-5 py-20" style={{ background: "#f8fafc" }}>
        <div className="mx-auto max-w-[900px]">
          <SectionLabel>The Founder</SectionLabel>
          <H2>Built from the inside.</H2>
          <div className="mt-10 rounded-2xl border border-border bg-surface p-8 shadow-soft md:p-10">
            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-white" style={{ background: "#0f1e3d", fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "26px" }}>
                JB
              </div>
              <div>
                <div className="text-[20px] font-bold text-foreground">James Berti</div>
                <div className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.15em]" style={{ color: "#1a56db" }}>Founder ReStok</div>
              </div>
            </div>
            <p className="mt-6 text-[14px]" style={{ color: "#475569", lineHeight: 1.75 }}>
              Over a decade in the Canadian wine industry as a Sommelier, wine buyer, winery operator, and in sales — every side of the trade that ReStok is built to serve.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CREDS.map((c) => (
                <span key={c} className="rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-foreground">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20" style={{ background: "#0f1e3d" }}>
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "36px", letterSpacing: "-0.6px" }}>
            Ready to reimagine your beverage program?
          </h2>
          <p className="mt-4 text-[15px] text-white/65">Free to start. No credit card required.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/signup" className="rounded-xl px-6 py-3 text-[14px] font-bold text-white shadow-glow" style={{ background: "#16a34a" }}>
              Sign up as a Licensee
            </Link>
            <Link to="/signup" className="rounded-xl border border-white/40 bg-transparent px-6 py-3 text-[14px] font-bold text-white hover:bg-white/10">
              Sign up as a Retailer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
