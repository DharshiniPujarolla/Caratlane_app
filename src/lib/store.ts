import { useSyncExternalStore } from "react";
import { toast } from "sonner";

export type CartLine = { id: string; qty: number; size?: string };

export type JourneyMission = {
  id: string;
  title: string;
  xpReward: number;
  isCompleted: boolean;
  actionType: string;
};

export type LumiAuraJourney = {
  level: number;
  xp: number;
  totalXp: number;
  streakCount: number;
  longestStreak: number;
  lastLoginDate: string | null;
  loyaltyTier: string;
  unlockedBadges: string[];
  dailyMissions: JourneyMission[];
  todayXp: number;
  weeklyXp: number;
  productViewsCount: number;
  profileCompleted: boolean;
  lastMissionCompletedAt: string | null;
};

type State = {
  wishlist: string[];
  cart: CartLine[];
  recentlyViewed: string[];
  recentSearches: string[];
  user: { name: string; email: string; guest: boolean } | null;
  coupon: string | null;
  giftWrap: boolean;
  lumiAuraJourney: LumiAuraJourney;
};

const KEY = "lumiaura-state-v1";

const defaultMission: JourneyMission = {
  id: "daily-quest",
  title: "Complete today's quest",
  xpReward: 50,
  isCompleted: false,
  actionType: "dailyQuest",
};

const badgeDefinitions = [
  { id: "first-purchase", label: "First Purchase", icon: "💍", reward: "Purchase your first piece" },
  { id: "wishlist-lover", label: "Wishlist Lover", icon: "❤️", reward: "Save a few favourites" },
  { id: "diamond-explorer", label: "Diamond Explorer", icon: "👑", reward: "Explore the collections" },
  { id: "try-at-home-pro", label: "Try-at-Home Pro", icon: "🏠", reward: "Book a try-at-home appointment" },
  { id: "review-master", label: "Review Master", icon: "📸", reward: "Leave a review" },
  { id: "streak-30", label: "30 Day Streak", icon: "🔥", reward: "Keep the streak alive" },
  { id: "gold-collector", label: "Gold Collector", icon: "🌟", reward: "Earn luxury XP" },
] as const;

const initialJourney: LumiAuraJourney = {
  level: 1,
  xp: 0,
  totalXp: 0,
  streakCount: 1,
  longestStreak: 1,
  lastLoginDate: null,
  loyaltyTier: "Explorer",
  unlockedBadges: [],
  dailyMissions: [defaultMission],
  todayXp: 0,
  weeklyXp: 0,
  productViewsCount: 0,
  profileCompleted: false,
  lastMissionCompletedAt: null,
};

const initial: State = {
  wishlist: [],
  cart: [],
  recentlyViewed: [],
  recentSearches: [],
  user: null,
  coupon: null,
  giftWrap: false,
  lumiAuraJourney: initialJourney,
};

let state: State = initial;
let hydrated = false;
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  persist();
  emit();
}

function updateJourney(mutator: (journey: LumiAuraJourney) => LumiAuraJourney) {
  state = {
    ...state,
    lumiAuraJourney: mutator(state.lumiAuraJourney),
  };
  persist();
  emit();
}

function getLevelFromXp(totalXp: number) {
  if (totalXp >= 1500) return 10;
  if (totalXp >= 1200) return 9;
  if (totalXp >= 1000) return 8;
  if (totalXp >= 800) return 7;
  if (totalXp >= 600) return 6;
  if (totalXp >= 400) return 5;
  if (totalXp >= 250) return 4;
  if (totalXp >= 100) return 3;
  if (totalXp >= 40) return 2;
  return 1;
}

function getLevelStartXp(level: number) {
  if (level <= 1) return 0;
  if (level === 2) return 40;
  if (level === 3) return 100;
  if (level === 4) return 250;
  if (level === 5) return 400;
  if (level === 6) return 600;
  if (level === 7) return 800;
  if (level === 8) return 1000;
  if (level === 9) return 1200;
  return 1500;
}

function getTier(level: number) {
  if (level >= 8) return "Legend";
  if (level >= 6) return "Connoisseur";
  if (level >= 4) return "Artisan";
  return "Explorer";
}

function getNextLevelXp(level: number) {
  return Math.max(100, 120 + (level - 1) * 80);
}

function syncBadges(journey: LumiAuraJourney): LumiAuraJourney {
  const unlocked = new Set(journey.unlockedBadges);
  if (journey.totalXp >= 300) unlocked.add("first-purchase");
  if (journey.totalXp >= 500) unlocked.add("gold-collector");
  if (journey.productViewsCount >= 5) unlocked.add("diamond-explorer");
  if (journey.streakCount >= 30) unlocked.add("streak-30");
  if (journey.profileCompleted) unlocked.add("wishlist-lover");
  const currentMissionCompleted = journey.dailyMissions.some((m) => m.isCompleted);
  if (currentMissionCompleted) unlocked.add("wishlist-lover");

  return {
    ...journey,
    unlockedBadges: Array.from(unlocked),
    loyaltyTier: getTier(journey.level),
  };
}

function finalizeJourney(journey: LumiAuraJourney): LumiAuraJourney {
  const nextLevel = getLevelFromXp(journey.totalXp);
  const nextJourney = {
    ...journey,
    level: nextLevel,
    loyaltyTier: getTier(nextLevel),
  };
  return syncBadges(nextJourney);
}

function getNowDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function subscribe(l: () => void) {
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        state = {
          ...initial,
          ...parsed,
          lumiAuraJourney: {
            ...initialJourney,
            ...(parsed.lumiAuraJourney ?? {}),
          },
        };
      }
    } catch {
      /* ignore */
    }
  }
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

export const actions = {
  initializeJourney() {
    updateJourney((journey) => {
      const today = getNowDateKey();
      let nextJourney = {
        ...journey,
        dailyMissions: journey.dailyMissions.length > 0 ? journey.dailyMissions : [defaultMission],
      };

      if (!nextJourney.lastLoginDate) {
        nextJourney = {
          ...nextJourney,
          lastLoginDate: today,
          streakCount: 1,
          longestStreak: 1,
        };
      } else {
        const last = new Date(nextJourney.lastLoginDate);
        const todayDate = new Date(today);
        const diffDays = Math.round((todayDate.getTime() - last.getTime()) / 86400000);

        if (diffDays === 1) {
          nextJourney = {
            ...nextJourney,
            streakCount: nextJourney.streakCount + 1,
            longestStreak: Math.max(nextJourney.longestStreak, nextJourney.streakCount + 1),
            lastLoginDate: today,
          };
        } else if (diffDays > 1) {
          nextJourney = {
            ...nextJourney,
            streakCount: 1,
            longestStreak: Math.max(nextJourney.longestStreak, nextJourney.streakCount),
            lastLoginDate: today,
          };
          toast.message("You were so close! Let's start a new streak today.");
        }
      }

      if (nextJourney.lastLoginDate !== today) {
        nextJourney = { ...nextJourney, lastLoginDate: today };
      }

      if (journey.lastLoginDate !== today) {
        nextJourney = {
          ...nextJourney,
          xp: nextJourney.xp + 10,
          totalXp: nextJourney.totalXp + 10,
          todayXp: nextJourney.todayXp + 10,
          weeklyXp: nextJourney.weeklyXp + 10,
        };
      }

      return finalizeJourney(nextJourney);
    });
  },
  toggleWishlist(id: string) {
    const hasId = state.wishlist.includes(id);
    const nextWishlist = hasId ? state.wishlist.filter((x) => x !== id) : [id, ...state.wishlist];
    set({ wishlist: nextWishlist });
    if (!hasId) {
      actions.grantJourneyXp("saveWishlistItem", 20);
    }
  },
  removeWishlist(id: string) {
    set({ wishlist: state.wishlist.filter((x) => x !== id) });
  },
  addToCart(id: string, size?: string) {
    const existing = state.cart.find((l) => l.id === id);
    set({
      cart: existing
        ? state.cart.map((l) => (l.id === id ? { ...l, qty: l.qty + 1 } : l))
        : [{ id, qty: 1, size }, ...state.cart],
    });
  },
  setQty(id: string, qty: number) {
    set({
      cart:
        qty <= 0
          ? state.cart.filter((l) => l.id !== id)
          : state.cart.map((l) => (l.id === id ? { ...l, qty } : l)),
    });
  },
  removeFromCart(id: string) {
    set({ cart: state.cart.filter((l) => l.id !== id) });
  },
  clearCart() {
    set({ cart: [], coupon: null, giftWrap: false });
  },
  view(id: string) {
    const nextRecentlyViewed = [id, ...state.recentlyViewed.filter((x) => x !== id)].slice(0, 12);
    set({ recentlyViewed: nextRecentlyViewed });
    const nextCount = state.lumiAuraJourney.productViewsCount + 1;
    if (nextCount % 5 === 0) {
      actions.grantJourneyXp("viewFiveProducts", 20);
    } else {
      updateJourney((journey) => finalizeJourney({ ...journey, productViewsCount: nextCount }));
    }
  },
  search(q: string) {
    if (!q.trim()) return;
    set({ recentSearches: [q, ...state.recentSearches.filter((x) => x !== q)].slice(0, 8) });
  },
  clearSearches() {
    set({ recentSearches: [] });
  },
  signIn(name: string, email: string, guest = false) {
    const nextUser = { name, email, guest };
    set({ user: nextUser });
    if (!guest) {
      actions.completeProfile();
    }
  },
  signOut() {
    set({ user: null });
  },
  completeProfile() {
    updateJourney((journey) => {
      if (journey.profileCompleted) return journey;
      return finalizeJourney({ ...journey, profileCompleted: true, xp: journey.xp + 40, totalXp: journey.totalXp + 40, todayXp: journey.todayXp + 40, weeklyXp: journey.weeklyXp + 40 });
    });
  },
  shareWishlist() {
    actions.grantJourneyXp("shareWishlist", 25);
  },
  bookTryAtHome() {
    actions.grantJourneyXp("bookTryAtHome", 80);
  },
  visitStore() {
    actions.grantJourneyXp("visitStore", 100);
  },
  purchaseJewellery() {
    actions.grantJourneyXp("purchaseJewellery", 300);
  },
  leaveReview() {
    actions.grantJourneyXp("leaveReview", 60);
  },
  browseCollections() {
    actions.grantJourneyXp("browseCollections", 15);
  },
  completeDailyMission() {
    updateJourney((journey) => {
      const mission = journey.dailyMissions[0];
      if (!mission || mission.isCompleted) return journey;
      const nextJourney = {
        ...journey,
        xp: journey.xp + mission.xpReward,
        totalXp: journey.totalXp + mission.xpReward,
        todayXp: journey.todayXp + mission.xpReward,
        weeklyXp: journey.weeklyXp + mission.xpReward,
        lastMissionCompletedAt: new Date().toISOString(),
        dailyMissions: [{ ...mission, isCompleted: true }],
      };
      return finalizeJourney(nextJourney);
    });
  },
  grantJourneyXp(actionType: string, reward?: number) {
    updateJourney((journey) => {
      const xpReward = reward ?? 0;
      const incremented = {
        ...journey,
        xp: journey.xp + xpReward,
        totalXp: journey.totalXp + xpReward,
        todayXp: journey.todayXp + xpReward,
        weeklyXp: journey.weeklyXp + xpReward,
      };
      return finalizeJourney(incremented);
    });
  },
  applyCoupon(code: string | null) {
    set({ coupon: code });
  },
  setGiftWrap(v: boolean) {
    set({ giftWrap: v });
  },
};

export const journeyMeta = {
  getNextLevelXp,
  getTier,
  badgeDefinitions,
  defaultMission,
  getLevelFromXp,
  getLevelStartXp,
};
