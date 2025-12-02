import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../../store/authStore";
import { useOrderStore } from "../../../store/orderStore";

export default function Profile() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // State order
  const orders = useOrderStore((state) => state.orders);

  // State for form login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      Alert.alert("Login Failed", "Email atau password salah.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout(); // 1) clear user
          router.replace("/(auth)/login"); // 2) redirect without back
        },
      },
    ]);
  };

  // guest mode not login yet
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

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.divider} />
        </View>

        {/* Google Login */}
        <TouchableOpacity style={styles.googleButton}>
          <Ionicons name="logo-google" size={20} color="#000" />
          <Text style={styles.googleButtonText}>Google</Text>
        </TouchableOpacity>

        {/* Signup link */}
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

  // Login Mode
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.userName}>{user.name || "User"}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        {user.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
      </View>

      {/* Menu */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={22} color="#333" />
          <Text style={styles.menuText}>Edit Profile</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="location-outline" size={22} color="#333" />
          <Text style={styles.menuText}>Addresses</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Orders</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/profile/order_history")}
        >
          <Ionicons name="receipt-outline" size={22} color="#333" />
          <Text style={styles.menuText}>Order History</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-outline" size={22} color="#333" />
          <Text style={styles.menuText}>Favorites</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  // LOGIN STATE
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
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

  // HEADER
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#111" },

  // USER CARD
  userCard: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    elevation: 3,
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
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  menuItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    alignItems: "center",
    elevation: 2,
  },
  menuText: { flex: 1, marginLeft: 12, fontSize: 15 },

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
    alignItems: "center",
    gap: 8,
  },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "600" },
});
