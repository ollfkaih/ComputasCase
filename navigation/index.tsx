import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/Camera';
import HistoryScreen from '../screens/History';
import { CameraCapturedPicture } from 'expo-camera';
import { ImagePickerAsset } from 'expo-image-picker/src/ImagePicker.types';

export type RootStackParamList = {
  Camera: undefined;
  History: undefined | { image: CameraCapturedPicture | ImagePickerAsset };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Camera">
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }} // Hide the header
      />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Navigation;
