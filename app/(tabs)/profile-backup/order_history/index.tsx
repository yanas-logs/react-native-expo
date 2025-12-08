import { View, Text, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrderStore } from "../../../../store/orderStore";
import { formatRupiah } from "../../../../utils/format";

export default function OrderScreen() {
  const orders = useOrderStore((state) => state.orders);

  const renderItem = ({ item }: { item: any }) => {
    const isDelivered = item.status === "Delivered";

    return (
      <View
        style={{
          padding: 18,
          marginBottom: 12,
          borderRadius: 12,
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 6,
          elevation: 3,
          borderWidth: 1,
          borderColor: "#eee",
        }}
      >
        {/* Order Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            Order #{item.id}
          </Text>

          <Text
            style={{
              fontWeight: "600",
              color: isDelivered ? "#2ecc71" : "#3498db",
            }}
          >
            {item.status}
          </Text>
        </View>

        <Text style={{ color: "#666", marginBottom: 6 }}>
          {new Date(item.date).toLocaleDateString()}
        </Text>

        {/* Product List */}
        <View
          style={{
            backgroundColor: "#fafafa",
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
          }}
        >
          <FlatList
            data={item.items}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            renderItem={({ item: product }) => (
              <Text
                style={{
                  marginBottom: 4,
                  fontSize: 14,
                  color: "#333",
                }}
              >
                {product.title} x {product.qty} ={" "}
                {formatRupiah(product.price * product.qty)}
              </Text>
            )}
          />
        </View>

        {/* Shipping */}
        {item.shippingCost && (
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ color: "#555" }}>Shipping</Text>
            <Text style={{ fontWeight: "500" }}>
              {formatRupiah(item.shippingCost)}
            </Text>
          </View>
        )}

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "#eaeaea",
            marginVertical: 10,
          }}
        />

        {/* Total */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>Total</Text>
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {formatRupiah(item.total)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}
