// Creature models for the inked storybook style: big heads, readable faces, and exaggerated shapes.
import * as THREE from 'three';
import type { EnemyId } from '../data/enemies';
import type { HumanoidGeo, PartAnim, Rig, RigPart } from './creature-models';
import { MB } from './mb';

type C2 = [number, number];
type V3 = [number, number, number];

const RING: V3 = [Math.PI / 2, 0, 0];
const PUPIL = 0x180a10;
const FANG = 0xfff6e0;
const BONE: C2 = [0xbda877, 0xfbf1d4];

function P(anim: PartAnim, pivot: V3, m: MB, glow = false): RigPart {
  const geo = m.build();
  geo.translate(-pivot[0], -pivot[1], -pivot[2]);
  return { geo, glow, anim, pivot };
}

function PL(anim: PartAnim, pivot: V3, m: MB, glow = false): RigPart {
  return { geo: m.build(), glow, anim, pivot };
}

function legs(a: V3[], col: C2, len: number, rad: number) {
  const m = new MB();
  for (const [x, y, z] of a) {
    m.cyl(rad, rad * 0.8, len, col, { p: [x, y - len / 2, z] }, 8);
    m.sphere(rad * 1.25, col[1], { p: [x, y - len + 0.03, z + rad * 0.4], s: [1, 0.62, 1.5] }, 8, 6);
  }
  return m;
}

/** Glowing eyes with a dark socket behind and a pupil in front, so they read as eyes rather than dots. */
function eyes(sockets: MB, glow: MB, pupils: MB, x: number, y: number, z: number, r: number, col: number, gain = 3) {
  for (const s of [-1, 1]) {
    sockets.sphere(r * 1.42, 0x1c1030, { p: [s * x, y, z - r * 0.5], s: [1.1, 1.14, 0.5] }, 10, 8);
    glow.sphere(r, col, { p: [s * x, y, z], gain, s: [1, 1.08, 0.5] }, 10, 8);
    pupils.sphere(r * 0.4, PUPIL, { p: [s * x * 0.94, y - r * 0.05, z + r * 0.45], s: [0.8, 1.3, 0.4] }, 7, 5);
  }
}

/** A thick wing. Having real edges lets the outline trace around it. */
function wing(side: number, col: C2, rib: number, span: number, chord: number) {
  const m = new MB();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.25 * chord);
  shape.quadraticCurveTo(side * span * 0.6, chord * 0.95, side * span, chord * 0.42);
  shape.quadraticCurveTo(side * span * 0.78, chord * 0.02, side * span * 0.86, -chord * 0.42);
  shape.quadraticCurveTo(side * span * 0.42, -chord * 0.38, 0, -0.25 * chord);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false, curveSegments: 8 });
  geo.rotateX(-Math.PI / 2);
  m.add(geo, col);
  m.cyl(0.04, 0.07, span * 0.95, rib, { p: [side * span * 0.47, 0.03, chord * 0.26], r: [0, 0, Math.PI / 2 + side * 0.02] }, 6);
  return m;
}

function gloomling(): Rig {
  const dark: C2 = [0x3a2466, 0x7f57c7];
  const belly: C2 = [0x8c6ad2, 0xb9a0ee];
  const horn: C2 = [0xe9d9ff, 0xfff4d0];
  const b = new MB();
  b.sphere(0.36, dark, { p: [0, 0.48, -0.02], s: [1, 0.98, 0.96] }, 14, 10);
  b.sphere(0.25, belly, { p: [0, 0.46, 0.17], s: [1, 1.05, 0.62] }, 10, 8);
  b.cone(0.12, 0.4, dark[0], { p: [0, 0.5, -0.42], r: [-Math.PI / 2 - 0.4, 0, 0] }, 7);
  const h = new MB(); const g = new MB(); const pupils = new MB();
  h.sphere(0.56, dark, { p: [0, 1.04, 0.04], s: [1.1, 0.92, 1], wobble: 0.015 }, 18, 12);
  for (const s of [-1, 1]) {
    h.cone(0.2, 0.62, horn, { p: [s * 0.46, 1.5, 0], r: [0.1, 0, -s * 0.5] }, 9);
    h.cone(0.15, 0.38, dark[1], { p: [s * 0.64, 1.02, -0.03], r: [0, 0, -s * 1.5] }, 7);
    h.box(0.36, 0.09, 0.14, 0x281648, { p: [s * 0.25, 1.29, 0.47], r: [0, 0, s * 0.42] });
  }
  eyes(h, g, pupils, 0.24, 1.08, 0.53, 0.135, 0xffdf58);
  h.sphere(0.27, 0x180a24, { p: [0, 0.8, 0.46], s: [1.25, 0.46, 0.42] }, 10, 8);
  for (const s of [-1, 1]) h.cone(0.065, 0.2, FANG, { p: [s * 0.15, 0.82, 0.57], r: [Math.PI, 0, 0] }, 6);
  const arm = (s: number) => {
    const a = new MB();
    a.cyl(0.075, 0.1, 0.34, dark, { p: [s * 0.4, 0.5, 0.05] }, 7);
    a.sphere(0.12, dark[1], { p: [s * 0.4, 0.31, 0.07] }, 8, 6);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('head', [0, 0.75, 0], h), P('head', [0, 0.75, 0], pupils), P('head', [0, 0.75, 0], g, true),
      P('armA', [0, 0.66, 0], arm(-1)), P('armB', [0, 0.66, 0], arm(1)),
      P('legA', [0, 0.26, 0], legs([[-0.2, 0.26, 0]], dark, 0.24, 0.13)),
      P('legB', [0, 0.26, 0], legs([[0.2, 0.26, 0]], dark, 0.24, 0.13))],
    flyHeight: 0, hop: 0.2, height: 1.8, accent: 0x9c7bff,
  };
}

function swiftclaw(): Rig {
  const fur: C2 = [0x27306e, 0x6f85dc];
  const b = new MB();
  b.sphere(0.46, fur, { p: [0, 0.76, -0.1], s: [0.86, 0.88, 1.5], wobble: 0.02 }, 12, 9);
  for (let i = 0; i < 4; i++) b.cone(0.15, 0.48 - i * 0.05, 0xb4c0f4, { p: [0, 1.2 - i * 0.05, 0.25 - i * 0.3], r: [-0.45, 0, 0], s: [0.6, 1, 1] }, 5);
  const h = new MB(); const g = new MB(); const pupils = new MB();
  h.sphere(0.46, fur, { p: [0, 1.1, 0.72], s: [1, 0.92, 1.05] }, 14, 10);
  h.cone(0.27, 0.68, fur, { p: [0, 0.96, 1.2], r: [Math.PI / 2 + 0.1, 0, 0] }, 9);
  h.sphere(0.09, 0x10122c, { p: [0, 0.94, 1.53] }, 7, 5);
  for (const s of [-1, 1]) {
    h.cone(0.17, 0.6, fur[1], { p: [s * 0.33, 1.62, 0.56], r: [-0.2, 0, -s * 0.32] }, 6);
    h.cone(0.045, 0.16, FANG, { p: [s * 0.14, 0.78, 1.26], r: [Math.PI, 0, 0] }, 5);
  }
  eyes(h, g, pupils, 0.22, 1.2, 1.08, 0.105, 0x7dfff3, 3.2);
  const tail = new MB();
  tail.cone(0.2, 1.1, fur, { p: [0, 0.14, -0.5], r: [-Math.PI / 2 - 0.4, 0, 0] }, 7);
  const piv: V3 = [0, 0.95, 0.5];
  return {
    parts: [P('none', [0, 0, 0], b), P('head', piv, h), P('head', piv, pupils), P('head', piv, g, true), PL('tail', [0, 0.88, -0.65], tail),
      P('legA', [0, 0.55, 0], legs([[-0.24, 0.55, 0.42], [0.24, 0.55, -0.55]], fur, 0.46, 0.11)),
      P('legB', [0, 0.55, 0], legs([[0.24, 0.55, 0.42], [-0.24, 0.55, -0.55]], fur, 0.46, 0.11))],
    flyHeight: 0, hop: 0.12, height: 1.8, accent: 0x7dfff3,
  };
}

function bristleboar(): Rig {
  const hide: C2 = [0x5a1f3c, 0xb0587c];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.82, hide, { p: [0, 0.98, -0.2], s: [1, 0.94, 1.2], wobble: 0.03 }, 16, 11);
  b.sphere(0.62, hide, { p: [0, 0.92, 0.72], s: [1.05, 0.96, 1] }, 14, 10);
  b.cyl(0.3, 0.36, 0.3, 0xf09aa8, { p: [0, 0.78, 1.32], r: RING }, 12);
  for (const s of [-1, 1]) {
    b.sphere(0.05, 0x5a1f3c, { p: [s * 0.12, 0.8, 1.48] }, 6, 5);
    b.cone(0.13, 0.82, BONE, { p: [s * 0.42, 0.86, 1.2], r: [-0.62, 0, s * -0.3] }, 7);
    b.cone(0.2, 0.34, hide[1], { p: [s * 0.52, 1.5, 0.52], r: [0, 0, -s * 0.5], s: [1, 1, 0.5] }, 6);
  }
  eyes(b, g, pupils, 0.27, 1.14, 1.16, 0.12, 0xff5a3c, 3.4);
  // Big bone plates down the back.
  for (let i = 0; i < 5; i++) {
    b.cone(0.36 - i * 0.02, 0.8, BONE, { p: [0, 1.82 - Math.abs(i - 1.5) * 0.09, 0.42 - i * 0.38], r: [-0.42, 0, 0], s: [0.85, 1, 0.5] }, 6);
    for (const s of [-1, 1]) b.cone(0.2, 0.56, BONE, { p: [s * 0.62, 1.48 - Math.abs(i - 1.5) * 0.07, 0.34 - i * 0.38], r: [-0.3, 0, s * -0.7], s: [0.8, 1, 0.5] }, 5);
  }
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.5, 0], legs([[-0.5, 0.5, 0.5], [0.5, 0.5, -0.65]], hide, 0.42, 0.2)),
      P('legB', [0, 0.5, 0], legs([[0.5, 0.5, 0.5], [-0.5, 0.5, -0.65]], hide, 0.42, 0.2))],
    flyHeight: 0, hop: 0.07, height: 2.2, accent: 0xff5a3c,
  };
}

function duskmoth(): Rig {
  const fuzz: C2 = [0x4a2f8a, 0xc0a8f4];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.36, fuzz, { s: [0.92, 0.92, 1.5] }, 12, 9);
  b.sphere(0.36, [0x7d68c8, 0xf4eeff], { p: [0, 0.06, 0.48], wobble: 0.05, wobbleFreq: 8 }, 12, 9);
  for (const s of [-1, 1]) {
    b.cyl(0.015, 0.03, 0.62, 0x2c1e49, { p: [s * 0.2, 0.62, 0.62], r: [0.5, 0, -s * 0.42] }, 5);
    b.sphere(0.07, 0xc0a8f4, { p: [s * 0.34, 0.88, 0.78] }, 7, 5);
  }
  eyes(b, g, pupils, 0.17, 0.14, 0.78, 0.115, 0xff9cf3, 3.2);
  const memb: C2 = [0x5a2fa0, 0xc08cf0];
  const dots = (s: number) => {
    const d = new MB();
    d.sphere(0.26, 0xff9cf3, { p: [s * 0.82, 0.07, 0.08], s: [1, 0.1, 1], gain: 2.4 }, 10, 5);
    return d;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      P('wingL', [0, 0, 0], wing(-1, memb, 0x2c1e49, 1.5, 1.2)), P('wingR', [0, 0, 0], wing(1, memb, 0x2c1e49, 1.5, 1.2)),
      P('wingL', [0, 0, 0], dots(-1), true), P('wingR', [0, 0, 0], dots(1), true)],
    flyHeight: 3.4, hop: 0, height: 1.1, accent: 0xff9cf3,
  };
}

function ironhusk(): Rig {
  const steel: C2 = [0x3c4468, 0xa4aed4];
  const trim: C2 = [0xa8702a, 0xf0c060];
  const b = new MB(); const g = new MB();
  b.lathe([[0.5, 0.75], [0.76, 1.25], [0.78, 1.6], [0.42, 1.84], [0, 1.86]], steel, { s: [1, 1, 0.86] }, 12);
  b.torus(0.7, 0.05, trim, { p: [0, 1.28, 0], r: RING, s: [1, 0.86, 1] }, 6, 16);
  for (const s of [-1, 1]) {
    b.sphere(0.46, steel, { p: [s * 0.82, 1.72, 0], s: [1.1, 0.74, 1.1] }, 11, 8);
    b.cone(0.16, 0.5, 0xeae6e0, { p: [s * 0.96, 2.14, 0], r: [0, 0, s * -0.32] }, 7);
  }
  // A huge bucket helm with a burning slit.
  b.cyl(0.54, 0.6, 0.86, steel, { p: [0, 2.22, 0.06] }, 12);
  b.lathe([[0.54, 2.64], [0.36, 2.86], [0, 2.94]], steel, { p: [0, 0, 0.06] }, 12);
  b.torus(0.58, 0.05, trim, { p: [0, 1.92, 0.06], r: RING }, 6, 16);
  b.box(0.1, 0.86, 0.1, trim, { p: [0, 2.26, 0.62] });
  b.cone(0.1, 0.7, 0xd9413a, { p: [0, 3.2, 0], s: [0.5, 1, 1.2] }, 6);
  g.box(0.84, 0.13, 0.08, 0xff4f88, { p: [0, 2.3, 0.6], gain: 3.6 });
  const shield = new MB();
  shield.lathe([[0, 0.08], [0.68, 0], [0.72, -0.05]], [0x7a3a2c, 0xc8704c], { r: RING, s: [1, 1, 1.25] }, 12);
  shield.torus(0.7, 0.05, trim, { s: [1, 1.25, 1] }, 6, 18);
  shield.cone(0.14, 0.26, trim, { p: [0, 0, 0.18], r: RING }, 7);
  const sword = new MB();
  sword.box(0.16, 1.75, 0.3, [0x9aa4c8, 0xf4f6ff], { p: [0, 0.78, 0.46], r: [0.55, 0, 0] });
  sword.box(0.62, 0.13, 0.15, trim, { p: [0, 0.03, 0.02] });
  sword.cyl(0.16, 0.18, 0.72, steel, { p: [0, -0.18, 0] }, 8);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.92, 1.2, 0.42], shield),
      PL('armB', [0.92, 1.15, 0.2], sword),
      P('legA', [0, 0.82, 0], legs([[-0.32, 0.82, 0]], steel, 0.74, 0.24)),
      P('legB', [0, 0.82, 0], legs([[0.32, 0.82, 0]], steel, 0.74, 0.24))],
    flyHeight: 0, hop: 0.05, height: 3.2, accent: 0xff4f88,
  };
}

function shade(): Rig {
  const cloak: C2 = [0x172052, 0x5468c4];
  const b = new MB(); const g = new MB();
  b.lathe([[0.86, 0.05], [0.76, 0.03], [0.6, 0.8], [0.5, 1.3]], cloak, { wobble: 0.06, wobbleFreq: 2.2 }, 12);
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    b.cone(0.22, 0.52, cloak[0], { p: [Math.cos(a) * 0.78, 0.12, Math.sin(a) * 0.78], r: [Math.PI, 0, 0], s: [1, 1, 0.5] }, 5);
  }
  // A deep oversized hood, with only the eyes showing.
  b.sphere(0.68, cloak, { p: [0, 1.62, 0], s: [1, 1.05, 1] }, 14, 10);
  b.cone(0.38, 0.92, cloak[1], { p: [0, 2.32, -0.25], r: [-0.55, 0, 0] }, 9);
  b.sphere(0.46, 0x050717, { p: [0, 1.58, 0.36], s: [1, 1.06, 0.72] }, 11, 8);
  for (const s of [-1, 1]) g.sphere(0.12, 0x65f0ff, { p: [s * 0.17, 1.62, 0.7], gain: 4, s: [1, 0.72, 0.5] }, 8, 6);
  g.torus(0.76, 0.03, 0x65f0ff, { p: [0, 0.78, 0], r: RING, gain: 2.2 }, 5, 20);
  const arm = () => {
    const a = new MB();
    a.cone(0.26, 1.1, cloak, { p: [0, -0.44, 0.12], r: [Math.PI + 0.25, 0, 0] }, 7);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armA', [-0.66, 1.45, 0], arm()), PL('armB', [0.66, 1.45, 0], arm())],
    flyHeight: 0, hop: 0.13, height: 2.7, accent: 0x65f0ff,
  };
}

function mireshaman(): Rig {
  const robe: C2 = [0x2a5a2a, 0x8cc04c];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.lathe([[0.74, 0.05], [0.66, 0.72], [0.5, 1.2], [0.3, 1.5], [0, 1.58]], robe, { wobble: 0.04, wobbleFreq: 2 }, 12);
  // Mossy mantle and a big bone mask with antlers.
  b.sphere(0.6, [0x54401e, 0xa88e48], { p: [0, 1.44, 0], s: [1.2, 0.6, 1.15], wobble: 0.08, wobbleFreq: 4 }, 12, 8);
  b.sphere(0.55, BONE, { p: [0, 1.92, 0.12], s: [0.96, 1.08, 0.8] }, 14, 10);
  b.cone(0.1, 0.28, 0x8a7a50, { p: [0, 1.8, 0.58], r: [Math.PI / 2 + 0.35, 0, 0] }, 5);
  for (const s of [-1, 1]) {
    b.cone(0.11, 1.05, BONE, { p: [s * 0.46, 2.72, 0.05], r: [-0.12, 0, s * -0.42] }, 6);
    b.cone(0.08, 0.56, BONE, { p: [s * 0.62, 2.72, 0.05], r: [-0.12, 0, s * -1.1] }, 5);
  }
  eyes(b, g, pupils, 0.2, 2.0, 0.54, 0.105, 0x9dff5a, 3.4);
  const staff = new MB();
  staff.cyl(0.07, 0.09, 2.7, [0x4a3018, 0xa07a40], { p: [0, 0.35, 0.05], wobble: 0.02 }, 7);
  staff.torus(0.26, 0.05, 0x7e5c33, { p: [0, 1.82, 0.05] }, 5, 14);
  const orb = new MB();
  orb.ico(0.25, [0x8dff3f, 0xe6ffb0], { p: [0, 1.82, 0.05], gain: 3.4 }, 1);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true), PL('armB', [0.76, 0.95, 0.25], staff), PL('armB', [0.76, 0.95, 0.25], orb, true)],
    flyHeight: 0, hop: 0.08, height: 3.1, accent: 0x9dff5a,
  };
}

function sporeback(): Rig {
  const flesh: C2 = [0x4a2f6a, 0xa880a8];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.98, flesh, { p: [0, 1.04, -0.05], s: [1, 0.86, 1.14], wobble: 0.06, wobbleFreq: 1.6, puff: 0.3 }, 16, 12);
  b.sphere(0.58, flesh, { p: [0, 0.9, 0.86], s: [1.1, 0.84, 0.9] }, 12, 9);
  b.sphere(0.36, 0x1c0e20, { p: [0, 0.68, 1.22], s: [1.3, 0.42, 0.5] }, 10, 7);
  for (const s of [-1, 1]) b.cone(0.07, 0.2, FANG, { p: [s * 0.2, 0.72, 1.36], r: [Math.PI, 0, 0] }, 5);
  eyes(b, g, pupils, 0.26, 1.08, 1.26, 0.13, 0xffd25a, 3.2);
  const caps = [[0.34, 1.86, 0.2, 0.62], [-0.5, 1.72, -0.3, 0.52], [0.3, 1.64, -0.68, 0.46], [-0.14, 1.96, 0.56, 0.34], [0.68, 1.38, 0.1, 0.34]];
  for (const [x, y, z, r] of caps) {
    b.cyl(r * 0.3, r * 0.4, r * 0.8, 0xf0e6cc, { p: [x, y, z] }, 8);
    b.sphere(r, [0x9c1f46, 0xe8486e], { p: [x, y + r * 0.42, z], s: [1, 0.6, 1] }, 12, 8);
    for (const [dx, dz] of [[0.46, 0.2], [-0.4, -0.25], [0.05, 0.5]]) {
      b.sphere(r * 0.17, 0xfff0d8, { p: [x + r * dx, y + r * 0.72, z + r * dz], s: [1, 0.5, 1] }, 6, 5);
    }
  }
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.45, 0], legs([[-0.58, 0.45, 0.55], [0.58, 0.45, -0.55]], flesh, 0.38, 0.22)),
      P('legB', [0, 0.45, 0], legs([[0.58, 0.45, 0.55], [-0.58, 0.45, -0.55]], flesh, 0.38, 0.22))],
    flyHeight: 0, hop: 0.06, height: 2.5, accent: 0xffd25a,
  };
}

function gargoyle(): Rig {
  const rock: C2 = [0x4a4a68, 0xa8a8c4];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.56, rock, { s: [0.95, 0.9, 1.22], wobble: 0.04 }, 12, 9);
  b.sphere(0.52, rock, { p: [0, 0.3, 0.7], wobble: 0.025 }, 12, 9);
  b.cone(0.2, 0.42, rock[1], { p: [0, 0.14, 1.2], r: [Math.PI / 2, 0, 0] }, 7);
  b.sphere(0.2, 0x181420, { p: [0, 0, 1.02], s: [1.3, 0.42, 0.6] }, 8, 6);
  for (const s of [-1, 1]) {
    b.cone(0.13, 0.76, BONE, { p: [s * 0.3, 0.88, 0.5], r: [-0.65, 0, s * -0.26] }, 7);
    b.cone(0.13, 0.62, rock, { p: [s * 0.36, -0.5, 0.3], r: [Math.PI, 0, 0] }, 6);
    b.cone(0.05, 0.16, FANG, { p: [s * 0.14, 0, 1.1], r: [Math.PI, 0, 0] }, 5);
  }
  b.cone(0.16, 1.2, rock, { p: [0, 0.02, -1.08], r: [-Math.PI / 2, 0, 0] }, 7);
  eyes(b, g, pupils, 0.2, 0.42, 1.14, 0.105, 0xffb13c, 3.4);
  const memb: C2 = [0x3a3a58, 0x86869e];
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      PL('wingL', [0, 0.14, 0], wing(-1, memb, 0x4a4a68, 1.9, 1.25)), PL('wingR', [0, 0.14, 0], wing(1, memb, 0x4a4a68, 1.9, 1.25))],
    flyHeight: 4.2, hop: 0, height: 1.5, accent: 0xffb13c,
  };
}

function colossus(): Rig {
  const rock: C2 = [0x352a5c, 0x8c7cb8];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.ico(1.2, rock, { p: [0, 2.5, 0], s: [1.2, 1, 0.98], wobble: 0.09 }, 2);
  b.ico(0.8, rock, { p: [0, 1.4, 0], s: [1.1, 0.72, 0.9], wobble: 0.07 }, 1);
  // A heavy head sunk low between the shoulders, jutting forward.
  b.ico(0.72, rock, { p: [0, 3.62, 0.42], s: [1.08, 0.9, 1], wobble: 0.04 }, 2);
  b.sphere(0.34, 0x140c24, { p: [0, 3.34, 1.0], s: [1.4, 0.44, 0.5] }, 10, 7);
  for (const s of [-1, 1]) b.cone(0.1, 0.28, FANG, { p: [s * 0.26, 3.4, 1.13], r: [Math.PI, 0, 0] }, 5);
  eyes(b, g, pupils, 0.28, 3.74, 1.02, 0.14, 0xff4fd8, 3.8);
  for (const [x, y, z, r] of [[-0.85, 3.3, -0.3, 0.56], [0.8, 3.4, -0.35, 0.5], [0.2, 3.5, -0.7, 0.44], [-0.28, 1.9, 0.68, 0.28], [1.1, 2.6, 0.2, 0.3]]) {
    b.crystal(r * 0.75, r * 2.5, [0x6a44c8, 0xd8c4ff], { p: [x, y, z], r: [z * 0.4, 0, -x * 0.42] });
  }
  g.ico(0.42, [0xff4fd8, 0xffc4f2], { p: [0, 2.48, 1.02], gain: 3.2, s: [1, 1, 0.4] }, 1);
  const makeArm = () => {
    const a = new MB();
    a.ico(0.5, rock, { p: [0, -0.15, 0], wobble: 0.04 }, 1);
    a.ico(0.4, rock, { p: [0, -0.95, 0.05], s: [0.9, 1.35, 0.9], wobble: 0.05 }, 1);
    a.ico(0.56, rock, { p: [0, -1.85, 0.1], wobble: 0.06 }, 1);
    return a;
  };
  const makeLeg = (x: number) => {
    const a = new MB();
    a.ico(0.6, rock, { p: [x, 0.8, 0], s: [1, 1.55, 1], wobble: 0.05 }, 1);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true), PL('armA', [-1.36, 3.1, 0], makeArm()), PL('armB', [1.36, 3.1, 0], makeArm()),
      P('legA', [0, 1.3, 0], makeLeg(-0.68)),
      P('legB', [0, 1.3, 0], makeLeg(0.68))],
    flyHeight: 0, hop: 0.03, height: 4.6, accent: 0xff4fd8,
  };
}

function veilwraith(): Rig {
  const veil: C2 = [0x3d2a70, 0xb9a4f0];
  const b = new MB(); const g = new MB();
  // A tall tattered shroud that thins to nothing at the bottom.
  b.lathe([[0.18, 0.5], [0.58, 0.95], [0.62, 1.5], [0.46, 2.0], [0, 2.14]], veil, { wobble: 0.05, wobbleFreq: 2.4 }, 12);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    b.cone(0.2, 0.86, veil[0], { p: [Math.cos(a) * 0.42, 0.56, Math.sin(a) * 0.42], r: [Math.PI, 0, 0], s: [1, 1, 0.5] }, 5);
  }
  b.sphere(0.56, veil, { p: [0, 2.2, 0.04] }, 14, 10);
  b.sphere(0.4, 0x0a0618, { p: [0, 2.16, 0.32], s: [1, 1.1, 0.7] }, 10, 8);
  for (const s of [-1, 1]) g.sphere(0.1, 0xf4e8ff, { p: [s * 0.16, 2.2, 0.62], gain: 4.4, s: [1, 1.5, 0.5] }, 8, 6);
  g.torus(0.46, 0.03, 0xd6b8ff, { p: [0, 1.24, 0], r: RING, gain: 2.6 }, 5, 18);
  g.torus(0.34, 0.025, 0xd6b8ff, { p: [0, 0.82, 0], r: RING, gain: 2 }, 5, 16);
  const arm = () => {
    const a = new MB();
    a.cone(0.17, 1.2, veil, { p: [0, -0.5, 0.2], r: [Math.PI + 0.45, 0, 0] }, 6);
    for (const s of [-1, 0, 1]) a.cone(0.035, 0.34, FANG, { p: [s * 0.08, -1.15, 0.5], r: [Math.PI + 0.45, 0, 0] }, 4);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armA', [-0.6, 1.82, 0], arm()), PL('armB', [0.6, 1.82, 0], arm())],
    flyHeight: 0.35, hop: 0.16, height: 2.9, accent: 0xd6b8ff,
  };
}

function runegolem(): Rig {
  const stone: C2 = [0x3f5560, 0x9fb8b4];
  const moss: C2 = [0x3a5a30, 0x86a850];
  const rune = 0x6ff6e8;
  const b = new MB(); const g = new MB();
  b.box(1.5, 1.3, 1.05, stone, { p: [0, 1.5, 0], wobble: 0.05, flat: true });
  b.box(1.1, 0.5, 0.86, stone, { p: [0, 0.74, 0], wobble: 0.04, flat: true });
  b.box(0.92, 0.72, 0.78, stone, { p: [0, 2.46, 0.1], wobble: 0.04, flat: true });
  b.box(1.72, 0.32, 1.1, moss, { p: [0, 2.14, -0.04], wobble: 0.07, wobbleFreq: 3 });
  for (const s of [-1, 1]) b.ico(0.42, stone, { p: [s * 0.92, 2.1, 0], wobble: 0.04 }, 0);
  // Carved runes that glow: a brow, a chest sigil, and marks down the sides.
  g.box(0.66, 0.1, 0.05, rune, { p: [0, 2.56, 0.5], gain: 4 });
  g.box(0.12, 0.72, 0.05, rune, { p: [0, 1.5, 0.54], gain: 3.2 });
  g.box(0.62, 0.1, 0.05, rune, { p: [0, 1.74, 0.54], gain: 3.2 });
  g.box(0.62, 0.1, 0.05, rune, { p: [0, 1.26, 0.54], gain: 3.2 });
  for (const s of [-1, 1]) g.box(0.05, 0.5, 0.2, rune, { p: [s * 0.77, 1.5, 0], gain: 2.6 });
  const arm = () => {
    const a = new MB();
    a.box(0.5, 1.1, 0.52, stone, { p: [0, -0.42, 0], wobble: 0.04, flat: true });
    a.ico(0.44, stone, { p: [0, -1.1, 0.04], wobble: 0.05 }, 0);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armA', [-1.02, 2.0, 0], arm()), PL('armB', [1.02, 2.0, 0], arm()),
      P('legA', [0, 0.62, 0], legs([[-0.34, 0.62, 0]], stone, 0.58, 0.27)),
      P('legB', [0, 0.62, 0], legs([[0.34, 0.62, 0]], stone, 0.58, 0.27))],
    flyHeight: 0, hop: 0.04, height: 3.1, accent: rune,
  };
}

function bogbloat(): Rig {
  const skin: C2 = [0x3e5a2a, 0xa4b858];
  const belly: C2 = [0x8a9a58, 0xd8dc98];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(1.08, skin, { p: [0, 1.28, 0], s: [1.06, 1, 1.04], wobble: 0.05, wobbleFreq: 1.8, puff: 0.3 }, 18, 12);
  b.sphere(0.8, belly, { p: [0, 1.1, 0.44], s: [1, 0.96, 0.72] }, 14, 10);
  // Warty gas sacs, some of them glowing.
  for (const [x, y, z, r] of [[0.74, 1.9, -0.18, 0.3], [-0.72, 1.76, 0.2, 0.26], [0.18, 2.24, -0.34, 0.25], [-0.3, 1.2, -0.92, 0.32], [0.86, 0.96, -0.4, 0.22]]) {
    b.sphere(r, skin[1], { p: [x, y, z] }, 9, 7);
    g.sphere(r * 0.46, 0xd8ff5a, { p: [x + x * 0.2, y + 0.1, z + z * 0.2], gain: 2.6 }, 7, 5);
  }
  b.sphere(0.46, 0x161a0a, { p: [0, 1.28, 0.92], s: [1.5, 0.42, 0.4] }, 10, 7);
  for (const s of [-1, 0, 1]) b.cone(0.07, 0.2, FANG, { p: [s * 0.3, 1.36, 1.05], r: [Math.PI, 0, 0] }, 5);
  for (const s of [-1, 1]) {
    b.sphere(0.27, skin, { p: [s * 0.42, 2.06, 0.54] }, 11, 8);
  }
  eyes(b, g, pupils, 0.42, 2.08, 0.76, 0.14, 0xe0ff66, 3.2);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.4, 0], legs([[-0.52, 0.4, 0.24]], skin, 0.36, 0.26)),
      P('legB', [0, 0.4, 0], legs([[0.52, 0.4, 0.24]], skin, 0.36, 0.26))],
    flyHeight: 0, hop: 0.09, height: 2.6, accent: 0xd8ff5a,
  };
}

function glasswing(): Rig {
  const body: C2 = [0x2c5a78, 0x9fe0f0];
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.3, body, { s: [0.86, 0.86, 1.6] }, 12, 9);
  b.sphere(0.3, body, { p: [0, 0.08, 0.5] }, 12, 9);
  b.cone(0.09, 0.42, 0xe6fbff, { p: [0, 0.06, 0.92], r: [Math.PI / 2, 0, 0] }, 6);
  for (const s of [-1, 1]) b.cyl(0.015, 0.025, 0.5, 0x2c5a78, { p: [s * 0.14, 0.42, 0.58], r: [0.4, 0, -s * 0.4] }, 5);
  eyes(b, g, pupils, 0.15, 0.14, 0.72, 0.1, 0xaef6ff, 3.4);
  const glass: C2 = [0x7fd8ee, 0xf0ffff];
  const shards = (side: number) => {
    // Faceted mirror panes rather than a soft membrane.
    const w = wing(side, glass, 0x2c5a78, 1.55, 1.15);
    for (let i = 0; i < 3; i++) w.crystal(0.13, 0.62, 0xe6fbff, { p: [side * (0.5 + i * 0.42), 0.09, 0.3 - i * 0.22], r: [Math.PI / 2, 0, side * 0.4] });
    return w;
  };
  const gleam = (side: number) => {
    const m = new MB();
    m.sphere(0.13, 0xc8fbff, { p: [side * 0.98, 0.09, 0.02], s: [1.5, 0.1, 1], gain: 3 }, 8, 5);
    return m;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      P('wingL', [0, 0, 0], shards(-1)), P('wingR', [0, 0, 0], shards(1)),
      P('wingL', [0, 0, 0], gleam(-1), true), P('wingR', [0, 0, 0], gleam(1), true)],
    flyHeight: 3.8, hop: 0, height: 1.1, accent: 0xaef6ff,
  };
}

function cinderwight(): Rig {
  const char: C2 = [0x241416, 0x6a3a2c];
  const b = new MB(); const g = new MB();
  b.lathe([[0.3, 0.72], [0.52, 1.1], [0.58, 1.56], [0.34, 1.84], [0, 1.9]], char, { wobble: 0.05, wobbleFreq: 2.8, s: [1, 1, 0.84] }, 10);
  b.ico(0.46, char, { p: [0, 2.18, 0.08], s: [1, 1.08, 1], wobble: 0.05 }, 1);
  // Cracks of fire in the crust, and a crown of flame.
  for (const [x, y, r] of [[0.14, 1.5, 0.3], [-0.2, 1.18, -0.3], [0.05, 1.75, 0.12], [-0.08, 0.96, 0.4]]) {
    g.box(0.5, 0.075, 0.05, 0xff7a24, { p: [x, y, 0.47], r: [0, 0, r], gain: 4 });
  }
  g.box(0.5, 0.11, 0.06, 0xffd25a, { p: [0, 2.2, 0.5], gain: 4.6 });
  for (const [x, z, h] of [[0, 0, 0.92], [0.26, -0.05, 0.62], [-0.27, 0.02, 0.68], [0.02, -0.26, 0.56]]) {
    g.cone(0.17, h, [0xff6a1e, 0xffd25a], { p: [x, 2.5 + h / 2, z], gain: 3.4 }, 7);
  }
  const arm = () => {
    const a = new MB();
    a.cyl(0.12, 0.15, 0.95, char, { p: [0, -0.42, 0.08], r: [0.25, 0, 0], wobble: 0.03 }, 7);
    a.ico(0.2, char, { p: [0, -0.92, 0.2] }, 0);
    return a;
  };
  const ember = () => {
    const a = new MB();
    a.sphere(0.13, 0xff8a3c, { p: [0, -0.98, 0.25], gain: 4 }, 7, 5);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.62, 1.68, 0], arm()), PL('armB', [0.62, 1.68, 0], arm()),
      PL('armA', [-0.62, 1.68, 0], ember(), true), PL('armB', [0.62, 1.68, 0], ember(), true),
      P('legA', [0, 0.76, 0], legs([[-0.24, 0.76, 0]], char, 0.68, 0.17)),
      P('legB', [0, 0.76, 0], legs([[0.24, 0.76, 0]], char, 0.68, 0.17))],
    flyHeight: 0, hop: 0.11, height: 3.2, accent: 0xff7a24,
  };
}

/** Mire Mother: a swollen spider-queen with glowing egg sacs on her back. */
function broodmother(): Rig {
  const hide: C2 = [0x2a1f44, 0x8460a8];
  const sac = 0xc6ff3a;
  const b = new MB(); const g = new MB(); const pupils = new MB(); const h = new MB();
  b.sphere(0.86, hide, { p: [0, 1.22, -0.5], s: [1, 0.92, 1.2], wobble: 0.04, wobbleFreq: 2 }, 16, 11);
  b.sphere(0.5, hide, { p: [0, 1.16, 0.42], s: [1, 0.9, 1] }, 12, 9);
  for (const [x, y, z, r] of [[0.46, 1.86, -0.3, 0.27], [-0.42, 1.8, -0.62, 0.3], [0.05, 2.02, -0.74, 0.24], [-0.56, 1.5, 0.02, 0.2], [0.62, 1.42, -0.82, 0.22]]) {
    b.sphere(r, [0x5c7a22, 0xc0d870], { p: [x, y, z] }, 10, 8);
    g.sphere(r * 0.62, sac, { p: [x + x * 0.08, y + r * 0.26, z + z * 0.05], gain: 3 }, 8, 6);
  }
  h.sphere(0.44, hide, { p: [0, 1.5, 0.78], s: [1.1, 0.95, 1] }, 14, 10);
  for (const s of [-1, 1]) {
    h.cone(0.09, 0.56, BONE, { p: [s * 0.27, 2.04, 0.68], r: [-0.12, 0, s * -0.32] }, 6);
    h.cone(0.07, 0.34, FANG, { p: [s * 0.16, 1.2, 1.12], r: [Math.PI - 0.25, 0, s * 0.14] }, 6);
    g.sphere(0.05, sac, { p: [s * 0.13, 1.74, 1.14], gain: 3.6 }, 6, 5);
  }
  h.cone(0.08, 0.42, BONE, { p: [0, 2.08, 0.72] }, 6);
  eyes(h, g, pupils, 0.2, 1.54, 1.13, 0.1, sac, 3.4);
  const pair = (a: V3[]) => legs(a, hide, 0.82, 0.12);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), P('head', [0, 1.3, 0.5], h), P('head', [0, 1.3, 0.5], pupils),
      P('legA', [0, 0.82, 0], pair([[-0.72, 0.82, 0.5], [0.72, 0.82, 0], [-0.72, 0.82, -0.75]])),
      P('legB', [0, 0.82, 0], pair([[0.72, 0.82, 0.5], [-0.72, 0.82, 0], [0.72, 0.82, -0.75]]))],
    flyHeight: 0, hop: 0.05, height: 2.4, accent: sac,
  };
}

/** Rime Warden: a knight of old ice behind a kite shield, crowned with crystal. */
function rimewarden(): Rig {
  const plate: C2 = [0x24446e, 0xa8d8f4];
  const ice: C2 = [0x58b8e4, 0xf0ffff];
  const frost = 0x8fe8ff;
  const b = new MB(); const g = new MB();
  b.lathe([[0.42, 0.78], [0.6, 1.2], [0.62, 1.66], [0.36, 1.92], [0, 1.96]], plate, { s: [1, 1, 0.84] }, 12);
  b.torus(0.56, 0.05, ice, { p: [0, 1.22, 0], r: RING, s: [1, 0.84, 1] }, 6, 16);
  for (const s of [-1, 1]) {
    b.sphere(0.34, plate, { p: [s * 0.62, 1.82, 0], s: [1.05, 0.76, 1.05] }, 11, 8);
    b.crystal(0.13, 0.62, ice, { p: [s * 0.68, 2.2, -0.04], r: [0, 0, s * -0.3] });
  }
  b.cyl(0.42, 0.46, 0.66, plate, { p: [0, 2.24, 0.04] }, 12);
  b.lathe([[0.42, 2.56], [0.26, 2.74], [0, 2.8]], plate, { p: [0, 0, 0.04] }, 12);
  for (const [x, h, r] of [[0, 0.8, 0], [-0.24, 0.58, 0.28], [0.24, 0.58, -0.28]]) {
    b.crystal(0.11, h, ice, { p: [x, 2.72 + h * 0.34, 0.02], r: [0, 0, r] });
  }
  g.box(0.62, 0.11, 0.06, frost, { p: [0, 2.3, 0.46], gain: 4 });
  g.ico(0.15, frost, { p: [0, 1.52, 0.56], gain: 3.4, s: [1, 1.3, 0.5] }, 0);
  const shield = new MB();
  shield.cyl(0.46, 0.46, 0.09, ice, { r: RING, s: [1, 1, 1.75] }, 6);
  shield.torus(0.46, 0.035, plate, { s: [1, 1.75, 1] }, 5, 6);
  const spear = new MB();
  spear.cyl(0.05, 0.06, 2.5, plate, { p: [0, 0.1, 0.1] }, 7);
  spear.crystal(0.15, 0.7, ice, { p: [0, 1.56, 0.1] });
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.72, 1.32, 0.34], shield),
      PL('armB', [0.72, 1.3, 0.2], spear),
      P('legA', [0, 0.82, 0], legs([[-0.26, 0.82, 0]], plate, 0.74, 0.2)),
      P('legB', [0, 0.82, 0], legs([[0.26, 0.82, 0]], plate, 0.74, 0.2))],
    flyHeight: 0, hop: 0.05, height: 3.3, accent: frost,
  };
}

/** Dune Reaver: a sand-armored scorpion with heavy claws and a burning sting. */
function dunereaver(): Rig {
  const shell: C2 = [0x6a3f16, 0xe8b45a];
  const dark: C2 = [0x3c2410, 0x9a6a30];
  const sting = 0xffb03a;
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.72, shell, { p: [0, 0.82, -0.1], s: [0.92, 0.66, 1.42], wobble: 0.03 }, 14, 10);
  for (let i = 0; i < 4; i++) b.torus(0.58 - i * 0.03, 0.05, dark, { p: [0, 0.84, 0.5 - i * 0.42], s: [1, 0.72, 1] }, 5, 14);
  b.sphere(0.46, shell, { p: [0, 0.84, 0.86], s: [1, 0.72, 1.05] }, 12, 9);
  b.sphere(0.2, 0x1c1008, { p: [0, 0.66, 1.26], s: [1.3, 0.45, 0.5] }, 8, 6);
  for (const s of [-1, 1]) b.cone(0.055, 0.2, FANG, { p: [s * 0.13, 0.62, 1.32], r: [Math.PI, 0, 0] }, 5);
  eyes(b, g, pupils, 0.2, 1.04, 1.2, 0.1, sting, 3.6);
  const claw = (s: number) => {
    const a = new MB();
    a.cyl(0.1, 0.13, 0.62, dark, { p: [s * 0.06, 0, 0.26], r: [Math.PI / 2, 0, 0] }, 7);
    a.sphere(0.26, shell, { p: [s * 0.06, 0, 0.68], s: [0.9, 0.7, 1.1] }, 10, 7);
    a.cone(0.11, 0.5, shell[1], { p: [s * 0.18, 0, 1.02], r: [Math.PI / 2, 0, s * -0.2], s: [1, 1, 0.6] }, 6);
    a.cone(0.09, 0.42, shell[1], { p: [s * -0.07, 0, 1.0], r: [Math.PI / 2, 0, s * 0.2], s: [1, 1, 0.6] }, 6);
    return a;
  };
  const tail = new MB(); const tailGlow = new MB();
  for (const [y, z, r] of [[0.12, -0.14, 0.27], [0.5, -0.32, 0.24], [0.92, -0.34, 0.21], [1.28, -0.14, 0.19]]) tail.sphere(r, shell, { p: [0, y, z], s: [1, 1, 1] }, 9, 7);
  tail.cone(0.1, 0.46, BONE, { p: [0, 1.36, 0.24], r: [Math.PI / 2 + 0.45, 0, 0] }, 6);
  tailGlow.sphere(0.17, sting, { p: [0, 1.38, 0.05], gain: 3.8 }, 8, 6);
  const six = (a: V3[]) => legs(a, dark, 0.56, 0.09);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.6, 0.84, 0.72], claw(-1)), PL('armB', [0.6, 0.84, 0.72], claw(1)),
      PL('tail', [0, 1.05, -1], tail), PL('tail', [0, 1.05, -1], tailGlow, true),
      P('legA', [0, 0.56, 0], six([[-0.64, 0.56, 0.42], [0.64, 0.56, -0.05], [-0.64, 0.56, -0.55]])),
      P('legB', [0, 0.56, 0], six([[0.64, 0.56, 0.42], [-0.64, 0.56, -0.05], [0.64, 0.56, -0.55]]))],
    flyHeight: 0, hop: 0.07, height: 2.5, accent: sting,
  };
}

/** Ashen Regent: a burnt king in a charred robe, with a gold crown and a fire in its chest. */
function ashregent(): Rig {
  const robe: C2 = [0x1c1216, 0x5c3a34];
  const gold: C2 = [0xa86a1c, 0xffd36b];
  const ember = 0xff5a24;
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.lathe([[0.74, 0.05], [0.62, 0.7], [0.46, 1.34], [0.5, 1.8], [0.26, 2.04], [0, 2.1]], robe, { wobble: 0.04, wobbleFreq: 2.6 }, 12);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    b.cone(0.18, 0.4, robe[0], { p: [Math.cos(a) * 0.66, 0.1, Math.sin(a) * 0.66], r: [Math.PI, 0, 0], s: [1, 1, 0.5] }, 5);
    g.box(0.07, 0.52, 0.03, ember, { p: [Math.cos(a) * 0.63, 0.46, Math.sin(a) * 0.63], r: [0, -a + Math.PI / 2, 0], gain: 3.2 });
  }
  b.torus(0.47, 0.05, gold, { p: [0, 1.34, 0], r: RING }, 6, 16);
  b.sphere(0.56, robe, { p: [0, 1.86, -0.02], s: [1.24, 0.56, 1.04] }, 12, 8);
  b.sphere(0.42, BONE, { p: [0, 2.42, 0.06], s: [0.94, 1.06, 0.96] }, 14, 10);
  b.sphere(0.2, 0x18080a, { p: [0, 2.2, 0.36], s: [1.1, 0.5, 0.5] }, 8, 6);
  b.torus(0.37, 0.06, gold, { p: [0, 2.72, 0.04], r: RING }, 6, 16);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + Math.PI / 2;
    b.cone(0.09, 0.4, gold, { p: [Math.cos(a) * 0.36, 2.92, 0.04 + Math.sin(a) * 0.36] }, 5);
  }
  eyes(b, g, pupils, 0.16, 2.46, 0.4, 0.09, ember, 4);
  g.ico(0.2, [0xff5a24, 0xffd25a], { p: [0, 1.56, 0.44], gain: 4, s: [1, 1.25, 0.5] }, 1);
  const sleeve = () => {
    const a = new MB();
    a.cone(0.22, 0.95, robe, { p: [0, -0.38, 0.1], r: [Math.PI + 0.25, 0, 0] }, 7);
    return a;
  };
  const staff = new MB();
  staff.cyl(0.05, 0.065, 2.6, gold, { p: [0, 0.34, 0.18] }, 7);
  staff.torus(0.2, 0.04, gold, { p: [0, 1.76, 0.18] }, 5, 12);
  const flame = new MB();
  flame.cone(0.15, 0.56, [0xff5a24, 0xffd25a], { p: [0, 1.82, 0.18], gain: 3.6 }, 7);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.68, 1.84, 0], sleeve()),
      PL('armB', [0.68, 1.84, 0], sleeve()),
      PL('armB', [0.68, 1.1, 0.1], staff),
      PL('armB', [0.68, 1.1, 0.1], flame, true)],
    flyHeight: 0, hop: 0.06, height: 3.3, accent: ember,
  };
}

/** Stormharrow: a great storm hawk, with lightning across its breast. */
function stormharrow(): Rig {
  const feather: C2 = [0x1c2a58, 0x7c9ce4];
  const bolt = 0x9fd8ff;
  const b = new MB(); const g = new MB(); const pupils = new MB();
  b.sphere(0.58, feather, { s: [0.92, 0.88, 1.36], wobble: 0.03 }, 14, 10);
  b.sphere(0.42, feather, { p: [0, 0.3, 0.78] }, 12, 9);
  b.cone(0.17, 0.6, [0xa8701c, 0xffd36b], { p: [0, 0.2, 1.3], r: [Math.PI / 2 + 0.25, 0, 0] }, 7);
  for (const s of [-1, 1]) {
    b.cone(0.1, 0.56, feather[1], { p: [s * 0.2, 0.74, 0.54], r: [-0.8, 0, s * -0.24] }, 5);
    b.cone(0.12, 0.54, 0xfff0d0, { p: [s * 0.24, -0.5, 0.2], r: [Math.PI, 0, 0] }, 5);
  }
  for (const s of [-1, 0, 1]) b.cone(0.2, 1.2, feather, { p: [s * 0.2, -0.02, -1.14], r: [-Math.PI / 2, 0, s * 0.3], s: [1, 1, 0.3] }, 5);
  eyes(b, g, pupils, 0.17, 0.42, 1.08, 0.09, bolt, 4);
  g.box(0.1, 0.5, 0.05, bolt, { p: [0.05, -0.05, 0.62], r: [0, 0, 0.42], gain: 4.4 });
  g.box(0.1, 0.44, 0.05, bolt, { p: [-0.06, -0.3, 0.52], r: [0, 0, -0.42], gain: 4.4 });
  const memb: C2 = [0x24346c, 0x8cacf0];
  const spark = (side: number) => {
    const m = new MB();
    m.box(0.95, 0.03, 0.07, bolt, { p: [side * 0.98, 0.09, -0.1], r: [0, side * 0.3, 0], gain: 3.4 });
    return m;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], pupils), P('none', [0, 0, 0], g, true),
      PL('wingL', [0, 0.14, 0], wing(-1, memb, 0x1c2a58, 1.8, 1.25)), PL('wingR', [0, 0.14, 0], wing(1, memb, 0x1c2a58, 1.8, 1.25)),
      PL('wingL', [0, 0.14, 0], spark(-1), true), PL('wingR', [0, 0.14, 0], spark(1), true)],
    flyHeight: 4.4, hop: 0, height: 1.5, accent: bolt,
  };
}

const builders: Record<EnemyId, () => Rig> = { gloomling, swiftclaw, bristleboar, duskmoth, ironhusk, shade, mireshaman, sporeback, gargoyle, colossus, veilwraith, runegolem, bogbloat, glasswing, cinderwight, broodmother, rimewarden, dunereaver, ashregent, stormharrow };

export function inkEnemyRig(id: EnemyId): Rig {
  return builders[id]();
}

/** Hero and guards: big head and shoulders, with the same part layout and pivots as the classic humanoid. */
export function inkHumanoid(primary: C2, secondary: number, cape: C2, helmetGold: boolean, lantern: boolean): HumanoidGeo {
  const armor: C2 = [0x8a8aa8, 0xf4f0ea];
  const gold: C2 = [0xc98a2c, 0xffd36b];
  const body = new MB();
  body.lathe([[0.5, 0.72], [0.62, 1.1], [0.56, 1.46], [0.3, 1.66], [0, 1.72]], armor, { s: [1, 1, 0.84] }, 12);
  body.lathe([[0.56, 0.36], [0.5, 0.78], [0, 0.82]], primary, { s: [1, 1, 0.86] }, 12);
  body.torus(0.5, 0.075, gold, { p: [0, 0.82, 0], r: RING, s: [1, 0.86, 1] }, 6, 16);
  for (const s of [-1, 1]) body.sphere(0.36, armor, { p: [s * 0.62, 1.5, 0], s: [1.08, 0.76, 1.08] }, 10, 8);
  // A cape thick enough to hold an outline.
  body.sphere(0.76, cape, { p: [0, 0.98, -0.3], s: [1.02, 1.1, 0.36], wobble: 0.025 }, 12, 9);
  const head = new MB();
  head.sphere(0.44, 0xf0bd92, { p: [0, 0.3, 0.03] }, 14, 10);
  for (const s of [-1, 1]) head.sphere(0.058, 0x1b1012, { p: [s * 0.17, 0.3, 0.44], s: [0.85, 1.3, 0.5] }, 8, 6);
  if (helmetGold) {
    head.lathe([[0.49, 0.28], [0.5, 0.52], [0.34, 0.76], [0, 0.84]], gold, { p: [0, 0, -0.02] }, 12);
    head.cone(0.14, 0.72, secondary, { p: [0, 1.08, -0.14], r: [-0.3, 0, 0] }, 7);
  } else {
    head.lathe([[0.49, 0.26], [0.49, 0.52], [0.3, 0.74], [0, 0.78]], armor, { p: [0, 0, -0.02] }, 12);
    head.cone(0.1, 0.42, secondary, { p: [0, 0.94, -0.04], s: [0.5, 1, 1.5] }, 6);
  }
  const armL = new MB();
  armL.cyl(0.13, 0.15, 0.7, armor, { p: [0, -0.34, 0] }, 8);
  const armR = new MB();
  armR.cyl(0.13, 0.15, 0.7, armor, { p: [0, -0.34, 0] }, 8);
  armR.box(0.5, 0.11, 0.16, gold, { p: [0, -0.74, 0.15], r: [1.15, 0, 0] });
  armR.box(0.17, 1.55, 0.32, [0xa0a6c0, 0xffffff], { p: [0, -0.48, 0.92], r: [1.15, 0, 0], flat: true });
  const glow = new MB();
  const glowArm = new MB();
  if (lantern) {
    armL.torus(0.15, 0.03, gold, { p: [0.02, -0.82, 0.04] }, 5, 10);
    armL.cyl(0.2, 0.2, 0.08, gold, { p: [0.02, -0.92, 0.04] }, 8);
    armL.cyl(0.2, 0.2, 0.08, gold, { p: [0.02, -1.4, 0.04] }, 8);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      armL.cyl(0.024, 0.024, 0.5, gold, { p: [0.02 + Math.cos(a) * 0.17, -1.16, 0.04 + Math.sin(a) * 0.17] }, 4);
    }
    glowArm.sphere(0.17, [0xff9a2e, 0xffeaa4], { p: [0.02, -1.16, 0.04], gain: 5, s: [1, 1.2, 1] }, 9, 7);
  } else {
    armL.lathe([[0, 0.07], [0.56, 0], [0.6, -0.05]], [0x9c2e2e, 0xe0604c], { p: [-0.04, -0.46, 0.22], r: RING, s: [1, 1, 1.2] }, 12);
    glow.sphere(0.03, 0xffeaa4, { p: [0, 0.9, 0], gain: 1 }, 4, 3);
    glowArm.sphere(0.09, 0xffc36b, { p: [-0.04, -0.46, 0.31], gain: 4 }, 6, 5);
  }
  if (glow.empty) glow.sphere(0.001, 0, {}, 3, 2);
  const leg = () => {
    const l = new MB();
    l.cyl(0.18, 0.15, 0.56, primary, { p: [0, -0.28, 0] }, 8);
    l.sphere(0.19, 0x5c3e24, { p: [0, -0.55, 0.06], s: [1, 0.7, 1.45] }, 8, 6);
    return l;
  };
  return { body: body.build(), head: head.build(), armR: armR.build(), armL: armL.build(), legL: leg().build(), legR: leg().build(), glow: glow.build(), glowArm: glowArm.build() };
}

/** Sable: a lean hooded huntress with a longbow instead of a sword and lantern. */
export function inkSable(): HumanoidGeo {
  const leather: C2 = [0x3a4a26, 0x7f9a44];
  const cloak: C2 = [0x24402c, 0x4f8a50];
  const gold: C2 = [0xc98a2c, 0xffd36b];
  const body = new MB();
  body.lathe([[0.44, 0.72], [0.52, 1.1], [0.46, 1.46], [0.26, 1.66], [0, 1.72]], leather, { s: [1, 1, 0.8] }, 12);
  body.lathe([[0.5, 0.36], [0.44, 0.78], [0, 0.82]], [0x4a3218, 0x8a6030], { s: [1, 1, 0.86] }, 12);
  body.torus(0.45, 0.06, gold, { p: [0, 0.82, 0], r: RING, s: [1, 0.86, 1] }, 6, 16);
  body.sphere(0.72, cloak, { p: [0, 1.0, -0.26], s: [0.96, 1.14, 0.3], wobble: 0.03 }, 12, 9);
  // A quiver bristling over the shoulder.
  body.cyl(0.14, 0.12, 0.9, [0x5a3519, 0x9c6631], { p: [0.22, 1.4, -0.34], r: [-0.25, 0, -0.35] }, 8);
  for (let i = 0; i < 3; i++) body.cone(0.05, 0.28, 0xff6a5a, { p: [0.36 + i * 0.04, 1.96, -0.46 + i * 0.05], r: [-0.25, 0, -0.35] }, 4);
  const head = new MB();
  head.sphere(0.42, 0xe8b48c, { p: [0, 0.3, 0.03] }, 14, 10);
  for (const s of [-1, 1]) head.sphere(0.056, 0x1b1012, { p: [s * 0.16, 0.3, 0.42], s: [0.85, 1.3, 0.5] }, 8, 6);
  // A deep pointed hood.
  head.sphere(0.5, cloak, { p: [0, 0.38, -0.08], s: [1, 1.02, 1] }, 12, 9);
  head.cone(0.26, 0.62, cloak, { p: [0, 0.82, -0.3], r: [-0.65, 0, 0] }, 8);
  head.sphere(0.36, 0xe8b48c, { p: [0, 0.27, 0.2], s: [1, 0.9, 0.7] }, 12, 8);
  for (const s of [-1, 1]) head.sphere(0.056, 0x1b1012, { p: [s * 0.15, 0.3, 0.44], s: [0.85, 1.3, 0.5] }, 8, 6);
  const armL = new MB();
  armL.cyl(0.11, 0.13, 0.7, leather, { p: [0, -0.34, 0] }, 8);
  const armR = new MB();
  armR.cyl(0.11, 0.13, 0.7, leather, { p: [0, -0.34, 0] }, 8);
  // The longbow, held out in front.
  armR.torus(0.82, 0.05, [0x5a3519, 0xc08a48], { p: [0, -0.68, 0.34], r: [0, Math.PI / 2, 0], s: [0.45, 1, 1] }, 6, 18);
  armR.cyl(0.012, 0.012, 1.6, 0xfff4d6, { p: [0, -0.68, 0.34] }, 4);
  const glow = new MB();
  glow.sphere(0.03, 0xc8ff8a, { p: [0, 0.9, 0], gain: 1 }, 4, 3);
  const glowArm = new MB();
  glowArm.sphere(0.07, 0xc8ff8a, { p: [0.02, -0.82, 0.04], gain: 3.4 }, 6, 5);
  const leg = () => {
    const l = new MB();
    l.cyl(0.16, 0.13, 0.56, [0x4a3218, 0x8a6030], { p: [0, -0.28, 0] }, 8);
    l.sphere(0.17, 0x3a2614, { p: [0, -0.55, 0.06], s: [1, 0.7, 1.45] }, 8, 6);
    return l;
  };
  return { body: body.build(), head: head.build(), armR: armR.build(), armL: armL.build(), legL: leg().build(), legR: leg().build(), glow: glow.build(), glowArm: glowArm.build() };
}

/** Oakheart: a broad, bark-and-stone guardian with a great maul and a slab of a shield. */
export function inkOakheart(): HumanoidGeo {
  const bark: C2 = [0x4a3018, 0x93663a];
  const stone: C2 = [0x5f6a68, 0xb4c0b4];
  const moss: C2 = [0x3a6a30, 0x86c060];
  const body = new MB();
  body.lathe([[0.62, 0.7], [0.82, 1.1], [0.8, 1.5], [0.42, 1.74], [0, 1.8]], bark, { s: [1, 1, 0.9], wobble: 0.03, wobbleFreq: 3 }, 12);
  body.lathe([[0.66, 0.34], [0.6, 0.78], [0, 0.82]], stone, { s: [1, 1, 0.88], wobble: 0.02 }, 12);
  for (const s of [-1, 1]) {
    body.ico(0.46, stone, { p: [s * 0.8, 1.56, 0], s: [1.1, 0.8, 1.1], wobble: 0.03 }, 0);
    body.sphere(0.34, moss, { p: [s * 0.8, 1.84, 0], s: [1.1, 0.5, 1.1], wobble: 0.05, wobbleFreq: 4 }, 9, 6);
  }
  body.box(0.86, 0.72, 0.2, stone, { p: [0, 1.22, 0.62], wobble: 0.02, flat: true });
  const head = new MB();
  head.sphere(0.44, bark, { p: [0, 0.3, 0.03], wobble: 0.02 }, 14, 10);
  for (const s of [-1, 1]) {
    head.sphere(0.075, 0xc8ffb0, { p: [s * 0.17, 0.34, 0.42], s: [0.9, 1.1, 0.5], gain: 1.4 }, 8, 6);
    head.cone(0.08, 0.5, bark, { p: [s * 0.3, 0.82, -0.04], r: [-0.12, 0, s * -0.42] }, 6);
  }
  // A beard of moss.
  head.sphere(0.34, moss, { p: [0, 0.06, 0.28], s: [1.05, 0.9, 0.7], wobble: 0.05, wobbleFreq: 5 }, 10, 7);
  head.sphere(0.4, moss, { p: [0, 0.68, -0.02], s: [1.1, 0.42, 1.1], wobble: 0.05, wobbleFreq: 4 }, 10, 6);
  const armL = new MB();
  armL.cyl(0.17, 0.2, 0.7, bark, { p: [0, -0.34, 0] }, 8);
  armL.box(1.08, 1.32, 0.22, stone, { p: [-0.05, -0.56, 0.3], wobble: 0.03, flat: true });
  armL.box(0.82, 0.14, 0.26, moss, { p: [-0.05, -0.06, 0.31], wobble: 0.04, wobbleFreq: 4 });
  const armR = new MB();
  armR.cyl(0.17, 0.2, 0.7, bark, { p: [0, -0.34, 0] }, 8);
  armR.cyl(0.07, 0.08, 1.7, [0x4a3018, 0x93663a], { p: [0, -0.5, 0.74], r: [1.15, 0, 0] }, 7);
  armR.box(0.82, 0.62, 0.62, stone, { p: [0, -0.15, 1.5], r: [1.15, 0, 0], wobble: 0.03, flat: true });
  const glow = new MB();
  glow.sphere(0.03, 0xc8ffb0, { p: [0, 0.9, 0], gain: 1 }, 4, 3);
  const glowArm = new MB();
  glowArm.box(0.3, 0.3, 0.04, 0x9dff8a, { p: [-0.05, -0.56, 0.42], gain: 3 });
  const leg = () => {
    const l = new MB();
    l.cyl(0.26, 0.22, 0.56, bark, { p: [0, -0.28, 0] }, 8);
    l.ico(0.27, stone, { p: [0, -0.55, 0.08], s: [1.1, 0.7, 1.4] }, 0);
    return l;
  };
  return { body: body.build(), head: head.build(), armR: armR.build(), armL: armL.build(), legL: leg().build(), legR: leg().build(), glow: glow.build(), glowArm: glowArm.build() };
}
