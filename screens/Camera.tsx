import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraCapturedPicture, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { analyze, Prediction } from '../cloud/analyze';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import Button from '../components/Button';
import ResultBox from '../components/ResultBox';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const CameraScreen = ({}: Props) => {
  const navigation = useNavigation<Props['navigation']>();
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const [prediction, setPrediction] = useState<Prediction | 'Loading'>();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [image, setImage] = useState<CameraCapturedPicture | null>(null);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  const analyzePicture = async (pictureData: string) => {
    const predictions = await analyze(pictureData);
    console.log(predictions);
    setPrediction(predictions[0]);
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={{ textAlign: 'center' }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission}>
          <Text>grant permission</Text>
        </Button>
      </SafeAreaView>
    );
  }

  const takePicture = (cameraRef: React.RefObject<Camera>) => async () => {
    if (!cameraRef.current) {
      return;
    }

    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current?.takePictureAsync(options);
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
    <Camera style={styles.camera} type={type} ref={cameraRef}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.prediction}>
          {prediction && prediction !== 'Loading' && (
            <ResultBox trashType={prediction.trashType} />
          )}
        </View>
        <View style={styles.buttonBar}>
          <Button
            icon="list-outline"
            label="Tidligere bilder"
            onPress={() => navigation.navigate('History')}
          />
          <Button icon="camera" label="Ta bilde" onPress={takePicture(cameraRef)} />
        </View>
      </SafeAreaView>
    </Camera>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prediction: {},
  buttonBar: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default CameraScreen;
