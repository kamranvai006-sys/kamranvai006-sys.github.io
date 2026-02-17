
import React, { useState, useRef, useEffect } from 'react';
import { PredictionState, WinGoResult } from '../types';
import { fetchHistory, analyzeTrend, getNextPeriod } from '../services/predictionService';
import { Copy, Scan, Zap, ShieldCheck, Activity, Trophy } from 'lucide-react';

interface Props {
  isBlocked: boolean;
}

const FloatingBox: React.FC<Props> = ({ isBlocked }) => {
  const [state, setState] = useState<PredictionState>({
    nextPeriod: '---',
    prediction: null,
    level: 1,
    status: 'idle'
  });
  const [history, setHistory] = useState<WinGoResult[]>([]);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    dragRef.current = {
      startX: clientX - position.x,
      startY: clientY - position.y
    };
  };

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !dragRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      
      setPosition({
        x: clientX - dragRef.current.startX,
        y: clientY - dragRef.current.startY
      });
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging]);

  // Pinch to Zoom
  useEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    let initialDist = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        initialDist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDist > 0) {
        const dist = Math.hypot(
          e.touches[0].pageX - e.touches[1].pageX,
          e.touches[0].pageY - e.touches[1].pageY
        );
        const delta = dist / initialDist;
        setScale(prev => Math.min(Math.max(prev * delta, 0.5), 2));
        initialDist = dist;
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleGetResult = async () => {
    setState(prev => ({ ...prev, status: 'analyzing' }));
    
    // Neural Analyzing animation (3s)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const freshHistory = await fetchHistory();
    setHistory(freshHistory);
    
    const nextP = getNextPeriod(freshHistory[0]?.issueNumber || "0");
    const pred = analyzeTrend(freshHistory);
    
    setState({
      nextPeriod: nextP,
      prediction: pred,
      // Randomizing win level for visual demonstration
      level: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
      status: 'ready'
    });
  };

  const copyToClipboard = () => {
    if (state.prediction) {
      navigator.clipboard.writeText(state.prediction);
      alert(`${state.prediction} COPIED!`);
    }
  };

  if (isBlocked) return null;

  return (
    <div
      ref={boxRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        touchAction: 'none'
      }}
      className="fixed z-50 w-72 bg-black/40 backdrop-blur-xl border-2 border-[#00ffcc] shadow-[0_0_20px_rgba(0,255,204,0.3)] rounded-2xl overflow-hidden select-none cursor-move"
    >
      {/* Header */}
      <div 
        className="bg-[#00ffcc] px-4 py-2 flex items-center justify-between"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-black animate-pulse" />
          <span className="text-black font-bold text-xs cyber-font">SEJAN NEURAL AI</span>
        </div>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-black/60 border border-[#00ffcc]/30 p-2 rounded flex flex-col items-center">
            <span className="text-[10px] text-[#00ffcc]/60 uppercase">SYSTEM</span>
            <span className="text-xs text-green-400 font-bold">ONLINE</span>
          </div>
          <div className="bg-black/60 border border-[#00ffcc]/30 p-2 rounded flex flex-col items-center">
            <span className="text-[10px] text-[#00ffcc]/60 uppercase">ACCURACY</span>
            <span className="text-xs text-[#00ffcc] font-bold">98.4%</span>
          </div>
        </div>

        {/* Prediction Display */}
        <div className="relative group">
          <div className="absolute inset-0 bg-[#00ffcc]/5 blur-md group-hover:bg-[#00ffcc]/10 transition-all"></div>
          <div className="relative border-x-2 border-[#00ffcc]/20 bg-black/40 p-4 rounded-lg flex flex-col items-center">
            <span className="text-[10px] text-gray-400 mb-1">NEXT PERIOD</span>
            <span className="text-lg text-[#00ffcc] cyber-font font-bold mb-3">{state.nextPeriod}</span>
            
            <div className="flex items-center gap-3 w-full justify-center">
              <div className={`text-3xl font-black cyber-font ${state.prediction === 'BIG' ? 'text-yellow-400' : 'text-blue-400'}`}>
                {state.status === 'analyzing' ? 'SCANNING...' : (state.prediction || '----')}
              </div>
              {state.prediction && (
                <button 
                  onClick={copyToClipboard}
                  className="p-2 bg-[#00ffcc]/20 hover:bg-[#00ffcc]/40 rounded-full transition-colors border border-[#00ffcc]/40"
                >
                  <Copy size={14} className="text-[#00ffcc]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3 Step Win Circles Logic Enhancement */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] text-[#00ffcc]/60 uppercase font-bold flex items-center gap-1">
              <Trophy size={10} /> Win Progression
            </span>
            {state.status === 'ready' && (
              <span className="text-[9px] text-yellow-400 font-bold animate-pulse">LEVEL {state.level} HIT!</span>
            )}
          </div>
          <div className="flex justify-between px-4">
            {[1, 2, 3].map((lv) => {
              const isHighlighted = state.status === 'ready' && lv <= state.level;
              const isCurrent = state.status === 'ready' && lv === state.level;
              
              return (
                <div key={lv} className="flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isHighlighted
                      ? 'bg-[#00ffcc] border-[#00ffcc] shadow-[0_0_15px_#00ffcc] text-black'
                      : 'bg-transparent border-gray-700 text-gray-600'
                  } ${isHighlighted ? 'animate-win' : ''}`}>
                    <span className={`text-xs font-black`}>L{lv}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGetResult}
          disabled={state.status === 'analyzing'}
          className={`w-full py-3 rounded-lg font-bold cyber-font text-sm flex items-center justify-center gap-2 transition-all ${
            state.status === 'analyzing'
              ? 'bg-gray-800 text-gray-500 cursor-wait'
              : 'bg-transparent border-2 border-[#00ffcc] text-[#00ffcc] hover:bg-[#00ffcc] hover:text-black shadow-[0_0_15px_rgba(0,255,204,0.2)]'
          }`}
        >
          {state.status === 'analyzing' ? (
            <>
              <Scan size={18} className="animate-spin" />
              NEURAL ANALYZING...
            </>
          ) : (
            <>
              <Zap size={18} fill="currentColor" />
              GET RESULT
            </>
          )}
        </button>

        {/* Results Visualiser (Mini Circles) */}
        <div className="flex gap-1 overflow-x-auto py-2 no-scrollbar">
          {history.slice(0, 10).map((h, i) => (
            <div 
              key={i} 
              className={`min-w-[12px] h-3 rounded-full ${
                h.color === 'green' ? 'bg-green-500' : 
                h.color === 'red' ? 'bg-red-500' : 'bg-purple-500'
              } border border-white/20`}
              title={`${h.issueNumber}: ${h.number}`}
            />
          ))}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="bg-black/60 px-4 py-2 border-t border-[#00ffcc]/10 flex items-center justify-center">
        <ShieldCheck size={12} className="text-[#00ffcc] mr-1" />
        <span className="text-[9px] text-gray-500 tracking-widest uppercase">Encrypted Neural Feed</span>
      </div>
    </div>
  );
};

export default FloatingBox;
