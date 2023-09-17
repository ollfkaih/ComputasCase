import { SafeAreaView, StyleSheet } from 'react-native';
import Navigation from './navigation';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Navigation />
      {/*<StatusBar style="auto" />*/}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
