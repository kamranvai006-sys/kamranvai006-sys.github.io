
export type PredictionResult = {
  size: 'BIG' | 'SMALL';
  color: 'GREEN' | 'RED';
  probability: number;
};

export type UserAuthStatus = 'UNAUTHENTICATED' | 'SCARED' | 'AUTHENTICATED';

export interface ProbabilityMap {
  [key: number]: number;
}

export interface GameState {
  periodId: string;
  prediction: PredictionResult | null;
  lastGeneratedPeriod: string | null;
  isAnalyzing: boolean;
}

// Fix for services/firebaseService.ts: Export missing UserStatus enum
export enum UserStatus {
  BLOCKED = 'BLOCKED',
  ACTIVE = 'ACTIVE'
}

// Fix for services/predictionService.ts and components/FloatingBox.tsx: Export missing WinGoResult interface
export interface WinGoResult {
  issueNumber: string;
  number: number;
  size: 'BIG' | 'SMALL';
  color: 'green' | 'red' | 'violet';
}

// Fix for services/predictionService.ts: Export missing HistoryResponse interface
export interface HistoryResponse {
  data: {
    list: Array<{
      issueNumber: string;
      number: string;
      colour: string;
    }>;
  };
}

// Fix for components/FloatingBox.tsx: Export missing PredictionState interface
export interface PredictionState {
  nextPeriod: string;
  prediction: 'BIG' | 'SMALL' | null;
  level: 1 | 2 | 3;
  status: 'idle' | 'analyzing' | 'ready';
}
