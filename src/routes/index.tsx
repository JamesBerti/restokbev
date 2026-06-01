import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AIInsightsPanel } from "@/components/restok/AIInsightsPanel";
import { CartDrawer } from "@/components/restok/CartDrawer";
import { OrderConfirmation } from "@/components/restok/OrderConfirmation";
import { ProductCard } from "@/components/restok/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { placeOrder } from "@/lib/orders.functions";
import {
  CATEGORIES,
  DELIVERY_FEE,
  PLATFORM_FEE_RATE,
  type Cart,
  type Product,
  type Retailer,
} from "@/lib/restok-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReStok — BC Wholesale Alcohol Ordering for Licensees" },
      { name: "description", content: "Order wholesale wine, beer & spirits from Vancouver's top retailers. LDB floor pricing, LCRB-licensed delivery, same-day to your venue." },
    ],
  }),
  component: Marketplace,
});

type DbProduct = {
  id: string; retailer_id: string; name: string; category: string;
  price: number; ldb_floor: number; stock: number; rating: number;
  reviews: number; img: string; badge: string | null;
  description: string; ai_trend: "up" | "down" | "flat"; ai_note: string;
};

function Marketplace() {
  const { user, roles, signOut } = useAuth();
  const [activeCat, setActiveCat] = useState("All");
  const [activeRetailer, setActiveRetailer] = useState("All Retailers");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [cart, setCart] = useState<Cart>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Load retailers + products and subscribe to realtime changes
  useEffect(() => {
    const load = async () => {
      const [{ data: rs }, { data: ps }] = await Promise.all([
        supabase.from("retailers").select("id, name, neighborhood, delivery_minutes").order("name"),
        supabase.from("products").select("*").order("name"),
      ]);
      const retailerList = (rs ?? []) as Retailer[];
      setRetailers(retailerList);
      const byId = new Map(retailerList.map((r) => [r.id, r]));
      setProducts(((ps ?? []) as DbProduct[]).map((p): Product => {
        const r = byId.get(p.retailer_id);
        return {
          id: p.id, name: p.name, category: p.category,
          retailer: r?.name ?? "—", retailer_id: p.retailer_id,
          price: Number(p.price), ldbFloor: Number(p.ldb_floor),
          stock: p.stock, delivery: `${r?.delivery_minutes ?? 60} min`,
          rating: Number(p.rating), reviews: p.reviews, img: p.img,
          badge: p.badge, description: p.description,
          aiTrend: p.ai_trend, aiNote: p.ai_note,
        };
      }));
    };
    void load();
    const ch = supabase.channel("products-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => { void load(); })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSubtotal = Object.entries(cart).reduce((s, [id, q]) => {
    const p = products.find((p) => p.id === id);
    return s + (p ? p.price * q : 0);
  }, 0);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchC = activeCat === "All" || p.category === activeCat;
      const matchR = activeRetailer === "All Retailers" || p.retailer === activeRetailer;
      const q = search.toLowerCase();
      const matchS = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchC && matchR && matchS;
    }).sort((a, b) => {
      if (sortBy === "popular") return b.reviews - a.reviews;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "delivery") return parseInt(a.delivery) - parseInt(b.delivery);
      return 0;
    });
  }, [products, activeCat, activeRetailer, search, sortBy]);

  const addToCart = (p: Product) => setCart((c) => ({ ...c, [p.id]: (c[p.id] || 0) + 1 }));
  const removeFromCart = (p: Product) => setCart((c) => {
    const n: Cart = { ...c, [p.id]: (c[p.id] || 1) - 1 };
    if (n[p.id] <= 0) delete n[p.id];
    return n;
  });
  const navigate = useNavigate();
  const placeOrderFn = useServerFn(placeOrder);
  const [placing, setPlacing] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const isLicensee = roles.some((r) => r.role === "licensee" && r.status === "approved");
  const isRetailer = roles.some((r) => r.role === "retailer");
  const isAdmin = roles.some((r) => r.role === "admin" && r.status === "approved");

  // Retailers belong on the merchant dashboard, not the marketplace
  useEffect(() => {
    if (isRetailer && !isLicensee && !isAdmin) navigate({ to: "/retailer", replace: true });
  }, [isRetailer, isLicensee, isAdmin, navigate]);

  const checkout = async () => {
    setCheckoutError(null);
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!isLicensee) {
      setCheckoutError("Only approved licensees can place orders. Sign up as a licensee to continue.");
      return;
    }
    const items = Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([product_id, qty]) => ({ product_id, qty }));
    if (!items.length) return;
    setPlacing(true);
    try {
      await placeOrderFn({ data: { items } });
      setConfirmedTotal(cartSubtotal + DELIVERY_FEE + cartSubtotal * PLATFORM_FEE_RATE);
      setCartOpen(false);
      setCart({});
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Couldn't place order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Dark ink nav */}
      <header className="sticky top-0 z-[100] bg-foreground/95 backdrop-blur supports-[backdrop-filter]:bg-foreground/90">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3 px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="flex h-4 w-4 flex-col items-center">
                <span className="h-[2px] w-4 rounded-sm bg-white" />
                <span className="h-[10px] w-[2px] bg-white" />
                <span className="-mt-[1px] h-[2px] w-3 rounded-sm bg-white" />
              </span>
            </span>
            <span className="text-[18px] font-extrabold tracking-tight text-white">
              <span className="opacity-[0.35]">Re</span>Stok
            </span>
          </Link>


          <div className="ml-auto flex items-center gap-2">
            <nav className="mr-2 hidden items-center gap-4 text-[12px] font-semibold md:flex">
              {user && <Link to="/orders" className="text-white/70 hover:text-white">My orders</Link>}
              {isRetailer && <Link to="/retailer" className="text-white/70 hover:text-white">Retailer</Link>}
              {isAdmin && <Link to="/admin" className="text-white/70 hover:text-white">Admin</Link>}
              {user ? (
                <button onClick={signOut} className="text-white/70 hover:text-white">Sign out</button>
              ) : (
                <Link to="/login" className="text-white/70 hover:text-white">Sign in</Link>
              )}
            </nav>

            <button
              onClick={() => {
                const el = document.getElementById("search-input");
                el?.focus();
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
              aria-label="Search"
            >
              🔍
            </button>

            <button
              onClick={() => setCartOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/90 hover:bg-white/10"
              aria-label="Cart"
            >
              <span className="text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="font-mono absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Search bar — light surface under nav */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-6 py-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface-muted px-4 py-2.5 focus-within:border-foreground">
            <span className="text-sm text-muted-foreground">🔍</span>
            <input
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products, producers, regions…"
              className="w-full border-none bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-sm text-muted-foreground hover:text-foreground">
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero — clean light */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1200px] px-6 pt-10 pb-8">
          <div className="font-mono mb-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--color-success-border)] bg-success-soft px-3 py-1.5">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-primary" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-success">Same-day delivery · Order by 2pm</span>
          </div>
          <h1 className="font-display text-[34px] leading-[1.1] text-foreground md:text-[52px]">
            BC's best beverages,<br />
            <span className="italic text-muted-foreground">at your door in under an hour.</span>
          </h1>
          <p className="mt-4 max-w-[520px] text-[14px] text-muted-foreground">
            Wholesale from Vancouver's top retailers. LDB floor pricing on every bottle. No middlemen, no markup.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { val: `${products.length}`, label: "PRODUCTS" },
              { val: "~45m", label: "AVG DELIVERY" },
              { val: String(retailers.length), label: "RETAILERS" },
              { val: "$0", label: "MARKUP" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-4 shadow-soft">
                <div className="font-display text-[26px] leading-none text-foreground">{s.val}</div>
                <div className="font-mono mt-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-6 py-6">
        <AIInsightsPanel cart={cart} products={products} category={activeCat} />

        {/* Category pills */}
        <div className="no-scrollbar -mx-6 mb-5 flex gap-2 overflow-x-auto px-6 pb-1">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setActiveCat(cat.label)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[10px] border px-[18px] py-[10px] text-[13px] font-semibold transition ${
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground hover:border-foreground hover:text-foreground"
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <select
            value={activeRetailer}
            onChange={(e) => setActiveRetailer(e.target.value)}
            className="font-mono cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-[11px] uppercase tracking-wider text-foreground outline-none hover:border-foreground"
          >
            <option>All Retailers</option>
            {retailers.map((r) => <option key={r.id}>{r.name}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-mono cursor-pointer rounded-lg border border-border bg-surface px-3 py-2 text-[11px] uppercase tracking-wider text-foreground outline-none hover:border-foreground"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low–High</option>
            <option value="price_desc">Price: High–Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
          <div className="font-mono ml-auto text-[11px] uppercase tracking-wider text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="mb-3.5 text-5xl">🔍</div>
            <div className="mb-2 text-base font-bold text-foreground">No products found</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={addToCart} onRemove={removeFromCart} />
            ))}
          </div>
        )}

        <footer className="mt-12 rounded-xl border border-border bg-surface-muted p-5">
          <p className="font-mono text-[10px] uppercase leading-relaxed tracking-wider text-muted-foreground">
            ReStok BC Wholesale · Licensed retailers only · LCRB compliant · LDB floor pricing · Platform fee 3.5% charged to retailer · support@restok.ca
          </p>
        </footer>
      </main>



      {cartOpen && (
        <>
          <div onClick={() => setCartOpen(false)} className="fixed inset-0 z-[999] bg-black/35" />
          <CartDrawer cart={cart} products={products} onAdd={addToCart} onRemove={removeFromCart}
            onClose={() => setCartOpen(false)} onCheckout={checkout} placing={placing} error={checkoutError} />
        </>
      )}

      {confirmedTotal !== null && (
        <OrderConfirmation total={confirmedTotal} onDone={() => setConfirmedTotal(null)} />
      )}
    </div>
  );
}
