// Enemy rigs (rendered with instancing, one instanced mesh per moving part), hero, guards, lantern, rift.
import * as THREE from 'three';
import { inkEnemyRig, inkHumanoid } from './ink-creatures';
import type { HeroId } from '../data/meta';
import { INK } from './style';
import { heroEmber, heroOakheart, heroSable } from './hero-models';
import type { EnemyId } from '../data/enemies';
import { MB } from './mb';

export type PartAnim = 'none' | 'legA' | 'legB' | 'wingL' | 'wingR' | 'armA' | 'armB' | 'head' | 'tail';

export interface RigPart {
  geo: THREE.BufferGeometry;
  glow: boolean;
  metal?: boolean;
  anim: PartAnim;
  pivot: [number, number, number];
}

export interface Rig {
  parts: RigPart[];
  /** Height above ground for flyers, 0 for walkers. */
  flyHeight: number;
  hop: number;
  height: number;
  accent: number;
}

/** Part whose geometry is authored in body space; recentred on its pivot. */
function P(anim: PartAnim, pivot: [number, number, number], m: MB, glow = false): RigPart {
  const geo = m.build();
  geo.translate(-pivot[0], -pivot[1], -pivot[2]);
  return { geo, glow, anim, pivot };
}

/** Part whose geometry is already authored relative to its pivot. */
function PL(anim: PartAnim, pivot: [number, number, number], m: MB, glow = false): RigPart {
  return { geo: m.build(), glow, anim, pivot };
}

function legPair(a: [number, number, number][], col: [number, number], len: number, rad: number) {
  const m = new MB();
  for (const [x, y, z] of a) {
    m.cyl(rad, rad * 0.7, len, col, { p: [x, y - len / 2, z] }, 7);
    m.sphere(rad * 1.05, col[0], { p: [x, y - len + 0.02, z + rad * 0.3], s: [1, 0.6, 1.5] }, 7, 5);
  }
  return m;
}

function gloomling(): Rig {
  const dark: [number, number] = [0x2b1e47, 0x644a9a];
  const b = new MB();
  b.sphere(0.5, dark, { p: [0, 0.68, 0], s: [1, 0.96, 1.02], wobble: 0.04, puff: 0.3 }, 14, 10);
  b.cone(0.13, 0.42, [0x8b6fd0, 0xe6dcff], { p: [-0.27, 1.15, 0.03], r: [0.2, 0, 0.35] }, 7);
  b.cone(0.13, 0.42, [0x8b6fd0, 0xe6dcff], { p: [0.27, 1.15, 0.03], r: [0.2, 0, -0.35] }, 7);
  for (const s of [-1, 1]) b.sphere(0.13, dark[0], { p: [s * 0.48, 0.62, 0.1], s: [0.8, 1.3, 0.8] }, 7, 5);
  const g = new MB();
  g.sphere(0.135, 0xffdd55, { p: [-0.19, 0.78, 0.42], gain: 3.4, s: [1, 1.2, 0.6] }, 8, 6);
  g.sphere(0.135, 0xffdd55, { p: [0.19, 0.78, 0.42], gain: 3.4, s: [1, 1.2, 0.6] }, 8, 6);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.3, 0], legPair([[-0.22, 0.3, 0]], dark, 0.27, 0.11)),
      P('legB', [0, 0.3, 0], legPair([[0.22, 0.3, 0]], dark, 0.27, 0.11))],
    flyHeight: 0, hop: 0.16, height: 1.5, accent: 0x9c7bff,
  };
}

function swiftclaw(): Rig {
  const fur: [number, number] = [0x25253f, 0x5b5f92];
  const b = new MB();
  b.sphere(0.42, fur, { p: [0, 0.74, 0], s: [0.82, 0.82, 1.7], wobble: 0.03 }, 12, 9);
  for (let i = 0; i < 4; i++) b.cone(0.1, 0.36 - i * 0.03, 0x9398c8, { p: [0, 1.08 - i * 0.03, 0.42 - i * 0.3], r: [-0.3, 0, 0] }, 5);
  const h = new MB();
  h.sphere(0.32, fur, { p: [0, 0.1, 0.1], s: [0.92, 0.9, 1.2] }, 10, 8);
  h.cone(0.2, 0.58, fur, { p: [0, 0.03, 0.5], r: [Math.PI / 2, 0, 0] }, 7);
  h.cone(0.1, 0.36, 0x7e83b6, { p: [-0.18, 0.42, 0], r: [0.1, 0, 0.2] }, 5);
  h.cone(0.1, 0.36, 0x7e83b6, { p: [0.18, 0.42, 0], r: [0.1, 0, -0.2] }, 5);
  const g = new MB();
  g.sphere(0.07, 0x7dfff3, { p: [-0.17, 1.03, 0.82], gain: 4 }, 6, 5);
  g.sphere(0.07, 0x7dfff3, { p: [0.17, 1.03, 0.82], gain: 4 }, 6, 5);
  const tail = new MB();
  tail.cone(0.12, 0.85, fur, { p: [0, 0, -0.42], r: [-Math.PI / 2, 0, 0] }, 6);
  return {
    parts: [P('none', [0, 0, 0], b), PL('head', [0, 0.9, 0.62], h), P('head', [0, 0.9, 0.62], g, true), PL('tail', [0, 0.88, -0.65], tail),
      P('legA', [0, 0.55, 0], legPair([[-0.2, 0.55, 0.5], [0.2, 0.55, -0.5]], fur, 0.45, 0.085)),
      P('legB', [0, 0.55, 0], legPair([[0.2, 0.55, 0.5], [-0.2, 0.55, -0.5]], fur, 0.45, 0.085))],
    flyHeight: 0, hop: 0.1, height: 1.4, accent: 0x7dfff3,
  };
}

function bristleboar(): Rig {
  const hide: [number, number] = [0x3a2433, 0x7a4a5e];
  const bone: [number, number] = [0xbdae8f, 0xf2e8cf];
  const b = new MB();
  b.sphere(0.72, hide, { p: [0, 0.92, -0.1], s: [0.95, 0.9, 1.3], wobble: 0.05 }, 14, 10);
  b.sphere(0.46, hide, { p: [0, 0.85, 0.82], s: [0.9, 0.86, 1.1] }, 12, 9);
  b.cyl(0.2, 0.24, 0.3, 0x8a5d6f, { p: [0, 0.74, 1.3], r: [Math.PI / 2, 0, 0] }, 9);
  for (const s of [-1, 1]) b.cone(0.07, 0.56, bone, { p: [s * 0.27, 0.86, 1.2], r: [-0.65, 0, s * -0.2] }, 6);
  // Overlapping bone plates down the back.
  for (let i = 0; i < 5; i++) {
    b.cone(0.26 - i * 0.012, 0.6, bone, { p: [0, 1.56 - Math.abs(i - 1.5) * 0.08, 0.5 - i * 0.36], r: [-0.42, 0, 0], s: [0.85, 1, 0.5] }, 6);
    for (const s of [-1, 1]) b.cone(0.14, 0.42, bone, { p: [s * 0.46, 1.36 - Math.abs(i - 1.5) * 0.06, 0.44 - i * 0.36], r: [-0.3, 0, s * -0.7], s: [0.8, 1, 0.5] }, 5);
  }
  const g = new MB();
  g.sphere(0.075, 0xff5a3c, { p: [-0.22, 1.02, 1.1], gain: 4.5 }, 6, 5);
  g.sphere(0.075, 0xff5a3c, { p: [0.22, 1.02, 1.1], gain: 4.5 }, 6, 5);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.5, 0], legPair([[-0.42, 0.5, 0.48], [0.42, 0.5, -0.6]], hide, 0.42, 0.14)),
      P('legB', [0, 0.5, 0], legPair([[0.42, 0.5, 0.48], [-0.42, 0.5, -0.6]], hide, 0.42, 0.14))],
    flyHeight: 0, hop: 0.05, height: 1.9, accent: 0xff5a3c,
  };
}

function wing(side: number, membrane: [number, number], bone: number, span: number, chord: number) {
  const m = new MB();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.25 * chord);
  shape.quadraticCurveTo(span * 0.6, chord * 0.95, span, chord * 0.42);
  shape.quadraticCurveTo(span * 0.78, chord * 0.02, span * 0.86, -chord * 0.42);
  shape.quadraticCurveTo(span * 0.42, -chord * 0.38, 0, -0.25 * chord);
  shape.closePath();
  const geo = new THREE.ShapeGeometry(shape, 10);
  geo.rotateX(-Math.PI / 2);
  // Duplicate reversed faces so both sides render and light correctly.
  const pos = geo.getAttribute('position').array as Float32Array;
  const idx = geo.index!.array;
  const verts: number[] = [];
  const nrm: number[] = [];
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i], b = idx[i + 1], c = idx[i + 2];
    for (const v of [a, b, c]) { verts.push(pos[v * 3] * side, pos[v * 3 + 1], pos[v * 3 + 2]); nrm.push(0, 1, 0); }
    for (const v of [c, b, a]) { verts.push(pos[v * 3] * side, pos[v * 3 + 1] - 0.012, pos[v * 3 + 2]); nrm.push(0, -1, 0); }
  }
  const g2 = new THREE.BufferGeometry();
  g2.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  g2.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  m.add(g2, membrane);
  m.cyl(0.03, 0.05, span * 0.95, bone, { p: [side * span * 0.47, 0.01, chord * 0.26], r: [0, 0, Math.PI / 2 + side * 0.02] }, 5);
  return m;
}

function duskmoth(): Rig {
  const b = new MB();
  b.sphere(0.25, [0x3d2a5e, 0xa08bdc], { s: [0.8, 0.8, 2], p: [0, 0, 0] }, 10, 8);
  b.sphere(0.22, [0x6d5ca8, 0xe8e0ff], { p: [0, 0.05, 0.42], wobble: 0.04, wobbleFreq: 8 }, 9, 7);
  const g = new MB();
  g.sphere(0.08, 0xff9cf3, { p: [-0.13, 0.08, 0.58], gain: 3.6 }, 6, 5);
  g.sphere(0.08, 0xff9cf3, { p: [0.13, 0.08, 0.58], gain: 3.6 }, 6, 5);
  const memb: [number, number] = [0x53367f, 0xa578d8];
  const wl = wing(-1, memb, 0x2c1e49, 1.15, 0.92);
  const wr = wing(1, memb, 0x2c1e49, 1.15, 0.92);
  const gl = new MB();
  gl.sphere(0.16, 0xff9cf3, { p: [-0.66, 0.02, 0.05], s: [1, 0.1, 1], gain: 3 }, 9, 5);
  const gr = new MB();
  gr.sphere(0.16, 0xff9cf3, { p: [0.66, 0.02, 0.05], s: [1, 0.1, 1], gain: 3 }, 9, 5);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), P('wingL', [0, 0, 0], wl), P('wingR', [0, 0, 0], wr),
      P('wingL', [0, 0, 0], gl, true), P('wingR', [0, 0, 0], gr, true)],
    flyHeight: 3.4, hop: 0, height: 0.9, accent: 0xff9cf3,
  };
}

function ironhusk(): Rig {
  const steel: [number, number] = [0x3b3f50, 0x848aa1];
  const trim = 0xa77b39;
  const b = new MB();
  b.lathe([[0.42, 0.75], [0.6, 1.3], [0.6, 1.62], [0.32, 1.84], [0, 1.86]], steel, { s: [1, 1, 0.82] }, 10);
  b.sphere(0.3, steel, { p: [-0.62, 1.68, 0], s: [1.1, 0.72, 1.1] }, 9, 7);
  b.sphere(0.3, steel, { p: [0.62, 1.68, 0], s: [1.1, 0.72, 1.1] }, 9, 7);
  for (const s of [-1, 1]) b.cone(0.1, 0.34, 0xc9c5c0, { p: [s * 0.7, 1.96, 0], r: [0, 0, s * -0.3] }, 6);
  b.lathe([[0.3, 1.82], [0.31, 2.2], [0.23, 2.4], [0, 2.46]], steel, {}, 9);
  b.torus(0.31, 0.03, trim, { p: [0, 1.92, 0], r: [Math.PI / 2, 0, 0] }, 5, 12);
  b.torus(0.55, 0.03, trim, { p: [0, 1.32, 0], r: [Math.PI / 2, 0, 0], s: [1, 0.82, 1] }, 5, 14);
  const g = new MB();
  g.box(0.42, 0.06, 0.04, 0xff4f88, { p: [0, 2.16, 0.29], gain: 5 });
  const shield = new MB();
  shield.lathe([[0, 0.05], [0.48, 0], [0.5, -0.04]], [0x5b4a44, 0x8f6d4b], { r: [Math.PI / 2, 0, 0], s: [1, 1, 1.25] }, 9);
  shield.cone(0.09, 0.2, trim, { p: [0, 0, 0.14], r: [Math.PI / 2, 0, 0] }, 6);
  shield.cyl(0.05, 0.05, 0.1, steel, { p: [0, 0, -0.05], r: [Math.PI / 2, 0, 0] }, 5);
  const sword = new MB();
  sword.box(0.08, 1.4, 0.18, [0x8a8fa8, 0xdde1ef], { p: [0, 0.65, 0.38], r: [0.55, 0, 0] });
  sword.box(0.42, 0.08, 0.1, trim, { p: [0, 0.03, 0.02] });
  sword.cyl(0.12, 0.14, 0.72, steel, { p: [0, -0.18, 0] }, 7);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      PL('armA', [-0.68, 1.15, 0.34], shield),
      PL('armB', [0.68, 1.15, 0.2], sword),
      P('legA', [0, 0.82, 0], legPair([[-0.26, 0.82, 0]], steel, 0.74, 0.17)),
      P('legB', [0, 0.82, 0], legPair([[0.26, 0.82, 0]], steel, 0.74, 0.17))],
    flyHeight: 0, hop: 0.03, height: 2.6, accent: 0xff4f88,
  };
}

function shade(): Rig {
  const cloak: [number, number] = [0x101631, 0x3d4d8c];
  const b = new MB();
  b.lathe([[0.82, 0.05], [0.72, 0.03], [0.6, 0.7], [0.42, 1.4], [0.42, 1.66], [0.3, 2.06], [0.08, 2.24], [0, 2.26]], cloak, { wobble: 0.05, wobbleFreq: 2.2 }, 12);
  b.sphere(0.26, 0x070a1c, { p: [0, 1.7, 0.21], s: [1, 1.1, 0.75] }, 9, 7);
  const g = new MB();
  g.sphere(0.07, 0x65f0ff, { p: [-0.1, 1.73, 0.42], gain: 5, s: [1, 0.7, 0.5] }, 6, 5);
  g.sphere(0.07, 0x65f0ff, { p: [0.1, 1.73, 0.42], gain: 5, s: [1, 0.7, 0.5] }, 6, 5);
  g.torus(0.62, 0.016, 0x65f0ff, { p: [0, 0.75, 0], r: [Math.PI / 2, 0, 0], gain: 2.4 }, 5, 20);
  const a1 = new MB();
  a1.cone(0.17, 1, cloak, { p: [0, -0.4, 0.1], r: [Math.PI + 0.2, 0, 0] }, 7);
  const a2 = new MB();
  a2.cone(0.17, 1, cloak, { p: [0, -0.4, 0.1], r: [Math.PI + 0.2, 0, 0] }, 7);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armA', [-0.48, 1.45, 0], a1), PL('armB', [0.48, 1.45, 0], a2)],
    flyHeight: 0, hop: 0.13, height: 2.3, accent: 0x65f0ff,
  };
}

function mireshaman(): Rig {
  const robe: [number, number] = [0x2b3c26, 0x6d8a48];
  const b = new MB();
  b.lathe([[0.62, 0.05], [0.56, 0.72], [0.44, 1.28], [0.28, 1.6], [0, 1.68]], robe, { r: [0.2, 0, 0], wobble: 0.04, wobbleFreq: 2 }, 11);
  b.sphere(0.42, [0x4a3b24, 0x7f6e41], { p: [0, 1.5, 0.05], s: [1.25, 0.65, 1.2], wobble: 0.08, wobbleFreq: 4 }, 10, 7);
  // A carved bone mask with antlers.
  b.lathe([[0.27, -0.26], [0.32, 0], [0.24, 0.26], [0, 0.32]], [0xc9bc92, 0xf2ead0], { p: [0, 1.75, 0.38], r: [Math.PI / 2 - 0.1, 0, 0], s: [1, 0.35, 1] }, 9);
  for (const s of [-1, 1]) {
    b.cone(0.06, 0.8, 0xc9bc92, { p: [s * 0.3, 2.28, 0.25], r: [-0.15, 0, s * -0.42] }, 5);
    b.cone(0.04, 0.42, 0xc9bc92, { p: [s * 0.48, 2.38, 0.25], r: [-0.15, 0, s * -1.1] }, 5);
  }
  const g = new MB();
  g.sphere(0.058, 0x9dff5a, { p: [-0.1, 1.78, 0.54], gain: 5 }, 6, 5);
  g.sphere(0.058, 0x9dff5a, { p: [0.1, 1.78, 0.54], gain: 5 }, 6, 5);
  const staff = new MB();
  staff.cyl(0.04, 0.05, 2.3, [0x3a2a1a, 0x7e5c33], { p: [0, 0.2, 0.05], wobble: 0.02 }, 6);
  const staffGlow = new MB();
  staffGlow.ico(0.17, [0x8dff3f, 0xe6ffb0], { p: [0, 1.5, 0.05], gain: 4.5 }, 0);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armB', [0.58, 0.95, 0.25], staff), PL('armB', [0.58, 0.95, 0.25], staffGlow, true)],
    flyHeight: 0, hop: 0.08, height: 2.4, accent: 0x9dff5a,
  };
}

function sporeback(): Rig {
  const b = new MB();
  const flesh: [number, number] = [0x3a2c45, 0x7d6377];
  b.sphere(0.88, flesh, { p: [0, 1.0, -0.05], s: [1, 0.86, 1.2], wobble: 0.1, wobbleFreq: 1.6, puff: 0.3 }, 14, 11);
  b.sphere(0.36, flesh, { p: [0, 0.82, 0.96], s: [1.05, 0.8, 1] }, 10, 8);
  const caps = [[0.3, 1.82, 0.2, 0.46], [-0.42, 1.68, -0.3, 0.38], [0.25, 1.64, -0.62, 0.32], [-0.1, 1.86, 0.48, 0.24], [0.55, 1.36, 0.1, 0.23]];
  const g = new MB();
  for (const [x, y, z, r] of caps) {
    b.cyl(r * 0.25, r * 0.34, r * 0.8, 0xe2d6bd, { p: [x, y, z] }, 7);
    b.sphere(r, [0xa33b5b, 0xe96f8f], { p: [x, y + r * 0.42, z], s: [1, 0.55, 1] }, 11, 7);
    g.sphere(r * 0.2, 0xffd25a, { p: [x + r * 0.42, y + r * 0.62, z + r * 0.2], gain: 3.4 }, 5, 4);
    g.sphere(r * 0.16, 0xffd25a, { p: [x - r * 0.38, y + r * 0.66, z - r * 0.25], gain: 3.4 }, 5, 4);
  }
  g.sphere(0.075, 0xffd25a, { p: [-0.17, 0.96, 1.23], gain: 5 }, 6, 5);
  g.sphere(0.075, 0xffd25a, { p: [0.17, 0.96, 1.23], gain: 5 }, 6, 5);
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      P('legA', [0, 0.45, 0], legPair([[-0.52, 0.45, 0.55], [0.52, 0.45, -0.55]], flesh, 0.38, 0.17)),
      P('legB', [0, 0.45, 0], legPair([[0.52, 0.45, 0.55], [-0.52, 0.45, -0.55]], flesh, 0.38, 0.17))],
    flyHeight: 0, hop: 0.05, height: 2.1, accent: 0xffd25a,
  };
}

function gargoyle(): Rig {
  const rock: [number, number] = [0x4f4d5a, 0x96929e];
  const b = new MB();
  b.sphere(0.48, rock, { s: [0.9, 0.85, 1.32], wobble: 0.05 }, 11, 8);
  b.sphere(0.32, rock, { p: [0, 0.2, 0.62], wobble: 0.03 }, 10, 8);
  b.cone(0.13, 0.26, rock[1], { p: [0, 0.14, 0.92], r: [Math.PI / 2, 0, 0] }, 6);
  for (const s of [-1, 1]) {
    b.cone(0.08, 0.5, 0xd9cdb5, { p: [s * 0.22, 0.56, 0.48], r: [-0.65, 0, s * -0.2] }, 6);
    b.cone(0.09, 0.56, rock, { p: [s * 0.32, -0.42, 0.25], r: [Math.PI, 0, 0] }, 6);
  }
  b.cone(0.12, 1.15, rock, { p: [0, 0.02, -0.98], r: [-Math.PI / 2, 0, 0] }, 6);
  const g = new MB();
  g.sphere(0.07, 0xffb13c, { p: [-0.14, 0.27, 0.86], gain: 4.5 }, 6, 5);
  g.sphere(0.07, 0xffb13c, { p: [0.14, 0.27, 0.86], gain: 4.5 }, 6, 5);
  const memb: [number, number] = [0x3b3844, 0x6f6978];
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true),
      PL('wingL', [0, 0.14, 0], wing(-1, memb, 0x4f4d5a, 1.7, 1.1)), PL('wingR', [0, 0.14, 0], wing(1, memb, 0x4f4d5a, 1.7, 1.1))],
    flyHeight: 4.2, hop: 0, height: 1.2, accent: 0xffb13c,
  };
}

function colossus(): Rig {
  const rock: [number, number] = [0x2a2438, 0x6d6280];
  const b = new MB();
  b.ico(1.05, rock, { p: [0, 2.5, 0], s: [1.15, 1, 0.95], wobble: 0.11 }, 2);
  b.ico(0.72, rock, { p: [0, 1.4, 0], s: [1.05, 0.7, 0.85], wobble: 0.08 }, 1);
  b.ico(0.42, rock, { p: [0, 3.55, 0.3], wobble: 0.04 }, 1);
  for (const [x, y, z, r] of [[-0.75, 3.1, -0.3, 0.38], [0.7, 3.2, -0.35, 0.34], [0.2, 3.3, -0.65, 0.3], [-0.2, 1.9, 0.6, 0.2], [0.3, 2.9, 0.72, 0.16]]) {
    b.crystal(r * 0.75, r * 2.5, [0x5b3fa8, 0xbfa3ff], { p: [x, y, z], r: [z * 0.4, 0, -x * 0.42] });
  }
  const g = new MB();
  g.sphere(0.13, 0xff4fd8, { p: [-0.16, 3.6, 0.65], gain: 6, s: [1.2, 0.6, 0.5] }, 7, 5);
  g.sphere(0.13, 0xff4fd8, { p: [0.16, 3.6, 0.65], gain: 6, s: [1.2, 0.6, 0.5] }, 7, 5);
  g.ico(0.36, [0xff4fd8, 0xffc4f2], { p: [0, 2.48, 0.86], gain: 3.6, s: [1, 1, 0.4] }, 1);
  const makeArm = () => {
    const a = new MB();
    a.ico(0.5, rock, { p: [0, -0.15, 0], wobble: 0.04 }, 1);
    a.ico(0.42, rock, { p: [0, -0.95, 0.05], s: [0.9, 1.35, 0.9], wobble: 0.05 }, 1);
    a.ico(0.58, rock, { p: [0, -1.82, 0.1], wobble: 0.07 }, 1);
    return a;
  };
  const makeLeg = (x: number) => {
    const a = new MB();
    a.ico(0.52, rock, { p: [x, 0.8, 0], s: [1, 1.55, 1], wobble: 0.06 }, 1);
    return a;
  };
  return {
    parts: [P('none', [0, 0, 0], b), P('none', [0, 0, 0], g, true), PL('armA', [-1.32, 3.1, 0], makeArm()), PL('armB', [1.32, 3.1, 0], makeArm()),
      P('legA', [0, 1.3, 0], makeLeg(-0.6)),
      P('legB', [0, 1.3, 0], makeLeg(0.6))],
    flyHeight: 0, hop: 0.02, height: 4.2, accent: 0xff4fd8,
  };
}

// The newer creatures share one model across both art styles.
const sharedRig = (id: EnemyId) => () => inkEnemyRig(id);
const builders: Record<EnemyId, () => Rig> = {
  gloomling, swiftclaw, bristleboar, duskmoth, ironhusk, shade, mireshaman, sporeback, gargoyle, colossus,
  veilwraith: sharedRig('veilwraith'), runegolem: sharedRig('runegolem'), bogbloat: sharedRig('bogbloat'), glasswing: sharedRig('glasswing'), cinderwight: sharedRig('cinderwight'),
  broodmother: sharedRig('broodmother'), rimewarden: sharedRig('rimewarden'), dunereaver: sharedRig('dunereaver'), ashregent: sharedRig('ashregent'), stormharrow: sharedRig('stormharrow'),
};
const rigCache = new Map<EnemyId, Rig>();
export function enemyRig(id: EnemyId): Rig {
  let r = rigCache.get(id);
  if (!r) { r = INK ? inkEnemyRig(id) : builders[id](); rigCache.set(id, r); }
  return r;
}

export interface HumanoidGeo {
  body: THREE.BufferGeometry;
  head: THREE.BufferGeometry;
  armR: THREE.BufferGeometry;
  armL: THREE.BufferGeometry;
  legL: THREE.BufferGeometry;
  legR: THREE.BufferGeometry;
  glow: THREE.BufferGeometry;
  glowArm: THREE.BufferGeometry;
  /** Unlit details on the head and the weapon arm (eyes, gems, runes). */
  glowHead?: THREE.BufferGeometry;
  glowArmR?: THREE.BufferGeometry;
}

function humanoid(primary: [number, number], secondary: number, cape: [number, number], helmetGold: boolean, lantern: boolean): HumanoidGeo {
  const armor: [number, number] = [0x8f8c9c, 0xe7e2dc];
  const gold = 0xe8b64c;
  const body = new MB();
  body.lathe([[0.42, 0.72], [0.5, 1.1], [0.46, 1.5], [0.27, 1.68], [0, 1.72]], armor, { s: [1, 1, 0.8] }, 10);
  body.lathe([[0.46, 0.4], [0.42, 0.78], [0, 0.82]], primary, { s: [1, 1, 0.84] }, 10);
  body.torus(0.42, 0.05, gold, { p: [0, 0.82, 0], r: [Math.PI / 2, 0, 0], s: [1, 0.82, 1] }, 5, 14);
  for (const s of [-1, 1]) body.sphere(0.25, armor, { p: [s * 0.52, 1.5, 0], s: [1.05, 0.72, 1.05] }, 8, 6);
  // A cape that flares behind the shoulders.
  const capeGeo = new THREE.CylinderGeometry(0.38, 0.72, 1.3, 10, 2, true, Math.PI * 0.62, Math.PI * 0.76);
  body.add(capeGeo, cape, { p: [0, 0.95, -0.14], wobble: 0.025 });
  const capeInner = new THREE.CylinderGeometry(0.37, 0.71, 1.3, 10, 2, true, Math.PI * 0.62, Math.PI * 0.76);
  capeInner.scale(-1, 1, 1);
  capeInner.computeVertexNormals();
  body.add(capeInner, cape, { p: [0, 0.95, -0.14] });

  const head = new MB();
  head.sphere(0.26, 0xe8bd97, { p: [0, 0.15, 0.02] }, 11, 9);
  if (helmetGold) {
    head.lathe([[0.29, 0.1], [0.3, 0.3], [0.2, 0.46], [0, 0.5]], [0xb3893c, 0xffd98a], {}, 10);
    head.cone(0.08, 0.52, secondary, { p: [0, 0.65, -0.1], r: [-0.3, 0, 0] }, 6);
    head.box(0.5, 0.05, 0.3, 0xffd98a, { p: [0, 0.14, 0.2] });
  } else {
    head.lathe([[0.29, 0.06], [0.29, 0.3], [0.17, 0.44], [0, 0.46]], armor, {}, 10);
    head.cone(0.22, 0.12, armor, { p: [0, 0.48, 0] }, 8);
  }
  const armL = new MB();
  armL.cyl(0.09, 0.11, 0.7, armor, { p: [0, -0.34, 0] }, 7);
  const armR = new MB();
  armR.cyl(0.09, 0.11, 0.7, armor, { p: [0, -0.34, 0] }, 7);
  armR.box(0.34, 0.07, 0.12, gold, { p: [0, -0.74, 0.15], r: [1.15, 0, 0] });
  armR.box(0.09, 1.25, 0.2, [0xa0a6c0, 0xfbfbff], { p: [0, -0.48, 0.74], r: [1.15, 0, 0], flat: true });
  const glow = new MB();
  const glowArm = new MB();
  if (lantern) {
    armL.torus(0.11, 0.02, gold, { p: [0.02, -0.82, 0.04] }, 5, 10);
    armL.cyl(0.14, 0.14, 0.05, gold, { p: [0.02, -0.9, 0.04] }, 8);
    armL.cyl(0.14, 0.14, 0.05, gold, { p: [0.02, -1.26, 0.04] }, 8);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      armL.cyl(0.012, 0.012, 0.36, gold, { p: [0.02 + Math.cos(a) * 0.12, -1.08, 0.04 + Math.sin(a) * 0.12] }, 4);
    }
    glowArm.sphere(0.12, [0xff9a2e, 0xffeaa4], { p: [0.02, -1.08, 0.04], gain: 6, s: [1, 1.2, 1] }, 9, 7);
  } else {
    armL.lathe([[0, 0.05], [0.42, 0], [0.45, -0.04]], [0x8d3232, 0xc7564a], { p: [-0.04, -0.46, 0.2], r: [Math.PI / 2, 0, 0], s: [1, 1, 1.2] }, 9);
    glow.sphere(0.03, 0xffeaa4, { p: [0, 0.9, 0], gain: 1 }, 4, 3);
    glowArm.sphere(0.06, 0xffc36b, { p: [-0.04, -0.46, 0.27], gain: 4.5 }, 6, 5);
  }
  if (glow.empty) glow.sphere(0.001, 0, {}, 3, 2);
  const legL = new MB();
  legL.cyl(0.13, 0.11, 0.56, primary, { p: [0, -0.28, 0] }, 7);
  legL.sphere(0.14, 0x4b3524, { p: [0, -0.55, 0.05], s: [1, 0.7, 1.45] }, 7, 5);
  const legR = new MB();
  legR.cyl(0.13, 0.11, 0.56, primary, { p: [0, -0.28, 0] }, 7);
  legR.sphere(0.14, 0x4b3524, { p: [0, -0.55, 0.05], s: [1, 0.7, 1.45] }, 7, 5);
  return { body: body.build(), head: head.build(), armR: armR.build(), armL: armL.build(), legL: legL.build(), legR: legR.build(), glow: glow.build(), glowArm: glowArm.build() };
}

const heroGeos = new Map<HeroId, HumanoidGeo>();
let guardGeo: HumanoidGeo | null = null;
export function getHeroGeo(id: HeroId = 'ember') {
  let g = heroGeos.get(id);
  if (!g) {
    g = id === 'sable' ? heroSable() : id === 'oakheart' ? heroOakheart() : heroEmber();
    heroGeos.set(id, g);
  }
  return g;
}
export const getGuardGeo = () => (guardGeo ??= (INK ? inkHumanoid : humanoid)([0x2f4f7a, 0x4a76ac], 0x6faee0, [0x223c64, 0x4178ad], false, false));

/** The Great Lantern at the end of every road. Returns geometry parts. */
export function lanternGeo() {
  const m = new MB();
  const metal = new MB();
  const core = new MB();
  const gold: [number, number] = [0xb07f2b, 0xffd98a];
  m.cyl(2.3, 2.7, 0.55, [0x6d6a72, 0x9d958d], { p: [0, 0.28, 0], wobble: 0.05 }, 16);
  m.cyl(1.75, 2.1, 0.5, [0x7c7770, 0xb1a899], { p: [0, 0.8, 0], wobble: 0.04 }, 14);
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    m.ico(0.35, [0x6d6a72, 0x9d958d], { p: [Math.cos(a) * 2.5, 0.25, Math.sin(a) * 2.5], s: [1.1, 0.8, 1.1] }, 0);
  }
  m.lathe([[1.25, 1.05], [0.64, 1.5], [0.46, 2.6], [0.72, 3.0], [0.98, 3.12], [0, 3.14]], [0x7c7770, 0xc4b9a6], { wobble: 0.02 }, 12);
  metal.torus(0.98, 0.08, gold, { p: [0, 3.14, 0], r: [Math.PI / 2, 0, 0] }, 6, 22);
  metal.torus(0.98, 0.08, gold, { p: [0, 5.65, 0], r: [Math.PI / 2, 0, 0] }, 6, 22);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    metal.cyl(0.055, 0.07, 2.55, gold, { p: [Math.cos(a) * 0.98, 4.4, Math.sin(a) * 0.98] }, 6);
  }
  metal.lathe([[1.22, 5.65], [0.56, 6.5], [0.14, 7.05], [0.08, 7.5], [0, 7.6]], gold, {}, 10);
  metal.torus(0.22, 0.04, gold, { p: [0, 7.72, 0] }, 5, 16);
  core.sphere(0.72, [0xff9a2e, 0xfff0b5], { gain: 6, s: [1, 1.42, 1] }, 18, 14);
  return { base: m.build(), metal: metal.build(), core: core.build(), coreY: 4.4, height: 7.8 };
}

/** The Gloam Rift where enemies enter the map. */
export function riftGeo() {
  const m = new MB();
  const g = new MB();
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * Math.PI * 2;
    const h = 2.2 + ((i * 11) % 5) * 0.55;
    m.crystal(0.55, h, [0x241a3a, 0x5a4a82], { p: [Math.cos(a) * 3, h * 0.3, Math.sin(a) * 3], r: [Math.sin(a) * 0.24, 0, -Math.cos(a) * 0.24] });
  }
  g.torus(2.6, 0.08, [0xb55bff, 0xff7ae0], { p: [0, 2.6, 0], gain: 4 }, 6, 36);
  return { base: m.build(), glow: g.build(), portalY: 2.6, radius: 2.5 };
}
