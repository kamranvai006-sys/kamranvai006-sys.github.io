
import { PredictionResult, ProbabilityMap } from '../types';

export const getCurrentPeriodId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Total seconds in the day
  const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  // Sequence number based on 30s intervals
  const sequence = Math.floor(totalSeconds / 30) + 1;
  const sequenceStr = String(sequence).padStart(4, '0');
  
  // 17-digit logic: YYYYMMDD + 1000 + sequence (padding to reach length)
  // e.g., 20260117 1000 51460
  return `${year}${month}${day}1000${sequenceStr.padStart(5, '0')}`;
};

export const runNeuralVoting = (): PredictionResult => {
  // Simulate 20 logic engines
  let bigVotes = 0;
  let greenVotes = 0;

  for (let i = 0; i < 20; i++) {
    if (Math.random() > 0.48) bigVotes++;
    if (Math.random() > 0.52) greenVotes++;
  }

  return {
    size: bigVotes >= 10 ? 'BIG' : 'SMALL',
    color: greenVotes >= 10 ? 'GREEN' : 'RED',
    probability: 75 + Math.floor(Math.random() * 24)
  };
};

export const generateHeatmap = (): ProbabilityMap => {
  const map: ProbabilityMap = {};
  let total = 0;
  for (let i = 0; i < 10; i++) {
    const val = Math.random() * 100;
    map[i] = val;
    total += val;
  }
  // Normalize
  for (let i = 0; i < 10; i++) {
    map[i] = Math.round((map[i] / total) * 100);
  }
  return map;
};
