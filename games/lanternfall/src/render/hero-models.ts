// The three heroes, built with more care than the rank-and-file: faces, layered armor, real weapons and small trims.
// They share the humanoid part layout (body, head, arms, legs) so the same animation drives them all.
// Parts named glow* are drawn unlit and without an outline: emblems, gems, eye glints and runes go there.
import * as THREE from 'three';
import type { HumanoidGeo } from './creature-models';
import { MB, type Col } from './mb';

type C2 = [number, number];
type V3 = [number, number, number];

const RING: V3 = [Math.PI / 2, 0, 0];
const INKY = 0x1b1012;
const GOLD: C2 = [0xc98a2c, 0xffd36b];

/** A point `d` along an axis that starts at `o` and tilts forward by `a` radians from straight up. */
const along = (o: V3, a: number, d: number, dx = 0): V3 => [o[0] + dx, o[1] + d * Math.cos(a), o[2] + d * Math.sin(a)];

/** Cartoon eyes: a white, a colored iris, a pupil and an unlit glint. */
function face(head: MB, glow: MB, o: { x: number; y: number; z: number; iris: number; skin: Col; brow: number; browTilt?: number; blush?: number }) {
  for (const s of [-1, 1]) {
    head.sphere(0.092, 0xfffaf0, { p: [s * o.x, o.y, o.z], s: [0.92, 1.18, 0.5] }, 10, 8);
    glow.sphere(0.062, o.iris, { p: [s * (o.x - 0.008), o.y - 0.012, o.z + 0.04], s: [0.9, 1.15, 0.4] }, 9, 7);
    glow.sphere(0.034, INKY, { p: [s * (o.x - 0.01), o.y - 0.014, o.z + 0.062], s: [0.9, 1.2, 0.4] }, 7, 5);
    glow.sphere(0.017, 0xffffff, { p: [s * (o.x - 0.03), o.y + 0.025, o.z + 0.072] }, 5, 4);
    // Brows set the mood: a slight inward tilt reads as determined.
    head.box(0.15, 0.036, 0.05, o.brow, { p: [s * o.x, o.y + 0.13, o.z + 0.01], r: [0, 0, s * (o.browTilt ?? -0.22)] });
    if (o.blush) glow.sphere(0.06, o.blush, { p: [s * (o.x + 0.06), o.y - 0.11, o.z - 0.03], s: [1.2, 0.6, 0.3] }, 8, 6);
  }
  head.sphere(0.05, o.skin, { p: [0, o.y - 0.07, o.z + 0.04], s: [1, 0.9, 0.8] }, 8, 6);
  glow.box(0.09, 0.022, 0.02, 0x5a2420, { p: [0, o.y - 0.17, o.z - 0.005], r: [0.2, 0, 0] });
}

/** A flared cape: a flattened cone whose surface ripples into folds that deepen toward the hem. */
function capeGeo(rTop: number, rBot: number, h: number, folds: number) {
  const geo = new THREE.CylinderGeometry(rTop, rBot, h, 28, 6);
  const pos = geo.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const t = 0.5 - y / h; // 0 at the top, 1 at the hem
    const ang = Math.atan2(z, x);
    const k = 1 + Math.sin(ang * folds) * 0.09 * t;
    pos.setXYZ(i, x * k, y - Math.cos(ang * folds) * 0.03 * t, z * k);
  }
  geo.computeVertexNormals();
  return geo;
}

function done(parts: { body: MB; head: MB; armR: MB; armL: MB; legL: MB; legR: MB; glow: MB; glowArm: MB; glowHead: MB; glowArmR: MB }): HumanoidGeo {
  const out: Partial<Record<keyof typeof parts, THREE.BufferGeometry>> = {};
  for (const k of Object.keys(parts) as (keyof typeof parts)[]) {
    const m = parts[k];
    if (m.empty) m.sphere(0.001, 0, {}, 3, 2);
    out[k] = m.build();
  }
  return out as HumanoidGeo;
}

/** Warden Ember: silver plate over red cloth, a plumed gold helm, a fire-veined sword and the lantern. */
export function heroEmber(): HumanoidGeo {
  const armor: C2 = [0x8a8aa8, 0xf4f0ea];
  const armorDark: C2 = [0x6a6a88, 0xc8c4d4];
  const cloth: C2 = [0x8c2f2c, 0xc2483c];
  const cape: C2 = [0x7a1c1e, 0xd14a32];
  const leather: C2 = [0x3e2818, 0x6e4a2c];
  const skin = 0xf0bd92;
  const body = new MB(), head = new MB(), armR = new MB(), armL = new MB(), glow = new MB(), glowArm = new MB(), glowHead = new MB(), glowArmR = new MB();

  // Torso: a breastplate with a raised center ridge, over a red tunic.
  body.lathe([[0.5, 0.72], [0.62, 1.1], [0.56, 1.46], [0.3, 1.66], [0, 1.72]], armor, { s: [1, 1, 0.84] }, 14);
  body.box(0.08, 0.62, 0.1, armor[1], { p: [0, 1.2, 0.49], r: [-0.12, 0, 0] });
  body.lathe([[0.57, 0.34], [0.5, 0.78], [0, 0.82]], cloth, { s: [1, 1, 0.86] }, 14);
  // Tabard panels front and back, edged in gold.
  body.box(0.4, 0.5, 0.06, cloth, { p: [0, 0.5, 0.47], r: [0.08, 0, 0] });
  body.box(0.42, 0.06, 0.07, GOLD, { p: [0, 0.27, 0.49], r: [0.08, 0, 0] });
  body.box(0.4, 0.5, 0.06, cloth, { p: [0, 0.5, -0.45], r: [-0.08, 0, 0] });
  // Belt, buckle and a pouch.
  body.torus(0.5, 0.075, leather, { p: [0, 0.82, 0], r: RING, s: [1, 0.86, 1] }, 6, 18);
  body.box(0.2, 0.17, 0.08, GOLD, { p: [0, 0.82, 0.45] });
  body.box(0.17, 0.2, 0.13, leather, { p: [0.4, 0.68, 0.26], r: [0, 0.6, 0] });
  // Gorget and layered pauldrons with gold rims.
  body.torus(0.3, 0.07, GOLD, { p: [0, 1.66, 0], r: RING }, 6, 16);
  for (const s of [-1, 1]) {
    body.sphere(0.37, armor, { p: [s * 0.62, 1.52, 0], s: [1.08, 0.78, 1.08] }, 12, 9);
    body.sphere(0.34, armorDark, { p: [s * 0.7, 1.36, 0], s: [1.05, 0.5, 1.05] }, 12, 7);
    body.torus(0.33, 0.04, GOLD, { p: [s * 0.7, 1.32, 0], r: RING, s: [1.05, 1.05, 1] }, 5, 16);
    // Cape clasps.
    body.sphere(0.075, GOLD, { p: [s * 0.36, 1.62, 0.26] }, 8, 6);
  }
  // A long cape with a dark lining and a gold hem.
  body.add(capeGeo(0.44, 0.74, 1.42, 9), cape, { p: [0, 0.95, -0.38], s: [1, 1, 0.32] });
  body.torus(0.74, 0.045, GOLD, { p: [0, 0.24, -0.38], r: RING, s: [1, 0.3, 1] }, 5, 24);
  // The sun crest on the chest.
  glow.cyl(0.14, 0.14, 0.03, 0xffc23a, { p: [0, 1.24, 0.53], r: [Math.PI / 2 - 0.12, 0, 0] }, 16);
  glow.cyl(0.075, 0.075, 0.035, 0xfff1b8, { p: [0, 1.24, 0.545], r: [Math.PI / 2 - 0.12, 0, 0], gain: 1.8 }, 12);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    glow.box(0.04, 0.09, 0.02, 0xffd36b, { p: [Math.cos(a) * 0.2, 1.24 + Math.sin(a) * 0.2, 0.52 - Math.sin(a) * 0.025], r: [-0.12, 0, a - Math.PI / 2] });
  }

  // Head: face, auburn hair, an open gold helm with cheek guards, a crest ridge and a horsehair plume.
  head.sphere(0.44, skin, { p: [0, 0.3, 0.03] }, 16, 12);
  face(head, glowHead, { x: 0.165, y: 0.3, z: 0.42, iris: 0x4a8ae0, skin, brow: 0x7a3a1c, blush: 0xff9a8a });
  head.sphere(0.2, [0x7a3a1c, 0xb8602c], { p: [-0.3, 0.32, -0.12], s: [0.7, 1.3, 1.2], wobble: 0.03 }, 8, 6);
  head.sphere(0.2, [0x7a3a1c, 0xb8602c], { p: [0.3, 0.32, -0.12], s: [0.7, 1.3, 1.2], wobble: 0.03 }, 8, 6);
  head.sphere(0.32, [0x7a3a1c, 0xb8602c], { p: [0, 0.28, -0.26], s: [1.2, 1.1, 0.8], wobble: 0.03 }, 10, 8);
  head.sphere(0.2, [0x7a3a1c, 0xb8602c], { p: [0.06, 0.52, 0.3], s: [1.6, 0.42, 0.7], wobble: 0.02 }, 9, 6);
  head.lathe([[0.5, 0.5], [0.5, 0.62], [0.36, 0.82], [0, 0.9]], GOLD, { p: [0, 0, -0.02] }, 16);
  head.torus(0.49, 0.05, [0xa06a1c, 0xe0a840], { p: [0, 0.55, -0.02], r: RING }, 6, 20);
  for (const s of [-1, 1]) head.box(0.08, 0.3, 0.22, GOLD, { p: [s * 0.45, 0.42, 0.1], r: [0, 0, s * 0.12] });
  head.box(0.07, 0.12, 0.62, GOLD, { p: [0, 0.9, -0.04] });
  head.sphere(0.13, cloth[1], { p: [0, 1.0, -0.1], s: [0.7, 1, 1.4] }, 8, 6);
  head.cone(0.13, 0.8, [0xd9402f, 0x8c2020], { p: [0, 0.78, -0.56], r: [-2.3, 0, 0], s: [0.7, 1, 1] }, 8);
  glowHead.sphere(0.06, 0xff6a3c, { p: [0, 0.6, 0.47], gain: 2.4, s: [1, 1.2, 0.6] }, 8, 6);

  // Arms: plate with elbow cops and leather gauntlets.
  for (const arm of [armL, armR]) {
    arm.cyl(0.13, 0.15, 0.62, armor, { p: [0, -0.3, 0] }, 10);
    arm.sphere(0.16, armorDark, { p: [0, -0.36, -0.02], s: [1, 0.8, 1.05] }, 9, 7);
    arm.cyl(0.155, 0.13, 0.2, leather, { p: [0, -0.62, 0] }, 9);
    arm.torus(0.155, 0.03, GOLD, { p: [0, -0.53, 0], r: RING }, 5, 12);
    arm.sphere(0.13, leather[1], { p: [0, -0.76, 0.03] }, 9, 7);
  }
  // The sword, held forward: pommel, wrapped grip, a wide crossguard and a tapered diamond blade.
  const O: V3 = [0, -0.76, 0.06], a = 1.15;
  armR.sphere(0.08, GOLD, { p: along(O, a, -0.2) }, 8, 6);
  armR.cyl(0.05, 0.05, 0.3, [0x3a2010, 0x6a3a1c], { p: along(O, a, -0.02), r: [a, 0, 0] }, 7);
  // The blade's flat faces the side, so it reads from the camera above.
  armR.box(0.12, 0.08, 0.56, GOLD, { p: along(O, a, 0.16), r: [a, 0, 0] });
  const guard = along(O, a, 0.16);
  for (const s of [-1, 1]) armR.sphere(0.06, GOLD, { p: [guard[0], guard[1] - Math.sin(a) * 0.3 * s, guard[2] + Math.cos(a) * 0.3 * s] }, 7, 5);
  const blade = new THREE.CylinderGeometry(0.08, 0.15, 1.34, 4);
  blade.scale(0.3, 1, 1);
  armR.add(blade, [0xa0a6c0, 0xffffff], { p: along(O, a, 0.87), r: [a, 0, 0], flat: true });
  const tip = new THREE.ConeGeometry(0.08, 0.22, 4);
  tip.scale(0.3, 1, 1);
  armR.add(tip, 0xffffff, { p: along(O, a, 1.64), r: [a, 0, 0], flat: true });
  glowArmR.box(0.075, 1.0, 0.045, 0xff8a3c, { p: along(O, a, 0.82), r: [a, 0, 0], gain: 2.2 });
  // The lantern: hook, domed cap, glass, bars and base.
  armL.torus(0.12, 0.03, GOLD, { p: [0.02, -0.8, 0.06] }, 5, 10);
  armL.cone(0.24, 0.16, GOLD, { p: [0.02, -0.98, 0.06] }, 10);
  armL.sphere(0.05, GOLD, { p: [0.02, -0.88, 0.06] }, 6, 5);
  armL.cyl(0.21, 0.21, 0.07, GOLD, { p: [0.02, -1.08, 0.06] }, 10);
  armL.cyl(0.22, 0.17, 0.1, GOLD, { p: [0.02, -1.48, 0.06] }, 10);
  armL.cone(0.08, 0.1, GOLD, { p: [0.02, -1.57, 0.06], r: [Math.PI, 0, 0] }, 6);
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2;
    armL.cyl(0.022, 0.022, 0.38, GOLD, { p: [0.02 + Math.cos(t) * 0.19, -1.27, 0.06 + Math.sin(t) * 0.19] }, 4);
  }
  glowArm.sphere(0.17, [0xff9a2e, 0xffeaa4], { p: [0.02, -1.27, 0.06], gain: 5, s: [1, 1.15, 1] }, 10, 8);
  glowArm.cone(0.07, 0.2, 0xfffbe6, { p: [0.02, -1.25, 0.06], gain: 6 }, 6);

  // Legs: red breeches, plated greaves, gold knee cops and turned-down boots.
  const leg = () => {
    const l = new MB();
    l.cyl(0.18, 0.16, 0.3, cloth, { p: [0, -0.12, 0] }, 9);
    l.cyl(0.165, 0.15, 0.3, armor, { p: [0, -0.36, 0.01] }, 9);
    l.sphere(0.12, GOLD, { p: [0, -0.24, 0.12], s: [1, 0.9, 0.7] }, 8, 6);
    l.sphere(0.2, leather, { p: [0, -0.56, 0.06], s: [1, 0.66, 1.5] }, 9, 7);
    l.cyl(0.19, 0.19, 0.09, leather[1], { p: [0, -0.47, 0.01] }, 9);
    return l;
  };
  return done({ body, head, armR, armL, legL: leg(), legR: leg(), glow, glowArm, glowHead, glowArmR });
}

/** Sable: a hooded huntress in leaf-green and leather, with a braid, bracers, a bandolier and a recurve longbow. */
export function heroSable(): HumanoidGeo {
  const leather: C2 = [0x3a4a26, 0x7f9a44];
  const hide: C2 = [0x4a3218, 0x8a6030];
  const dark: C2 = [0x2a1a0e, 0x5a3a1e];
  const cloak: C2 = [0x1e3826, 0x4f8a50];
  const skin = 0xe8b48c;
  const body = new MB(), head = new MB(), armR = new MB(), armL = new MB(), glow = new MB(), glowArm = new MB(), glowHead = new MB(), glowArmR = new MB();

  // Jerkin with laced front, a split tunic and a belt with pouches and a knife.
  body.lathe([[0.44, 0.72], [0.52, 1.1], [0.46, 1.46], [0.26, 1.66], [0, 1.72]], leather, { s: [1, 1, 0.8] }, 14);
  for (let i = 0; i < 3; i++) {
    const y = 1.05 + i * 0.14;
    glow.box(0.16, 0.025, 0.02, 0xe8d8a8, { p: [0, y, 0.43 - i * 0.012], r: [0, 0, 0.5] });
    glow.box(0.16, 0.025, 0.02, 0xe8d8a8, { p: [0, y, 0.43 - i * 0.012], r: [0, 0, -0.5] });
  }
  body.lathe([[0.5, 0.36], [0.44, 0.78], [0, 0.82]], hide, { s: [1, 1, 0.86] }, 14);
  body.box(0.34, 0.42, 0.06, leather, { p: [0, 0.46, 0.42], r: [0.1, 0, 0] });
  body.box(0.34, 0.42, 0.06, leather, { p: [0, 0.46, -0.4], r: [-0.1, 0, 0] });
  body.torus(0.45, 0.06, dark, { p: [0, 0.82, 0], r: RING, s: [1, 0.86, 1] }, 6, 18);
  body.box(0.14, 0.12, 0.06, GOLD, { p: [0, 0.82, 0.4] });
  body.box(0.16, 0.18, 0.12, hide, { p: [-0.38, 0.7, 0.22], r: [0, -0.6, 0] });
  body.box(0.13, 0.15, 0.1, hide, { p: [-0.44, 0.7, -0.08], r: [0, -1.3, 0] });
  body.box(0.08, 0.34, 0.06, dark, { p: [0.42, 0.6, 0.16], r: [0.1, 0.5, -0.2] });
  body.sphere(0.04, GOLD, { p: [0.45, 0.79, 0.12] }, 6, 4);
  // A bandolier strap from shoulder to hip.
  body.box(0.11, 1.06, 0.05, dark, { p: [0.04, 1.2, 0.41], r: [-0.12, 0, -0.62] });
  body.box(0.11, 1.06, 0.05, dark, { p: [0.04, 1.2, -0.4], r: [0.12, 0, 0.62] });
  // One leather pauldron on the bow side.
  body.sphere(0.3, hide, { p: [0.58, 1.5, 0], s: [1.1, 0.7, 1.1] }, 10, 8);
  body.torus(0.28, 0.035, GOLD, { p: [0.62, 1.38, 0], r: RING }, 5, 14);
  body.sphere(0.24, leather, { p: [-0.56, 1.5, 0], s: [1, 0.7, 1] }, 10, 7);
  // Cloak with a leaf-cut hem.
  body.add(capeGeo(0.4, 0.64, 1.3, 7), cloak, { p: [0, 1.02, -0.34], s: [1, 1, 0.3] });
  for (let i = 0; i < 5; i++) {
    const x = -0.48 + i * 0.24;
    body.cone(0.13, 0.3, cloak[0], { p: [x, 0.26, -0.34 - 0.19 * Math.sqrt(1 - (x / 0.64) ** 2)], r: [Math.PI, 0, 0], s: [1, 1, 0.35] }, 5);
  }
  // A quiver of fletched arrows over the shoulder.
  body.cyl(0.15, 0.12, 0.9, dark, { p: [0.22, 1.4, -0.54], r: [-0.25, 0, -0.35] }, 10);
  // Bands share the quiver's tilt, so they sit along its axis.
  for (const d of [-0.1, 0.32]) body.cyl(0.16, 0.16, 0.06, GOLD, { p: [0.22 + d * 0.343, 1.4 + d * 0.911, -0.54 - d * 0.232], r: [-0.25, 0, -0.35] }, 10);
  for (let i = 0; i < 4; i++) {
    const p: V3 = [0.33 + i * 0.035, 1.92 + (i % 2) * 0.05, -0.69 + i * 0.045];
    body.cyl(0.018, 0.018, 0.2, 0xc89058, { p: [p[0] - 0.03, p[1] - 0.08, p[2]], r: [-0.25, 0, -0.35] }, 4);
    body.box(0.11, 0.16, 0.025, i % 2 ? 0xff6a5a : 0xf6ead2, { p, r: [-0.25, 0.4 * i, -0.35] });
  }

  // Head: face, a braid over the shoulder and a deep pointed hood with a trimmed rim.
  head.sphere(0.42, skin, { p: [0, 0.3, 0.03] }, 16, 12);
  head.sphere(0.5, cloak, { p: [0, 0.4, -0.1], s: [1.02, 1.02, 0.98] }, 14, 10);
  head.cone(0.27, 0.66, cloak, { p: [0, 0.86, -0.34], r: [-0.7, 0, 0] }, 9);
  head.torus(0.4, 0.05, [0x2c4a20, 0x6a9a3a], { p: [0, 0.34, 0.24], r: [0.22, 0, 0], s: [1, 1.1, 1] }, 6, 20);
  head.sphere(0.37, skin, { p: [0, 0.27, 0.2], s: [1, 0.92, 0.72] }, 14, 10);
  head.sphere(0.14, [0x2a1a10, 0x5a3a20], { p: [0, 0.52, 0.38], s: [1.9, 0.6, 0.7], wobble: 0.02 }, 8, 6);
  face(head, glowHead, { x: 0.15, y: 0.3, z: 0.44, iris: 0x5ab84a, skin, brow: 0x3a2414, browTilt: -0.3, blush: 0xf09a80 });
  for (let i = 0; i < 4; i++) head.sphere(0.085 - i * 0.008, [0x2a1a10, 0x5a3a20], { p: [-0.34 + i * 0.03, 0.1 - i * 0.14, 0.18 + i * 0.03], s: [1, 1.1, 1] }, 8, 6);
  head.sphere(0.04, 0x5ab84a, { p: [-0.25, -0.48, 0.28] }, 6, 4);

  // Arms: leather sleeves, laced bracers and gloves.
  for (const arm of [armL, armR]) {
    arm.cyl(0.11, 0.13, 0.5, leather, { p: [0, -0.25, 0] }, 9);
    arm.cyl(0.14, 0.12, 0.26, hide, { p: [0, -0.58, 0] }, 9);
    arm.torus(0.135, 0.025, GOLD, { p: [0, -0.47, 0], r: RING }, 5, 12);
    arm.sphere(0.11, dark[1], { p: [0, -0.76, 0.03] }, 8, 6);
  }
  // A recurve longbow: two curved limbs, a wrapped grip, horn tips and a string.
  const bowO: V3 = [0, -0.76, -0.72], R = 0.84, span = 1.15;
  const limb = new THREE.TorusGeometry(R, 0.048, 6, 22, span * 2);
  armR.add(limb, [0x5a3519, 0xc08a48], { p: bowO, r: [0, -Math.PI / 2, -span] });
  armR.cyl(0.07, 0.07, 0.24, dark, { p: [0, -0.76, bowO[2] + R] }, 8);
  const tipAt = (s: number): V3 => [0, bowO[1] + Math.sin(span) * R * s, bowO[2] + Math.cos(span) * R];
  for (const s of [-1, 1]) {
    const t = tipAt(s);
    armR.cone(0.05, 0.18, 0xfff0d0, { p: [0, t[1] + s * 0.06, t[2] + 0.06], r: [s > 0 ? 0.9 : Math.PI - 0.9, 0, 0] }, 5);
  }
  armR.cyl(0.012, 0.012, Math.sin(span) * R * 2, 0xfff4d6, { p: [0, bowO[1], bowO[2] + Math.cos(span) * R] }, 4);
  glowArmR.sphere(0.04, 0xc8ff8a, { p: [0, -0.76, bowO[2] + R + 0.07], gain: 2.6 }, 6, 5);
  glowArm.sphere(0.03, 0xc8ff8a, { p: [0, -0.76, 0.1], gain: 1 }, 4, 3);

  // Legs: trousers, knee pads and tall turned boots.
  const leg = () => {
    const l = new MB();
    l.cyl(0.16, 0.14, 0.3, hide, { p: [0, -0.12, 0] }, 9);
    l.sphere(0.1, leather, { p: [0, -0.26, 0.1], s: [1, 0.9, 0.7] }, 8, 6);
    l.cyl(0.155, 0.14, 0.28, dark, { p: [0, -0.4, 0.01] }, 9);
    l.cyl(0.17, 0.17, 0.08, leather, { p: [0, -0.28, 0.0] }, 9);
    l.sphere(0.17, dark, { p: [0, -0.56, 0.06], s: [1, 0.66, 1.5] }, 9, 7);
    return l;
  };
  return done({ body, head, armR, armL, legL: leg(), legR: leg(), glow, glowArm, glowHead, glowArmR });
}

/** Oakheart: a walking oak of bark and stone, with moss, mushrooms, branch antlers, glowing runes, a maul and a slab shield. */
export function heroOakheart(): HumanoidGeo {
  const bark: C2 = [0x4a3018, 0x93663a];
  const barkDark: C2 = [0x2e1c0e, 0x5e4024];
  const stone: C2 = [0x5f6a68, 0xb4c0b4];
  const moss: C2 = [0x3a6a30, 0x86c060];
  const rune = 0x9dff8a;
  const body = new MB(), head = new MB(), armR = new MB(), armL = new MB(), glow = new MB(), glowArm = new MB(), glowHead = new MB(), glowArmR = new MB();

  const mushroom = (m: MB, p: V3, s: number, cap = 0xd8483a) => {
    m.cyl(0.04 * s, 0.05 * s, 0.14 * s, 0xf4ead0, { p: [p[0], p[1] + 0.06 * s, p[2]] }, 6);
    m.sphere(0.11 * s, cap, { p: [p[0], p[1] + 0.14 * s, p[2]], s: [1, 0.6, 1] }, 8, 5);
  };

  // Trunk: bark with deep ridges, a stone belly and a stone chest plate carved with a rune.
  body.lathe([[0.62, 0.7], [0.82, 1.1], [0.8, 1.5], [0.42, 1.74], [0, 1.8]], bark, { s: [1, 1, 0.9], wobble: 0.03, wobbleFreq: 3 }, 14);
  for (let i = 0; i < 9; i++) {
    const t = (i / 9) * Math.PI * 2 + 0.3;
    if (Math.abs(Math.sin(t)) > 0.8 && Math.cos(t) > 0) continue;
    body.box(0.07, 0.62, 0.08, barkDark, { p: [Math.sin(t) * 0.76, 1.16, Math.cos(t) * 0.68], r: [0, t, 0], wobble: 0.015 });
  }
  body.lathe([[0.66, 0.34], [0.6, 0.78], [0, 0.82]], stone, { s: [1, 1, 0.88], wobble: 0.02 }, 14);
  body.torus(0.66, 0.07, moss, { p: [0, 0.8, 0], r: RING, s: [1, 0.9, 1], wobble: 0.03, wobbleFreq: 4 }, 6, 20);
  body.box(0.86, 0.72, 0.2, stone, { p: [0, 1.22, 0.62], wobble: 0.02, flat: true });
  glow.box(0.05, 0.42, 0.03, rune, { p: [0, 1.2, 0.735], gain: 2.2 });
  glow.box(0.24, 0.05, 0.03, rune, { p: [0, 1.3, 0.735], gain: 2.2 });
  for (const s of [-1, 1]) glow.box(0.05, 0.2, 0.03, rune, { p: [s * 0.1, 1.08, 0.735], r: [0, 0, s * 0.6], gain: 2.2 });
  // Shoulders: stone boulders under moss, with mushrooms and sprouting leaves.
  for (const s of [-1, 1]) {
    body.ico(0.46, stone, { p: [s * 0.8, 1.56, 0], s: [1.1, 0.8, 1.1], wobble: 0.03 }, 0);
    body.sphere(0.36, moss, { p: [s * 0.8, 1.84, 0], s: [1.1, 0.5, 1.1], wobble: 0.05, wobbleFreq: 4, puff: 0.4 }, 10, 7);
    for (let k = 0; k < 3; k++) body.cone(0.06, 0.26, moss[1], { p: [s * (0.72 + k * 0.12), 1.98, -0.1 + k * 0.1], r: [k * 0.3 - 0.3, 0, s * (0.3 + k * 0.2)] }, 5);
  }
  mushroom(body, [-0.92, 1.9, 0.16], 1.1);
  mushroom(body, [-0.74, 1.88, 0.26], 0.8, 0xf2c04a);
  mushroom(body, [0.86, 1.88, -0.2], 0.9);
  // Hanging moss down the back.
  body.sphere(0.6, moss, { p: [0, 1.3, -0.52], s: [1.1, 0.9, 0.3], wobble: 0.06, wobbleFreq: 5 }, 10, 8);

  // Head: bark with a heavy brow, glowing eyes, a knot nose, a moss beard and branch antlers with leaves.
  head.sphere(0.44, bark, { p: [0, 0.3, 0.03], wobble: 0.02 }, 16, 12);
  head.box(0.62, 0.12, 0.18, barkDark, { p: [0, 0.45, 0.36], r: [0.2, 0, 0], wobble: 0.015 });
  for (const s of [-1, 1]) {
    head.sphere(0.09, 0x1a2a10, { p: [s * 0.17, 0.33, 0.39], s: [1.1, 0.9, 0.5] }, 8, 6);
    glowHead.sphere(0.07, 0xc8ffb0, { p: [s * 0.17, 0.33, 0.42], s: [1, 0.85, 0.5], gain: 2.6 }, 8, 6);
  }
  head.sphere(0.07, barkDark, { p: [0, 0.22, 0.46], s: [1, 1.1, 0.9] }, 7, 5);
  head.sphere(0.36, moss, { p: [0, 0.04, 0.28], s: [1.1, 0.95, 0.7], wobble: 0.05, wobbleFreq: 5, puff: 0.3 }, 12, 8);
  head.cone(0.14, 0.34, moss[0], { p: [0, -0.24, 0.34], r: [Math.PI + 0.3, 0, 0] }, 6);
  head.sphere(0.4, moss, { p: [0, 0.68, -0.02], s: [1.1, 0.42, 1.1], wobble: 0.05, wobbleFreq: 4, puff: 0.4 }, 12, 7);
  for (const s of [-1, 1]) {
    head.cone(0.085, 0.56, bark, { p: [s * 0.3, 0.84, -0.04], r: [-0.12, 0, s * -0.5] }, 6);
    head.cone(0.05, 0.3, bark, { p: [s * 0.5, 1.0, 0.0], r: [0.3, 0, s * -1.1] }, 5);
    head.cone(0.045, 0.26, bark, { p: [s * 0.38, 1.1, -0.1], r: [-0.4, 0, s * -0.1] }, 5);
    for (const [dx, dy, dz, r] of [[0, 0, 0, 0.1], [0.08, 0.06, -0.06, 0.08], [-0.04, 0.08, 0.07, 0.075]]) head.sphere(r, [0x4a8a30, 0x9ae070], { p: [s * (0.62 + dx), 1.08 + dy, 0.02 + dz], puff: 0.5 }, 8, 6);
  }
  mushroom(head, [0.16, 0.76, 0.12], 0.8);

  // Arms: bark with root-knuckled hands; a slab shield with a glowing rune, iron bands and moss along the top.
  for (const arm of [armL, armR]) {
    arm.cyl(0.17, 0.2, 0.62, bark, { p: [0, -0.3, 0], wobble: 0.02 }, 9);
    arm.box(0.06, 0.4, 0.07, barkDark, { p: [0.15, -0.3, 0.06], r: [0, 0.5, 0] });
    arm.ico(0.2, stone, { p: [0, -0.34, -0.04], s: [1, 0.8, 1] }, 0);
    arm.sphere(0.17, bark[1], { p: [0, -0.72, 0.04], wobble: 0.03 }, 9, 7);
  }
  armL.box(0.96, 1.2, 0.22, stone, { p: [-0.05, -0.56, 0.3], wobble: 0.03, flat: true });
  armL.box(1.02, 0.1, 0.25, [0x3a3a40, 0x7a7a84], { p: [-0.05, -0.24, 0.3] });
  armL.box(1.02, 0.1, 0.25, [0x3a3a40, 0x7a7a84], { p: [-0.05, -0.9, 0.3] });
  for (const x of [-0.46, 0.36]) for (const y of [-0.24, -0.9]) armL.sphere(0.04, 0xb0b0ba, { p: [x, y, 0.43] }, 6, 4);
  armL.box(0.8, 0.14, 0.27, moss, { p: [-0.05, 0.03, 0.31], wobble: 0.05, wobbleFreq: 4 });
  mushroom(armL, [-0.36, 0.08, 0.36], 0.75);
  glowArm.box(0.06, 0.5, 0.03, rune, { p: [-0.05, -0.58, 0.42], gain: 2.4 });
  glowArm.box(0.34, 0.06, 0.03, rune, { p: [-0.05, -0.5, 0.42], gain: 2.4 });
  for (const s of [-1, 1]) glowArm.box(0.06, 0.24, 0.03, rune, { p: [-0.05 + s * 0.13, -0.72, 0.42], r: [0, 0, s * 0.6], gain: 2.4 });
  // The maul: a banded haft and a stone head bound in iron, with a rune on its face.
  const O: V3 = [0, -0.74, 0.06], a = 1.15;
  armR.cyl(0.07, 0.08, 1.7, bark, { p: along(O, a, 0.62), r: [a, 0, 0] }, 8);
  for (const d of [0.05, 0.85]) armR.cyl(0.095, 0.095, 0.08, [0x3a3a40, 0x8a8a94], { p: along(O, a, d), r: [a, 0, 0] }, 8);
  armR.box(0.82, 0.62, 0.62, stone, { p: along(O, a, 1.44), r: [a, 0, 0], wobble: 0.03, flat: true });
  for (const d of [1.22, 1.66]) armR.box(0.86, 0.08, 0.66, [0x3a3a40, 0x8a8a94], { p: along(O, a, d), r: [a, 0, 0] });
  armR.sphere(0.2, moss, { p: along(O, a, 1.44, 0.3), s: [0.5, 1, 1], wobble: 0.04, wobbleFreq: 5 }, 8, 6);
  const face1 = along(O, a, 1.44);
  glowArmR.box(0.05, 0.3, 0.3, rune, { p: [-0.42, face1[1], face1[2]], r: [a, 0, 0], gain: 2.4 });

  // Legs: stump legs with a stone knee and roots splaying from the feet.
  const leg = () => {
    const l = new MB();
    l.cyl(0.26, 0.22, 0.5, bark, { p: [0, -0.25, 0], wobble: 0.02 }, 9);
    l.ico(0.16, stone, { p: [0, -0.22, 0.18], s: [1, 0.8, 0.7] }, 0);
    l.ico(0.27, stone, { p: [0, -0.55, 0.08], s: [1.1, 0.7, 1.4] }, 0);
    for (let k = 0; k < 4; k++) {
      const t = -0.9 + k * 0.6;
      l.cone(0.08, 0.34, barkDark, { p: [Math.sin(t) * 0.26, -0.62, 0.1 + Math.cos(t) * 0.26], r: [0, t - Math.PI / 2, -(Math.PI / 2 + 0.45)] }, 5);
    }
    return l;
  };
  return done({ body, head, armR, armL, legL: leg(), legR: leg(), glow, glowArm, glowHead, glowArmR });
}
