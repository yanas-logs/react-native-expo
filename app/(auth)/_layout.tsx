import { Stack } from "expo-router";
import { Platform } from "react-native";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
      }}
    >
      {/* Login - Modal Style */}
      <Stack.Screen
        name="login"
        options={{
          presentation: "transparentModal",
          headerShown: false,
          ...Platform.select({
            ios: { cardStyle: { backgroundColor: "transparent" } },
            android: { contentStyle: { backgroundColor: "transparent" } },
            web: { contentStyle: { backgroundColor: "transparent" } },
          }),
        }}
      />

      {/* Register - Full Screen */}
      <Stack.Screen
        name="register"
        options={{
          title: "Profile",
          animation: "slide_from_right",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
