import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Profile() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <View style={styles.card}>
        <View style={styles.profileImage}>
          <Image
            // place holder profile pic
            source={require("../assets/plants/plant1.jpg")}
            style={styles.image}
          />
        </View>

        {/* place holder username + email */}
        <Text style={styles.userName}>Username</Text>
        <Text style={styles.email}>plantlover@email.com</Text>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/")}
        >
          <Text style={styles.buttonText}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEFCF3",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#72A579",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#72A579",
    width: "100%",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FEFCF3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  userName: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#FEFCF3",
    fontWeight: "bold",
    marginBottom: 5,
  },

  email : {
    color: "#FEFCF3",
    fontSize: 14,
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#FEFCF3",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },

  buttonText: {
    color: "#72A579",
    fontWeight: "bold",
    fontSize: 16,
  },

});
