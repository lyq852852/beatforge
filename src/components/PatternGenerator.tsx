import React, { memo, useState, useCallback } from 'react';
import type { GeneratorParams } from '../types';

interface PatternGeneratorProps {
  onGenerate: (params: GeneratorParams) => void;
  onLoadPreset: (style: string) => void;
}

const STYLES = [
  { id: 'pop', name: '流行 Pop', icon: '🎤' },
  { id: 'rock', name: '摇滚 Rock', icon: '🎸' },
  { id: 'hiphop', name: '嘻哈 Hip-Hop', icon: '🎧' },
  { id: 'edm', name: '电子 EDM', icon: '🎹' },
  { id: 'jazz', name: '爵士 Jazz', icon: '🎷' },
  { id: 'latin', name: '拉丁 Latin', icon: '💃' },
  { id: 'funk', name: '放克 Funk', icon: '🪩' },
  { id: 'metal', name: '金属 Metal', icon: '🤘' },
];

export const PatternGenerator = memo(function PatternGenerator({
  onGenerate,
  onLoadPreset,
}: PatternGeneratorProps) {
  const [selectedStyle, setSelectedStyle] = useState('pop');
  const [complexity, setComplexity] = useState(3);
  const [density, setDensity] = useState(3);
  const [dynamics, setDynamics] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    
    // Simulate generation delay for UX
    setTimeout(() => {
      onGenerate({
        style: selectedStyle,
        complexity,
        density,
        dynamics,
      });
      setIsGenerating(false);
    }, 500);
  }, [selectedStyle, complexity, density, dynamics, onGenerate]);

  return (
    <div className="bg-bg-secondary rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🎲</span>
        <span>智能节奏生成器</span>
      </h3>

      {/* Style Selection */}
      <div className="mb-6">
        <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">
          音乐风格
        </label>
        <div className="grid grid-cols-4 gap-2">
          {STYLES.map(style => (
            <button
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className={`
                p-3 rounded-lg text-center transition-all
                ${selectedStyle === style.id 
                  ? 'bg-accent-primary/20 border-2 border-accent-primary' 
                  : 'bg-bg-surface hover:bg-bg-surface/80 border-2 border-transparent'}
              `}
            >
              <div className="text-xl mb-1">{style.icon}</div>
              <div className="text-xs font-medium truncate">{style.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-4">
        {/* Complexity */}
        <ParameterSlider
          label="复杂度"
          description="节奏的复杂程度"
          value={complexity}
          onChange={setComplexity}
          min={1}
          max={5}
        />

        {/* Density */}
        <ParameterSlider
          label="密度"
          description="音符填充的密集程度"
          value={density}
          onChange={setDensity}
          min={1}
          max={5}
        />

        {/* Dynamics */}
        <ParameterSlider
          label="动态"
          description="力度变化的幅度"
          value={dynamics}
          onChange={setDynamics}
          min={1}
          max={5}
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`
          w-full mt-6 py-4 rounded-xl font-semibold text-lg
          transition-all flex items-center justify-center gap-3
          ${isGenerating 
            ? 'bg-bg-surface text-text-secondary cursor-wait' 
            : 'bg-gradient-to-r from-accent-primary to-accent-blue hover:scale-[1.02] hover:shadow-lg hover:shadow-accent-primary/30 text-bg-primary'}
        `}
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⚙️</span>
            <span>生成中...</span>
          </>
        ) : (
          <>
            <span className="text-xl">✨</span>
            <span>生成新节奏</span>
          </>
        )}
      </button>

      {/* Quick Presets */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <label className="block text-xs text-text-secondary uppercase tracking-wider mb-3">
          快速加载
        </label>
        <div className="flex flex-wrap gap-2">
          {STYLES.slice(0, 4).map(style => (
            <button
              key={style.id}
              onClick={() => onLoadPreset(style.id)}
              className="px-3 py-2 bg-bg-surface hover:bg-bg-surface/80 rounded-lg text-xs transition-colors"
            >
              {style.icon} {style.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

interface ParameterSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const ParameterSlider = memo(function ParameterSlider({
  label,
  description,
  value,
  onChange,
  min,
  max,
}: ParameterSliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <label className="text-sm font-medium">{label}</label>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: max - min + 1 }, (_, i) => i + min).map(level => (
            <button
              key={level}
              onClick={() => onChange(level)}
              className={`
                w-6 h-6 rounded text-xs font-bold transition-all
                ${level <= value 
                  ? 'bg-accent-primary text-bg-primary' 
                  : 'bg-bg-surface text-text-secondary hover:bg-bg-surface/80'}
              `}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
