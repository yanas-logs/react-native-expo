import { Stack } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Platform } from "react-native";

import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'



export default function RootLayout() {
  // FORCE CLEAR STORAGE ONLY ON WEB DEV
  if (Platform.OS === "web" && process.env.NODE_ENV === "development") {
    localStorage.clear();
  }

  return (

    <ClerkProvider tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>

    {/*<Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
    </Stack> */}

  );
}
