import React, { useContext } from 'react';
import Navigation from './navigation';
import { LogBox } from 'react-native';
import { TrashItems } from './types';
import { TrashContext } from './TrashContext';

LogBox.ignoreAllLogs(true);

const App = () => {
  const historicTrash = useContext<TrashItems[]>(TrashContext);
  return (
    <TrashContext.Provider value={historicTrash}>
      <Navigation />
    </TrashContext.Provider>
  );
};

export default App;
