import { CameraCapturedPicture } from 'expo-camera';
import {
  ImageBackground,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { styles } from './styles';

interface PreviewProps {
  photo: CameraCapturedPicture | null;
  savePhoto: () => void;
  retakePhoto: () => void;
}

const CameraPreview = ({ photo, savePhoto, retakePhoto }: PreviewProps) => {
  if (!photo) {
    return null;
  }
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%',
      }}
    >
      <ImageBackground
        source={{ uri: photo && photo.uri }}
        style={{
          flex: 1,
        }}
      />
      <SafeAreaView
        style={{
          flex: 0.07,
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity onPress={retakePhoto} style={styles.button}>
          <Text style={styles.darkText}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={savePhoto} style={styles.button}>
          <Text style={styles.darkText}>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default CameraPreview;
