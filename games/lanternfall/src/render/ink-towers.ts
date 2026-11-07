// Tower models for the inked storybook style: chunky proportions and one clear silhouette per tower and branch.
import * as THREE from 'three';
import type { TowerId } from '../data/towers';
import { MB } from './mb';
import type { TowerModel } from './towers-models';

type C2 = [number, number];

const GOLD: C2 = [0xc98a2c, 0xffd36b];
const IRON: C2 = [0x2f3240, 0x666b80];
const WARM: C2 = [0x77706f, 0xc4b8a2];
const PALE: C2 = [0xa59a8c, 0xe2d6bf];
const ROCK: C2 = [0x5f5a60, 0x8f8880];
const TIMBER: C2 = [0x5a3519, 0x9c6631];
const TIMBER_L: C2 = [0x7a4a22, 0xb87b3f];
const BRONZE: C2 = [0x7a4a22, 0xd08f45];
const SKIN = 0xf0bd92;
const INK = 0x1b1012;
const RING: [number, number, number] = [Math.PI / 2, 0, 0];

const facing = (a: number): [number, number, number] => [0, -a + Math.PI / 2, 0];

function foundation(m: MB, r: number, col: C2 = ROCK) {
  m.cyl(r * 0.84, r, 0.5, col, { p: [0, 0.25, 0], wobble: 0.04 }, 14);
}

function drum(m: MB, rt: number, rb: number, y0: number, h: number, col: C2) {
  m.cyl(rt, rb, h, col, { p: [0, y0 + h / 2, 0], wobble: 0.035 }, 14, 3);
}

/** A few big facing stones, spiralled around a drum, so each one is legible at game zoom. */
function blocks(m: MB, n: number, rb: number, rt: number, y0: number, h: number, col: C2) {
  for (let i = 0; i < n; i++) {
    const a = i * 2.399;
    const t = (i + 0.5) / n;
    const r = rb + (rt - rb) * t;
    m.box(0.56 - (i % 3) * 0.08, 0.27, 0.16, col, { p: [Math.cos(a) * r, y0 + t * h, Math.sin(a) * r], r: facing(a), wobble: 0.012 });
  }
}

function door(m: MB, z: number, frame: C2 = PALE) {
  m.box(0.74, 1.06, 0.2, [0x3b2112, 0x6a4020], { p: [0, 1.0, z] });
  m.cyl(0.37, 0.37, 0.2, 0x6a4020, { p: [0, 1.53, z], r: RING }, 12);
  m.torus(0.43, 0.075, frame, { p: [0, 1.5, z + 0.03], s: [1, 1.04, 1] }, 6, 16);
  m.sphere(0.05, GOLD[1], { p: [0.2, 1.05, z + 0.12] }, 6, 5);
}

function band(m: MB, r: number, y: number, col: C2 = GOLD, tube = 0.07) {
  m.torus(r, tube, col, { p: [0, y, 0], r: RING }, 6, 24);
}

function crenels(m: MB, r: number, y: number, n: number, col: C2, w = 0.5, h = 0.42) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + 0.2;
    m.box(w, h, 0.3, col, { p: [Math.cos(a) * r, y + h / 2, Math.sin(a) * r], r: facing(a), wobble: 0.01 });
  }
}

/** A timber fighting platform with a low palisade, which leaves the crew in clear view. */
function fightingDeck(m: MB, r: number, y: number) {
  const inner = r * 0.74;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + 0.31;
    m.box(0.2, 0.42, 0.56, TIMBER, { p: [Math.cos(a) * inner, y - 0.24, Math.sin(a) * inner], r: facing(a) });
  }
  m.cyl(r, r * 0.86, 0.3, TIMBER, { p: [0, y + 0.08, 0] }, 16);
  const planks = Math.round(r * 11);
  for (let i = 0; i < planks; i++) {
    const a = (i / planks) * Math.PI * 2;
    if (Math.abs(a - Math.PI * 1.25) < 0.25) continue;
    const tall = 0.42 + (i % 2) * 0.12;
    const col = i % 3 === 0 ? TIMBER_L : TIMBER;
    const px = Math.cos(a) * r * 0.92, pz = Math.sin(a) * r * 0.92;
    m.box(0.45, tall, 0.13, col, { p: [px, y + 0.2 + tall / 2, pz], r: facing(a) });
    m.cone(0.25, 0.2, col[1], { p: [px, y + 0.3 + tall, pz], s: [1, 1, 0.3], r: facing(a) }, 4);
  }
}

/** The tall capped turret that gives a tower its silhouette. Returns the height of its peak. */
function turret(m: MB, x: number, z: number, y: number, h: number, rh: number, roof: C2, body: C2 = PALE) {
  m.cyl(0.5, 0.6, h, body, { p: [x, y + h / 2 - 0.1, z], wobble: 0.02 }, 10, 2);
  m.box(0.14, 0.34, 0.1, 0x2a1810, { p: [x + 0.2, y + h - 0.55, z + 0.48], r: [0, 0.4, 0] });
  m.cyl(0.66, 0.56, 0.14, TIMBER, { p: [x, y + h - 0.08, z] }, 12);
  m.cone(0.86, rh, roof, { p: [x, y + h + rh / 2 - 0.04, z], wobble: 0.025 }, 12, 2);
  m.sphere(0.13, GOLD[1], { p: [x, y + h + rh + 0.02, z] }, 8, 6);
  return y + h + rh;
}

function flag(m: MB, x: number, z: number, y: number, col: C2, big = true) {
  m.cyl(0.04, 0.05, 1.5, 0x5a3b26, { p: [x, y + 0.7, z] }, 6);
  m.box(big ? 0.95 : 0.7, big ? 0.5 : 0.36, 0.04, col, { p: [x + (big ? 0.5 : 0.38), y + 1.1, z], wobble: 0.03, wobbleFreq: 3 });
}

/** Chunky storybook archer: oversized head, hood, and a big bow, built to read from the game camera. */
function archer(m: MB, x: number, z: number, tunic: C2, s = 1) {
  m.cyl(0.25 * s, 0.36 * s, 0.62 * s, tunic, { p: [x, 0.31 * s, z] }, 10);
  m.torus(0.28 * s, 0.045 * s, 0x5c3a1f, { p: [x, 0.3 * s, z], r: RING }, 5, 14);
  m.sphere(0.34 * s, SKIN, { p: [x, 0.9 * s, z] }, 14, 10);
  // The hood sits behind the face, leaving it visible from above.
  m.sphere(0.385 * s, tunic[1], { p: [x, 0.96 * s, z - 0.11 * s] }, 14, 10);
  m.cone(0.2 * s, 0.5 * s, tunic[1], { p: [x, 1.32 * s, z - 0.24 * s], r: [-0.7, 0, 0] }, 9);
  for (const sx of [-1, 1]) m.sphere(0.06 * s, INK, { p: [x + sx * 0.13 * s, 0.93 * s, z + 0.3 * s], s: [0.85, 1.25, 0.5] }, 8, 6);
  // A bold bow held out in front and to the side, clear of the head.
  const bx = x + 0.46 * s, by = 0.82 * s, bz = z + 0.34 * s;
  m.add(new THREE.TorusGeometry(0.72 * s, 0.085 * s, 6, 16, Math.PI), [0x9a5a28, 0xe2a050], { p: [bx, by, bz], r: [0, Math.PI / 2, Math.PI / 2] });
  m.cyl(0.018 * s, 0.018 * s, 1.44 * s, 0xfff4e0, { p: [bx, by, bz] }, 4);
  m.cyl(0.03 * s, 0.03 * s, 1.0 * s, 0xf5e6c8, { p: [bx, by, bz + 0.3 * s], r: RING }, 5);
  m.cone(0.07 * s, 0.2 * s, 0xdfe6f2, { p: [bx, by, bz + 0.86 * s], r: RING }, 5);
  m.sphere(0.11 * s, SKIN, { p: [bx, by, bz + 0.06 * s] }, 8, 6);
}

function buildRoost(level: number, branch: number): TowerModel {
  const m = new MB(); const head = new MB(); const headGlow = new MB();
  if (level < 2) {
    const up = level === 1;
    const h = up ? 2.75 : 2.05;
    foundation(m, 1.62);
    drum(m, 1.04, 1.28, 0.5, h, WARM);
    blocks(m, up ? 16 : 11, 1.28, 1.04, 0.62, h - 0.25, PALE);
    door(m, 1.24);
    const y = 0.5 + h;
    fightingDeck(m, 1.66, y);
    const peak = turret(m, -1.28, -1.0, y, up ? 2.1 : 1.5, up ? 1.9 : 1.5, [0xa92f22, 0xf2703a]);
    if (up) {
      band(m, 1.13, y - 0.62);
      flag(m, -1.28, -1.0, peak, [0xc9383a, 0xe85a4a]);
    } else {
      m.cone(0.2, 0.5, 0xe85a4a, { p: [-1.04, peak + 0.02, -1.0], r: [0, 0, -Math.PI / 2], s: [1, 1, 0.14] }, 4);
    }
    const tunic: C2 = [0x2f7a3f, 0x5cc268];
    if (up) {
      archer(head, -0.5, 0.24, tunic, 0.92);
      archer(head, 0.36, 0.24, tunic, 0.92);
    } else {
      archer(head, -0.12, 0.2, tunic, 1.08);
    }
    return { base: m.build(), head: head.build(), headY: y + 0.22, orbitY: 0, muzzleY: y + 1, height: peak, accent: 0xfff0c0 };
  }
  const big = level === 3;
  if (branch === 0) {
    // Hawkeye Aerie: a lone marksman on a tall blue-capped keep.
    const h = big ? 4.5 : 3.6;
    const blue: C2 = [0x1f4f9c, 0x4f9ce8];
    foundation(m, 1.6, ROCK);
    drum(m, 0.92, 1.26, 0.5, h, PALE);
    blocks(m, big ? 20 : 15, 1.26, 0.92, 0.62, h - 0.25, [0xb8ad9e, 0xf0e6d0]);
    door(m, 1.24, GOLD);
    const y = 0.5 + h;
    band(m, 1.0, y - 0.7);
    m.cyl(1.42, 0.98, 0.5, WARM, { p: [0, y, 0], wobble: 0.02 }, 14);
    crenels(m, 1.26, y + 0.22, 9, PALE);
    const peak = turret(m, -1.05, -0.95, y, big ? 2.4 : 1.9, big ? 2 : 1.6, blue);
    flag(m, -1.05, -0.95, peak, blue, big);
    if (big) {
      // Golden wings mounted on the keep.
      for (const sx of [-1, 1]) {
        for (let i = 0; i < 4; i++) {
          m.box(0.56 - i * 0.05, 0.14, 1.5 - i * 0.24, GOLD, { p: [sx * (1.16 + i * 0.3), y - 0.6 + i * 0.36, -0.1], r: [0.1, 0, sx * (0.65 + i * 0.16)] });
        }
      }
    }
    archer(head, -0.1, 0.1, blue, 1.35);
    headGlow.cone(0.11, 0.34, 0x8fd4ff, { p: [0.52, 1.11, 1.7], r: RING, gain: 2.6 }, 6);
    return { base: m.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.22, orbitY: 0, muzzleY: y + 1.2, height: peak, accent: 0x9fdcff };
  }
  // Volley Lodge: a broad, squat fort packed with archers.
  const h = big ? 2.2 : 1.7;
  const roof: C2 = [0xb3531c, 0xf49a3e];
  const tunic: C2 = [0x9a4a22, 0xe88a44];
  foundation(m, 1.86);
  drum(m, 1.42, 1.6, 0.5, h, WARM);
  blocks(m, big ? 16 : 12, 1.6, 1.42, 0.62, h - 0.25, PALE);
  door(m, 1.56);
  const y = 0.5 + h;
  fightingDeck(m, 2.0, y);
  const peak = turret(m, -1.62, -1.2, y, 1.4, 1.5, roof);
  if (big) {
    turret(m, 1.62, -1.2, y, 1.4, 1.5, roof);
    flag(m, -1.62, -1.2, peak, [0xd14b2d, 0xf07a44]);
    band(m, 1.52, y - 0.7);
  }
  const spots: [number, number][] = big
    ? [[-0.2, 0.95], [-1.0, 0.45], [0.75, 0.45], [-0.6, -0.5], [0.4, -0.5]]
    : [[-0.2, 0.75], [-0.95, 0.05], [0.7, 0.05]];
  for (const [x, z] of spots) archer(head, x, z, tunic, 0.82);
  return { base: m.build(), head: head.build(), headY: y + 0.22, orbitY: 0, muzzleY: y + 0.9, height: peak, accent: 0xffd9a0 };
}

function buildSpire(level: number, branch: number): TowerModel {
  const m = new MB(); const glow = new MB(); const orbit = new MB();
  const hasBranch = level >= 2;
  const storm = hasBranch && branch === 0;
  const frost = hasBranch && branch === 1;
  const big = level === 3;
  const crystal = storm ? 0x3f9cff : frost ? 0x62dcff : 0xa070ff;
  const crystalTip = storm ? 0xa8dcff : frost ? 0xb8f6ff : 0xdcc4ff;
  const body: C2 = storm ? [0x22346a, 0x5078c0] : frost ? [0x6fa5c7, 0xe2f6fc] : [0x4c3a8c, 0x9a82dc];
  const facing_: C2 = storm ? [0x34508e, 0x7ca0dc] : frost ? [0x9cc8dc, 0xffffff] : [0x6a55b0, 0xc4b0f0];
  const trim: C2 = storm ? [0x9a5a28, 0xe8a058] : frost ? [0xbfe6f2, 0xffffff] : GOLD;
  const gain = 1.5;
  const h = [2.2, 2.9, 3.5, 4.2][level];
  foundation(m, 1.55, frost ? [0x8aa9bb, 0xcfe4ec] : ROCK);
  drum(m, 0.84, 1.24, 0.5, h, body);
  blocks(m, 9 + level * 3, 1.24, 0.84, 0.62, h - 0.25, facing_);
  door(m, 1.2, trim);
  const y = 0.5 + h;
  band(m, 1.08, 1.1 + h * 0.2, trim);
  // A flared collar, with claws cupping the floating crystal.
  m.cyl(1.2, 0.84, 0.5, body, { p: [0, y, 0], wobble: 0.02 }, 14);
  band(m, 1.2, y + 0.24, trim, 0.09);
  const claws = level === 0 ? 3 : 4;
  for (let i = 0; i < claws; i++) {
    const a = (i / claws) * Math.PI * 2 + 0.5;
    m.crystal(0.34, 1.7, facing_, { p: [Math.cos(a) * 0.98, y + 0.85, Math.sin(a) * 0.98], r: [Math.sin(a) * 0.36, 0, -Math.cos(a) * 0.36], s: [0.8, 1, 0.8] });
    glow.box(0.1, 0.5, 0.1, crystal, { p: [Math.cos(a) * 1.0, y + 0.8, Math.sin(a) * 1.0], gain: gain * 0.6 });
  }
  const top = y + 1.75;
  orbit.crystal(level === 0 ? 0.56 : 0.68, level === 0 ? 1.5 : 1.85, [crystal, crystalTip], { gain });
  if (level >= 1) orbit.torus(1.0, 0.055, crystal, { r: [Math.PI / 2 - 0.3, 0, 0.2], gain: gain * 0.8 }, 5, 26);
  if (storm) {
    // Copper lightning rods.
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + 1;
      m.cyl(0.04, 0.09, 2, trim, { p: [Math.cos(a) * 1.3, y + 0.9, Math.sin(a) * 1.3], r: [Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22] }, 5);
      glow.sphere(0.12, 0x9fd8ff, { p: [Math.cos(a) * 1.52, y + 1.92, Math.sin(a) * 1.52], gain: 4 }, 7, 5);
    }
    if (big) {
      // A captive thunderhead.
      const cloud: C2 = [0x38447a, 0x8a9ad0];
      m.sphere(0.95, cloud, { p: [0, top + 1.5, 0], s: [1.3, 0.62, 1.3], wobble: 0.1, puff: 0.8 }, 14, 10);
      m.sphere(0.62, cloud, { p: [0.95, top + 1.42, 0.2], s: [1.2, 0.68, 1.2], wobble: 0.08, puff: 0.8 }, 12, 9);
      m.sphere(0.62, cloud, { p: [-0.9, top + 1.5, -0.2], s: [1.2, 0.68, 1.2], wobble: 0.08, puff: 0.8 }, 12, 9);
    }
  }
  if (frost) {
    // Spikes of ice bursting from the base.
    const n = big ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.3;
      const l = 1.3 + ((i * 7) % 5) * 0.32;
      m.crystal(0.34, l, [0x7cc4e4, 0xeafcff], { p: [Math.cos(a) * 1.5, 0.35 + l * 0.32, Math.sin(a) * 1.5], r: [Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5] });
    }
    if (big) {
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        orbit.crystal(0.2, 0.6, 0xbff5ff, { p: [Math.cos(a) * 1.3, 0, Math.sin(a) * 1.3], gain: 2.5 });
      }
    }
  }
  return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitInk: true, orbitY: top, headY: 0, muzzleY: top, height: top + (storm && big ? 2 : 1), accent: crystal };
}

function buildMortar(level: number, branch: number): TowerModel {
  const m = new MB(); const head = new MB(); const headGlow = new MB(); const glow = new MB();
  const big = level === 3;
  const dragon = level >= 2 && branch === 0;
  const keg = level >= 2 && branch === 1;
  const hh = [1.1, 1.4, 1.65, 1.95][level];
  const r = level === 0 ? 1.5 : 1.65;
  const wall: C2 = dragon ? [0x44282a, 0x8c5244] : WARM;
  const facing_: C2 = dragon ? [0x5c3630, 0xa86a50] : PALE;
  foundation(m, r + 0.28);
  drum(m, r, r + 0.12, 0.5, hh, wall);
  blocks(m, 10 + level * 2, r + 0.12, r, 0.62, hh - 0.2, facing_);
  door(m, r + 0.08, dragon ? [0x6a3a28, 0xc8703c] : PALE);
  const y = 0.5 + hh;
  band(m, r + 0.03, y - 0.26, IRON, 0.1);
  crenels(m, r - 0.04, y - 0.04, 9, facing_, 0.58, 0.5);
  m.cyl(r - 0.28, r - 0.28, 0.1, [0x4a3a30, 0x6a5444], { p: [0, y + 0.02, 0] }, 14);
  // Shells stacked on the rampart.
  if (!dragon && !keg) {
    for (const [x, z, sy] of [[-0.92, -0.6, 0.27], [-0.62, -0.92, 0.27], [-0.84, -0.9, 0.62]]) m.sphere(0.25, IRON, { p: [x, y + sy, z] }, 9, 7);
  }
  if (level < 2) {
    const len = level === 0 ? 1.75 : 2.05;
    const rad = level === 0 ? 0.56 : 0.66;
    const tilt = 0.72;
    const cy = (d: number) => 0.3 + Math.cos(tilt) * d;
    const cz = (d: number) => Math.sin(tilt) * d;
    // A squat barrel on a stout wooden cradle.
    head.box(1.5, 0.36, 1.4, TIMBER, { p: [0, 0.16, 0], wobble: 0.01 });
    for (const sx of [-1, 1]) head.cyl(0.32, 0.32, 0.14, TIMBER_L, { p: [sx * 0.78, 0.22, 0], r: [0, 0, Math.PI / 2] }, 10);
    head.sphere(rad * 1.14, IRON, { p: [0, 0.36, 0] }, 12, 9);
    head.cyl(rad, rad * 1.1, len, IRON, { p: [0, cy(len * 0.42), cz(len * 0.42)], r: [tilt, 0, 0] }, 14);
    head.torus(rad * 1.06, 0.1, GOLD, { p: [0, cy(len * 0.84), cz(len * 0.84)], r: [Math.PI / 2 + tilt, 0, 0] }, 6, 16);
    head.torus(rad * 1.1, 0.07, GOLD, { p: [0, cy(len * 0.2), cz(len * 0.2)], r: [Math.PI / 2 + tilt, 0, 0] }, 6, 16);
    headGlow.cyl(rad * 0.72, rad * 0.72, 0.04, 0xe8541a, { p: [0, cy(len * 0.92), cz(len * 0.92)], r: [tilt, 0, 0], gain: 1.2 }, 14);
    return { base: m.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.1, orbitY: 0, muzzleY: y + 1.5, height: y + 2, accent: 0xff9338 };
  }
  if (dragon) {
    // Dragonmaw: a horned iron dragon's head with a fire in its throat.
    const s = big ? 1.5 : 1.25;
    const scale: C2 = [0x33202a, 0x8a4f40];
    const bone: C2 = [0x8a7050, 0xf0e0b8];
    head.sphere(0.76 * s, scale, { p: [0, 0.55 * s, 0], s: [1, 0.9, 1.2], wobble: 0.03 }, 14, 10);
    head.box(0.96 * s, 0.34 * s, 1.15 * s, scale, { p: [0, 0.86 * s, 0.88 * s], r: [-0.45, 0, 0], wobble: 0.02 });
    head.box(0.82 * s, 0.2 * s, 0.98 * s, scale, { p: [0, 0.32 * s, 0.86 * s], r: [0.15, 0, 0], wobble: 0.015 });
    for (const sx of [-1, 1]) {
      head.cone(0.2 * s, 1.15 * s, bone, { p: [sx * 0.46 * s, 1.34 * s, -0.42 * s], r: [-0.85, 0, sx * -0.3] }, 8);
      // Eyes stand on brow ridges so they read from above.
      head.sphere(0.23 * s, scale[0], { p: [sx * 0.38 * s, 1.12 * s, 0.42 * s] }, 9, 7);
      headGlow.sphere(0.13 * s, 0xffc23e, { p: [sx * 0.42 * s, 1.17 * s, 0.56 * s], gain: 4.5 }, 8, 6);
      for (let i = 0; i < 2; i++) head.cone(0.07 * s, 0.26 * s, bone[1], { p: [sx * (0.3 - i * 0.2) * s, 0.5 * s, 1.26 * s], r: [Math.PI, 0, 0] }, 5);
    }
    headGlow.sphere(0.34 * s, 0xff6a1e, { p: [0, 0.58 * s, 1.14 * s], gain: 4.5, s: [1, 0.55, 0.8] }, 10, 7);
    if (big) {
      for (let i = 0; i < 3; i++) {
        const a = i * 2.1 + 0.5 + Math.PI;
        const x = Math.cos(a) * (r - 0.1), z = Math.sin(a) * (r - 0.1);
        m.cyl(0.3, 0.38, 1.5, IRON, { p: [x, y + 0.7, z] }, 10);
        glow.cyl(0.22, 0.22, 0.04, 0xff7a24, { p: [x, y + 1.47, z], gain: 4 }, 10);
      }
    }
    return { base: m.build(), glow: glow.empty ? undefined : glow.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.05, orbitY: 0, muzzleY: y + 1.1 * s, height: y + 2.4, accent: 0xff7a24 };
  }
  // Thunderkeg: an enormous banded barrel of blasting powder.
  const s = big ? 1.42 : 1.15;
  const wood: C2 = [0x6d3f1c, 0xc28440];
  const tilt = 0.72;
  const cy = 0.5 + 0.62 * s, cz = 0.25 * s;
  head.box(1.7 * s, 0.32, 1.5 * s, TIMBER, { p: [0, 0.2, 0.1] });
  head.cyl(0.72 * s, 0.78 * s, 1.6 * s, wood, { p: [0, cy, cz], r: [tilt, 0, 0], wobble: 0.015 }, 14, 3);
  for (const k of [-0.5, 0, 0.5]) {
    const d = k * 1.6 * s * 0.72;
    head.torus(0.79 * s, 0.085, IRON, { p: [0, cy + Math.cos(tilt) * d, cz + Math.sin(tilt) * d], r: [Math.PI / 2 + tilt, 0, 0] }, 6, 18);
  }
  headGlow.cyl(0.54 * s, 0.54 * s, 0.05, 0xffe08a, { p: [0, cy + Math.cos(tilt) * 0.82 * s, cz + Math.sin(tilt) * 0.82 * s], r: [tilt, 0, 0], gain: 2.8 }, 14);
  for (let i = 0; i < (big ? 4 : 2); i++) {
    const a = 2.2 + i * 1.12;
    const x = Math.cos(a) * (r - 0.3), z = Math.sin(a) * (r - 0.3);
    m.cyl(0.36, 0.4, 0.8, wood, { p: [x, y + 0.38, z] }, 10);
    m.torus(0.39, 0.05, IRON, { p: [x, y + 0.38, z], r: RING }, 5, 12);
    glow.sphere(0.07, 0xffc23e, { p: [x, y + 0.92, z], gain: 4 }, 6, 5);
  }
  return { base: m.build(), glow: glow.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.05, orbitY: 0, muzzleY: y + 1.7, height: y + 2.6, accent: 0xffd166 };
}

function buildShrine(level: number, branch: number): TowerModel {
  const m = new MB(); const glow = new MB(); const orbit = new MB();
  const stones = level === 0 ? 4 : 6;
  const r = 1.34;
  const thorn = level >= 2 && branch === 1;
  const rune = thorn ? 0x8cff5e : 0x6effc8;
  // A grassy mound topped with a ring of big standing stones.
  m.cyl(1.5, 1.82, 0.5, [0x4f8a38, 0x8cc850], { p: [0, 0.25, 0], wobble: 0.05 }, 16);
  m.cyl(1.1, 1.2, 0.14, ROCK, { p: [0, 0.54, 0], wobble: 0.03 }, 14);
  for (let i = 0; i < stones; i++) {
    const a = (i / stones) * Math.PI * 2 + 0.3;
    const h = 1.5 + ((i * 3) % 4) * 0.28;
    m.box(0.62, h, 0.42, WARM, { p: [Math.cos(a) * r, 0.4 + h / 2, Math.sin(a) * r], r: [0.04, -a + Math.PI / 2, 0.05], wobble: 0.04 });
    m.box(0.7, 0.2, 0.5, PALE, { p: [Math.cos(a) * r, 0.42 + h, Math.sin(a) * r], r: [0, -a + Math.PI / 2, 0], wobble: 0.02 });
    glow.box(0.14, h * 0.5, 0.05, rune, { p: [Math.cos(a) * (r + 0.22), 0.45 + h / 2, Math.sin(a) * (r + 0.22)], r: [0, -a + Math.PI / 2, 0], gain: 2.3 });
  }
  if (level < 2) {
    // A glowing sapling with a big soft crown.
    const th = level === 0 ? 1.5 : 2;
    const leaf: C2 = [0x1a8a48, 0x62e070];
    m.cyl(0.14, 0.26, th, TIMBER, { p: [0, 0.5 + th / 2, 0], wobble: 0.02 }, 8);
    m.sphere(0.95, leaf, { p: [0, 0.75 + th, 0], s: [1, 0.86, 1], wobble: 0.08, puff: 0.7 }, 14, 10);
    m.sphere(0.56, leaf, { p: [0.68, 0.48 + th, 0.16], wobble: 0.05, puff: 0.7 }, 12, 9);
    m.sphere(0.56, leaf, { p: [-0.62, 0.52 + th, -0.2], wobble: 0.05, puff: 0.7 }, 12, 9);
    for (let i = 0; i < 6; i++) {
      const a = i * 1.2;
      orbit.sphere(0.075, 0xc6ffdf, { p: [Math.cos(a) * 1.2, Math.sin(i * 2) * 0.35, Math.sin(a) * 1.2], gain: 4 }, 6, 4);
    }
    return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitY: 0.7 + th, headY: 0, muzzleY: 1.8, height: 1.7 + th, accent: 0x6effc8 };
  }
  const big = level === 3;
  if (branch === 0) {
    // Sunwell: a golden basin with a little sun floating above.
    m.lathe([[0.12, 0.5], [0.48, 0.7], [0.42, 1.2], [1.0, 1.55], [1.16, 1.75], [1.0, 1.7], [0, 1.55]], GOLD, {}, 18);
    glow.cyl(1.0, 1.0, 0.03, 0xffc23e, { p: [0, 1.68, 0], gain: 1.2 }, 18);
    orbit.sphere(big ? 0.72 : 0.56, [0xff8a14, 0xffd84a], { gain: 1.6 }, 16, 12);
    const rays = big ? 8 : 5;
    const rr = big ? 1.12 : 0.92;
    for (let i = 0; i < rays; i++) {
      const a = (i / rays) * Math.PI * 2;
      orbit.crystal(0.13, 0.66, 0xffc23e, { p: [Math.cos(a) * rr, 0, Math.sin(a) * rr], r: [Math.sin(a) * Math.PI / 2, 0, -Math.cos(a) * Math.PI / 2], gain: 2.6 });
    }
    return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitInk: true, orbitY: big ? 3.3 : 2.9, headY: 0, muzzleY: 2.7, height: big ? 4.4 : 3.8, accent: 0xffd15c };
  }
  // Thornroot: twisted roots wrapped around a green heart.
  const coil = big ? 7 : 5;
  const h = big ? 3.5 : 2.8;
  for (let i = 0; i < coil; i++) {
    const a = (i / coil) * Math.PI * 2;
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 1.4, 0.3, Math.sin(a) * 1.4),
      new THREE.Vector3(Math.cos(a + 0.7) * 0.86, h * 0.34, Math.sin(a + 0.7) * 0.86),
      new THREE.Vector3(Math.cos(a + 1.4) * 0.56, h * 0.68, Math.sin(a + 1.4) * 0.56),
      new THREE.Vector3(Math.cos(a + 2.2) * 0.3, h, Math.sin(a + 2.2) * 0.3),
    ]);
    m.add(new THREE.TubeGeometry(path, 12, 0.22 - i * 0.006, 7), [0x4a2e1a, 0x8c5e34]);
    for (let k = 1; k < 4; k++) {
      const pt = path.getPoint(k / 4);
      m.cone(0.1, 0.5, 0xe0cf9c, { p: [pt.x * 1.25, pt.y, pt.z * 1.25], r: [Math.sin(a + k) * 1.2, 0, -Math.cos(a + k) * 1.2] }, 5);
    }
  }
  orbit.ico(big ? 0.68 : 0.54, [0x3cc42c, 0x9cf05c], { gain: 1.5 }, 1);
  return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitInk: true, orbitY: h * 0.74, headY: 0, muzzleY: 2, height: h + 0.8, accent: 0x8cff5e };
}

function buildSunforge(level: number, branch: number): TowerModel {
  const m = new MB(); const head = new MB(); const headGlow = new MB(); const glow = new MB();
  const h = 1.5 + level * 0.42;
  foundation(m, 1.6);
  drum(m, 1.02, 1.28, 0.5, h, PALE);
  blocks(m, 9 + level * 2, 1.28, 1.02, 0.62, h - 0.2, [0xbcb09c, 0xf4ead4]);
  door(m, 1.24, GOLD);
  const y = 0.5 + h;
  band(m, 1.16, 0.9 + h * 0.3, BRONZE);
  // A bronze crown of fins, each with a molten seam.
  m.cyl(1.24, 1.02, 0.42, BRONZE, { p: [0, y, 0] }, 14);
  band(m, 1.24, y + 0.2, GOLD, 0.09);
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2;
    m.box(0.3, 0.92, 0.2, GOLD, { p: [Math.cos(a) * 1.05, y + 0.6, Math.sin(a) * 1.05], r: [Math.sin(a) * 0.2, -a + Math.PI / 2, -Math.cos(a) * 0.2] });
    glow.box(0.1, 0.58, 0.05, 0xffb347, { p: [Math.cos(a) * 1.18, y + 0.6, Math.sin(a) * 1.18], r: [0, -a + Math.PI / 2, 0], gain: 3 });
  }
  // Head: a gimbal holding the lens.
  const yoke = 1.14;
  const py = yoke + 0.2;
  head.add(new THREE.TorusGeometry(yoke, 0.12, 7, 28), GOLD, { p: [0, py, 0] });
  head.cyl(0.18, 0.28, 0.5, BRONZE, { p: [0, 0.1, 0] }, 10);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    head.cone(0.12, 0.4, GOLD[1], { p: [Math.cos(a) * (yoke + 0.26), py + Math.sin(a) * (yoke + 0.26), 0], r: [0, 0, a - Math.PI / 2] }, 5);
  }
  let accent = 0xffc14a;
  if (level >= 2 && branch === 0) {
    // Prism Core: a great shard ringed with smaller ones.
    accent = 0xfff0a0;
    const big = level === 3;
    headGlow.crystal(0.68, big ? 2.1 : 1.7, [0xff9a1e, 0xffe07a], { p: [0, py, 0], gain: 1.5 });
    const n = big ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      head.crystal(0.24, 0.8, [0xffcf6b, 0xfff6c8], { p: [Math.cos(a) * 0.86, py + Math.sin(a) * 0.86, 0], r: [0, 0, a] });
    }
  } else if (level >= 2) {
    // Solar Lance: a long-barreled lance fed by the lens.
    accent = 0xff8a3c;
    const big = level === 3;
    const len = big ? 3.6 : 2.9;
    head.cyl(0.26, 0.46, len, BRONZE, { p: [0, py, len / 2 - 0.5], r: RING }, 12);
    for (let i = 0; i < 3; i++) head.torus(0.5 - i * 0.07, 0.09, GOLD, { p: [0, py, -0.2 + (i * len) / 3.4] }, 6, 18);
    headGlow.sphere(0.32, 0xffa44f, { p: [0, py, len - 0.5], gain: 4 }, 11, 8);
    headGlow.cyl(yoke * 0.7, yoke * 0.7, 0.08, [0xff9a1e, 0xffd860], { p: [0, py, -0.25], r: RING, gain: 1.5 }, 20);
  } else {
    headGlow.cyl(yoke * 0.9, yoke * 0.9, 0.1, [0xff9a1e, 0xffd860], { p: [0, py, 0.04], r: RING, gain: 1.4 + level * 0.15 }, 22);
  }
  return { base: m.build(), glow: glow.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.32, orbitY: 0, muzzleY: y + py + 0.32, height: y + py + 1.7, accent };
}

function buildBallista(level: number, branch: number): TowerModel {
  const m = new MB(); const head = new MB(); const headGlow = new MB();
  const harpoon = level >= 2 && branch === 0;
  const repeater = level >= 2 && branch === 1;
  const hh = [1.0, 1.3, 1.5, 1.8][level];
  const r = 1.5 + level * 0.06;
  foundation(m, r + 0.28);
  drum(m, r, r + 0.12, 0.5, hh, TIMBER);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + 0.2;
    m.box(0.16, hh + 0.1, 0.1, IRON, { p: [Math.cos(a) * (r + 0.08), 0.5 + hh / 2, Math.sin(a) * (r + 0.08)], r: facing(a) });
  }
  door(m, r + 0.06, BRONZE);
  const y = 0.5 + hh;
  band(m, r + 0.04, y - 0.2, IRON, 0.11);
  m.cyl(r + 0.1, r, 0.22, TIMBER_L, { p: [0, y + 0.04, 0] }, 16);
  const s = 1 + level * 0.14;
  // The turntable and a long stock aimed forward.
  head.cyl(0.9 * s, 1 * s, 0.26, IRON, { p: [0, 0.14, 0] }, 14);
  head.box(0.54 * s, 0.34, 2.9 * s, TIMBER, { p: [0, 0.5, 0.4 * s], wobble: 0.01 });
  // Great bow arms sweeping back from the front of the stock.
  const span = (repeater ? 1.2 : 1.55) * s;
  for (const side of [-1, 1]) {
    head.box(span, 0.2, 0.26, harpoon ? IRON : TIMBER_L, { p: [side * span * 0.5, 0.58, 1.34 * s - 0.1 - 0.16 * s], r: [0, side * 0.3, 0] });
    head.cone(0.1, 0.42, GOLD, { p: [side * (span + 0.08), 0.58, 0.92 * s], r: [0, 0, side * -Math.PI / 2] }, 6);
    head.cyl(0.012, 0.012, 1.45 * s, 0xfff4d6, { p: [side * span * 0.5, 0.62, 0.42 * s], r: [Math.PI / 2, 0, side * -1.08] }, 4);
  }
  if (repeater) {
    // A tall magazine box of spare bolts, doubled at the top tier.
    const n = level === 3 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const x = n === 1 ? 0 : (i - 0.5) * 0.66;
      head.box(0.56, 0.96, 1, TIMBER_L, { p: [x, 1.14, -0.05] });
      head.box(0.62, 0.1, 1.06, IRON, { p: [x, 1.62, -0.05] });
      for (let j = 0; j < 3; j++) head.cone(0.05, 0.3, 0xdfe4f0, { p: [x + (j - 1) * 0.15, 1.8, 0.2], r: [0, 0, 0] }, 5);
    }
    head.cyl(0.08, 0.08, 0.86, IRON, { p: [0, 0.92, -0.75], r: [0, 0, Math.PI / 2] }, 6);
  } else {
    // The bolt itself, oversized and bright-tipped.
    const len = harpoon ? 3.6 * s : 2.9 * s;
    head.cyl(0.08 * s, 0.08 * s, len, 0x9c6631, { p: [0, 0.76, 0.6 * s], r: RING }, 6);
    head.cone(0.2 * s, 0.56 * s, harpoon ? GOLD : IRON, { p: [0, 0.76, 0.6 * s + len / 2 + 0.2 * s], r: RING }, 6);
    if (harpoon) {
      for (const side of [-1, 1]) head.cone(0.08 * s, 0.42 * s, GOLD, { p: [side * 0.2 * s, 0.76, 0.42 * s + len / 2], r: [-Math.PI / 2, 0, 0] }, 5);
      // A coil of chain at the back.
      for (let i = 0; i < 3; i++) head.torus(0.34 * s, 0.05, IRON, { p: [0, 0.42 + i * 0.1, -0.8 * s], r: RING }, 5, 12);
    }
  }
  headGlow.sphere(0.06, 0xff9a3c, { p: [0, 0.3, -0.6], gain: 2 }, 5, 4);
  return { base: m.build(), head: head.build(), headGlow: headGlow.build(), headY: y + 0.15, orbitY: 0, muzzleY: y + 1.1, height: y + 2.1, accent: harpoon ? 0xffd36b : 0xffb07a };
}

function buildBlightwell(level: number, branch: number): TowerModel {
  const m = new MB(); const glow = new MB(); const orbit = new MB();
  const censer = level >= 2 && branch === 0;
  const fang = level >= 2 && branch === 1;
  const big = level === 3;
  const r = 1.45 + level * 0.07;
  const mossRock: C2 = [0x3c4a34, 0x7a8c5c];
  foundation(m, r + 0.32, mossRock);
  // The well: a mossy ring of stones around a sick green pool.
  const hh = [0.75, 0.95, 1.1, 1.3][level];
  drum(m, r, r + 0.1, 0.5, hh, mossRock);
  blocks(m, 11 + level * 2, r + 0.1, r, 0.6, hh - 0.14, ROCK);
  const y = 0.5 + hh;
  m.torus(r - 0.06, 0.2, mossRock, { p: [0, y, 0], r: RING, wobble: 0.03 }, 6, 20);
  glow.cyl(r - 0.2, r - 0.2, 0.06, [0x4f9a22, 0xa8f04c], { p: [0, y - 0.02, 0], gain: 2 }, 18);
  if (censer) {
    // A great hanging censer on a gallows, leaking poison.
    const h = big ? 3.6 : 3;
    for (const a of [0.9, 0.9 + (Math.PI * 2) / 3, 0.9 + (Math.PI * 4) / 3]) {
      m.cyl(0.11, 0.15, h, TIMBER, { p: [Math.cos(a) * (r - 0.28) * 0.72, y + h / 2 - 0.1, Math.sin(a) * (r - 0.28) * 0.72], r: [Math.sin(a) * 0.22, 0, -Math.cos(a) * 0.22] }, 7);
    }
    m.cyl(0.24, 0.24, 0.16, IRON, { p: [0, y + h, 0] }, 9);
    m.lathe([[0.1, 0], [0.56, 0.2], [0.62, 0.66], [0.3, 0.96], [0, 1.02]], BRONZE, { p: [0, y + h - 1.52, 0] }, 12);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      glow.sphere(0.1, 0xc8ff5a, { p: [Math.cos(a) * 0.54, y + h - 1.05, Math.sin(a) * 0.54], gain: 3.4 }, 6, 5);
    }
    orbit.ico(0.17, [0x8dff3f, 0xe6ffb0], { p: [0.82, 0, 0], gain: 2.8 }, 0);
    orbit.ico(0.13, [0x8dff3f, 0xe6ffb0], { p: [-0.42, 0.24, 0.7], gain: 2.8 }, 0);
    orbit.ico(0.15, [0x8dff3f, 0xe6ffb0], { p: [-0.42, -0.2, -0.7], gain: 2.8 }, 0);
    return { base: m.build(), glow: glow.build(), orbit: orbit.build(), headY: 0, orbitY: y + h - 1.05, muzzleY: y + h - 0.8, height: y + h + 0.4, accent: 0xa8f04c };
  }
  if (fang) {
    // A ring of huge curved fangs rising out of the well, and a dripping heart.
    const n = big ? 6 : 4;
    const h = big ? 2.9 : 2.3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + 0.4;
      m.cone(0.34, h, [0xbda877, 0xfbf1d4], { p: [Math.cos(a) * (r - 0.34), y + h / 2 - 0.05, Math.sin(a) * (r - 0.34)], r: [Math.sin(a) * 0.32, 0, -Math.cos(a) * 0.32] }, 8);
    }
    orbit.ico(big ? 0.56 : 0.44, [0x6ad01e, 0xe6ff90], { gain: 2.8 }, 1);
    return { base: m.build(), glow: glow.build(), orbit: orbit.build(), orbitInk: true, headY: 0, orbitY: y + (big ? 1.5 : 1.2), muzzleY: y + 1.5, height: y + h + 0.3, accent: 0xc8ff5a };
  }
  // A plain crooked well-frame with a bucket, and bubbles in the pool.
  const fh = 1.5 + level * 0.3;
  for (const s of [-1, 1]) m.cyl(0.1, 0.14, fh, TIMBER, { p: [s * (r - 0.18), y + fh / 2 - 0.08, 0], r: [0, 0, s * 0.06] }, 7);
  m.cyl(0.075, 0.075, r * 2 + 0.2, TIMBER_L, { p: [0, y + fh - 0.1, 0], r: [0, 0, Math.PI / 2] }, 7);
  m.cone(r + 0.42, 0.72, [0x3c4a34, 0x6a8a4c], { p: [0, y + fh + 0.3, 0], s: [1, 1, 0.6], wobble: 0.03 }, 8);
  m.cyl(0.26, 0.2, 0.34, BRONZE, { p: [0.25, y + 0.62, 0] }, 9);
  m.cyl(0.012, 0.012, fh - 0.86, 0x3b2112, { p: [0.25, y + fh / 2 + 0.34, 0] }, 4);
  orbit.ico(0.15, [0x8dff3f, 0xe6ffb0], { p: [0.5, 0, 0], gain: 2.6 }, 0);
  orbit.ico(0.1, [0x8dff3f, 0xe6ffb0], { p: [-0.4, 0.15, 0.4], gain: 2.6 }, 0);
  return { base: m.build(), glow: glow.build(), orbit: orbit.build(), headY: 0, orbitY: y + 0.36, muzzleY: y + 0.8, height: y + fh + 0.8, accent: 0x8dff3f };
}

function buildThunderbell(level: number, branch: number): TowerModel {
  const m = new MB(); const head = new MB(); const glow = new MB(); const headGlow = new MB();
  const carillon = level >= 2 && branch === 1;
  const cathedral = level >= 2 && branch === 0;
  const big = level === 3;
  const r = 1.45 + level * 0.08;
  const wall: C2 = carillon ? PALE : WARM;
  const metal: C2 = carillon ? [0x8fa0c0, 0xf4f8ff] : [0x8a5a24, 0xf0b850];
  foundation(m, r + 0.3);
  const hh = [1.4, 1.75, 2.1, 2.5][level];
  drum(m, r, r + 0.14, 0.5, hh, wall);
  blocks(m, 10 + level * 2, r + 0.12, r, 0.6, hh - 0.2, PALE);
  door(m, r + 0.08);
  const y = 0.5 + hh;
  band(m, r + 0.03, y - 0.1, carillon ? [0x8fa0c0, 0xf4f8ff] : GOLD, 0.09);
  // An open belfry: four pillars under a peaked roof.
  const bh = 1.9 + level * 0.25;
  const pr = r - 0.3;
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
    m.cyl(0.17, 0.2, bh, PALE, { p: [Math.cos(a) * pr, y + bh / 2, Math.sin(a) * pr] }, 8);
  }
  m.cyl(r + 0.08, r + 0.08, 0.2, wall, { p: [0, y + bh + 0.08, 0] }, 14);
  const roofCol: C2 = carillon ? [0x34508a, 0x7fb0e8] : [0x7a2e24, 0xd0603c];
  m.cone(r + 0.44, 1.5 + level * 0.2, roofCol, { p: [0, y + bh + 0.92 + level * 0.1, 0], wobble: 0.02 }, 10);
  m.sphere(0.14, GOLD[1], { p: [0, y + bh + 1.86 + level * 0.2, 0] }, 7, 6);
  // The bell swings with the recoil of each toll, because it's the tower's head.
  const belly = cathedral ? 1.02 + (big ? 0.2 : 0) : 0.72 + level * 0.06;
  const bell = (x: number, z: number, k: number) => {
    head.lathe([[0.12 * k, 0.52], [0.26 * k, 0.46], [0.42 * k, 0.1], [0.58 * k, -0.42], [0.82 * k, -0.84], [0.76 * k, -0.9], [0.48 * k, -0.74]], metal, { p: [x, -0.05, z] }, 18);
    head.torus(0.78 * k, 0.05 * k, GOLD, { p: [x, -0.87, z], r: RING }, 5, 18);
    head.sphere(0.16 * k, IRON, { p: [x, -0.92, z] }, 7, 6);
    headGlow.cyl(0.42 * k, 0.42 * k, 0.03, carillon ? 0xc2a6ff : 0xffb86b, { p: [x, -0.72, z], gain: 2.4 }, 14);
  };
  if (carillon) {
    // A ring of small silver bells around a larger one.
    bell(0, 0, 0.62 + (big ? 0.1 : 0));
    const n = big ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      bell(Math.cos(a) * 0.66, Math.sin(a) * 0.66, 0.34);
    }
  } else {
    bell(0, 0, belly);
    if (cathedral) band(m, r - 0.1, y + bh * 0.2, GOLD, 0.06);
  }
  m.cyl(0.08, 0.08, pr * 1.8, IRON, { p: [0, y + bh - 0.12, 0], r: [0, 0, Math.PI / 2] }, 6);
  if (big) glow.torus(r + 0.12, 0.05, carillon ? 0xc2a6ff : 0xffb86b, { p: [0, y + 0.1, 0], r: RING, gain: 2.4 }, 5, 26);
  return { base: m.build(), head: head.build(), headGlow: headGlow.build(), glow: glow.empty ? undefined : glow.build(), headY: y + bh - 0.4, orbitY: 0, muzzleY: y + bh * 0.4, height: y + bh + 2, accent: carillon ? 0xc2a6ff : 0xffb86b };
}

function buildBarracks(level: number, branch: number): TowerModel {
  const m = new MB(); const glow = new MB();
  const knights = level >= 2 && branch === 0;
  const zealots = level >= 2 && branch === 1;
  const big = level === 3;
  const w = 2.2 + level * 0.14;
  const wall: C2 = zealots ? [0x4a2a24, 0xa06a4c] : PALE;
  const roof: C2 = zealots ? [0x5a1f14, 0xd8562a] : knights ? [0x2a3f70, 0x5a8fd0] : [0x6a3a20, 0xb46a3c];
  foundation(m, w + 0.18);
  const hh = 1.5 + level * 0.28;
  // A long timber-framed hall with a steep roof.
  m.box(w * 1.5, hh, w * 1.2, wall, { p: [0, 0.5 + hh / 2, 0], wobble: 0.015 });
  for (const sx of [-1, 1]) {
    m.box(0.16, hh, 0.16, TIMBER, { p: [sx * w * 0.75, 0.5 + hh / 2, w * 0.61] });
    m.box(0.16, hh, 0.16, TIMBER, { p: [sx * w * 0.75, 0.5 + hh / 2, -w * 0.61] });
  }
  m.box(w * 1.52, 0.16, 0.16, TIMBER, { p: [0, 0.5 + hh, w * 0.61] });
  door(m, w * 0.62, zealots ? [0x6a3a28, 0xc8703c] : PALE);
  const y = 0.5 + hh;
  const rh = 1.25 + level * 0.12;
  for (const s of [-1, 1]) m.box(w * 1.72, 0.16, w * 0.92, roof, { p: [0, y + rh / 2, s * w * 0.34], r: [s * 0.88, 0, 0], wobble: 0.012 });
  m.box(w * 1.74, 0.16, 0.2, TIMBER, { p: [0, y + rh + 0.02, 0] });
  // Gable ends.
  for (const s of [-1, 1]) m.cone(w * 0.68, rh * 1.02, wall, { p: [s * w * 0.74, y + rh * 0.5 - 0.02, 0], s: [0.1, 1, 1] }, 4);
  // The Lantern's own flag, and a rack of spears out front.
  flag(m, w * 0.62, -w * 0.3, y + rh * 0.5, roof, true);
  for (let i = 0; i < 3 + level; i++) {
    m.cyl(0.03, 0.03, 1.5, TIMBER_L, { p: [-w * 0.72 + i * 0.26, 1.2, w * 0.76], r: [-0.14, 0, 0] }, 5);
    m.cone(0.06, 0.2, 0xdfe4f0, { p: [-w * 0.72 + i * 0.26, 2.0, w * 0.87] }, 5);
  }
  const lantern = zealots ? 0xff7a24 : 0xffd36b;
  glow.sphere(0.2, lantern, { p: [w * 0.5, 1.75, w * 0.68], gain: 3.6 }, 8, 6);
  if (knights) {
    // Heavy keep towers at the corners of the hall.
    const n = big ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const x = (i === 0 ? -1 : 1) * w * 0.7;
      turret(m, x, -w * 0.5, 0.5, hh + 1 + (big ? 0.5 : 0), 1.1, roof, WARM);
    }
    glow.box(0.5, 0.6, 0.04, 0xbfe0ff, { p: [0, y - 0.3, w * 0.62], gain: 2 });
  }
  if (zealots) {
    // Braziers burn on either side of the door.
    for (const s of [-1, 1]) {
      m.cyl(0.08, 0.12, 1.2, IRON, { p: [s * 1.2, 1.1, w * 0.86] }, 6);
      m.cyl(0.3, 0.14, 0.28, IRON, { p: [s * 1.2, 1.78, w * 0.86] }, 8);
      glow.cone(0.24, big ? 0.9 : 0.6, [0xff6a1e, 0xffd25a], { p: [s * 1.2, big ? 2.34 : 2.2, w * 0.86], gain: 3.8 }, 7);
    }
  }
  return { base: m.build(), glow: glow.build(), headY: 0, orbitY: 0, muzzleY: y + 0.5, height: y + rh + 1, accent: lantern };
}

export function inkTowerModel(type: TowerId, level: number, branch: number): TowerModel {
  switch (type) {
    case 'roost': return buildRoost(level, branch);
    case 'spire': return buildSpire(level, branch);
    case 'mortar': return buildMortar(level, branch);
    case 'shrine': return buildShrine(level, branch);
    case 'sunforge': return buildSunforge(level, branch);
    case 'ballista': return buildBallista(level, branch);
    case 'blightwell': return buildBlightwell(level, branch);
    case 'thunderbell': return buildThunderbell(level, branch);
    case 'barracks': return buildBarracks(level, branch);
  }
}
