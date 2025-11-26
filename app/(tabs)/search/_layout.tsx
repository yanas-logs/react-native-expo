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
      {/* Screen for index.tsx (product list) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Products", //  Custom title
          headerShown: true,
        }}
      />

      {/* Screen for [id].tsx (product detail) */}
      <Stack.Screen
        name="[id]"
        options={{
          title: "Product Detail", //  Custom title
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default _layout;
