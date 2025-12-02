import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      setUser: (user) => set({ user, isLoggedIn: !!user }),
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    { name: "auth-store" }
  )
);
