import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const AddPlant1 = () => {
  const [selectedAge, setSelectedAge] = useState("Seed");
  const [speciesName, setSpeciesName] = useState("");
  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState("");

  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new plant</Text>

      <Text style={styles.subtitle}>Choose Plant</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type species name or select a file"
          style={styles.input}
          placeholderTextColor="#999"
          value={speciesName}
          onChangeText={setSpeciesName}
        />
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="images-outline" size={24} color="#72A579" />
        </TouchableOpacity>
      </View>

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, borderRadius: 10, marginBottom: 20 }}
        />
      )}

      <Text style={styles.subtitle}>Nickname</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Give your plant a nickname"
          style={styles.input}
          placeholderTextColor="#999"
          value={nickname}
          onChangeText={setNickname}
        />
      </View>

      <Text style={styles.subtitle}>Choose Age</Text>
      <View style={styles.ageContainer}>
        {["Seed", "Growing", "Fully grown"].map((stage, index) => {
          const isSelected = selectedAge === stage;
          const iconName =
            stage === "Seed"
              ? "ellipsis-horizontal"
              : stage === "Growing"
              ? "leaf-outline"
              : "flower-outline";

          return (
            <TouchableOpacity
              key={index}
              style={[styles.ageButton, isSelected && styles.selected]}
              onPress={() => setSelectedAge(stage)}
            >
              <Ionicons
                name={iconName}
                size={28}
                color={isSelected ? "#FEFCF3" : "#72A579"}
              />
              <Text
                style={isSelected ? styles.ageTextSelected : styles.ageText}
              >
                {stage}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={() => router.push("/AddPlant2")}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPlant1;

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

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#72A579",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 20,
    justifyContent: "space-between",
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  ageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 30,
  },

  ageButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#72A579",
    borderRadius: 15,
    paddingVertical: 20,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEFCF3",
  },

  selected: {
    backgroundColor: "#72A579",
  },

  ageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },

  ageTextSelected: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FEFCF3",
    marginTop: 10,
  },

  nextButton: {
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },

  nextText: {
    fontSize: 16,
    color: "#FEFCF3",
  },
});
