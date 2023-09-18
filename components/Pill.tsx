import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Trash, TrashImages } from './ResultBox';

interface Props {
  trashType: Trash;
  percentage: number;
}

const Pill: React.FC<Props> = ({ trashType, percentage }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source={TrashImages[trashType]} />
      <Text style={styles.dataText}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // lay out children horizontally
    width: 90,
    paddingVertical: 5, // for pill shape
    paddingHorizontal: 5, // for pill shape
    backgroundColor: '#f5f5f5',
    borderRadius: 5, // for pill shape
    margin: 5,
    alignItems: 'center', // center items vertically
    justifyContent: 'space-between', // space between trash type and percentage
  },
  icon: {
    width: 30, // Adjust as per your icon's desired size
    height: 30, // Adjust as per your icon's desired size
    marginRight: 0, // Space between icon and text
    borderRadius: 3, // for pill shape
  },
  text: {
    flex: 3, // Gives more space to trash type, adjust if needed
    textAlign: 'left',
    color: '#000', // Changed text color for better visibility
    fontSize: 18,
    fontWeight: 'bold',
  },
  dataText: {
    flex: 1,
    textAlign: 'right',
    color: '#000', // Changed text color for better visibility
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Pill;
