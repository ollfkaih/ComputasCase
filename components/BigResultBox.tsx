import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Trash, TrashColors, TrashImages } from './ResultBox';
import Pill from './Pill';

// import {styles} from "../screens/styles";

interface BigResultBoxProps {
  imageUri?: string;
  trashData: TrashItem[];
}

export interface trashData {
  trashData: Map<Trash, number>;
}

interface TrashItem {
  confidence: number;
  id: string;
  name: string;
  trashType: Trash | string;
}

function convertToTrashEnum(value: string): Trash {
  if (Object.values(Trash).includes(value as Trash)) {
    return value as Trash;
  }
  // You can throw an error, return a default value, or handle it in other ways if the value isn't a valid Trash type
  throw new Error(`Invalid trash type: ${value}`);
}

const BigResultBox: React.FC<BigResultBoxProps> = ({ imageUri, trashData }) => {
  const pills = trashData
    .map((item) => ({
      trashType: convertToTrashEnum(item.trashType),
      percentage: Math.round(item.confidence * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Extract main trash type
  const mainTrashType = pills[0]?.trashType;
  const mainTrashPercentage = pills[0]?.percentage;

  return (
    <View style={[styles.container, { backgroundColor: TrashColors[mainTrashType] }]}>
      {imageUri && <Image style={styles.mainImage} source={{ uri: imageUri }} />}

      <View style={styles.infoRow}>
        <Image style={styles.icon} source={TrashImages[mainTrashType]} />
        <Text style={styles.text}>{mainTrashType}</Text>
        <Text style={styles.dataText}>{mainTrashPercentage?.toFixed(0)}%</Text>
      </View>

      <View style={styles.pillsContainer}>
        {pills
          .slice(1, 4) // Exclude main trash type and take next three
          .map((pill, index) => (
            <Pill key={index} trashType={pill.trashType} percentage={pill.percentage} />
          ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 5,
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    aspectRatio: 1, // Makes it a square
    marginBottom: 10,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  icon: {
    width: 75,
    height: 75,
  },
  text: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  dataText: {
    flex: 1,
    textAlign: 'right',
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    paddingRight: 20,
  },
  pillsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
});

export default BigResultBox;
