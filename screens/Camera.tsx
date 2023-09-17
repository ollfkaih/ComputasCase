import React, { useRef, useState } from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { analyze } from '../cloud/analyze';
import CameraPreview from './CameraPreview';
import { styles } from './styles';

const CameraScreen = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [prediction, setPrediction] = useState<string | 'Loading'>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [image, setImage] = useState<CameraCapturedPicture | null>(null);

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

  const takePicture = (cameraRef: React.RefObject<Camera>) => async () => {
    if (!cameraRef.current) {
      return;
    }

    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current?.takePictureAsync(options);
    console.log(data);
    setPreviewVisible(true);
    setImage(data);
    return data?.base64;
  };

  const retakePicture = () => {
    setPreviewVisible(false);
    setImage(null);
  };

  const savePicture = () => {
    setPreviewVisible(false);
  };

  return (
    <View style={styles.flex}>
      {previewVisible && image ? (
        CameraPreview({
          photo: image,
          retakePhoto: retakePicture,
          savePhoto: savePicture,
        })
      ) : (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <SafeAreaView style={styles.buttonContainer}>
            <Text style={styles.prediction}>{prediction ?? ''}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('History' as never)}
            >
              <Text style={styles.text}>History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={takePicture(cameraRef)}>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={takePicture(cameraRef)}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                    }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </Camera>
      )}
    </View>
  );
};

export default CameraScreen;
