import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { products } from "@/lib/data";

export const Route = createFileRoute("/lumisignature")({
  component: LumiSignature,
});

function LumiSignature() {
  const location = useLocation();

  // If we're already on /lumisignature/quiz,
  // only render the child page.
  if (location.pathname !== "/lumisignature") {
    return <Outlet />;
  }

  const featuredProducts = products
    .filter((product) => ["Necklaces", "Earrings", "Pendants", "Rings"].includes(product.category))
    .slice(0, 4);

  const featureCards = [
    {
      title: "Try It On Instantly",
      description: "See your favourite pieces come to life with instant styling preview.",
      stat: "2 min experience",
      label: "Live try-on",
      size: "lg",
      productId: "rings-1",
    },
    {
      title: "LumiMirror",
      description: "A private, elegant mirror for selecting the perfect statement jewellery.",
      stat: "15k+ analyses",
      label: "Virtual styling",
      size: "md",
      productId: "rings-2",
    },
    {
      title: "LumiSignature",
      description: "Premium AI curation that uncovers your one-of-a-kind jewellery identity.",
      stat: "98% Match",
      label: "Signature recommendation",
      size: "sm",
      productId: "rings-3",
    },
  ] as const;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-purple-100 px-6 py-10 text-slate-900">
      <PageHeader title="LumiSignature" subtitle="Personalized jewellery experience" />
      <style>{`
        @keyframes floatY { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
      `}</style>
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center">
        <span className="mt-14 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute right-0 top-36 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
      <div className="pointer-events-none absolute left-0 bottom-10 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="relative z-10 space-y-8">
          <span className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold tracking-wide text-slate-700 shadow-lg shadow-slate-200/40 backdrop-blur">
            ✨ AI-Powered Jewellery Styling
          </span>

          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.04em] text-slate-950 sm:text-6xl">
              Discover the Jewellery
              <span className="relative inline-flex">
                Made Just For You
                <span className="absolute left-0 top-6 h-6 w-full rounded-full bg-amber-300/20 blur-xl" />
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-700 sm:text-lg">
              Experience a personalized luxury jewellery consultation powered by AI. Answer five elegant questions and reveal a collection curated exclusively for your style.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Link
              to="/lumisignature/quiz"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-700 via-fuchsia-700 to-amber-400 px-8 py-4 text-base font-semibold text-white shadow-[0_24px_80px_rgba(148,64,255,0.28)] transition duration-300 hover:shadow-[0_28px_100px_rgba(148,64,255,0.35)]"
            >
              ✨ Begin Your Journey
            </Link>
          </div>

          <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-500">
            ★★★★★ Trusted by thousands of jewellery lovers
          </p>
        </div>

        <div className="relative flex justify-center">
          <div className="relative hidden h-full min-h-[28rem] w-full max-w-xl rounded-[48px] border border-white/70 bg-white/80 p-6 shadow-[0_40px_120px_rgba(120,81,169,0.18)] backdrop-blur-xl lg:block">
            <div className="absolute inset-x-8 top-10 h-44 rounded-full bg-purple-200/20 blur-3xl" />
            <div className="absolute left-8 top-28 h-32 w-32 rounded-full bg-amber-200/25 blur-3xl" />
            <div className="relative grid h-full grid-cols-2 gap-4">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-[32px] border border-white/50 bg-white/85 shadow-xl shadow-slate-200/60 transition duration-500 hover:-translate-y-2"
                  style={{ animation: `floatY 8s ease-in-out ${index * 0.2}s infinite` }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
                    <p className="text-sm font-semibold">{product.name}</p>
                    <p className="text-xs text-slate-200">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid w-full max-w-xl gap-4 lg:hidden">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60 transition duration-500 hover:-translate-y-2"
                style={{ animation: `floatY 8s ease-in-out ${index * 0.2}s infinite` }}
              >
                <img src={product.image} alt={product.name} className="h-72 w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 to-transparent p-4 text-white">
                  <p className="text-sm font-semibold">{product.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.95fr_0.85fr]">
        {featureCards.map((feature, index) => {
          const featureProduct = featuredProducts.find((product) => product.id === feature.productId);

          return (
            <Link
              key={feature.title}
              to="/product/$id"
              params={{ id: feature.productId }}
              className={
                `group relative overflow-hidden rounded-[40px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_80px_rgba(120,81,169,0.16)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_110px_rgba(120,81,169,0.22)] ` +
                (feature.size === "lg" ? "lg:pb-12" : feature.size === "md" ? "lg:pb-10" : "lg:pb-8")
              }
            >
            <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-300/25 blur-2xl" />
            <div className="pointer-events-none absolute left-6 top-8 h-10 w-10 rounded-full bg-white/70 blur-xl" />
            <div className="pointer-events-none absolute right-8 bottom-8 h-6 w-6 rounded-full bg-white/80 blur-xl" />
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex rounded-full border border-amber-200/80 bg-amber-100/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-amber-900 shadow-sm">
                  AI trend
                </span>
                <h3 className="mt-4 text-2xl font-black text-slate-950 leading-tight">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-white/80 bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_10px_30px_rgba(15,23,42,0.16)]">
                {feature.stat}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[32px] border border-white/60 bg-slate-950/10 shadow-inner shadow-slate-900/10">
              <img
                src={featureProduct?.image}
                alt={feature.title}
                className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="relative bg-gradient-to-t from-slate-950/90 to-transparent px-4 py-4 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-amber-200">
                  {feature.label}
                </p>
                <p className="mt-2 text-base font-semibold">{featureProduct?.name}</p>
              </div>
              <div className="absolute right-4 top-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-amber-200 shadow-lg shadow-amber-100/20">
                ✨
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-800 shadow-sm">
                <span className="text-amber-400">★</span> Premium
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-purple-50/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-900 shadow-sm">
                {feature.title === "LumiSignature" ? "Best Match" : feature.title === "LumiMirror" ? "Video Preview" : "Fast Try-On"}
              </span>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Feature</span>
              <span className="rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_10px_30px_rgba(249,168,37,0.32)]">
                Concierge level
              </span>
            </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
