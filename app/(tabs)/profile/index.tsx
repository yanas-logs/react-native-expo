import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="person-circle-outline" size={100} color="#ccc" />
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    color: "#111",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
});
