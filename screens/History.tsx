import React, { useContext, useEffect, useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { analyze, Prediction } from '../cloud/analyze';
import ResultBox from '../components/ResultBox';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import BigResultBox from '../components/BigResultBox';
import { Trash } from '../types';
import { TrashContext } from '../TrashContext';

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

  const historicTrash = useContext(TrashContext);

  const analyzePicture = async (pictureData: string) => {
    const predictions = await analyze(pictureData);
    setPredictions(predictions);
    historicTrash.push({
      type: predictions[0].trashType,
      image: image,
    });
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
  }, [image, historicTrash]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} horizontal={false}>
        {image && (
          <View style={styles.screenWidth}>
            {/*<Text>Current trash 🗑️</Text>*/}
            {predictions !== 'Loading' ? (
              <BigResultBox trashData={predictions} imageUri={image.uri} />
            ) : (
              <ResultBox trashType={Trash.Loading} imageUri={image.uri} />
            )}
          </View>
        )}

        {historicTrash.map((trash, index) => (
          <View style={styles.screenWidth} key={index}>
            <ResultBox
              trashType={trash.type}
              imageUri={trash.image?.uri}
              base64Image={trash.image?.base64}
            />
          </View>
        ))}
      </ScrollView>
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
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16, // You can adjust this for padding inside the ScrollView
  },
  screenWidth: {
    width: Dimensions.get('window').width - 32, // Adjust this for the width of the ScrollView
  },
});

export default HistoryScreen;
