import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";


const AddPlantScreen = () => {

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Add new plant</Text>
      <Text style={styles.subtitle}>Our Suggestion...</Text>

      <View style={styles.card}>
        <Text style={styles.plantName}>Cherry Tomato</Text>

        <View style={styles.tagContainer}>
          <Text style={styles.tag}>Beginner</Text>
          <Text style={styles.tag}>Indoor / Outdoor</Text>
          <Text style={styles.tag}>Edible</Text>
        </View>

        <Image
          source={require("../assets/plants/plant1.jpg")}
          style={styles.image}
        />

        <Text style={styles.description}>
          A cherry tomato plant is a compact and fast-growing plant known for its vibrant, sweet, and tangy fruit...
        </Text>
      </View>

      <Text style={styles.otherTitle}>Other</Text>


      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/AddPlant1")}
      >
        <Text style={styles.buttonText}>I already have an idea...</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCF3",
    padding: 20,
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
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#FEFCF3",
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#72A579",
    borderColor: "#FEFCF3",
    borderWidth: 2,
    color: "#FEFCF3",
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
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginTop: 10,
    color: "#FEFCF3",
  },
  otherTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "regular",
    color: "#FEFCF3",
  },
});
export default AddPlantScreen;
