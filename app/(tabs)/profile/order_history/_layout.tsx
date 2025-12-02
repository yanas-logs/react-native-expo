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
      {/* Screen for index.tsx ( order_history ) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Order History", //  Custom title
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default _layout;
