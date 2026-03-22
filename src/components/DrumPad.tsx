import React, { useState, useCallback, memo } from 'react';
import type { DrumType } from '../types';

interface DrumPadProps {
  drum: DrumType;
  name: string;
  nameCn: string;
  color: string;
  isActive?: boolean;
  isMuted?: boolean;
  isSolo?: boolean;
  onTrigger: (velocity?: number) => void;
  onMute?: () => void;
  onSolo?: () => void;
  isPlaying?: boolean;
}

export const DrumPad = memo(function DrumPad({
  drum,
  name,
  nameCn,
  color,
  isActive = false,
  isMuted = false,
  isSolo = false,
  onTrigger,
  onMute,
  onSolo,
  isPlaying = false,
}: DrumPadProps) {
  const [isHit, setIsHit] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);

  const handleMouseDown = useCallback(() => {
    setIsHit(true);
    onTrigger(100);
  }, [onTrigger]);

  const handleMouseUp = useCallback(() => {
    setIsHit(false);
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowContextMenu(true);
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setShowContextMenu(false);
  }, []);

  return (
    <div className="relative">
      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
        className={`
          relative w-20 h-20 rounded-xl
          transition-all duration-100
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary
          ${isHit ? 'scale-95' : 'hover:scale-102 hover:-translate-y-1'}
          ${isMuted ? 'opacity-40' : 'opacity-100'}
          ${isPlaying && isActive ? 'ring-2 ring-white ring-opacity-50' : ''}
        `}
        style={{
          backgroundColor: isActive ? color : `${color}33`,
          boxShadow: isActive ? `0 0 20px ${color}66, inset 0 2px 10px rgba(255,255,255,0.2)` : `inset 0 2px 10px rgba(0,0,0,0.3)`,
          border: `2px solid ${color}`,
          outline: 'none',
        }}
      >
        {/* Hit animation particles */}
        {isHit && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full animate-particle"
                style={{
                  backgroundColor: color,
                  left: '50%',
                  top: '50%',
                  ['--tx' as string]: `${(Math.random() - 0.5) * 60}px`,
                  ['--ty' as string]: `${(Math.random() - 0.5) * 60}px`,
                  animationDelay: `${i * 20}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Drum icon */}
        <div className="flex flex-col items-center justify-center h-full">
          <span className="text-2xl" role="img" aria-label={name}>
            {getDrumEmoji(drum)}
          </span>
        </div>

        {/* Solo indicator */}
        {isSolo && (
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-tertiary border border-white flex items-center justify-center"
            title="Solo"
          >
            <span className="text-[8px] font-bold text-bg-primary">S</span>
          </div>
        )}

        {/* Mute indicator */}
        {isMuted && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-0.5 bg-red-500 rotate-45 transform" />
          </div>
        )}
      </button>

      {/* Label */}
      <div className="mt-2 text-center">
        <div className="text-xs font-medium text-text-primary">{name}</div>
        <div className="text-[10px] text-text-secondary">{nameCn}</div>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleCloseContextMenu}
          />
          <div 
            className="absolute top-full left-0 mt-2 py-2 bg-bg-secondary rounded-lg shadow-xl z-50 min-w-32 border border-white/10"
            onClick={handleCloseContextMenu}
          >
            <button
              onClick={() => { onMute?.(); handleCloseContextMenu(); }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-bg-surface ${isMuted ? 'text-accent-secondary' : 'text-text-primary'}`}
            >
              {isMuted ? '🔇 取消静音' : '🔇 静音'}
            </button>
            <button
              onClick={() => { onSolo?.(); handleCloseContextMenu(); }}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-bg-surface ${isSolo ? 'text-accent-tertiary' : 'text-text-primary'}`}
            >
              {isSolo ? '🔊 取消独奏' : '🔊 独奏'}
            </button>
          </div>
        </>
      )}
    </div>
  );
});

function getDrumEmoji(drum: DrumType): string {
  const emojis: Record<DrumType, string> = {
    kick: '🥁',
    snare: '🔥',
    hihat: '💫',
    openhat: '✨',
    tom1: '🎯',
    tom2: '🎱',
    crash: '💥',
    ride: '🔔',
  };
  return emojis[drum] || '🥁';
}
