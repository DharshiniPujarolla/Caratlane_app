import React, { createContext, useContext, useEffect, useState } from "react";
import { initialJourney } from "./journeyData";

type JourneyContextType = {
  journey: typeof initialJourney;
  addXP: (points: number) => void;
  completeDailyMission: () => void;
  resetJourney: () => void;
};

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [journey, setJourney] = useState(initialJourney);

  // Load saved data (Browser only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("journey");

      if (saved) {
        try {
          setJourney(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to parse journey data", error);
        }
      }
    }
  }, []);

  // Save data (Browser only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("journey", JSON.stringify(journey));
    }
  }, [journey]);

  const addXP = (points: number) => {
    setJourney((prev) => {
      const newXP = prev.xp + points;

      let newLevel = 1;

      if (newXP >= 1000) newLevel = 5;
      else if (newXP >= 500) newLevel = 4;
      else if (newXP >= 250) newLevel = 3;
      else if (newXP >= 100) newLevel = 2;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const completeDailyMission = () => {
    setJourney((prev) => {
      if (prev.dailyMission.completed) return prev;

      return {
        ...prev,
        streak: prev.streak + 1,
        xp: prev.xp + prev.dailyMission.xp,

        dailyMission: {
          ...prev.dailyMission,
          completed: true,
        },

        lastActiveDate: new Date().toDateString(),
      };
    });
  };

  const resetJourney = () => {
    setJourney(initialJourney);

    if (typeof window !== "undefined") {
      localStorage.removeItem("journey");
    }
  };

  return (
    <JourneyContext.Provider
      value={{
        journey,
        addXP,
        completeDailyMission,
        resetJourney,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);

  if (!context) {
    throw new Error("useJourney must be used inside JourneyProvider");
  }

  return context;
};