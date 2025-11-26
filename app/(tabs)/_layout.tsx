import { Platform } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "../../store/cartStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabsLayout = () => {
  const cart = useCartStore((state) => state.cart);
  const cartItemCount = cart.reduce((total, item) => total + item.qty, 0);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "yellow",
        tabBarInactiveTintColor: "white",

        tabBarStyle: {
          backgroundColor: "#a00000ff",
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          paddingTop: 8,
          paddingBottom: Platform.select({
            ios: (insets.bottom || 0) + 8,
            android: 12,
            web: 8,
          }),
          paddingHorizontal: 8,
          height: Platform.select({
            ios: 70 + (insets.bottom || 0),
            android: 75,
            web: 70,
          }),
        },

        elevation: 10,

        ...(Platform.OS === "web"
          ? { boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.15)" }
          : {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
            }),

        tabBarLabelStyle: {
          marginTop: 3,
          fontSize: 15,
        },

        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitleAlign: "center",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          headerTitleAlign: "center",

          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerTitleAlign: "center",
          headerShown: false,
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: "#FF3B30",
            color: "white",
            fontSize: 12,
            minWidth: 20,
            height: 20,
          },
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitleAlign: "center",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
