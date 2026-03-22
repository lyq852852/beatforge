import React, { memo, useEffect, useRef, useCallback } from 'react';

interface WaveformDisplayProps {
  getWaveformData: () => Float32Array;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
}

export const WaveformDisplay = memo(function WaveformDisplay({
  getWaveformData,
  isPlaying,
  currentStep,
  totalSteps,
}: WaveformDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = getWaveformData();

    // Clear canvas
    ctx.fillStyle = '#0D0D12';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#252532';
    ctx.lineWidth = 1;
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Vertical beat lines
    const stepWidth = width / totalSteps;
    for (let i = 0; i <= totalSteps; i += 4) {
      ctx.beginPath();
      ctx.moveTo(i * stepWidth, 0);
      ctx.lineTo(i * stepWidth, height);
      ctx.stroke();
    }

    // Draw waveform
    ctx.beginPath();
    ctx.strokeStyle = '#00FFAA';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00FFAA';

    const sliceWidth = width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      const v = (data[i] + 1) / 2;
      const y = v * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw current step indicator
    if (isPlaying) {
      const indicatorX = (currentStep + 0.5) * stepWidth;
      ctx.beginPath();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.moveTo(indicatorX, 0);
      ctx.lineTo(indicatorX, height);
      ctx.stroke();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [getWaveformData, isPlaying, currentStep, totalSteps]);

  useEffect(() => {
    // Set canvas size
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <div className="bg-bg-secondary rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-secondary uppercase tracking-wider">Waveform</span>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-accent-primary animate-pulse' : 'bg-text-secondary'}`} />
          <span className="text-xs text-text-secondary">{isPlaying ? 'LIVE' : 'IDLE'}</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-20 rounded-lg"
        style={{ background: '#0D0D12' }}
      />
    </div>
  );
});
