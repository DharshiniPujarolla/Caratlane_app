import { createFileRoute } from "@tanstack/react-router";
import { LumiAuraJourneyDashboard } from "@/components/LumiAuraJourneyDashboard";

export const Route = createFileRoute("/lumiaura-journey")({
  head: () => ({
    meta: [
      { title: "LumiAura Journey — XP, Streaks & Prestige" },
      { name: "description", content: "Track your LumiAura milestones, daily quests, XP and luxury badges." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fdfcff_0%,#f7f3ff_100%)]">
      <LumiAuraJourneyDashboard />
    </div>
  ),
});
