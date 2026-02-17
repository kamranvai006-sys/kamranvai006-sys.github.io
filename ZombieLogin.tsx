
import React, { useState } from 'react';
import { Skull, Ghost, Zap } from 'lucide-react';

interface Props {
  onUnlock: () => void;
}

const ZombieLogin: React.FC<Props> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [isJumping, setIsJumping] = useState(false);

  const handleInput = (val: string) => {
    setPassword(val);
    if (val.toUpperCase() === 'MR') {
      setIsJumping(true);
      // Sound logic would go here, visual jump-scare for now
      setTimeout(() => {
        onUnlock();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-[200] overflow-hidden">
      {/* Background Silhouettes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="zombie-hand top-10 left-10" style={{ animationDelay: '0s' }}>
          <Skull size={150} />
        </div>
        <div className="zombie-hand bottom-20 right-20" style={{ animationDelay: '1.5s' }}>
          <Skull size={200} />
        </div>
        <div className="zombie-hand top-1/2 left-1/4" style={{ animationDelay: '0.8s' }}>
          <Skull size={120} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-sm p-8 bg-black/80 border-4 border-red-900 shadow-[0_0_50px_rgba(153,0,0,0.5)] rounded-none flex flex-col items-center">
        <h1 className="horror-font text-red-600 text-3xl mb-8 text-center animate-pulse">
          MR TRADERS<br/>COMMUNITY
        </h1>
        
        <div className="w-full space-y-4">
          <label className="block text-red-500 text-xs uppercase tracking-[0.3em] font-bold mb-2">
            Enter Secret Key
          </label>
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full bg-red-950/20 border-2 border-red-900 text-red-500 p-4 focus:outline-none focus:border-red-600 transition-all text-center text-2xl tracking-[1em]"
            placeholder="??"
          />
        </div>

        <div className="mt-8 text-[10px] text-red-900 uppercase font-bold tracking-widest text-center">
          Monitoring authorized biological signals...
        </div>
      </div>

      {isJumping && (
        <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center animate-[ping_0.5s_infinite]">
          <div className="absolute inset-0 screen-crack"></div>
          <Ghost size={400} className="text-white animate-bounce" />
          <div className="absolute text-white horror-font text-9xl">MR JIM</div>
        </div>
      )}
    </div>
  );
};

export default ZombieLogin;
