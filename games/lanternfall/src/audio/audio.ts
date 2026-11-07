// All audio is synthesized: pre-rendered sound effects and an adaptive, generative score.
import { DEATH_SOUNDS, renderBeam, SFX, type SfxDef, type SfxName, type SfxPriority } from './sfx-recipes';
import { renderLoop, renderTake } from './synth-kit';

export { DEATH_SOUNDS, type SfxName };

const DEFS = SFX as Record<SfxName, SfxDef>;

/** Where a sound sits in the mix: left to right from -1 to 1, and how loud it is from here. */
export interface SoundPos {
  pan: number;
  gain: number;
}

interface DuckState {
  level: number;
  until: number;
}

/** How many voices may be playing before each priority stops being allowed to add another. */
const VOICE_LIMIT: Record<SfxPriority, number> = { 0: 30, 1: 46, 2: Infinity };

/** The shortest move between two pitch classes, in semitones. */
const wrapSemitones = (n: number) => ((((n + 6) % 12) + 12) % 12) - 6;

const SCALES: Record<string, number[]> = {
  lydian: [0, 2, 4, 6, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  harmonic: [0, 2, 3, 5, 7, 8, 11],
};

const PROGRESSIONS = [
  [0, 5, 3, 4],
  [0, 3, 5, 4],
  [0, 2, 3, 4],
  [5, 3, 0, 4],
  [0, 4, 5, 3],
];

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);

// Loudness is roughly logarithmic, so a squared curve makes the sliders feel even across their range.
// The scales keep the default slider positions (music 0.55, sfx 0.75) at their intended mix.
const musicGain = (slider: number) => slider * slider;
const sfxGain = (slider: number) => (slider * slider) / 0.75;

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private musicReverbSend!: GainNode;
  private sfxReverbSend!: GainNode;
  private combatBus!: GainNode;
  private musicDuck!: GainNode;
  private musicDuckState: DuckState = { level: 1, until: 0 };
  private combatDuckState: DuckState = { level: 1, until: 0 };
  private noiseBuf!: AudioBuffer;
  private baking: Promise<void> | null = null;
  private bakeMs = 0;
  private bank = new Map<SfxName, AudioBuffer[]>();
  private lastPlayed = new Map<SfxName, number>();
  private lastTake = new Map<SfxName, number>();
  private crowd = new Map<SfxName, { count: number; at: number }>();
  private active = 0;
  private beamBuffer: AudioBuffer | null = null;
  private beamSrc: AudioBufferSourceNode | null = null;
  private beamGain: GainNode | null = null;
  private beamPan: StereoPannerNode | null = null;
  private beamHeard = 0;

  musicVolume = 0.55;
  sfxVolume = 0.75;

  private root = 62;
  private scale = SCALES.lydian;
  private bpm = 84;
  private prog = PROGRESSIONS[0];
  private intensity = 0;
  private tensionGain!: GainNode;
  private calmGain!: GainNode;
  private nextStep = 0;
  private step = 0;
  private bar = 0;
  private melodyDeg = 7;
  private restUntil = 0;
  private timer: number | null = null;
  private musicOn = false;

  /** Must be called from a user gesture. */
  unlock() {
    void this.prepare();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') void this.ctx.resume();
      return;
    }
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    } catch {
      this.ctx = null;
      return;
    }
    const ctx = this.ctx;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -16;
    comp.ratio.value = 5;
    comp.attack.value = 0.004;
    comp.release.value = 0.18;
    this.master = ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(comp).connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.musicBus.gain.value = musicGain(this.musicVolume);
    this.sfxBus.gain.value = sfxGain(this.sfxVolume);
    this.musicDuck = ctx.createGain();
    this.combatBus = ctx.createGain();
    this.musicBus.connect(this.musicDuck).connect(this.master);
    this.sfxBus.connect(this.master);
    this.combatBus.connect(this.sfxBus);
    this.calmGain = ctx.createGain();
    this.tensionGain = ctx.createGain();
    this.calmGain.gain.value = 1;
    this.tensionGain.gain.value = 0;
    this.calmGain.connect(this.musicBus);
    this.tensionGain.connect(this.musicBus);

    const len = ctx.sampleRate * 2;
    this.noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
    const nd = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) nd[i] = Math.random() * 2 - 1;

    // A generated hall impulse response for reverb.
    const irLen = Math.floor(ctx.sampleRate * 2.6);
    const ir = ctx.createBuffer(2, irLen, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < irLen; i++) {
        const t = i / irLen;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.8) * (i < 400 ? i / 400 : 1);
      }
    }
    // Each bus has its own reverb, so a slider also controls that bus's echoes and tail.
    const makeSend = (level: number, bus: GainNode) => {
      const send = ctx.createGain();
      send.gain.value = level;
      const reverb = ctx.createConvolver();
      reverb.buffer = ir;
      send.connect(reverb).connect(bus);
      return send;
    };
    this.musicReverbSend = makeSend(1, this.musicBus);
    this.sfxReverbSend = makeSend(0.4, this.sfxBus);
    this.nextStep = ctx.currentTime + 0.1;
    this.timer = window.setInterval(() => this.schedule(), 80);
  }

  setVolumes(music: number, sfx: number) {
    this.musicVolume = music;
    this.sfxVolume = sfx;
    if (!this.ctx) return;
    this.musicBus.gain.setTargetAtTime(musicGain(music), this.ctx.currentTime, 0.05);
    this.sfxBus.gain.setTargetAtTime(sfxGain(sfx), this.ctx.currentTime, 0.05);
  }

  /** Mutes everything while the tab is hidden. */
  suspend(hidden: boolean) {
    if (!this.ctx) return;
    if (hidden) void this.ctx.suspend();
    else void this.ctx.resume();
  }

  setTheme(music: { root: number; scale: string; bpm: number }) {
    this.root = music.root;
    this.scale = SCALES[music.scale] ?? SCALES.dorian;
    this.bpm = music.bpm;
    this.prog = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
    this.musicOn = true;
  }

  stopMusic() {
    this.musicOn = false;
  }

  /** 0 calm, 1 battle, 2 desperate. Crossfades the musical layers. */
  setIntensity(v: number) {
    if (v === this.intensity) return;
    this.intensity = v;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.tensionGain.gain.setTargetAtTime(v === 0 ? 0 : v === 1 ? 0.85 : 1.15, t, 1.1);
    this.calmGain.gain.setTargetAtTime(v === 0 ? 1 : 0.65, t, 1.1);
  }

  private degree(deg: number, base: number) {
    const n = this.scale.length;
    const oct = Math.floor(deg / n);
    const d = ((deg % n) + n) % n;
    return base + this.scale[d] + oct * 12;
  }

  private schedule() {
    this.tendBeam();
    if (!this.ctx || !this.musicOn || this.ctx.state !== 'running') {
      if (this.ctx) this.nextStep = this.ctx.currentTime + 0.1;
      return;
    }
    const ctx = this.ctx;
    const stepDur = 60 / this.bpm / 4;
    if (this.nextStep < ctx.currentTime) this.nextStep = ctx.currentTime + 0.02;
    while (this.nextStep < ctx.currentTime + 0.25) {
      this.playStep(this.nextStep, stepDur);
      this.nextStep += stepDur;
      this.step = (this.step + 1) % 16;
      if (this.step === 0) {
        this.bar++;
        if (this.bar % 8 === 0) this.prog = PROGRESSIONS[Math.floor(Math.random() * PROGRESSIONS.length)];
      }
    }
  }

  private playStep(t: number, sd: number) {
    const s = this.step;
    const chordDeg = this.prog[Math.floor(this.bar / 2) % this.prog.length];
    const low = this.root - 12;

    // Warm string pad, retriggered every two bars.
    if (s === 0 && this.bar % 2 === 0) {
      const dur = sd * 32 + 1;
      for (const d of [0, 2, 4, 7]) this.pad(midi(this.degree(chordDeg + d, this.root - 12)), t, dur);
    }

    // Harp arpeggio.
    if (s % 2 === 0) {
      const pattern = [0, 2, 4, 7, 9, 7, 4, 2];
      const deg = chordDeg + pattern[(s / 2) % pattern.length];
      const skip = this.intensity === 0 && Math.random() < 0.18;
      if (!skip) this.pluck(midi(this.degree(deg, this.root)), t, 0.16, this.calmGain);
    }

    // A wandering flute line with phrasing rests.
    if (s % 4 === 0 || (s % 2 === 0 && Math.random() < 0.3)) {
      if (t >= this.restUntil) {
        if (Math.random() < 0.14) {
          this.restUntil = t + sd * (8 + Math.floor(Math.random() * 12));
        } else {
          const stepBy = [-2, -1, -1, 1, 1, 2, 3, -3][Math.floor(Math.random() * 8)];
          this.melodyDeg = Math.max(2, Math.min(13, this.melodyDeg + stepBy));
          // On strong beats, lean toward chord tones so the line stays consonant.
          let deg = this.melodyDeg;
          if (s === 0 || s === 8) {
            const tones = [chordDeg, chordDeg + 2, chordDeg + 4, chordDeg + 7, chordDeg + 9];
            deg = tones.reduce((a, b) => (Math.abs(b - deg) < Math.abs(a - deg) ? b : a));
            this.melodyDeg = deg;
          }
          this.flute(midi(this.degree(deg, this.root + 12)), t, sd * (s % 4 === 0 ? 3.6 : 1.8));
        }
      }
    }

    // Battle layer: bass, drums, and low brass.
    if (this.intensity > 0) {
      if (s === 0 || s === 6 || s === 10) this.bass(midi(this.degree(chordDeg, low - 12)), t, sd * 3);
      if (s === 0 || s === 8) this.taiko(t, 0.5);
      if (s === 6 || s === 14 || (this.intensity > 1 && s % 4 === 2)) this.taiko(t, 0.26);
      if (s % 2 === 1) this.shaker(t, 0.05 + (s % 4 === 3 ? 0.03 : 0));
      if (s === 0 && this.bar % 2 === 1) {
        for (const d of [0, 4, 7]) this.brass(midi(this.degree(chordDeg + d, low)), t, sd * 7);
      }
      if (this.intensity > 1 && s % 2 === 0) {
        this.pluck(midi(this.degree(chordDeg + (s % 4 === 0 ? 0 : 4), this.root - 12)), t, 0.2, this.tensionGain, 'sawtooth');
      }
    }
  }

  private pad(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(420, t);
    filt.frequency.linearRampToValueAtTime(900, t + dur * 0.5);
    filt.frequency.linearRampToValueAtTime(380, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.055, t + 1.4);
    g.gain.setValueAtTime(0.055, t + dur - 1.2);
    g.gain.linearRampToValueAtTime(0, t + dur);
    for (const det of [-7, 6]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.detune.value = det;
      o.connect(filt);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    filt.connect(g);
    g.connect(this.calmGain);
    g.connect(this.musicReverbSend);
  }

  private pluck(f: number, t: number, vol: number, bus: GainNode, type: OscillatorType = 'triangle') {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0008, t + 0.95);
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(Math.min(6000, f * 7), t);
    filt.frequency.exponentialRampToValueAtTime(Math.max(300, f * 1.2), t + 0.6);
    o.connect(filt).connect(g);
    g.connect(bus);
    g.connect(this.musicReverbSend);
    o.start(t);
    o.stop(t + 1);
  }

  private flute(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = f;
    const o2 = ctx.createOscillator();
    o2.type = 'triangle';
    o2.frequency.value = f * 2.001;
    const o2g = ctx.createGain();
    o2g.gain.value = 0.16;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.1;
    const vibG = ctx.createGain();
    vibG.gain.setValueAtTime(0, t);
    vibG.gain.linearRampToValueAtTime(f * 0.009, t + dur * 0.5);
    vib.connect(vibG);
    vibG.connect(o.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.085, t + 0.07);
    g.gain.setValueAtTime(0.078, t + Math.max(0.08, dur - 0.1));
    g.gain.linearRampToValueAtTime(0, t + dur + 0.12);
    o.connect(g);
    o2.connect(o2g).connect(g);
    g.connect(this.calmGain);
    const send = ctx.createGain();
    send.gain.value = 2.2;
    g.connect(send).connect(this.musicReverbSend);
    const end = t + dur + 0.2;
    o.start(t); o2.start(t); vib.start(t);
    o.stop(end); o2.stop(end); vib.stop(end);
  }

  private bass(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.3, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.002, t + dur + 0.2);
    o.connect(g).connect(this.tensionGain);
    o.start(t);
    o.stop(t + dur + 0.25);
  }

  private taiko(t: number, vol: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(52, t + 0.14);
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.002, t + 0.42);
    o.connect(g);
    g.connect(this.tensionGain);
    g.connect(this.musicReverbSend);
    o.start(t);
    o.stop(t + 0.45);
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(vol * 0.3, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    n.connect(f).connect(ng).connect(this.tensionGain);
    n.start(t, Math.random());
    n.stop(t + 0.08);
  }

  private shaker(t: number, vol: number) {
    const ctx = this.ctx!;
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 6500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    n.connect(f).connect(g).connect(this.tensionGain);
    n.start(t, Math.random());
    n.stop(t + 0.07);
  }

  private brass(f: number, t: number, dur: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = 'sawtooth';
    o.frequency.value = f;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass';
    filt.Q.value = 1;
    filt.frequency.setValueAtTime(250, t);
    filt.frequency.linearRampToValueAtTime(1300, t + 0.22);
    filt.frequency.linearRampToValueAtTime(420, t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.055, t + 0.12);
    g.gain.setValueAtTime(0.05, t + dur * 0.6);
    g.gain.linearRampToValueAtTime(0, t + dur + 0.1);
    o.connect(filt).connect(g);
    g.connect(this.tensionGain);
    g.connect(this.musicReverbSend);
    o.start(t);
    o.stop(t + dur + 0.15);
  }

  // ---------- Sound effects ----------

  /** Renders every sound ahead of time. This needs no user gesture, so it can start at page load. */
  prepare() {
    this.baking ??= this.bakeAll();
    return this.baking;
  }

  private async bakeAll() {
    if (typeof OfflineAudioContext === 'undefined') return;
    const start = performance.now();
    let seed = 1;
    for (const name of Object.keys(DEFS) as SfxName[]) {
      const def = DEFS[name];
      const takes: AudioBuffer[] = [];
      for (let i = 0; i < (def.variants ?? 1); i++) {
        takes.push(await renderTake(seed++ * 7919, def.level, def.drive, def.render));
      }
      this.bank.set(name, takes);
    }
    this.beamBuffer = await renderLoop(4242, 0.075, 2.4, 0.5, renderBeam);
    this.bakeMs = performance.now() - start;
  }

  /** Plays a sound. Pass `pos` for anything that happens at a place in the world. */
  play(name: SfxName, volume = 1, pos?: SoundPos) {
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const takes = this.bank.get(name);
    if (!takes) return;
    const def = DEFS[name];
    const now = ctx.currentTime;
    const priority = def.priority ?? 1;
    const last = this.lastPlayed.get(name);
    if (last !== undefined && now - last < (def.gap ?? 0.02)) return;
    if (this.active >= VOICE_LIMIT[priority]) return;
    this.lastPlayed.set(name, now);

    // Rotate through the takes, never repeating the one just heard.
    let take = 0;
    if (takes.length > 1) {
      take = Math.floor(Math.random() * (takes.length - 1));
      if (take >= (this.lastTake.get(name) ?? takes.length)) take++;
      this.lastTake.set(name, take);
    }

    // A crowd of one sound shouldn't add up to a wall of it, so each repeat in a burst comes in softer.
    // A sound asked for before the camera has settled can land on a non-finite position.
    let gain = volume * (Number.isFinite(pos?.gain) ? pos!.gain : 1);
    if (priority < 2) {
      const prev = this.crowd.get(name);
      const count = prev ? prev.count * Math.exp((prev.at - now) / 0.28) : 0;
      this.crowd.set(name, { count: count + 1, at: now });
      gain /= 1 + count * 0.16;
    }

    const src = ctx.createBufferSource();
    const buffer = takes[take];
    src.buffer = buffer;
    let rate = 1 + (def.jitter ?? 0) * (Math.random() * 2 - 1);
    if (def.musical !== undefined) rate *= Math.pow(2, wrapSemitones(this.root - def.musical) / 12);
    src.playbackRate.value = rate;

    const dry = ctx.createGain();
    dry.gain.value = gain;
    const bus = priority === 2 ? this.sfxBus : this.combatBus;
    const pan = Number.isFinite(pos?.pan) ? pos!.pan : 0;
    let panner: StereoPannerNode | null = null;
    if (Math.abs(pan) > 0.02) {
      panner = ctx.createStereoPanner();
      panner.pan.value = pan;
      dry.connect(panner).connect(bus);
    } else {
      dry.connect(bus);
    }

    let send: GainNode | null = null;
    let splitter: ChannelSplitterNode | null = null;
    if (buffer.numberOfChannels > 1) {
      splitter = ctx.createChannelSplitter(2);
      send = ctx.createGain();
      send.gain.value = gain;
      src.connect(splitter);
      splitter.connect(dry, 0);
      splitter.connect(send, 1).connect(this.sfxReverbSend);
    } else {
      src.connect(dry);
    }

    this.active++;
    src.onended = () => {
      this.active--;
      src.disconnect();
      splitter?.disconnect();
      send?.disconnect();
      dry.disconnect();
      panner?.disconnect();
    };
    src.start();
    if (def.duck) this.duck(def.duck);
  }

  /** Pulls the score and the battle down around a big moment. A weaker duck never cuts a stronger one short. */
  private duck(d: { music?: number; combat?: number; hold?: number }) {
    const now = this.ctx!.currentTime;
    const hold = d.hold ?? 0.3;
    const apply = (state: DuckState, param: AudioParam, level?: number) => {
      if (level === undefined) return;
      if (now < state.until && level > state.level) return;
      state.level = level;
      state.until = now + hold;
      param.cancelScheduledValues(now);
      param.setTargetAtTime(level, now, 0.02);
      param.setTargetAtTime(1, now + hold, 0.38);
    };
    apply(this.musicDuckState, this.musicDuck.gain, d.music);
    apply(this.combatDuckState, this.combatBus.gain, d.combat);
  }

  /**
   * Holds the Sunforge's fire loop open. Call this every frame with the number of burning beams
   * (0 for none), where they are on screen, and how hot they've grown (0 to 1).
   */
  setBeam(count: number, pan: number, heat: number) {
    const ctx = this.ctx;
    if (!ctx || !this.beamBuffer || ctx.state !== 'running') return;
    const now = ctx.currentTime;
    this.beamHeard = now;
    if (!this.beamSrc) {
      if (count === 0) return;
      this.beamGain = ctx.createGain();
      this.beamGain.gain.value = 0;
      this.beamPan = ctx.createStereoPanner();
      this.beamSrc = ctx.createBufferSource();
      this.beamSrc.buffer = this.beamBuffer;
      this.beamSrc.loop = true;
      this.beamSrc.connect(this.beamGain).connect(this.beamPan).connect(this.combatBus);
      this.beamSrc.start();
    }
    const target = count === 0 ? 0 : Math.min(1.5, 0.55 + count * 0.3) * (0.75 + heat * 0.5);
    this.beamGain!.gain.setTargetAtTime(target, now, 0.07);
    this.beamPan!.pan.setTargetAtTime(pan, now, 0.1);
    this.beamSrc.playbackRate.setTargetAtTime(0.94 + heat * 0.2, now, 0.15);
  }

  /** The game can stop calling setBeam without warning, such as on pause or quitting a battle. */
  private tendBeam() {
    if (!this.ctx || !this.beamSrc) return;
    const quiet = this.ctx.currentTime - this.beamHeard;
    if (quiet < 0.25) return;
    this.beamGain!.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
    if (quiet > 1) {
      this.beamSrc.stop();
      this.beamSrc.disconnect();
      this.beamGain!.disconnect();
      this.beamPan!.disconnect();
      this.beamSrc = null;
    }
  }

  fanfare(victory: boolean) {
    this.play(victory ? 'fanfareWin' : 'fanfareLose');
    this.setIntensity(0);
  }

  /** Numbers for the sound test page. */
  stats() {
    let bytes = 0;
    for (const takes of this.bank.values()) for (const b of takes) bytes += b.length * b.numberOfChannels * 4;
    if (this.beamBuffer) bytes += this.beamBuffer.length * 4;
    return { voices: this.active, sounds: this.bank.size, megabytes: bytes / 1048576, bakeMs: this.bakeMs };
  }

  /** The rendered takes of one sound, for the sound test page. */
  takesOf(name: SfxName) {
    return this.bank.get(name) ?? [];
  }
}

export const audio = new AudioEngine();
