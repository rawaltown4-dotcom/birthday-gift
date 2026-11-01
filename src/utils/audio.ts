/**
 * Web Audio API procedural sound engine:
 * - Plays an enchanting "Happy Birthday" music-box / chime melody with warm chords
 * - Synthesizes sound effects: candle blow, magic sparkle, gift unwrap, pop, fanfare
 * - Zero external mp3/audio file dependencies - 100% reliable across browsers
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isPlayingMusic = false;
  private musicTimer: number | null = null;
  private isMuted = false;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.musicGain = this.ctx.createGain();
      this.sfxGain = this.ctx.createGain();

      this.musicGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.sfxGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

      this.musicGain.connect(this.ctx.destination);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(muted ? 0 : 0.25, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted() {
    return this.isMuted;
  }

  public isMusicPlaying() {
    return this.isPlayingMusic && !this.isMuted;
  }

  // Play a chime note with bell harmonics (music-box timbre)
  private playMusicBoxNote(freq: number, time: number, duration = 0.5) {
    if (!this.ctx || !this.musicGain || this.isMuted) return;

    // Fundamental note
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Harmonic overtone
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2, time);

    const now = time;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.exponentialRampToValueAtTime(0.08, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

    osc.connect(gain);
    osc2.connect(gain2);
    gain.connect(this.musicGain);
    gain2.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration);
    osc2.start(now);
    osc2.stop(now + duration);
  }

  // Happy Birthday Melody in C / F
  // Notes: G4 G4 A4 G4 C5 B4 | G4 G4 A4 G4 D5 C5 | G4 G4 G5 E5 C5 B4 A4 | F5 F5 E5 C5 D5 C5
  public startBirthdayMelody() {
    this.init();
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    const notes: [number, number][] = [
      // freq, duration in beats (1 beat = 0.48s)
      [392.0, 0.75], // G4
      [392.0, 0.25], // G4
      [440.0, 1.0],  // A4
      [392.0, 1.0],  // G4
      [523.25, 1.0], // C5
      [493.88, 2.0], // B4

      [392.0, 0.75], // G4
      [392.0, 0.25], // G4
      [440.0, 1.0],  // A4
      [392.0, 1.0],  // G4
      [587.33, 1.0], // D5
      [523.25, 2.0], // C5

      [392.0, 0.75], // G4
      [392.0, 0.25], // G4
      [783.99, 1.0], // G5
      [659.25, 1.0], // E5
      [523.25, 1.0], // C5
      [493.88, 1.0], // B4
      [440.0, 2.0],  // A4

      [698.46, 0.75], // F5
      [698.46, 0.25], // F5
      [659.25, 1.0],  // E5
      [523.25, 1.0],  // C5
      [587.33, 1.0],  // D5
      [523.25, 2.5],  // C5
    ];

    const playLoop = () => {
      if (!this.isPlayingMusic || !this.ctx) return;
      const beatSec = 0.46;
      let curTime = this.ctx.currentTime + 0.1;

      for (const [freq, durBeats] of notes) {
        this.playMusicBoxNote(freq, curTime, durBeats * beatSec * 1.3);
        curTime += durBeats * beatSec;
      }

      const totalDuration = (curTime - this.ctx.currentTime) * 1000;
      this.musicTimer = window.setTimeout(() => {
        if (this.isPlayingMusic) {
          playLoop();
        }
      }, totalDuration + 2500); // 2.5s gentle rest between loops
    };

    playLoop();
  }

  public stopBirthdayMelody() {
    this.isPlayingMusic = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public toggleBirthdayMelody() {
    if (this.isPlayingMusic) {
      this.stopBirthdayMelody();
    } else {
      this.startBirthdayMelody();
    }
  }

  // SFX: Candle blow whoosh + smoke sparkle
  public playCandleBlow() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    // Breath whoosh using white noise buffer
    const bufferSize = this.ctx.sampleRate * 0.8;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, this.ctx.currentTime + 0.7);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, this.ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.75);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 0.8);

    // After blow, gentle twinkling chime
    setTimeout(() => {
      this.playSparkleChime();
    }, 450);
  }

  // SFX: Sparkle chime
  public playSparkleChime() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const chimeFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    chimeFreqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.08);

      const t = this.ctx!.currentTime + idx * 0.08;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  // SFX: Gift opening magic swoosh
  public playGiftOpen() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const freqs = [329.63, 440.0, 554.37, 659.25, 880.0, 1108.7];
    freqs.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.06);

      const t = this.ctx!.currentTime + idx * 0.06;
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.2, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain!);
      osc.start(t);
      osc.stop(t + 0.9);
    });
  }

  // SFX: Party Popper pop sound
  public playPop() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.16);
  }

  // SFX: Quiz / milestone celebration fanfare
  public playFanfare() {
    this.init();
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    const chords = [
      { freqs: [523.25, 659.25], start: 0, dur: 0.15 },
      { freqs: [587.33, 698.46], start: 0.18, dur: 0.15 },
      { freqs: [659.25, 783.99], start: 0.36, dur: 0.18 },
      { freqs: [783.99, 1046.5], start: 0.58, dur: 0.8 },
    ];

    chords.forEach(({ freqs, start, dur }) => {
      freqs.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        const t = this.ctx!.currentTime + start;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(gain);
        gain.connect(this.sfxGain!);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    });
  }
}

export const soundEngine = new SoundEngine();
