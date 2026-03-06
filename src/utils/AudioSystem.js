import { Howl, Howler } from 'howler';

// Initialize sound effects with placeholders (user can replace these files in the public directory)
// We set volume very low initially per user request: "Keep volume very subtle."
const sfx = {
  hover: new Howl({ src: ['/sounds/hover.mp3'], volume: 0.1 }),
  warp: new Howl({ src: ['/sounds/warp.mp3'], volume: 0.2 }),
  type: new Howl({ src: ['/sounds/type.mp3'], volume: 0.05 }),
  pulse: new Howl({ src: ['/sounds/pulse.mp3'], volume: 0.2 })
};

// Mute by default until the user enables audio
Howler.mute(true);

class AudioSystem {
  constructor() {
    this.ctx = null;
    this.analyser = null;
    this.dataArray = null;
    this.oscillators = [];
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Unmute Howler SFX
    Howler.mute(false);
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 64;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

    const masterGain = this.ctx.createGain();
    masterGain.gain.value = 0.15; // Ambient drone volume
    masterGain.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = 55; // A1
    
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 27.5; // A0

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sawtooth';
    osc3.frequency.value = 55.5; 

    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.1;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 5;
    
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 1000;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    filter.connect(masterGain);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();
    
    this.oscillators = [osc1, osc2, osc3, lfo];
    this.initialized = true;
  }

  getFrequencyData() {
    if (!this.initialized) return 0;
    this.analyser.getByteFrequencyData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += this.dataArray[i];
    }
    return (sum / 10) / 255; 
  }

  getFullFrequencyData() {
    if (!this.initialized) return null;
    this.analyser.getByteFrequencyData(this.dataArray);
    return this.dataArray;
  }

  stop() {
    if (!this.initialized) return;
    Howler.mute(true);
    this.oscillators.forEach(osc => osc.stop());
    this.ctx.close();
    this.initialized = false;
  }

  // SFX Triggers
  playHover() {
    if (this.initialized) sfx.hover.play();
  }
  
  playWarp() {
    if (this.initialized) sfx.warp.play();
  }
  
  playType() {
    if (this.initialized) sfx.type.play();
  }
  
  playPulse() {
    if (this.initialized) sfx.pulse.play();
  }
}

export const audioSys = new AudioSystem();
