import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { analyze, Prediction } from '../cloud/analyze';
import ResultBox, { Trash } from '../components/ResultBox';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const HistoryScreen = ({ route: { params } }: Props) => {
  const [prediction, setPrediction] = useState<Prediction | 'Loading'>('Loading');
  const image = params?.image;

  const analyzePicture = async (pictureData: string) => {
    const predictions = await analyze(pictureData);
    setPrediction(predictions[0]);
  };

  useEffect(() => {
    if (image) {
      analyzePicture(image.base64);
    }
  }, [image]);

  return (
    <SafeAreaView style={styles.container}>
      {image && (
        <View>
          <Text>Current trash 🗑️</Text>
          {prediction !== 'Loading' ? (
            <ResultBox trashType={prediction?.trashType} imageUri={image.uri} />
          ) : (
            <ResultBox trashType={Trash.Loading} imageUri={image.uri} />
          )}
        </View>
      )}
      <Text>
        All the trash you've scanned will be displayed here. You can click on a trash item
        to see more information about it. The information will be displayed in a modal.
        The modal will have a button to close it. The modal will have a button to add the
        trash item to your inventory. The modal will have a button to add the trash item
        to your inventory. The modal will have a button to add the trash item to your
        inventory. The modal will have a button to add the trash item to your inventory.
        The modal will have a button to add the trash item to your inventory. The modal
        will have a button to add the trash item to your inventory. The modal will have a
        button to add the trash item to your inventory. The modal will have a button to
        add the trash item to your inventory. The modal will have a button to add the
        trash item to your inventory. The modal will have a button to add the waste item
        to your inventory. The modal will have a button to add the waste item to your
        inventory. The modal will have a button to add the waste item to your inventory.
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
