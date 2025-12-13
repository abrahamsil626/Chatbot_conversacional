import React from 'react';
import { useVoiceAgent } from './hooks/useVoiceAgent';
import { AgentState } from './types';
import Orb from './components/Orb';
import AudioVisualizer from './components/AudioVisualizer';
import { Mic, MicOff, Power, Activity } from 'lucide-react';

const App: React.FC = () => {
  const { state, startSession, stopSession, stream } = useVoiceAgent();

  const getStatusText = (currentState: AgentState) => {
    switch (currentState) {
      case AgentState.IDLE: return "Listo para iniciar";
      case AgentState.LISTENING: return "Escuchando...";
      case AgentState.SPEAKING: return "Detectando voz...";
      case AgentState.PROCESSING: return "Procesando respuesta...";
      case AgentState.PLAYING: return "Respondiendo...";
      case AgentState.ERROR: return "Error de conexión";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[100px]" />

      <main className="z-10 w-full max-w-2xl flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-light text-slate-100 tracking-wide">
            Agente <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">n8n</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
             <span className={`w-2 h-2 rounded-full ${state === AgentState.ERROR ? 'bg-red-500' : (state !== AgentState.IDLE ? 'bg-green-500 animate-pulse' : 'bg-slate-500')}`}></span>
             <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
               {getStatusText(state)}
             </p>
          </div>
        </div>

        {/* Central Visualization */}
        <div className="relative flex flex-col items-center justify-center min-h-[300px] w-full">
            <Orb state={state} />
        </div>

        {/* Waveform Visualizer (Active when recording) */}
        <div className="h-24 w-full flex items-center justify-center transition-opacity duration-500">
             <AudioVisualizer stream={stream} state={state} />
        </div>

        {/* Controls */}
        <div className="flex gap-6 items-center">
            {state === AgentState.IDLE || state === AgentState.ERROR ? (
                 <button 
                    onClick={startSession}
                    className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 hover:border-cyan-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300"
                 >
                     <div className="absolute inset-0 rounded-full border border-cyan-500/0 group-hover:border-cyan-500/50 scale-110 transition-transform duration-300"></div>
                     <Mic className="w-6 h-6 text-slate-200 group-hover:text-cyan-400" />
                 </button>
            ) : (
                <button 
                    onClick={stopSession}
                    className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 border border-slate-700 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-300"
                 >
                     <Power className="w-6 h-6 text-slate-200 group-hover:text-red-400" />
                 </button>
            )}
        </div>

        {/* Instructions / Hints */}
        <div className="text-slate-500 text-xs text-center max-w-sm">
            {state === AgentState.IDLE ? (
                <p>Presiona el micrófono para iniciar la conversación.</p>
            ) : (
                <p>Habla claramente. El sistema detectará automáticamente cuando termines (3s de silencio).</p>
            )}
        </div>

      </main>
      
      {/* Footer */}
      <footer className="absolute bottom-4 text-slate-700 text-xs">
         Powered by n8n & React
      </footer>
    </div>
  );
};

export default App;
