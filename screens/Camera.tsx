import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import Button from '../components/Button';
import ResultBox, { Trash } from '../components/ResultBox';
import { useTfClassification } from '../hooks/useTfClassification';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import { Tensor3D } from '@tensorflow/tfjs';
import ShutterButton from '../components/ShutterButton';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

type Props = NativeStackScreenProps<RootStackParamList, 'Camera'>;

const TensorCamera = cameraWithTensors(Camera);

const speakMap = {
  [Trash.Restavfall]: 'Restavfall',
  [Trash.Matavfall]: 'Matavfall',
  [Trash.Papir]: 'Papir',
  [Trash.Plast]: 'Plast',
  [Trash.Pant]: 'Pant',
  [Trash.NeiIkkeKastDen]: 'Nei, ikke kast den!',
};

const speak = async (thingToSay: string) => {
  await Speech.stop();
  Speech.speak(thingToSay, { language: 'no' });
};

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

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const localPredictions = useTfClassification(imageTensor, !blurred);

  useEffect(() => {
    if (localPredictions?.[0]?.trashType) {
      speak(speakMap[localPredictions[0].trashType]);
    }
  }, [localPredictions?.[0]?.trashType]);

  const handleCameraStream = useMemo(
    () => (images) => {
      const delay = 1000;
      const loop = async () => {
        const tensor = images.next().value;
        if (tensor) {
          imageTensor.current = tensor;
        }
        setTimeout(() => {
          requestAnimationFrame(loop);
        }, delay);
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // get base64 string of the image and navigate to history screen
      navigation.navigate('History', { image: result.assets[0] });
    }
  };

  let textureDims;
  if (Platform.OS === 'ios') {
    textureDims = {
      height: Dimensions.get('window').height,
      width: Dimensions.get('window').width,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
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
      </View>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.prediction}>
          {localPredictions && <ResultBox trashType={localPredictions[0].trashType} />}
        </View>
        <View style={styles.buttonBar}>
          <Button
            icon="list-outline"
            label=""
            onPress={() => navigation.navigate('History')}
          />
          <ShutterButton onPress={takePicture(cameraRef)} />
          <Button icon="image" label="" onPress={pickImage} />
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  cameraContainer: {
    height: '100%',
    aspectRatio: 9 / 16,
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
    width: '60%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default CameraScreen;
