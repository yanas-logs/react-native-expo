import { Link } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { products } from "../../../data/products";

const Search = () => {
  const renderItem = ({ item }: any) => (
    <Link href={`/(tabs)/search/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <Text style={styles.productName}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}></Text>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffe",
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 16,
    color: "#000",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 40,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    padding: 12,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 8px rgba(0,0,0,0.1)" }
      : {
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
      }),
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    // resizeMode: "contain",
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  price: {
    fontSize: 13,
    fontWeight: "500",
    color: "#444",
  },
});
