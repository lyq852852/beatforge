import React, { memo, useCallback } from 'react';
import type { DrumType, ChannelState } from '../types';

interface MixerProps {
  channels: Record<DrumType, ChannelState>;
  onVolumeChange: (drum: DrumType, volume: number) => void;
  onMuteChange: (drum: DrumType, mute: boolean) => void;
  onSoloChange: (drum: DrumType, solo: boolean) => void;
}

const DRUMS: { drum: DrumType; label: string; color: string }[] = [
  { drum: 'kick', label: 'KICK', color: '#FF6B35' },
  { drum: 'snare', label: 'SNARE', color: '#FFD93D' },
  { drum: 'hihat', label: 'HH', color: '#6BCB77' },
  { drum: 'openhat', label: 'OH', color: '#8FD694' },
  { drum: 'tom1', label: 'TOM1', color: '#4D96FF' },
  { drum: 'tom2', label: 'TOM2', color: '#6BA3FF' },
  { drum: 'crash', label: 'CRASH', color: '#C77DFF' },
  { drum: 'ride', label: 'RIDE', color: '#00C9A7' },
];

export const Mixer = memo(function Mixer({
  channels,
  onVolumeChange,
  onMuteChange,
  onSoloChange,
}: MixerProps) {
  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Mixer
        </h3>
        <div className="text-xs text-text-secondary">
          {Object.values(channels).filter(c => !c.mute).length} active
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        {DRUMS.map(({ drum, label, color }) => (
          <MixerChannel
            key={drum}
            label={label}
            color={color}
            volume={channels[drum]?.volume ?? 0.8}
            mute={channels[drum]?.mute ?? false}
            solo={channels[drum]?.solo ?? false}
            onVolumeChange={(v) => onVolumeChange(drum, v)}
            onMuteChange={(m) => onMuteChange(drum, m)}
            onSoloChange={(s) => onSoloChange(drum, s)}
          />
        ))}
      </div>
    </div>
  );
});

interface MixerChannelProps {
  label: string;
  color: string;
  volume: number;
  mute: boolean;
  solo: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteChange: (mute: boolean) => void;
  onSoloChange: (solo: boolean) => void;
}

const MixerChannel = memo(function MixerChannel({
  label,
  color,
  volume,
  mute,
  solo,
  onVolumeChange,
  onMuteChange,
  onSoloChange,
}: MixerChannelProps) {
  const handleVolumeDrag = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const y = moveEvent.clientY - rect.top;
      const height = rect.height;
      const newVolume = Math.max(0, Math.min(1, 1 - y / height));
      onVolumeChange(newVolume);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [onVolumeChange]);

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Solo/Mute buttons */}
      <div className="flex gap-1">
        <button
          onClick={() => onSoloChange(!solo)}
          className={`
            w-6 h-5 text-[10px] font-bold rounded transition-colors
            ${solo 
              ? 'bg-accent-tertiary text-bg-primary' 
              : 'bg-bg-surface text-text-secondary hover:bg-bg-surface/80'}
          `}
        >
          S
        </button>
        <button
          onClick={() => onMuteChange(!mute)}
          className={`
            w-6 h-5 text-[10px] font-bold rounded transition-colors
            ${mute 
              ? 'bg-accent-secondary text-white' 
              : 'bg-bg-surface text-text-secondary hover:bg-bg-surface/80'}
          `}
        >
          M
        </button>
      </div>

      {/* Volume fader */}
      <div
        className="relative w-6 h-24 bg-bg-surface rounded cursor-ns-resize"
        onMouseDown={handleVolumeDrag}
      >
        {/* Active portion */}
        <div 
          className="absolute bottom-0 left-0 right-0 rounded transition-all"
          style={{ 
            height: `${volume * 100}%`,
            backgroundColor: mute ? '#666' : color,
            opacity: mute ? 0.3 : 0.8,
          }}
        />
        
        {/* Fader handle */}
        <div 
          className="absolute left-0 right-0 h-2 rounded cursor-grab active:cursor-grabbing"
          style={{ 
            top: `calc(${(1 - volume) * 100}% - 4px)`,
            backgroundColor: '#fff',
            boxShadow: '0 0 8px rgba(255,255,255,0.3)',
          }}
        />
      </div>

      {/* Volume value */}
      <div className="text-[10px] font-mono text-text-secondary">
        {Math.round(volume * 100)}
      </div>

      {/* Label */}
      <div 
        className="text-[10px] font-bold tracking-wider px-2 py-1 rounded"
        style={{ 
          color,
          backgroundColor: `${color}22`,
        }}
      >
        {label}
      </div>
    </div>
  );
});
