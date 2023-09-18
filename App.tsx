import React from 'react';
import Navigation from './navigation';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

const App = () => {
  return <Navigation />;
};

export default App;
