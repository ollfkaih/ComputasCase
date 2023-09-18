import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Trash, TrashColors, TrashImages } from '../types';

type ResultBoxProps = {
  trashType: Trash;
  base64Image?: string;
  imageUri?: string;
};

const ResultBox: React.FC<ResultBoxProps> = ({
  trashType,
  imageUri,
  base64Image,
}: ResultBoxProps) => {
  return (
    <View style={[styles.container, { backgroundColor: TrashColors[trashType] }]}>
      <Image style={styles.icon} source={TrashImages[trashType]} />
      <Text style={styles.text}>{trashType}</Text>
      {imageUri ? (
        <Image style={styles.image} source={{ uri: imageUri }} />
      ) : (
        <Image
          style={styles.image}
          source={{ uri: `data:image/png;base64,${base64Image}` }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5', // Light gray (for better visibility)
    borderRadius: 8,
    margin: 5,
    justifyContent: 'space-between',
  },
  icon: {
    width: 75,
    height: 75,
    flex: 1,
    alignSelf: 'center',
  },
  text: {
    flex: 3, // Gives the text more space, adjust as needed
    textAlign: 'left',
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
    paddingLeft: 20,
  },
  image: {
    width: 75,
    height: 75,
    flex: 1,
    alignSelf: 'flex-end',
    borderColor: '#fff',
    borderWidth: 3,
    borderRadius: 8,
  },
});

export default ResultBox;
