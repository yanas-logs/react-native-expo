import { View, Text } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
	return (
		<Tabs>
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
        	name="profile"
        	options={{
          	title: "Profile",
            headerTitleAlign: "center",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
          />		
		</Tabs>;
	);
};

export default Layout;