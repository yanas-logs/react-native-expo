import { Stack } from "expo-router";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
        },
      }}
    >
      {/* Screen for index.tsx ( profil ) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Profile", //  Custom title
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default _layout;
