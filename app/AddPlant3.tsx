import React, { useState } from "react";
import {View, Text, TouchableOpacity, Image, StyleSheet, ScrollView,} from "react-native";
import { useRouter } from "expo-router";

const AddPlant3 = () => {
  const router = useRouter();
  const [showMore, setShowMore] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rose</Text>
      <Text style={styles.subtitle}>Learn about your new plant</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Rose</Text>

        <View style={styles.tagsContainer}>
          <Text style={styles.tag}>Intermediate</Text>
          <Text style={styles.tag}>Outdoor</Text>
          <Text style={styles.tag}>Outdoor</Text>
        </View>

        <Image
          source={require("../assets/plants/plant1.jpg")}
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.description}>
          The rose is a compact and fast-growing plant known for its vibrant,
          sweet, and tangy fruit. It typically grows 2–6 feet tall, with green,
          slightly hairy stems and lush, serrated dark green leaves.
        </Text>

        {showMore && (
          <View style={styles.moreSection}>
            <Text style={styles.moreText}>
              💧 Hydration: Water 2-3 times a week or when the top soil feels dry.{"\n\n"}
              🐛 Common Issues: Susceptible to aphids, powdery mildew, and black spot.{"\n\n"}
              🌤️ Sunlight: Needs 6+ hours of sunlight per day.
            </Text>
          </View>
        )}

        <TouchableOpacity onPress={() => setShowMore(!showMore)}>
          <Text style={styles.moreLink}>{showMore ? "Hide" : "More"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/home")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Home")}>
        <Text style={styles.skipText}>skip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddPlant3;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FEFCF3",
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#72A579",
    borderRadius: 15,
    padding: 15,
    marginBottom: 30,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FEFCF3",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#FEFCF3",
    color: "#72A579",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  description: {
    color: "#FEFCF3",
    fontStyle: "italic",
    fontSize: 14,
  },
  moreSection: {
    marginTop: 10,
  },
  moreText: {
    color: "#FEFCF3",
    fontSize: 14,
    lineHeight: 20,
  },
  moreLink: {
    marginTop: 10,
    color: "#FEFCF3",
    textDecorationLine: "underline",
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  nextButton: {
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 15,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FEFCF3",
  },
  skipText: {
    textAlign: "center",
    fontSize: 14,
    color: "#72A579",
    textTransform: "uppercase",
    fontWeight: "600",
  },
});
