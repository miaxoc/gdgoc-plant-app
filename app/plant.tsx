import React from "react";
import { useLocalSearchParams, RelativePathString, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, TouchableOpacity, ScrollView, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";


export default function PlantDetails() {
    const screenWidth = Dimensions.get("window").width;
    const imageSize = screenWidth * 0.10;

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
        <ScrollView style={{ flex: 1, backgroundColor: "#FAF8F1", padding: 20 }}>

        {/* Plant Image */}
        <View style={{ alignItems: "center", marginTop: 10 }}>
            <Image
                source={plant.imageUrl} // Use require() for local images or { uri: plant.imageUrl } for remote
                style={{ width: imageSize, height: imageSize, borderRadius: 10 }}
                resizeMode="cover"
            />
        </View>

        {/* Plant Name */}
        <Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>{plant.name}</Text>
        <Text style={{ fontSize: 16, fontStyle: "italic", color: "#6DA36B" }}>{plant.scientificName}</Text>

        {/* Hint Section */}
        <View style={{ backgroundColor: "#A7D7A3", padding: 15, borderRadius: 10, marginVertical: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Psss...here's a hint</Text>
            <Text>{plant.hint}</Text>
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
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,

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

        {/* Edit Plant */}

          <TouchableOpacity style={{backgroundColor: "#72A579", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 15}} onPress={() => router.push("UpdatePlant")}>
            <Text style={{ fontSize: 16, fontStyle: "italic", color: "#FEFCF3" }}>Edit Information</Text>
          </TouchableOpacity>

        </ScrollView>

    );
}
