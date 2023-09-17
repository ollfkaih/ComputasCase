import firebaseApp from './firebase';

const ENDPOINT_ID = '4558491645875585024';
const TOKEN = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_TOKEN;

const url = `https://europe-west4-aiplatform.googleapis.com/v1/projects/${firebaseApp.options.messagingSenderId}/locations/europe-west4/endpoints/${ENDPOINT_ID}:predict`;

type PredictionsData = {
  confidences: number[];
  displayNames: string[];
  ids: string[];
};

type Prediction = {
  name: string;
  id: string;
  confidence: number;
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
  const predictionData = json.predictions[0] as PredictionsData;

  const predictions = [];
  for (let i = 0; i < predictionData.ids.length; i++) {
    predictions.push({
      name: predictionData.displayNames[i],
      id: predictionData.ids[i],
      confidence: predictionData.confidences[i],
    });
  }

  return predictions.sort((a, b) => b.confidence - a.confidence);
};
