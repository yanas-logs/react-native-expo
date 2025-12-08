import { View, Text, Alert, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <SafeAreaView>
      <Text>Profile</Text>
      {/* Sign Out Button */}
      <TouchableOpacity
        onPress={handleSignOut}
        className="bg-red-500 rounded-2xl p-4 shadow-lg shadow-red-200"
        activeOpacity={0.8}
      >
        <View className="flex-row items-center justify-center">
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white font-semibold text-lg ml-2">
            Sign Out
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Profile;
