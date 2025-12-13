import React from 'react';
import { AgentState } from '../types';

interface OrbProps {
  state: AgentState;
}

const Orb: React.FC<OrbProps> = ({ state }) => {
  let colorClass = "bg-slate-500";
  let pulseClass = "";
  let glowClass = "shadow-[0_0_20px_rgba(100,116,139,0.5)]";

  switch (state) {
    case AgentState.IDLE:
      colorClass = "bg-slate-700";
      pulseClass = "";
      break;
    case AgentState.LISTENING:
      colorClass = "bg-gradient-to-tr from-cyan-400 to-blue-500";
      pulseClass = "animate-pulse"; // Gentle pulse
      glowClass = "shadow-[0_0_50px_rgba(34,211,238,0.4)]";
      break;
    case AgentState.SPEAKING:
      // User is speaking, orb reacts strongly
      colorClass = "bg-gradient-to-tr from-emerald-400 to-green-500";
      pulseClass = "animate-blob"; // Stronger animation
      glowClass = "shadow-[0_0_60px_rgba(52,211,153,0.6)]";
      break;
    case AgentState.PROCESSING:
      colorClass = "bg-gradient-to-tr from-purple-500 to-indigo-600";
      pulseClass = "animate-spin"; // Or a specific loading animation
      glowClass = "shadow-[0_0_50px_rgba(139,92,246,0.5)]";
      break;
    case AgentState.PLAYING:
      colorClass = "bg-gradient-to-tr from-pink-500 to-rose-500";
      pulseClass = "animate-blob"; 
      glowClass = "shadow-[0_0_60px_rgba(244,63,94,0.6)]";
      break;
    case AgentState.ERROR:
      colorClass = "bg-red-600";
      glowClass = "shadow-[0_0_30px_rgba(220,38,38,0.5)]";
      break;
  }

  return (
    <div className="relative flex items-center justify-center w-64 h-64">
      {/* Outer Glow Ring */}
      <div className={`absolute w-full h-full rounded-full transition-all duration-700 opacity-30 ${colorClass} blur-xl ${state === AgentState.LISTENING ? 'animate-pulse' : ''}`}></div>
      
      {/* The Core Orb */}
      <div 
        className={`w-40 h-40 rounded-full transition-all duration-500 ease-in-out ${colorClass} ${glowClass} ${state === AgentState.PROCESSING ? 'animate-bounce' : pulseClass} flex items-center justify-center`}
      >
         {state === AgentState.PROCESSING && (
             <svg className="w-12 h-12 text-white/50 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
         )}
      </div>
    </div>
  );
};

export default Orb;
