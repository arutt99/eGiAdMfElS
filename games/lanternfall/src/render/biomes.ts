import * as THREE from 'three';
import type { BiomeId } from '../data/maps';

export interface Biome {
  groundA: number; groundB: number; groundC: number;
  rockA: number; rockB: number;
  roadA: number; roadB: number;
  cobble: number;
  shore: number;
  peak: number; peakH: number;
  waterShallow: number; waterDeep: number;
  lava: boolean;
  zenith: number; horizon: number; low: number;
  cloudLit: number; cloudShade: number;
  sunColor: number; sunI: number; sunDir: [number, number, number];
  hemiSky: number; hemiGround: number; hemiI: number;
  envI: number;
  fog: number; fogDensity: number;
  rim: number;
  grass: [number, number];
  grassDensity: number;
  flowers: number[];
  ambient: 'pollen' | 'fireflies' | 'spores' | 'snow' | 'dust' | 'embers';
  rays: number;
  rayColor: number;
  grade: { lift: [number, number, number]; gain: [number, number, number]; sat: number };
  /** Musical identity. */
  music: { root: number; scale: 'lydian' | 'dorian' | 'aeolian' | 'phrygian' | 'mixolydian' | 'harmonic'; bpm: number };
  aurora?: boolean;
  /** Painted ground for the inked style: a color tint, and how far the lightest patch shifts to groundC. */
  ink: { tint: [number, number, number]; high: number };
}

export const BIOMES: Record<BiomeId, Biome> = {
  meadow: {
    ink: { tint: [0.9, 1.02, 0.72], high: 0 },
    groundA: 0x5f9a36, groundB: 0x82b143, groundC: 0xb8c24e, rockA: 0x75695f, rockB: 0xb2a48f, roadA: 0xc2a071, roadB: 0x8f6d49, cobble: 0.35,
    shore: 0xd6c384, peak: 0xf0efe6, peakH: 16, waterShallow: 0x5ed1c7, waterDeep: 0x1b6d94, lava: false,
    zenith: 0x4388d8, horizon: 0xffe2b4, low: 0xf7c293, cloudLit: 0xfff4e2, cloudShade: 0xd99b84,
    sunColor: 0xffe2b5, sunI: 3.6, sunDir: [-0.62, 0.72, 0.38], hemiSky: 0xc8dcff, hemiGround: 0x74803e, hemiI: 1.25, envI: 0.45,
    fog: 0xf3d3a8, fogDensity: 0.0026, rim: 0xffd9a8, grass: [0x4a8a2f, 0xa7c94e], grassDensity: 1, flowers: [0xffe25c, 0xff7d7d, 0xffffff, 0xd9a0ff],
    ambient: 'pollen', rays: 7, rayColor: 0xffe6b0, grade: { lift: [0.012, 0.004, 0], gain: [1.05, 1.01, 0.96], sat: 1.14 },
    music: { root: 62, scale: 'lydian', bpm: 84 },
  },
  forest: {
    ink: { tint: [0.88, 1.1, 0.86], high: 0.35 },
    groundA: 0x2a6a4a, groundB: 0x3d7f4c, groundC: 0x6a9440, rockA: 0x3f4f50, rockB: 0x7b8f84, roadA: 0xb09a72, roadB: 0x6e5f49, cobble: 0.3,
    shore: 0x6f7f58, peak: 0xbfd8c8, peakH: 20, waterShallow: 0x46d0bd, waterDeep: 0x0d3b53, lava: false,
    zenith: 0x162a60, horizon: 0x8ae0c8, low: 0x3b7186, cloudLit: 0xb7f0dc, cloudShade: 0x35607a,
    sunColor: 0xd8f5d0, sunI: 2.6, sunDir: [0.5, 0.68, -0.54], hemiSky: 0x7fa8ea, hemiGround: 0x2f5c44, hemiI: 1.25, envI: 0.45,
    fog: 0x4f8f8a, fogDensity: 0.0034, rim: 0x90ffd8, grass: [0x1f5c40, 0x75b35a], grassDensity: 0.85, flowers: [0x7cf0ff, 0xe7a0ff, 0xb8ff8c],
    ambient: 'fireflies', rays: 9, rayColor: 0xbff5d8, grade: { lift: [0, 0.012, 0.022], gain: [0.98, 1.03, 1.05], sat: 1.12 },
    music: { root: 57, scale: 'dorian', bpm: 76 },
  },
  marsh: {
    ink: { tint: [1, 1.06, 0.74], high: 0.3 },
    groundA: 0x4a6a30, groundB: 0x6a8a3a, groundC: 0x3f6248, rockA: 0x4a4c45, rockB: 0x85856c, roadA: 0xc2ad7a, roadB: 0x7d6e4e, cobble: 0.3,
    shore: 0x7a7f4d, peak: 0xc8ccb0, peakH: 20, waterShallow: 0x83a36a, waterDeep: 0x1e4240, lava: false,
    zenith: 0x5a6f97, horizon: 0xe3d7a9, low: 0xa0ae8e, cloudLit: 0xeee8c8, cloudShade: 0x7f9180,
    sunColor: 0xf6e8b5, sunI: 2.5, sunDir: [0.3, 0.66, 0.68], hemiSky: 0xbfcbcf, hemiGround: 0x5a6d40, hemiI: 1.25, envI: 0.45,
    fog: 0x9fae8c, fogDensity: 0.0038, rim: 0xdfe7a8, grass: [0x47612e, 0xa1a955], grassDensity: 0.75, flowers: [0xf7f2c0, 0xc8e38c],
    ambient: 'spores', rays: 5, rayColor: 0xf3edba, grade: { lift: [0.006, 0.01, 0.004], gain: [1.0, 1.02, 0.95], sat: 1.14 },
    music: { root: 55, scale: 'aeolian', bpm: 72 },
  },
  frost: {
    ink: { tint: [1, 1, 1.02], high: 1 },
    groundA: 0xbfd2e8, groundB: 0xa6c0de, groundC: 0xdce8f5, rockA: 0x4f6180, rockB: 0x8d9fb8, roadA: 0x7c8ca6, roadB: 0x4b5c7d, cobble: 0.5,
    shore: 0xc4dfee, peak: 0xffffff, peakH: 7, waterShallow: 0x62bddc, waterDeep: 0x1c5592, lava: false,
    zenith: 0x14306f, horizon: 0xc6e3f8, low: 0x9db9df, cloudLit: 0xf2f8ff, cloudShade: 0x7f9ccc,
    sunColor: 0xfff0dc, sunI: 2.3, sunDir: [-0.45, 0.62, -0.64], hemiSky: 0xbcd5ff, hemiGround: 0x8ea7c9, hemiI: 0.85, envI: 0.45,
    fog: 0xa9c4e2, fogDensity: 0.0026, rim: 0xbfe0ff, grass: [0xc4d8dc, 0xf2f8fa], grassDensity: 0.14, flowers: [0xc9f5ff],
    ambient: 'snow', rays: 4, rayColor: 0xe8f4ff, grade: { lift: [0, 0.004, 0.018], gain: [0.98, 1, 1.05], sat: 1.08 },
    music: { root: 60, scale: 'aeolian', bpm: 80 }, aurora: true,
  },
  desert: {
    ink: { tint: [1.04, 0.98, 0.84], high: 0.45 },
    groundA: 0xe3b269, groundB: 0xd59d55, groundC: 0xf0d092, rockA: 0xa35933, rockB: 0xe6a763, roadA: 0xb08554, roadB: 0x83603e, cobble: 0.55,
    shore: 0xd9b36c, peak: 0xf3d7a3, peakH: 22, waterShallow: 0x5ed1c7, waterDeep: 0x1b6d94, lava: false,
    zenith: 0x3e62a8, horizon: 0xffbd7c, low: 0xeb8e5e, cloudLit: 0xffe4c0, cloudShade: 0xc66a58,
    sunColor: 0xffcd96, sunI: 3.9, sunDir: [0.7, 0.55, 0.45], hemiSky: 0xbcc7ee, hemiGround: 0xc0833f, hemiI: 1.1, envI: 0.4,
    fog: 0xf0c08c, fogDensity: 0.0032, rim: 0xffc890, grass: [0xa59045, 0xdcc472], grassDensity: 0.16, flowers: [0xff8ca0],
    ambient: 'dust', rays: 6, rayColor: 0xffd9a0, grade: { lift: [0.016, 0.006, 0], gain: [1.05, 1, 0.93], sat: 1.12 },
    music: { root: 58, scale: 'harmonic', bpm: 88 },
  },
  volcano: {
    ink: { tint: [1.08, 0.94, 0.92], high: 0.5 },
    groundA: 0x5f4d4a, groundB: 0x7a5e4e, groundC: 0x4a3d42, rockA: 0x231e24, rockB: 0x5f453c, roadA: 0xc49a72, roadB: 0x7d5c48, cobble: 0.55,
    shore: 0x2a2024, peak: 0x6d5a58, peakH: 19, waterShallow: 0xff8a1f, waterDeep: 0xd8321a, lava: true,
    zenith: 0x170d24, horizon: 0xd65230, low: 0x7f2719, cloudLit: 0xa8574a, cloudShade: 0x35181f,
    sunColor: 0xffb486, sunI: 3.4, sunDir: [-0.4, 0.62, 0.68], hemiSky: 0x8b6a8c, hemiGround: 0xc0562c, hemiI: 1.6, envI: 0.35,
    fog: 0x6e3226, fogDensity: 0.0026, rim: 0xff7a40, grass: [0x5a4438, 0x8a6448], grassDensity: 0.06, flowers: [0xff6a2a],
    ambient: 'embers', rays: 3, rayColor: 0xff9a60, grade: { lift: [0.022, 0.004, 0.006], gain: [1.05, 0.97, 0.93], sat: 1.12 },
    music: { root: 53, scale: 'phrygian', bpm: 96 },
  },
};

export const colorOf = (hex: number) => new THREE.Color(hex);
