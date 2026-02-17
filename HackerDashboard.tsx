
import React, { useState, useEffect, useRef } from 'react';
import { getCurrentPeriodId, runNeuralVoting, generateHeatmap } from '../services/apiService';
import { GameState, ProbabilityMap } from '../types';
import { Terminal, ShieldAlert, Zap, BarChart3, Binary, Lock, Unlock } from 'lucide-react';

const HackerDashboard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    periodId: getCurrentPeriodId(),
    prediction: null,
    lastGeneratedPeriod: null,
    isAnalyzing: false
  });
  const [heatmap, setHeatmap] = useState<ProbabilityMap>(generateHeatmap());
  const [hackerText, setHackerText] = useState<string[]>([]);

  // Sync Period
  useEffect(() => {
    const timer = setInterval(() => {
      const newId = getCurrentPeriodId();
      if (newId !== gameState.periodId) {
        setGameState(prev => ({
          ...prev,
          periodId: newId,
          prediction: null // Reset prediction on new period
        }));
        setHeatmap(generateHeatmap());
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.periodId]);

  // Hacker terminal background text
  useEffect(() => {
    const texts = ["Hackered by Mr team", "Mr Jim Hack", "Bypassing firewall...", "Injection successful", "Decoding data...", "MR TRADERS ACCESS"];
    const interval = setInterval(() => {
      setHackerText(prev => {
        const next = [...prev, texts[Math.floor(Math.random() * texts.length)]];
        return next.slice(-40); // Keep last 40 lines
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const handleGuess = async () => {
    if (gameState.lastGeneratedPeriod === gameState.periodId) {
      alert("Signal already generated for this period! Wait for the next one.");
      return;
    }

    setGameState(prev => ({ ...prev, isAnalyzing: true }));
    
    // Simulate complex analysis
    await new Promise(r => setTimeout(r, 2000));
    
    const result = runNeuralVoting();
    setGameState(prev => ({
      ...prev,
      prediction: result,
      lastGeneratedPeriod: prev.periodId,
      isAnalyzing: false
    }));
  };

  const isLocked = gameState.lastGeneratedPeriod === gameState.periodId;

  return (
    <div className="relative min-h-screen p-4 md:p-8 flex flex-col items-center">
      <div className="hacker-bg"></div>
      <div className="scanline"></div>
      
      {/* Scrolling Text Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-10 overflow-hidden text-[10px] leading-tight font-mono whitespace-pre text-green-500 p-2">
        {hackerText.map((t, i) => <div key={i}>{t}</div>)}
      </div>

      <header className="w-full max-w-4xl flex justify-between items-center mb-12 relative">
        <div className="flex flex-col">
          <h1 className="horror-font text-green-500 text-2xl tracking-tighter shadow-green-900">MR TRADERS</h1>
          <div className="text-[10px] text-green-800 font-bold uppercase tracking-[0.5em]">Global Community</div>
        </div>
        <div className="flex items-center gap-2 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-green-500 font-bold">SYSTEM ACTIVE</span>
        </div>
      </header>

      <main className="w-full max-w-xl space-y-6">
        {/* Period Display */}
        <div className="bg-black/60 border-2 border-green-500 p-6 rounded-none relative">
          <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-green-500 font-bold flex items-center gap-1">
            <Binary size={12} /> SESSION_ID
          </div>
          <div className="text-center font-bold text-2xl md:text-3xl tracking-widest text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]">
            {gameState.periodId}
          </div>
        </div>

        {/* Prediction Box */}
        <div className="bg-black/80 border-2 border-red-900 p-8 flex flex-col items-center justify-center min-h-[160px] relative">
           {gameState.isAnalyzing ? (
             <div className="flex flex-col items-center gap-4">
                <ShieldAlert size={48} className="text-red-600 animate-spin" />
                <span className="creep-font text-red-500 text-2xl">PENETRATING ENGINE...</span>
             </div>
           ) : gameState.prediction ? (
             <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="flex gap-4 items-center">
                  <div className={`text-5xl font-black ${gameState.prediction.size === 'BIG' ? 'text-yellow-500' : 'text-blue-500'} italic`}>
                    {gameState.prediction.size}
                  </div>
                  <div className="text-3xl text-gray-600">/</div>
                  <div className={`text-5xl font-black ${gameState.prediction.color === 'RED' ? 'text-red-600' : 'text-green-600'} italic`}>
                    {gameState.prediction.color}
                  </div>
                </div>
                <div className="mt-4 text-xs font-bold text-red-900 tracking-[1em] uppercase">
                  PROBABILITY: {gameState.prediction.probability}%
                </div>
             </div>
           ) : (
             <div className="flex flex-col items-center opacity-30">
               <Lock size={40} className="text-gray-600 mb-2" />
               <span className="text-xs uppercase font-bold tracking-widest text-gray-500">Wait for Signal</span>
             </div>
           )}
        </div>

        {/* Guess Button */}
        <button
          onClick={handleGuess}
          disabled={gameState.isAnalyzing || isLocked}
          className={`w-full py-6 text-xl horror-font transition-all relative overflow-hidden border-4 group ${
            isLocked 
              ? 'bg-gray-900 border-gray-700 text-gray-700 cursor-not-allowed'
              : 'bg-green-600/10 border-green-500 text-green-500 hover:bg-green-500 hover:text-black shadow-[0_0_30px_rgba(0,255,0,0.2)]'
          }`}
        >
          {isLocked ? (
            <div className="flex items-center justify-center gap-3">
               <Lock size={20} /> SIGNAL USED
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Zap size={20} fill="currentColor" /> GUESS RESULT
            </div>
          )}
          {!isLocked && <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>}
        </button>

        {/* Heatmap */}
        <div className="grid grid-cols-5 gap-2 pt-8">
          {Object.entries(heatmap).map(([num, prob]) => (
            <div key={num} className="bg-green-950/20 border border-green-500/20 p-2 flex flex-col items-center">
              <span className="text-xs text-green-700 font-bold mb-1">#{num}</span>
              <div className="w-full bg-gray-900 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${prob}%` }}></div>
              </div>
              <span className="text-[8px] text-green-500/60 mt-1">{prob}%</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-auto pt-12 pb-6 text-center">
        <div className="text-[10px] text-gray-600 font-mono flex items-center justify-center gap-2">
           <Terminal size={12} /> v10.4.2 // SECURE_HACK_PROTOCOL // MR_TEAM
        </div>
      </footer>
    </div>
  );
};

export default HackerDashboard;
