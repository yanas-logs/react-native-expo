import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from "@expo/vector-icons"

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "yellow",
                tabBarInactiveTintColor: "white",
                tabBarStyle: {
                    backgroundColor: "#a00000ff",
                    paddingBottom: 6,
                    height: 60,
                },
                tabBarLabelStyle: {
                    marginTop:3,
                    fontSize: 15,
                },
            }}
        >
            <Tabs.Screen
                name='index'
                options={{
                    title: "Home",
                    headerTitleAlign: "center",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='search'
                options={{
                    title: "Search",
                    headerTitleAlign: "center",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='cart'
                options={{
                    title: "Cart",
                    headerTitleAlign: "center",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profile",
                    headerTitleAlign: "center",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-circle" size={size} color={color} />
                    ),
                }}
            />

        </Tabs>
    )
}

export default TabsLayout