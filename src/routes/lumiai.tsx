import { ArrowRight, Camera, Sparkles, Upload } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/lumiai")({
  head: () => ({
    meta: [
      { title: "LumiAI — Your AI Jewellery Assistant" },
      {
        name: "description",
        content:
          "Discover LumiAI: your premium AI jewellery assistant for intelligent virtual try-on and LumiMirror styling.",
      },
    ],
  }),
  component: LumiAI,
});

function FeatureCard({
  to,
  params,
  icon: Icon,
  title,
  description,
}: {
  to: string;
  params?: Record<string, string>;
  icon: typeof Camera;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      params={params}
      className="press group block overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-7 shadow-[0_30px_90px_rgba(131,58,180,0.16)] transition duration-300 hover:-translate-y-1"
    >
      <div className="flex h-full flex-col justify-between gap-6">
        <div>
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 shadow-soft">
            <Icon size={24} />
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-slate-950">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-700 transition group-hover:text-violet-900">
          Explore
          <ArrowRight size={16} />
        </div>
      </div>
    </Link>
  );
}

function LumiAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-purple-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="overflow-hidden rounded-[40px] border border-white/60 bg-white/90 p-8 shadow-[0_40px_120px_rgba(131,58,180,0.14)] backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-violet-700">
              <Sparkles size={16} /> LumiAI Lounge
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Your AI Jewellery Assistant
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Step into LumiAI, an exclusive premium space that brings virtual try-on and LumiMirror styling together for a smarter jewellery experience.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            to="/product/$id"
            params={{ id: "necklaces-1" }}
            icon={Camera}
            title="Virtual Try-On"
            description="Try necklaces and earrings virtually with a premium, instant styling preview."
          />
          <FeatureCard
            to="/lumimirror"
            icon={Upload}
            title="LumiMirror"
            description="See your look transform with intelligent jewellery styling powered by LumiMirror."
          />
        </section>
      </div>
    </div>
  );
}
