import { useJourney } from "@/Journey/JourneyContext";

export default function Journey() {
  const { journey, completeDailyMission } = useJourney();

  const progress = (journey.xp % 100) / 100 * 100;

  return (
    <div className="min-h-screen bg-[#F8F5FC] p-5">

      {/* Header */}

      <div className="rounded-3xl bg-gradient-to-r from-purple-700 to-violet-500 p-6 text-white shadow-xl">

        <p className="text-sm opacity-80">
          LumiAura Journey
        </p>

        <h1 className="text-3xl font-bold mt-1">
          Level {journey.level}
        </h1>

        <p className="mt-2">
          🔥 {journey.streak} Day Streak
        </p>

        <div className="mt-5">

          <div className="flex justify-between text-sm mb-2">
            <span>{journey.xp} XP</span>
            <span>Next Level</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/30">

            <div
              className="h-3 rounded-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />

          </div>

        </div>

      </div>

      {/* Daily Mission */}

      <div className="bg-white rounded-3xl shadow mt-6 p-5">

        <h2 className="font-semibold text-lg">
          Today's Mission
        </h2>

        <p className="text-gray-500 mt-2">
          {journey.dailyMission.title}
        </p>

        <button
          onClick={completeDailyMission}
          disabled={journey.dailyMission.completed}
          className="mt-5 w-full rounded-xl bg-purple-700 py-3 text-white font-medium disabled:bg-gray-400"
        >
          {journey.dailyMission.completed
            ? "Completed ✓"
            : `Complete (+${journey.dailyMission.xp} XP)`}
        </button>

      </div>

      {/* Weekly Mission */}

      <div className="bg-white rounded-3xl shadow mt-6 p-5">

        <h2 className="font-semibold text-lg">
          Weekly Mission
        </h2>

        <p className="text-gray-500 mt-2">
          {journey.weeklyMission.title}
        </p>

        <div className="mt-3">

          {journey.weeklyMission.progress} / {journey.weeklyMission.target}

        </div>

      </div>

      {/* Achievements */}

      <div className="bg-white rounded-3xl shadow mt-6 p-5">

        <h2 className="font-semibold text-lg mb-4">
          Achievements
        </h2>

        <div className="grid grid-cols-2 gap-3">

          {journey.achievements.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No achievements yet
            </p>
          ) : (
            journey.achievements.map((item) => (
              <div
                key={item}
                className="rounded-xl bg-purple-100 p-3 text-center"
              >
                🏆
                <p className="mt-2 text-sm font-medium">
                  {item}
                </p>
              </div>
            ))
          )}

        </div>

      </div>

    </div>
  );
}