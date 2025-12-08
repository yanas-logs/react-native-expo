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
          headerShown: false,
          ...Platform.select({
            ios: { cardStyle: { backgroundColor: "transparent" } },
            android: { contentStyle: { backgroundColor: "transparent" } },
            web: { contentStyle: { backgroundColor: "transparent" } },
          }),
        }}
      />

      {/* Register / Sign-up - Full Screen */}
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: false,
          title: "Sign Up",
          animation: "slide_from_right",
          contentStyle: { backgroundColor: "#fff" },
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
