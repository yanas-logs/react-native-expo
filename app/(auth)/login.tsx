import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/authStore";

// Google Sign-In
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, loginWithGoogleCredential, resetPassword } = useAuthStore();

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  });

  // Handle Google Response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token, access_token } = response.params;

      (async () => {
        const ok = await loginWithGoogleCredential(
          id_token ?? null,
          access_token ?? null
        );

        if (ok) router.replace("/(tabs)/cart/checkout");
        else Alert.alert("Error", "Google login failed");
      })();
    }
  }, [response]);

  // Email / Password
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    const success = await login(email, password, true);
    setLoading(false);

    if (success) router.replace("/(tabs)/cart/checkout");
    else Alert.alert("Error", "Invalid email or password");
  };

  // Reset Password
  const handleForgot = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email to reset password");
      return;
    }

    const res = await resetPassword(email);

    if (res.ok) Alert.alert("Success", "Reset email sent. Check your inbox.");
    else Alert.alert("Error", res.message || "Failed to send reset email");
  };

  return (
    <View style={styles.overlay}>
      {/* Outer Pressable (close modal) */}
      <Pressable style={styles.overlayTouchable} onPress={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.centerWrapper}
      >
        <View style={styles.modalWrapper}>
          {/* Inner Pressable (prevent close) */}
          <Pressable style={{ flex: 1 }} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalCard}>
              {/* Close Btn */}
              <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
              >
                {/* Title */}
                <View style={styles.titleSection}>
                  <Text style={styles.modalTitle}>Login</Text>
                  <Text style={styles.modalSubtitle}>
                    Login to continue checkout
                  </Text>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#999"
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
                </View>

                {/* Forgot Password */}
                <TouchableOpacity style={styles.forgotPassword} onPress={handleForgot}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginBtnText}>Login</Text>
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>Or continue with</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Google */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={() => promptAsync()}
                  disabled={!request}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.googleBtnText}>Google</Text>
                </TouchableOpacity>

                {/* Sign Up */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/sign-up")}
                  >
                    <Text style={styles.signupLink}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  overlayTouchable: {
    ...StyleSheet.absoluteFillObject,
  },

  centerWrapper: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  modalWrapper: {
    width: "100%",
    maxWidth: 500,
    paddingHorizontal: 20,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    maxHeight: "100%",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 10px 40px rgba(0,0,0,0.3)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 15,
        }),
  },

  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },

  scrollContent: { paddingBottom: 10 },

  titleSection: {
    marginTop: 12,
    marginBottom: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: "#111",
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },

  inputGroup: { marginBottom: 10 },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 52,
  },

  icon: { marginRight: 12 },

  input: { flex: 1, fontSize: 15, color: "#111" },

  eyeBtn: { padding: 4 },

  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
    marginTop: -8,
  },

  forgotPasswordText: {
    color: "#a00000ff",
    fontSize: 14,
    fontWeight: "600",
  },

  loginBtn: {
    backgroundColor: "#a00000ff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    height: 52,
    justifyContent: "center",
  },

  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e0e0e0",
  },

  dividerText: { paddingHorizontal: 16, fontSize: 13, color: "#999" },

  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    height: 50,
    gap: 10,
  },

  googleBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },

  signupText: { fontSize: 14, color: "#666" },

  signupLink: { fontSize: 14, fontWeight: "700", color: "#a00000ff" },
});
