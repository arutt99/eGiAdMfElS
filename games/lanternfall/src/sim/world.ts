// Map geometry: roads, terrain height, and build rules. Has no rendering dependencies.
import { clamp, fbm, lerp, makeRng, noise2, smoothstep } from '../core/util';
import type { BiomeId, MapDef } from '../data/maps';

export const PATH_WIDTH = 3.2;
const STEP = 0.5;

export class RoadPath {
  /** x, z pairs at fixed STEP arc-length spacing. */
  pts: Float32Array;
  length: number;
  count: number;
  /** Road direction at each point, as x, z pairs. */
  private dirs: Float32Array;
  constructor(pts: Float32Array) {
    this.pts = pts;
    this.count = pts.length / 2;
    this.length = (this.count - 1) * STEP;
    this.dirs = new Float32Array(pts.length);
    for (let i = 0; i < this.count; i++) {
      const a = Math.max(0, i - 1), b = Math.min(this.count - 1, i + 1);
      const dx = pts[b * 2] - pts[a * 2], dz = pts[b * 2 + 1] - pts[a * 2 + 1];
      const l = Math.hypot(dx, dz) || 1;
      this.dirs[i * 2] = dx / l;
      this.dirs[i * 2 + 1] = dz / l;
    }
  }
  /**
   * Writes [x, z, dirX, dirZ] for a distance along the road. The direction blends between points,
   * so anything placed sideways from the road (like enemies off-centre) follows bends without jumping.
   */
  sample(d: number, out: { x: number; z: number; dx: number; dz: number }) {
    const f = clamp(d / STEP, 0, this.count - 1.001);
    const i = Math.floor(f);
    const t = f - i;
    const p = this.pts;
    const ax = p[i * 2], az = p[i * 2 + 1], bx = p[i * 2 + 2], bz = p[i * 2 + 3];
    out.x = ax + (bx - ax) * t;
    out.z = az + (bz - az) * t;
    const n = this.dirs;
    const dx = n[i * 2] + (n[i * 2 + 2] - n[i * 2]) * t;
    const dz = n[i * 2 + 1] + (n[i * 2 + 3] - n[i * 2 + 1]) * t;
    const l = Math.hypot(dx, dz) || 1;
    out.dx = dx / l;
    out.dz = dz / l;
    return out;
  }
}

function catmullRom(ctrl: [number, number][]): [number, number][] {
  const pts: [number, number][] = [];
  const n = ctrl.length;
  const at = (i: number) => {
    if (i < 0) return [2 * ctrl[0][0] - ctrl[1][0], 2 * ctrl[0][1] - ctrl[1][1]];
    if (i >= n) return [2 * ctrl[n - 1][0] - ctrl[n - 2][0], 2 * ctrl[n - 1][1] - ctrl[n - 2][1]];
    return ctrl[i];
  };
  for (let i = 0; i < n - 1; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    for (let s = 0; s < 40; s++) {
      const t = s / 40;
      const t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, c2: number, d: number) =>
        0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      pts.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(ctrl[n - 1]);
  return pts;
}

function resample(raw: [number, number][]): Float32Array {
  const out: number[] = [raw[0][0], raw[0][1]];
  let acc = 0;
  for (let i = 1; i < raw.length; i++) {
    let ax = raw[i - 1][0], az = raw[i - 1][1];
    const bx = raw[i][0], bz = raw[i][1];
    let seg = Math.hypot(bx - ax, bz - az);
    while (acc + seg >= STEP) {
      const t = (STEP - acc) / seg;
      ax += (bx - ax) * t;
      az += (bz - az) * t;
      out.push(ax, az);
      seg = Math.hypot(bx - ax, bz - az);
      acc = 0;
    }
    acc += seg;
  }
  out.push(raw[raw.length - 1][0], raw[raw.length - 1][1]);
  return new Float32Array(out);
}

export interface Blocker { x: number; z: number; r: number; kind: string; scale: number; rot: number; tint: number }

const BIOME_RELIEF: Record<BiomeId, { amp: number; hills: number; lakes: number; water: boolean }> = {
  meadow: { amp: 1.1, hills: 7, lakes: 0.3, water: true },
  forest: { amp: 1.3, hills: 9, lakes: 0.12, water: true },
  marsh: { amp: 0.55, hills: 3.5, lakes: 1, water: true },
  frost: { amp: 1.6, hills: 15, lakes: 0.18, water: true },
  desert: { amp: 1.0, hills: 10, lakes: 0, water: false },
  volcano: { amp: 1.5, hills: 11, lakes: 0.75, water: true },
};

const FIELD_RES = 2; // cells per world unit
const FIELD_R = 16; // world units of tracked road distance

export class World {
  map: MapDef;
  roads: RoadPath[];
  /** Straight flight lines for flying enemies, one per road. */
  airRoads: RoadPath[];
  halfW: number;
  halfH: number;
  extW: number;
  extH: number;
  waterLevel = 0;
  hasWater: boolean;
  blockers: Blocker[] = [];
  private fw: number;
  private fh: number;
  private dist: Float32Array;
  private heights: Float32Array;
  private relief: { amp: number; hills: number; lakes: number; water: boolean };

  constructor(map: MapDef) {
    this.map = map;
    this.halfW = map.halfW;
    this.halfH = map.halfH;
    this.extW = map.halfW + 26;
    this.extH = map.halfH + 26;
    this.relief = BIOME_RELIEF[map.biome];
    this.hasWater = this.relief.water;
    this.roads = map.paths.map((c) => new RoadPath(resample(catmullRom(c))));
    this.airRoads = map.paths.map((c) => {
      const a = c[0];
      const b = c[c.length - 1];
      const mx = (a[0] + b[0]) / 2 + (b[1] - a[1]) * 0.12;
      const mz = (a[1] + b[1]) / 2 - (b[0] - a[0]) * 0.12;
      return new RoadPath(resample(catmullRom([a, [mx, mz], b])));
    });

    this.fw = Math.ceil(this.extW * 2 * FIELD_RES) + 1;
    this.fh = Math.ceil(this.extH * 2 * FIELD_RES) + 1;
    this.dist = new Float32Array(this.fw * this.fh).fill(FIELD_R);
    this.rasterizeRoads();
    this.heights = new Float32Array(this.fw * this.fh);
    for (let j = 0; j < this.fh; j++) {
      for (let i = 0; i < this.fw; i++) {
        const x = i / FIELD_RES - this.extW;
        const z = j / FIELD_RES - this.extH;
        this.heights[j * this.fw + i] = this.computeHeight(x, z, this.dist[j * this.fw + i]);
      }
    }
    this.placeBlockers();
  }

  private rasterizeRoads() {
    const R = Math.ceil(FIELD_R * FIELD_RES);
    for (const road of this.roads) {
      for (let k = 0; k < road.count; k += 2) {
        const px = road.pts[k * 2], pz = road.pts[k * 2 + 1];
        const ci = Math.round((px + this.extW) * FIELD_RES);
        const cj = Math.round((pz + this.extH) * FIELD_RES);
        for (let j = Math.max(0, cj - R); j <= Math.min(this.fh - 1, cj + R); j++) {
          const z = j / FIELD_RES - this.extH;
          const row = j * this.fw;
          for (let i = Math.max(0, ci - R); i <= Math.min(this.fw - 1, ci + R); i++) {
            const x = i / FIELD_RES - this.extW;
            const d = Math.hypot(x - px, z - pz);
            if (d < this.dist[row + i]) this.dist[row + i] = d;
          }
        }
      }
    }
  }

  /** Distance from the rim of the island: >0 inside, <0 outside. */
  islandMask(x: number, z: number) {
    const seed = this.map.seed;
    const nx = x / this.extW;
    const nz = z / this.extH;
    const sq = Math.pow(Math.pow(Math.abs(nx), 3.4) + Math.pow(Math.abs(nz), 3.4), 1 / 3.4);
    const wob = (fbm(x * 0.05, z * 0.05, seed + 5, 3) - 0.5) * 0.16;
    return 1 - sq + wob - 0.03;
  }

  private computeHeight(x: number, z: number, d: number) {
    const s = this.map.seed;
    const r = this.relief;
    const rolling = (fbm(x * 0.045, z * 0.045, s, 4) - 0.5) * 2 * r.amp * 2.2;
    const detail = (fbm(x * 0.19, z * 0.19, s + 3, 3) - 0.5) * 0.35 * r.amp;
    let h = 1.0 + rolling + detail;

    // Lakes in low-lying regions, kept away from the road.
    if (r.lakes > 0) {
      const lakeNoise = fbm(x * 0.055 + 9, z * 0.055 - 4, s + 9, 3);
      const lake = smoothstep(0.62 - r.lakes * 0.17, 0.74 - r.lakes * 0.13, lakeNoise);
      h = lerp(h, -1.7, lake * smoothstep(5.5, 10, d));
    }

    // The road is a flat, slightly raised causeway.
    const roadH = 0.8 + (fbm(x * 0.03, z * 0.03, s + 2, 2) - 0.5) * 0.9;
    h = lerp(h, roadH, 1 - smoothstep(PATH_WIDTH * 0.7, PATH_WIDTH * 0.7 + 4.5, d));

    // Hills and mountains ring the play area.
    const px = Math.abs(x) / this.halfW;
    const pz = Math.abs(z) / this.halfH;
    const outer = Math.max(px, pz);
    const rise = smoothstep(0.98, 1.42, outer);
    if (rise > 0) {
      const ridge = 1 - Math.abs(noise2(x * 0.07, z * 0.07, s + 21) * 2 - 1);
      const lump = fbm(x * 0.11, z * 0.11, s + 12, 4);
      const roadClear = smoothstep(2.5, 11, d);
      h += rise * r.hills * (0.45 + ridge * 0.75 + lump * 0.65) * roadClear;
    }

    // Cliffs at the island rim, falling into the clouds.
    const m = this.islandMask(x, z);
    const roadNear = 1 - smoothstep(1, 8, d);
    const rim = smoothstep(-0.02, 0.1, m + roadNear * 0.06);
    h = lerp(-32 - (1 - clamp(m + 1)) * 12, h, rim);
    if (m < 0.1) {
      // Rocky strata on the cliff faces.
      h += (noise2(x * 0.6, z * 0.6, s + 40) - 0.5) * 1.1 * (1 - rim);
    }
    return h;
  }

  private fieldAt(field: Float32Array, x: number, z: number) {
    const fx = clamp((x + this.extW) * FIELD_RES, 0, this.fw - 1.001);
    const fz = clamp((z + this.extH) * FIELD_RES, 0, this.fh - 1.001);
    const i = Math.floor(fx);
    const j = Math.floor(fz);
    const tx = fx - i;
    const tz = fz - j;
    const row = j * this.fw;
    const a = field[row + i], b = field[row + i + 1];
    const c = field[row + this.fw + i], d = field[row + this.fw + i + 1];
    return lerp(lerp(a, b, tx), lerp(c, d, tx), tz);
  }

  height(x: number, z: number) {
    return this.fieldAt(this.heights, x, z);
  }

  roadDistance(x: number, z: number) {
    return this.fieldAt(this.dist, x, z);
  }

  /** Why a tower cannot be built here, or null if it can. */
  buildProblem(x: number, z: number, radius = 1.35): string | null {
    if (Math.abs(x) > this.halfW || Math.abs(z) > this.halfH) return 'Too far from the battlefield';
    if (this.roadDistance(x, z) < PATH_WIDTH * 0.5 + radius - 0.1) return 'Too close to the road';
    const h = this.height(x, z);
    if (this.hasWater && h < this.waterLevel + 0.12) return 'Cannot build on water';
    let lo = h, hi = h;
    for (let a = 0; a < 6; a++) {
      const v = this.height(x + Math.cos(a) * radius, z + Math.sin(a) * radius);
      lo = Math.min(lo, v);
      hi = Math.max(hi, v);
    }
    if (hi - lo > 1.5) return 'The ground is too steep';
    if (this.hasWater && lo < this.waterLevel) return 'Too close to the water';
    for (const b of this.blockers) {
      const dx = b.x - x, dz = b.z - z;
      const rr = b.r + radius - 0.2;
      if (dx * dx + dz * dz < rr * rr) return 'Something is in the way';
    }
    return null;
  }

  private placeBlockers() {
    const rng = makeRng(this.map.seed * 977 + 13);
    const b = this.map.biome;
    const treeKinds: Record<BiomeId, string[]> = {
      meadow: ['oak', 'oak', 'birch', 'oak', 'bush'],
      forest: ['bigtree', 'bigtree', 'pine', 'giantshroom', 'bigtree'],
      marsh: ['willow', 'deadtree', 'willow', 'bigshroom', 'reedclump'],
      frost: ['snowpine', 'snowpine', 'snowpine', 'icecrystal', 'snowpine'],
      desert: ['palm', 'cactus', 'cactus', 'pillar', 'mesarock'],
      volcano: ['charred', 'charred', 'obsidian', 'emberrock', 'charred'],
    };
    const density: Record<BiomeId, number> = { meadow: 320, forest: 720, marsh: 340, frost: 420, desert: 170, volcano: 260 };
    const nearChance: Record<BiomeId, number> = { meadow: 0.1, forest: 0.32, marsh: 0.12, frost: 0.16, desert: 0.08, volcano: 0.12 };
    const kinds = treeKinds[b];
    const clusterSeed = this.map.seed + 77;
    const tries = density[b] * 4;
    const placed: Blocker[] = [];
    for (let t = 0; t < tries && placed.length < density[b]; t++) {
      const x = (rng() * 2 - 1) * this.extW;
      const z = (rng() * 2 - 1) * this.extH;
      const roadD = this.roadDistance(x, z);
      if (roadD < PATH_WIDTH * 0.5 + 1.2) continue;
      if (this.islandMask(x, z) < 0.11) continue;
      const h = this.height(x, z);
      if (this.hasWater && h < this.waterLevel + 0.3) continue;
      const inside = Math.abs(x) < this.halfW && Math.abs(z) < this.halfH;
      const cluster = fbm(x * 0.09, z * 0.09, clusterSeed, 3);
      let keep = smoothstep(0.42, 0.6, cluster);
      if (inside) keep *= nearChance[b] * smoothstep(2, 9, roadD) + (roadD > 12 ? 0.35 : 0);
      else keep = Math.max(keep, 0.4);
      if (rng() > keep) continue;
      const kind = kinds[Math.floor(rng() * kinds.length)];
      const scale = 0.8 + rng() * 0.75;
      const r = (kind === 'bush' || kind === 'reedclump' ? 0.5 : kind === 'mesarock' ? 2.2 : 1.05) * scale;
      let ok = true;
      for (const o of placed) {
        const dx = o.x - x, dz = o.z - z;
        const min = (o.r + r) * 0.78;
        if (dx * dx + dz * dz < min * min) { ok = false; break; }
      }
      if (!ok) continue;
      placed.push({ x, z, r, kind, scale, rot: rng() * Math.PI * 2, tint: rng() });
    }
    // Scattered boulders on all maps give the build area some character.
    const rocks = 26;
    for (let t = 0; t < rocks * 5 && placed.length < density[b] + rocks; t++) {
      const x = (rng() * 2 - 1) * this.extW;
      const z = (rng() * 2 - 1) * this.extH;
      const roadD = this.roadDistance(x, z);
      if (roadD < PATH_WIDTH * 0.5 + 1 || this.islandMask(x, z) < 0.11) continue;
      if (this.hasWater && this.height(x, z) < this.waterLevel + 0.2) continue;
      if (rng() > 0.5) continue;
      const scale = 0.4 + rng() * 0.9;
      placed.push({ x, z, r: 0.9 * scale, kind: 'rock', scale, rot: rng() * 6.28, tint: rng() });
    }
    this.blockers = placed;
    this.placeLandmarks(rng);
  }

  /** Story props near the road. They block building, so they also shape each map. */
  private placeLandmarks(rng: () => number) {
    const sets: Record<BiomeId, string[]> = {
      meadow: ['windmill', 'cottage', 'cottage', 'stones', 'cottage'],
      forest: ['stones', 'stump', 'stones', 'hut'],
      marsh: ['hut', 'hut', 'stones', 'hut'],
      frost: ['watchtower', 'stones', 'watchtower', 'cottage'],
      desert: ['obelisk', 'arch', 'obelisk', 'arch', 'obelisk', 'sundial'],
      volcano: ['forgeruin', 'obsidianspire', 'forgeruin', 'obsidianspire'],
    };
    for (const kind of sets[this.map.biome]) {
      for (let t = 0; t < 120; t++) {
        const x = (rng() * 2 - 1) * (this.halfW + 8);
        const z = (rng() * 2 - 1) * (this.halfH + 8);
        const d = this.roadDistance(x, z);
        if (d < 6 || d > 15) continue;
        const h = this.height(x, z);
        if (this.hasWater && h < this.waterLevel + 0.5) continue;
        if (Math.abs(this.height(x + 2, z) - h) + Math.abs(this.height(x, z + 2) - h) > 1) continue;
        if (this.islandMask(x, z) < 0.13) continue;
        const r = 2.4;
        if (this.blockers.some((b) => (b.x - x) ** 2 + (b.z - z) ** 2 < (b.r + r + 3) ** 2 && b.r > 1.5)) continue;
        // Landmarks clear small plants away rather than overlapping them.
        this.blockers = this.blockers.filter((b) => (b.x - x) ** 2 + (b.z - z) ** 2 > (b.r + r) ** 2);
        this.blockers.push({ x, z, r, kind, scale: 1, rot: rng() * Math.PI * 2, tint: rng() });
        break;
      }
    }
  }

  private static cache = new Map<string, World>();
  /** Worlds are deterministic and immutable, so previews and games can share them. */
  static get(map: MapDef) {
    let w = World.cache.get(map.id);
    if (!w) {
      w = new World(map);
      World.cache.set(map.id, w);
    }
    return w;
  }
}
