export interface Mission {
  id: number;
  title: string;
  completed: boolean;
  xp: number;
}

export interface WeeklyMission {
  id: number;
  title: string;
  progress: number;
  target: number;
  xp: number;
}

export interface JourneyData {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  achievements: string[];

  dailyMission: Mission;

  weeklyMission: WeeklyMission;
}