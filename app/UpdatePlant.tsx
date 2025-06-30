import React, { useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const UpdatePlant = () => {
  // place holders
  const [nickname, setNickname] = useState("Cherry Tomato");
  const [selectedStage, setSelectedStage] = useState("Seed");
  const [notes, setNotes] = useState("");

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Plant</Text>
      <Text style={styles.label}>Nickname</Text>
      <View style={styles.inputContainer}>
      <TextInput
          value={nickname}
          onChangeText={setNickname}
          style={styles.input}
          placeholder="Nickname"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.stageGroup}>
        {["Seed", "Growing", "Fully grown"].map((stage, index) => {
          const isSelected = selectedStage === stage;
          const iconName =
            stage === "Seed"
              ? "ellipsis-horizontal"
              : stage === "Growing"
              ? "leaf-outline"
              : "flower-outline";

          return (
            <TouchableOpacity
              key={index}
              style={[styles.stageButton, isSelected && styles.selectedStage]}
              onPress={() => setSelectedStage(stage)}
            >
              <Ionicons
                name={iconName}
                size={28}
                color={isSelected ? "#FEFCF3" : "#72A579"}
              />
              <Text style={isSelected ? styles.stageTextSelected : styles.stageText}>
                {stage}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Notes</Text>
      <TextInput
        value={notes}
        onChangeText={setNotes}
        style={styles.textArea}
        placeholder="Add any care notes here..."
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
      />

      <TouchableOpacity style={styles.saveButton} onPress={() => router.replace("/plant")}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdatePlant;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCF3",
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#72A579",
    marginBottom: 20,
    alignSelf: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#72A579",
    marginTop: 10,
    marginBottom: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    backgroundColor: "#FFF",
    borderColor: "#72A579",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    justifyContent: "space-between",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },

  stageGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  stageButton: {
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

  selectedStage: {
    backgroundColor: "#72A579",
  },

  stageText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },

  stageTextSelected: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FEFCF3",
    marginTop: 10,
  },

  textArea: {
    height: 100,
    borderColor: "#72A579",
    borderWidth: 2,
    borderRadius: 20,
    padding: 15,
    textAlignVertical: "top",
    fontSize: 16,
    backgroundColor: "#FFF",
    marginBottom: 30,
  },

  saveButton: {
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },

  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FEFCF3",
  },
});
