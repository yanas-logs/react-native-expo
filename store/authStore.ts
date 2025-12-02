import { create } from "zustand";
import type { User, RegisterData } from "../type";
import { authStorage } from "../utils/storage";

// for dummy user
import { dummyUsers } from "../data/dummyUsers";

// Firebase Auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  sendEmailVerification as fbSendEmailVerification,
} from "firebase/auth";

import { auth } from "../firebaseConfig";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  initialize: () => Promise<void>;

  login: (
    email: string,
    password: string,
    useDummy?: boolean,
  ) => Promise<boolean>;

  // NEW: For Expo Google login (uses idToken or accessToken)
  loginWithGoogleCredential: (
    idToken: string | null,
    accessToken?: string | null,
  ) => Promise<boolean>;

  register: (data: RegisterData) => Promise<boolean>;

  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;

  // NEW: Password reset
  resetPassword: (email: string) => Promise<{ ok: boolean; message?: string }>;

  // NEW: Email verification
  sendEmailVerification: () => Promise<{ ok: boolean; message?: string }>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // INITIALIZE — cek firebase auth state
  initialize: async () => {
    set({ isLoading: true });

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const loadedUser: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName ?? "",
            email: firebaseUser.email ?? "",
            phone: firebaseUser.phoneNumber ?? "",
          };

          await authStorage.saveUser(loadedUser);

          set({
            user: loadedUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          await authStorage.removeUser();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }

        resolve();
      });
    });
  },

  // LOGIN with email/password
  login: async (email, password, useDummy = false) => {
    if (useDummy) {
      // search user in dummyUsers
      const found = dummyUsers.find(
        (u) => u.email === email && u.password === password,
      );
      if (!found) return false;

      const loggedUser: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        phone: found.phone,
      };

      await authStorage.saveUser(loggedUser);
      set({ user: loggedUser, isAuthenticated: true });
      return true;
    }
    // LOGIN Firebase
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = result.user;

      const loggedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName ?? "",
        email: fbUser.email ?? "",
        phone: fbUser.phoneNumber ?? "",
      };

      await authStorage.saveUser(loggedUser);
      set({ user: loggedUser, isAuthenticated: true });
      return true;
    } catch (err) {
      console.log("Login error:", err);
      return false;
    }
  },
  // GOOGLE LOGIN — Mobile Expo menggunakan credential idToken
  loginWithGoogleCredential: async (idToken, accessToken) => {
    try {
      if (!idToken && !accessToken) return false;

      const credential = GoogleAuthProvider.credential(idToken, accessToken);
      const result = await signInWithCredential(auth, credential);
      const fbUser = result.user;

      const loggedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName ?? "",
        email: fbUser.email ?? "",
        phone: fbUser.phoneNumber ?? "",
      };

      await authStorage.saveUser(loggedUser);
      set({ user: loggedUser, isAuthenticated: true });

      return true;
    } catch (err) {
      console.log("Google credential login error:", err);
      return false;
    }
  },

  // REGISTER
  register: async (data) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );

      if (data.name) {
        await fbUpdateProfile(result.user, { displayName: data.name });
      }

      // send verification email
      try {
        await fbSendEmailVerification(result.user);
      } catch (e) {
        console.warn("Failed to send verification email:", e);
      }

      const newUser: User = {
        id: result.user.uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
      };

      await authStorage.saveUser(newUser);

      set({ user: newUser, isAuthenticated: true });
      return true;
    } catch (err) {
      console.log("Register error:", err);
      return false;
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await signOut(auth);
      await authStorage.removeUser();

      set({ user: null, isAuthenticated: false });
    } catch (err) {
      console.log("Logout error:", err);
    }
  },

  // UPDATE PROFILE
  updateProfile: async (data) => {
    const state = get();
    if (!state.user) return false;

    try {
      if (data.name) {
        await fbUpdateProfile(auth.currentUser!, {
          displayName: data.name,
        });
      }

      const updatedUser = { ...state.user, ...data };

      await authStorage.saveUser(updatedUser);
      set({ user: updatedUser });
      return true;
    } catch (err) {
      console.log("UpdateProfile error:", err);
      return false;
    }
  },

  // RESET PASSWORD
  resetPassword: async (email) => {
    try {
      await fbSendPasswordResetEmail(auth, email);
      return { ok: true };
    } catch (err: any) {
      console.log("Reset password error:", err);
      return { ok: false, message: err?.message };
    }
  },

  // SEND EMAIL VERIFICATION
  sendEmailVerification: async () => {
    try {
      const current = auth.currentUser;
      if (!current) throw new Error("No authenticated user");

      await fbSendEmailVerification(current);
      return { ok: true };
    } catch (err: any) {
      console.log("SendEmailVerification error:", err);
      return { ok: false, message: err?.message };
    }
  },
}));
