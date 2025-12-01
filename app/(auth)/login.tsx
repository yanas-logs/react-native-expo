import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      router.back();
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const success = await loginWithGoogle();
    setLoading(false);

    if (success) {
      router.back();
    } else {
      Alert.alert("Error", "Google login failed");
    }
  };

  return (
    <Pressable style={styles.overlay} onPress={() => router.back()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={styles.modalWrapper}>
            <View style={styles.modalCard}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => router.back()}
              >
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
                  <Text style={styles.label}>Email or Phone</Text>
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
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot password?
                  </Text>
                </TouchableOpacity>

                {/* Login Button */}
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={loading}
                  activeOpacity={0.8}
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

                {/* Google Button */}
                <TouchableOpacity
                  style={styles.googleBtn}
                  onPress={handleGoogleLogin}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <Ionicons name="logo-google" size={20} color="#DB4437" />
                  <Text style={styles.googleBtnText}>Google</Text>
                </TouchableOpacity>

                {/* Sign Up Link */}
                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <TouchableOpacity
                    onPress={() => router.push("/(auth)/register")}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.signupLink}>Sign up</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
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
      ? { boxShadow: "0px 10px 40px rgba(0, 0, 0, 0.3)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: 10 },
          elevation: 15,
        }),
  },
  scrollContent: {
    paddingBottom: 10,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  titleSection: {
    marginTop: 12,
    marginBottom: 28,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#111",
    letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
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
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111",
  },
  eyeBtn: {
    padding: 4,
  },
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
    marginBottom: 15,
    height: 52,
    justifyContent: "center",
  },
  loginBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
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
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#999",
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    marginBottom: 24,
    height: 52,
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
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#a00000ff",
  },
});
