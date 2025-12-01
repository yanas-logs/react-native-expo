import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../../store/authStore";

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={100} color="#ccc" />

        {!isAuthenticated && (
          <>
            <Text style={styles.title}>you are not logged in yet</Text>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}

        {isAuthenticated && (
          <>
            <Text style={styles.title}>{user?.name}</Text>
            <Text style={styles.subtitle}>{user?.email}</Text>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => logout()}
            >
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },

  loginButton: {
    backgroundColor: "blue",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  loginButtonText: { color: "#fff", fontSize: 16 },

  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutButtonText: { color: "#fff", fontSize: 16 },

  title: { fontSize: 22, fontWeight: "700", marginTop: 16 },
  subtitle: { fontSize: 16, marginTop: 4, color: "#666" },
});
