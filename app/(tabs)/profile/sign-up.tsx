import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "../../../store/authStore";

export default function Signup() {
  const { signup } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required to be filled in.");
      return;
    }

    try {
      setLoading(true);
      await signup({ name, email, password });
      Alert.alert("Success", "Account created successfully.");
      router.replace("/(tabs)/profile/index"); // redirect to profile
    } catch (err) {
      Alert.alert(
        "Signup Failed",
        "An error occurred while creating an account.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Ionicons
        name="person-circle-outline"
        size={150}
        color="#bbb"
        style={{ marginBottom: 10 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.signupButton}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.signupButtonText}>
          {loading ? "Signing up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={{ color: "#a00000ff", fontWeight: "700" }}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  signupButton: {
    width: "100%",
    backgroundColor: "#a00000ff",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  signupButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginText: { fontSize: 14, marginTop: 10, color: "#555" },
});
