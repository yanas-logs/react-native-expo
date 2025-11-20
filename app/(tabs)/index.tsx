import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { offers } from "../../data/offers";
import { Item } from "../../type";

export default function Index() {
  const limitedData = offers.slice(0, 7);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={limitedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
    height: 200,
    width: "100%",
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
