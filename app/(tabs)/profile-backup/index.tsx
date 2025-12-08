import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../../store/authStore";

// Google Sign-In
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    login,
    loginWithGoogleCredential,
    resetPassword,
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  });

  // Handle Google Sign-In Response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;

      (async () => {
        const ok = await loginWithGoogleCredential(
          id_token ?? null,
          access_token ?? null,
        );
        if (ok) {
          Alert.alert("Success", "Logged in with Google!");
        } else {
          Alert.alert("Error", "Google login failed");
        }
      })();
    }
  }, [response]);

  // Handle Email/Password Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    const success = await login(email, password, true);
    setLoading(false);

    if (success) {
      Alert.alert("Success", "Login successful!");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(tabs)/profile");
        },
      },
    ]);
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset password");
      return;
    }

    const res = await resetPassword(email);
    if (res.ok) {
      Alert.alert("Success", "Password reset email sent. Check your inbox.");
    } else {
      Alert.alert("Error", res.message || "Failed to send reset email");
    }
  };

  // If NOT authenticated, show login form
  if (!isAuthenticated || !user) {
    return (
      <ScrollView contentContainerStyle={styles.loginContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        <Ionicons
          name="person-circle-outline"
          size={150}
          color="#bbb"
          style={{ marginBottom: 10 }}
        />

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#777" />
          <TextInput
            style={styles.inputField}
            placeholder="Email"
            placeholderTextColor="#aaa"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" />
          <TextInput
            style={styles.inputField}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeBtn}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={!request}
        >
          <Ionicons name="logo-google" size={20} color="#000" />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile/sign-up")}
        >
          <Text style={styles.signupText}>
            Don't have an account?{" "}
            <Text style={{ color: "#a00000ff", fontWeight: "700" }}>
              Sign Up
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ✅ If authenticated, show profile screen
  return (
    <View style={styles.container}>
      <ScrollView>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>{user.name || "User"}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="receipt-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Order History</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="location-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Addresses</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Notifications</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#333" />
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  // LOGIN STATE
  loginContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  loginTitle: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 2,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  inputField: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  eyeBtn: {
    padding: 4,
  },
  forgotText: {
    alignSelf: "flex-end",
    color: "#a00000ff",
    fontSize: 14,
    marginBottom: 16,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#a00000ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  loginButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  // Divider
  dividerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  divider: { flex: 1, height: 1, backgroundColor: "#ddd" },
  dividerText: { marginHorizontal: 10, color: "#888", fontSize: 14 },

  // Google button
  googleButton: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 18,
    gap: 8,
  },
  googleButtonText: { fontSize: 16, fontWeight: "600", color: "#000" },

  // Signup link
  signupText: { fontSize: 14, marginTop: 5, color: "#555" },

  // USER CARD
  userCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#a00000ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: { fontSize: 22, fontWeight: "700" },
  userEmail: { fontSize: 14, color: "#666", marginTop: 4 },
  userPhone: { fontSize: 14, color: "#999", marginTop: 4 },

  // MENU
  menuSection: { marginTop: 24, marginHorizontal: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  menuItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  menuText: { flex: 1, marginLeft: 12, fontSize: 15, color: "#333" },

  // LOGOUT
  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FF3B30",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 40,
    alignItems: "center",
    gap: 8,
  },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "600" },
});
