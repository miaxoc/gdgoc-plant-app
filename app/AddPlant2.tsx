import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const AddPlant2 = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>New Plant Added</Text>
      <Text style={styles.plantName}>Rose</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/AddPlant3")}
      >
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => router.push("/AddPlant3")}>
      </TouchableOpacity>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPlant2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#72A579",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FEFCF3",
    marginBottom: 10,
  },
  plantName: {
    fontSize: 22,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#FEFCF3",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FEFCF3",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  buttonText: {
    color: "#72A579",
    fontWeight: "bold",
    fontSize: 16,
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
});
