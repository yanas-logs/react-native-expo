import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const AUTH_KEY = "auth_user";

export const storage = {
  // Save user data
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      // Web: use localStorage
      localStorage.setItem(key, value);
    } else {
      // Native: use SecureStore
      await SecureStore.setItemAsync(key, value);
    }
  },

  // Get user data
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  // Remove user data
  async removeItem(key: string) {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// Helper functions for auth
export const authStorage = {
  async saveUser(user: any) {
    await storage.setItem(AUTH_KEY, JSON.stringify(user));
  },

  async getUser() {
    const userData = await storage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async removeUser() {
    await storage.removeItem(AUTH_KEY);
  },
};
