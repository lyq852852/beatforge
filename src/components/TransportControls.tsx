import React, { memo, useState, useCallback, useRef, useEffect } from 'react';

interface TransportControlsProps {
  bpm: number;
  isPlaying: boolean;
  swing: number;
  onBpmChange: (bpm: number) => void;
  onSwingChange: (amount: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onPause: () => void;
  currentStep: number;
  totalSteps: number;
}

export const TransportControls = memo(function TransportControls({
  bpm,
  isPlaying,
  swing,
  onBpmChange,
  onSwingChange,
  onPlay,
  onStop,
  onPause,
  currentStep,
  totalSteps,
}: TransportControlsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(bpm.toString());
  const inputRef = useRef<HTMLInputElement>(null);
  const tapTimesRef = useRef<number[]>([]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBpmDoubleClick = useCallback(() => {
    setEditValue(bpm.toString());
    setIsEditing(true);
  }, [bpm]);

  const handleBpmSubmit = useCallback(() => {
    const newBpm = parseInt(editValue);
    if (!isNaN(newBpm) && newBpm >= 40 && newBpm <= 240) {
      onBpmChange(newBpm);
    }
    setIsEditing(false);
  }, [editValue, onBpmChange]);

  const handleTapTempo = useCallback(() => {
    const now = Date.now();
    if (!tapTimesRef.current.length) {
      tapTimesRef.current.push(now);
    } else {
      const lastTap = tapTimesRef.current[tapTimesRef.current.length - 1];
      if (now - lastTap > 2000) {
        tapTimesRef.current = [now];
      } else {
        tapTimesRef.current.push(now);
        if (tapTimesRef.current.length > 4) {
          tapTimesRef.current.shift();
        }
      }
    }
    
    if (tapTimesRef.current.length >= 2) {
      const intervals = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        intervals.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const newBpm = Math.round(60000 / avgInterval);
      if (newBpm >= 40 && newBpm <= 240) {
        onBpmChange(newBpm);
      }
    }
  }, [onBpmChange]);

  return (
    <div className="bg-bg-secondary rounded-xl p-6">
      {/* BPM Display */}
      <div className="text-center mb-6">
        <div className="text-text-secondary text-xs mb-1 uppercase tracking-wider">Tempo</div>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onBpmChange(bpm - 1)}
            className="w-10 h-10 rounded-lg bg-bg-surface hover:bg-bg-surface/80 flex items-center justify-center text-xl transition-colors"
          >
            −
          </button>
          
          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBpmSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBpmSubmit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="w-24 h-14 text-center text-3xl font-mono font-bold bg-bg-surface rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
              min={40}
              max={240}
            />
          ) : (
            <div
              onClick={handleBpmDoubleClick}
              className="w-24 h-14 flex items-center justify-center text-3xl font-mono font-bold bg-bg-surface rounded-lg cursor-pointer hover:bg-bg-surface/80 transition-colors"
              title="Click to edit BPM"
            >
              {bpm}
            </div>
          )}
          
          <button
            onClick={() => onBpmChange(bpm + 1)}
            className="w-10 h-10 rounded-lg bg-bg-surface hover:bg-bg-surface/80 flex items-center justify-center text-xl transition-colors"
          >
            +
          </button>
        </div>
        <div className="text-text-secondary text-sm mt-1">BPM</div>
        
        {/* Tap Tempo Button */}
        <button
          onClick={handleTapTempo}
          className="mt-3 px-4 py-2 text-xs font-medium text-text-secondary border border-text-secondary/30 rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors"
        >
          TAP TEMPO
        </button>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Step {currentStep + 1}</span>
          <span>{totalSteps}</span>
        </div>
        <div className="h-2 bg-bg-surface rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent-primary to-accent-blue transition-all duration-75"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Transport Buttons */}
      <div className="flex items-center justify-center gap-3">
        {/* Stop */}
        <button
          onClick={onStop}
          className="w-12 h-12 rounded-full bg-bg-surface hover:bg-accent-secondary/20 flex items-center justify-center transition-colors group"
          title="Stop (Enter)"
        >
          <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-secondary" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="6" width="12" height="12" rx="1" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className={`
            w-16 h-16 rounded-full flex items-center justify-center transition-all
            ${isPlaying 
              ? 'bg-accent-primary/20 border-2 border-accent-primary' 
              : 'bg-accent-primary hover:scale-105'}
            shadow-lg hover:shadow-accent-primary/30
          `}
          title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
        >
          {isPlaying ? (
            <svg className="w-6 h-6 text-accent-primary" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="w-7 h-7 text-bg-primary ml-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v14.72a1 1 0 001.5.86l11-7.36a1 1 0 000-1.72l-11-7.36a1 1 0 00-1.5.86z" />
            </svg>
          )}
        </button>
      </div>

      {/* Swing Control */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-secondary uppercase tracking-wider">Swing</span>
          <span className="text-xs font-mono text-accent-blue">{Math.round(swing * 100)}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={swing}
          onChange={(e) => onSwingChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-bg-surface rounded-full appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
});
