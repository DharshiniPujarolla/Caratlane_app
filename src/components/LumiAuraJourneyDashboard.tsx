import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Flame, Lock, Sparkles, Trophy } from "lucide-react";
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
    <div className="min-h-screen bg-[linear-gradient(180deg,#fdfcff_0%,#f7f3ff_100%)] px-4 py-5 pb-24 text-slate-800">
      <div className="rounded-[24px] border border-[#efe7ff] bg-white p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[#7B4AE2]">LumiAura Journey</p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">Level {journey.level} · {journey.loyaltyTier}</h1>
          </div>
          <div className="rounded-full bg-[#7B4AE2]/10 p-3 text-[#7B4AE2]">
            <Sparkles size={18} />
          </div>
        </div>

        <div className="mt-4 rounded-[20px] bg-[#f7f3ff] p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>XP Progress</span>
            <span className="font-semibold text-[#7B4AE2]">{journey.totalXp} / {progress.nextLevelXp} XP</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#7B4AE2] to-[#D4AF37] transition-all duration-700"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[#7B4AE2] shadow-sm">
              <Flame size={15} className="text-[#D4AF37]" /> {journey.streakCount} Day Streak
            </span>
            <span className="text-slate-500">{mounted ? `${Math.round(progress.percent)}% to next level` : "Loading..."}</span>
          </div>
        </div>

        <div className="mt-4 rounded-[20px] border border-[#efe7ff] bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Today's Mission</p>
              <p className="mt-1 text-sm text-slate-500">{journey.dailyMissions[0]?.title ?? "Complete today's quest"}</p>
            </div>
            <div className="rounded-full bg-[#ecfdf3] px-3 py-1 text-sm font-semibold text-[#15803d]">
              +{journey.dailyMissions[0]?.xpReward ?? 50} XP
            </div>
          </div>

          <button
            onClick={() => actions.completeDailyMission()}
            disabled={journey.dailyMissions[0]?.isCompleted}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-[16px] bg-[#7B4AE2] px-4 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:bg-[#c9b8f7]"
          >
            {journey.dailyMissions[0]?.isCompleted ? (
              <>
                <CheckCircle2 size={16} /> Completed
              </>
            ) : (
              <>
                <Sparkles size={16} /> Complete Quest
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#efe7ff] bg-white p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Level Roadmap</h2>
          <span className="text-sm text-[#7B4AE2]">1–10</span>
        </div>
        <div className="mt-4 space-y-2">
          {roadmap.map((step, index) => {
            const unlocked = index + 1 <= journey.level;
            return (
              <div key={step} className={cn("flex items-center justify-between rounded-[16px] border px-3 py-3 text-sm", unlocked ? "border-[#efe7ff] bg-[#faf7ff]" : "border-slate-100 bg-slate-50 text-slate-400") }>
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold", unlocked ? "bg-[#7B4AE2] text-white" : "bg-slate-200 text-slate-500")}>{index + 1}</span>
                  <span>{step}</span>
                </div>
                {unlocked ? <CheckCircle2 size={16} className="text-[#7B4AE2]" /> : <Lock size={16} className="text-slate-400" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 rounded-[24px] border border-[#efe7ff] bg-white p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Achievement Badges</h2>
          <span className="text-sm text-slate-500">Collectible</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div key={badge.id} className={cn("rounded-[18px] border p-3 text-center", badge.unlocked ? "border-[#D4AF37]/40 bg-[#fff9e8]" : "border-slate-100 bg-slate-50")}>
              <div className={cn("mx-auto flex h-12 w-12 items-center justify-center rounded-full text-xl", badge.unlocked ? "bg-[#7B4AE2]/10" : "bg-slate-200")}>
                {badge.icon}
              </div>
              <p className={cn("mt-2 text-sm font-semibold", badge.unlocked ? "text-[#7B4AE2]" : "text-slate-500")}>{badge.label}</p>
              <p className="mt-1 text-[11px] text-slate-400">{badge.reward}</p>
              {!badge.unlocked && <div className="mt-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">Locked</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          { label: "Today's XP", value: `${journey.todayXp} XP` },
          { label: "Weekly XP", value: `${journey.weeklyXp} XP` },
          { label: "Lifetime XP", value: `${journey.totalXp} XP` },
          { label: "Completed Missions", value: `${journey.dailyMissions.filter((m) => m.isCompleted).length}` },
          { label: "Longest Streak", value: `${journey.longestStreak} Days` },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[20px] border border-[#efe7ff] bg-white p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[20px] border border-[#efe7ff] bg-white p-4 shadow-[0_10px_30px_rgba(123,74,226,0.15)]">
        <div>
          <p className="text-sm font-semibold text-slate-900">Premium Experience</p>
          <p className="text-sm text-slate-500">Unlock themes and prestige perks as you level up.</p>
        </div>
        <Link to="/" className="inline-flex items-center gap-2 rounded-full bg-[#7B4AE2] px-3 py-2 text-sm font-semibold text-white">
          Explore <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
