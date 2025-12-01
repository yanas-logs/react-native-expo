import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";

export default function Checkout() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  // Get auth state dan actions
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout); // Import logout

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [isChecking, setIsChecking] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      setIsChecking(true);

      // Delay transition
      await new Promise((resolve) => setTimeout(resolve, 300));

      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to login...");
        router.push("/(auth)/login");
      } else if (user) {
        // Auto-fill form with user data
        setFormData({
          name: user.name,
          phone: user.phone,
          address: user.address || "",
          notes: "",
        });
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [isAuthenticated, user]); // Add dependencies

  // Calculate total
  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
    return total + price * item.qty;
  }, 0);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // handleLogout outside handleCheckout
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout(); // Call async logout
          router.replace("/(tabs)/cart");
        },
      },
    ]);
  };

  const handleCheckout = () => {
    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Format order for WhatsApp
    const orderItems = cart
      .map((item) => `• ${item.title} (x${item.qty}) - ${item.price}`)
      .join("\n");

    const message = `
🛒 *NEW ORDER*

*Customer Details:*
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
${formData.notes ? `Notes: ${formData.notes}` : ""}

*Order Items:*
${orderItems}

*Total: Rp ${totalPrice.toLocaleString("id-ID")}*
    `.trim();

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // Owner's WhatsApp number
    const ownerWhatsApp = "4201234567890";

    // WhatsApp URL
    const whatsappUrl = `https://wa.me/${ownerWhatsApp}?text=${encodedMessage}`;

    // Open WhatsApp
    if (Platform.OS === "web") {
      window.open(whatsappUrl, "_blank");
      Alert.alert("Order Sent!", "Your order has been sent via WhatsApp", [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.push("/(tabs)/index");
          },
        },
      ]);
    } else {
      // For mobile (will need Linking API in production)
      Alert.alert("Order Placed!", "Your order will be sent via WhatsApp", [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.push("/(tabs)/index");
          },
        },
      ]);
    }
  };

  // Show loading while checking auth
  if (isChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a00000ff" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // If not authenticated, show placeholder (redirect handled by useEffect)
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="lock-closed-outline" size={80} color="#ccc" />
          <Text style={styles.loadingText}>Authentication Required</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Info Banner */}
        <View style={styles.userBanner}>
          <Ionicons name="person-circle" size={50} color="#a00000ff" />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutBtn}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {cart.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <Text style={styles.itemName}>
                {item.title} (x{item.qty})
              </Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>
              Rp {totalPrice.toLocaleString("id-ID")}
            </Text>
          </View>
        </View>

        {/* Customer Details Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Full Name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Phone Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="081234567890"
              value={formData.phone}
              onChangeText={(text) => handleInputChange("phone", text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Delivery Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full address"
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special requests?"
              value={formData.notes}
              onChangeText={(text) => handleInputChange("notes", text)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#2196F3" />
          <Text style={styles.infoText}>
            Order will be sent via message. Pay after confirmation.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton}>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout}>
          <MaterialIcons name="payments" size={20} color="#fff" />
          <Text style={styles.checkoutBtnText}>Process to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#008000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  userBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#666",
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  logoutBtn: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#eee",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
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
  input: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: "#111",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#E3F2FD",
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: "#1976D2",
  },
  bottomButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  checkoutBtn: {
    backgroundColor: "#25D366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  checkoutBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
