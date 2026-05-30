import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AIInsightsPanel } from "@/components/restok/AIInsightsPanel";
import { CartDrawer } from "@/components/restok/CartDrawer";
import { OrderConfirmation } from "@/components/restok/OrderConfirmation";
import { ProductCard } from "@/components/restok/ProductCard";
import {
  CATEGORIES,
  DELIVERY_FEE,
  PLATFORM_FEE_RATE,
  PRODUCTS,
  RETAILERS,
  type Cart,
  type Product,
} from "@/lib/restok-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReStok — BC Wholesale Alcohol Ordering for Licensees" },
      {
        name: "description",
        content:
          "Order wholesale wine, beer & spirits from BC's top retailers. LDB floor pricing, LCRB-licensed delivery, same-day to your venue.",
      },
      {
        property: "og:title",
        content: "ReStok — BC Wholesale Alcohol Ordering",
      },
      {
        property: "og:description",
        content:
          "Wholesale alcohol ordering for BC restaurants and bars. Same-day delivery from local retailers.",
      },
    ],
  }),
  component: Marketplace,
});

function Marketplace() {
  const [activeCat, setActiveCat] = useState("All");
  const [activeRetailer, setActiveRetailer] = useState("All Retailers");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((s, [id, q]) => {
    const p = PRODUCTS.find((p) => p.id === parseInt(id));
    return s + (p ? p.price * q : 0);
  }, 0);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchC = activeCat === "All" || p.category === activeCat;
      const matchR =
        activeRetailer === "All Retailers" || p.retailer === activeRetailer;
      const q = search.toLowerCase();
      const matchS =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      return matchC && matchR && matchS;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.reviews - a.reviews;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "delivery")
        return parseInt(a.delivery) - parseInt(b.delivery);
      return 0;
    });
  }, [activeCat, activeRetailer, search, sortBy]);

  const addToCart = (p: Product) =>
    setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
  const removeFromCart = (p: Product) =>
    setCart((c) => {
      const n: Cart = { ...c, [p.id]: (c[p.id] || 1) - 1 };
      if (n[p.id] <= 0) delete n[p.id];
      return n;
    });
  const checkout = () => {
    const total =
      cartSubtotal + DELIVERY_FEE + cartSubtotal * PLATFORM_FEE_RATE;
    setConfirmedTotal(total);
    setCartOpen(false);
    setCart({});
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-[100] border-b border-border bg-surface shadow-soft">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3.5 px-5">
          <div className="flex shrink-0 items-center gap-2">
            <div className="bg-brand-gradient rounded-lg px-3 py-1 text-[15px] font-black tracking-tight text-white">
              ReStok
            </div>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:inline">
              BC Wholesale
            </span>
          </div>

          <div className="flex flex-1 items-center gap-2 rounded-xl border-[1.5px] border-border bg-background px-3.5 py-2 transition-colors focus-within:border-primary">
            <span className="text-base text-muted-foreground">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, categories..."
              className="w-full border-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-sm text-muted-foreground"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 rounded-lg border border-success/20 bg-success-soft px-2.5 py-1 text-xs text-muted-foreground md:flex">
            <span className="text-[10px] text-success">●</span> O'Rourke Family
            Estate
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border-[1.5px] px-4 py-2 text-[13px] font-bold transition ${
              cartCount > 0
                ? "border-primary bg-primary text-primary-foreground shadow-glow"
                : "border-border bg-surface text-foreground hover:border-primary"
            }`}
          >
            🛒
            {cartCount > 0 ? (
              <span>
                {cartCount} item{cartCount > 1 ? "s" : ""} ·{" "}
                <strong>${cartSubtotal.toFixed(2)}</strong>
              </span>
            ) : (
              <span>Cart</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-hero-gradient relative overflow-hidden px-5 py-10">
        <div className="pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full bg-primary/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-8 h-56 w-56 rounded-full bg-teal/10" />
        <div className="pointer-events-none absolute right-40 top-1/2 hidden -translate-y-1/2 select-none text-[90px] leading-none opacity-[0.06] md:block">
          🍷🥂🍾🥃
        </div>

        <div className="relative z-[1] mx-auto max-w-[1200px]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex-1 basis-[340px]">
              <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1">
                <span className="animate-glow-pulse inline-block h-[7px] w-[7px] rounded-full bg-teal shadow-[0_0_6px_oklch(0.7_0.13_175)]" />
                <span className="text-[11px] font-bold tracking-wider text-white/90">
                  SAME-DAY DELIVERY AVAILABLE
                </span>
              </div>

              <h1 className="mb-3 text-[32px] font-black leading-[1.15] tracking-tight text-white md:text-[40px]">
                BC's best beverages,
                <br />
                <span className="text-gradient-brand">
                  at your door in under an hour.
                </span>
              </h1>

              <p className="mb-5 max-w-[420px] text-sm leading-relaxed text-white/70">
                Order from Okanagan's top retailers before 2pm and get your
                stock delivered same-day. LDB wholesale floor pricing on every
                product. No middlemen. No markups.
              </p>

              <div className="flex flex-wrap gap-2.5">
                {[
                  "LDB compliant pricing",
                  "LCRB licensed carriers",
                  "No hidden fees",
                ].map((t) => (
                  <div
                    key={t}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1"
                  >
                    <span className="text-[11px] font-extrabold text-teal">
                      ✓
                    </span>
                    <span className="text-[11px] font-medium text-white/85">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                {
                  val: "33+",
                  label: "Products",
                  sub: "across all categories",
                  icon: "📦",
                },
                {
                  val: "~45 min",
                  label: "Avg delivery",
                  sub: "order before 2pm",
                  icon: "🚗",
                },
                {
                  val: "4",
                  label: "Local retailers",
                  sub: "Okanagan sourced",
                  icon: "🏪",
                },
                {
                  val: "$0",
                  label: "Markup",
                  sub: "LDB floor guaranteed",
                  icon: "💰",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="min-w-[100px] rounded-2xl border border-white/15 bg-white/10 px-4 py-3.5 text-center backdrop-blur"
                >
                  <div className="mb-1 text-xl">{s.icon}</div>
                  <div className="text-[22px] font-black leading-none text-white">
                    {s.val}
                  </div>
                  <div className="mt-0.5 text-[11px] font-bold text-white/90">
                    {s.label}
                  </div>
                  <div className="mt-0.5 text-[10px] text-white/50">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-5 py-5">
        <AIInsightsPanel cart={cart} />

        {/* Categories */}
        <div className="-mx-1 mb-3.5 flex gap-2 overflow-x-auto px-1 pb-2">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCat(cat.label)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-border bg-surface text-foreground hover:border-primary"
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <select
            value={activeRetailer}
            onChange={(e) => setActiveRetailer(e.target.value)}
            className="cursor-pointer rounded-lg border-[1.5px] border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none"
          >
            {RETAILERS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded-lg border-[1.5px] border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>

          <div className="flex flex-wrap gap-1.5">
            {activeCat !== "All" && (
              <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
                {activeCat}
                <button
                  onClick={() => setActiveCat("All")}
                  className="text-[13px] leading-none"
                  aria-label="Clear category"
                >
                  ✕
                </button>
              </div>
            )}
            {activeRetailer !== "All Retailers" && (
              <div className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary-dark">
                {activeRetailer}
                <button
                  onClick={() => setActiveRetailer("All Retailers")}
                  className="text-[13px] leading-none"
                  aria-label="Clear retailer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="ml-auto text-xs font-medium text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="mb-3.5 text-5xl">🔍</div>
            <div className="mb-2 text-base font-bold text-foreground">
              No products found
            </div>
            <div className="mb-5 text-[13px]">
              Try a different search or category
            </div>
            <button
              onClick={() => {
                setSearch("");
                setActiveCat("All");
                setActiveRetailer("All Retailers");
              }}
              className="rounded-xl bg-primary px-5 py-2 text-[13px] font-bold text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                qty={cart[p.id] || 0}
                onAdd={addToCart}
                onRemove={removeFromCart}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 rounded-xl border border-border bg-surface px-5 py-3.5 shadow-soft">
          <div className="text-[10px] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">
              ReStok BC Wholesale Platform
            </strong>{" "}
            — Licensed retailers only. All transactions comply with LCRB
            regulations and LDB wholesale floor pricing. Delivery fulfilled by
            LCRB-licensed carriers. Recipient must present licensee ID on
            delivery. Platform fee of 3.5% charged to retailer on each
            settled order. Questions? support@restok.ca
          </div>
        </footer>
      </main>

      {cartOpen && (
        <>
          <div
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-[999] bg-black/35"
          />
          <CartDrawer
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onClose={() => setCartOpen(false)}
            onCheckout={checkout}
          />
        </>
      )}

      {confirmedTotal !== null && (
        <OrderConfirmation
          total={confirmedTotal}
          onDone={() => setConfirmedTotal(null)}
        />
      )}
    </div>
  );
}
