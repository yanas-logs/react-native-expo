import React from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { offers } from "../../data/offers";
import { ItemOffers } from "../../type";

export default function Index() {
  const limitedData = offers.slice(0, 7);

  const renderItem = ({ item, index }: { item: ItemOffers; index: number }) => {
    const isEven = index % 2 === 0;

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: item.color,
            flexDirection: isEven ? "row" : "row-reverse",
          },
        ]}
      >
        {/* TEXT */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.title}</Text>
        </View>

        {/* IMAGE */}
        <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
      </View>
    );
  };

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
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
    height: 200,
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardContent: {
    flex: 1,
    paddingRight: 12,
    paddingLeft: 12,
    justifyContent: "center",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 35,
    fontWeight: "600",
    textAlign: "center",
  },

  cardImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    // resizeMode: "contain",
  },
});
