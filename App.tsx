
import React, { useState, useEffect, useCallback } from 'react';
import { onValue, set, update, push, get } from 'firebase/database';
import { dbRef } from './firebaseConfig';
import { UserData, AppConfig, Tab, WithdrawRequest } from './types';
import Dashboard from './components/Dashboard';
import Tasks from './components/Tasks';
import Withdraw from './components/Withdraw';
import Profile from './components/Profile';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [config, setConfig] = useState<AppConfig>({
    adValue: 0.5,
    welcomeMsg: "Welcome to Red Guyava!",
    minWithdraw: 20,
    telegramChannel: "https://t.me/red_guyava"
  });
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    // Fix: Access Telegram via window casting to any to avoid TypeScript property error
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#1B2631');
    }
  }, []);

  const fetchAppData = useCallback(async () => {
    try {
      // Fix: Access Telegram via window casting to any to avoid TypeScript property error
      const tg = (window as any).Telegram?.WebApp;
      const tgUser = tg?.initDataUnsafe?.user;
      
      // Fallback for testing outside Telegram
      const userId = tgUser?.id || 12345678; 
      const userName = tgUser?.first_name || "Guest User";

      // 1. Fetch Config
      onValue(dbRef('config'), (snapshot) => {
        if (snapshot.exists()) {
          setConfig(snapshot.val());
        }
      });

      // 2. Fetch/Create User
      const userRef = dbRef(`users/${userId}`);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUser(snapshot.val());
        } else {
          const newUser: UserData = {
            id: userId,
            name: userName,
            balance: 0,
          };
          set(userRef, newUser);
          setUser(newUser);
        }
        setLoading(false);
      }, (err) => {
        console.error("Firebase error:", err);
        setError("Connection failed. Please restart.");
        setLoading(false);
      });

    } catch (err) {
      console.error("Init Error:", err);
      setError("Initialization failed.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppData();
  }, [fetchAppData]);

  const handleReward = async (amount: number) => {
    if (!user) return;
    const newBalance = (user.balance || 0) + amount;
    await update(dbRef(`users/${user.id}`), { balance: newBalance });
  };

  const handleWithdraw = async (withdrawData: Omit<WithdrawRequest, 'id' | 'timestamp' | 'status'>) => {
    if (!user) return;
    
    const request: WithdrawRequest = {
      ...withdrawData,
      status: 'pending',
      timestamp: Date.now()
    };

    const newWithdrawRef = push(dbRef('withdraws'));
    await set(newWithdrawRef, request);
    
    const newBalance = user.balance - withdrawData.amount;
    await update(dbRef(`users/${user.id}`), { balance: newBalance });
    
    return true;
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-[#1B2631] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-t-[#E74C3C] border-gray-700 rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-white">Loading Red Guyava...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1B2631] flex flex-col items-center justify-center p-6 text-center">
        <i className="fas fa-exclamation-triangle text-5xl text-[#E74C3C] mb-4"></i>
        <h2 className="text-xl font-bold text-white mb-2">Oops!</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 guava-gradient rounded-full text-white font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'home' && <Dashboard user={user} config={config} />}
      {activeTab === 'tasks' && <Tasks user={user} config={config} onReward={handleReward} />}
      {activeTab === 'withdraw' && <Withdraw user={user} config={config} onSubmit={handleWithdraw} />}
      {activeTab === 'profile' && <Profile user={user} config={config} />}
    </Layout>
  );
};

export default App;
