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
import { analyze } from '../cloud/analyze';

const takePicture = (cameraRef: React.RefObject<Camera>) => async () => {
  if (!cameraRef.current) {
    return;
  }

  const options = { quality: 0.5, base64: true };
  const data = await cameraRef.current?.takePictureAsync(options);

  return data?.base64;
};

const CameraScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [prediction, setPrediction] = useState<string | 'Loading'>();

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const analyzePicture = async (pictureData: string) => {
    const predictions = await analyze(pictureData);
    console.log(predictions);
    setPrediction(predictions[0].name);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
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
        <SafeAreaView style={styles.container}>
          <Text style={styles.prediction}>{prediction ?? ''}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('History' as never)}
            >
              <Text style={styles.text}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                setPrediction('Loading');
                const pictureData = await takePicture(cameraRef)();
                if (pictureData) await analyzePicture(pictureData);
              }}
            >
              <Text style={styles.text}>Take Picture</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
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
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
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
  prediction: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'black',
    padding: 20,
    color: 'white',
    textAlign: 'center',
  },
});

export default CameraScreen;
