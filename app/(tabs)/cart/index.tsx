import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React from "react";
import { formatRupiah } from "../../../utils/format";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCartStore } from "../../../store/cartStore";
import { useAuthStore } from "../../../store/authStore";
import { useOrderStore } from "../../../store/orderStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const clearCart = useCartStore((state) => state.clearCart);

  // NEW: Get auth state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  // NEW: Protected Checkout Handler
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // if not yet login, redirect to login
      router.push("/(auth)/login");
    } else {
      // if already login, continue to checkout
      router.push("/(tabs)/cart/checkout");
    }
  };

  const renderItem = ({ item }: any) => {
    const price = Number(item.price);
    const subtotal = price * item.qty;

    return (
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />

        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>{formatRupiah(item.price)}</Text>
          <Text style={styles.subtotal}>
            Subtotal: {formatRupiah(subtotal)}
          </Text>
        </View>

        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => decreaseQty(item.id)}
          >
            <Ionicons
              name={item.qty === 1 ? "remove-circle-outline" : "remove-circle"}
              size={24}
              color={item.qty === 1 ? "#999" : "#333"}
            />
          </TouchableOpacity>

          <Text style={styles.qtyText}>{item.qty}</Text>

          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => addToCart(item)}
          >
            <Ionicons name="add-circle" size={24} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={150} color="#333" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some products to get started!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cart</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearBtn}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cart}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer Total & Checkout */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalPrice}>{formatRupiah(totalPrice)}</Text>
        </View>

        {/* UPDATED: Protected Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout} // NEW: Use protected handler
        >
          <Text style={styles.checkoutText}>
            {isAuthenticated ? "Checkout" : "Process to Checkout"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  clearBtn: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }
      : {
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 2,
        }),
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  subtotal: {
    fontSize: 12,
    fontWeight: "500",
  },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
    marginLeft: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    backgroundColor: "transparent",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: {
    fontSize: 16,
    fontWeight: "700",
    marginHorizontal: 12,
    color: "#111",
    minWidth: 30,
    textAlign: "center",
  },
  removeBtn: {
    padding: 8,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
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
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4CAF50",
  },
  checkoutBtn: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
