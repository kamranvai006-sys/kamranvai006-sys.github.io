
import React, { useState, useEffect } from 'react';
import { getCurrentPeriodId, fetchHistoryData, runNeuralVoting, generateHeatmap } from '../services/apiService';
import { GameState, ProbabilityMap, WinGoResult } from '../types';
import { Terminal, ShieldAlert, Zap, Binary, Lock, Activity, Cpu, Database } from 'lucide-react';

const HackerDashboard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    periodId: getCurrentPeriodId(),
    prediction: null,
    lastGeneratedPeriod: null,
    isAnalyzing: false
  });
  const [history, setHistory] = useState<WinGoResult[]>([]);
  const [heatmap, setHeatmap] = useState<ProbabilityMap>({});
  const [hackerText, setHackerText] = useState<string[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newId = getCurrentPeriodId();
      if (newId !== gameState.periodId) {
        setGameState(prev => ({
          ...prev,
          periodId: newId,
          prediction: null 
        }));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [gameState.periodId]);

  useEffect(() => {
    const texts = [
      "Hackered by Mr team", 
      "Mr Jim Hack", 
      "Mining HISTORY_DATA_API...", 
      "Analyzing dragon patterns...", 
      "Fibonacci weights updated", 
      "MR TRADERS NEURAL LINK ACTIVE"
    ];
    const interval = setInterval(() => {
      setHackerText(prev => [...prev, texts[Math.floor(Math.random() * texts.length)]].slice(-50));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const handleDeepScan = async () => {
    if (gameState.lastGeneratedPeriod === gameState.periodId) {
      alert("Signal already generated for this period! Wait for the next one.");
      return;
    }

    setGameState(prev => ({ ...prev, isAnalyzing: true }));
    
    // Data Mining Phase
    const freshHistory = await fetchHistoryData();
    setHistory(freshHistory);
    
    // Voting Engine Processing
    await new Promise(r => setTimeout(r, 2500));
    
    const result = runNeuralVoting(freshHistory);
    const newHeatmap = generateHeatmap(freshHistory);
    
    setHeatmap(newHeatmap);
    setGameState(prev => ({
      ...prev,
      prediction: result,
      lastGeneratedPeriod: prev.periodId,
      isAnalyzing: false
    }));
  };

  const isLocked = gameState.lastGeneratedPeriod === gameState.periodId;

  return (
    <div className="relative min-h-screen p-4 md:p-8 flex flex-col items-center overflow-hidden">
      <div className="hacker-bg"></div>
      <div className="scanline"></div>
      
      {/* Background Terminal Scrolling */}
      <div className="fixed inset-0 pointer-events-none opacity-20 font-mono text-[9px] text-green-500 overflow-hidden leading-tight p-2">
        {hackerText.map((t, i) => <div key={i} className="animate-pulse">{t}</div>)}
      </div>

      <header className="w-full max-w-4xl flex justify-between items-center mb-10 relative z-10">
        <div className="flex flex-col">
          <h1 className="horror-font text-red-600 text-2xl tracking-tighter drop-shadow-[0_0_10px_#900]">MR TRADERS</h1>
          <div className="text-[10px] text-red-900 font-bold uppercase tracking-[0.4em]">Neural Prediction Engine</div>
        </div>
        <div className="flex items-center gap-3 bg-red-950/20 border border-red-600/30 px-4 py-2 rounded-sm shadow-[inset_0_0_10px_rgba(255,0,0,0.1)]">
          <Cpu size={14} className="text-red-600 animate-spin" />
          <span className="text-[10px] text-red-500 font-bold tracking-widest">20-LOGIC CORE ACTIVE</span>
        </div>
      </header>

      <main className="w-full max-w-2xl space-y-8 relative z-10">
        {/* Period Display - Holographic */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-green-500/20 blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-black/80 border-2 border-green-500/50 p-6 flex flex-col items-center">
            <span className="text-[10px] text-green-800 font-bold mb-2 flex items-center gap-2">
              <Database size={12} /> TARGET_PERIOD_ID
            </span>
            <div className="text-3xl md:text-4xl font-black tracking-tighter text-green-400 drop-shadow-[0_0_15px_#22c55e]">
              {gameState.periodId}
            </div>
          </div>
        </div>

        {/* Holographic Result Display */}
        <div className="relative h-48 bg-black/90 border-x-4 border-red-900 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(153,0,0,0.2)]">
          {gameState.isAnalyzing ? (
            <div className="flex flex-col items-center animate-pulse">
              <Activity size={48} className="text-red-600 mb-4" />
              <div className="creep-font text-red-500 text-3xl tracking-widest">DEEP SCANNING...</div>
              <div className="text-[10px] text-red-900 mt-2 font-mono uppercase">Syncing Voting Engine V4.2</div>
            </div>
          ) : gameState.prediction ? (
            <div className="flex flex-col items-center animate-[zoom-in_0.4s_ease-out]">
              <div className="flex items-center gap-6">
                <div className={`text-6xl font-black ${gameState.prediction.size === 'BIG' ? 'text-yellow-500' : 'text-blue-500'} drop-shadow-[0_0_20px_currentColor]`}>
                  {gameState.prediction.size}
                </div>
                <div className="h-16 w-[2px] bg-red-900/50 rotate-12"></div>
                <div className={`text-6xl font-black ${gameState.prediction.color === 'GREEN' ? 'text-green-500' : 'text-red-600'} drop-shadow-[0_0_20px_currentColor]`}>
                  {gameState.prediction.color}
                </div>
              </div>
              <div className="mt-6 flex gap-4 text-[10px] font-mono text-red-500/80 uppercase tracking-widest bg-red-900/10 px-4 py-1 border border-red-900/20">
                <span>CONFIDENCE: {gameState.prediction.probability}%</span>
                <span className="text-red-900">|</span>
                <span>VOTES: {gameState.prediction.votes.big + gameState.prediction.votes.green}/40</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center opacity-20">
              <Lock size={48} className="text-gray-700 mb-4" />
              <div className="text-xs font-bold tracking-[1em] text-gray-600 uppercase">Input Required</div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={handleDeepScan}
          disabled={gameState.isAnalyzing || isLocked}
          className={`w-full py-6 text-2xl horror-font border-4 transition-all relative overflow-hidden group ${
            isLocked 
              ? 'bg-gray-950 border-gray-800 text-gray-800 cursor-not-allowed'
              : 'bg-red-950/20 border-red-600 text-red-600 hover:bg-red-600 hover:text-black shadow-[0_0_30px_rgba(153,0,0,0.3)]'
          }`}
        >
          {isLocked ? "ACCESS LOCKED" : "GUESS RESULT"}
          {!isLocked && <div className="absolute inset-0 bg-red-600/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>}
        </button>

        {/* Probability Heatmap */}
        <div className="bg-black/60 border border-green-900/30 p-4">
          <div className="text-[10px] text-green-900 font-bold mb-4 uppercase tracking-[0.5em] text-center">Number Probability Heatmap</div>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-green-500">#{i}</div>
                <div className="w-full h-20 bg-gray-900 rounded-sm relative overflow-hidden flex flex-col justify-end">
                  <div 
                    className="w-full bg-green-500/40 shadow-[0_0_10px_#22c55e]" 
                    style={{ height: `${heatmap[i] || 10}%`, transition: 'height 1s ease-out' }}
                  ></div>
                </div>
                <div className="text-[8px] text-green-900 font-mono">{heatmap[i] || 0}%</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-auto py-10 flex flex-col items-center gap-2 opacity-50 relative z-10">
        <div className="flex items-center gap-4 text-[9px] text-red-900 font-mono uppercase tracking-[0.3em]">
          <span>X_LINK_SECURED</span>
          <span>●</span>
          <span>BIO_SCAN_COMPLETE</span>
        </div>
        <div className="text-[10px] text-gray-700 font-mono">
          &copy; 2024 MR TRADERS COMMUNITY | NEURAL_VOTER_V4.2
        </div>
      </footer>
    </div>
  );
};

export default HackerDashboard;
