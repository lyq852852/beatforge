import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { audioEngine } from '../audio/engine';
import type { DrumType, Step, Pattern, TransportState, ChannelState, GeneratorParams } from '../types';

const DRUM_ORDER: DrumType[] = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'];
const STEPS = 16;

interface UseAudioReturn {
  isReady: boolean;
  isPlaying: boolean;
  currentStep: number;
  bpm: number;
  playDrum: (drum: DrumType, velocity?: number) => void;
  toggleStep: (drum: DrumType, step: number) => void;
  setStepVelocity: (drum: DrumType, step: number, velocity: number) => void;
  setBpm: (bpm: number) => void;
  setSwing: (amount: number) => void;
  start: () => void;
  stop: () => void;
  pause: () => void;
  setVolume: (drum: DrumType, volume: number) => void;
  setMute: (drum: DrumType, mute: boolean) => void;
  getWaveformData: () => Float32Array;
  patterns: Pattern[];
  currentPattern: Pattern;
  generatePattern: (params: GeneratorParams) => void;
  loadPreset: (preset: Pattern) => void;
}

const createEmptyPattern = (): Pattern => ({
  id: crypto.randomUUID(),
  name: 'New Pattern',
  style: 'pop',
  steps: STEPS,
  tracks: DRUM_ORDER.map(drum => ({
    drum,
    steps: Array.from({ length: STEPS }, () => ({
      active: false,
      velocity: 100,
      probability: 100,
    })),
    mute: false,
    solo: false,
    volume: 0.8,
    pan: 0,
  })),
});

export function useAudio(): UseAudioReturn {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [bpm, setBpmState] = useState(120);
  const [patterns, setPatterns] = useState<Pattern[]>([createEmptyPattern()]);
  const [currentPattern, setCurrentPattern] = useState<Pattern>(patterns[0]);
  const [mixerState, setMixerState] = useState<Record<DrumType, ChannelState>>(() => {
    const state: Record<DrumType, ChannelState> = {} as Record<DrumType, ChannelState>;
    DRUM_ORDER.forEach(drum => {
      state[drum] = { volume: 0.8, pan: 0, mute: false, solo: false };
    });
    return state;
  });

  const patternRef = useRef(currentPattern);
  const sequenceRef = useRef<Tone.Sequence | null>(null);

  // Keep pattern ref updated
  useEffect(() => {
    patternRef.current = currentPattern;
  }, [currentPattern]);

  // Initialize audio engine
  useEffect(() => {
    const init = async () => {
      try {
        await audioEngine.init();
        audioEngine.bpm = bpm;
        setIsReady(true);
      } catch (error) {
        console.error('Failed to init audio:', error);
      }
    };
    init();

    return () => {
      audioEngine.dispose();
    };
  }, []);

  // Create and manage sequence
  useEffect(() => {
    // Dispose old sequence
    if (sequenceRef.current) {
      sequenceRef.current.dispose();
    }

    // Create new sequence
    const indices = Array.from({ length: STEPS }, (_, i) => i);
    
    sequenceRef.current = new Tone.Sequence(
      (time, step) => {
        setCurrentStep(step);
        
        const pattern = patternRef.current;
        DRUM_ORDER.forEach((drum, drumIndex) => {
          const track = pattern.tracks.find(t => t.drum === drum);
          if (!track || track.mute) return;

          // Check for solo - if any track is soloed, only play soloed tracks
          const hasSolo = pattern.tracks.some(t => t.solo);
          if (hasSolo && !track.solo) return;

          const stepData = track.steps[step];
          if (stepData.active) {
            // Probability check
            if (Math.random() * 100 > stepData.probability) return;
            
            audioEngine.playDrum(drum, stepData.velocity);
          }
        });
      },
      indices,
      '16n'
    );

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose();
      }
    };
  }, [currentPattern.id]);

  // Play a drum
  const playDrum = useCallback((drum: DrumType, velocity: number = 100) => {
    audioEngine.playDrum(drum, velocity);
  }, []);

  // Toggle step on/off
  const toggleStep = useCallback((drum: DrumType, step: number) => {
    setCurrentPattern(prev => {
      const newPattern = { ...prev, tracks: [...prev.tracks] };
      const trackIndex = newPattern.tracks.findIndex(t => t.drum === drum);
      if (trackIndex === -1) return prev;

      const track = { ...newPattern.tracks[trackIndex] };
      track.steps = [...track.steps];
      track.steps[step] = {
        ...track.steps[step],
        active: !track.steps[step].active,
      };
      newPattern.tracks[trackIndex] = track;

      return newPattern;
    });
  }, []);

  // Set step velocity
  const setStepVelocity = useCallback((drum: DrumType, step: number, velocity: number) => {
    setCurrentPattern(prev => {
      const newPattern = { ...prev, tracks: [...prev.tracks] };
      const trackIndex = newPattern.tracks.findIndex(t => t.drum === drum);
      if (trackIndex === -1) return prev;

      const track = { ...newPattern.tracks[trackIndex] };
      track.steps = [...track.steps];
      track.steps[step] = {
        ...track.steps[step],
        velocity,
      };
      newPattern.tracks[trackIndex] = track;

      return newPattern;
    });
  }, []);

  // Set BPM
  const setBpm = useCallback((newBpm: number) => {
    const clampedBpm = Math.max(40, Math.min(240, newBpm));
    setBpmState(clampedBpm);
    audioEngine.bpm = clampedBpm;
  }, []);

  // Set swing
  const setSwing = useCallback((amount: number) => {
    audioEngine.setSwing(amount);
  }, []);

  // Start playback
  const start = useCallback(() => {
    audioEngine.start();
    if (sequenceRef.current) {
      sequenceRef.current.start(0);
    }
    setIsPlaying(true);
  }, []);

  // Stop playback
  const stop = useCallback(() => {
    audioEngine.stop();
    if (sequenceRef.current) {
      sequenceRef.current.stop();
    }
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  // Pause playback
  const pause = useCallback(() => {
    audioEngine.pause();
    setIsPlaying(false);
  }, []);

  // Set channel volume
  const setVolume = useCallback((drum: DrumType, volume: number) => {
    audioEngine.setVolume(drum, volume);
    setMixerState(prev => ({
      ...prev,
      [drum]: { ...prev[drum], volume },
    }));
  }, []);

  // Set channel mute
  const setMute = useCallback((drum: DrumType, mute: boolean) => {
    audioEngine.setMute(drum, mute);
    setMixerState(prev => ({
      ...prev,
      [drum]: { ...prev[drum], mute },
    }));

    // Update pattern mute state
    setCurrentPattern(prev => {
      const newPattern = { ...prev, tracks: [...prev.tracks] };
      const trackIndex = newPattern.tracks.findIndex(t => t.drum === drum);
      if (trackIndex === -1) return prev;
      newPattern.tracks[trackIndex] = {
        ...newPattern.tracks[trackIndex],
        mute,
      };
      return newPattern;
    });
  }, []);

  // Get waveform data
  const getWaveformData = useCallback(() => {
    return audioEngine.getWaveformData();
  }, []);

  // Generate new pattern
  const generatePattern = useCallback((params: GeneratorParams) => {
    const newPattern = createEmptyPattern();
    newPattern.style = params.style;
    
    // Generate based on style and parameters
    const { complexity, density } = params;
    
    DRUM_ORDER.forEach((drum, drumIndex) => {
      const track = newPattern.tracks[drumIndex];
      
      // Different drums have different rhythmic characteristics
      let fillProbability = 0;
      switch (drum) {
        case 'kick':
          fillProbability = 0.3 + complexity * 0.1; // Almost every beat
          break;
        case 'snare':
          fillProbability = 0.5 + complexity * 0.08; // Every 2nd/4th beat
          break;
        case 'hihat':
          fillProbability = 0.7 + complexity * 0.05; // Many off-beats
          break;
        case 'openhat':
          fillProbability = density * 0.1; // Sparse
          break;
        case 'tom1':
        case 'tom2':
          fillProbability = density * 0.08; // Fill heavy
          break;
        case 'crash':
          fillProbability = 0.1; // Occasional accent
          break;
        case 'ride':
          fillProbability = density * 0.06;
          break;
      }

      // Generate steps
      for (let step = 0; step < STEPS; step++) {
        // Beat 1 and 3 are more likely
        const isDownbeat = step % 4 === 0;
        const isOffbeat = step % 4 === 2;
        
        let probability = fillProbability;
        if (isDownbeat) probability += 0.2;
        if (isOffbeat) probability += 0.1;
        
        track.steps[step] = {
          active: Math.random() < probability,
          velocity: 80 + Math.floor(Math.random() * 40),
          probability: 100,
        };
      }

      // Ensure kick and snare have basic patterns
      if (drum === 'kick') {
        track.steps[0].active = true;
        track.steps[4].active = Math.random() > 0.3;
        track.steps[8].active = Math.random() > 0.2;
        track.steps[12].active = Math.random() > 0.3;
      }
      
      if (drum === 'snare') {
        track.steps[4].active = true;
        track.steps[12].active = true;
      }
    });

    setCurrentPattern(newPattern);
    setPatterns(prev => [...prev, newPattern]);
  }, []);

  // Load preset pattern
  const loadPreset = useCallback((preset: Pattern) => {
    const newPattern = {
      ...preset,
      id: crypto.randomUUID(),
    };
    setCurrentPattern(newPattern);
    setPatterns(prev => [...prev, newPattern]);
  }, []);

  return {
    isReady,
    isPlaying,
    currentStep,
    bpm,
    playDrum,
    toggleStep,
    setStepVelocity,
    setBpm,
    setSwing,
    start,
    stop,
    pause,
    setVolume,
    setMute,
    getWaveformData,
    patterns,
    currentPattern,
    generatePattern,
    loadPreset,
  };
}
