import { Stack } from "expo-router";

export const unstable_settings = {
  anchor: "index",
};

const isLoggedIn = false;

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
          presentation: "modal",
        }}
      />

      <Stack.Screen
        name="modal"
        options={{
          title: "Modal", //  Custom title
          headerShown: true,
          presentation: "modal",
          sheetAllowedDetents: [0.5, 1],
        }}
      />

      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen
          name="checkout_testing"
          options={{
            title: "Checkout_Testing", //  Custom title
            headerShown: true,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
};

export default _layout;
