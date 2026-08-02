import { useEffect, useRef, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  Gem,
  Package,
  ShieldCheck,
  Sparkles,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/lumiai/jewelcare")({
  head: () => ({
    meta: [
      { title: "JewelCare AI — Jewellery Care Assistant" },
      {
        name: "description",
        content:
          "JewelCare AI tracks your jewellery's condition with personalized cleaning schedules, care reminders and AI maintenance recommendations.",
      },
      { property: "og:title", content: "JewelCare AI — Jewellery Care Assistant" },
      {
        property: "og:description",
        content:
          "Personalized cleaning guides, wear advice, maintenance timelines and AI shine analysis for your jewellery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JewelCare,
});

const stats = [
  { icon: "✨", label: "Care Score", value: "98%" },
  { icon: "🧼", label: "Last Cleaning", value: "15 days ago" },
  { icon: "🔔", label: "Next Reminder", value: "In 5 days" },
];

const features = [
  {
    icon: "🧴",
    title: "Cleaning Guide",
    desc: "Personalized cleaning instructions based on jewellery type.",
  },
  {
    icon: "💍",
    title: "Wear Recommendations",
    desc: "AI suggests when to avoid wearing jewellery (gym, swimming, chemicals, etc.).",
  },
  {
    icon: "📅",
    title: "Maintenance Timeline",
    desc: "Shows upcoming inspections and cleaning reminders.",
  },
  {
    icon: "📦",
    title: "Storage Tips",
    desc: "Best storage recommendations to prevent scratches and tarnish.",
  },
  {
    icon: "✨",
    title: "Shine Analysis",
    desc: "AI estimates shine level from uploaded images.",
  },
];

const reminders = [
  { title: "Clean Diamond Ring", when: "Tomorrow" },
  { title: "Annual Prong Inspection", when: "Next Month" },
  { title: "Professional Cleaning", when: "In 3 Months" },
];

const tips = [
  "💡 Avoid wearing jewellery while using perfumes.",
  "💡 Store necklaces separately to prevent tangling.",
  "💡 Remove rings before workouts.",
  "💡 Schedule professional polishing every 12 months.",
];

const futureItems = [
  { icon: <ShieldCheck size={18} />, title: "Warranty Tracking" },
  { icon: <CalendarDays size={18} />, title: "Service History" },
  { icon: <Bell size={18} />, title: "Smart Cleaning Scheduler" },
  { icon: <Package size={18} />, title: "Store Service Booking" },
];

function JewelCare() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "analysing" | "done">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTipIndex((i) => (i + 1) % tips.length), 3500);
    return () => clearInterval(id);
  }, []);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setStatus("analysing");
    setTimeout(() => setStatus("done"), 1800);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 px-3 py-6 text-slate-900 sm:px-4 sm:py-12">
      <button
        type="button"
        onClick={() => router.history.back()}
        aria-label="Go back"
        className="absolute left-4 top-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/70 text-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.1)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-white/80"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="relative mx-auto max-w-6xl space-y-10">
        <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-40 h-56 w-56 rounded-full bg-fuchsia-200/50 blur-3xl" />

        <section className="animate-fade-up relative overflow-hidden rounded-[40px] border border-white/40 bg-white/85 p-6 shadow-[0_40px_120px_rgba(120,81,169,0.14)] backdrop-blur-xl sm:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/50 to-transparent" />
          <div className="relative space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-[0_10px_22px_rgba(249,207,36,0.15)]">
              <Sparkles size={16} /> LumiAI Signature
            </div>
            <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
              JewelCare AI
            </h1>
            <p className="max-w-3xl text-lg leading-9 text-slate-700 sm:text-xl">
              Your personal AI jewellery maintenance assistant.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="animate-fade-up rounded-[28px] border border-white/40 bg-white/80 p-6 shadow-[0_24px_70px_rgba(96,50,135,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(96,50,135,0.2)]"
            >
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.28em] text-amber-900">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{s.value}</p>
            </div>
          ))}
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950">AI Care Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="animate-fade-up group rounded-[28px] border border-white/30 bg-white/85 p-6 shadow-[0_24px_70px_rgba(96,50,135,0.12)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_36px_100px_rgba(96,50,135,0.2)]"
              >
                <p className="text-2xl">{f.icon}</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-up rounded-[32px] border border-white/30 bg-white/85 p-6 shadow-[0_32px_100px_rgba(96,50,135,0.14)] backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Care Reminders</h2>
          <ol className="mt-6 space-y-5 border-l border-[#D4AF37]/40 pl-6">
            {reminders.map((r) => (
              <li key={r.title} className="relative">
                <span className="absolute -left-[34px] top-0 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[#8a6d1f] shadow-[0_0_18px_rgba(212,175,55,0.45)]">
                  <CheckCircle2 size={14} />
                </span>
                <p className="text-base font-semibold text-slate-950">{r.title}</p>
                <p className="text-sm text-slate-500">{r.when}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="animate-fade-up rounded-[32px] border border-white/30 bg-white/85 p-6 shadow-[0_32px_100px_rgba(96,50,135,0.14)] backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-950">Upload Jewellery</h2>
          <p className="mt-2 text-sm text-slate-600">Supported: JPG, PNG</p>

          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex min-h-[180px] flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-dashed border-[#D4AF37]/50 bg-gradient-to-br from-amber-50/70 to-fuchsia-50/60">
              {preview ? (
                <img src={preview} alt="Uploaded jewellery" className="h-[180px] w-full object-cover" />
              ) : (
                <Gem size={36} className="text-[#D4AF37]" />
              )}
            </div>
            <div className="flex-1 space-y-4">
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={onFile}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_24px_rgba(249,207,36,0.18)] transition duration-300 hover:bg-amber-200"
              >
                <Upload size={16} /> Upload Jewellery Image
              </button>

              {status === "analysing" && (
                <p className="animate-soft-in text-sm font-medium text-fuchsia-800">AI analysing…</p>
              )}

              {status === "done" && (
                <dl className="animate-fade-up grid gap-2 rounded-[24px] border border-white/50 bg-white/80 p-5 text-sm shadow-[0_18px_50px_rgba(96,50,135,0.12)]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Jewellery Type</dt>
                    <dd className="font-semibold text-slate-950">Diamond Ring</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Condition</dt>
                    <dd className="font-semibold text-slate-950">Excellent</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Care Score</dt>
                    <dd className="font-semibold text-[#8a6d1f]">97%</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Suggested Action</dt>
                    <dd className="max-w-[60%] text-right font-medium text-slate-800">
                      Clean with warm water and mild soap after 2 weeks.
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          </div>
        </section>

        <section className="animate-fade-up overflow-hidden rounded-[32px] border border-white/30 bg-gradient-to-br from-fuchsia-100/70 via-white/80 to-amber-100/70 p-6 shadow-[0_32px_100px_rgba(96,50,135,0.14)] backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-semibold text-slate-950">AI Tips</h2>
          <p key={tipIndex} className="animate-soft-in mt-4 text-lg leading-9 text-slate-800">
            {tips[tipIndex]}
          </p>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-semibold text-slate-950">Future Ready</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {futureItems.map((f) => (
              <div
                key={f.title}
                className="animate-fade-up flex flex-col gap-3 rounded-[28px] border border-white/30 bg-white/70 p-6 shadow-[0_24px_70px_rgba(96,50,135,0.1)] backdrop-blur-xl transition duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-[#8a6d1f]">
                  {f.icon}
                </span>
                <p className="text-base font-semibold text-slate-950">{f.title}</p>
                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-fuchsia-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-900">
                  Coming Soon <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
