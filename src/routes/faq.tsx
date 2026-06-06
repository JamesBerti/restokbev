import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";
import { Wordmark } from "@/components/restok/Wordmark";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ReStok BC Wholesale Beverage Platform" },
      { name: "description", content: "Answers about ReStok for BC licensees, retailers, and partners — pricing, delivery, compliance, and onboarding." },
      { property: "og:title", content: "FAQ — ReStok" },
      { property: "og:description", content: "Common questions about BC's first AI-powered wholesale beverage procurement platform." },
    ],
  }),
  component: FaqPage,
});

type QA = { q: string; a: string };

const SECTIONS: { title: string; items: QA[] }[] = [
  {
    title: "For Licensees — Restaurants and Bars",
    items: [
      { q: "What is ReStok?", a: "ReStok is BC's first AI-powered wholesale beverage procurement platform for licensed restaurants and bars. It connects licensees directly to private retailers with live inventory, AI-powered best pricing, and same-day delivery to your back door. Browse, approve in one tap, and watch your order arrive in under 90 minutes." },
      { q: "Is ReStok legal to use in BC?", a: "Yes. ReStok operates under the BC government's licensee-to-licensee trial that launched May 2026, which allows licensed establishments to purchase directly from private liquor retailers. Every transaction on ReStok is fully compliant with LCRB regulations and LDB wholesale floor pricing requirements." },
      { q: "How much does ReStok cost for licensees?", a: "ReStok is free to join and free to use at the base tier. The Pro tier is $99 per month and includes full AI par intelligence, predictive reordering, spend analytics, and recurring order automation. All founding venues receive their first 90 days of Pro free." },
      { q: "How fast is delivery?", a: "Average delivery time in Metro Vancouver is under 90 minutes. You can track your order in real time from the moment it is confirmed." },
      { q: "How do I know I am getting the best price?", a: "ReStok's AI compares live pricing across every connected retailer in your area before presenting a recommendation. Every price is verified against the current LDB wholesale floor price. You always see what you are saving versus LDB pricing on every product." },
      { q: "What happens if the LDB has a strike or supply disruption?", a: "ReStok connects you to BC's network of private retailers who hold independent stock. A disruption to LDB distribution does not affect your ability to order through ReStok. This supply chain resilience is one of the core reasons the platform exists." },
      { q: "Can I set up recurring orders?", a: "Yes, Pro tier licensees can set up weekly, fortnightly, or monthly recurring orders with auto-approve or notify-to-approve settings. The AI monitors your consumption and adjusts suggested quantities automatically." },
    ],
  },
  {
    title: "For Retailers — Private Liquor Stores",
    items: [
      { q: "How does ReStok work for retailers?", a: "ReStok sends you wholesale orders from licensed restaurants and bars in your area. You receive instant notifications on any logged-in device when a new order arrives, confirm in one tap, and the order is picked up by a delivery driver. ReStok handles payment, invoicing, and compliance automatically." },
      { q: "What does it cost retailers to join?", a: "Free to join. A 3.5% platform fee is deducted from each settled order — this is charged on incremental new revenue that ReStok generates for you. There is no cost unless you receive an order. Retailer Pro is $99 per month and includes priority placement, demand forecasting, and featured screen rotation." },
      { q: "Does ReStok integrate with my POS system?", a: "ReStok works with AmberPOS, Lightspeed, and most major retail POS systems through direct integration or CSV export. Retailers on any system can also manage their catalog directly in the ReStok merchant dashboard." },
      { q: "How are invoices handled?", a: "ReStok automatically generates a fully LCRB-compliant invoice for every transaction including both party licence numbers, itemised products, LDB floor price references, and a unique invoice number. No manual paperwork required." },
      { q: "What is the Retailer Pro placement feature?", a: "Retailer Pro gives your products priority placement in AI search results when your pricing is competitive. The integrity rule is explicit — promoted placement only activates when your price is within range of the best available. ReStok never shows a more expensive product first." },
    ],
  },
  {
    title: "For Everyone",
    items: [
      { q: "How does the referral programme work?", a: "Licensees who refer another licensee earn $50 order credit when the referred venue places their first order. Retailers who refer another retailer get their transaction fee reduced from 3.5% to 2.5% for 90 days. Cross-referrals and B2B affiliate partnerships are also available — see the Refer and Earn section in your account." },
      { q: "Is my data secure?", a: "All transaction records are encrypted and retained indefinitely for LCRB audit compliance. Payment processing is handled by Stripe, which is PCI-DSS compliant. ReStok never sells user data." },
      { q: "What is the regulatory basis for ReStok?", a: "ReStok operates under the BC licensee-to-licensee trial launched May 29 2026. The BC government's existing BCL provincial retailers also have independent legal authority to conduct these transactions, providing a permanent fallback structure independent of the trial." },
      { q: "How do I get started?", a: "Download the app or visit restok.ca, choose your account type — licensee or retailer — and complete registration including your LCRB licence number. Founding accounts receive 90 days of Pro access free. No credit card required to start." },
    ],
  },
];

function Accordion({ q, a }: QA) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-[14px] font-bold text-foreground">{q}</span>
        {open ? <Minus size={18} className="shrink-0 text-muted-foreground" /> : <Plus size={18} className="shrink-0 text-muted-foreground" />}
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          <p className="pb-4 pr-8 text-[13px]" style={{ color: "#64748b", lineHeight: 1.75 }}>{a}</p>
        </div>
      </div>
    </div>
  );
}

function FaqPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-nav-navy sticky top-0 z-[100] shadow-soft">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3.5 px-5">
          <Wordmark />
          <div className="ml-auto flex items-center gap-3 text-xs font-semibold">
            <Link to="/" className="text-white/70 hover:text-white">Marketplace</Link>
            <Link to="/login" className="text-white/70 hover:text-white">Sign in</Link>
          </div>
        </div>
      </header>

      <section style={{ background: "#0f1e3d" }} className="px-5 py-16">
        <div className="mx-auto max-w-[900px]">
          <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-emerald-300">
            Got Questions
          </span>
          <h1
            className="mt-4 text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "44px", lineHeight: 1.1, letterSpacing: "-1px" }}
          >
            Everything you need to know about ReStok
          </h1>
          <p className="mt-4 text-[15px] text-white/60">
            Answers to the most common questions from licensees, retailers, and partners.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[900px] px-5 py-12">
        {SECTIONS.map((sec) => (
          <section key={sec.title} className="mb-10">
            <h2
              className="mb-3"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 700, fontSize: "18px", color: "#1a56db" }}
            >
              {sec.title}
            </h2>
            <div className="rounded-xl border border-border bg-surface px-5">
              {sec.items.map((qa) => <Accordion key={qa.q} {...qa} />)}
            </div>
          </section>
        ))}
      </main>

      <section style={{ background: "#0f1e3d" }} className="px-5 py-16">
        <div className="mx-auto max-w-[900px] text-center">
          <h2
            className="text-white"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontWeight: 800, fontSize: "32px", letterSpacing: "-0.5px" }}
          >
            Ready to get started
          </h2>
          <p className="mt-3 text-[15px] text-white/60">Join BC's first wholesale beverage marketplace</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="rounded-xl px-6 py-3 text-[14px] font-bold text-white shadow-glow"
              style={{ background: "#16a34a" }}
            >
              Sign Up as a Licensee
            </Link>
            <Link
              to="/signup"
              className="rounded-xl border border-white/40 bg-transparent px-6 py-3 text-[14px] font-bold text-white hover:bg-white/10"
            >
              Sign Up as a Retailer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
