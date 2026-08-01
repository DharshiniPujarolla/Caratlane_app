import { JourneyData } from "./types";

export const initialJourney: JourneyData = {
  xp: 0,

  level: 1,

  streak: 1,

  lastActiveDate: "",

  achievements: [],

  dailyMission: {
    id: 1,
    title: "Explore a New Collection",
    completed: false,
    xp: 20,
  },

  weeklyMission: {
    id: 1,
    title: "Save 5 Wishlist Items",
    progress: 0,
    target: 5,
    xp: 100,
  },
};