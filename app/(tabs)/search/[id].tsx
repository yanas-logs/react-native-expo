import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { products } from "../../../data/products";
import { useCartStore } from "../../../store/cartStore";

export default function ProductDetail() {
    const { id } = useLocalSearchParams();

    const addToCart = useCartStore((state) => state.addToCart);

    const product = products.find((item) => item.id === id);

    if (!product) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFound}>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* HEADER BACK */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Product Detail</Text>
            </View>

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <Image 
                source={product.image} 
                style={styles.image} 
                resizeMode="contain" 
                />
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>{product.price}</Text>
                <Text style={styles.description}>
                    {product.description || "No description available."}
                </Text>
            </ScrollView>

            {/* BUTTON AREA */}
            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.favoriteBtn}>
                    <Text style={styles.favoriteText}>♡ Favorite</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.addCartBtn}
                    onPress={() => {
                        addToCart(product);
                        alert("Item added to cart!");
                    }}
                >
                    <Text style={styles.addCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </View>
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
    },
    backText: {
        fontSize: 24,
        fontWeight: "700",
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

    /* Bottom Action Buttons */
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
    },
    addCartBtn: {
        flex: 1.3,
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
});
