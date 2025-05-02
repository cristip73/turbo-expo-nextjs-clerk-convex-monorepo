import { View, Text, StatusBar, Platform } from "react-native";
import { useFonts } from "expo-font";
import { LogBox } from "react-native";
// Reactivăm importul pentru Navigation
import Navigation from "./src/navigation/Navigation";
import ConvexClientProvider from "./ConvexClientProvider";

// Componenta inline nu mai e necesară
// function InlineNavigation() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
//       <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome to Notes App</Text>
//     </View>
//   );
// }

export default function App() {
  LogBox.ignoreLogs(["Warning: ..."]);
  LogBox.ignoreAllLogs();

  try {
    // Reactivăm încărcarea fonturilor
    const [loaded] = useFonts({
      Bold: require("./src/assets/fonts/Inter-Bold.ttf"),
      SemiBold: require("./src/assets/fonts/Inter-SemiBold.ttf"),
      Medium: require("./src/assets/fonts/Inter-Medium.ttf"),
      Regular: require("./src/assets/fonts/Inter-Regular.ttf"),

      MBold: require("./src/assets/fonts/Montserrat-Bold.ttf"),
      MSemiBold: require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
      MMedium: require("./src/assets/fonts/Montserrat-Medium.ttf"),
      MRegular: require("./src/assets/fonts/Montserrat-Regular.ttf"),
      MLight: require("./src/assets/fonts/Montserrat-Light.ttf"),
    });
    
    // Afișăm un indicator vizual pentru încărcarea fonturilor
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue' }}>
          <Text style={{ fontSize: 20 }}>Încărcare fonturi...</Text>
        </View>
      );
    }

    // Adăugăm StatusBar și Navigation cu ConvexClientProvider
    const STATUS_BAR_HEIGHT =
      Platform.OS === "ios" ? 50 : StatusBar.currentHeight;

    // Adăugăm înapoi ConvexClientProvider
    return (
      <ConvexClientProvider>
        <View style={{ flex: 1 }}>
          <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: "#0D87E1" }}>
            <StatusBar
              translucent
              backgroundColor={"#0D87E1"}
              barStyle="light-content"
            />
          </View>
          <Navigation />
        </View>
      </ConvexClientProvider>
    );
  } catch (error) {
    console.error("App error:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Error loading app</Text>
        <Text style={{ color: 'white', fontSize: 12, marginTop: 10 }}>{error?.message || "Unknown error"}</Text>
      </View>
    );
  }
}
