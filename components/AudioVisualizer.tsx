import React, { useEffect, useRef } from 'react';
import { AgentState, AudioVisualizerProps } from '../types';

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream, state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!stream || !canvasRef.current) return;
    
    // Don't visualize if processing or idle (save resources or show different UI)
    if (state === AgentState.IDLE || state === AgentState.PROCESSING) {
        // Clear canvas
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if(ctx) ctx.clearRect(0,0, canvas.width, canvas.height);
        return;
    }

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(stream);
    
    analyser.fftSize = 256;
    source.connect(analyser);
    
    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      animationRef.current = requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      
      // Modern Aesthetic: Circular or Center Bar visualization
      // Let's do a mirrored bar visualizer from center
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#818cf8'); // Indigo 400
      gradient.addColorStop(0.5, '#c084fc'); // Purple 400
      gradient.addColorStop(1, '#f472b6'); // Pink 400

      ctx.fillStyle = gradient;

      // Draw mirrored from center
      const centerX = width / 2;
      
      for(let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.8;
        
        // Ensure minimum visibility
        if (state === AgentState.PLAYING) {
            // Make it more active during playback if we were analyzing output (requires different setup), 
            // but here we are analyzing input. 
            // Since we can't easily analyze the <audio> element cross-origin without CORS, 
            // we will simulate movement if playing, or just show idle.
            // For this component, we are analyzing the MIC stream. 
            // If PLAYING, mic might be on (waiting for interruption) or off. 
            // The prompt says "After playback... return to listening". 
            // So during PLAYING, mic is theoretically off/ignored or we just show a loader.
        }

        // Left side
        ctx.fillRect(centerX - (i * barWidth) - barWidth, (height - barHeight) / 2, barWidth - 1, barHeight);
        // Right side
        ctx.fillRect(centerX + (i * barWidth), (height - barHeight) / 2, barWidth - 1, barHeight);
      }
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [stream, state]);

  // If Playing, show a simulated wave because we can't easily tap into the audio element stream without CORS issues
  if (state === AgentState.PLAYING) {
     return (
        <div className="flex items-center justify-center h-32 w-full gap-1">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 bg-indigo-400 rounded-full animate-pulse" style={{ height: '60%', animationDelay: `${i * 0.1}s`, animationDuration: '0.8s' }}></div>
             ))}
        </div>
     )
  }

  if (state === AgentState.PROCESSING) {
    return (
        <div className="flex items-center justify-center h-32 w-full">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-purple-500/30 rounded-full animate-ping"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
        </div>
    )
  }

  return (
    <canvas 
        ref={canvasRef} 
        width={600} 
        height={128} 
        className="w-full h-32 max-w-lg"
    />
  );
};

export default AudioVisualizer;
