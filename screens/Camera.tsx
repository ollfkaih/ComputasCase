import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import Button from '../components/Button';
import ResultBox from '../components/ResultBox';
import { useTfClassification } from '../hooks/useTfClassification';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Tensor3D } from '@tensorflow/tfjs';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const TensorCamera = cameraWithTensors(Camera);

const CameraScreen = ({}: Props) => {
  const [blurred, setBlurred] = useState(false);
  const navigation = useNavigation<Props['navigation']>();
  const cameraRef = useRef(null);
  const [type, setType] = useState(CameraType.back);
  const imageTensor = useRef<Tensor3D>(null);

  useEffect(() => {
    navigation.addListener('blur', () => {
      setBlurred(true);
    });
    navigation.addListener('focus', () => {
      setBlurred(false);
    });
  }, [navigation]);

  const localPredictions = useTfClassification(imageTensor, !blurred);

  const handleCameraStream = useMemo(
    () => (images) => {
      const loop = async () => {
        const tensor = images.next().value;
        if (tensor) {
          imageTensor.current = tensor;
        }

        requestAnimationFrame(loop);
      };
      loop();
    },
    []
  );

  const [permission, requestPermission] = Camera.useCameraPermissions();

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

  const takePicture = (cameraRef: React.RefObject<{ camera: Camera }>) => async () => {
    if (!cameraRef.current) {
      return;
    }

    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current?.camera.takePictureAsync(options);
    navigation.navigate('History', { image: data });
  };

  let textureDims;
  if (Platform.OS === 'ios') {
    textureDims = {
      height: 1920,
      width: 1080,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={type}
        ref={cameraRef}
        // Tensor related props
        resizeHeight={224}
        resizeWidth={224}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
        useCustomShadersToResize={false}
      />
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.prediction}>
          {localPredictions && <ResultBox trashType={localPredictions[0].trashType} />}
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
    </View>
  );
};

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  safeAreaView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 100,
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
