import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

const HistoryScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
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
