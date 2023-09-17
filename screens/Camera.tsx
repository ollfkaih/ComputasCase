import React, { useRef, useState } from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

const takePicture = (cameraRef: React.RefObject<Camera>) => async () => {
  if (!cameraRef.current) {
    return;
  }

  const options = { quality: 0.5, base64: true };
  const data = await cameraRef.current?.takePictureAsync(options);
  console.log(data.base64);
};

const CameraScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.flex}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <SafeAreaView style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('History' as never, {})}
          >
            <Text style={styles.text}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture(cameraRef)}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CameraScreen;
