import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DrumPad } from './components/DrumPad';
import { StepSequencer } from './components/StepSequencer';
import { TransportControls } from './components/TransportControls';
import { WaveformDisplay } from './components/WaveformDisplay';
import { PatternGenerator } from './components/PatternGenerator';
import { Mixer } from './components/Mixer';
import { useAudio } from './hooks/useAudio';
import { presetPatterns } from './data/presets';
import type { DrumType, ChannelState, GeneratorParams } from './types';

const DRUM_ORDER: DrumType[] = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'];

const DRUM_CONFIGS: Record<DrumType, { name: string; nameCn: string; color: string }> = {
  kick: { name: 'Kick', nameCn: '底鼓', color: '#FF6B35' },
  snare: { name: 'Snare', nameCn: '军鼓', color: '#FFD93D' },
  hihat: { name: 'Hi-Hat', nameCn: '踩镲', color: '#6BCB77' },
  openhat: { name: 'Open Hat', nameCn: '开镲', color: '#8FD694' },
  tom1: { name: 'Tom 1', nameCn: '高音桶', color: '#4D96FF' },
  tom2: { name: 'Tom 2', nameCn: '低音桶', color: '#6BA3FF' },
  crash: { name: 'Crash', nameCn: '强音镲', color: '#C77DFF' },
  ride: { name: 'Ride', nameCn: '叮叮镲', color: '#00C9A7' },
};

function App() {
  const {
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
    currentPattern,
    generatePattern,
  } = useAudio();

  const [swing, setSwingState] = useState(0);
  const [mixerState, setMixerState] = useState<Record<DrumType, ChannelState>>(() => {
    const state: Record<DrumType, ChannelState> = {} as Record<DrumType, ChannelState>;
    DRUM_ORDER.forEach(drum => {
      state[drum] = { volume: 0.8, pan: 0, mute: false, solo: false };
    });
    return state;
  });

  const [showInitOverlay, setShowInitOverlay] = useState(true);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (isPlaying) pause();
          else start();
          break;
        case 'Enter':
          e.preventDefault();
          stop();
          break;
        case 'KeyR':
          if (e.metaKey || e.ctrlKey) return;
          e.preventDefault();
          break;
        default:
          // Number keys 1-8 for drum pads
          const num = parseInt(e.key);
          if (num >= 1 && num <= 8) {
            playDrum(DRUM_ORDER[num - 1]);
          }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, start, pause, stop, playDrum]);

  // Initialize audio on first interaction
  const handleInitAudio = async () => {
    // Trigger audio context initialization
    await start();
    setTimeout(() => {
      stop();
      setShowInitOverlay(false);
    }, 100);
  };

  const handleGenerate = useCallback((params: GeneratorParams) => {
    generatePattern(params);
  }, [generatePattern]);

  const handleLoadPreset = useCallback((style: string) => {
    const presets = presetPatterns.filter(p => p.style === style);
    if (presets.length > 0) {
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      generatePattern({
        style: randomPreset.style,
        complexity: 3,
        density: 3,
        dynamics: 3,
      });
    }
  }, [generatePattern]);

  const handleVolumeChange = useCallback((drum: DrumType, volume: number) => {
    setVolume(drum, volume);
    setMixerState(prev => ({
      ...prev,
      [drum]: { ...prev[drum], volume },
    }));
  }, [setVolume]);

  const handleMuteChange = useCallback((drum: DrumType, mute: boolean) => {
    setMute(drum, mute);
    setMixerState(prev => ({
      ...prev,
      [drum]: { ...prev[drum], mute },
    }));
  }, [setMute]);

  const handleSoloChange = useCallback((drum: DrumType, solo: boolean) => {
    setMixerState(prev => ({
      ...prev,
      [drum]: { ...prev[drum], solo },
    }));
  }, []);

  const handleSwingChange = useCallback((amount: number) => {
    setSwing(amount);
    setSwingState(amount);
  }, [setSwing]);

  // Get track mute/solo states from pattern
  const getTrackMute = (drum: DrumType): boolean => {
    return currentPattern.tracks.find(t => t.drum === drum)?.mute ?? false;
  };

  const getTrackSolo = (drum: DrumType): boolean => {
    return currentPattern.tracks.find(t => t.drum === drum)?.solo ?? false;
  };

  if (showInitOverlay) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-accent-primary to-accent-blue bg-clip-text text-transparent mb-2">
              BeatForge
            </h1>
            <p className="text-text-secondary text-lg">智能鼓机伴奏软件</p>
          </div>
          
          <button
            onClick={handleInitAudio}
            className="px-8 py-4 bg-accent-primary text-bg-primary rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-accent-primary/30"
          >
            🎵 开始创作
          </button>
          
          <p className="mt-4 text-text-secondary text-sm">
            点击任意位置启动音频引擎
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="border-b border-white/10 bg-bg-secondary/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-primary to-accent-blue flex items-center justify-center">
              <span className="text-xl">🥁</span>
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-tight">BeatForge</h1>
              <p className="text-xs text-text-secondary">智能鼓机 v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface rounded-full">
              <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-accent-primary' : 'bg-accent-secondary'}`} />
              <span className="text-xs text-text-secondary">
                {isReady ? '就绪' : '加载中'}
              </span>
            </div>

            {/* Keyboard hints */}
            <div className="hidden md:flex items-center gap-2 text-xs text-text-secondary">
              <kbd className="px-2 py-1 bg-bg-surface rounded">Space</kbd>
              <span>播放</span>
              <kbd className="px-2 py-1 bg-bg-surface rounded ml-2">Enter</kbd>
              <span>停止</span>
              <kbd className="px-2 py-1 bg-bg-surface rounded ml-2">1-8</kbd>
              <span>触发鼓垫</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Drum Pads */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-bg-secondary rounded-xl p-6">
              <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                鼓组
              </h2>
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {DRUM_ORDER.map(drum => (
                  <DrumPad
                    key={drum}
                    drum={drum}
                    name={DRUM_CONFIGS[drum].name}
                    nameCn={DRUM_CONFIGS[drum].nameCn}
                    color={DRUM_CONFIGS[drum].color}
                    isMuted={getTrackMute(drum)}
                    isSolo={getTrackSolo(drum)}
                    isPlaying={isPlaying}
                    isActive={currentPattern.tracks.find(t => t.drum === drum)?.steps[currentStep]?.active ?? false}
                    onTrigger={() => playDrum(drum)}
                    onMute={() => handleMuteChange(drum, !getTrackMute(drum))}
                    onSolo={() => handleSoloChange(drum, !getTrackSolo(drum))}
                  />
                ))}
              </div>
            </section>

            {/* Waveform Display */}
            <WaveformDisplay
              getWaveformData={getWaveformData}
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={16}
            />
          </div>

          {/* Center Column - Step Sequencer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transport Controls */}
            <TransportControls
              bpm={bpm}
              isPlaying={isPlaying}
              swing={swing}
              onBpmChange={setBpm}
              onSwingChange={handleSwingChange}
              onPlay={start}
              onStop={stop}
              onPause={pause}
              currentStep={currentStep}
              totalSteps={16}
            />

            {/* Step Sequencer */}
            <StepSequencer
              tracks={currentPattern.tracks}
              currentStep={currentStep}
              isPlaying={isPlaying}
              onToggleStep={toggleStep}
              onSetVelocity={setStepVelocity}
            />

            {/* Pattern Generator */}
            <PatternGenerator
              onGenerate={handleGenerate}
              onLoadPreset={handleLoadPreset}
            />
          </div>
        </div>

        {/* Mixer Bar */}
        <div className="mt-6">
          <Mixer
            channels={mixerState}
            onVolumeChange={handleVolumeChange}
            onMuteChange={handleMuteChange}
            onSoloChange={handleSoloChange}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs text-text-secondary">
          <div>
            BeatForge v1.0 © 2026 · 全平台鼓机伴奏软件
          </div>
          <div className="flex items-center gap-4">
            <span>按 1-8 触发鼓垫</span>
            <span>·</span>
            <span>Space 播放/暂停</span>
            <span>·</span>
            <span>Enter 停止</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
