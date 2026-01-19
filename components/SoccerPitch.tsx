
import React, { useState } from 'react';
import { PlayerPosition } from '../types';
import { Play, RotateCcw } from 'lucide-react';

interface SoccerPitchProps {
  dimensions: string;
  playersCount: string;
  visualData?: {
    players: PlayerPosition[];
  };
}

export const SoccerPitch: React.FC<SoccerPitchProps> = ({ dimensions, playersCount, visualData }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const players = visualData?.players || [];

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-[4/3] bg-emerald-950 rounded-2xl border-4 border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute inset-4 border-2 border-white/20 rounded-sm pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/20"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border-2 border-white/20 rounded-full"></div>
        </div>

        <div key={key} className="absolute inset-0 p-4">
          {players.map((p) => (
            <div
              key={p.id}
              className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-[10px] font-black transition-all duration-[2500ms] ease-in-out z-10 ${
                p.team === 'A' ? 'bg-blue-600' : 'bg-red-600'
              }`}
              style={{
                left: `calc(${isPlaying ? p.endX : p.startX}% - 12px)`,
                top: `calc(${isPlaying ? p.endY : p.startY}% - 12px)`,
              }}
            >
              {p.label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-white/5">
        <div className="text-[10px] text-slate-400 uppercase tracking-tighter font-bold">
          {dimensions} • {playersCount}
        </div>
        <button
          onClick={() => { setIsPlaying(!isPlaying); if(isPlaying) setKey(k => k+1); }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-black text-xs hover:bg-emerald-400 transition-all"
        >
          {isPlaying ? <RotateCcw size={14} /> : <Play size={14} fill="currentColor" />}
          {isPlaying ? 'REINICIAR' : 'SIMULAR MOVIMENTO'}
        </button>
      </div>
    </div>
  );
};

