import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { COLORS } from '../constants/styling';

const Home = () => {
  const navigation = useNavigation();

  return (
    // The touchable removes the keyboard if the panel is touched and the keyboard is shown
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <View>
          <Text>Settings</Text>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 20,
    borderColor: COLORS.background,
  },
});

export default Home;
