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
      {/* Screen for index.tsx (cart list) */}
      <Stack.Screen
        name="index"
        options={{
          title: "Products", //  Custom title
          headerShown: true,
        }}
      />

      {/* Screen for checkout.tsx (checkout) */}
      <Stack.Screen
        name="checkout"
        options={{
          title: "Checkout", //  Custom title
          headerShown: true,
        }}
      />
    </Stack>
  );
};

export default _layout;
