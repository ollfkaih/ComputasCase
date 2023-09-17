import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, View } from "react-native";
import RandomImageView from "./Views/RandomImageView";

const App = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView>
        <RandomImageView />
        <StatusBar style="auto" />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d28cff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
