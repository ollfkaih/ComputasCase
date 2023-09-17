import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/Camera';
import HistoryScreen from '../screens/History';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name="Home" component={CameraScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
