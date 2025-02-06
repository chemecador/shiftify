import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EventScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TODO...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default EventScreen;
