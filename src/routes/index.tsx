import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Gift } from "lucide-react";
import { AIAlertBanner } from "@/components/restok/AIAlertBanner";
import { AIInsightsPanel } from "@/components/restok/AIInsightsPanel";
import { CartDrawer } from "@/components/restok/CartDrawer";
import { ReferralDrawer } from "@/components/restok/ReferralDrawer";
import { OrderConfirmation } from "@/components/restok/OrderConfirmation";
import { ProductCard } from "@/components/restok/ProductCard";
import { Wordmark } from "@/components/restok/Wordmark";
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
      <header className="bg-nav-navy sticky top-0 z-[100] shadow-soft">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-3.5 px-5">
          <Wordmark />

          <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 focus-within:border-white/40">
            <span className="text-base text-white/60">🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, categories..."
              className="w-full border-none bg-transparent text-[13px] text-white outline-none placeholder:text-white/50" />
            {search && <button onClick={() => setSearch("")} className="text-sm text-white/60">✕</button>}
          </div>

          <nav className="hidden items-center gap-3 text-xs font-semibold md:flex">
            {user && <Link to="/orders" className="text-white/70 hover:text-white">My orders</Link>}
            {isRetailer && <Link to="/retailer" className="text-white/70 hover:text-white">Retailer</Link>}
            {isAdmin && <Link to="/admin" className="text-white/70 hover:text-white">Admin</Link>}
            {user ? (
              <button onClick={signOut} className="text-white/70 hover:text-white">Sign out</button>
            ) : (
              <Link to="/login" className="text-white/70 hover:text-white">Sign in</Link>
            )}
          </nav>

          <button onClick={() => setCartOpen(true)}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2 text-[13px] font-bold transition ${cartCount > 0 ? "border-white bg-white text-[#0f1e3d]" : "border-white/20 bg-white/5 text-white hover:border-white/40"}`}>
            🛒
            {cartCount > 0 ? (
              <span>{cartCount} item{cartCount > 1 ? "s" : ""} · <strong>${cartSubtotal.toFixed(2)}</strong></span>
            ) : <span>Cart</span>}
          </button>
        </div>
      </header>

      <AIAlertBanner />

      <section
        className="px-5 py-4"
        style={{ background: "#eff6ff", borderTop: "1px solid #bfdbfe", borderBottom: "1px solid #bfdbfe" }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-around gap-4">
          {[
            { val: `${products.length}+`, label: "Products" },
            { val: "~45 min", label: "Avg delivery" },
            { val: String(retailers.length), label: "Retailers" },
            { val: "$0", label: "Markup" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div style={{ color: "#1a56db", fontWeight: 700, fontSize: "20px", lineHeight: 1 }}>{s.val}</div>
              <div style={{ color: "#64748b", fontWeight: 600, fontSize: "10px", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>


      <main className="mx-auto max-w-[1200px] px-5 py-5">
        <AIInsightsPanel cart={cart} products={products} category={activeCat} />

        <div className="-mx-1 mb-3.5 flex gap-2 overflow-x-auto px-1 pb-2">
          {CATEGORIES.map((cat) => {
            const active = activeCat === cat.label;
            return (
              <button key={cat.label} onClick={() => setActiveCat(cat.label)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition ${active ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-border bg-surface text-foreground hover:border-primary"}`}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            );
          })}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2.5">
          <select value={activeRetailer} onChange={(e) => setActiveRetailer(e.target.value)}
            className="cursor-pointer rounded-lg border-[1.5px] border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none">
            <option>All Retailers</option>
            {retailers.map((r) => <option key={r.id}>{r.name}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer rounded-lg border-[1.5px] border-border bg-surface px-3 py-1.5 text-xs font-semibold text-foreground outline-none">
            <option value="popular">Most Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="delivery">Fastest Delivery</option>
          </select>
          <div className="ml-auto text-xs font-medium text-muted-foreground">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="mb-3.5 text-5xl">🔍</div>
            <div className="mb-2 text-base font-bold text-foreground">No products found</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={addToCart} onRemove={removeFromCart} />
            ))}
          </div>
        )}

        <footer className="mt-10 rounded-xl border border-border bg-surface px-5 py-3.5 shadow-soft">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            <strong className="text-foreground">ReStok BC Wholesale Platform</strong> — Licensed retailers only. All transactions comply with LCRB regulations and LDB wholesale floor pricing. Delivery fulfilled by LCRB-licensed carriers. Recipient must present licensee ID on delivery. Platform fee of 3.5% charged to retailer on each settled order. Questions? support@restok.ca
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
