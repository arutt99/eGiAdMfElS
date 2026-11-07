// The sound design for every effect. `level` is the peak each sound is normalized to, so layer
// volumes inside a recipe only set the balance between layers, and `level` sets the game mix.
import { Kit } from './synth-kit';

/** 0 is battle chatter, dropped first when things get crowded. 2 always plays. */
export type SfxPriority = 0 | 1 | 2;

export interface SfxDef {
  level: number;
  render: (k: Kit) => void;
  /** Number of pre-rendered takes to rotate through. */
  variants?: number;
  priority?: SfxPriority;
  /** Shortest time between two plays of this sound. */
  gap?: number;
  /** Random pitch range for each play, on top of the variants. */
  jitter?: number;
  /** Soft saturation, for weight and density. */
  drive?: number;
  /** Musical stingers move to the key of the map's score. This is the MIDI note of the stinger's own tonic. */
  musical?: number;
  /** Pulls the music and battle sounds down while this plays. */
  duck?: { music?: number; combat?: number; hold?: number };
  /** Layout group on the sound test page. */
  group: string;
}

const METAL = [1, 1.41, 2.13, 2.92, 3.74, 4.58];
const STEEL = [1, 1.48, 2.37, 3.21];
const WOOD = [1, 2.31, 3.67];
const STONE = [1, 2.09, 3.28];
const GLASS = [1, 1.52, 2.31, 3.1];
const BELL = [0.5, 1, 1.19, 1.5, 2, 2.67, 4.02];

/** An arpeggio of soft chimes, used by rewards and upgrades. */
function chimes(k: Kit, notes: number[], step: number, len: number, rev: number) {
  notes.forEach((f, i) => {
    const at = i * step;
    k.tone(f, len, 0.5, { type: 'triangle', at, rev });
    k.tone(f * 2, len * 0.5, 0.14, { at, rev });
    k.tone(f * 3.01, len * 0.25, 0.06, { at, rev });
  });
}

/** A swelling brass chord with a little drift between the voices. */
function brass(k: Kit, notes: number[], dur: number, vol: number, o: { at?: number; rev?: number; lp?: number; attack?: number } = {}) {
  for (const f of notes) {
    for (const det of [-6, 5]) {
      k.tone(f, dur, vol, { type: 'sawtooth', detune: det, at: o.at, attack: o.attack ?? 0.1, hold: 0.45, lp: 420, lpTo: o.lp ?? 1300, rev: o.rev, vib: 5, vibRate: 4.6 });
    }
  }
}

/** The shared core of every explosion: a snap, a body of fire, a sub drop, then falling debris. */
function blast(k: Kit, size: number, rev: number, at = 0) {
  k.noise(0.03, 0.4, { type: 'highpass', freq: 1800, at, rev: rev * 0.5 });
  k.noise(0.36 * size, 0.6, { color: 'pink', freq: k.r(1900, 2600), to: 90, at, rev });
  k.noise(0.5 * size, 0.42, { color: 'brown', freq: 420, to: 60, at, attack: 0.008 });
  k.tone(k.r(92, 118), 0.34 * size, 0.62, { to: 28, at });
  k.crackle(Math.round(5 * size), at + 0.05, at + 0.34 * size, 0.2, { rev: rev * 0.6 });
}

export const SFX = {
  // ---------- Interface: rendered first, so the first click always has a sound ----------
  click: { group: 'Interface', level: 0.06, priority: 2, variants: 2, jitter: 0.02, render: (k) => {
    k.strike(k.r(820, 960), WOOD, 0.035, 0.6);
    k.noise(0.012, 0.3, { type: 'bandpass', freq: 3000, q: 1 });
  } },
  hover: { group: 'Interface', level: 0.014, priority: 2, gap: 0.03, jitter: 0.02, render: (k) => {
    k.tone(1250, 0.025, 0.6);
    k.tone(2510, 0.012, 0.14);
  } },
  error: { group: 'Interface', level: 0.1, priority: 2, gap: 0.1, render: (k) => {
    k.tone(190, 0.1, 0.5, { type: 'square', lp: 620 });
    k.tone(142, 0.16, 0.5, { type: 'square', lp: 620, at: 0.085 });
    k.noise(0.03, 0.2, { freq: 900 });
  } },
  order: { group: 'Interface', level: 0.05, priority: 2, jitter: 0.03, render: (k) => {
    k.tone(860, 0.05, 0.5, { type: 'triangle', to: 1180 });
    k.tone(1320, 0.05, 0.25, { type: 'triangle', at: 0.03, rev: 0.4 });
  } },
  coin: { group: 'Interface', level: 0.042, priority: 0, gap: 0.05, variants: 4, jitter: 0.04, render: (k) => {
    k.strike(k.r(2150, 2500), [1, 1.34, 2.14], 0.12, 0.6);
    k.strike(k.r(2800, 3200), [1, 1.34], 0.1, 0.32, { at: 0.038 });
  } },
  star: { group: 'Interface', level: 0.16, priority: 2, musical: 60, render: (k) => {
    chimes(k, [1046, 1318, 1568], 0.05, 0.55, 1.3);
    k.shards(8, 3000, 6000, 0.3, 0.05, { rev: 1.2, len: 0.14 });
  } },
  unlock: { group: 'Interface', level: 0.16, priority: 2, musical: 60, duck: { music: 0.7, hold: 0.5 }, render: (k) => {
    chimes(k, [523, 784, 1046, 1568], 0.1, 0.65, 1.3);
    k.shards(10, 2600, 6200, 0.55, 0.05, { at: 0.2, rev: 1.3, len: 0.16 });
  } },

  // ---------- Tower shots ----------
  arrow: { group: 'Tower shots', level: 0.13, priority: 0, gap: 0.05, variants: 5, jitter: 0.05, render: (k) => {
    k.tone(k.r(165, 205), 0.05, 0.55, { type: 'triangle', to: 88 });
    k.tone(k.r(420, 540), 0.06, 0.28, { type: 'triangle', to: 300 });
    k.noise(0.11, 0.42, { color: 'pink', type: 'bandpass', freq: k.r(2200, 3300), to: 850, q: 1.5, at: 0.008, attack: 0.012 });
  } },
  arcane: { group: 'Tower shots', level: 0.1, priority: 0, gap: 0.07, variants: 4, jitter: 0.05, render: (k) => {
    const f = k.r(660, 820);
    k.fm(f, 2.01, 2.6, 0.2, 0.55, { to: f * 1.9, rev: 0.6 });
    k.tone(f * 1.5, 0.15, 0.16, { type: 'triangle', to: f * 2.9, rev: 0.6 });
    k.noise(0.14, 0.12, { type: 'bandpass', freq: 3400, to: 6000, q: 2, attack: 0.02, rev: 0.4 });
  } },
  frost: { group: 'Tower shots', level: 0.085, priority: 0, gap: 0.08, variants: 4, jitter: 0.05, render: (k) => {
    k.strike(k.r(2000, 2600), GLASS, 0.2, 0.42, { rev: 0.7 });
    k.noise(0.13, 0.32, { type: 'highpass', freq: 5000, to: 8000, attack: 0.008, rev: 0.7 });
    k.tone(420, 0.06, 0.2, { type: 'triangle', to: 210 });
  } },
  mortar: { group: 'Tower shots', level: 0.3, priority: 1, gap: 0.09, variants: 3, jitter: 0.04, drive: 1.6, render: (k) => {
    k.tone(k.r(150, 180), 0.2, 0.7, { to: 42 });
    k.tone(k.r(290, 330), 0.07, 0.24, { type: 'triangle', to: 170 });
    k.noise(0.15, 0.42, { color: 'brown', freq: 1500, to: 190 });
    k.noise(0.25, 0.1, { color: 'pink', type: 'bandpass', freq: 700, to: 2200, at: 0.05, attack: 0.06 });
  } },
  ballista: { group: 'Tower shots', level: 0.2, priority: 0, gap: 0.09, variants: 3, jitter: 0.04, drive: 1.3, render: (k) => {
    k.strike(k.r(280, 350), WOOD, 0.07, 0.42);
    k.tone(k.r(100, 118), 0.12, 0.45, { type: 'sawtooth', to: 58, lp: 950 });
    k.tone(62, 0.1, 0.4, { to: 42 });
    k.noise(0.17, 0.4, { color: 'pink', type: 'bandpass', freq: 1900, to: 520, q: 1.3, at: 0.018, attack: 0.02 });
  } },
  blight: { group: 'Tower shots', level: 0.1, priority: 0, gap: 0.09, variants: 4, jitter: 0.06, render: (k) => {
    k.tone(k.r(200, 260), 0.09, 0.55, { to: k.r(480, 620) });
    k.tone(k.r(130, 170), 0.12, 0.3, { type: 'triangle', to: 80, at: 0.03 });
    k.noise(0.1, 0.2, { color: 'pink', freq: 1400, to: 360, q: 3 });
  } },
  lightning: { group: 'Tower shots', level: 0.24, priority: 1, gap: 0.1, variants: 4, jitter: 0.04, render: (k) => {
    k.noise(0.04, 0.6, { type: 'highpass', freq: 2500, rev: 0.5 });
    k.noise(0.18, 0.36, { type: 'bandpass', freq: k.r(3000, 4000), to: 850, q: 1, rev: 0.7 });
    k.tone(k.r(85, 105), 0.12, 0.32, { type: 'sawtooth', to: 46, lp: 1800 });
    k.tone(60, 0.16, 0.3, { to: 34 });
    for (let i = 0; i < 5; i++) k.noise(0.012, 0.5, { type: 'highpass', freq: 3200, at: k.r(0.03, 0.14) });
  } },
  bell: { group: 'Tower shots', level: 0.27, priority: 1, gap: 0.2, variants: 3, jitter: 0.03, render: (k) => {
    const f = k.r(292, 318);
    k.strike(f, BELL, 1.5, 0.55, { rev: 0.9, rolloff: 0.74 });
    k.tone(88, 0.3, 0.55, { to: 48 });
    k.noise(0.1, 0.3, { color: 'brown', freq: 900, to: 180 });
    k.noise(0.008, 0.25, { type: 'highpass', freq: 2500 });
  } },

  // ---------- Hits ----------
  arrowHit: { group: 'Hits', level: 0.062, priority: 0, gap: 0.05, variants: 4, jitter: 0.07, render: (k) => {
    k.noise(0.03, 0.5, { color: 'pink', type: 'bandpass', freq: k.r(1100, 1800), q: 1.8 });
    k.tone(k.r(220, 300), 0.04, 0.5, { type: 'triangle', to: 105 });
  } },
  orbHit: { group: 'Hits', level: 0.058, priority: 0, gap: 0.07, variants: 3, jitter: 0.06, render: (k) => {
    const f = k.r(1050, 1350);
    k.fm(f, 1.5, 2, 0.12, 0.5, { to: f * 0.5, rev: 0.7 });
    k.noise(0.05, 0.24, { type: 'highpass', freq: 4000, rev: 0.6 });
  } },
  shardHit: { group: 'Hits', level: 0.09, priority: 0, gap: 0.08, variants: 4, render: (k) => {
    k.shards(7, 2600, 6400, 0.07, 0.3, { rev: 0.7 });
    k.noise(0.1, 0.36, { type: 'highpass', freq: 3600, rev: 0.6 });
  } },
  boltHit: { group: 'Hits', level: 0.11, priority: 0, gap: 0.07, variants: 3, jitter: 0.06, render: (k) => {
    k.tone(k.r(165, 195), 0.08, 0.6, { to: 68 });
    k.strike(k.r(560, 720), STEEL, 0.09, 0.3);
    k.noise(0.04, 0.3, { color: 'pink', type: 'bandpass', freq: 1100, q: 1 });
  } },
  globHit: { group: 'Hits', level: 0.09, priority: 0, gap: 0.08, variants: 4, render: (k) => {
    k.noise(0.13, 0.5, { color: 'brown', freq: 1900, to: 300, q: 2 });
    for (let i = 0; i < 3; i++) {
      k.tone(k.r(190, 380), 0.05, 0.3, { to: k.r(520, 920), at: k.r(0.01, 0.12) });
    }
  } },
  crit: { group: 'Hits', level: 0.07, priority: 0, gap: 0.09, variants: 3, jitter: 0.04, render: (k) => {
    k.strike(k.r(2400, 2800), [1, 2.02, 3.11], 0.15, 0.55, { rev: 0.7 });
    k.noise(0.012, 0.3, { type: 'highpass', freq: 5000 });
  } },
  explosion: { group: 'Hits', level: 0.36, priority: 1, gap: 0.08, variants: 4, jitter: 0.05, drive: 1.9, render: (k) => {
    blast(k, 1, 0.45);
  } },
  bigExplosion: { group: 'Hits', level: 0.52, priority: 2, gap: 0.1, variants: 3, jitter: 0.03, drive: 2.2, duck: { music: 0.6, combat: 0.62, hold: 0.35 }, render: (k) => {
    blast(k, 2.3, 0.8);
    blast(k, 1.1, 0.5, 0.07);
    k.noise(1.3, 0.3, { color: 'brown', freq: 280, to: 50, attack: 0.05 });
  } },

  // ---------- Creature deaths ----------
  deathCritter: { group: 'Creature deaths', level: 0.085, priority: 0, gap: 0.05, variants: 5, jitter: 0.1, render: (k) => {
    k.voice(k.r(620, 860), k.r(210, 300), 0.11, 0.6, [k.r(850, 1100), 2300]);
    k.noise(0.06, 0.26, { color: 'pink', type: 'bandpass', freq: 700, to: 240, q: 1, at: 0.015 });
  } },
  deathBeast: { group: 'Creature deaths', level: 0.13, priority: 0, gap: 0.08, variants: 3, jitter: 0.07, render: (k) => {
    k.voice(k.r(210, 260), 82, 0.27, 0.6, [520, 1120], { vib: 90, vibRate: 26 });
    k.tone(118, 0.13, 0.5, { to: 52, at: 0.07 });
    k.noise(0.08, 0.2, { color: 'brown', freq: 800, at: 0.07 });
  } },
  deathMoth: { group: 'Creature deaths', level: 0.08, priority: 0, gap: 0.07, variants: 3, jitter: 0.08, render: (k) => {
    for (let i = 0; i < 6; i++) k.noise(0.022, 0.5 * (1 - i * 0.13), { color: 'pink', type: 'bandpass', freq: 1900, q: 1, at: i * 0.028 });
    k.tone(k.r(1000, 1250), 0.13, 0.15, { to: 380 });
  } },
  deathMetal: { group: 'Creature deaths', level: 0.14, priority: 0, gap: 0.08, variants: 4, jitter: 0.05, render: (k) => {
    const f = k.r(410, 530);
    k.strike(f, METAL, 0.26, 0.5, { rev: 0.3 });
    k.strike(f * 1.31, METAL, 0.16, 0.28, { at: 0.075 });
    k.strike(f * 0.83, METAL, 0.2, 0.22, { at: 0.16 });
    k.noise(0.03, 0.26, { type: 'highpass', freq: 3000 });
    k.tone(110, 0.08, 0.3, { to: 62, at: 0.17 });
  } },
  deathGhost: { group: 'Creature deaths', level: 0.09, priority: 0, gap: 0.1, variants: 3, jitter: 0.07, render: (k) => {
    k.tone(k.r(780, 980), 0.46, 0.5, { to: 220, attack: 0.02, rev: 1.1, vib: 45, vibRate: 7 });
    k.tone(k.r(1180, 1400), 0.34, 0.14, { to: 340, attack: 0.03, rev: 1.1, vib: 45, vibRate: 7 });
    k.noise(0.4, 0.2, { color: 'pink', type: 'bandpass', freq: 1300, to: 380, q: 1.6, attack: 0.05, rev: 1 });
  } },
  deathShaman: { group: 'Creature deaths', level: 0.1, priority: 0, gap: 0.12, variants: 2, jitter: 0.06, render: (k) => {
    k.voice(k.r(310, 370), 115, 0.34, 0.62, [720, 1240], { vib: 60, vibRate: 9, rev: 0.4 });
    k.strike(1680, GLASS, 0.32, 0.17, { at: 0.04, rev: 0.9 });
  } },
  deathPop: { group: 'Creature deaths', level: 0.15, priority: 0, gap: 0.08, variants: 4, jitter: 0.08, drive: 1.3, render: (k) => {
    k.tone(k.r(420, 560), 0.06, 0.55, { to: 82 });
    k.noise(0.2, 0.5, { color: 'brown', freq: 2800, to: 250, q: 1.5 });
    for (let i = 0; i < 3; i++) k.tone(k.r(180, 360), 0.05, 0.22, { to: k.r(480, 900), at: k.r(0.04, 0.2) });
  } },
  deathStone: { group: 'Creature deaths', level: 0.17, priority: 0, gap: 0.1, variants: 3, jitter: 0.05, render: (k) => {
    k.noise(0.3, 0.5, { color: 'brown', freq: 1250, to: 170 });
    k.tone(88, 0.22, 0.5, { to: 38 });
    for (let i = 0; i < 6; i++) k.strike(k.r(240, 460), STONE, 0.06, 0.24, { at: k.r(0.02, 0.34) });
  } },
  deathGlass: { group: 'Creature deaths', level: 0.1, priority: 0, gap: 0.09, variants: 3, render: (k) => {
    k.shards(12, 2200, 7000, 0.14, 0.34, { rev: 0.9, len: 0.11 });
    k.noise(0.2, 0.3, { type: 'highpass', freq: 4800, rev: 0.8 });
    k.tone(k.r(190, 240), 0.05, 0.22, { type: 'triangle', to: 90 });
  } },
  deathEmber: { group: 'Creature deaths', level: 0.1, priority: 0, gap: 0.09, variants: 3, jitter: 0.06, render: (k) => {
    k.noise(0.42, 0.42, { type: 'highpass', freq: 2800, to: 6500, attack: 0.02 });
    k.tone(k.r(280, 340), 0.2, 0.42, { type: 'triangle', to: 68 });
    k.crackle(8, 0.02, 0.42, 0.5);
  } },

  // ---------- Bosses and enemies ----------
  bossRoar: { group: 'Bosses and enemies', level: 0.34, priority: 2, gap: 2, variants: 2, jitter: 0.03, drive: 1.7, duck: { music: 0.5, combat: 0.6, hold: 0.9 }, render: (k) => {
    k.voice(k.r(88, 98), 54, 1.5, 0.55, [320, 740, 1500], { attack: 0.14, vib: 110, vibRate: 23, hold: 0.32, rev: 1 });
    k.voice(k.r(136, 152), 82, 1.25, 0.3, [480, 1150], { attack: 0.2, vib: 80, vibRate: 31, hold: 0.25, rev: 1 });
    k.noise(1.4, 0.2, { color: 'pink', type: 'bandpass', freq: 900, to: 280, q: 1, attack: 0.2, rev: 0.8 });
    k.tone(52, 1.3, 0.3, { attack: 0.1, to: 36 });
  } },
  bossStep: { group: 'Bosses and enemies', level: 0.34, priority: 1, gap: 0.3, variants: 3, jitter: 0.05, drive: 1.5, render: (k) => {
    k.tone(k.r(68, 78), 0.3, 0.72, { to: 30 });
    k.noise(0.22, 0.42, { color: 'brown', freq: 650, to: 110 });
    k.crackle(4, 0.04, 0.26, 0.09, { freq: 1500 });
  } },
  bossDeath: { group: 'Bosses and enemies', level: 0.36, priority: 2, gap: 1, drive: 1.5, duck: { music: 0.35, combat: 0.5, hold: 1.6 }, render: (k) => {
    k.voice(112, 34, 1.9, 0.55, [300, 690, 1320], { attack: 0.05, vib: 140, vibRate: 16, hold: 0.2, rev: 1.2 });
    k.noise(1.9, 0.3, { color: 'brown', freq: 800, to: 80, attack: 0.1 });
    for (let i = 0; i < 12; i++) k.strike(k.r(190, 430), STONE, 0.08, 0.15, { at: k.r(0.15, 1.6), rev: 0.5 });
  } },
  enemyHit: { group: 'Bosses and enemies', level: 0.075, priority: 0, gap: 0.12, variants: 3, jitter: 0.08, render: (k) => {
    k.noise(0.07, 0.42, { color: 'pink', type: 'bandpass', freq: k.r(1300, 1700), to: 640, q: 1.3, attack: 0.008 });
    k.tone(k.r(130, 165), 0.06, 0.36, { to: 68, at: 0.015 });
  } },
  blink: { group: 'Bosses and enemies', level: 0.085, priority: 1, gap: 0.1, variants: 3, jitter: 0.06, render: (k) => {
    k.tone(k.r(1200, 1450), 0.17, 0.5, { to: 240, rev: 1 });
    k.noise(0.12, 0.2, { type: 'bandpass', freq: 3800, to: 900, q: 3, attack: 0.008, rev: 0.9 });
  } },
  heal: { group: 'Bosses and enemies', level: 0.055, priority: 1, gap: 0.25, variants: 2, jitter: 0.05, render: (k) => {
    k.tone(640, 0.24, 0.5, { to: 960, rev: 1 });
    k.tone(960, 0.2, 0.2, { to: 1440, at: 0.05, rev: 1 });
    k.shards(3, 2400, 3800, 0.2, 0.05, { rev: 1 });
  } },
  root: { group: 'Bosses and enemies', level: 0.11, priority: 1, gap: 0.14, variants: 3, jitter: 0.08, render: (k) => {
    k.noise(0.17, 0.5, { color: 'pink', type: 'bandpass', freq: 520, to: 170, q: 2 });
    for (let i = 0; i < 4; i++) k.strike(k.r(170, 290), WOOD, 0.045, 0.32, { at: 0.012 + i * k.r(0.022, 0.042) });
  } },
  freeze: { group: 'Bosses and enemies', level: 0.1, priority: 1, gap: 0.1, variants: 3, render: (k) => {
    k.shards(5, 1900, 4600, 0.05, 0.28, { rev: 0.8 });
    k.noise(0.16, 0.26, { type: 'highpass', freq: 4200, rev: 0.8 });
    k.tone(k.r(300, 370), 0.05, 0.3, { type: 'triangle', to: 150 });
  } },
  split: { group: 'Bosses and enemies', level: 0.13, priority: 1, gap: 0.1, variants: 2, jitter: 0.06, render: (k) => {
    k.noise(0.13, 0.5, { color: 'brown', freq: 1900, to: 280 });
    k.tone(360, 0.07, 0.45, { to: 95 });
    for (let i = 0; i < 5; i++) k.voice(k.r(540, 880), k.r(740, 1200), 0.05, 0.14, [1400], { at: 0.06 + i * k.r(0.03, 0.05) });
  } },

  // ---------- Heroes and soldiers ----------
  heroHit: { group: 'Heroes and soldiers', level: 0.14, priority: 1, gap: 0.14, variants: 5, jitter: 0.05, render: (k) => {
    k.noise(0.07, 0.42, { color: 'pink', type: 'bandpass', freq: k.r(2800, 3800), to: 1300, q: 1.2, attack: 0.012 });
    k.strike(k.r(1680, 2260), STEEL, 0.13, 0.3, { at: 0.018, rev: 0.2 });
    k.tone(k.r(180, 220), 0.05, 0.36, { to: 88, at: 0.018 });
  } },
  guardHit: { group: 'Heroes and soldiers', level: 0.075, priority: 0, gap: 0.12, variants: 4, jitter: 0.07, render: (k) => {
    k.noise(0.04, 0.34, { color: 'pink', type: 'bandpass', freq: k.r(2200, 3000), to: 1200, q: 1.2, attack: 0.008 });
    k.strike(k.r(1150, 1500), STEEL, 0.07, 0.3, { at: 0.012 });
  } },
  heroDown: { group: 'Heroes and soldiers', level: 0.18, priority: 2, musical: 62, duck: { music: 0.65, hold: 0.7 }, render: (k) => {
    [440, 370, 294, 220].forEach((f, i) => {
      k.tone(f, 0.42, 0.42, { type: 'triangle', at: i * 0.11, rev: 1 });
      k.tone(f / 2, 0.42, 0.2, { type: 'sawtooth', lp: 700, at: i * 0.11, rev: 0.6 });
    });
    k.noise(0.22, 0.3, { color: 'brown', freq: 700, to: 130 });
  } },
  levelUp: { group: 'Heroes and soldiers', level: 0.17, priority: 2, musical: 62, duck: { music: 0.75, hold: 0.45 }, render: (k) => {
    chimes(k, [587, 740, 880, 1175, 1480], 0.07, 0.42, 1);
    k.noise(0.45, 0.07, { type: 'highpass', freq: 5000, to: 9000, attack: 0.12, rev: 1 });
    k.shards(8, 2800, 6000, 0.4, 0.04, { at: 0.2, rev: 1.1, len: 0.15 });
  } },

  // ---------- Abilities ----------
  starfallCast: { group: 'Abilities', level: 0.25, priority: 2, render: (k) => {
    k.tone(400, 0.88, 0.32, { type: 'sawtooth', to: 1650, lp: 1100, lpTo: 3200, attack: 0.14, rev: 1 });
    k.noise(0.9, 0.3, { type: 'bandpass', freq: 800, to: 4600, attack: 0.5, q: 1.4, rev: 0.7 });
    k.shards(16, 1600, 6000, 0.9, 0.05, { rev: 1.2, len: 0.16 });
  } },
  starfallHit: { group: 'Abilities', level: 0.58, priority: 2, gap: 0.1, variants: 2, drive: 2.1, musical: 60, duck: { music: 0.45, combat: 0.5, hold: 0.7 }, render: (k) => {
    blast(k, 2.7, 0.9);
    k.noise(1.6, 0.3, { color: 'brown', freq: 320, to: 44, attack: 0.03 });
    [392, 523, 784, 1046].forEach((f, i) => {
      k.tone(f, 0.95, 0.15, { type: 'triangle', at: 0.05 + i * 0.05, rev: 1.3 });
    });
    k.shards(16, 2200, 6200, 0.8, 0.05, { at: 0.1, rev: 1.1, len: 0.2 });
  } },
  winter: { group: 'Abilities', level: 0.25, priority: 2, duck: { music: 0.7, combat: 0.75, hold: 0.5 }, render: (k) => {
    k.noise(0.95, 0.42, { color: 'pink', type: 'highpass', freq: 2300, to: 5800, attack: 0.1, rev: 1.2 });
    k.tone(170, 0.36, 0.42, { to: 58 });
    k.shards(22, 1800, 6400, 0.85, 0.09, { rev: 1.3, len: 0.2 });
    [1760, 2349, 2794, 3520].forEach((f, i) => k.strike(f, GLASS, 0.5, 0.08, { at: i * 0.055, rev: 1.3 }));
  } },
  guards: { group: 'Abilities', level: 0.2, priority: 2, musical: 62, render: (k) => {
    brass(k, [293.7], 0.42, 0.22, { attack: 0.04, rev: 1, lp: 1500 });
    brass(k, [440], 0.56, 0.22, { at: 0.14, attack: 0.04, rev: 1, lp: 1700 });
    for (const at of [0.03, 0.26, 0.44]) {
      k.tone(100, 0.1, 0.38, { to: 52, at });
      k.strike(k.r(1200, 1700), STEEL, 0.09, 0.08, { at });
    }
  } },
  sunbreak: { group: 'Abilities', level: 0.38, priority: 2, gap: 0.1, drive: 1.6, duck: { music: 0.6, combat: 0.65, hold: 0.4 }, render: (k) => {
    blast(k, 1.5, 1);
    [587, 880, 1175, 1760].forEach((f, i) => k.tone(f, 0.55, 0.13, { type: 'triangle', at: i * 0.03, rev: 1.3 }));
    k.noise(0.5, 0.12, { type: 'highpass', freq: 4400, attack: 0.03, rev: 1 });
  } },
  ward: { group: 'Abilities', level: 0.14, priority: 2, gap: 0.1, musical: 69, render: (k) => {
    for (const f of [440, 554, 659, 880]) {
      k.tone(f, 0.95, 0.24, { attack: 0.14, rev: 1.5 });
      k.fm(f * 2, 2, 0.5, 0.65, 0.05, { attack: 0.2, rev: 1.5 });
    }
    k.noise(0.8, 0.06, { type: 'highpass', freq: 5800, attack: 0.22, rev: 1 });
  } },
  rally: { group: 'Abilities', level: 0.2, priority: 2, gap: 0.3, musical: 62, render: (k) => {
    brass(k, [293.7, 440], 0.22, 0.18, { attack: 0.03, rev: 1, lp: 1600 });
    brass(k, [392, 587.3], 0.62, 0.18, { at: 0.17, attack: 0.03, rev: 1.2, lp: 1900 });
    k.tone(92, 0.2, 0.42, { to: 48 });
    k.tone(92, 0.22, 0.42, { to: 48, at: 0.17 });
  } },
  hex: { group: 'Abilities', level: 0.16, priority: 2, gap: 0.1, render: (k) => {
    k.fm(330, 1.41, 5, 0.62, 0.5, { to: 150, rev: 1.2 });
    k.fm(495, 1.41, 3, 0.5, 0.22, { to: 170, at: 0.05, rev: 1.2 });
    k.noise(0.45, 0.2, { color: 'pink', type: 'bandpass', freq: 2200, to: 400, q: 2.5, attack: 0.08, rev: 1 });
  } },
  rift: { group: 'Abilities', level: 0.3, priority: 2, gap: 0.1, drive: 1.5, duck: { music: 0.7, combat: 0.75, hold: 0.4 }, render: (k) => {
    k.tone(1250, 0.62, 0.34, { to: 62, rev: 1.2 });
    k.tone(62, 0.62, 0.55, { to: 36, attack: 0.04 });
    k.noise(0.7, 0.3, { color: 'pink', type: 'bandpass', freq: 3800, to: 260, q: 3, attack: 0.02, rev: 1.1 });
    k.fm(180, 1.41, 7, 0.5, 0.2, { to: 72, rev: 1 });
  } },
  golden: { group: 'Abilities', level: 0.2, priority: 2, gap: 0.3, musical: 60, duck: { music: 0.75, hold: 0.5 }, render: (k) => {
    for (let i = 0; i < 18; i++) {
      k.strike(k.r(1900, 3400), [1, 1.34, 2.14], 0.16, 0.13, { at: k.r(0, 0.85), rev: 0.7 });
    }
    chimes(k, [523, 784, 1046], 0.1, 0.8, 1.2);
  } },
  snipe: { group: 'Abilities', level: 0.24, priority: 2, gap: 0.1, variants: 3, jitter: 0.04, drive: 1.3, render: (k) => {
    k.noise(0.018, 0.65, { type: 'highpass', freq: 2200, rev: 1.2 });
    k.tone(k.r(1700, 2000), 0.1, 0.25, { to: 300 });
    k.tone(130, 0.16, 0.5, { to: 42 });
    k.noise(0.24, 0.2, { color: 'pink', freq: 1500, to: 280, at: 0.012, rev: 1 });
  } },

  // ---------- Building and battle moments ----------
  build: { group: 'Building and battle', level: 0.28, priority: 2, jitter: 0.03, variants: 3, render: (k) => {
    k.noise(0.17, 0.3, { color: 'brown', freq: 760, to: 130 });
    for (const at of [0, 0.085, 0.17]) {
      k.strike(k.r(290, 350), WOOD, 0.06, 0.42, { at });
      k.tone(125, 0.07, 0.32, { to: 74, at });
    }
    k.tone(660, 0.17, 0.16, { at: 0.2, rev: 0.7 });
    k.tone(990, 0.26, 0.16, { at: 0.27, rev: 0.7 });
  } },
  upgrade: { group: 'Building and battle', level: 0.15, priority: 2, musical: 60, render: (k) => {
    chimes(k, [523, 659, 784, 1046], 0.062, 0.33, 0.8);
    k.noise(0.3, 0.05, { type: 'highpass', freq: 5000, attack: 0.08, rev: 0.8 });
    k.tone(110, 0.14, 0.4, { to: 58 });
  } },
  sell: { group: 'Building and battle', level: 0.14, priority: 2, variants: 2, jitter: 0.03, render: (k) => {
    k.noise(0.22, 0.42, { color: 'brown', freq: 620, to: 150 });
    for (let i = 0; i < 4; i++) k.strike(k.r(220, 400), STONE, 0.05, 0.2, { at: k.r(0.01, 0.17) });
    k.strike(1320, [1, 1.34], 0.13, 0.26, { at: 0.07 });
    k.strike(1760, [1, 1.34], 0.15, 0.26, { at: 0.13 });
  } },
  leak: { group: 'Building and battle', level: 0.32, priority: 2, gap: 0.12, jitter: 0.03, drive: 1.3, duck: { music: 0.72, combat: 0.72, hold: 0.25 }, render: (k) => {
    k.tone(320, 0.5, 0.42, { type: 'triangle', to: 92, rev: 1 });
    k.tone(640, 0.32, 0.14, { to: 230, rev: 0.7 });
    k.noise(0.28, 0.38, { color: 'pink', freq: 2100, to: 190, rev: 0.8 });
    k.tone(78, 0.3, 0.45, { to: 40 });
    k.shards(6, 1800, 4800, 0.12, 0.09, { rev: 1 });
  } },
  horn: { group: 'Building and battle', level: 0.24, priority: 2, gap: 0.5, musical: 62, duck: { music: 0.7, hold: 0.6 }, render: (k) => {
    brass(k, [146.8, 220, 293.7], 1.05, 0.13, { attack: 0.18, rev: 1.3, lp: 1150 });
    k.tone(73.4, 1, 0.12, { attack: 0.2, hold: 0.3 });
    k.tone(92, 0.32, 0.3, { to: 45 });
    k.noise(0.1, 0.12, { color: 'brown', freq: 700, to: 150 });
  } },
  fanfareWin: { group: 'Building and battle', level: 0.3, priority: 2, musical: 60, duck: { music: 0.2, combat: 0.5, hold: 2 }, render: (k) => {
    const chords = [[60, 64, 67], [62, 65, 69], [64, 67, 71], [60, 64, 67, 72]];
    chords.forEach((chord, i) => {
      const at = i * 0.27;
      const dur = i === 3 ? 1.9 : 0.42;
      for (const n of chord) {
        const f = 440 * Math.pow(2, (n - 69) / 12);
        k.tone(f, dur, 0.09, { type: 'sawtooth', lp: 900, lpTo: 2300, attack: 0.03, at, rev: 1.5, vib: 5, vibRate: 4.8 });
        k.tone(f * 2, dur, 0.05, { type: 'triangle', attack: 0.03, at, rev: 1.5 });
      }
      k.tone(82, 0.26, 0.3, { to: 44, at });
    });
    k.shards(14, 2400, 6000, 1.5, 0.04, { at: 0.8, rev: 1.3, len: 0.2 });
  } },
  fanfareLose: { group: 'Building and battle', level: 0.26, priority: 2, duck: { music: 0.2, combat: 0.5, hold: 2 }, render: (k) => {
    const chords = [[50, 53, 57], [48, 52, 55], [46, 50, 53], [45, 49, 52]];
    chords.forEach((chord, i) => {
      const at = i * 0.46;
      const dur = i === 3 ? 1.9 : 0.46;
      for (const n of chord) {
        const f = 440 * Math.pow(2, (n - 69) / 12);
        k.tone(f, dur, 0.1, { type: 'sawtooth', lp: 900, lpTo: 460, attack: 0.04, at, rev: 1.5 });
        k.tone(f * 2, dur, 0.03, { type: 'triangle', attack: 0.04, at, rev: 1.5 });
      }
      k.tone(58, 0.42, 0.34, { to: 34, at });
    });
  } },
} satisfies Record<string, SfxDef>;

export type SfxName = keyof typeof SFX;

/** The sound each creature makes when it dies. Bosses also get their own sequence in the game view. */
export const DEATH_SOUNDS: Record<string, SfxName> = {
  gloomling: 'deathCritter',
  swiftclaw: 'deathCritter',
  bristleboar: 'deathBeast',
  duskmoth: 'deathMoth',
  ironhusk: 'deathMetal',
  shade: 'deathGhost',
  veilwraith: 'deathGhost',
  mireshaman: 'deathShaman',
  sporeback: 'deathPop',
  bogbloat: 'deathPop',
  gargoyle: 'deathStone',
  runegolem: 'deathStone',
  glasswing: 'deathGlass',
  cinderwight: 'deathEmber',
  colossus: 'bossDeath',
  broodmother: 'bossDeath',
  rimewarden: 'bossDeath',
  dunereaver: 'bossDeath',
  ashregent: 'bossDeath',
  stormharrow: 'bossDeath',
};

/** The Sunforge's continuous fire. It's rendered longer than its loop so the seam can be crossfaded. */
export function renderBeam(k: Kit, length: number) {
  k.tone(138, length, 0.2, { type: 'sawtooth', lp: 720, attack: 0.002, hold: 0.999 });
  k.tone(139.6, length, 0.2, { type: 'sawtooth', lp: 720, attack: 0.002, hold: 0.999 });
  k.tone(69, length, 0.24, { attack: 0.002, hold: 0.999 });
  k.noise(length, 0.3, { color: 'pink', type: 'bandpass', freq: 1200, q: 0.8, attack: 0.002, hold: 0.999 });
  k.crackle(Math.round(length * 26), 0, length - 0.05, 0.14);
}
