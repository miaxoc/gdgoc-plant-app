import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";


const AddPlantScreen = () => {

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Plant App</Text>

      {/* Title */}
      <Text style={styles.title}>Add new plant</Text>
      <Text style={styles.subtitle}>Our Suggestion...</Text>

      {/* Suggested Plant */}
      <View style={styles.card}>
        <Text style={styles.plantName}>Cherry Tomato</Text>

        {/* Tags */}
        <View style={styles.tagContainer}>
          <Text style={styles.tag}>Beginner</Text>
          <Text style={styles.tag}>Indoor / Outdoor</Text>
          <Text style={styles.tag}>Edible</Text>
        </View>

        {/* Image */}
        <Image
          source={{ uri: "../assets/plants/plant1.jpg" }}
          style={styles.image}
        />

        {/* Description */}
        <Text style={styles.description}>
          A cherry tomato plant is a compact and fast-growing plant known for its vibrant, sweet, and tangy fruit...
        </Text>
      </View>

      {/* Other Section */}
      <Text style={styles.otherTitle}>Other</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>I already have an idea...</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F6EC",
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6B8E23",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 5,
  },
  card: {
    backgroundColor: "#A7C08B",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
  },
  tagContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  tag: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
    fontSize: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: "#fff",
  },
  otherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#A7C08B",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
