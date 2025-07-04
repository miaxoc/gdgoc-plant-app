import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, Button, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons for profile/menu
import { RelativePathString, useRouter } from "expo-router";

export default function HomeScreen() {
  const plants = [
    { id: "1", image: require("../assets/plants/plant1.jpg"), notifications: 1 },
    { id: "2", image: require("../assets/plants/plant2.jpg"), notifications: 1 },
    { id: "3", image: require("../assets/plants/plant3.jpg"), notifications: 2 },
  ];

  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome back{"\n"}
        <Text style={{ fontWeight: "bold"}}>TODO: NAME HERE</Text>
      </Text>

      {/* Your Plants Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Plants</Text>
      </View>

      <View style={styles.plantGrid}>
        {plants.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.plantContainer}
            onPress={() => router.push("plant" as RelativePathString)}
          >
            <Image source={item.image} style={styles.plantImage} />
            {item.notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.addPlantButton} onPress={() => router.push("AddPlant1" as RelativePathString)}>
        <Text style={styles.addPlantText}>+ Add Plant</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FAF8F1", paddingHorizontal: 20 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
    appTitle: { fontSize: 18, fontWeight: "bold", color: "#739C6E" },
    welcomeText: { fontSize: 26, fontWeight: "300", marginVertical: 10 },
    sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
    sectionTitle: { fontSize: 20, fontWeight: "bold"},
    seeAll: { color: "#739C6E", fontWeight: "bold" },

    // Plants List
    badge: { position: "absolute", top: 0, right: 0, backgroundColor: "red", borderRadius: 12, width: 24, height: 24, justifyContent: "center", alignItems: "center" },
    badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },

    // Tasks
    taskContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 10, padding: 10, marginVertical: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
    taskImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
    taskText: { flex: 1 },
    taskTitle: { fontSize: 16, fontWeight: "bold" },
    taskAmount: { fontSize: 14, color: "#666" },
    taskFrequency: { fontSize: 12, color: "green" },

    // button to add plant
    addPlantButton: {
      backgroundColor: "#72A579",
      padding: 15,
      borderRadius: 25,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 30,
      marginBottom: 30,
    },

    addPlantText: {
      color: "#FEFCF3",
      fontSize: 16,
      fontWeight: "bold",
    },

    // two column list
    plantGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },

    plantContainer: {
      width: "47%",
      aspectRatio: 1, // keeps square shape
      borderRadius: 10,
      overflow: "hidden",
      marginBottom: 15,
      position: "relative",
    },

    plantImage: {
      width: "100%",
      height: "100%",
      borderRadius: 10,
    },

  });
