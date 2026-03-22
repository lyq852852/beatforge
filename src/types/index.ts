// Drum types
export type DrumType = 'kick' | 'snare' | 'hihat' | 'openhat' | 'tom1' | 'tom2' | 'crash' | 'ride';

export interface DrumConfig {
  id: DrumType;
  name: string;
  nameCn: string;
  color: string;
  shortcut: string;
}

// Pattern & Sequencer types
export interface Step {
  active: boolean;
  velocity: number; // 0-127
  probability: number; // 0-100
}

export interface Track {
  drum: DrumType;
  steps: Step[];
  mute: boolean;
  solo: boolean;
  volume: number; // 0-1
  pan: number; // -1 to 1
}

export interface Pattern {
  id: string;
  name: string;
  style: string;
  steps: number;
  tracks: Track[];
}

// Mixer types
export interface ChannelState {
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
}

// Transport types
export interface TransportState {
  playing: boolean;
  recording: boolean;
  bpm: number;
  swing: number;
  currentStep: number;
  loop: boolean;
}

// Generator types
export interface GeneratorParams {
  style: string;
  complexity: number; // 1-5
  density: number; // 1-5
  dynamics: number; // 1-5
}

// App State
export interface DrumMachineState {
  transport: TransportState;
  patterns: Pattern[];
  currentPatternId: string;
  mixer: Record<DrumType, ChannelState>;
  generator: GeneratorParams;
}

// Preset patterns
export interface PresetPattern {
  name: string;
  nameCn: string;
  style: string;
  bpm: number;
  pattern: Omit<Pattern, 'id' | 'name' | 'style'>;
}
