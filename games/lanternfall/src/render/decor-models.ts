// Scenery: trees, rocks, ruins, and story props for every biome.
import * as THREE from 'three';
import { MB } from './mb';

export interface DecorGeo {
  /** Static or wind-free parts. */
  solid: THREE.BufferGeometry;
  /** Wind-swayed foliage. */
  leaf?: THREE.BufferGeometry;
  glow?: THREE.BufferGeometry;
}

const BARK: [number, number] = [0x3f2a1e, 0x6e4c32];
const BIRCH: [number, number] = [0xa59f92, 0xe9e4d8];
const STONE: [number, number] = [0x6d6a72, 0xa39c96];
const SAND: [number, number] = [0xb9884f, 0xeac88b];
const OBS: [number, number] = [0x15111a, 0x3d3145];

function canopy(l: MB, blobs: [number, number, number, number][], col: [number, number]) {
  for (const [x, y, z, r] of blobs) {
    l.ico(r, col, { p: [x, y, z], wobble: r * 0.12, wobbleFreq: 1.6, flat: false, puff: 0.75 }, 2);
  }
}

function trunk(m: MB, h: number, r: number, col: [number, number], lean = 0.05) {
  m.cyl(r * 0.6, r, h, col, { p: [0, h / 2, 0], r: [lean, 0, lean * 0.6], wobble: r * 0.12 }, 8, 3);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.7;
    m.cone(r * 0.55, r * 1.2, col[0], { p: [Math.cos(a) * r * 0.82, r * 0.4, Math.sin(a) * r * 0.82], r: [Math.sin(a) * 0.65, 0, -Math.cos(a) * 0.65] }, 5);
  }
}

function pineTiers(l: MB, y0: number, tiers: number, r: number, h: number, col: [number, number], snow = false) {
  for (let i = 0; i < tiers; i++) {
    const t = i / tiers;
    const rr = r * (1 - t * 0.68);
    const hh = h * (1 - t * 0.2);
    l.cone(rr, hh, col, { p: [0, y0 + t * tiers * h * 0.56 + hh / 2, 0], r: [0, i, 0], wobble: rr * 0.05 }, 9, 2);
    if (snow) {
      l.cone(rr * 0.74, hh * 0.56, [0xdfeafa, 0xffffff], { p: [0, y0 + t * tiers * h * 0.56 + hh * 0.74, 0], r: [0, i, 0], wobble: rr * 0.05 }, 9);
    }
  }
}

const builders: Record<string, () => DecorGeo> = {
  oak() {
    const m = new MB(); const l = new MB();
    trunk(m, 2.6, 0.4, BARK);
    canopy(l, [[0, 3.6, 0, 1.75], [1.15, 3.05, 0.35, 1.15], [-1.1, 3.1, -0.3, 1.2], [0.2, 2.95, -1.1, 1.05], [-0.3, 3.0, 1.1, 1.0], [0.3, 4.6, 0.1, 1]], [0x2f7a30, 0xa5d04f]);
    return { solid: m.build(), leaf: l.build() };
  },
  birch() {
    const m = new MB(); const l = new MB();
    trunk(m, 4.2, 0.2, BIRCH, 0.03);
    for (let i = 0; i < 5; i++) m.box(0.17, 0.05, 0.42, 0x2f2a28, { p: [0, 0.8 + i * 0.68, 0.02], s: [1, 1, 1], r: [0, i * 1.7, 0] });
    canopy(l, [[0, 4.8, 0, 1.25], [0.6, 4.1, 0.2, 0.85], [-0.55, 4.25, -0.2, 0.85], [0, 5.7, 0, 0.75]], [0x8ca82a, 0xf2d84f]);
    return { solid: m.build(), leaf: l.build() };
  },
  bush() {
    const l = new MB();
    canopy(l, [[0, 0.5, 0, 0.72], [0.55, 0.35, 0.1, 0.5], [-0.5, 0.38, -0.2, 0.52]], [0x2f6e2c, 0x8fc249]);
    const m = new MB();
    m.sphere(0.06, 0xff5e62, { p: [0.3, 0.92, 0.45] }, 5, 4);
    m.sphere(0.06, 0xff5e62, { p: [-0.25, 0.85, 0.5] }, 5, 4);
    return { solid: m.build(), leaf: l.build() };
  },
  bigtree() {
    const m = new MB(); const l = new MB(); const g = new MB();
    trunk(m, 5.4, 0.72, [0x241b24, 0x4f3b37]);
    for (const [a, h] of [[0.6, 3.8], [2.6, 4.3], [4.4, 3.5]] as [number, number][]) {
      m.cyl(0.1, 0.24, 2.1, BARK, { p: [Math.cos(a) * 0.88, h, Math.sin(a) * 0.88], r: [Math.sin(a) * 0.82, 0, -Math.cos(a) * 0.82] }, 6);
    }
    canopy(l, [[0, 6.8, 0, 2.5], [1.8, 5.8, 0.55, 1.75], [-1.75, 5.9, -0.45, 1.7], [0.4, 5.7, -1.8, 1.55], [-0.45, 5.75, 1.75, 1.55], [0, 8.2, 0.2, 1.5]], [0x123f46, 0x4f9e6a]);
    for (let i = 0; i < 5; i++) {
      const a = i * 1.26 + 0.3;
      g.sphere(0.075, 0x8dfff0, { p: [Math.cos(a) * 1.32, 4.4 + i * 0.1, Math.sin(a) * 1.32], gain: 3 }, 5, 4);
    }
    return { solid: m.build(), leaf: l.build(), glow: g.build() };
  },
  pine() {
    const m = new MB(); const l = new MB();
    trunk(m, 1.8, 0.33, BARK);
    pineTiers(l, 1.1, 4, 1.85, 2.05, [0x143f3a, 0x3f8a58]);
    return { solid: m.build(), leaf: l.build() };
  },
  snowpine() {
    const m = new MB(); const l = new MB();
    trunk(m, 1.5, 0.3, [0x2e2622, 0x5a4a3f]);
    pineTiers(l, 0.9, 4, 1.8, 1.95, [0x1c4a4f, 0x3f7f77], true);
    return { solid: m.build(), leaf: l.build() };
  },
  giantshroom() {
    const m = new MB(); const g = new MB();
    m.cyl(0.32, 0.5, 3, [0xc7c1aa, 0xeae3cf], { p: [0, 1.5, 0], wobble: 0.06, r: [0.04, 0, 0.06] }, 10, 3);
    m.sphere(1.7, [0x3a3a9a, 0x9a6ae3], { p: [0.1, 3.05, 0], s: [1, 0.58, 1], wobble: 0.08 }, 18, 12);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.2;
      const r = 0.4 + (i % 3) * 0.42;
      g.sphere(0.13, 0x9dfff0, { p: [0.1 + Math.cos(a) * r, 3.85 - r * 0.28, Math.sin(a) * r], gain: 2.8, s: [1, 0.6, 1] }, 6, 4);
    }
    g.cyl(1.55, 1.55, 0.03, 0x7df0ff, { p: [0.1, 2.72, 0], gain: 1.2 }, 18);
    return { solid: m.build(), glow: g.build() };
  },
  bigshroom() {
    const m = new MB(); const g = new MB();
    m.cyl(0.2, 0.3, 1.5, [0xb8b48c, 0xdfdbb5], { p: [0, 0.75, 0], wobble: 0.04 }, 8, 2);
    m.sphere(1, [0x8a4a33, 0xcf8350], { p: [0, 1.55, 0], s: [1, 0.55, 1], wobble: 0.05 }, 14, 9);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.3;
      g.sphere(0.08, 0xfff2a8, { p: [Math.cos(a) * 0.55, 2.0 - i * 0.01, Math.sin(a) * 0.55], gain: 2.6 }, 5, 4);
    }
    return { solid: m.build(), glow: g.build() };
  },
  willow() {
    const m = new MB(); const l = new MB();
    trunk(m, 3.2, 0.5, [0x2d2820, 0x5d5238], 0.12);
    canopy(l, [[0.25, 4, 0, 1.85], [1.3, 3.6, 0.2, 1.2], [-0.85, 3.65, -0.2, 1.25]], [0x45602f, 0x9caa52]);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const r = 1.2 + (i % 3) * 0.32;
      const h = 2.4 + (i % 4) * 0.35;
      l.cyl(0.11, 0.025, h, [0x7f9347, 0x57703a], { p: [0.2 + Math.cos(a) * r, 3.6 - h / 2, Math.sin(a) * r], r: [0, 0, 0] }, 4);
    }
    return { solid: m.build(), leaf: l.build() };
  },
  deadtree() {
    const m = new MB();
    trunk(m, 3.6, 0.36, [0x28242a, 0x665a54], 0.14);
    for (const [a, y, l] of [[0.5, 2.5, 1.7], [2.4, 3, 1.5], [4.2, 2.1, 1.4], [5.4, 3.3, 1.1]] as [number, number, number][]) {
      m.cyl(0.03, 0.13, l, [0x28242a, 0x665a54], { p: [Math.cos(a) * l * 0.4, y + l * 0.26, Math.sin(a) * l * 0.4], r: [Math.sin(a) * 0.95, 0, -Math.cos(a) * 0.95] }, 5);
    }
    return { solid: m.build() };
  },
  reedclump() {
    const l = new MB();
    for (let i = 0; i < 12; i++) {
      const a = i * 2.4;
      const r = ((i * 13) % 7) * 0.09;
      const h = 1.1 + ((i * 5) % 7) * 0.2;
      l.cone(0.05, h, [0x4f6a30, 0xb3b35c], { p: [Math.cos(a) * r, h / 2, Math.sin(a) * r], r: [Math.sin(a) * 0.1, 0, Math.cos(a) * 0.1] }, 4);
      if (i % 3 === 0) l.cyl(0.05, 0.05, 0.3, 0x5d3b1f, { p: [Math.cos(a) * r, h + 0.04, Math.sin(a) * r] }, 5);
    }
    return { solid: new MB().sphere(0.01, 0, {}, 3, 2).build(), leaf: l.build() };
  },
  icecrystal() {
    const m = new MB(); const g = new MB();
    m.crystal(0.68, 3.2, [0x6db5d8, 0xe6fbff], { p: [0, 1.0, 0], r: [0.1, 0, 0.1] });
    m.crystal(0.42, 2, [0x6db5d8, 0xe6fbff], { p: [0.7, 0.6, 0.2], r: [0.2, 0, -0.42] });
    m.crystal(0.36, 1.6, [0x6db5d8, 0xe6fbff], { p: [-0.6, 0.48, -0.2], r: [-0.14, 0, 0.5] });
    g.crystal(0.16, 1.2, 0xa0ecff, { p: [0, 1.2, 0], gain: 2.4 });
    return { solid: m.build(), glow: g.build() };
  },
  palm() {
    const m = new MB(); const l = new MB();
    for (let i = 0; i < 6; i++) {
      m.cyl(0.2 - i * 0.015, 0.25 - i * 0.015, 0.76, [0x6b4d2c, 0x9c7a4a], { p: [i * i * 0.022, 0.36 + i * 0.68, 0], r: [0, 0, -i * 0.045], wobble: 0.015 }, 7);
    }
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const geo = new THREE.SphereGeometry(1, 8, 5);
      geo.scale(1.4, 0.05, 0.28);
      geo.translate(1.3, 0, 0);
      geo.rotateZ(-0.34);
      geo.rotateY(a);
      l.add(geo, [0x4c7c2c, 0x9dbb46], { p: [0.55, 4.4, 0] });
    }
    return { solid: m.build(), leaf: l.build() };
  },
  cactus() {
    const m = new MB();
    const c: [number, number] = [0x2f6a44, 0x76a95c];
    m.cyl(0.32, 0.38, 2.4, c, { p: [0, 1.2, 0] }, 9);
    m.sphere(0.32, c[1], { p: [0, 2.4, 0] }, 9, 6);
    m.cyl(0.17, 0.18, 0.9, c, { p: [0.6, 1.2, 0], r: [0, 0, Math.PI / 2] }, 7);
    m.cyl(0.17, 0.18, 1, c, { p: [1.0, 1.65, 0] }, 7);
    m.sphere(0.17, c[1], { p: [1.0, 2.15, 0] }, 7, 5);
    m.cyl(0.14, 0.15, 0.6, c, { p: [-0.5, 1.45, 0], r: [0, 0, Math.PI / 2] }, 7);
    m.cyl(0.14, 0.15, 0.7, c, { p: [-0.78, 1.75, 0] }, 7);
    m.sphere(0.2, 0xff7a93, { p: [0, 2.68, 0], s: [1, 0.55, 1] }, 7, 5);
    return { solid: m.build() };
  },
  pillar() {
    const m = new MB();
    m.cyl(0.62, 0.75, 0.42, SAND, { p: [0, 0.2, 0], flat: true, wobble: 0.03 }, 10);
    m.cyl(0.45, 0.5, 3.1, SAND, { p: [0, 1.95, 0], wobble: 0.04, r: [0.03, 0, 0.04] }, 12, 3);
    m.box(1.22, 0.3, 1.22, SAND, { p: [0.03, 3.62, 0.03], r: [0.06, 0.3, -0.06], wobble: 0.03 });
    return { solid: m.build() };
  },
  mesarock() {
    const m = new MB();
    const rock: [number, number] = [0x9b5730, 0xecb06a];
    m.cyl(1.8, 2.5, 4.8, rock, { p: [0, 2.4, 0], wobble: 0.3, wobbleFreq: 0.8 }, 10, 6);
    m.cyl(2.05, 2.15, 0.5, [0xe6a763, 0xf5cf91], { p: [0, 4.9, 0], wobble: 0.14 }, 10);
    return { solid: m.build() };
  },
  charred() {
    const m = new MB(); const g = new MB();
    const c: [number, number] = [0x121014, 0x3a2e2e];
    trunk(m, 3.2, 0.34, c, 0.12);
    for (const [a, y, l] of [[0.8, 2.3, 1.4], [3, 2.7, 1.2], [4.8, 1.8, 1.15]] as [number, number, number][]) {
      m.cyl(0.03, 0.12, l, c, { p: [Math.cos(a) * l * 0.4, y + l * 0.26, Math.sin(a) * l * 0.4], r: [Math.sin(a) * 0.95, 0, -Math.cos(a) * 0.95] }, 5);
    }
    for (let i = 0; i < 5; i++) {
      const a = i * 1.9;
      g.box(0.035, 0.34, 0.03, 0xff6a2a, { p: [Math.cos(a) * 0.3, 0.45 + i * 0.5, Math.sin(a) * 0.3], gain: 3.6, r: [0, a, 0.2] });
    }
    return { solid: m.build(), glow: g.build() };
  },
  obsidian() {
    const m = new MB();
    m.crystal(0.92, 3.8, OBS, { p: [0, 1.2, 0], r: [0.1, 0.2, 0.12] });
    m.crystal(0.6, 2.4, OBS, { p: [0.84, 0.75, 0.3], r: [0.12, 1, -0.3] });
    return { solid: m.build() };
  },
  emberrock() {
    const m = new MB(); const g = new MB();
    m.ico(1.1, [0x1e181c, 0x4f3a36], { p: [0, 0.65, 0], s: [1, 0.72, 1], wobble: 0.13 }, 1);
    g.ico(0.3, [0xff5a1f, 0xffc35a], { p: [0.42, 1.02, 0.42], gain: 3.2, s: [1, 0.5, 1] }, 0);
    g.ico(0.22, [0xff5a1f, 0xffc35a], { p: [-0.5, 0.9, 0.18], gain: 3.2, s: [1, 0.5, 1] }, 0);
    return { solid: m.build(), glow: g.build() };
  },
  rock() {
    const m = new MB();
    m.ico(1, [0x5b5962, 0xa5a098], { p: [0, 0.45, 0], s: [1.1, 0.74, 1], wobble: 0.14 }, 1);
    m.ico(0.5, [0x5b5962, 0xa5a098], { p: [0.8, 0.22, 0.25], s: [1, 0.72, 1], wobble: 0.06 }, 1);
    return { solid: m.build() };
  },
  cottage() {
    const m = new MB(); const g = new MB();
    const plaster: [number, number] = [0xc9b89a, 0xf0e4c7];
    m.cyl(1.75, 1.85, 0.35, STONE, { p: [0, 0.17, 0], s: [1.05, 1, 0.84], wobble: 0.03 }, 10);
    m.box(2.9, 1.7, 2.3, plaster, { p: [0, 1.17, 0], wobble: 0.02 });
    for (const x of [-1.42, 1.42]) m.box(0.12, 1.8, 2.4, 0x5e3f28, { p: [x, 1.17, 0] });
    m.box(3, 0.12, 0.12, 0x5e3f28, { p: [0, 2.03, 1.17] });
    m.box(3, 0.12, 0.12, 0x5e3f28, { p: [0, 2.03, -1.17] });
    const roof = new THREE.CylinderGeometry(0.02, 2, 1.9, 4, 1);
    roof.rotateY(Math.PI / 4);
    roof.scale(1.14, 1, 0.92);
    m.add(roof, [0xa54b2e, 0xd77a48], { p: [0, 2.95, 0], wobble: 0.03, flat: true });
    m.cyl(0.26, 0.3, 1.5, STONE, { p: [1, 3.2, -0.5] }, 8);
    m.box(0.58, 1, 0.08, 0x5e3f28, { p: [-0.55, 0.85, 1.17] });
    g.box(0.5, 0.5, 0.05, 0xffb35c, { p: [0.75, 1.3, 1.17], gain: 2.5 });
    g.box(0.5, 0.5, 0.05, 0xffb35c, { p: [-0.75, 1.3, -1.17], gain: 2.5 });
    return { solid: m.build(), glow: g.build() };
  },
  windmill() {
    const m = new MB();
    m.lathe([[1.8, 0], [1.5, 1], [1.05, 4.6], [1.1, 4.7], [0, 4.7]], STONE, { wobble: 0.03 }, 12);
    m.cone(1.3, 1.55, [0x8f4228, 0xcf6f3f], { p: [0, 5.45, 0] }, 10);
    m.cyl(0.12, 0.12, 1.1, 0x4f3322, { p: [0, 4.6, 1.2], r: [Math.PI / 2, 0, 0] }, 7);
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2 + 0.5;
      m.box(0.13, 3.1, 0.08, 0x5a3b26, { p: [Math.cos(a) * 1.55, 4.6 + Math.sin(a) * 1.55, 1.7], r: [0, 0, a - Math.PI / 2] });
      m.box(0.68, 2.3, 0.04, 0xf0e4c7, { p: [Math.cos(a) * 1.9 + Math.cos(a + Math.PI / 2) * 0.32, 4.6 + Math.sin(a) * 1.9 + Math.sin(a + Math.PI / 2) * 0.32, 1.7], r: [0, 0, a - Math.PI / 2] });
    }
    return { solid: m.build() };
  },
  stones() {
    const m = new MB(); const g = new MB();
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const h = 1.9 + (i % 3) * 0.55;
      m.box(0.72, h, 0.5, STONE, { p: [Math.cos(a) * 1.75, h / 2, Math.sin(a) * 1.75], r: [0.05, -a, 0.08], wobble: 0.07 });
      g.box(0.09, h * 0.45, 0.02, 0x7df6c9, { p: [Math.cos(a) * 1.5, h * 0.55, Math.sin(a) * 1.5], r: [0, -a + Math.PI / 2, 0], gain: 2.4 });
    }
    return { solid: m.build(), glow: g.build() };
  },
  stump() {
    const m = new MB(); const g = new MB();
    m.cyl(1.6, 2.1, 1.7, [0x2f2422, 0x644a38], { p: [0, 0.85, 0], wobble: 0.15 }, 14, 3);
    m.cyl(1.62, 1.62, 0.04, [0xb99a6c, 0xb99a6c], { p: [0, 1.72, 0] }, 14);
    for (let i = 0; i < 7; i++) {
      const a = i * 2.3;
      m.cyl(0.1, 0.15, 0.5, 0xd9d0b5, { p: [Math.cos(a) * 1.15, 1.92, Math.sin(a) * 1.15] }, 6);
      m.sphere(0.27, [0x5b4fb0, 0x8f6fe3], { p: [Math.cos(a) * 1.15, 2.2, Math.sin(a) * 1.15], s: [1, 0.55, 1] }, 9, 6);
      g.sphere(0.05, 0x9dfff0, { p: [Math.cos(a) * 1.15, 2.36, Math.sin(a) * 1.15], gain: 3 }, 5, 4);
    }
    return { solid: m.build(), glow: g.build() };
  },
  hut() {
    const m = new MB(); const g = new MB();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      m.cyl(0.08, 0.11, 1.6, BARK, { p: [Math.cos(a) * 1.25, 0.6, Math.sin(a) * 1.25] }, 6);
    }
    m.cyl(1.6, 1.6, 0.14, [0x5a4730, 0x7d6545], { p: [0, 1.45, 0] }, 9);
    m.cyl(1.2, 1.3, 1.25, [0x4f3f2a, 0x75603d], { p: [0, 2.1, 0], wobble: 0.05 }, 9);
    m.cone(1.85, 1.75, [0x5f6a2f, 0xa09e50], { p: [0, 3.5, 0], wobble: 0.07 }, 9, 2);
    g.box(0.42, 0.55, 0.05, 0xffc66b, { p: [0, 2.05, 1.26], gain: 2.5 });
    return { solid: m.build(), glow: g.build() };
  },
  watchtower() {
    const m = new MB(); const g = new MB();
    const st: [number, number] = [0x5a6579, 0x9aa6ba];
    m.cyl(1.25, 1.55, 4.8, st, { p: [0, 2.4, 0], wobble: 0.04 }, 10, 3);
    m.cyl(1.55, 1.3, 0.5, st, { p: [0, 5, 0] }, 10);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      m.box(0.55, 0.55, 0.32, st, { p: [Math.cos(a) * 1.4, 5.5, Math.sin(a) * 1.4], r: [0, -a + Math.PI / 2, 0] });
    }
    m.cyl(1.32, 1.38, 0.14, [0xe8f1fa, 0xffffff], { p: [0, 5.28, 0] }, 10);
    m.cyl(1.75, 1.95, 0.22, [0xdfeafa, 0xffffff], { p: [0, 0.08, 0], wobble: 0.05 }, 12);
    g.sphere(0.32, 0xffb35c, { p: [0, 5.75, 0], gain: 3 }, 8, 6);
    return { solid: m.build(), glow: g.build() };
  },
  obelisk() {
    const m = new MB(); const g = new MB();
    m.box(2.2, 0.5, 2.2, SAND, { p: [0, 0.25, 0], wobble: 0.03 });
    m.cyl(0.42, 0.78, 5.4, SAND, { p: [0, 3.2, 0], wobble: 0.015 }, 4);
    m.cone(0.42, 0.72, 0xffd98a, { p: [0, 6.25, 0] }, 4);
    g.crystal(0.09, 0.62, 0xffd25c, { p: [0.52, 3.2, 0], gain: 2.4, r: [0, Math.PI / 4, 0] });
    g.crystal(0.09, 0.62, 0xffd25c, { p: [0, 2.1, 0.62], gain: 2.4, r: [0, Math.PI / 4, 0] });
    return { solid: m.build(), glow: g.build() };
  },
  arch() {
    const m = new MB();
    m.box(0.95, 4.2, 0.95, SAND, { p: [-2, 2.1, 0], wobble: 0.08 });
    m.box(0.95, 3.1, 0.95, SAND, { p: [2, 1.55, 0], wobble: 0.08 });
    m.add(new THREE.TorusGeometry(2, 0.46, 7, 12, Math.PI * 0.7), SAND, { p: [0, 4.2, 0], wobble: 0.05, flat: true });
    m.box(1.2, 0.5, 1.1, SAND, { p: [2.8, 0.25, 1.2], r: [0.15, 0.4, 0.1], wobble: 0.08 });
    return { solid: m.build() };
  },
  sundial() {
    const m = new MB(); const g = new MB();
    m.cyl(2.5, 2.7, 0.42, SAND, { p: [0, 0.21, 0], wobble: 0.03 }, 20);
    m.cyl(2.05, 2.1, 0.1, [0xe8c78a, 0xf7dfad], { p: [0, 0.47, 0] }, 20);
    m.cone(0.62, 3.2, SAND, { p: [0.7, 1.95, 0], r: [0, 0, -0.42], s: [1, 1, 0.2] }, 4);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      g.box(0.08, 0.04, 0.34, 0xffc961, { p: [Math.cos(a) * 1.72, 0.54, Math.sin(a) * 1.72], r: [0, -a + Math.PI / 2, 0], gain: 2 });
    }
    return { solid: m.build(), glow: g.build() };
  },
  forgeruin() {
    const m = new MB(); const g = new MB();
    m.cyl(1.4, 1.8, 3.3, [0x1e181c, 0x4f3a36], { p: [0, 1.65, 0], wobble: 0.13 }, 9, 3);
    m.cyl(0.95, 1.15, 0.4, [0x151116, 0x2a2024], { p: [0, 3.35, 0] }, 9);
    g.cyl(0.92, 0.92, 0.03, 0xff5a1f, { p: [0, 3.52, 0], gain: 4.5 }, 12);
    g.box(0.58, 0.9, 0.05, 0xff8a2a, { p: [0, 0.75, 1.55], gain: 3.8 });
    m.box(1.3, 0.5, 0.75, [0x1e181c, 0x4f3a36], { p: [2.1, 0.25, 0.5], r: [0, 0.5, 0], wobble: 0.08 });
    return { solid: m.build(), glow: g.build() };
  },
  obsidianspire() {
    const m = new MB(); const g = new MB();
    m.crystal(1.25, 7.2, OBS, { p: [0, 2.6, 0], r: [0.06, 0.2, 0.05] });
    m.crystal(0.72, 3.8, OBS, { p: [1.05, 1.2, 0.2], r: [0.05, 0.7, -0.24] });
    m.crystal(0.6, 3.2, OBS, { p: [-0.95, 1, -0.3], r: [-0.05, 1.6, 0.26] });
    g.box(0.05, 3.2, 0.05, 0xff5a1f, { p: [0.38, 2.6, 0.38], gain: 3.2, r: [-0.05, 0, -0.06] });
    return { solid: m.build(), glow: g.build() };
  },
};

const cache = new Map<string, DecorGeo>();
export function decorGeo(kind: string): DecorGeo {
  let g = cache.get(kind);
  if (!g) {
    g = builders[kind]();
    cache.set(kind, g);
  }
  return g;
}
