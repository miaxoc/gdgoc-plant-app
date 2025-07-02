import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
  const [username, setUsername] = useState("Username");
  const [email, setEmail] = useState("plantlover@email.com");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Profile</Text>

      <View style={styles.profileImageContainer}>
        <View style={styles.imageWrapper}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require("../assets/plants/plant1.jpg")
            }
            style={styles.profileImage}
          />
        </View>
        <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
          <Ionicons name="pencil" size={18} color="#FEFCF3" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Username</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder="Enter your username"
          placeholderTextColor="#999"
        />
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          keyboardType="email-address"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={() => router.replace("/profile")}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCF3",
    alignItems: "center",
    padding: 20,
  },

  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#72A579",
    marginBottom: 20,
    alignSelf: "center",
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },

  profileImage: {
    width: "100%",
    height: "100%",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#72A579",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-start",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
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

  saveButton: {
    backgroundColor: "#72A579",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FEFCF3",
  },

  profileImageContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#72A579",
    padding: 5,
    borderRadius: 12,
  },



});
