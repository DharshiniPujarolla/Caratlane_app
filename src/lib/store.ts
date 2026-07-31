import { useSyncExternalStore } from "react";

export type CartLine = { id: string; qty: number; size?: string };

type State = {
  wishlist: string[];
  cart: CartLine[];
  recentlyViewed: string[];
  recentSearches: string[];
  user: { name: string; email: string; guest: boolean } | null;
  coupon: string | null;
  giftWrap: boolean;
};

const KEY = "lumiaura-state-v1";

const initial: State = {
  wishlist: [],
  cart: [],
  recentlyViewed: [],
  recentSearches: [],
  user: null,
  coupon: null,
  giftWrap: false,
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

function subscribe(l: () => void) {
  if (!hydrated) {
    hydrated = true;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
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
  toggleWishlist(id: string) {
    set({
      wishlist: state.wishlist.includes(id)
        ? state.wishlist.filter((x) => x !== id)
        : [id, ...state.wishlist],
    });
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
    set({ recentlyViewed: [id, ...state.recentlyViewed.filter((x) => x !== id)].slice(0, 12) });
  },
  search(q: string) {
    if (!q.trim()) return;
    set({ recentSearches: [q, ...state.recentSearches.filter((x) => x !== q)].slice(0, 8) });
  },
  clearSearches() {
    set({ recentSearches: [] });
  },
  signIn(name: string, email: string, guest = false) {
    set({ user: { name, email, guest } });
  },
  signOut() {
    set({ user: null });
  },
  applyCoupon(code: string | null) {
    set({ coupon: code });
  },
  setGiftWrap(v: boolean) {
    set({ giftWrap: v });
  },
};
