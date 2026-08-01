import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Wand2,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { products, inr } from "@/lib/data";
import { useJourney } from "@/Journey/JourneyContext";
import {
  generateStyleReport,
  inspirations,
  leaderboard,
  occasionOptions,
  outfitOptions,
  weeklyMission,
  type StyleReport,
} from "@/lib/styleMissions";

export const Route = createFileRoute("/style-mission")({
  head: () => ({
    meta: [
      { title: "LumiAura Style Missions — Minimal Monday Challenge" },
      {
        name: "description",
        content:
          "Join the weekly LumiAura styling challenge, build a look with our jewellery catalogue, get an AI style report and earn XP and badges.",
      },
      { property: "og:title", content: "LumiAura Style Missions — Weekly Styling Challenge" },
      {
        property: "og:description",
        content: "Build a look, get your AI style score and climb the weekly stylist leaderboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StyleMissionPage,
});

type Step = "intro" | "builder" | "report" | "success" | "community";

const catalog = products.slice(0, 12);

function Chip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`press rounded-full border px-4 py-2 text-[13px] font-medium transition duration-200 ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_25px_rgba(88,28,135,0.18)]"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[12px] font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-2 rounded-full gradient-primary transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StyleMissionPage() {
  const { addXP } = useJourney();
  const [step, setStep] = useState<Step>("intro");
  const [outfit, setOutfit] = useState("");
  const [occasion, setOccasion] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [report, setReport] = useState<StyleReport | null>(null);
  const [hearted, setHearted] = useState<string[]>([]);
  const [saved, setSaved] = useState<string[]>([]);
  const [voted, setVoted] = useState<string | null>(null);

  const canGenerate = outfit && occasion && picked.length > 0;

  const pickedProducts = useMemo(
    () => catalog.filter((p) => picked.includes(p.id)),
    [picked],
  );

  const toggle = (arr: string[], set: (v: string[]) => void, id: string, max?: number) => {
    if (arr.includes(id)) set(arr.filter((x) => x !== id));
    else if (!max || arr.length < max) set([...arr, id]);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader title="Style Missions" subtitle={weeklyMission.theme} />

      <div className="space-y-5 p-4">
        {step === "intro" && (
          <section className="animate-in fade-in duration-500 space-y-5">
            <div className="relative overflow-hidden rounded-[32px] gradient-primary p-6 text-primary-foreground shadow-[0_28px_70px_rgba(88,28,135,0.28)]">
              <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-gold-soft/25 blur-3xl" />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]">
                <Sparkles size={12} /> This Week
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-tight">{weeklyMission.theme}</h1>
              <p className="mt-2 text-sm leading-6 opacity-90">{weeklyMission.description}</p>

              <div className="mt-5 flex flex-wrap gap-2 text-[12px] font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                  <Trophy size={13} /> +{weeklyMission.xp} XP
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                  🏅 {weeklyMission.badge}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5">
                  <Timer size={13} /> Ends in {weeklyMission.endsInDays} Days
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <h2 className="text-[15px] font-semibold">How it works</h2>
              <ol className="mt-3 space-y-3 text-[13px] text-muted-foreground">
                {[
                  "Pick an outfit and the occasion you're dressing for.",
                  "Add up to 5 pieces from the LumiAura catalogue.",
                  "Get your AI style report and submit the mission.",
                ].map((t, i) => (
                  <li key={t} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                      {i + 1}
                    </span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setStep("builder")}
              className="press flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              <Wand2 size={16} /> Start Styling
            </button>

            <Leaderboard />
          </section>
        )}

        {step === "builder" && (
          <section className="animate-in fade-in duration-500 space-y-5">
            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <h2 className="text-[15px] font-semibold">Choose your outfit</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {outfitOptions.map((o) => (
                  <Chip key={o} active={outfit === o} onClick={() => setOutfit(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <h2 className="text-[15px] font-semibold">Occasion</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {occasionOptions.map((o) => (
                  <Chip key={o} active={occasion === o} onClick={() => setOccasion(o)}>
                    {o}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-semibold">Add jewellery</h2>
                <span className="text-[12px] font-medium text-muted-foreground">
                  {picked.length}/5 selected
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {catalog.map((p) => {
                  const active = picked.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggle(picked, setPicked, p.id, 5)}
                      className={`press relative overflow-hidden rounded-2xl border text-left transition duration-200 ${
                        active ? "border-primary shadow-[0_12px_30px_rgba(88,28,135,0.18)]" : "border-border"
                      }`}
                    >
                      <img src={p.image} alt={p.name} className="h-20 w-full object-cover" />
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check size={12} />
                        </span>
                      )}
                      <div className="p-2">
                        <p className="truncate text-[11px] font-medium">{p.name}</p>
                        <p className="text-[10px] text-muted-foreground">{inr(p.price)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <h2 className="text-[15px] font-semibold">Styling note (optional)</h2>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Tell us the mood you were going for…"
                className="mt-3 w-full resize-none rounded-2xl border border-border bg-muted/40 p-3 text-[13px] outline-none focus:border-primary"
              />
            </div>

            <button
              disabled={!canGenerate}
              onClick={() => {
                setReport(
                  generateStyleReport({ outfit, occasion, jewelleryIds: picked, note }),
                );
                setStep("report");
              }}
              className="press flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-40"
            >
              <Sparkles size={16} /> Generate AI Style Report
            </button>
          </section>
        )}

        {step === "report" && report && (
          <section className="animate-in fade-in duration-500 space-y-5">
            <div className="rounded-[32px] border border-border/70 bg-card p-6 text-center shadow-[0_20px_55px_rgba(88,28,135,0.10)]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                AI Style Report
              </p>
              <div className="mx-auto mt-4 flex h-28 w-28 flex-col items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-[0_18px_45px_rgba(88,28,135,0.30)]">
                <span className="text-3xl font-black">{report.overall}</span>
                <span className="text-[10px] uppercase tracking-widest opacity-85">Overall</span>
              </div>
              <h2 className="mt-4 text-lg font-bold tracking-tight">{report.identity}</h2>
              <p className="mt-1.5 text-[13px] leading-5 text-muted-foreground">{report.summary}</p>
            </div>

            <div className="space-y-4 rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <ScoreBar label="Elegance" value={report.elegance} />
              <ScoreBar label="Balance" value={report.balance} />
              <ScoreBar label="Colour Harmony" value={report.colorHarmony} />
              <ScoreBar label="Trend Match" value={report.trendMatch} />
            </div>

            <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
              <h3 className="text-[14px] font-semibold">Your look</h3>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {outfit} · {occasion}
              </p>
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {pickedProducts.map((p) => (
                  <img
                    key={p.id}
                    src={p.image}
                    alt={p.name}
                    className="h-16 w-16 shrink-0 rounded-2xl border border-border object-cover"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                addXP(weeklyMission.xp);
                setStep("success");
              }}
              className="press flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              Submit Mission <ArrowRight size={16} />
            </button>
          </section>
        )}

        {step === "success" && (
          <section className="animate-in fade-in zoom-in-95 duration-500 space-y-5 pt-6 text-center">
            <div className="rounded-[32px] gradient-primary p-8 text-primary-foreground shadow-[0_28px_70px_rgba(88,28,135,0.28)]">
              <div className="text-5xl">🎉</div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">Mission Completed</h2>
              <p className="mt-1.5 text-sm opacity-90">Minimal Monday, beautifully styled.</p>

              <div className="mt-6 space-y-2">
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
                  +{weeklyMission.xp} XP added to your Journey
                </div>
                <div className="rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold">
                  🏅 Badge Unlocked · {weeklyMission.badge}
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep("community")}
              className="press flex w-full items-center justify-center gap-2 rounded-full gradient-primary py-3.5 text-sm font-semibold text-primary-foreground"
            >
              View Community Inspiration <ArrowRight size={16} />
            </button>

            <Link
              to="/journey"
              className="press block w-full rounded-full border border-border bg-card py-3.5 text-sm font-semibold"
            >
              Go to My Journey
            </Link>
          </section>
        )}

        {step === "community" && (
          <section className="animate-in fade-in duration-500 space-y-5">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Community Inspiration</h2>
              <p className="text-[12px] text-muted-foreground">
                Looks styled by the LumiAura community this week.
              </p>
            </div>

            <div className="space-y-3">
              {inspirations.map((i) => (
                <div
                  key={i.id}
                  className="rounded-3xl border border-border/70 bg-card p-4 shadow-[0_14px_40px_rgba(88,28,135,0.07)] transition duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-semibold">{i.title}</h3>
                      <p className="mt-0.5 text-[12px] text-muted-foreground">
                        {i.occasion} · by {i.stylist}
                      </p>
                      <p className="mt-1.5 text-[12px] text-foreground/80">{i.jewellery}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1.5 text-[12px] font-bold text-primary">
                      {i.score} AI
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggle(hearted, setHearted, i.id)}
                      className={`press rounded-full border px-3 py-1.5 text-[12px] font-medium ${
                        hearted.includes(i.id)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      <Heart size={12} className="mr-1 inline" />
                      {i.hearts + (hearted.includes(i.id) ? 1 : 0)}
                    </button>
                    <button
                      onClick={() => toggle(saved, setSaved, i.id)}
                      className={`press rounded-full border px-3 py-1.5 text-[12px] font-medium ${
                        saved.includes(i.id)
                          ? "border-amber-400 bg-gold-soft/25 text-amber-700"
                          : "border-border"
                      }`}
                    >
                      <Star size={12} className="mr-1 inline" />
                      {saved.includes(i.id) ? "Saved" : "Save"}
                    </button>
                    <button
                      onClick={() => setVoted(voted === i.id ? null : i.id)}
                      className={`press rounded-full border px-3 py-1.5 text-[12px] font-medium ${
                        voted === i.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      <Trophy size={12} className="mr-1 inline" />
                      {voted === i.id ? "Voted" : "Vote"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Leaderboard />
          </section>
        )}
      </div>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-[0_14px_40px_rgba(88,28,135,0.07)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">Weekly Leaderboard</h2>
        <span className="text-[11px] font-medium text-muted-foreground">Resets Sunday</span>
      </div>
      <div className="mt-4 space-y-3">
        {leaderboard.map((u) => (
          <div key={u.rank} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                u.rank === 1
                  ? "bg-gold-soft/40 text-amber-700"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {u.rank}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold">{u.name}</p>
              <p className="text-[11px] text-muted-foreground">
                {u.title} · {u.votes} votes
              </p>
            </div>
            <span className="shrink-0 text-[13px] font-bold text-primary">{u.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
