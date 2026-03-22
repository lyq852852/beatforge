import React, { memo, useCallback } from 'react';
import type { DrumType, Track } from '../types';

interface StepSequencerProps {
  tracks: Track[];
  currentStep: number;
  isPlaying: boolean;
  onToggleStep: (drum: DrumType, step: number) => void;
  onSetVelocity: (drum: DrumType, step: number, velocity: number) => void;
}

export const StepSequencer = memo(function StepSequencer({
  tracks,
  currentStep,
  isPlaying,
  onToggleStep,
  onSetVelocity,
}: StepSequencerProps) {
  const steps = Array.from({ length: 16 }, (_, i) => i);

  return (
    <div className="bg-bg-secondary rounded-xl p-4 overflow-x-auto">
      {/* Header with step numbers */}
      <div className="flex mb-2 pl-24">
        {steps.map(step => (
          <div
            key={step}
            className={`
              w-8 h-6 flex items-center justify-center
              text-xs font-mono rounded
              transition-all duration-75
              ${step === currentStep && isPlaying 
                ? 'bg-accent-primary text-bg-primary font-bold' 
                : step % 4 === 0 
                  ? 'text-text-secondary' 
                  : 'text-text-secondary/50'}
            `}
          >
            {step + 1}
          </div>
        ))}
      </div>

      {/* Track rows */}
      {tracks.map(track => (
        <TrackRow
          key={track.drum}
          track={track}
          currentStep={currentStep}
          isPlaying={isPlaying}
          onToggleStep={onToggleStep}
          onSetVelocity={onSetVelocity}
        />
      ))}

      {/* Beat markers */}
      <div className="flex mt-2 pl-24">
        {steps.map(step => (
          <div
            key={step}
            className={`
              w-8 h-1 rounded-full transition-colors duration-75
              ${step === currentStep && isPlaying 
                ? 'bg-accent-primary shadow-lg shadow-accent-primary/50' 
                : step % 4 === 0 
                  ? 'bg-accent-tertiary/50' 
                  : 'bg-bg-surface'}
            `}
          />
        ))}
      </div>
    </div>
  );
});

interface TrackRowProps {
  track: Track;
  currentStep: number;
  isPlaying: boolean;
  onToggleStep: (drum: DrumType, step: number) => void;
  onSetVelocity: (drum: DrumType, step: number, velocity: number) => void;
}

const TrackRow = memo(function TrackRow({
  track,
  currentStep,
  isPlaying,
  onToggleStep,
  onSetVelocity,
}: TrackRowProps) {
  const getDrumColor = (drum: DrumType): string => {
    const colors: Record<DrumType, string> = {
      kick: '#FF6B35',
      snare: '#FFD93D',
      hihat: '#6BCB77',
      openhat: '#8FD694',
      tom1: '#4D96FF',
      tom2: '#6BA3FF',
      crash: '#C77DFF',
      ride: '#00C9A7',
    };
    return colors[drum];
  };

  const handleStepClick = useCallback((step: number) => {
    onToggleStep(track.drum, step);
  }, [track.drum, onToggleStep]);

  const handleVelocityChange = useCallback((step: number, e: React.ChangeEvent<HTMLInputElement>) => {
    onSetVelocity(track.drum, step, parseInt(e.target.value));
  }, [track.drum, onSetVelocity]);

  return (
    <div className="flex items-center mb-2 group">
      {/* Track label */}
      <div 
        className="w-24 flex-shrink-0 px-2 py-1 rounded text-xs font-medium truncate"
        style={{ 
          backgroundColor: `${getDrumColor(track.drum)}22`,
          color: getDrumColor(track.drum)
        }}
      >
        {track.drum.toUpperCase()}
        {track.mute && <span className="ml-1 text-red-400">(M)</span>}
        {track.solo && <span className="ml-1 text-yellow-400">(S)</span>}
      </div>

      {/* Steps */}
      <div className="flex gap-1">
        {track.steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Velocity bar behind step */}
            <div 
              className="absolute inset-0 rounded opacity-30"
              style={{ 
                backgroundColor: getDrumColor(track.drum),
                height: `${(step.velocity / 127) * 100}%`,
                bottom: 0,
              }}
            />
            
            {/* Step button */}
            <button
              onClick={() => handleStepClick(index)}
              className={`
                w-8 h-8 rounded transition-all duration-75
                relative overflow-hidden
                ${track.mute ? 'opacity-30' : 'opacity-100'}
                ${step.active 
                  ? 'shadow-md' 
                  : 'bg-bg-surface hover:bg-bg-surface/80'}
                ${index === currentStep && isPlaying 
                  ? 'ring-2 ring-white ring-opacity-80' 
                  : ''}
              `}
              style={{
                backgroundColor: step.active ? getDrumColor(track.drum) : undefined,
                boxShadow: step.active 
                  ? `0 0 10px ${getDrumColor(track.drum)}66` 
                  : undefined,
              }}
            >
              {/* Velocity indicator */}
              {step.active && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/30">
                  <div 
                    className="h-0.5 transition-all"
                    style={{ 
                      width: `${(step.velocity / 127) * 100}%`,
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              )}
            </button>

            {/* Beat marker */}
            {index % 4 === 0 && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-accent-tertiary/50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
