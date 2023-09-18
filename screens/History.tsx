import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { analyze, Prediction } from '../cloud/analyze';
import ResultBox, { Trash } from '../components/ResultBox';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import BigResultBox from '../components/BigResultBox';

const maxSizeInBytes = 1.4 * 1024 * 1024;

const compressAndConvertToBase64 = async (uri, compression) => {
  const compressedImage = await ImageManipulator.manipulateAsync(uri, [], {
    compress: compression,
    format: ImageManipulator.SaveFormat.JPEG,
  });
  const base64Image = await FileSystem.readAsStringAsync(compressedImage.uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { compressedImage, base64ImageLength: base64Image.length };
};

const compressImageToMeetSize = async (uri, compression = 1.0) => {
  let base64ImageLength: number, compressedImage;

  while (true) {
    ({ compressedImage, base64ImageLength } = await compressAndConvertToBase64(
      uri,
      compression
    ));
    if (base64ImageLength <= maxSizeInBytes || compression <= 0.1) {
      break;
    }
    compression /= 2;
  }

  return compressedImage;
};

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen = ({ route: { params } }: Props) => {
  const [predictions, setPredictions] = useState<Prediction[] | 'Loading'>('Loading');
  const image = params?.image;

  const analyzePicture = async (pictureData: string) => {
    const predictions = await analyze(pictureData);
    setPredictions(predictions);
  };

  useEffect(() => {
    const convertUriToBase64AndAnalyze = async () => {
      if (image) {
        const resizedImage = await compressImageToMeetSize(image.uri);
        const base64Data = await FileSystem.readAsStringAsync(resizedImage.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        analyzePicture(base64Data);
      }
    };
    convertUriToBase64AndAnalyze();
  }, [image]);

  console.log('PRED:' + predictions);

  return (
    <SafeAreaView style={styles.container}>
      {image && (
        <View>
          <Text>Current trash 🗑️</Text>
          {/*<BigResultBox trashData={demoData} imageUri={image.uri} />*/}
          {predictions !== 'Loading' ? (
            <BigResultBox trashData={predictions} imageUri={image.uri} />
          ) : (
            <ResultBox trashType={Trash.Loading} imageUri={image.uri} />
          )}
        </View>
      )}
      <Text>
        All the trash you've scanned will be displayed here. You can click on a trash item
        to see more information about it. The information will be displayed in a modal.
        The modal will have a button to close it.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HistoryScreen;
