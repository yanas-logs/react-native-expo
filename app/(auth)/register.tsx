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
  ScrollView,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import type { RegisterData } from "../../type";

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuthStore();

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const success = await register(formData);
    setLoading(false);

    if (success) {
      Alert.alert(
        "Success",
        "Account created successfully! A verification email has been sent.",
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/cart/checkout"),
          },
        ],
      );
    } else {
      Alert.alert("Error", "Registration failed. Please try again.");
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
                  <Text style={styles.modalTitle}>Create Account</Text>
                  <Text style={styles.modalSubtitle}>
                    Sign up to get started
                  </Text>
                </View>

                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Full Name <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChangeText={(text) => handleInputChange("name", text)}
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Email <Text style={styles.required}>*</Text>
                  </Text>
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
                      value={formData.email}
                      onChangeText={(text) => handleInputChange("email", text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Phone Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Phone Number <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="081234567890"
                      value={formData.phone}
                      onChangeText={(text) => handleInputChange("phone", text)}
                      keyboardType="phone-pad"
                      placeholderTextColor="#999"
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Password <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      value={formData.password}
                      onChangeText={(text) =>
                        handleInputChange("password", text)
                      }
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

                {/* Confirm Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Confirm Password <Text style={styles.required}>*</Text>
                  </Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.icon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor="#999"
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.eyeBtn}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                  style={styles.registerBtn}
                  onPress={handleRegister}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.registerBtnText}>Create Account</Text>
                  )}
                </TouchableOpacity>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity
                    onPress={() => router.replace("/(auth)/login")}
                  >
                    <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrapper: {
    width: "90%",
    maxWidth: 440,
    paddingHorizontal: 20,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 28,
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
    marginBottom: 24,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#111",
  },
  modalSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
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
  registerBtn: {
    backgroundColor: "#a00000ff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
    height: 52,
    justifyContent: "center",
  },
  registerBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: "#666",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#a00000ff",
  },
});
