import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  if (Platform.OS === "web" && process.env.NODE_ENV === "development") {
    localStorage.clear();
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" options={{ presentation: "modal" }} />
    </Stack>
  );
}
