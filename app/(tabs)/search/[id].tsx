import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { formatRupiah } from "../../../utils/format";
import { products } from "../../../data/products";
import { useCartStore } from "../../../store/cartStore";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const addToCart = useCartStore((state) => state.addToCart);
  const product = products.find((item) => item.id === id);

  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Product not found</Text>
      </View>
    );
  }

  // Function for handle OK
  const handleConfirmAdd = () => {
    addToCart(product);
    setShowSuccess(true);

    // Auto close after 2s
    setTimeout(() => {
      setModalVisible(false);
      setShowSuccess(false);
    }, 2000);
  };

  // Function for handle Cencel
  const handleCancel = () => {
    setModalVisible(false);
    setShowSuccess(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER BacK */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/search")}
          style={styles.backBtn}
        >
          {/* <Ionicons name="arrow-back" size={24} color="#111" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Image
          source={product.image}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatRupiah(product.price)}</Text>
        <Text style={styles.description}>
          {product.description || "No description available."}
        </Text>
      </ScrollView>

      {/* BUTTON AREA */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={18}
              color="#ff6b81"
            />
            <Text style={styles.favoriteText}>Favorite</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addCartBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL WITH TRANSFORM STATE */}
      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setShowSuccess(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {!showSuccess ? (
              // === CONFIRMATION STATE ===
              <>
                <Ionicons name="cart" size={60} color="#4CAF50" />
                <Text style={styles.modalTitle}>Add to Cart?</Text>
                <Text style={styles.modalMessage}>
                  Do you want to add this item to your cart?
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleConfirmAdd}
                  >
                    <Text style={styles.confirmBtnText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // === SUCCESS STATE ===
              <>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.modalTitle}>Success!</Text>
                <Text style={styles.modalMessage}>
                  {product.title} has been added to your cart
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  backBtn: {
    padding: 6,
    paddingRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  image: {
    width: "100%",
    height: 260,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
    color: "#111",
  },
  price: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    color: "#444",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
    marginBottom: 40,
  },
  notFound: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 40,
  },

  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  favoriteBtn: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ff6b81",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  favoriteText: {
    color: "#ff6b81",
    fontWeight: "600",
    fontSize: 14,
    marginRight: 2,
  },
  addCartBtn: {
    flex: 1,
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addCartText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
    minHeight: 220, // Minimum height to prevent "crossing" during transition
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  cancelBtnText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 15,
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
