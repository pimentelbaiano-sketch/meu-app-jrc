
import React, { useState, useEffect } from 'react';
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

  // Garantir que sempre existam jogadores para renderizar, mesmo que a IA falhe em algum campo
  const players = visualData?.players || [];

  return (
    <div className="space-y-4 no-select">
      <div className="relative w-full aspect-[4/3] bg-emerald-900 rounded-xl border-2 border-white/30 overflow-hidden shadow-inner print:border-slate-800 print:bg-emerald-800">
        {/* Marcações do Campo */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          {/* Linha Central */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white"></div>
          {/* Círculo Central */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full"></div>
          {/* Pequeno Círculo Central */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Área Esquerda */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-12 border-y-2 border-r-2 border-white"></div>
          {/* Área Direita */}
          <div className="absolute right-0 top-1/4 bottom-1/4 w-12 border-y-2 border-l-2 border-white"></div>
          
          {/* Linhas de fundo/laterais internas */}
          <div className="absolute inset-2 border border-white/20"></div>
        </div>

        {/* Jogadores */}
        <div key={key} className="absolute inset-0">
          {players.map((p, idx) => (
            <div
              key={p.id || `player-${idx}`}
              className={`absolute w-7 h-7 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-[10px] font-black transition-all duration-[2500ms] ease-in-out z-10 text-white ${
                p.team === 'A' ? 'bg-blue-600' : 'bg-red-600'
              }`}
              style={{
                left: `${isPlaying ? (p.endX ?? 50) : (p.startX ?? 50)}%`,
                top: `${isPlaying ? (p.endY ?? 50) : (p.startY ?? 50)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {p.label || (p.team === 'A' ? 'A' : 'B')}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-white/5 print:hidden">
        <div className="flex flex-col">
          <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Configuração</span>
          <span className="text-xs text-slate-300 font-bold uppercase">{dimensions} • {playersCount}</span>
        </div>
        <button
          onClick={() => { 
            if (isPlaying) {
              setKey(prev => prev + 1);
              setIsPlaying(false);
            } else {
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-900 rounded-lg font-black text-[10px] hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          {isPlaying ? <RotateCcw size={14} /> : <Play size={14} fill="currentColor" />}
          {isPlaying ? 'RESETAR' : 'SIMULAR'}
        </button>
      </div>
    </div>
  );
};
