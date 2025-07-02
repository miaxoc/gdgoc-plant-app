import React from "react";
import { useLocalSearchParams, RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";


export default function PlantDetails() {
    const screenWidth = Dimensions.get("window").width;
    const imageSize = screenWidth - 40;

    const { id } = useLocalSearchParams(); // Get plant ID from URL
    const router = useRouter();
    // const [plant, setPlant] = useState(null);
    // Temporary Plant for Testing Purposes
    const plant = {
        id: "1",
        name: "Cherry Tomato",
        scientificName: "Some Scientific Name for Cherry Tomato Goes Here",
        hint: "Tomatos are very red...",
        imageUrl: require("../assets/plants/plant1.jpg"),
        notifications: 1,
        tasks: [{id: 1, title: "Water your plant!", subtitle: "This is pretty self explanatory, I think!"}],
        editPlant: "Edit Information"
    };

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchPlantData = async () => {
    //     try {
    //         const response = await fetch(`https://your-api.com/plants/${id}`);
    //         const data = await response.json();
    //         setPlant(data);
    //     } catch (err) {
    //         setError("Failed to fetch plant data.");
    //     } finally {
    //         setLoading(false);
    //     }
    //     };

    //     fetchPlantData();
    // }, [id]);

    // if (loading) {
    //     return <ActivityIndicator size="large" color="#6DA36B" style={{ flex: 1, justifyContent: "center" }} />;
    // }

    // if (error) {
    //     return (
    //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    //         <Text style={{ color: "red" }}>{error}</Text>
    //         <TouchableOpacity onPress={() => router.back()}>
    //         <Text style={{ color: "blue" }}>Go Back</Text>
    //         </TouchableOpacity>
    //     </View>
    //     );
    // }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#FEFCF3", padding: 20 }}>

        {/* Plant Image */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
            <Image
                source={plant.imageUrl} // Use require() for local images or { uri: plant.imageUrl } for remote
                style={{ width: imageSize, height: imageSize, borderRadius: 20 }}
                resizeMode="cover"
            />
        </View>

        {/* Plant Name */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{plant.name}</Text>
          <TouchableOpacity
            onPress={() =>router.push("UpdatePlant")}
            style={{
              backgroundColor: "#72A579",
              padding: 6,
              borderRadius: 8,
            }}
          >
            <Ionicons name="pencil" size={18} color="#FEFCF3" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, fontStyle: "italic", color: "#72A579" }}>{plant.scientificName}</Text>

        {/* Hint Section */}
        <View style={{ backgroundColor: "#72A579", padding: 15, borderRadius: 10, marginVertical: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16, color: "#FEFCF3" }}>Psss...here's a hint</Text>
            <Text style={{color: "#FEFCF3"}}>{plant.hint}</Text>
        </View>

        {/* Tasks Section */}
        <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10 }}>Today's Tasks</Text>
        {plant.tasks.map((task) => (
            <View
            key={task.id}
            style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                padding: 15,
                borderRadius: 10,
                marginVertical: 5,
                borderWidth: 2,
                borderColor: "#72A579",

            }}
            >
            <Ionicons name="menu" size={24} color="#72A579" />
            <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>{task.title}</Text>
                <Text>{task.subtitle}</Text>
            </View>
            <Ionicons name="checkbox-outline" size={24} color="gray" />
            </View>
        ))}

        </ScrollView>

    );
}
