import * as Tone from 'tone';
import type { DrumType, Step } from '../types';

// Audio engine singleton
class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  private mixer: Tone.Channel[] = [];
  private masterChannel: Tone.Channel | null = null;
  private analyser: Tone.Analyser | null = null;
  private sequence: Tone.Sequence | null = null;
  private isInitialized = false;

  // Drum configs with colors
  readonly drumConfigs: Record<DrumType, { name: string; nameCn: string; color: string; pitch: string }> = {
    kick: { name: 'Kick', nameCn: '底鼓', color: '#FF6B35', pitch: 'C1' },
    snare: { name: 'Snare', nameCn: '军鼓', color: '#FFD93D', pitch: 'D1' },
    hihat: { name: 'Hi-Hat', nameCn: '踩镲', color: '#6BCB77', pitch: 'F#1' },
    openhat: { name: 'Open Hat', nameCn: '开镲', color: '#8FD694', pitch: 'F#1' },
    tom1: { name: 'Tom 1', nameCn: '高音桶', color: '#4D96FF', pitch: 'G1' },
    tom2: { name: 'Tom 2', nameCn: '低音桶', color: '#6BA3FF', pitch: 'E1' },
    crash: { name: 'Crash', nameCn: '强音镲', color: '#C77DFF', pitch: 'C2' },
    ride: { name: 'Ride', nameCn: '叮叮镲', color: '#00C9A7', pitch: 'B1' },
  };

  // Initialize audio context
  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      console.log('Audio context started');

      // Create master channel
      this.masterChannel = new Tone.Channel().toDestination();
      
      // Create analyser for visualization
      this.analyser = new Tone.Analyser('waveform', 512);
      this.masterChannel.connect(this.analyser);

      // Create mixer channels for each drum
      const drumTypes: DrumType[] = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'];
      this.mixer = drumTypes.map(drum => {
        const channel = new Tone.Channel();
        channel.connect(this.masterChannel!);
        return channel;
      });

      // Create synth-based drum sounds (fallback when samples not loaded)
      this.createSynthSounds();

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      throw error;
    }
  }

  // Create synthesized drum sounds
  private createSynthSounds(): void {
    // This will be called internally - we use Tone.MembraneSynth, etc.
  }

  // Play a drum sound
  playDrum(drum: DrumType, velocity: number = 100): void {
    if (!this.isInitialized) return;

    const index = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'].indexOf(drum);
    if (index === -1) return;

    const channel = this.mixer[index];
    const config = this.drumConfigs[drum];

    // Velocity scaled to 0-1
    const vel = velocity / 127;

    // Create and play sound based on drum type
    switch (drum) {
      case 'kick':
        const kick = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 6,
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.001,
            decay: 0.3,
            sustain: 0,
            release: 0.1
          }
        }).connect(channel);
        kick.triggerAttackRelease('C1', '8n', undefined, vel);
        setTimeout(() => kick.dispose(), 1000);
        break;

      case 'snare':
        const snare = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0,
            release: 0.1
          }
        }).connect(channel);
        snare.triggerAttackRelease('8n', undefined, vel);
        setTimeout(() => snare.dispose(), 1000);
        break;

      case 'hihat':
      case 'openhat':
        const hat = new Tone.MetalSynth({
          frequency: 200,
          envelope: {
            attack: 0.001,
            decay: drum === 'openhat' ? 0.4 : 0.1,
            release: 0.1
          },
          harmonicity: 5.1,
          modulationIndex: 32,
          resonance: 4000,
          octaves: 1.5
        }).connect(channel);
        hat.volume.value = -10;
        hat.triggerAttackRelease(drum === 'openhat' ? '16n' : '32n', undefined, vel);
        setTimeout(() => hat.dispose(), 1000);
        break;

      case 'tom1':
      case 'tom2':
        const tom = new Tone.MembraneSynth({
          pitchDecay: 0.08,
          octaves: 3,
          oscillator: { type: 'sine' },
          envelope: {
            attack: 0.001,
            decay: 0.25,
            sustain: 0,
            release: 0.1
          }
        }).connect(channel);
        tom.triggerAttackRelease(drum === 'tom1' ? 'G1' : 'E1', '8n', undefined, vel);
        setTimeout(() => tom.dispose(), 1000);
        break;

      case 'crash':
      case 'ride':
        const cymbal = new Tone.MetalSynth({
          frequency: 300,
          envelope: {
            attack: 0.001,
            decay: drum === 'crash' ? 1.5 : 2,
            release: 0.5
          },
          harmonicity: 5.1,
          modulationIndex: 64,
          resonance: 8000,
          octaves: 2
        }).connect(channel);
        cymbal.volume.value = -8;
        cymbal.triggerAttackRelease('16n', undefined, vel);
        setTimeout(() => cymbal.dispose(), 2000);
        break;
    }
  }

  // Set channel volume
  setVolume(drum: DrumType, volume: number): void {
    const index = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'].indexOf(drum);
    if (index === -1 || !this.mixer[index]) return;
    
    // Convert 0-1 to dB
    const db = volume === 0 ? -Infinity : (Math.log10(volume) * 20);
    this.mixer[index].volume.value = db;
  }

  // Set channel mute
  setMute(drum: DrumType, mute: boolean): void {
    const index = ['kick', 'snare', 'hihat', 'openhat', 'tom1', 'tom2', 'crash', 'ride'].indexOf(drum);
    if (index === -1 || !this.mixer[index]) return;
    this.mixer[index].mute = mute;
  }

  // Set master volume
  setMasterVolume(volume: number): void {
    if (!this.masterChannel) return;
    const db = volume === 0 ? -Infinity : (Math.log10(volume) * 20);
    this.masterChannel.volume.value = db - 6; // Leave some headroom
  }

  // Get waveform data for visualization
  getWaveformData(): Float32Array {
    if (!this.analyser) return new Float32Array(512);
    return this.analyser.getValue() as Float32Array;
  }

  // Get current BPM
  get bpm(): number {
    return Tone.Transport.bpm.value;
  }

  // Set BPM
  set bpm(value: number) {
    Tone.Transport.bpm.value = value;
  }

  // Start transport
  start(): void {
    Tone.Transport.start();
  }

  // Stop transport
  stop(): void {
    Tone.Transport.stop();
    Tone.Transport.position = 0;
  }

  // Pause transport
  pause(): void {
    Tone.Transport.pause();
  }

  // Get transport state
  get isPlaying(): boolean {
    return Tone.Transport.state === 'started';
  }

  // Set swing
  setSwing(amount: number): void {
    // 0-1 maps to 0-100% swing
    Tone.Transport.swing = amount;
    Tone.Transport.swingSubdivision = '16n';
  }

  // Create a sequence
  createSequence(
    steps: number,
    tracks: Map<DrumType, Step[]>,
    callback: (step: number, time: Tone.Unit.Time) => void
  ): void {
    // Dispose old sequence
    if (this.sequence) {
      this.sequence.dispose();
    }

    // Create sequence with step indices
    const indices = Array.from({ length: steps }, (_, i) => i);
    
    this.sequence = new Tone.Sequence(
      (time, step) => {
        callback(step, time);
      },
      indices,
      '16n'
    );
  }

  // Start sequence
  startSequence(): void {
    if (this.sequence) {
      this.sequence.start(0);
    }
  }

  // Stop sequence
  stopSequence(): void {
    if (this.sequence) {
      this.sequence.stop();
    }
  }

  // Dispose all resources
  dispose(): void {
    if (this.sequence) {
      this.sequence.dispose();
      this.sequence = null;
    }
    
    this.mixer.forEach(ch => ch.dispose());
    this.mixer = [];
    
    if (this.analyser) {
      this.analyser.dispose();
      this.analyser = null;
    }
    
    if (this.masterChannel) {
      this.masterChannel.dispose();
      this.masterChannel = null;
    }
    
    this.isInitialized = false;
  }
}

// Export singleton instance
export const audioEngine = new AudioEngine();
