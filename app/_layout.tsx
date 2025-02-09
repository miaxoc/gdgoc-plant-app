import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { TouchableOpacity, Text } from "react-native";

export default function Layout() {
  const router = useRouter();
  const pathname = usePathname();  // Get the current pathname
  const isHome = pathname === "/home";  // Check if we're on the 'home' page


  return (
    <Stack
      screenOptions={{
          headerStyle: { backgroundColor: "#FAF8F1" }, // Light background
          headerTitleAlign: "center", // Center title
          headerTitle: () => (
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#6DA36B" }}>
              Plant App
          </Text>
          ),
          headerLeft: () => (
            isHome ? (
              <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => console.log("Open menu")}>
                <Ionicons name="menu" size={28} color="black" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={{ marginLeft: 15 }} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={28} color="black" />
              </TouchableOpacity>
            )
          ),
          headerRight: () => (
          <TouchableOpacity style={{ marginRight: 15 }} onPress={() => router.push("/profile")}>
              <Ionicons name="person-circle-outline" size={28} color="black" />
          </TouchableOpacity>
          ),
      }}
    >
      {/* <Stack.Screen name="index" options={{ title: "Login" }} /> */}
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="view_plants" options={{ title: "Your Plants" }} />
    </Stack>
  );
}
