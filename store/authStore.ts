import { create } from "zustand";
import type { User, RegisterData } from "../type";
import { authStorage } from "../utils/storage";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>; // Load from storage
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize - Load user from storage
  initialize: async () => {
    try {
      const savedUser = await authStorage.getUser();
      if (savedUser) {
        set({
          user: savedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Initialize error:", error);
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      // TODO: Implement real API call
      // For now, mock login
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: "1",
          name: "Mr Example",
          email: email,
          phone: "0001234567890",
          address: "St. Example No. 123, ExampleCity",
        };

        // Save to storage
        await authStorage.saveUser(mockUser);

        set({ user: mockUser, isAuthenticated: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  loginWithGoogle: async () => {
    try {
      // TODO: Implement Google OAuth
      const mockUser: User = {
        id: "2",
        name: "Google User",
        email: "user@gmail.com",
        phone: "081234567890",
      };

      // Save to storage
      await authStorage.saveUser(mockUser);

      set({ user: mockUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  },

  register: async (data: RegisterData) => {
    try {
      // TODO: Replace with real API call
      const newUser: User = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      // Save to storage
      await authStorage.saveUser(newUser);

      set({ user: newUser, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  },

  logout: async () => {
    try {
      // ✅ Remove from storage
      await authStorage.removeUser();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  updateProfile: (data: Partial<User>) => {
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...data } : null;

      // Save updated profile
      if (updatedUser) {
        authStorage.saveUser(updatedUser);
      }

      return { user: updatedUser };
    });
  },
}));
