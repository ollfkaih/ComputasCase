import { CameraCapturedPicture } from 'expo-camera';

export enum Trash {
  Matavfall = 'Matavfall',
  Restavfall = 'Restavfall',
  Papir = 'Papir',
  Plast = 'Plast',
  Pant = 'Pant',
  NeiIkkeKastDen = 'Nei ikke kast den!',
  Loading = 'Loading...',
}

export const TrashColors = {
  [Trash.Matavfall]: '#4CA75E',
  [Trash.Restavfall]: '#000',
  [Trash.Papir]: '#3E8CC0',
  [Trash.Plast]: '#8A297E',
  [Trash.Pant]: '#151410',
  [Trash.NeiIkkeKastDen]: '#f52323',
  [Trash.Loading]: '#888888',
};
export const TrashImages = {
  [Trash.Matavfall]: require('./assets/icons/Matavfall.png'),
  [Trash.Restavfall]: require('./assets/icons/Restavfall.png'),
  [Trash.Papir]: require('./assets/icons/Papp.png'),
  [Trash.Plast]: require('./assets/icons/Plast.png'),
  [Trash.Pant]: require('./assets/icons/Pant.png'),
  [Trash.NeiIkkeKastDen]: require('./assets/icons/NeiIkkeKastDen.png'),
  [Trash.Loading]: require('./assets/icons/Loading.png'),
};

export type TrashItems = {
  type: Trash;
  image: CameraCapturedPicture;
};
