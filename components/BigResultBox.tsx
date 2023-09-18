import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Trash, TrashColors, TrashImages } from './ResultBox';
import Pill from './Pill';
// import {styles} from "../screens/styles";

interface BigResultBoxProps {
  trashType: Trash;
  imageUri?: string;
  trashData: Map<Trash, number>;
  pills?: Array<{ trashType: Trash; percentage: number }>;
}

const BigResultBox: React.FC<BigResultBoxProps> = ({
  trashType,
  imageUri,
  trashData,
  pills,
}) => {
  return (
    <View style={[styles.container, { backgroundColor: TrashColors[trashType] }]}>
      {imageUri && <Image style={styles.mainImage} source={{ uri: imageUri }} />}

      <View style={styles.infoRow}>
        <Image style={styles.icon} source={TrashImages[trashType]} />
        <Text style={styles.text}>{trashType}</Text>
        <Text style={styles.dataText}>{trashData.get(trashType)}%</Text>
      </View>

      <View style={styles.pillsContainer}>
        {pills
          ?.filter((pill) => pill.trashType !== trashType)
          .slice(0, 3)
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
