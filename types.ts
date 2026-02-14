
export interface UserData {
  id: number;
  name: string;
  balance: number;
  lastAdTime?: number;
}

export interface AppConfig {
  adValue: number;
  welcomeMsg: string;
  minWithdraw: number;
  telegramChannel: string;
}

export interface WithdrawRequest {
  id?: string;
  userId: number;
  userName: string;
  amount: number;
  method: 'Bkash' | 'Nagad';
  number: string;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: number;
}

export type Tab = 'home' | 'tasks' | 'withdraw' | 'profile';
