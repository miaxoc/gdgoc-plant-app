import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Button } from "react-native";
import { RelativePathString, useRouter } from "expo-router";

export default function LoginScreen() {

  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  return (
    <ImageBackground source={require("../assets/background/leaf-bg.jpeg")} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to</Text>
        <Text style={styles.title}>Plant App</Text>

        <View style={styles.formContainer}>
          {isSignUp && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} placeholder="John Doe" placeholderTextColor="#000" />
              <Text style={styles.label}>Email</Text>
              <TextInput style={styles.input} placeholder="example@mail.com" keyboardType="email-address" placeholderTextColor="#000" />
            </>
          )}

          <Text style={styles.label}>Username</Text>
          <TextInput style={styles.input} placeholder="username" placeholderTextColor="#000" />

          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} placeholder="********" secureTextEntry placeholderTextColor="#000" />
 
          <TouchableOpacity style={styles.button}>
            {/* TODO: Update this with the actual functinoality */}
            <Text style={styles.buttonText}>{isSignUp ? "Sign Up" : "Login"}</Text>
          </TouchableOpacity>

          <Button title="DEBUG: Button that takes you to the 'next' page" onPress={() => router.push("home" as RelativePathString)} />

          <Text style={styles.signupText}>
            {isSignUp ? "Already have an account? " : "I’m new "}
            <Text style={styles.signupLink} onPress={() => setIsSignUp(!isSignUp)}>
              {isSignUp ? "Login" : "Sign up"}
            </Text>
          </Text>
        </View>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#FAF8F1",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5, // For Android shadow
  },
  label: {
    alignSelf: "flex-start",
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    width: "100%",
    backgroundColor: "#739C6E",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    fontSize: 14,
    marginTop: 15,
    color: "#333",
  },
  signupLink: {
    color: "#739C6E",
    fontWeight: "bold",
  },
});
