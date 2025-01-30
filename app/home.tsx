import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Icons for profile/menu
import { RelativePathString, useRouter } from "expo-router";


export default function HomeScreen() {

  const router = useRouter();

  const plants = [
    { id: "1", image: require("../assets/plants/plant1.jpg"), notifications: 4 },
    { id: "2", image: require("../assets/plants/plant2.jpg"), notifications: 1 },
    { id: "3", image: require("../assets/plants/plant3.jpg"), notifications: 0 },
  ];

  const tasks = [
    { id: "1", category: "Hydration", title: "Cherry Tomato", amount: "100ml", frequency: "Weekly", completed: false, image: require("../assets/plants/plant1.jpg") },
    { id: "2", category: "Hydration", title: "Flower", amount: "50ml", frequency: "Daily", completed: true, image: require("../assets/plants/plant3.jpg") },
    { id: "3", category: "Sunlight Time", title: "Mint", amount: "30 minutes", frequency: "Daily", completed: false, image: require("../assets/plants/plant2.jpg") },
    { id: "4", category: "Routine check", title: "Basil", amount: "Check Leaves for spots", frequency: "", completed: false, image: require("../assets/plants/plant3.jpg") },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Welcome back{"\n"}<Text style={{ fontWeight: "bold" }}>TODO: NAME HERE</Text></Text>

      {/* Your Plants Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Plants</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll} onPress={() => router.push("view_plants" as RelativePathString)} >See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        data={plants}
        renderItem={({ item }) => (
          <View style={styles.plantContainer}>
            <Image source={item.image} style={styles.plantImage} />
            {item.notifications > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.notifications}</Text>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />

      {/* Today's Tasks */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Tasks</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      {tasks.map((task, index) => (
        <View key={index} style={styles.taskContainer}>
          <Image source={task.image} style={styles.taskImage} />
          <View style={styles.taskText}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.taskAmount}>{task.amount}</Text>
            {task.frequency ? <Text style={styles.taskFrequency}>{task.frequency}</Text> : null}
          </View>
          <TouchableOpacity>
            <Ionicons name={task.completed ? "checkbox" : "square-outline"} size={24} color={task.completed ? "green" : "black"} />
          </TouchableOpacity>
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F1", paddingHorizontal: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
  appTitle: { fontSize: 18, fontWeight: "bold", color: "#739C6E" },
  welcomeText: { fontSize: 26, fontWeight: "300", marginVertical: 10 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: "bold" },
  seeAll: { color: "#739C6E", fontWeight: "bold" },
  
  // Plants List
  plantContainer: { marginRight: 15, position: "relative" },
  plantImage: { width: 80, height: 80, borderRadius: 10 },
  badge: { position: "absolute", top: -5, right: -5, backgroundColor: "red", borderRadius: 12, width: 24, height: 24, justifyContent: "center", alignItems: "center" },
  badgeText: { color: "white", fontSize: 12, fontWeight: "bold" },

  // Tasks
  taskContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "white", borderRadius: 10, padding: 10, marginVertical: 5, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 2 },
  taskImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  taskText: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "bold" },
  taskAmount: { fontSize: 14, color: "#666" },
  taskFrequency: { fontSize: 12, color: "green" },
});

