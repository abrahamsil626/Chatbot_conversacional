export enum AgentState {
  IDLE = 'IDLE',           // Waiting for user to start
  LISTENING = 'LISTENING', // Mic is open, waiting for speech
  SPEAKING = 'SPEAKING',   // User is currently talking (VAD active)
  PROCESSING = 'PROCESSING', // Sending to API
  PLAYING = 'PLAYING',     // Playing back response
  ERROR = 'ERROR'
}

export interface AudioVisualizerProps {
  stream: MediaStream | null;
  state: AgentState;
}

export interface ControlsProps {
  state: AgentState;
  onStart: () => void;
  onStop: () => void;
}
