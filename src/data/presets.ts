import type { PresetPattern, DrumType, Step } from '../types';

const DRUM_ORDER: DrumType[] = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'];

const createStep = (active: boolean, velocity: number = 100): Step => ({
  active,
  velocity,
  probability: 100,
});

export const presetPatterns: PresetPattern[] = [
  // POP - Classic Four-on-the-Floor
  {
    name: 'Pop Basic',
    nameCn: '流行基础',
    style: 'pop',
    bpm: 120,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map((drum, i) => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1));
            case 'openhat': return [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0].map(v => createStep(v === 1));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // HIP-HOP - Classic Boom Bap
  {
    name: 'Hip-Hop Boom Bap',
    nameCn: '嘻哈Boom Bap',
    style: 'hiphop',
    bpm: 90,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,1,0,0,1,0,0,1,0,0,0,0,1,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1, 80));
            case 'openhat': return [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0].map(v => createStep(v === 1, 70));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // ROCK - Driving Rock Beat
  {
    name: 'Rock Drive',
    nameCn: '摇滚驱动',
    style: 'rock',
    bpm: 140,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,0,1,0,0,1,1,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1));
            case 'crash': return [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1].map(v => createStep(v === 1, 110));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // EDM - Four on the Floor with Hi-hats
  {
    name: 'EDM Banger',
    nameCn: '电子嗨曲',
    style: 'edm',
    bpm: 128,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map(v => createStep(v === 1, 60));
            case 'openhat': return [0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0].map(v => createStep(v === 1));
            case 'crash': return [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0].map(v => createStep(v === 1, 100));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // JAZZ - Swing Groove
  {
    name: 'Jazz Swing',
    nameCn: '爵士摇摆',
    style: 'jazz',
    bpm: 120,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1].map(v => createStep(v === 1));
            case 'hihat': return [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1].map(v => createStep(v === 1, 70));
            case 'ride': return [1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1].map(v => createStep(v === 1));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // FUNK - Syncopated Groove
  {
    name: 'Funk Pocket',
    nameCn: '放克律动',
    style: 'funk',
    bpm: 110,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,1,0,0,0,1,1,0,0,0,0,0,1,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1));
            case 'openhat': return [0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0].map(v => createStep(v === 1));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // LATIN - Samba Groove
  {
    name: 'Latin Samba',
    nameCn: '拉丁桑巴',
    style: 'latin',
    bpm: 104,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.8,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,1,0,0,0,1,1,0,0,0,0,1,0,0].map(v => createStep(v === 1));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0].map(v => createStep(v === 1, 70));
            case 'ride': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },

  // METAL - Double Bass Blast
  {
    name: 'Metal Blast',
    nameCn: '金属猛击',
    style: 'metal',
    bpm: 180,
    pattern: {
      steps: 16,
      tracks: DRUM_ORDER.map(drum => ({
        drum,
        volume: 0.9,
        pan: 0,
        mute: false,
        solo: false,
        steps: (() => {
          switch (drum) {
            case 'kick': return [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0].map(v => createStep(v === 1, 120));
            case 'snare': return [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0].map(v => createStep(v === 1));
            case 'hihat': return [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0].map(v => createStep(v === 1, 90));
            case 'crash': return [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0].map(v => createStep(v === 1, 110));
            case 'tom1': return [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0].map(v => createStep(v === 1));
            default: return Array(16).fill(createStep(false));
          }
        })(),
      })),
    },
  },
];

// Get presets by style
export function getPresetsByStyle(style: string): PresetPattern[] {
  return presetPatterns.filter(p => p.style === style);
}

// Get preset by name
export function getPresetByName(name: string): PresetPattern | undefined {
  return presetPatterns.find(p => p.name === name);
}
