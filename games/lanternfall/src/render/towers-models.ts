// Procedural tower models. Each tier and branch has its own silhouette.
import * as THREE from 'three';
import { inkTowerModel } from './ink-towers';
import { INK } from './style';
import type { TowerId } from '../data/towers';
import { MB } from './mb';

export interface TowerModel {
  base: THREE.BufferGeometry;
  /** Metal parts, using the shinier material. */
  metal?: THREE.BufferGeometry;
  /** Rotates to face the target. */
  head?: THREE.BufferGeometry;
  headGlow?: THREE.BufferGeometry;
  headY: number;
  /** Emissive parts that do not rotate. */
  glow?: THREE.BufferGeometry;
  /** Emissive parts that spin and bob. */
  orbit?: THREE.BufferGeometry;
  /** The orbit is one solid shape, big enough to take an ink outline. */
  orbitInk?: boolean;
  orbitY: number;
  muzzleY: number;
  height: number;
  /** Accent color for effects. */
  accent: number;
}

const STONE: [number, number] = [0x6d6a72, 0xa39c96];
const STONE_L: [number, number] = [0x8e877f, 0xc9bfae];
const WOOD: [number, number] = [0x4f3322, 0x7d5535];
const WOOD_L = 0x9b6e43;
const GOLD = 0xe8b64c;
const IRON: [number, number] = [0x3d3f49, 0x5b5e6c];
const SKIN = 0xe6b48c;

function plinth(m: MB, r: number, h: number, col: [number, number] = STONE, y = 0) {
  m.cyl(r * 0.92, r, h, col, { p: [0, y + h / 2, 0], wobble: 0.05 }, 12, 2);
  // Hand-laid foundation stones.
  const n = 9;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    const s = 0.72 + ((i * 37) % 10) / 22;
    m.ico(0.3 * s, col, { p: [Math.cos(a) * r * 1.02, y + 0.16 * s, Math.sin(a) * r * 1.02], s: [1.25, 0.72, 1], wobble: 0.03 }, 0);
  }
}

function shingleRoof(m: MB, r: number, h: number, col: [number, number], y: number, tiers = 3) {
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const rr = r * (1 - t * 0.72);
    const hh = (h / tiers) * 1.45;
    m.cone(rr, hh, col, { p: [0, y + t * h + hh / 2, 0], r: [0, i * 0.5, 0], wobble: 0.025 }, 10);
  }
}

function banner(m: MB, col: number, y: number, h = 0.9, x = 0, z = 0) {
  m.cyl(0.035, 0.05, h + 0.5, 0x5a3b26, { p: [x, y + (h + 0.5) / 2, z] }, 6);
  m.box(0.55, 0.32, 0.03, [col, col], { p: [x + 0.3, y + h + 0.26, z], wobble: 0.015, wobbleFreq: 3 });
  m.cone(0.07, 0.14, GOLD, { p: [x, y + h + 0.58, z] }, 6);
}

function archer(m: MB, x: number, z: number, tunic: number, s = 1) {
  m.cyl(0.13 * s, 0.2 * s, 0.5 * s, [tunic, tunic], { p: [x, 0.25 * s, z] }, 8);
  m.sphere(0.14 * s, SKIN, { p: [x, 0.62 * s, z] }, 10, 8);
  m.cone(0.2 * s, 0.26 * s, tunic, { p: [x, 0.76 * s, z - 0.02 * s], r: [-0.25, 0, 0] }, 8);
  // Bow, drawn and facing forward.
  m.torus(0.3 * s, 0.022 * s, 0x6b4426, { p: [x + 0.04 * s, 0.42 * s, z + 0.22 * s], r: [0, Math.PI / 2, 0] }, 5, 12);
}

function buildRoost(level: number, branch: number): TowerModel {
  const m = new MB(); const glow = new MB(); const head = new MB(); const headGlow = new MB(); const metal = new MB();
  if (level < 2) {
    const tall = level === 0 ? 2.2 : 3;
    plinth(m, 1.05, 0.55, STONE);
    // Slanted timber legs, cross-braced, holding the platform.
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2;
      const cx = Math.cos(a), cz = Math.sin(a);
      m.cyl(0.09, 0.14, tall + 0.2, WOOD, { p: [cx * 0.68, 0.55 + tall / 2, cz * 0.68], r: [cz * 0.13, 0, -cx * 0.13] }, 7);
      m.box(1.05, 0.08, 0.08, WOOD_L, { p: [Math.cos(a + Math.PI / 4) * 0.56, 0.55 + tall * 0.45, Math.sin(a + Math.PI / 4) * 0.56], r: [0, -(a + Math.PI / 4) + Math.PI / 2, 0] });
    }
    const y = 0.55 + tall;
    m.cyl(1.05, 0.95, 0.16, WOOD_L, { p: [0, y, 0] }, 10);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      m.cyl(0.04, 0.05, 0.42, WOOD, { p: [Math.cos(a) * 0.97, y + 0.26, Math.sin(a) * 0.97] }, 5);
    }
    m.torus(0.97, 0.035, WOOD_L, { p: [0, y + 0.46, 0], r: [Math.PI / 2, 0, 0] }, 5, 20);
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 0.5;
      m.cyl(0.05, 0.06, 1.2, WOOD, { p: [Math.cos(a) * 0.72, y + 0.65, Math.sin(a) * 0.72] }, 5);
    }
    shingleRoof(m, 1.3, 1.1, [0xb6452f, 0xdf7a4a], y + 1.2, 2);
    if (level === 1) banner(m, 0xc9383a, y + 1.4, 0.8);
    archer(head, 0, 0.1, 0x3d7c4b, 1.15);
    return { base: m.build(), head: head.build(), headY: y + 0.08, orbitY: 0, muzzleY: y + 0.6, height: y + 2.4, accent: 0xfff0c0 };
  }
  if (branch === 0) {
    // Hawkeye Aerie: a slender stone needle with a blue crest.
    const big = level === 3;
    const h = big ? 6.4 : 5;
    plinth(m, 1.1, 0.6, STONE_L);
    m.lathe([[0.95, 0.6], [0.68, 1.6], [0.52, h * 0.7], [0.62, h * 0.9], [0.92, h], [0.95, h + 0.15], [0, h + 0.15]], STONE_L, { wobble: 0.025 }, 12);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      m.box(0.3, 0.26, 0.2, STONE_L, { p: [Math.cos(a) * 0.86, h + 0.26, Math.sin(a) * 0.86], r: [0, -a, 0] });
    }
    m.torus(0.62, 0.05, GOLD, { p: [0, h * 0.68, 0], r: [Math.PI / 2, 0, 0] }, 6, 18);
    if (big) {
      // Wings of gold at the top.
      for (const sx of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          metal.box(0.5 - i * 0.05, 0.08, 1.3 - i * 0.22, [GOLD, 0xffe39b], { p: [sx * (0.92 + i * 0.27), h - 0.32 + i * 0.3, -0.1], r: [0.1, 0, sx * -(0.6 + i * 0.18)] });
        }
      }
    }
    banner(m, 0x2f6ec9, h + 0.1, big ? 1.2 : 0.8, -0.8, 0.1);
    // A ballista on the head.
    head.box(0.34, 0.22, 1.6, WOOD, { p: [0, 0.3, 0.2] });
    head.torus(0.6, 0.05, IRON, { p: [0, 0.34, 0.55], r: [Math.PI / 2, 0, 0], s: [1, 0.55, 1] }, 5, 16);
    head.cyl(0.03, 0.03, 1.9, 0xe6dfcf, { p: [0, 0.42, 0.45], r: [Math.PI / 2, 0, 0] }, 5);
    headGlow.cone(0.08, 0.26, 0x8fd4ff, { p: [0, 0.42, 1.45], r: [Math.PI / 2, 0, 0], gain: 2.2 }, 6);
    archer(head, 0, -0.6, 0x2f5fa8, 1);
    return { base: m.build(), metal: metal.empty ? undefined : metal.build(), head: head.build(), headGlow: headGlow.build(), headY: h + 0.15, orbitY: 0, muzzleY: h + 0.6, height: h + 2, accent: 0x9fdcff };
  }
  // Volley Lodge: a broad timber hall on stilts with a whole party of archers.
  const big = level === 3;
  const y = big ? 3.2 : 2.5;
  plinth(m, 1.35, 0.5, STONE);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    m.cyl(0.11, 0.17, y, WOOD, { p: [Math.cos(a) * 1.05, y / 2 + 0.3, Math.sin(a) * 1.05] }, 7);
  }
  m.cyl(1.5, 1.35, 0.26, WOOD_L, { p: [0, y + 0.1, 0] }, 8);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.39;
    m.box(1.15, 0.5, 0.08, WOOD, { p: [Math.cos(a) * 1.4, y + 0.42, Math.sin(a) * 1.4], r: [0, -a + Math.PI / 2, 0] });
  }
  shingleRoof(m, 1.75, big ? 1.6 : 1.1, [0xc5642a, 0xeea24e], y + 1.65, 2);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    m.cyl(0.05, 0.07, 1.1, WOOD, { p: [Math.cos(a) * 1.15, y + 1.1, Math.sin(a) * 1.15] }, 5);
  }
  if (big) banner(m, 0xd14b2d, y + 2.8, 0.9);
  const positions: [number, number][] = big
    ? [[0, 0.9], [-0.85, 0.5], [0.85, 0.5], [-0.55, -0.6], [0.55, -0.6]]
    : [[0, 0.8], [-0.75, 0.2], [0.75, 0.2]];
  for (const [x, z] of positions) archer(head, x, z, 0xa8512c, 1);
  return { base: m.build(), head: head.build(), headY: y + 0.24, orbitY: 0, muzzleY: y + 0.75, height: y + 3, accent: 0xffd9a0 };
}

function buildSpire(level: number, branch: number): TowerModel {
  const m = new MB(); const metal = new MB(); const glow = new MB(); const orbit = new MB();
  let crystal = 0x9d7bff, gain = 2.6, body: [number, number] = [0x53467e, 0x8c7fc1], trim = GOLD;
  let h = level === 0 ? 3.6 : 4.5;
  if (level >= 2) {
    h = level === 2 ? 5.2 : 6.2;
    if (branch === 0) { crystal = 0x62b7ff; body = [0x273a60, 0x4f70a3]; trim = 0xc98545; gain = 3.4; }
    else { crystal = 0x98f0ff; body = [0x6fa5c7, 0xdaf3fa]; trim = 0xe9faff; gain = 2.6; }
  }
  plinth(m, 1.1, 0.55, level >= 2 && branch === 1 ? [0x8aa9bb, 0xcfe4ec] : STONE);
  m.lathe([[0.92, 0.55], [0.56, 1.5], [0.42, h * 0.72], [0.6, h * 0.84], [0.28, h], [0, h]], body, { wobble: 0.02 }, 8);
  metal.torus(0.54, 0.05, trim, { p: [0, 1.45, 0], r: [Math.PI / 2, 0, 0] }, 6, 16);
  metal.torus(0.59, 0.05, trim, { p: [0, h * 0.83, 0], r: [Math.PI / 2, 0, 0] }, 6, 16);
  // Fins flaring out from the shaft.
  const fins = level === 0 ? 3 : 4;
  for (let i = 0; i < fins; i++) {
    const a = (i / fins) * Math.PI * 2 + 0.4;
    m.crystal(0.32, h * 0.46, body, { p: [Math.cos(a) * 0.72, 1.3 + h * 0.11, Math.sin(a) * 0.72], r: [Math.sin(a) * 0.14, 0, -Math.cos(a) * 0.14], s: [0.75, 1, 0.75] });
    glow.box(0.05, h * 0.16, 0.05, crystal, { p: [Math.cos(a) * 0.72, 1.45 + h * 0.11, Math.sin(a) * 0.72], gain: gain * 0.5 });
  }
  const top = h + 0.75;
  orbit.crystal(level === 0 ? 0.36 : 0.46, level === 0 ? 1 : 1.3, [crystal, 0xffffff], { gain });
  if (level >= 1) {
    orbit.torus(0.78, 0.028, crystal, { r: [Math.PI / 2 - 0.3, 0, 0.2], gain: gain * 0.8 }, 5, 26);
  }
  if (level >= 2) {
    if (branch === 0) {
      // Copper lightning rods.
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        metal.cyl(0.018, 0.05, 1.7, 0xd98a4d, { p: [Math.cos(a) * 0.52, h * 0.84 + 0.8, Math.sin(a) * 0.52], r: [Math.sin(a) * 0.2, 0, -Math.cos(a) * 0.2] }, 5);
        glow.sphere(0.07, 0x9fd8ff, { p: [Math.cos(a) * 0.72, h * 0.84 + 1.62, Math.sin(a) * 0.72], gain: 4 }, 7, 5);
      }
      orbit.torus(1.05, 0.03, 0x9fd8ff, { r: [Math.PI / 2 + 0.5, 0.3, 0], gain: 3 }, 5, 26);
      if (level === 3) {
        // A captive thunderhead.
        m.sphere(0.8, [0x3a4564, 0x7c8bb1], { p: [0, h + 2.25, 0], s: [1.25, 0.56, 1.25], wobble: 0.13, puff: 0.8 }, 12, 9);
        m.sphere(0.5, [0x3a4564, 0x7c8bb1], { p: [0.7, h + 2.2, 0.2], s: [1.2, 0.6, 1.2], wobble: 0.1, puff: 0.8 }, 10, 8);
        m.sphere(0.5, [0x3a4564, 0x7c8bb1], { p: [-0.65, h + 2.3, -0.2], s: [1.2, 0.6, 1.2], wobble: 0.1, puff: 0.8 }, 10, 8);
      }
    } else {
      // Spikes of ice bursting from the base.
      const n = level === 3 ? 7 : 5;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + 0.3;
        const l = 1.0 + ((i * 7) % 5) * 0.28;
        m.crystal(0.24, l, [0x8ccfe8, 0xeafcff], { p: [Math.cos(a) * 1.0, 0.45 + l * 0.32, Math.sin(a) * 1.0], r: [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5] });
      }
      if (level === 3) {
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2;
          orbit.crystal(0.14, 0.42, 0xbff5ff, { p: [Math.cos(a) * 1.02, 0, Math.sin(a) * 1.02], gain: 2.5 });
        }
      }
    }
  }
  return {
    base: m.build(), metal: metal.build(), glow: glow.empty ? undefined : glow.build(), orbit: orbit.build(), orbitY: top, headY: 0,
    muzzleY: top, height: top + 1, accent: crystal,
  };
}

function buildMortar(level: number, branch: number): TowerModel {
  const m = new MB(); const metal = new MB(); const head = new MB(); const headGlow = new MB(); const glow = new MB();
  const big = level === 3;
  const hh = level === 0 ? 1.15 : level === 1 ? 1.4 : big ? 2 : 1.7;
  const r = level === 0 ? 1.25 : 1.4;
  plinth(m, r + 0.1, 0.5, STONE);
  // A squat rampart with crenellations.
  m.cyl(r * 0.92, r, hh, level >= 2 && branch === 0 ? [0x4a2f2d, 0x7b4a3a] : STONE, { p: [0, 0.5 + hh / 2, 0], wobble: 0.03 }, 12);
  const y = 0.5 + hh;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    m.box(0.42, 0.34, 0.26, STONE_L, { p: [Math.cos(a) * r * 0.86, y + 0.14, Math.sin(a) * r * 0.86], r: [0, -a + Math.PI / 2, 0] });
  }
  metal.torus(r * 0.93, 0.06, IRON, { p: [0, y - 0.32, 0], r: [Math.PI / 2, 0, 0] }, 6, 22);
  const angle = -0.72;
  if (level < 2) {
    const len = level === 0 ? 1.5 : 1.8;
    const rad = level === 0 ? 0.38 : 0.46;
    head.sphere(rad * 1.2, IRON, { p: [0, 0.24, 0] }, 10, 8);
    head.cyl(rad, rad * 1.18, len, IRON, { p: [0, 0.22 + Math.cos(angle) * len * 0.42, Math.sin(-angle) * len * 0.42], r: [-angle, 0, 0] }, 12);
    head.torus(rad * 1.04, 0.05, GOLD, { p: [0, 0.22 + Math.cos(angle) * len * 0.82, Math.sin(-angle) * len * 0.82], r: [Math.PI / 2 - angle, 0, 0] }, 5, 14);
    headGlow.cyl(rad * 0.74, rad * 0.74, 0.04, 0xff9338, { p: [0, 0.22 + Math.cos(angle) * len * 0.92, Math.sin(-angle) * len * 0.92], r: [-angle, 0, 0], gain: 3.2 }, 12);
    return { base: m.build(), metal: metal.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.1, orbitY: 0, muzzleY: y + 1.3, height: y + 1.8, accent: 0xff9338 };
  }
  if (branch === 0) {
    // Dragonmaw: a horned iron dragon's head with a fire in its throat.
    const s = big ? 1.25 : 1;
    const dark: [number, number] = [0x34272b, 0x6a4b42];
    head.sphere(0.72 * s, dark, { p: [0, 0.5 * s, 0.05], s: [0.95, 0.85, 1.25], wobble: 0.04 }, 12, 9);
    head.cone(0.56 * s, 1.15 * s, dark, { p: [0, 0.82 * s, 0.82 * s], r: [Math.PI / 2 + 0.55, 0, 0], s: [1, 1, 0.82] }, 8);
    for (const sx of [-1, 1]) {
      head.cone(0.14 * s, 0.85 * s, [0x4e3c37, 0xd5c4a0], { p: [sx * 0.42 * s, 1.18 * s, -0.25 * s], r: [-0.8, 0, sx * -0.35] }, 7);
      headGlow.sphere(0.075 * s, 0xffb02e, { p: [sx * 0.3 * s, 0.86 * s, 0.68 * s], gain: 5 }, 7, 5);
    }
    headGlow.sphere(0.27 * s, 0xff6a1e, { p: [0, 1.04 * s, 1.1 * s], gain: 5, s: [1, 0.72, 1] }, 9, 6);
    if (big) {
      for (let i = 0; i < 3; i++) {
        const a = (i * 2.1) + 0.5;
        m.cyl(0.2, 0.26, 1.3, IRON, { p: [Math.cos(a) * r * 0.74, y + 0.6, Math.sin(a) * r * 0.74] }, 8);
        glow.cyl(0.14, 0.14, 0.04, 0xff7a24, { p: [Math.cos(a) * r * 0.74, y + 1.27, Math.sin(a) * r * 0.74], gain: 4 }, 8);
      }
    }
    return { base: m.build(), metal: metal.build(), glow: glow.empty ? undefined : glow.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.05, orbitY: 0, muzzleY: y + 1.1 * s, height: y + 2.2, accent: 0xff7a24 };
  }
  // Thunderkeg: enormous banded barrels of blasting powder.
  const s = big ? 1.28 : 1;
  head.cyl(0.62 * s, 0.68 * s, 1.5 * s, [0x5d3d24, 0x8b5d34], { p: [0, 0.46 + 0.62 * s, 0.25 * s], r: [0.72, 0, 0], wobble: 0.015 }, 12, 3);
  for (const k of [-0.5, 0, 0.5]) {
    const d = k * 1.5 * s * 0.66;
    head.torus(0.66 * s, 0.05, IRON, { p: [0, 0.46 + 0.62 * s + Math.cos(0.72) * d, 0.25 * s + Math.sin(0.72) * d], r: [Math.PI / 2 + 0.72, 0, 0] }, 5, 16);
  }
  headGlow.cyl(0.44 * s, 0.44 * s, 0.05, 0xffe08a, { p: [0, 0.46 + 0.62 * s + Math.cos(0.72) * 0.76 * s, 0.25 * s + Math.sin(0.72) * 0.76 * s], r: [0.72, 0, 0], gain: 3 }, 12);
  for (let i = 0; i < (big ? 4 : 2); i++) {
    const a = 2.2 + i * 1.12;
    m.cyl(0.3, 0.32, 0.72, [0x5d3d24, 0x8b5d34], { p: [Math.cos(a) * r * 0.62, y + 0.32, Math.sin(a) * r * 0.62] }, 9);
    metal.torus(0.32, 0.03, IRON, { p: [Math.cos(a) * r * 0.62, y + 0.32, Math.sin(a) * r * 0.62], r: [Math.PI / 2, 0, 0] }, 5, 12);
  }
  return { base: m.build(), metal: metal.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.05, orbitY: 0, muzzleY: y + 1.7, height: y + 2.4, accent: 0xffd166 };
}

function buildShrine(level: number, branch: number): TowerModel {
  const m = new MB(); const metal = new MB(); const glow = new MB(); const orbit = new MB();
  const stones = level === 0 ? 4 : 6;
  const r = 1.12;
  m.cyl(1.25, 1.35, 0.3, [0x5b7a45, 0x79a058], { p: [0, 0.15, 0], wobble: 0.05 }, 14);
  for (let i = 0; i < stones; i++) {
    const a = (i / stones) * Math.PI * 2 + 0.3;
    const h = 1.2 + ((i * 3) % 4) * 0.22;
    m.box(0.36, h, 0.28, STONE, { p: [Math.cos(a) * r, 0.25 + h / 2, Math.sin(a) * r], r: [0.04, -a, 0.05], wobble: 0.035 });
    glow.box(0.05, h * 0.5, 0.05, branch === 1 && level >= 2 ? 0x8cff5e : 0x6effc8, { p: [Math.cos(a) * (r + 0.15), 0.3 + h / 2, Math.sin(a) * (r + 0.15)], gain: 2.3 });
  }
  let accent = 0x6effc8;
  if (level < 2) {
    // A little glowing sapling at the center of the ring.
    const th = level === 0 ? 1.2 : 1.6;
    m.cyl(0.06, 0.14, th, WOOD, { p: [0, 0.3 + th / 2, 0], wobble: 0.02 }, 7);
    m.sphere(0.56, [0x2f8f60, 0x83e0a0], { p: [0, 0.4 + th, 0], s: [1, 0.85, 1], wobble: 0.1, puff: 0.7 }, 12, 9);
    m.sphere(0.32, [0x2f8f60, 0x83e0a0], { p: [0.35, 0.28 + th, 0.1], wobble: 0.06, puff: 0.7 }, 10, 8);
    m.sphere(0.32, [0x2f8f60, 0x83e0a0], { p: [-0.32, 0.3 + th, -0.14], wobble: 0.06, puff: 0.7 }, 10, 8);
    for (let i = 0; i < 6; i++) {
      const a = i * 1.2;
      orbit.sphere(0.05, 0xc6ffdf, { p: [Math.cos(a) * 0.82, Math.sin(i * 2) * 0.3, Math.sin(a) * 0.82], gain: 4 }, 6, 4);
    }
    return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitY: 0.5 + th, headY: 0, muzzleY: 1.6, height: 2.8, accent };
  }
  if (branch === 0) {
    // Sunwell: a golden basin with a little sun floating above.
    accent = 0xffd15c;
    const big = level === 3;
    metal.lathe([[0.05, 0.3], [0.32, 0.5], [0.3, 1.0], [0.84, 1.3], [0.98, 1.46], [0.86, 1.42], [0, 1.3]], [0xc98f33, 0xffdf85], {}, 18);
    glow.cyl(0.84, 0.84, 0.03, 0xffe9a0, { p: [0, 1.4, 0], gain: 2.2 }, 18);
    orbit.sphere(big ? 0.5 : 0.38, [0xffb02e, 0xfff0b5], { gain: 4.2 }, 14, 10);
    const rays = big ? 8 : 5;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      orbit.crystal(0.075, 0.5, 0xffe58a, { p: [Math.cos(a) * (big ? 0.82 : 0.66), 0, Math.sin(a) * (big ? 0.82 : 0.66)], r: [Math.sin(a) * Math.PI / 2, 0, -Math.cos(a) * Math.PI / 2], gain: 3 });
    }
    return { base: m.build(), metal: metal.build(), glow: glow.build(), orbit: orbit.build(), orbitY: big ? 2.8 : 2.4, headY: 0, muzzleY: 2.4, height: 3.6, accent };
  }
  // Thornroot: twisted roots wrapped around a green heart.
  accent = 0x8cff5e;
  const big = level === 3;
  const coil = big ? 7 : 5;
  for (let i = 0; i < coil; i++) {
    const a = (i / coil) * Math.PI * 2;
    const h = big ? 3.2 : 2.5;
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 1.2, 0.1, Math.sin(a) * 1.2),
      new THREE.Vector3(Math.cos(a + 0.7) * 0.72, h * 0.34, Math.sin(a + 0.7) * 0.72),
      new THREE.Vector3(Math.cos(a + 1.4) * 0.44, h * 0.68, Math.sin(a + 1.4) * 0.44),
      new THREE.Vector3(Math.cos(a + 2.2) * 0.26, h, Math.sin(a + 2.2) * 0.26),
    ]);
    m.add(new THREE.TubeGeometry(path, 12, 0.14 - i * 0.004, 6), [0x3d2a1c, 0x6b4a2c]);
    for (let k = 1; k < 4; k++) {
      const pt = path.getPoint(k / 4);
      m.cone(0.055, 0.34, 0xc9b98a, { p: [pt.x * 1.3, pt.y, pt.z * 1.3], r: [Math.sin(a + k) * 1.2, 0, -Math.cos(a + k) * 1.2] }, 5);
    }
  }
  orbit.ico(big ? 0.5 : 0.38, [0x4fcf3e, 0xcfff8c], { gain: 3.2 }, 1);
  return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitY: big ? 2.25 : 1.75, headY: 0, muzzleY: 2, height: big ? 3.8 : 3.2, accent };
}

function buildSunforge(level: number, branch: number): TowerModel {
  const m = new MB(); const metal = new MB(); const head = new MB(); const headGlow = new MB(); const glow = new MB();
  const bronze: [number, number] = [0x7a4a22, 0xc9863c];
  const h = 1.7 + level * 0.5;
  plinth(m, 1.15, 0.55, STONE_L);
  metal.lathe([[0.88, 0.55], [0.56, 0.9], [0.42, h - 0.1], [0.72, h + 0.1], [0.78, h + 0.2], [0, h + 0.22]], bronze, {}, 14);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    metal.box(0.1, h * 0.7, 0.22, [GOLD, 0xffe39b], { p: [Math.cos(a) * 0.6, 0.65 + h * 0.3, Math.sin(a) * 0.6], r: [Math.sin(a) * 0.2, -a, -Math.cos(a) * 0.2] });
    glow.box(0.04, h * 0.4, 0.04, 0xffb347, { p: [Math.cos(a) * 0.72, 0.7 + h * 0.28, Math.sin(a) * 0.72], gain: 3 });
  }
  // Head: a gimbal holding the lens.
  const yoke = 0.95;
  head.torus(yoke, 0.07, [GOLD, 0xffe39b], { p: [0, 0.75, 0], r: [0, 0, 0] }, 6, 26);
  head.cyl(0.09, 0.13, 0.5, bronze, { p: [0, 0.03, 0] }, 8);
  let accent = 0xffc14a;
  if (level >= 2 && branch === 0) {
    accent = 0xfff0a0;
    const big = level === 3;
    headGlow.crystal(0.5, big ? 1.8 : 1.4, [0xffc14a, 0xffffff], { p: [0, 0.75, 0], gain: 3.2 });
    for (let i = 0; i < (big ? 5 : 3); i++) {
      const a = (i / (big ? 5 : 3)) * Math.PI * 2;
      headGlow.crystal(0.13, 0.5, 0xfff0a0, { p: [Math.cos(a) * 0.7, 0.75 + Math.sin(a) * 0.7, 0], gain: 3 });
    }
  } else if (level >= 2) {
    accent = 0xff8a3c;
    const big = level === 3;
    const len = big ? 3.1 : 2.4;
    head.cyl(0.15, 0.3, len, bronze, { p: [0, 0.75, len / 2 - 0.5], r: [Math.PI / 2, 0, 0] }, 10);
    for (let i = 0; i < 3; i++) {
      head.torus(0.32 - i * 0.05, 0.05, [GOLD, 0xffe39b], { p: [0, 0.75, -0.2 + (i * len) / 3.4], r: [0, 0, 0] }, 5, 16);
    }
    headGlow.sphere(0.2, 0xffa44f, { p: [0, 0.75, len - 0.5], gain: 4.5 }, 9, 7);
  } else {
    headGlow.cyl(yoke * 0.82, yoke * 0.82, 0.08, [0xffb347, 0xffefb0], { p: [0, 0.75, 0.04], r: [Math.PI / 2, 0, 0], gain: 2.6 + level * 0.6 }, 20);
  }
  return {
    base: m.build(), metal: metal.build(), glow: glow.build(), head: head.build(), headGlow: headGlow.build(),
    headY: h + 0.25, orbitY: 0, muzzleY: h + 1, height: h + 2, accent,
  };
}

const cache = new Map<string, TowerModel>();

const TOWER_SCALE = 1.3;

export function towerModel(type: TowerId, level: number, branch: number): TowerModel {
  const key = `${type}-${level}-${level >= 2 ? branch : 0}`;
  let model = cache.get(key);
  if (model) return model;
  if (INK) model = inkTowerModel(type, level, branch);
  else switch (type) {
    case 'roost': model = buildRoost(level, branch); break;
    case 'spire': model = buildSpire(level, branch); break;
    case 'mortar': model = buildMortar(level, branch); break;
    case 'shrine': model = buildShrine(level, branch); break;
    case 'sunforge': model = buildSunforge(level, branch); break;
    // The newer towers share one model across both art styles.
    default: model = inkTowerModel(type, level, branch);
  }
  // Towers are drawn larger than life so that they stand out from the scenery at the default zoom.
  for (const g of [model.base, model.metal, model.head, model.headGlow, model.glow, model.orbit]) g?.scale(TOWER_SCALE, TOWER_SCALE, TOWER_SCALE);
  model.headY *= TOWER_SCALE;
  model.orbitY *= TOWER_SCALE;
  model.muzzleY *= TOWER_SCALE;
  model.height *= TOWER_SCALE;
  cache.set(key, model);
  return model;
}
