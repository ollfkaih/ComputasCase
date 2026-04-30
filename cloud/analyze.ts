import firebaseApp from './firebase';

import { Trash } from '../types';

const ENDPOINT_ID = '5641607356258189312';
const REFRESH_TOKEN = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_REFRESH_TOKEN;
const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET;

const url = `https://europe-west4-aiplatform.googleapis.com/v1/projects/${firebaseApp.options.messagingSenderId}/locations/europe-west4/endpoints/${ENDPOINT_ID}:predict`;

let cachedToken: string | null = process.env.EXPO_PUBLIC_GOOGLE_CLOUD_TOKEN || null;
let tokenExpiry = 0;

const refreshAccessToken = async (): Promise<string> => {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID || '',
      client_secret: CLIENT_SECRET || '',
      refresh_token: REFRESH_TOKEN || '',
      grant_type: 'refresh_token',
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(`Token refresh request failed with status ${response.status}`);
  }

  const data = await response.json();
  if (data.error) {
    throw new Error(
      `Failed to refresh token: ${data.error}${data.error_description ? ` - ${data.error_description}` : ''}`
    );
  }

  if (!data.access_token) {
    throw new Error('Token refresh response did not include an access token');
  }

  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (expiresIn - 60) * 1000;
  return cachedToken;
};

const getAccessToken = async (): Promise<string> => {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }
  return refreshAccessToken();
};

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
  const token = await getAccessToken();

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
      Authorization: `Bearer ${token}`,
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
