import { ArrowRight, Sparkles } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import necklaceImg from "@/assets/p-necklace.jpg";
import ringImg from "@/assets/p-ring2.jpg";
import earringsImg from "@/assets/p.earrings3.jpg";

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

function LumiAI() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 px-4 py-12 text-slate-900">
      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-lavender-200/50 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-40 h-56 w-56 rounded-full bg-pink-200/50 blur-3xl" />

        <section className="relative overflow-hidden rounded-[40px] border border-white/40 bg-white/85 p-10 shadow-[0_40px_120px_rgba(120,81,169,0.14)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-transparent" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-[0_10px_22px_rgba(249,207,36,0.15)]">
                <Sparkles size={16} /> LumiAI Signature
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
                  A Luxury Jewellery
                  <br />
                  Feature Experience
                </h1>
                <p className="max-w-3xl text-lg leading-9 text-slate-700 sm:text-xl">
                  Explore a premium LumiAI hub designed like a luxury jewellery editorial, with elegant layers, soft light, and immersive styling previews.
                </p>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="relative h-[280px] w-full max-w-[360px] overflow-hidden rounded-[36px] border border-white/50 bg-white/70 shadow-[0_40px_120px_rgba(122,62,201,0.15)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-amber-100/60 blur-3xl" />
                <div className="absolute right-8 bottom-10 h-28 w-28 rounded-full bg-lavender-200/60 blur-3xl" />
                <img
                  src={ringImg}
                  alt="Luxury ring"
                  className="relative h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-[36px] bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <Link
            to="/product/$id"
            params={{ id: "necklaces-1" }}
            className="group flex overflow-hidden rounded-[32px] border border-white/30 bg-white/85 shadow-[0_32px_100px_rgba(96,50,135,0.14)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_40px_120px_rgba(96,50,135,0.22)]"
          >
            <div className="relative flex w-1/2 items-center justify-center overflow-hidden rounded-l-[32px] bg-white/80 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/40 via-transparent to-transparent" />
              <img
                src={necklaceImg}
                alt="Necklace preview"
                className="relative h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-l-[32px] bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
            <div className="flex w-1/2 flex-col justify-between p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-amber-900">LumiAI Feature</p>
                <h2 className="mt-4 text-4xl font-semibold text-slate-950">Virtual Try-On</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Preview luxurious pieces in a curated digital styling room designed for premium jewel selection.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(249,207,36,0.18)] transition duration-300 hover:bg-amber-200">
                View the Experience
                <ArrowRight size={16} />
              </button>
            </div>
          </Link>

          <Link
            to="/lumimirror"
            className="group flex overflow-hidden rounded-[32px] border border-white/30 bg-white/85 shadow-[0_32px_100px_rgba(96,50,135,0.14)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_40px_120px_rgba(96,50,135,0.22)]"
          >
            <div className="relative flex w-1/2 items-center justify-center overflow-hidden rounded-l-[32px] bg-white/80 p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-lavender-100/40 via-transparent to-transparent" />
              <img
                src={earringsImg}
                alt="Earrings preview"
                className="relative h-[260px] w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-l-[32px] bg-gradient-to-t from-black/10 via-transparent to-transparent" />
            </div>
            <div className="flex w-1/2 flex-col justify-between p-10">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-fuchsia-900">LumiAI Feature</p>
                <h2 className="mt-4 text-4xl font-semibold text-slate-950">LumiMirror</h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Experience intelligent styling guidance presented with premium polish and elegant clarity.
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(249,207,36,0.18)] transition duration-300 hover:bg-amber-200">
                Discover LumiMirror
                <ArrowRight size={16} />
              </button>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
}
