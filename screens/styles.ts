import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  flex: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  darkText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  prediction: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'black',
    padding: 20,
    color: 'white',
    textAlign: 'center',
    width: '100%',
  },
});
