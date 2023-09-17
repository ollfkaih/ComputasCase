import { Image, Text, View } from "react-native";

const RandomImageView = () => (
  <>
    <Text>Open up App.tsx to start working on your app!</Text>
    <View style={{ height: 50 }} />
    <Image
      source={require("../assets/favicon.png")}
      style={{ width: 305, height: 159 }}
      resizeMode="contain"
    />
  </>
);

export default RandomImageView;
