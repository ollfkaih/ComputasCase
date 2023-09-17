import { MutableRefObject, useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import { Tensor3D } from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { Prediction } from '../cloud/analyze';
import { Trash } from '../components/ResultBox';

const modelJson = require('../tensorflow/model.json');
const modelWeights1 = require('../tensorflow/group1-shard1of3.bin');
const modelWeights2 = require('../tensorflow/group1-shard2of3.bin');
const modelWeights3 = require('../tensorflow/group1-shard3of3.bin');

export const useTfClassification = (
  imageTensor: MutableRefObject<Tensor3D>,
  enabled: boolean
) => {
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);
  const [result, setResult] = useState<Prediction[]>();

  const load = async () => {
    await tf.ready();
    const model = await tf.loadGraphModel(
      bundleResourceIO(modelJson, [modelWeights1, modelWeights2, modelWeights3])
    );
    return model;
  };

  useEffect(() => {
    load().then((model) => analyzeLoop(model));
  }, []);

  const analyzeLoop = async (model) => {
    if (enabledRef.current) {
      if (!imageTensor.current) {
        return;
      }
      const t = imageTensor.current.toFloat().div(tf.scalar(255));
      const t4d = t.expandDims(0);
      const prediction = model.predict(t4d);
      const data = await prediction.data();

      const predictions: Prediction[] = [
        {
          name: 'Mat',
          id: '1',
          trashType: Trash.Matavfall,
          confidence: data[0],
        },
        {
          name: 'Pant',
          id: '1',
          trashType: Trash.Pant,
          confidence: data[1],
        },
        {
          name: 'Papir',
          id: '1',
          trashType: Trash.Papir,
          confidence: data[2],
        },
        {
          name: 'Plast',
          id: '1',
          trashType: Trash.Plast,
          confidence: data[3],
        },
        {
          name: 'Rest',
          id: '1',
          trashType: Trash.Restavfall,
          confidence: data[4],
        },
      ];

      const sorted = predictions.sort((a, b) => b.confidence - a.confidence);
      setResult(sorted);
    }

    setTimeout(() => analyzeLoop(model), 100);
  };

  return result;
};
