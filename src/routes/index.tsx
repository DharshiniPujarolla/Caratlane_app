import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Bell, ChevronDown, Heart, MapPin, Search, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryCircle, OfferCard, TileCard } from "@/components/Cards";
import { SectionHeader } from "@/components/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import SplashScreen from "@/components/SplashScreen";
import lumiauraImg from "@/assets/brand-lumiaura.jpg";
import shayaImg from "@/assets/brand-shaya.jpg";
import { DailySparkModal } from "@/components/DailySparkModal";
import { StreakBadge } from "@/components/StreakBadge";
import { BottomNav } from "@/components/BottomNav";
import { ConciergeFab } from "@/components/ConciergeFab";

import {
  categories,
  collections,
  findProduct,
  images,
  occasionsList,
  offers,
  priceBuckets,
  products,
} from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LumiAura — Everyday Diamond & Gold Jewellery" },
      {
        name: "description",
        content:
          "Discover trending collections, new arrivals and best sellers in diamond and gold jewellery, crafted for everyday luxury.",
      },
      { property: "og:title", content: "LumiAura — Everyday Diamond & Gold Jewellery" },
      {
        property: "og:description",
        content: "Trending collections, new arrivals and best sellers in fine jewellery.",
      },
    ],
  }),
  component: Index,
});

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 lg:px-8 pb-1">
      {children}
    </div>
  );
}

function BrandsSection() {
  return (
    <div id="brands-section" className="flex min-h-[100svh] flex-col justify-center gap-4 px-4 py-10">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        Choose your world
      </p>

      <a
        href="#home-content"
        className="brand-card group relative block h-[38svh] overflow-hidden rounded-3xl shadow-float"
      >
        <img
          src={lumiauraImg}
          alt="LumiAura diamond and gold jewellery"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-wide text-primary-foreground">
              LumiAura
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
              Diamond & Gold
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-float">
            <ArrowRight size={18} />
          </span>
        </div>
      </a>

      <Link
        to="/shaya"
        className="brand-card group relative block h-[38svh] overflow-hidden rounded-3xl shadow-float"
      >
        <img
          src={shayaImg}
          alt="SHAYA silver jewellery for best friends"
          width={1200}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-active:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.25_0.06_200_/_0.85)] via-[oklch(0.25_0.06_200_/_0.25)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-[0.2em] text-primary-foreground">
              SHAYA
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-primary-foreground/85">
              Twin With Your Bestie
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-primary-foreground shadow-float">
            <ArrowRight size={18} />
          </span>
        </div>
      </Link>
    </div>
  );
}

function Index() {
  const navigate = useNavigate();
  const recent = useStore((s) => s.recentlyViewed);
  const cart = useStore((s) => s.cart);
  const wish = useStore((s) => s.wishlist.length);

  const [showBottomNav, setShowBottomNav] = useState(false);
  const [showLumiAIPopup, setShowLumiAIPopup] = useState(false);
  const lumiAIPopupTimeout = useRef<number | null>(null);
  const lumiAIPopupReshowTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBottomNav(true);
      } else {
        setShowBottomNav(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    lumiAIPopupTimeout.current = window.setTimeout(() => {
      setShowLumiAIPopup(true);
    }, 2500);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (lumiAIPopupTimeout.current) window.clearTimeout(lumiAIPopupTimeout.current);
      if (lumiAIPopupReshowTimeout.current) window.clearTimeout(lumiAIPopupReshowTimeout.current);
    };
  }, []);

  const handleCloseLumiAIPopup = () => {
    setShowLumiAIPopup(false);

    if (lumiAIPopupReshowTimeout.current) {
      window.clearTimeout(lumiAIPopupReshowTimeout.current);
    }

    lumiAIPopupReshowTimeout.current = window.setTimeout(() => {
      setShowLumiAIPopup(true);
    }, 45000);
  };

  const trending = products.slice(0, 6);
  const newArrivals = products.filter((p) => p.tags.includes("New Arrival")).slice(0, 6);
  const bestSellers = products.filter((p) => p.tags.includes("Best Seller")).slice(0, 6);
  const recentProducts = recent.map(findProduct).filter(Boolean);
  const continueItem = cart[0] ? findProduct(cart[0].id) : undefined;
  const signatureProducts = products
    .filter((product) => ["Necklaces", "Earrings", "Pendants", "Rings"].includes(product.category))
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl">
      <SplashScreen />
      <DailySparkModal />
      <BrandsSection />

      <div id="home-content" className="space-y-7 lg:space-y-10 pb-24">
        <header className="glass sticky top-0 z-40 space-y-3 px-4 lg:px-8 pb-3 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex flex-col">
                <h1 className="font-display text-3xl font-bold text-primary">
                  LumiAura
                </h1>
                <span className="text-xs text-muted-foreground">
                  Fine Diamond & Gold Jewellery
                </span>
              </Link>

              <button className="press flex items-center gap-1.5">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm font-semibold">Chennai</span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              <StreakBadge />

              <Link
                to="/wishlist"
                className="press relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
              >
                <Heart size={18} />
                {wish > 0 && (
                  <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </Link>

              <button className="press relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <Bell size={18} />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate({ to: "/search" })}
            className="press flex w-full items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-2.5 text-left"
          >
            <Search size={16} className="text-muted-foreground" />
            <span className="text-[13px] text-muted-foreground">
              Search for rings, earrings, gold chains…
            </span>
          </button>
        </header>

        <BannerCarousel />

        <section className="px-4">
          <Link
            to="/lumisignature"
            className="press group block overflow-hidden rounded-[40px] bg-gradient-to-br from-purple-950 via-fuchsia-700 to-pink-500 p-6 shadow-[0_40px_120px_rgba(131,58,180,0.25)] transition duration-300 hover:-translate-y-1"
          >
            <div className="relative grid h-[240px] gap-4 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top_left,_rgba(255,214,165,0.15),_transparent_34%),radial-gradient(circle_at_bottom_right,_rgba(255,237,192,0.12),_transparent_35%),linear-gradient(135deg,#3f1456,#8b5cf6_45%,#ec4899)] p-6 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:grid-cols-[1.1fr_0.9fr] lg:p-8">
              <div className="flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-100 backdrop-blur">
                    ✨ LumiSignature
                  </span>
                  <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                    Discover Your Jewellery DNA
                  </h2>
                  <p className="max-w-lg text-sm leading-6 text-white/85 sm:text-base">
                    Unlock a premium jewellery collection curated for your signature style through a luxurious AI styling experience.
                  </p>
                </div>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-amber-200 to-white/90 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_14px_45px_rgba(249,207,37,0.28)] transition duration-300 group-hover:brightness-110">
                  Discover My DNA
                  <ArrowRight size={16} className="text-slate-950" />
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-x-4 top-4 h-36 rounded-full bg-amber-300/20 blur-3xl" />
                <div className="relative h-full w-full max-w-[300px]">
                  {signatureProducts.map((product, index) => {
                    const positions = [
                      'absolute left-0 top-6 h-36 w-36',
                      'absolute right-0 top-0 h-44 w-44',
                      'absolute left-14 bottom-4 h-28 w-28',
                    ];

                    const sizes = [
                      'translate-z-0',
                      'translate-z-10',
                      'translate-z-0',
                    ];

                    return (
                      <div
                        key={product.id}
                        className={`${positions[index]} overflow-hidden rounded-[30px] border border-white/15 bg-white/10 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl`}                        
                        style={{ animation: `floatY 8s ease-in-out ${index * 0.12}s infinite` }}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                        <img
                          src={product.image}
                          alt={product.name}
                          className="relative h-full w-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Link>
        </section>

        <section>
          <SectionHeader title="Shop by Category" to="/categories" />
          <Row>
            {categories.map((c) => (
              <CategoryCircle key={c.slug} {...c} />
            ))}
          </Row>
        </section>

        <section>
          <SectionHeader title="Trending Collections" caption="Loved by 2 lakh+ customers" />
          <Row>
            {collections.map((c) => (
              <TileCard
                key={c.id}
                title={c.name}
                caption={`${c.count} designs`}
                image={c.image}
                to="/category/diamond"
              />
            ))}
          </Row>
        </section>

        <section>
          <SectionHeader title="New Arrivals" caption="Fresh off the bench" to="/categories" />
          <Row>
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} wide />
            ))}
          </Row>
        </section>

        <section className="px-4">
          <div className="overflow-hidden rounded-3xl gradient-primary p-5 text-primary-foreground">
            <Sparkles size={20} className="text-gold-soft" />
            <h3 className="mt-2 text-lg font-semibold leading-snug">
              Zero making charges
              <br /> on 22KT gold this week
            </h3>
            <p className="mt-1 text-xs opacity-85">Ends Sunday · Use code GOLDZERO</p>
            <Link
              to="/category/$slug"
              params={{ slug: "gold" }}
              className="press mt-3 inline-flex rounded-full bg-background px-4 py-2 text-xs font-semibold text-primary"
            >
              Shop Gold Jewellery
            </Link>
          </div>
        </section>

        <section>
          <SectionHeader title="Best Sellers" caption="Restocked this week" />
          <Row>
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} wide />
            ))}
          </Row>
        </section>

        <section>
          <SectionHeader title="Shop by Occasion" />
          <Row>
            {occasionsList.map((o) => (
              <TileCard key={o.name} title={o.name} image={o.image} to="/categories" />
            ))}
          </Row>
        </section>

        <section>
          <SectionHeader title="Shop by Price" />
          <Row>
            {priceBuckets.map((b) => (
              <Link
                key={b.label}
                to="/category/$slug"
                params={{ slug: "diamond" }}
                className="press flex h-20 w-[130px] shrink-0 flex-col justify-center rounded-2xl border border-border bg-card px-3 shadow-soft"
              >
                <span className="text-[13px] font-semibold">{b.label}</span>
                <span className="text-[11px] text-[#8C7A70]">Explore designs</span>
              </Link>
            ))}
          </Row>
        </section>

        <section className="grid grid-cols-2 gap-3 px-4">
          <Link
            to="/category/$slug"
            params={{ slug: "gold" }}
            className="press relative h-36 overflow-hidden rounded-2xl"
          >
            <img src={images.hero2} alt="Gold jewellery" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-3 left-3 text-sm font-semibold text-primary-foreground">
              Gold Jewellery
            </p>
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "diamond" }}
            className="press relative h-36 overflow-hidden rounded-2xl"
          >
            <img src={images.hero1} alt="Diamond jewellery" loading="lazy" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-3 left-3 text-sm font-semibold text-primary-foreground">
              Diamond Jewellery
            </p>
          </Link>
        </section>

        <section>
          <SectionHeader title="Offers & Coupons" caption="Applied at checkout" />
          <Row>
            {offers.map((o) => (
              <OfferCard key={o.code} {...o} />
            ))}
          </Row>
        </section>

        <section>
          <SectionHeader title="Recommended for you" caption="Based on your browsing" />
          <Row>
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} wide />
            ))}
          </Row>
        </section>

        {recentProducts.length > 0 && (
          <section>
            <SectionHeader title="Recently Viewed" />
            <Row>
              {recentProducts.map((p) => p && <ProductCard key={p.id} product={p} wide />)}
            </Row>
          </section>
        )}

        {continueItem && (
          <section className="px-4">
            <SectionHeader title="Continue Shopping" />
            <Link
              to="/cart"
              className="press flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft"
            >
              <img
                src={continueItem.image}
                alt={continueItem.name}
                loading="lazy"
                className="h-14 w-14 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{continueItem.name}</p>
                <p className="text-[11px] text-muted-foreground">Still in your bag</p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
                Resume
              </span>
            </Link>
          </section>
        )}

        <footer className="px-4 pb-4 text-center text-[11px] text-muted-foreground">
          <p>Lifetime exchange · 15-day returns · Certified diamonds</p>
          <Link to="/stores" className="mt-1 inline-block font-semibold text-primary">
            Find a LumiAura store near you
          </Link>
        </footer>
      </div>

      {/* Navigation tab reveals when scrolling down */}
      {showBottomNav && <BottomNav />}

      {showLumiAIPopup && (
        <Link
          to="/lumiai"
          className="fixed left-4 bottom-24 z-50 flex h-[220px] w-[220px] flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-purple-700 via-fuchsia-600 to-pink-400 p-5 shadow-[0_28px_90px_rgba(120,72,200,0.18)] transition-transform duration-300 hover:scale-[1.02] backdrop-blur-sm animate-fade-up sm:left-6 cursor-pointer"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="text-amber-200/90 h-4 w-4 animate-pulse" />
                <p className="text-[11px] uppercase tracking-[0.35em] text-amber-100">✨ MEET LUMIAI</p>
              </div>
              <h3 className="mt-3 text-lg font-semibold leading-tight text-white">
                Experience AI-Powered Jewellery
              </h3>
              <p className="mt-3 text-sm text-white/90">Virtual Try-On · LumiMirror</p>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleCloseLumiAIPopup();
              }}
              className="h-9 w-9 rounded-full bg-white/10 text-sm font-semibold text-white/95 transition hover:bg-white/20"
            >
              ✕
            </button>
          </div>

          <span className="pointer-events-none absolute right-4 bottom-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
            <ArrowRight size={16} />
          </span>
        </Link>
      )}

      {/* Voice Assistant is always visible on the landing page */}
      <ConciergeFab />
    </div>
  );
}