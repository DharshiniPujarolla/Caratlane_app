import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Flame, Lock, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { actions, journeyMeta, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const roadmap = [
  "Journey Begins",
  "Profile Badge",
  "Personalized Jewellery Recommendations",
  "Advanced Style Insights",
  "Early Collection Preview",
  "Premium Theme",
  "AI Jewellery Styling",
  "Exclusive Journey Badge",
  "Virtual Showcase Experience",
  "LumiAura Legend",
];

export function LumiAuraJourneyDashboard() {
  const journey = useStore((s) => s.lumiAuraJourney);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    actions.initializeJourney();
    setMounted(true);
  }, []);

  const progress = useMemo(() => {
    const nextLevelXp = journeyMeta.getNextLevelXp(journey.level);
    const currentLevelStart = journeyMeta.getLevelStartXp(journey.level);
    const percent = Math.min(100, Math.max(0, ((journey.totalXp - currentLevelStart) / Math.max(1, nextLevelXp - currentLevelStart)) * 100));
    return { percent, nextLevelXp, currentLevelStart };
  }, [journey.level, journey.totalXp]);

  const badges = journeyMeta.badgeDefinitions.map((badge) => ({
    ...badge,
    unlocked: journey.unlockedBadges.includes(badge.id),
  }));

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.18),_transparent_32%),linear-gradient(180deg,#fdfcff_0%,#f7f3ff_100%)] px-4 py-6 pb-24 text-slate-800 sm:px-6">
      <div className="mx-auto max-w-5xl space-y-5">
        <div className="rounded-[28px] border border-[#efe7ff] bg-white/95 p-5 shadow-[0_18px_40px_-12px_rgba(123,74,226,0.24)] backdrop-blur sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#7B4AE2]">LumiAura Journey</p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl">Level {journey.level} · {journey.loyaltyTier}</h1>
              <p className="mt-2 text-sm leading-7 text-slate-600 sm:text-base">
                Build your signature style, collect prestige, and keep your streak glowing.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7B4AE2] to-[#D4AF37] text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.4)]">
              <Sparkles size={20} />
            </div>
          </div>

          <div className="mt-5 rounded-[24px] bg-gradient-to-br from-[#f7f3ff] via-[#faf7ff] to-[#f3ebff] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
            <div className="flex items-center justify-between text-sm text-slate-600 sm:text-base">
              <span>XP Progress</span>
              <span className="font-semibold text-[#7B4AE2]">{journey.totalXp} / {progress.nextLevelXp} XP</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7B4AE2] via-[#8b5cf6] to-[#D4AF37] transition-all duration-700"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[#7B4AE2] shadow-sm">
                <Flame size={16} className="text-[#D4AF37]" /> {journey.streakCount} Day Streak
              </span>
              <span className="text-sm text-slate-500 sm:text-base">{mounted ? `${Math.round(progress.percent)}% to next level` : "Loading..."}</span>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-[#efe7ff] bg-gradient-to-br from-white to-[#fcfaff] p-5 shadow-[0_10px_30px_-12px_rgba(123,74,226,0.18)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">Today's Mission</p>
                <p className="mt-1 text-sm leading-7 text-slate-600 sm:text-base">{journey.dailyMissions[0]?.title ?? "Complete today's quest"}</p>
              </div>
              <div className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-[#ecfdf3] to-[#fef3c7] px-3 py-2 text-sm font-semibold text-[#15803d] shadow-sm">
                +{journey.dailyMissions[0]?.xpReward ?? 50} XP
              </div>
            </div>

            <button
              onClick={() => actions.completeDailyMission()}
              disabled={journey.dailyMissions[0]?.isCompleted}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#7B4AE2] via-[#8b5cf6] to-[#6d28d9] px-5 py-3.5 text-base font-semibold text-white shadow-[0_12px_24px_rgba(123,74,226,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(123,74,226,0.32)] disabled:cursor-not-allowed disabled:from-[#d8ccf9] disabled:to-[#cbbcf7]"
            >
              {journey.dailyMissions[0]?.isCompleted ? (
                <>
                  <CheckCircle2 size={18} /> Completed
                </>
              ) : (
                <>
                  <Sparkles size={18} /> Complete Quest
                </>
              )}
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-[#efe7ff] bg-white/95 p-5 shadow-[0_18px_40px_-12px_rgba(123,74,226,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">Level Roadmap</h2>
            <span className="rounded-full bg-[#f5ebff] px-3 py-1 text-sm font-semibold text-[#7B4AE2]">1–10</span>
          </div>
          <div className="mt-4 space-y-3">
            {roadmap.map((step, index) => {
              const unlocked = index + 1 <= journey.level;
              return (
                <div
                  key={step}
                  className={cn(
                    "flex items-center justify-between rounded-[18px] border px-4 py-3 text-sm leading-7 transition-all duration-200 hover:scale-[1.01] hover:shadow-xl",
                    unlocked ? "border-[#efe7ff] bg-gradient-to-r from-[#faf7ff] to-[#f7f3ff]" : "border-slate-100 bg-slate-50 text-slate-400"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold", unlocked ? "bg-gradient-to-br from-[#7B4AE2] to-[#D4AF37] text-white shadow-[0_10px_30px_-10px_rgba(168,85,247,0.35)]" : "bg-slate-200 text-slate-500")}>{index + 1}</span>
                    <span className="sm:text-base">{step}</span>
                  </div>
                  {unlocked ? <CheckCircle2 size={16} className="text-[#7B4AE2]" /> : <Lock size={16} className="text-slate-400" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[28px] border border-[#efe7ff] bg-white/95 p-5 shadow-[0_18px_40px_-12px_rgba(123,74,226,0.2)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-slate-900">Achievement Badges</h2>
            <span className="text-sm font-semibold text-slate-500">Collectible</span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "rounded-[20px] border p-4 text-center transition-all duration-200 hover:scale-[1.01] hover:shadow-xl",
                  badge.unlocked
                    ? "border-[#D4AF37]/40 bg-gradient-to-br from-[#fff9e8] via-[#fdf4ff] to-[#f7f3ff] shadow-[0_10px_30px_-12px_rgba(168,85,247,0.35)]"
                    : "border-slate-100 bg-slate-50"
                )}
              >
                <div className={cn("mx-auto flex h-13 w-13 items-center justify-center rounded-full text-2xl", badge.unlocked ? "bg-gradient-to-br from-[#7B4AE2]/15 to-[#D4AF37]/20" : "bg-slate-200") }>
                  {badge.icon}
                </div>
                <p className={cn("mt-3 text-base font-semibold", badge.unlocked ? "text-[#7B4AE2]" : "text-slate-600")}>{badge.label}</p>
                <p className="mt-2 text-sm leading-7 text-slate-500">{badge.reward}</p>
                {!badge.unlocked && <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">Locked</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Today's XP", value: `${journey.todayXp} XP` },
            { label: "Weekly XP", value: `${journey.weeklyXp} XP` },
            { label: "Lifetime XP", value: `${journey.totalXp} XP` },
            { label: "Completed Missions", value: `${journey.dailyMissions.filter((m) => m.isCompleted).length}` },
            { label: "Longest Streak", value: `${journey.longestStreak} Days` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[22px] border border-[#efe7ff] bg-white/95 p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-[24px] border border-[#efe7ff] bg-gradient-to-r from-white to-[#fcf8ff] p-5 shadow-[0_16px_36px_-12px_rgba(123,74,226,0.2)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold text-slate-900">Premium Experience</p>
            <p className="mt-1 text-sm leading-7 text-slate-600 sm:text-base">Unlock themes and prestige perks as you level up.</p>
          </div>
          <Link to="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7B4AE2] via-[#8b5cf6] to-[#6d28d9] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(123,74,226,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(123,74,226,0.32)]">
            Explore <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
