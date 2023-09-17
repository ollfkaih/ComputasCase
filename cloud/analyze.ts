import firebaseApp from './firebase';
import { Trash } from '../components/ResultBox';

const ENDPOINT_ID = '4558491645875585024';
const TOKEN = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_TOKEN;

const url = `https://europe-west4-aiplatform.googleapis.com/v1/projects/${firebaseApp.options.messagingSenderId}/locations/europe-west4/endpoints/${ENDPOINT_ID}:predict`;

type PredictionsData = {
  confidences: number[];
  displayNames: string[];
  ids: string[];
};

export type Prediction = {
  name: string;
  trashType: Trash;
  id: string;
  confidence: number;
};

const trashMap: Record<string, Trash> = {
  Mat: Trash.Matavfall,
  Papir: Trash.Papir,
  Plast: Trash.Plast,
  Rest: Trash.Restavfall,
  Pant: Trash.Pant,
  NeiIkkeKastDen: Trash.NeiIkkeKastDen,
};

export const analyze = async (image: string) => {
  const request = {
    instances: [
      {
        content: image,
      },
    ],
    parameters: {
      confidenceThreshold: 0,
      maxPredictions: 5,
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(request),
  });

  const json = await res.json();
  if (json.error) {
    console.error(json.error);
    return [];
  }
  const predictionData = json.predictions[0] as PredictionsData;

  const predictions: Prediction[] = [];
  for (let i = 0; i < predictionData.ids.length; i++) {
    predictions.push({
      name: predictionData.displayNames[i],
      trashType: trashMap[predictionData.displayNames[i]],
      id: predictionData.ids[i],
      confidence: predictionData.confidences[i],
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
};
