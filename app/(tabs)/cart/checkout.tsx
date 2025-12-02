// app/(tabs)/cart/checkout.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { formatRupiah } from "../../../utils/format";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { useOrderStore } from "../../../store/orderStore";

export default function Checkout() {
  const { user, isAuthenticated } = useAuthStore();
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // cod, transfer
  const [loading, setLoading] = useState(false);

  // Redirect jika belum login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  // Redirect jika cart kosong
  useEffect(() => {
    if (cart.length === 0) {
      Alert.alert("Cart is empty", "Please add items to cart first", [
        { text: "OK", onPress: () => router.replace("/(tabs)/cart") },
      ]);
    }
  }, [cart]);

  // Calculate total
  const totalPrice = cart.reduce((total, item) => {
    const price = Number(item.price);
    return total + price * item.qty;
  }, 0);

  const shippingCost = 100;
  const finalTotal = totalPrice + shippingCost;

  const handlePlaceOrder = () => {
    if (!address || !city || !postalCode) {
      Alert.alert("Error", "Please fill all shipping information");
      return;
    }

    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      // Tambahkan order ke store
      const newOrder = {
        id: Date.now().toString(),
        items: cart, // pakai state cart yang ada
        status: "On Process",
        total: finalTotal, // total yang dihitung
        date: new Date().toISOString(),
      };
      useOrderStore.getState().addOrder(newOrder);

      // Clear cart setelah order
      clearCart();

      setLoading(false);

      // Tampilkan alert & redirect ke order history
      Alert.alert(
        "Order Placed!",
        `Your order has been placed successfully.\n\nOrder ID: ORD${newOrder.id}`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/profile/order_history"),
          },
        ],
      );
    }, 1500);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{user?.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={20} color="#666" />
              <Text style={styles.infoText}>{user?.email}</Text>
            </View>
            {user?.phone && (
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#666" />
                <Text style={styles.infoText}>{user.phone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Shipping Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>

          <TextInput
            style={styles.input}
            placeholder="Street Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={setCity}
            placeholderTextColor="#999"
          />

          <TextInput
            style={styles.input}
            placeholder="Postal Code"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          {/*
          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "cod" && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod("cod")}
          >
            
            <View style={styles.paymentOptionContent}>
              <Ionicons name="cash-outline" size={24} color="#111" />
              <View style={styles.paymentOptionText}>
                <Text style={styles.paymentOptionTitle}>Cash on Delivery</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Pay when you receive
                </Text>
              </View>
            </View>
            {paymentMethod === "cod" && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
            
          </TouchableOpacity>
          */}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              paymentMethod === "transfer" && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod("transfer")}
          >
            <View style={styles.paymentOptionContent}>
              <Ionicons name="card-outline" size={24} color="#111" />
              <View style={styles.paymentOptionText}>
                <Text style={styles.paymentOptionTitle}>Bank Transfer</Text>
                <Text style={styles.paymentOptionSubtitle}>
                  Pay via bank transfer
                </Text>
              </View>
            </View>
            {paymentMethod === "transfer" && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(totalPrice)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>
                {formatRupiah(shippingCost)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelTotal}>Total</Text>
              <Text style={styles.summaryValueTotal}>
                {formatRupiah(finalTotal)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>
            {loading ? "Processing..." : "Place Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#111",
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionActive: {
    borderColor: "#4CAF50",
  },
  paymentOptionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentOptionText: {
    marginLeft: 12,
  },
  paymentOptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
    marginBottom: 2,
  },
  paymentOptionSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: "#666",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 8,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  summaryValueTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px -2px 8px rgba(0, 0, 0, 0.1)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          elevation: 5,
        }),
  },
  placeOrderBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
