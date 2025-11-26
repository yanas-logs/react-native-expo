import { StyleSheet, View, Text } from "react-native";
import React from "react";

const profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
