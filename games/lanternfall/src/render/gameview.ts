// Connects the simulation to the 3D scene and turns game events into spectacle.
import * as THREE from 'three';
import { INK } from './style';
import { audio, DEATH_SOUNDS, type SoundPos } from '../audio/audio';
import { ENEMIES, type EnemyId } from '../data/enemies';
import type { TowerId } from '../data/towers';
import type { Enemy, Game, GameEvent, Tower, Unit, WavePreview } from '../sim/game';
import { enemyRig, getGuardGeo, getHeroGeo, type HumanoidGeo, type Rig, type RigPart } from './creature-models';
import type { Engine } from './engine';
import { Mats, inked } from './materials';
import { MB } from './mb';
import type { Stage } from './stage';
import { towerModel, type TowerModel } from './towers-models';
import { HealthBars, Particles, Ribbons, Rings } from './vfx';

const col = (hex: number, gain = 1) => new THREE.Color(hex).multiplyScalar(gain);

const C = {
  white: col(0xffffff, 2),
  gold: col(0xffd36b, 2.2),
  coin: col(0xffcf4f, 3),
  dust: col(0xc8b89a, 0.8),
  smoke: col(0x4a4048, 0.7),
  fire: col(0xff7a26, 3.4),
  fireHot: col(0xffc65a, 4),
  frost: col(0x9fecff, 2.6),
  magic: col(0xa67cff, 2.8),
  shock: col(0x7fc4ff, 3.2),
  beam: col(0xffb24a, 2.4),
  beamHot: col(0xfff0b8, 2.6),
  gloam: col(0x8a4cff, 2),
  gloamDark: col(0x1c1030, 0.8),
  heal: col(0x9dff5a, 2.4),
  root: col(0x7fe84a, 2),
  heroSun: col(0xffc76b, 3),
  guard: col(0x7fb8ff, 2.4),
  venom: col(0x9fe86a, 2.6),
};

interface PartMesh { mesh: THREE.InstancedMesh; part: RigPart }
interface EnemyMeshes { rig: Rig; parts: PartMesh[]; n: number }
/** A slain enemy playing out its death. */
interface Ghost {
  def: EnemyId; elite: boolean; x: number; y: number; z: number; rot: number; scale: number; t: number; phase: number;
  life: number; vx: number; vz: number; spin: number; hop: number; fall: number; boss: boolean; boom: number;
}

interface TowerView {
  tower: Tower;
  group: THREE.Group;
  head: THREE.Object3D | null;
  orbit: THREE.Object3D | null;
  model: TowerModel;
  born: number;
  level: number;
  branch: number;
  y: number;
  aim: number;
  auraColor: THREE.Color;
}

interface HumanView {
  group: THREE.Group;
  body: THREE.Group;
  head: THREE.Mesh;
  armR: THREE.Group;
  armL: THREE.Group;
  legL: THREE.Mesh;
  legR: THREE.Mesh;
  glowLight?: THREE.PointLight;
  walk: number;
  angle: number;
  born: number;
}

const tmpM = new THREE.Matrix4();
const tmpB = new THREE.Matrix4();
const tmpP = new THREE.Matrix4();
const tmpR = new THREE.Matrix4();
const tmpE = new THREE.Euler();
const tmpQ = new THREE.Quaternion();
const tmpV = new THREE.Vector3();
const tmpS = new THREE.Vector3();
const tmpC = new THREE.Color();
const UP = new THREE.Vector3(0, 1, 0);
const ENEMY_SCALE = INK ? 1.6 : 1.35;
const BOSS_RINGS = 32;
const WARD_TINT = new THREE.Color(0.8, 1.5, 2.1);
const tmpRingColor = new THREE.Color();
const tmpRingMatrix = new THREE.Matrix4();
const FORWARD = new THREE.Vector3(0, 0, 1);
const tmpD = new THREE.Vector3();
const tmpRoad = { x: 0, z: 0, dx: 0, dz: 0 };
const PROJ_KINDS = ['arrow', 'shell', 'orb', 'shard', 'bolt', 'glob'] as const;
// A larger jump in one step is a teleport (blink, respawn), which should snap instead of slide.
const TELEPORT = 3;
/** The camera distance at which world sounds play at full level: the default view. */
const SOUND_NEAR = 96;
const SLOW_TINT = new THREE.Color(0.72, 1.05, 1.5);
const POISON_TINT = new THREE.Color(0.8, 1.35, 0.7);

interface ProjTrack { x: number; y: number; z: number; dx: number; dy: number; dz: number }

function buildProjectileGeos() {
  const arrow = new MB();
  arrow.cyl(0.03, 0.03, 1.1, 0xe6d2a3, { r: [Math.PI / 2, 0, 0] }, 5);
  arrow.cone(0.075, 0.26, 0xdfe4f0, { p: [0, 0, 0.64], r: [Math.PI / 2, 0, 0] }, 5);
  arrow.box(0.16, 0.012, 0.22, 0xff6a5a, { p: [0, 0, -0.5] });
  arrow.box(0.012, 0.16, 0.22, 0xff6a5a, { p: [0, 0, -0.5] });
  const shell = new MB();
  shell.sphere(0.34, [0x2f2a2c, 0x4f4648], {}, 10, 8);
  shell.torus(0.34, 0.035, 0x7a6a50, { r: [Math.PI / 2, 0, 0] }, 5, 14);
  const orb = new MB();
  orb.sphere(0.27, 0xffffff, { gain: 1 }, 10, 8);
  const shard = new MB();
  shard.crystal(0.17, 0.8, 0xffffff, { r: [Math.PI / 2, 0, 0], gain: 1 });
  const bolt = new MB();
  bolt.cyl(0.075, 0.075, 2, 0x9c6631, { r: [Math.PI / 2, 0, 0] }, 6);
  bolt.cone(0.2, 0.55, 0xdfe4f0, { p: [0, 0, 1.2], r: [Math.PI / 2, 0, 0] }, 6);
  bolt.box(0.42, 0.02, 0.4, 0xffd36b, { p: [0, 0, -0.85] });
  bolt.box(0.02, 0.42, 0.4, 0xffd36b, { p: [0, 0, -0.85] });
  const glob = new MB();
  glob.sphere(0.3, 0xffffff, { gain: 1, s: [1, 1, 1.25], wobble: 0.03, wobbleFreq: 6 }, 10, 8);
  return { arrow: arrow.build(), shell: shell.build(), orb: orb.build(), shard: shard.build(), bolt: bolt.build(), glob: glob.build() };
}

let projGeos: ReturnType<typeof buildProjectileGeos> | null = null;

export class GameView {
  particles: Particles;
  smoke: Particles;
  rings = new Rings();
  ribbons = new Ribbons();
  bars = new HealthBars();
  towerViews = new Map<number, TowerView>();
  private enemyMeshes = new Map<EnemyId, EnemyMeshes>();
  private ghosts: Ghost[] = [];
  private angles = new Map<number, number>();
  private projMeshes: Record<string, THREE.InstancedMesh> = {};
  private projPrev = new Map<number, ProjTrack>();
  private projSeen = new Set<number>();
  private projCounts = { arrow: 0, shell: 0, orb: 0, shard: 0, bolt: 0, glob: 0 };
  private guardsAlive = new Set<number>();
  private previewWave = -1;
  private previewList: WavePreview[] = [];
  private beamPts: THREE.Vector3[][] = [];
  private beamPtsN = 0;
  /** How far the drawing is between the last two simulation steps (0 to 1). */
  private alpha = 1;
  /** Game time at that same point, so animation is as smooth as movement. */
  private animTime = 0;
  /** Drawn position of the object last passed to interp. */
  private ix = 0;
  private iz = 0;
  private hero: HumanView;
  private guards = new Map<number, HumanView>();
  private heroRing: THREE.Mesh;
  private bossRings: THREE.InstancedMesh;
  private heroColor: THREE.Color;
  private chevrons: THREE.InstancedMesh;
  private airChevrons: THREE.InstancedMesh;
  private ghost: THREE.Group | null = null;
  private ghostKey = '';
  private ghostValidMat: THREE.MeshStandardMaterial;
  private ghostBadMat: THREE.MeshStandardMaterial;
  private flashIdx = 0;
  private flashes: { light: THREE.PointLight; t: number; life: number; i: number }[] = [];
  private pointScale = 500;
  private leakShake = 0;
  private root = new THREE.Group();
  time = 0;
  onFloat: ((x: number, y: number, z: number, text: string, cls: string) => void) | null = null;
  onCoin: ((x: number, y: number, z: number, amount: number) => void) | null = null;
  onIncome: ((amount: number) => void) | null = null;
  onBoss: (() => void) | null = null;
  onBossDown: (() => void) | null = null;
  private bossSteps = new Map<number, number>();
  showNumbers = true;
  shakeEnabled = true;
  private scale = 1;

  constructor(public game: Game, public stage: Stage, public engine: Engine) {
    const q = stage.q;
    this.scale = q.particles / 14000;
    this.particles = new Particles(q.particles, true);
    this.smoke = new Particles(Math.floor(q.particles * 0.5), false, 1.1);
    stage.scene.add(this.root);
    this.root.add(this.particles.mesh, this.smoke.mesh, this.rings.mesh, this.ribbons.mesh, this.bars.mesh);

    for (const id of Object.keys(ENEMIES) as EnemyId[]) {
      const rig = enemyRig(id);
      const capacity = ENEMIES[id].boss ? 40 : id === 'gloomling' ? 340 : 220;
      const parts = rig.parts.map((part) => {
        const mesh = new THREE.InstancedMesh(part.geo, part.glow ? Mats.glow : Mats.std, capacity);
        mesh.count = 0;
        mesh.frustumCulled = false;
        mesh.castShadow = !part.glow;
        if (!part.glow) {
          mesh.setColorAt(0, new THREE.Color(1, 1, 1));
          mesh.instanceColor!.setUsage(THREE.DynamicDrawUsage);
        }
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        if (!part.glow) inked(mesh);
        this.root.add(mesh);
        return { mesh, part };
      });
      this.enemyMeshes.set(id, { rig, parts, n: 0 });
    }

    projGeos ??= buildProjectileGeos();
    const projMat = (kind: keyof ReturnType<typeof buildProjectileGeos>, glow: boolean, n: number) => {
      const m = new THREE.InstancedMesh(projGeos![kind], glow ? Mats.glow : Mats.std, n);
      m.count = 0;
      m.frustumCulled = false;
      m.castShadow = !glow;
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      if (glow) {
        m.setColorAt(0, new THREE.Color(1, 1, 1));
        m.instanceColor!.setUsage(THREE.DynamicDrawUsage);
      }
      this.root.add(m);
      return m;
    };
    this.projMeshes = {
      arrow: projMat('arrow', false, 260),
      shell: projMat('shell', false, 90),
      orb: projMat('orb', true, 120),
      shard: projMat('shard', true, 120),
      bolt: projMat('bolt', false, 100),
      glob: projMat('glob', true, 120),
    };

    // Size no longer marks a boss, so each one walks on a glowing ring in its own color.
    const bossRingGeo = new THREE.RingGeometry(0.84, 1, 40);
    bossRingGeo.rotateX(-Math.PI / 2);
    this.bossRings = new THREE.InstancedMesh(bossRingGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }), BOSS_RINGS);
    this.bossRings.count = 0;
    this.bossRings.frustumCulled = false;
    this.bossRings.setColorAt(0, new THREE.Color(1, 1, 1));
    this.bossRings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.bossRings.instanceColor!.setUsage(THREE.DynamicDrawUsage);
    this.root.add(this.bossRings);

    this.hero = this.makeHuman(getHeroGeo(game.heroDef.id), true);
    this.heroColor = new THREE.Color(game.heroDef.accent).multiplyScalar(3);
    this.root.add(this.hero.group);
    const ringGeo = new THREE.RingGeometry(0.92, 1.08, 40);
    ringGeo.rotateX(-Math.PI / 2);
    this.heroRing = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: col(0xffd36b, 1.7), transparent: true, opacity: 0.85, depthWrite: false, side: THREE.DoubleSide }));
    this.root.add(this.heroRing);

    // Chevrons flowing along the roads, showing routes between waves.
    const chevG = new MB();
    // The arms meet at +Z, so the point leads once placeChevron turns +Z along the road.
    chevG.box(0.14, 0.03, 0.72, 0xffffff, { p: [-0.22, 0, 0], r: [0, 0.72, 0] });
    chevG.box(0.14, 0.03, 0.72, 0xffffff, { p: [0.22, 0, 0], r: [0, -0.72, 0] });
    const chevGeo = chevG.build();
    const chevN = 140;
    this.chevrons = new THREE.InstancedMesh(chevGeo, new THREE.MeshBasicMaterial({ color: col(0xffe2a8, 1.55), transparent: true, opacity: 0.85, depthWrite: false }), chevN);
    this.airChevrons = new THREE.InstancedMesh(chevGeo, new THREE.MeshBasicMaterial({ color: col(0xd9a6ff, 2), transparent: true, opacity: 0.8, depthWrite: false }), 70);
    this.chevrons.frustumCulled = false;
    this.airChevrons.frustumCulled = false;
    this.chevrons.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.airChevrons.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.root.add(this.chevrons, this.airChevrons);

    this.ghostValidMat = new THREE.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.72, emissive: 0x58482a, roughness: 0.8 });
    this.ghostBadMat = new THREE.MeshStandardMaterial({ color: 0xff7468, vertexColors: true, transparent: true, opacity: 0.55, emissive: 0x7a1408, roughness: 0.8 });
  }

  private makeHuman(geo: HumanoidGeo, withLight: boolean): HumanView {
    const group = new THREE.Group();
    const body = new THREE.Group();
    group.add(body);
    const mesh = (g: THREE.BufferGeometry, glow = false) => {
      const m = new THREE.Mesh(g, glow ? Mats.glow : Mats.std);
      m.castShadow = !glow;
      m.frustumCulled = false;
      return glow ? m : inked(m);
    };
    body.add(mesh(geo.body), mesh(geo.glow, true));
    const head = mesh(geo.head);
    head.position.set(0, 1.68, 0);
    if (geo.glowHead) head.add(mesh(geo.glowHead, true));
    body.add(head);
    const armR = new THREE.Group();
    armR.position.set(0.56, 1.48, 0);
    armR.add(mesh(geo.armR));
    if (geo.glowArmR) armR.add(mesh(geo.glowArmR, true));
    const armL = new THREE.Group();
    armL.position.set(-0.56, 1.48, 0);
    armL.add(mesh(geo.armL), mesh(geo.glowArm, true));
    body.add(armR, armL);
    const legL = mesh(geo.legL);
    legL.position.set(-0.2, 0.58, 0);
    const legR = mesh(geo.legR);
    legR.position.set(0.2, 0.58, 0);
    group.add(legL, legR);
    const view: HumanView = { group, body, head, armR, armL, legL, legR, walk: 0, angle: 0, born: this.time };
    if (withLight) {
      const light = new THREE.PointLight(0xffb45c, 14, 11, 1.7);
      light.position.set(-0.56, 0.5, 0.1);
      group.add(light);
      view.glowLight = light;
    }
    return view;
  }

  private addTowerView(t: Tower) {
    const model = towerModel(t.type, t.level, t.branch);
    const group = new THREE.Group();
    const y = this.game.world.height(t.x, t.z);
    group.position.set(t.x, y - 0.05, t.z);
    const base = inked(new THREE.Mesh(model.base, Mats.std));
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);
    if (model.metal) {
      const m = inked(new THREE.Mesh(model.metal, Mats.metal));
      m.castShadow = true;
      group.add(m);
    }
    if (model.glow) group.add(new THREE.Mesh(model.glow, Mats.glow));
    let head: THREE.Object3D | null = null;
    if (model.head || model.headGlow) {
      head = new THREE.Group();
      head.position.y = model.headY;
      if (model.head) {
        const m = inked(new THREE.Mesh(model.head, Mats.std));
        m.castShadow = true;
        head.add(m);
      }
      if (model.headGlow) head.add(new THREE.Mesh(model.headGlow, Mats.glow));
      group.add(head);
    }
    let orbit: THREE.Object3D | null = null;
    if (model.orbit) {
      orbit = new THREE.Mesh(model.orbit, Mats.glow);
      if (model.orbitInk) inked(orbit as THREE.Mesh);
      orbit.position.y = model.orbitY;
      group.add(orbit);
    }
    this.root.add(group);
    const view: TowerView = { tower: t, group, head, orbit, model, born: this.time, level: t.level, branch: t.branch, y, aim: t.aim, auraColor: new THREE.Color(model.accent).multiplyScalar(2) };
    this.towerViews.set(t.id, view);
    return view;
  }

  private removeTowerView(id: number) {
    const v = this.towerViews.get(id);
    if (!v) return;
    this.root.remove(v.group);
    this.towerViews.delete(id);
  }

  /** Shows a transparent preview of the tower that will be built. */
  setGhost(type: TowerId | null, x: number, z: number, valid: boolean) {
    if (!type) {
      if (this.ghost) this.ghost.visible = false;
      return;
    }
    if (this.ghostKey !== type) {
      if (this.ghost) this.root.remove(this.ghost);
      this.ghost = new THREE.Group();
      const model = towerModel(type, 0, 0);
      const addM = (g?: THREE.BufferGeometry, y = 0) => {
        if (!g) return;
        const m = new THREE.Mesh(g, this.ghostValidMat);
        m.position.y = y;
        this.ghost!.add(m);
      };
      addM(model.base);
      addM(model.metal);
      addM(model.glow);
      addM(model.head, model.headY);
      addM(model.headGlow, model.headY);
      addM(model.orbit, model.orbitY);
      this.ghostKey = type;
      this.root.add(this.ghost);
    }
    const g = this.ghost!;
    g.visible = true;
    g.position.set(x, this.game.world.height(x, z), z);
    const mat = valid ? this.ghostValidMat : this.ghostBadMat;
    g.traverse((o) => {
      if (o instanceof THREE.Mesh) o.material = mat;
    });
  }

  /** Works out where an object should be drawn this frame, into ix and iz. */
  private interp(o: { x: number; z: number; px: number; pz: number }) {
    const dx = o.x - o.px, dz = o.z - o.pz;
    if (dx * dx + dz * dz > TELEPORT * TELEPORT) {
      this.ix = o.x;
      this.iz = o.z;
    } else {
      this.ix = o.px + dx * this.alpha;
      this.iz = o.pz + dz * this.alpha;
    }
  }

  /** How much of a timed effect that started at `at` is left, from 1 down to 0. */
  private remaining(at: number, duration: number) {
    return Math.max(0, Math.min(1, 1 - (this.animTime - at) / duration));
  }

  /** A reusable two-point line for ribbons that only last this frame. */
  private frameLine(ax: number, ay: number, az: number, bx: number, by: number, bz: number) {
    let pts = this.beamPts[this.beamPtsN];
    if (!pts) {
      pts = [new THREE.Vector3(), new THREE.Vector3()];
      this.beamPts.push(pts);
    }
    this.beamPtsN++;
    pts[0].set(ax, ay, az);
    pts[1].set(bx, by, bz);
    return pts;
  }

  private enemyY(e: Enemy, rig: Rig, x = e.x, z = e.z) {
    const h = this.game.world.height(x, z);
    if (rig.flyHeight > 0) return Math.max(h, 0) + rig.flyHeight + Math.sin(this.time * 1.6 + e.animPhase) * 0.3;
    return h;
  }

  private enemyTop(e: Enemy) {
    const rig = enemyRig(e.def.id);
    return this.enemyY(e, rig) + rig.height * e.scale;
  }

  private partLocal(part: RigPart, rig: Rig, t: number, walkF: number, attackK: number) {
    // Writes the animated local transform of a rig part into tmpP.
    let rx = 0, ry = 0, rz = 0;
    const s = Math.sin(t * walkF);
    switch (part.anim) {
      case 'legA': rx = s * 0.75; break;
      case 'legB': rx = -s * 0.75; break;
      case 'armA': rx = -s * 0.35; break;
      case 'armB': rx = s * 0.35 - attackK * 1.7; break;
      case 'wingL': rz = 0.1 + Math.sin(t * walkF * 2.6) * 0.72; break;
      case 'wingR': rz = -0.1 - Math.sin(t * walkF * 2.6) * 0.72; break;
      case 'head': rx = Math.sin(t * walkF * 0.5) * 0.08 - attackK * 0.35; break;
      case 'tail': ry = Math.sin(t * walkF) * 0.5; break;
    }
    tmpE.set(rx, ry, rz);
    tmpQ.setFromEuler(tmpE);
    tmpP.compose(tmpV.set(part.pivot[0], part.pivot[1], part.pivot[2]), tmpQ, tmpS.setScalar(1));
    void rig;
  }

  private writeEnemy(em: EnemyMeshes, x: number, y: number, z: number, rot: number, scale: number, t: number, walkF: number, attackK: number, tint: THREE.Color, hop: number) {
    const idx = em.n++;
    tmpQ.setFromAxisAngle(UP, rot);
    // Squash on landing and stretch at the top of each hop, keeping the volume roughly constant.
    const sy = INK && hop > 0 ? 1 + (Math.abs(Math.sin(t * walkF)) - 0.4) * 0.24 - attackK * 0.14 : 1;
    const sx = INK && hop > 0 ? 1 / Math.sqrt(Math.max(sy, 0.5)) : 1;
    tmpB.compose(tmpV.set(x, y + Math.abs(Math.sin(t * walkF)) * hop * scale, z), tmpQ, tmpS.set(scale * sx, scale * sy, scale * sx));
    for (const pm of em.parts) {
      if (idx >= pm.mesh.instanceMatrix.count) continue;
      this.partLocal(pm.part, em.rig, t, walkF, attackK);
      tmpM.multiplyMatrices(tmpB, tmpP);
      pm.mesh.setMatrixAt(idx, tmpM);
      if (!pm.part.glow) pm.mesh.setColorAt(idx, tint);
    }
  }

  private updateEnemies(dt: number) {
    const game = this.game;
    for (const em of this.enemyMeshes.values()) em.n = 0;
    this.bars.begin();
    let bossRingCount = 0;
    const emitChance = this.scale;
    for (const e of game.enemies) {
      const em = this.enemyMeshes.get(e.def.id)!;
      const rig = em.rig;
      this.interp(e);
      const x = this.ix, z = this.iz;
      const y = this.enemyY(e, rig, x, z);
      let ang = this.angles.get(e.id);
      const target = Math.atan2(e.dirX, e.dirZ);
      if (ang === undefined) {
        ang = target;
      } else {
        const delta = Math.atan2(Math.sin(target - ang), Math.cos(target - ang));
        ang += delta * Math.min(1, dt * 9);
      }
      this.angles.set(e.id, ang);
      let face = ang;
      if (e.engaged) face = Math.atan2(e.engaged.x - e.x, e.engaged.z - e.z);

      const flash = this.remaining(e.hitAt, 0.11);
      const frozen = e.frozenT > 0;
      const held = e.stunT > 0 || frozen || e.rootT > 0;
      const walk = held || e.engaged ? 0 : e.speed * 2.5 * (e.slowT > 0 ? 1 - e.slow : 1) * (e.hasteT > 0 ? e.hasteMult : 1);
      const t = (rig.flyHeight > 0 ? this.time * 2.4 : this.animTime) + e.animPhase;
      const walkF = rig.flyHeight > 0 ? 3.6 : Math.max(walk, 0.0001) || 0.0001;
      const atk = this.remaining(e.attackAt, 0.38);

      tmpC.setRGB(1, 1, 1);
      if (e.elite) tmpC.setRGB(1.38, 1.15, 0.78);
      if (e.shield > 0) tmpC.lerp(WARD_TINT, 0.55);
      if (frozen) tmpC.setRGB(0.68, 1.3, 2.0);
      else if (e.slowT > 0) tmpC.lerp(SLOW_TINT, 0.6);
      if (e.rootT > 0 || e.poisonT > 0) tmpC.multiply(POISON_TINT);
      if (flash > 0) tmpC.setRGB(tmpC.r + flash * 3.2, tmpC.g + flash * 2.9, tmpC.b + flash * 2.6);

      const stepT = walk === 0 && rig.flyHeight === 0 ? 0 : t;
      // Each blow knocks the creature back along the road, and it swells for a moment.
      const kick = this.remaining(e.kickAt, 0.17);
      const shove = kick * kick * 0.34;
      this.writeEnemy(em, x - e.dirX * shove, y, z - e.dirZ * shove, face, e.scale * ENEMY_SCALE * (1 + kick * kick * 0.13), stepT, walkF, atk, tmpC, walk === 0 ? 0 : rig.hop);

      if (e.def.boss) {
        if (bossRingCount < BOSS_RINGS) {
          const ground = game.world.height(x, z);
          const groundY = (rig.flyHeight > 0 ? Math.max(ground, 0) : ground) + 0.14;
          const pulse = 1.55 + Math.sin(this.time * 3 + e.animPhase) * 0.09;
          tmpRingMatrix.makeScale(pulse, 1, pulse).setPosition(x, groundY, z);
          this.bossRings.setMatrixAt(bossRingCount, tmpRingMatrix);
          tmpRingColor.setHex(e.shield > 0 ? 0xd8f6ff : rig.accent).multiplyScalar(e.hasteT > 0 ? 1.8 : 1.2);
          this.bossRings.setColorAt(bossRingCount, tmpRingColor);
          bossRingCount++;
        }
        if (walk > 0 && rig.flyHeight === 0) {
          // Heavy footfalls, without shaking the camera the whole way down the road.
          const last = this.bossSteps.get(e.id) ?? -9;
          if (this.animTime - last > 1.05) {
            this.bossSteps.set(e.id, this.animTime);
            audio.play('bossStep', 0.6, this.soundAt(x, z));
            this.puff(x, y + 0.2, z, 4, 0.8, C.dust, 0.45, 0.7, 1);
          }
        }
      }

      if (e.hp < e.maxHp || e.def.boss) {
        const top = y + rig.height * e.scale * ENEMY_SCALE + 0.45;
        const w = e.def.boss ? 3.2 : 1.05 + e.scale * 0.5;
        this.bars.add(x, top + (e.def.boss ? 0.25 : 0), z, Math.max(0, e.hp / e.maxHp), w, e.def.boss ? 3 : e.elite ? 1 : 0);
      }

      // Ambient creature effects.
      if (Math.random() < dt * 22 * emitChance) {
        if (e.def.id === 'shade') {
          this.smoke.emit({ x: e.x + (Math.random() - 0.5) * 0.7, y: y + 0.4, z: e.z + (Math.random() - 0.5) * 0.7, vy: 0.7, life: 0.9, size: 1.1, sizeEnd: 0.1, color: C.gloamDark, alpha: 0.65 });
        } else if (e.elite) {
          this.particles.emit({ x: e.x + (Math.random() - 0.5) * e.scale, y: y + Math.random() * rig.height * e.scale, z: e.z + (Math.random() - 0.5) * e.scale, vy: 1.4, life: 0.8, size: 0.34, sizeEnd: 0, color: C.gold, alpha: 0.9 });
        } else if (frozen && Math.random() < 0.4) {
          this.particles.emit({ x: e.x, y: y + Math.random() * rig.height, z: e.z, vy: 0.3, life: 0.5, size: 0.24, sizeEnd: 0, color: C.frost, alpha: 0.8 });
        } else if (e.def.boss && Math.random() < 0.28) {
          this.particles.emit({ x: e.x + (Math.random() - 0.5) * 1.6, y: y + Math.random() * rig.height * e.scale * ENEMY_SCALE, z: e.z + (Math.random() - 0.5) * 1.6, vy: 1, life: 0.9, size: 0.3, sizeEnd: 0, color: col(rig.accent, 2), alpha: 0.7 });
        }
      }
      if (e.stunT > 0 && Math.random() < dt * 8) {
        const a = Math.random() * 6.28;
        this.particles.emit({ x: e.x + Math.cos(a) * 0.5, y: y + rig.height * e.scale, z: e.z + Math.sin(a) * 0.5, vy: 0.2, life: 0.4, size: 0.3, sizeEnd: 0, color: C.gold });
      }
    }

    this.bossRings.count = bossRingCount;
    this.bossRings.instanceMatrix.needsUpdate = true;
    if (this.bossRings.instanceColor) this.bossRings.instanceColor.needsUpdate = true;

    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const g = this.ghosts[i];
      g.t += dt / g.life;
      if (g.t >= 1) {
        const groundY = g.y - g.fall;
        if (g.fall > 0) this.puff(g.x, groundY, g.z, 8, 0.8, C.dust, 0.5, 0.7, 1);
        if (g.boss) {
          const rig = this.enemyMeshes.get(g.def)!.rig;
          const accent = col(rig.accent, 2);
          this.rings.add(g.x, groundY + 0.4, g.z, 6, accent, 0.9);
          this.burst(g.x, groundY + 1.2, g.z, 60, 9, accent, 0.9, 0.55, 7);
          this.flash(g.x, groundY + 2, g.z, rig.accent, 200, 0.5);
          this.shake(0.35);
          audio.play('bigExplosion', 1, this.soundAt(g.x, g.z));
        }
        this.ghosts.splice(i, 1);
        continue;
      }
      const em = this.enemyMeshes.get(g.def)!;
      const k = g.t;
      g.x += g.vx * dt;
      g.z += g.vz * dt;
      g.rot += g.spin * dt;
      if (g.boss) {
        // A boss shudders and breaks apart in a string of blasts as it sinks.
        g.boom -= dt;
        if (g.boom <= 0) {
          g.boom = 0.2;
          const rig = em.rig;
          const ox = g.x + (Math.random() - 0.5) * 1.6, oz = g.z + (Math.random() - 0.5) * 1.6, oy = g.y + 0.4 + Math.random() * rig.height * g.scale * (1 - k);
          this.burst(ox, oy, oz, 14, 5, col(rig.accent, 2), 0.45, 0.32, 5);
          this.flash(ox, oy, oz, rig.accent, 50, 0.14);
          this.shake(0.1);
          audio.play('explosion', 0.65, this.soundAt(ox, oz));
        }
      }
      const fade = 1 - k;
      tmpC.setRGB(1 + fade * fade * 2.6, 1 + fade * fade * 2.2, 1 + fade * fade * 3);
      // Ground creatures are tossed up, flyers drop out of the air, and all of them shrink away at the end.
      const y = g.y + Math.sin(Math.min(1, k * 1.5) * Math.PI) * g.hop - (g.fall > 0 ? k * k * g.fall : g.boss ? k * k * 1.4 : k * 0.3);
      const shrink = k < 0.6 ? 1 + (0.6 - k) * 0.2 : 1 - Math.pow((k - 0.6) / 0.4, 2);
      const jitter = g.boss ? (Math.random() - 0.5) * 0.18 : 0;
      this.writeEnemy(em, g.x + jitter, y, g.z + jitter, g.rot, Math.max(0.001, g.scale * shrink), g.phase, 0.0001, 0, tmpC, 0);
    }

    for (const em of this.enemyMeshes.values()) {
      for (const pm of em.parts) {
        // writeEnemy stops writing at capacity, and drawing past the buffer fails the whole mesh.
        pm.mesh.count = Math.min(em.n, pm.mesh.instanceMatrix.count);
        pm.mesh.instanceMatrix.needsUpdate = true;
        if (pm.mesh.instanceColor) pm.mesh.instanceColor.needsUpdate = true;
      }
    }

    if (this.angles.size > 1200) {
      const alive = new Set(game.enemies.map((e) => e.id));
      for (const id of this.angles.keys()) if (!alive.has(id)) this.angles.delete(id);
    }

    // Bars for defenders.
    for (const u of game.units) {
      if (u.dead || u.hp >= u.maxHp) continue;
      this.interp(u);
      this.bars.add(this.ix, game.world.height(this.ix, this.iz) + (u.kind === 'hero' ? 3.6 : 3), this.iz, Math.max(0, u.hp / u.maxHp), u.kind === 'hero' ? 1.5 : 1, u.kind === 'hero' ? 1 : 2);
    }
    this.bars.end();
  }

  private animateHuman(v: HumanView, u: Unit, dt: number) {
    const game = this.game;
    this.interp(u);
    v.group.position.set(this.ix, game.world.height(this.ix, this.iz), this.iz);
    const target = Math.atan2(u.dirX, u.dirZ);
    const delta = Math.atan2(Math.sin(target - v.angle), Math.cos(target - v.angle));
    v.angle += delta * Math.min(1, dt * 11);
    v.group.rotation.y = v.angle;
    if (u.moving) v.walk += dt * 11;
    const s = u.moving ? Math.sin(v.walk) : 0;
    v.legL.rotation.x = s * 0.8;
    v.legR.rotation.x = -s * 0.8;
    const atk = this.remaining(u.attackAt, 0.3);
    const swing = atk > 0 ? Math.sin(atk * Math.PI) : 0;
    v.armR.rotation.x = (u.moving ? -s * 0.5 : Math.sin(this.time * 1.8) * 0.04) - swing * 1.9 + 0.2;
    v.armL.rotation.x = u.moving ? s * 0.5 : Math.sin(this.time * 1.5) * 0.04;
    v.body.position.y = (u.moving ? Math.abs(Math.sin(v.walk)) * 0.09 : Math.sin(this.time * 1.8) * 0.018);
    v.body.rotation.x = u.moving ? 0.1 : 0;
    v.body.rotation.y = swing * 0.6;
    const appear = Math.min(1, (this.time - v.born) / 0.24);
    v.group.scale.setScalar(appear * (u.kind === 'hero' ? 1.42 : 1.2));
  }

  private updateUnits(dt: number) {
    const game = this.game;
    const hero = game.hero;
    this.hero.group.visible = !hero.dead;
    this.heroRing.visible = !hero.dead;
    if (!hero.dead) {
      this.animateHuman(this.hero, hero, dt);
      const heroPos = this.hero.group.position;
      this.heroRing.position.set(heroPos.x, heroPos.y + 0.1, heroPos.z);
      this.heroRing.scale.setScalar(1 + Math.sin(this.time * 3) * 0.06);
      if (game.wardT > 0 && Math.random() < dt * 28 * this.scale) {
        const a = Math.random() * 6.28;
        this.particles.emit({ x: hero.x + Math.cos(a) * 1.3, y: this.hero.group.position.y + 0.2, z: hero.z + Math.sin(a) * 1.3, vy: 3, life: 0.8, size: 0.34, sizeEnd: 0, color: C.gold });
      }
    }
    const alive = this.guardsAlive;
    alive.clear();
    for (const u of game.units) {
      if (u.kind !== 'guard') continue;
      alive.add(u.id);
      let v = this.guards.get(u.id);
      if (!v) {
        v = this.makeHuman(getGuardGeo(), false);
        this.guards.set(u.id, v);
        this.root.add(v.group);
      }
      this.animateHuman(v, u, dt);
    }
    for (const [id, v] of this.guards) {
      if (!alive.has(id)) {
        this.root.remove(v.group);
        this.guards.delete(id);
      }
    }
  }

  private updateTowers(dt: number) {
    const game = this.game;
    let beams = 0, beamPan = 0, beamHeat = 0;
    for (const v of this.towerViews.values()) {
      const t = v.tower;
      if (t.level !== v.level || t.branch !== v.branch) {
        // A new silhouette for the new tier: swap the model and keep the build pop.
        this.removeTowerView(t.id);
        const n = this.addTowerView(t);
        n.born = this.time;
        continue;
      }
      const age = this.time - v.born;
      const pop = age < 0.5 ? easeOutBack(Math.min(1, age / 0.42)) : 1;
      const recoil = this.remaining(t.firedAt, 0.2);
      if (age < 0.5) v.group.scale.set(pop, pop, pop);
      else if (INK && recoil > 0) {
        // The whole tower kicks a little when it fires.
        const kick = recoil * recoil * 0.07;
        v.group.scale.set(1 + kick, 1 - kick, 1 + kick);
      } else v.group.scale.setScalar(1);
      if (v.head) {
        const delta = Math.atan2(Math.sin(t.aim - v.aim), Math.cos(t.aim - v.aim));
        v.aim += delta * Math.min(1, dt * 14);
        v.head.rotation.y = v.aim;
        const pull = recoil * recoil;
        v.head.position.set(-Math.sin(v.aim) * pull * 0.14, v.model.headY - pull * 0.05, -Math.cos(v.aim) * pull * 0.14);
        const sq = 1 + pull * 0.08;
        v.head.scale.set(sq, 1 / sq, sq);
      }
      if (v.orbit) {
        v.orbit.rotation.y = this.time * (t.stats.aura ? 0.7 : 1.3);
        v.orbit.position.y = v.model.orbitY + Math.sin(this.time * 1.7 + t.id) * 0.11 - recoil * 0.1;
        const s = 1 + recoil * 0.32;
        v.orbit.scale.setScalar(s);
      }
      // Beams are redrawn every frame.
      if (t.stats.beam && (t.beamTargets.length || t.beamEnd)) {
        const ramp = t.beamRamp / t.stats.beam.rampTime;
        const sx = t.x;
        const sy = v.y + v.model.muzzleY - 0.2;
        const sz = t.z;
        const width = 0.1 + ramp * 0.22 + t.level * 0.02;
        const beamCol = ramp > 0.7 ? C.beamHot : C.beam;
        if (t.beamEnd) {
          const ex = t.beamEnd.x, ez = t.beamEnd.z;
          const ey = Math.max(game.world.height(ex, ez), 0) + 1.1;
          const line = this.frameLine(sx, sy, sz, ex, ey, ez);
          this.ribbons.frame(line, width * 2.4, C.beam);
          this.ribbons.frame(line, width * 0.9, C.beamHot);
          if (Math.random() < dt * 60 * this.scale) {
            const k = Math.random();
            this.particles.emit({ x: sx + (ex - sx) * k, y: sy + (ey - sy) * k, z: sz + (ez - sz) * k, vy: 1.2, life: 0.35, size: 0.32, sizeEnd: 0, color: C.fire });
          }
        } else {
          for (const e of t.beamTargets) {
            if (e.dead) continue;
            const em = this.enemyMeshes.get(e.def.id)!;
            this.interp(e);
            const ex = this.ix, ez = this.iz;
            const ey = this.enemyY(e, em.rig, ex, ez) + em.rig.height * e.scale * 0.5;
            const line = this.frameLine(sx, sy, sz, ex, ey, ez);
            this.ribbons.frame(line, width * 2.2, C.beam);
            this.ribbons.frame(line, width * 0.8, beamCol);
            if (Math.random() < dt * 50 * this.scale) {
              this.particles.emit({ x: ex, y: ey, z: ez, vx: (Math.random() - 0.5) * 5, vy: 1.5 + Math.random() * 3, vz: (Math.random() - 0.5) * 5, life: 0.35, size: 0.3, sizeEnd: 0, gravity: 8, color: C.fireHot });
            }
          }
        }
        beams++;
        beamPan += this.soundAt(t.x, t.z).pan;
        beamHeat = Math.max(beamHeat, ramp);
      }
      if (t.stats.aura && Math.random() < dt * 3.5 * this.scale) {
        const a = Math.random() * 6.28;
        const r = Math.random() * t.range * 0.82;
        const px = t.x + Math.cos(a) * r, pz = t.z + Math.sin(a) * r;
        this.particles.emit({ x: px, y: game.world.height(px, pz) + 0.3, z: pz, vy: 1.1, life: 1.5, size: 0.24, sizeEnd: 0, color: v.auraColor });
      }
    }
    // No time passes while paused, so the fire falls silent with everything else.
    audio.setBeam(dt > 0 ? beams : 0, beams ? beamPan / beams : 0, beamHeat);
  }

  private updateProjectiles(dt: number) {
    const game = this.game;
    const counts = this.projCounts;
    for (const kind of PROJ_KINDS) counts[kind] = 0;
    const seen = this.projSeen;
    seen.clear();
    for (const p of game.projectiles) {
      const mesh = this.projMeshes[p.kind];
      const idx = counts[p.kind];
      if (idx >= mesh.instanceMatrix.count) continue;
      const tv = this.towerViews.get(p.tower.id);
      const sy = (tv ? tv.y + tv.model.muzzleY : 2) - 0.1;
      const k = Math.min(1, p.pt + (p.t - p.pt) * this.alpha);
      let endY: number;
      if (p.target) {
        const em = this.enemyMeshes.get(p.target.def.id)!;
        this.interp(p.target);
        endY = this.enemyY(p.target, em.rig, this.ix, this.iz) + em.rig.height * p.target.scale * 0.5;
      } else {
        endY = game.world.height(p.tx, p.tz);
      }
      this.interp(p);
      const x = this.ix, z = this.iz;
      const arc = p.kind === 'shell' ? Math.min(13, 4 + p.total * 0.55) : p.kind === 'arrow' ? 0.8 + p.total * 0.05 : p.kind === 'glob' ? 0.5 + p.total * 0.06 : 0.3;
      const y = sy + (endY - sy) * k + 4 * arc * k * (1 - k);
      seen.add(p.id);
      let track = this.projPrev.get(p.id);
      if (!track) {
        // A new projectile starts out pointing at its target.
        track = { x, y, z, dx: p.tx - x, dy: 0, dz: p.tz - z };
        this.projPrev.set(p.id, track);
      }
      // Keeps the last heading when nothing has moved this frame, such as while paused.
      const mx = x - track.x, my = y - track.y, mz = z - track.z;
      if (mx * mx + my * my + mz * mz > 1e-8) {
        track.dx = mx;
        track.dy = my;
        track.dz = mz;
      }
      track.x = x;
      track.y = y;
      track.z = z;
      tmpD.set(track.dx, track.dy, track.dz);
      if (tmpD.lengthSq() === 0) tmpD.copy(FORWARD);
      tmpQ.setFromUnitVectors(FORWARD, tmpD.normalize());
      tmpM.compose(tmpV.set(x, y, z), tmpQ, tmpS.setScalar(p.stats.damage > 100 ? 1.25 : 1));
      mesh.setMatrixAt(idx, tmpM);
      if (p.kind === 'orb' || p.kind === 'shard' || p.kind === 'glob') {
        const c = p.kind === 'orb' ? C.magic : p.kind === 'glob' ? C.venom : C.frost;
        mesh.setColorAt(idx, tmpC.copy(c).multiplyScalar(1.5));
      }
      counts[p.kind]++;

      const rate = dt * 60 * this.scale;
      if (p.kind === 'shell') {
        if (Math.random() < rate * 0.9) this.particles.emit({ x, y, z, life: 0.3, size: 0.55, sizeEnd: 0.1, color: C.fire });
        if (Math.random() < rate * 0.5) this.smoke.emit({ x, y, z, vy: 0.4, life: 0.7, size: 0.5, sizeEnd: 1.1, color: C.smoke, alpha: 0.5 });
      } else if (p.kind === 'orb') {
        if (Math.random() < rate) this.particles.emit({ x, y, z, life: 0.28, size: 0.42, sizeEnd: 0, color: C.magic });
      } else if (p.kind === 'shard') {
        if (Math.random() < rate) this.particles.emit({ x, y, z, life: 0.3, size: 0.32, sizeEnd: 0, color: C.frost });
      } else if (p.kind === 'glob') {
        if (Math.random() < rate) this.particles.emit({ x, y, z, vy: -1.5, life: 0.34, size: 0.3, sizeEnd: 0, color: C.venom });
      } else if (p.crit || p.stats.armorPierce) {
        if (Math.random() < rate * 0.7) this.particles.emit({ x, y, z, life: 0.22, size: 0.3, sizeEnd: 0, color: C.shock });
      }
    }
    for (const k of PROJ_KINDS) {
      const mesh = this.projMeshes[k];
      mesh.count = counts[k];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    if (this.projPrev.size > seen.size) {
      for (const id of this.projPrev.keys()) if (!seen.has(id)) this.projPrev.delete(id);
    }
    // Burning ground.
    for (const pool of game.pools) {
      const n = pool.radius * pool.radius * dt * 7.5 * this.scale;
      const count = Math.floor(n) + (Math.random() < n % 1 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * 6.28;
        const r = Math.sqrt(Math.random()) * pool.radius;
        const x = pool.x + Math.cos(a) * r;
        const z = pool.z + Math.sin(a) * r;
        const gy = game.world.height(x, z) + 0.15;
        this.particles.emit({ x, y: gy, z, vy: 1.6 + Math.random() * 2.2, life: 0.6, size: 0.9, sizeEnd: 0.1, color: Math.random() < 0.3 ? C.fireHot : C.fire, alpha: 0.7 });
        if (Math.random() < 0.18) this.smoke.emit({ x, y: gy + 1, z, vy: 1.8, life: 1, size: 0.7, sizeEnd: 1.8, color: C.smoke, alpha: 0.3 });
      }
    }
  }

  private flash(x: number, y: number, z: number, color: number, power: number, life = 0.22) {
    const lights = this.stage.flashLights;
    const i = this.flashIdx++ % lights.length;
    const light = lights[i];
    light.color.set(color);
    light.position.set(x, y + 2, z);
    light.intensity = power;
    const existing = this.flashes.find((f) => f.i === i);
    if (existing) { existing.t = 0; existing.life = life; }
    else this.flashes.push({ light, t: 0, life, i });
  }

  private burst(x: number, y: number, z: number, n: number, speed: number, color: THREE.Color, life = 0.55, size = 0.45, gravity = 10, up = 0.6) {
    const count = Math.ceil(n * this.scale);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * 6.28;
      const e = Math.random();
      const s = speed * (0.35 + Math.random() * 0.65);
      this.particles.emit({
        x, y, z,
        vx: Math.cos(a) * s * Math.sqrt(1 - e * e),
        vy: s * e * up + speed * 0.3,
        vz: Math.sin(a) * s * Math.sqrt(1 - e * e),
        life: life * (0.6 + Math.random() * 0.5),
        size: size * (0.6 + Math.random() * 0.7),
        sizeEnd: 0,
        color,
        gravity,
        drag: 1.5,
      });
    }
  }

  private puff(x: number, y: number, z: number, n: number, radius: number, color: THREE.Color, alpha = 0.45, life = 1, size = 1.4) {
    const count = Math.ceil(n * this.scale);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * 6.28;
      const r = Math.random() * radius;
      this.smoke.emit({
        x: x + Math.cos(a) * r, y: y + Math.random() * 0.6, z: z + Math.sin(a) * r,
        vx: Math.cos(a) * 1.3, vy: 0.7 + Math.random() * 1.2, vz: Math.sin(a) * 1.3,
        life: life * (0.6 + Math.random() * 0.6), size, sizeEnd: size * 2.4, color, alpha, drag: 1.2,
      });
    }
  }

  private shake(amount: number) {
    if (this.shakeEnabled) this.engine.rig.shake = Math.min(1, Math.max(this.engine.rig.shake, amount));
  }

  private readonly soundPoint = new THREE.Vector3();

  /** Places a world position in the stereo field, softer when zoomed out or off screen. */
  private soundAt(x: number, z: number): SoundPos {
    const cam = this.engine.camera;
    const p = this.soundPoint.set(x, this.game.world.height(x, z), z);
    const dist = cam.position.distanceTo(p);
    p.project(cam);
    const offScreen = Math.max(0, Math.abs(p.x) - 1, Math.abs(p.y) - 1);
    return {
      pan: Math.max(-1, Math.min(1, p.x)) * 0.72,
      gain: Math.max(0.55, Math.min(1, Math.sqrt(SOUND_NEAR / dist))) / (1 + offScreen * 1.1),
    };
  }

  private handle(ev: GameEvent) {
    const game = this.game;
    const h = (x: number, z: number) => game.world.height(x, z);
    switch (ev.e) {
      case 'fire': {
        const v = this.towerViews.get(ev.tower.id);
        if (!v) break;
        const y = v.y + v.model.muzzleY;
        if (ev.kind === 'arrow') {
          audio.play('arrow', 1, this.soundAt(ev.tower.x, ev.tower.z));
        } else if (ev.kind === 'orb') {
          audio.play('arcane', 1, this.soundAt(ev.tower.x, ev.tower.z));
          this.burst(ev.tower.x, y, ev.tower.z, 6, 3, C.magic, 0.3, 0.3, 0);
        } else if (ev.kind === 'shard') {
          audio.play('frost', 1, this.soundAt(ev.tower.x, ev.tower.z));
          this.burst(ev.tower.x, y, ev.tower.z, 6, 3, C.frost, 0.3, 0.3, 0);
        } else if (ev.kind === 'bolt') {
          audio.play('ballista', 1, this.soundAt(ev.tower.x, ev.tower.z));
          this.burst(ev.tower.x, y, ev.tower.z, 4, 4, C.white, 0.2, 0.2, 2);
        } else if (ev.kind === 'glob') {
          audio.play('blight', 1, this.soundAt(ev.tower.x, ev.tower.z));
        } else if (ev.kind === 'shell') {
          audio.play('mortar', 1, this.soundAt(ev.tower.x, ev.tower.z));
          this.burst(ev.tower.x, y, ev.tower.z, 9, 6, C.fire, 0.3, 0.5, 2, 1);
          this.puff(ev.tower.x, y, ev.tower.z, 4, 0.3, C.smoke, 0.5, 0.8, 0.8);
          this.shake(0.12);
        }
        break;
      }
      case 'impact': {
        const y = h(ev.x, ev.z) + 0.4;
        const s = ev.stats;
        if (ev.kind === 'shell') {
          const big = ev.radius > 3.8;
          audio.play(big ? 'bigExplosion' : 'explosion', big ? 0.8 : 1, this.soundAt(ev.x, ev.z));
          const fireColor = s.stun ? C.fireHot : C.fire;
          this.rings.add(ev.x, y, ev.z, ev.radius * 1.1, s.stun ? C.gold : C.fire, 0.42);
          this.burst(ev.x, y, ev.z, 20 + ev.radius * 7, 8 + ev.radius, fireColor, 0.6, 0.72, 12);
          this.burst(ev.x, y, ev.z, 10, 15, C.fireHot, 0.32, 0.3, 18);
          this.puff(ev.x, y, ev.z, 7 + ev.radius * 2, ev.radius * 0.5, C.smoke, 0.5, 1.2, 1.3);
          this.flash(ev.x, y, ev.z, 0xff9a40, 70 + ev.radius * 28, 0.2);
          this.shake(big ? 0.42 : 0.2);
        } else if (ev.kind === 'shard') {
          audio.play('shardHit', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, C.frost, 0.36);
          this.burst(ev.x, y + 0.5, ev.z, 14, 7, C.frost, 0.42, 0.34, 12);
        } else if (ev.kind === 'orb') {
          audio.play('orbHit', 1, this.soundAt(ev.x, ev.z));
          this.burst(ev.x, y + 0.6, ev.z, 7, 4.5, C.magic, 0.3, 0.32, 3);
        } else if (ev.kind === 'arrow') {
          audio.play('arrowHit', 1, this.soundAt(ev.x, ev.z));
          this.burst(ev.x, y + 0.8, ev.z, 3, 3.2, C.white, 0.22, 0.17, 6);
        } else if (ev.kind === 'bolt') {
          audio.play('boltHit', 1, this.soundAt(ev.x, ev.z));
          this.burst(ev.x, y + 0.8, ev.z, 8, 6, C.white, 0.28, 0.24, 8);
        } else if (ev.kind === 'glob') {
          audio.play('globHit', 1, this.soundAt(ev.x, ev.z));
          if (ev.radius > 0) this.rings.add(ev.x, y, ev.z, ev.radius, C.venom, 0.4);
          this.burst(ev.x, y + 0.6, ev.z, 8 + ev.radius * 4, 4, C.venom, 0.42, 0.3, 8);
          this.puff(ev.x, y, ev.z, 3 + ev.radius, 0.5 + ev.radius * 0.3, C.venom, 0.35, 0.8, 1);
        }
        break;
      }
      case 'lightning': {
        audio.play('lightning', 1, this.soundAt(ev.tower.x, ev.tower.z));
        const tv = this.towerViews.get(ev.tower.id);
        if (!tv) break;
        let from = new THREE.Vector3(ev.tower.x, tv.y + tv.model.muzzleY, ev.tower.z);
        for (const p of ev.points) {
          const y = h(p.x, p.z) + (p.flying ? 3.6 : 1 * p.scale);
          const to = new THREE.Vector3(p.x, y, p.z);
          const pts = jaggedLine(from, to, 6, 0.55);
          this.ribbons.add(pts, 0.3, C.shock, 0.17);
          this.ribbons.add(jaggedLine(from, to, 4, 0.9), 0.1, C.white, 0.11);
          this.burst(p.x, y, p.z, 4, 5, C.shock, 0.24, 0.27, 6);
          from = to;
        }
        this.flash(ev.tower.x, tv.y + tv.model.muzzleY, ev.tower.z, 0x7fc4ff, 26, 0.1);
        break;
      }
      case 'death': {
        const en = ev.enemy;
        const em = this.enemyMeshes.get(en.def.id)!;
        const y = this.enemyY(en, em.rig);
        const midY = y + em.rig.height * en.scale * 0.5;
        const big = !!en.def.boss;
        audio.play(DEATH_SOUNDS[en.def.id] ?? 'deathCritter', 1, this.soundAt(en.x, en.z));
        const accent = new THREE.Color(em.rig.accent).multiplyScalar(2.3);
        this.burst(en.x, midY, en.z, big ? 50 : 12 + en.scale * 8, big ? 9 : 6, accent, big ? 0.8 : 0.5, big ? 0.5 : 0.38, 7);
        this.puff(en.x, y, en.z, big ? 14 : 6, en.scale * 0.8, C.gloamDark, 0.75, big ? 1.2 : 0.8, big ? 1.5 : 0.9);
        if (big) {
          this.rings.add(en.x, h(en.x, en.z) + 0.4, en.z, 5, accent, 0.8);
          this.flash(en.x, y + 2, en.z, em.rig.accent, 160, 0.4);
          this.shake(0.3);
        }
        this.particles.emit({ x: en.x, y: midY, z: en.z, vy: 3.2, life: 0.95, size: 0.5 + en.scale * 0.25, sizeEnd: 0, color: accent, alpha: 0.9 });
        const flying = em.rig.flyHeight > 0;
        const toss = big ? 0 : 1.6 + Math.random() * 1.4;
        this.ghosts.push({
          def: en.def.id, elite: en.elite, x: en.x, y, z: en.z, rot: this.angles.get(en.id) ?? 0, scale: en.scale * ENEMY_SCALE, t: 0, phase: en.animPhase,
          life: big ? 1.5 : flying ? 0.68 : 0.5,
          vx: -en.dirX * toss, vz: -en.dirZ * toss,
          spin: big ? 0 : (Math.random() < 0.5 ? -1 : 1) * (flying ? 7 : 5),
          hop: big || flying ? 0 : 0.85,
          fall: flying ? Math.max(0, y - Math.max(h(en.x, en.z), 0)) : 0,
          boss: big, boom: 0,
        });
        this.angles.delete(en.id);
        this.bossSteps.delete(en.id);
        if (big) this.onBossDown?.();
        break;
      }
      case 'leak': {
        audio.play('leak');
        const l = this.stage.lanternPos;
        this.rings.add(l.x, l.y + 0.4, l.z, 8, col(0xff5a4a, 2.6), 0.7);
        this.burst(l.x, l.y + 4.5, l.z, 50, 11, col(0xff7a4a, 2.8), 0.7, 0.45, 10);
        this.flash(l.x, l.y + 4.5, l.z, 0xff5a3a, 170, 0.34);
        this.leakShake = 0.5;
        this.shake(0.46);
        break;
      }
      case 'dmg': {
        if (ev.crit) {
          audio.play('crit', 1, this.soundAt(ev.x, ev.z));
          this.burst(ev.x, h(ev.x, ev.z) + (ev.flying ? 3.6 : 1.1), ev.z, 8, 7, C.gold, 0.28, 0.24, 8);
        }
        if (!this.showNumbers) break;
        if (ev.crit || ev.amount >= 60) {
          this.onFloat?.(ev.x, h(ev.x, ev.z) + (ev.flying ? 5.5 : 3), ev.z, Math.round(ev.amount).toString(), ev.crit ? 'f-crit' : `f-${ev.dtype}`);
        }
        break;
      }
      case 'resistNote': {
        if (!this.showNumbers) break;
        this.onFloat?.(ev.x, h(ev.x, ev.z) + (ev.flying ? 6.4 : 3.8), ev.z, ev.weak ? 'Weak!' : 'Resisted', ev.weak ? 'f-weak' : 'f-resist');
        break;
      }
      case 'fx': {
        const y = h(ev.x, ev.z) + 0.4;
        const c = new THREE.Color(ev.color).multiplyScalar(2.6);
        if (ev.kind === 'pulse') {
          audio.play('bell', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 0.42);
          this.rings.add(ev.x, y + 0.2, ev.z, ev.radius * 0.6, c, 0.3);
          this.puff(ev.x, y, ev.z, 5 + ev.radius, ev.radius * 0.45, C.dust, 0.32, 0.7, 0.9);
          this.shake(0.1);
        } else if (ev.kind === 'hex' || ev.kind === 'mark') {
          audio.play('hex', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 0.9, 0.1);
          this.rings.add(ev.x, y + 0.2, ev.z, ev.radius * 0.55, c, 0.6, 0.12);
          this.burst(ev.x, y + 1, ev.z, 36, 6, c, 0.8, 0.36, 2);
        } else if (ev.kind === 'rift') {
          audio.play('rift', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 0.5);
          this.burst(ev.x, y + 1, ev.z, 50, 11, c, 0.5, 0.4, 3);
          this.flash(ev.x, y + 1, ev.z, ev.color, 200, 0.28);
          this.shake(0.3);
        } else if (ev.kind === 'rally') {
          audio.play('rally');
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 0.5);
          this.burst(ev.x, y + 2, ev.z, 10, 4, c, 0.5, 0.26, 0);
        } else if (ev.kind === 'golden') {
          audio.play('golden');
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 1, 0.1);
          this.burst(ev.x, y + 4, ev.z, 60, 9, c, 1, 0.4, 2);
        } else if (ev.kind === 'snipe') {
          audio.play('snipe', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, c, 0.4);
          this.flash(ev.x, y + 1, ev.z, ev.color, 160, 0.2);
          this.shake(0.25);
        }
        break;
      }
      case 'gold': {
        audio.play('coin', 1, this.soundAt(ev.x, ev.z));
        this.onFloat?.(ev.x, h(ev.x, ev.z) + 2, ev.z, `+${ev.amount}`, 'f-gold');
        this.burst(ev.x, h(ev.x, ev.z) + 1.1, ev.z, 3, 4, C.coin, 0.5, 0.22, 16, 1.3);
        this.onCoin?.(ev.x, h(ev.x, ev.z) + 1.4, ev.z, ev.amount);
        break;
      }
      case 'wave': {
        audio.play('horn');
        if (ev.income > 0) this.onIncome?.(ev.income);
        for (const s of this.stage.riftSpots) {
          this.rings.add(s.x, s.y - 2, s.z, 9, col(0xb55bff, 2.4), 0.9);
          this.burst(s.x, s.y, s.z, 30, 9, C.gloam, 0.7, 0.45, 2);
          this.flash(s.x, s.y, s.z, 0xb55bff, 100, 0.5);
        }
        break;
      }
      case 'boss': {
        const en = ev.enemy;
        const y = h(en.x, en.z);
        const rig = this.enemyMeshes.get(en.def.id)!.rig;
        const accent = col(rig.accent, 2.4);
        audio.play('bossRoar', 1, this.soundAt(en.x, en.z));
        audio.play('bigExplosion', 0.4, this.soundAt(en.x, en.z));
        this.rings.add(en.x, y + 0.4, en.z, 7, accent, 0.9);
        this.burst(en.x, y + 1.6, en.z, 40, 8, accent, 0.8, 0.45, 3);
        this.flash(en.x, y + 2, en.z, rig.accent, 160, 0.5);
        this.shake(0.3);
        this.onBoss?.();
        break;
      }
      case 'bossSkill': {
        const y = h(ev.x, ev.z);
        const label = (text: string) => this.onFloat?.(ev.x, y + (ev.enemy.flying ? 6.4 : 4.4), ev.z, text, 'f-boss');
        if (ev.kind === 'slam') {
          audio.play('bossStep', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y + 0.3, ev.z, ev.radius, C.gloam, 0.5);
          this.puff(ev.x, y + 0.2, ev.z, 12, 2, C.dust, 0.5, 0.8, 1.2);
          this.shake(0.18);
          label('Slam');
        } else if (ev.kind === 'brood') {
          audio.play('split', 1, this.soundAt(ev.x, ev.z));
          this.burst(ev.x, y + 1, ev.z, 20, 5, col(0xc6ff3a, 2), 0.5, 0.3, 8);
          label('Hatching');
        } else if (ev.kind === 'ward') {
          audio.play('freeze', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y + 0.3, ev.z, ev.radius, C.frost, 0.5);
          this.burst(ev.x, y + 1.6, ev.z, 22, 4, C.frost, 0.5, 0.28, 2);
          label('Ice ward');
        } else if (ev.kind === 'charge') {
          audio.play('rift', 0.7, this.soundAt(ev.x, ev.z));
          this.puff(ev.x, y + 0.2, ev.z, 12, 1.2, C.dust, 0.55, 0.7, 1.2);
          this.rings.add(ev.x, y + 0.3, ev.z, ev.radius, col(0xffb03a, 2.2), 0.4);
          label('Charge');
        } else if (ev.kind === 'rebirth') {
          audio.play('bigExplosion', 0.6, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y + 0.4, ev.z, ev.radius + 2, C.fire, 0.8);
          this.burst(ev.x, y + 1.2, ev.z, 60, 8, C.fire, 0.8, 0.45, 4);
          this.flash(ev.x, y + 2, ev.z, 0xff5a24, 180, 0.5);
          this.shake(0.25);
          label('Rises again');
        } else if (ev.kind === 'gale') {
          audio.play('rift', 0.6, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, Math.max(y, 0) + 0.4, ev.z, ev.radius, C.shock, 0.6);
          label('Gale');
        }
        break;
      }
      case 'starfall': {
        const y = h(ev.x, ev.z) + 0.4;
        if (ev.phase === 'cast') {
          audio.play('starfallCast', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius, C.gold, 0.85, 0.08);
          // A burning star streaks down from the sky.
          const start = new THREE.Vector3(ev.x + 22, y + 58, ev.z - 18);
          const end = new THREE.Vector3(ev.x, y, ev.z);
          this.pendingStars.push({ start, end, t: 0 });
        } else {
          audio.play('starfallHit', 1, this.soundAt(ev.x, ev.z));
          this.rings.add(ev.x, y, ev.z, ev.radius * 1.25, C.fireHot, 0.7, 0.3);
          this.rings.add(ev.x, y + 0.1, ev.z, ev.radius * 0.8, C.white, 0.42, 0.4);
          this.burst(ev.x, y, ev.z, 130, 22, C.fireHot, 0.9, 0.85, 16);
          this.burst(ev.x, y, ev.z, 70, 11, C.fire, 1.2, 1.2, 8);
          this.puff(ev.x, y, ev.z, 30, ev.radius * 0.7, C.smoke, 0.55, 1.8, 2);
          this.flash(ev.x, y, ev.z, 0xffb25a, 620, 0.55);
          this.shake(1);
        }
        break;
      }
      case 'winter': {
        const y = h(ev.x, ev.z) + 0.4;
        audio.play('winter', 1, this.soundAt(ev.x, ev.z));
        this.rings.add(ev.x, y, ev.z, ev.radius * 1.1, C.frost, 0.8, 0.35);
        this.flash(ev.x, y, ev.z, 0x9fecff, 240, 0.55);
        const n = Math.ceil(150 * this.scale);
        for (let i = 0; i < n; i++) {
          const a = Math.random() * 6.28;
          const r = Math.sqrt(Math.random()) * ev.radius;
          this.particles.emit({ x: ev.x + Math.cos(a) * r, y: y + Math.random() * 0.4, z: ev.z + Math.sin(a) * r, vx: Math.cos(a) * 1.4, vy: 2 + Math.random() * 5, vz: Math.sin(a) * 1.4, life: 1.2, size: 0.5, sizeEnd: 0, color: C.frost, gravity: 4 });
        }
        this.puff(ev.x, y, ev.z, 24, ev.radius * 0.8, col(0xdff5ff, 1.2), 0.32, 1.4, 2);
        this.shake(0.3);
        break;
      }
      case 'guards': {
        const y = h(ev.x, ev.z);
        audio.play('guards', 1, this.soundAt(ev.x, ev.z));
        this.rings.add(ev.x, y + 0.4, ev.z, 4.2, C.guard, 0.55);
        this.burst(ev.x, y + 1, ev.z, 36, 7, C.guard, 0.7, 0.42, 4);
        this.flash(ev.x, y + 1, ev.z, 0x7fb8ff, 80, 0.3);
        break;
      }
      case 'sunbreak': {
        const y = h(ev.x, ev.z) + 0.4;
        audio.play('sunbreak', 1, this.soundAt(ev.x, ev.z));
        const c = new THREE.Color(ev.color).multiplyScalar(3);
        this.rings.add(ev.x, y, ev.z, ev.radius * 1.15, c, 0.55, 0.4);
        this.burst(ev.x, y + 1, ev.z, 75, 15, c, 0.6, 0.5, 8);
        this.flash(ev.x, y + 1, ev.z, ev.color, 300, 0.32);
        this.shake(0.55);
        break;
      }
      case 'ward': {
        const y = h(ev.x, ev.z) + 0.4;
        audio.play('ward', 1, this.soundAt(ev.x, ev.z));
        this.rings.add(ev.x, y, ev.z, ev.radius, C.gold, 1, 0.1);
        this.rings.add(ev.x, y, ev.z, ev.radius * 0.6, C.heal, 0.8, 0.12);
        this.burst(ev.x, y + 1, ev.z, 30, 5, C.gold, 1, 0.34, 0);
        break;
      }
      case 'heroLevel': {
        audio.play('levelUp', 1, this.soundAt(ev.x, ev.z));
        const y = h(ev.x, ev.z);
        this.burst(ev.x, y + 1.5, ev.z, 60, 8, C.gold, 1, 0.42, 3, 1.4);
        this.rings.add(ev.x, y + 0.4, ev.z, 4, C.gold, 0.7);
        this.onFloat?.(ev.x, y + 3.4, ev.z, `Level ${ev.level}`, 'f-level');
        break;
      }
      case 'unitDown': {
        const u = ev.unit;
        const y = h(u.x, u.z);
        if (u.kind === 'hero') audio.play('heroDown', 1, this.soundAt(u.x, u.z));
        this.burst(u.x, y + 1, u.z, 28, 5, u.kind === 'hero' ? C.heroSun : C.guard, 0.8, 0.34, 0);
        this.puff(u.x, y, u.z, 6, 0.6, C.dust, 0.35, 1, 1);
        break;
      }
      case 'respawn': {
        const y = h(ev.x, ev.z);
        audio.play('ward', 0.6, this.soundAt(ev.x, ev.z));
        this.hero.born = this.time;
        this.rings.add(ev.x, y + 0.4, ev.z, 3.2, C.heroSun, 0.6);
        this.burst(ev.x, y + 1, ev.z, 26, 5, C.gold, 0.8, 0.34, 0);
        break;
      }
      case 'unitAttack': {
        const u = ev.unit;
        const y = h(u.x, u.z);
        if (ev.flying || ev.ranged) {
          const a = new THREE.Vector3(u.x, y + 1.6, u.z);
          const b = new THREE.Vector3(ev.tx, h(ev.tx, ev.tz) + (ev.flying ? 3.6 : 1.2), ev.tz);
          this.ribbons.add([a, b], 0.18, this.heroColor, 0.14);
          this.burst(ev.tx, b.y, ev.tz, 4, 3, this.heroColor, 0.26, 0.24, 2);
          audio.play(ev.ranged ? 'arrow' : 'arcane', 0.55, this.soundAt(u.x, u.z));
        } else {
          audio.play(u.kind === 'hero' ? 'heroHit' : 'guardHit', 1, this.soundAt(u.x, u.z));
          this.burst((u.x + ev.tx) / 2, y + 1.2, (u.z + ev.tz) / 2, 5, 5.5, u.kind === 'hero' ? C.heroSun : C.white, 0.2, 0.2, 10);
        }
        break;
      }
      case 'build': {
        const t = ev.tower;
        audio.play('build', 1, this.soundAt(t.x, t.z));
        this.addTowerView(t);
        const y = h(t.x, t.z);
        this.puff(t.x, y, t.z, 16, 1.4, C.dust, 0.55, 0.9, 1.3);
        this.rings.add(t.x, y + 0.3, t.z, 3, C.gold, 0.45);
        this.burst(t.x, y + 1, t.z, 14, 5, C.gold, 0.5, 0.28, 8);
        break;
      }
      case 'upgrade': {
        const t = ev.tower;
        audio.play('upgrade', 1, this.soundAt(t.x, t.z));
        const y = h(t.x, t.z);
        const m = towerModel(t.type, t.level, t.branch);
        const accent = new THREE.Color(m.accent).multiplyScalar(2.5);
        // A pillar of light marks every upgrade. The specialized forms get a bigger show.
        const major = t.level >= 2;
        const pillar = [new THREE.Vector3(t.x, y, t.z), new THREE.Vector3(t.x, y + (major ? 22 : 13), t.z)];
        this.ribbons.add(pillar, major ? 1.5 : 0.9, accent, major ? 0.55 : 0.36);
        this.ribbons.add(pillar, major ? 0.55 : 0.32, C.white, major ? 0.42 : 0.26);
        this.rings.add(t.x, y + 0.3, t.z, major ? 6 : 3.8, accent, 0.55);
        if (major) this.rings.add(t.x, y + 0.4, t.z, 3.4, C.white, 0.34);
        this.burst(t.x, y + 2, t.z, major ? 90 : 42, major ? 11 : 7, accent, 0.9, 0.4, 4, 1.2);
        this.puff(t.x, y, t.z, major ? 12 : 6, 1.2, C.dust, 0.45, 0.8, 1.1);
        this.flash(t.x, y + 2, t.z, m.accent, major ? 190 : 90, 0.38);
        if (major) {
          audio.play('levelUp', 0.8, this.soundAt(t.x, t.z));
          this.shake(0.3);
          this.onFloat?.(t.x, y + 7, t.z, t.stats.name, 'f-level');
        }
        break;
      }
      case 'sell': {
        const t = ev.tower;
        audio.play('sell', 1, this.soundAt(t.x, t.z));
        this.removeTowerView(t.id);
        const y = h(t.x, t.z);
        this.puff(t.x, y, t.z, 16, 1.4, C.dust, 0.55, 0.9, 1.3);
        this.burst(t.x, y + 1, t.z, 18, 6, C.coin, 0.6, 0.28, 12, 1.2);
        this.onFloat?.(t.x, y + 2.5, t.z, `+${ev.refund}`, 'f-gold');
        break;
      }
      case 'blink': {
        audio.play('blink', 1, this.soundAt(ev.x, ev.z));
        this.puff(ev.fromX, h(ev.fromX, ev.fromZ) + 0.3, ev.fromZ, 7, 0.5, C.gloamDark, 0.75, 0.6, 1);
        this.burst(ev.x, h(ev.x, ev.z) + 1, ev.z, 10, 4.5, col(0x65f0ff, 2.3), 0.35, 0.26, 2);
        break;
      }
      case 'heal': {
        audio.play('heal', 1, this.soundAt(ev.x, ev.z));
        this.rings.add(ev.x, h(ev.x, ev.z) + 0.35, ev.z, ev.radius, C.heal, 0.6, 0.1);
        this.burst(ev.x, h(ev.x, ev.z) + 1.4, ev.z, 8, 2.5, C.heal, 0.7, 0.28, 0);
        break;
      }
      case 'root': {
        audio.play('root', 1, this.soundAt(ev.x, ev.z));
        this.burst(ev.x, h(ev.x, ev.z) + 0.2, ev.z, 11, 4.5, C.root, 0.55, 0.26, 3, 1.4);
        this.rings.add(ev.x, h(ev.x, ev.z) + 0.3, ev.z, 1.5, C.root, 0.5);
        break;
      }
      case 'freeze': {
        audio.play('freeze', 1, this.soundAt(ev.x, ev.z));
        this.burst(ev.x, h(ev.x, ev.z) + 1, ev.z, 8, 3, C.frost, 0.4, 0.28, 6);
        break;
      }
      case 'split': {
        audio.play('split', 1, this.soundAt(ev.x, ev.z));
        this.burst(ev.x, h(ev.x, ev.z) + 1, ev.z, 26, 6.5, col(0xffd25a, 2), 0.6, 0.36, 8);
        break;
      }
      case 'enemyAttack':
        audio.play('enemyHit', 1, this.soundAt(ev.enemy.x, ev.enemy.z));
        break;
      case 'won':
      case 'lost':
        break;
    }
  }

  /** The lantern flares up in triumph at the end of a won battle. */
  celebrate() {
    const l = this.stage.lanternPos;
    this.rings.add(l.x, l.y + 0.4, l.z, 22, C.gold, 1.6);
    this.rings.add(l.x, l.y + 0.5, l.z, 11, C.white, 0.9);
    this.burst(l.x, l.y + 5, l.z, 170, 15, C.gold, 1.5, 0.6, 4, 1.3);
    this.flash(l.x, l.y + 5, l.z, 0xffd27a, 520, 1.1);
  }

  /** The lantern gutters out in smoke when a battle is lost. */
  extinguish() {
    const l = this.stage.lanternPos;
    this.rings.add(l.x, l.y + 0.4, l.z, 12, C.gloam, 1.3);
    this.puff(l.x, l.y + 4.5, l.z, 44, 1.4, C.gloamDark, 0.75, 2.4, 2.6);
    this.burst(l.x, l.y + 4.6, l.z, 40, 6, C.fire, 0.8, 0.3, 6);
    this.flash(l.x, l.y + 4.5, l.z, 0xff5a3a, 240, 0.8);
    this.shake(0.5);
  }

  private pendingStars: { start: THREE.Vector3; end: THREE.Vector3; t: number }[] = [];

  private updateChevrons() {
    const game = this.game;
    const showRoad = game.state === 'playing' && game.spawnQueue.length === 0 && game.wave < game.totalWaves && (game.enemies.length === 0 || !game.started);
    let n = 0;
    let na = 0;
    const tmp = tmpRoad;
    if (showRoad) {
      // Parsing a wave's script is too costly to repeat every frame.
      if (this.previewWave !== game.wave) {
        this.previewWave = game.wave;
        this.previewList = game.preview();
      }
      const preview = this.previewList;
      const hasGround = preview.some(isGroundEntry);
      const hasAir = preview.some(isAirEntry);
      const gap = 6;
      if (hasGround) {
        for (const road of game.world.roads) {
          const off = (this.time * 3.4) % gap;
          for (let d = off; d < road.length && n < this.chevrons.instanceMatrix.count; d += gap) {
            road.sample(d, tmp);
            const k = Math.min(d / 4, (road.length - d) / 4, 1);
            placeChevron(this.chevrons, n++, game.world.height(tmp.x, tmp.z) + 0.25, Math.max(0.01, k) * 1.2);
          }
        }
      }
      if (hasAir) {
        const airGap = 9;
        for (const road of game.world.airRoads) {
          const off = (this.time * 4.2) % airGap;
          for (let d = off; d < road.length && na < this.airChevrons.instanceMatrix.count; d += airGap) {
            road.sample(d, tmp);
            const k = Math.min(d / 4, (road.length - d) / 4, 1);
            placeChevron(this.airChevrons, na++, Math.max(game.world.height(tmp.x, tmp.z), 0) + 3.4, Math.max(0.01, k) * 1.3);
          }
        }
      }
    }
    this.chevrons.count = n;
    this.airChevrons.count = na;
    this.chevrons.instanceMatrix.needsUpdate = true;
    this.airChevrons.instanceMatrix.needsUpdate = true;
  }

  private updateFlashes(dt: number) {
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.t += dt;
      const k = f.t / f.life;
      if (k >= 1) {
        f.light.intensity = 0;
        this.flashes.splice(i, 1);
      } else {
        f.light.intensity *= Math.pow(0.0035, dt / f.life);
      }
    }
  }

  private updateStars(dt: number) {
    for (let i = this.pendingStars.length - 1; i >= 0; i--) {
      const s = this.pendingStars[i];
      s.t += dt / 0.85;
      if (s.t >= 1) {
        this.pendingStars.splice(i, 1);
        continue;
      }
      const k = s.t * s.t;
      const tk = Math.max(0, k - 0.18);
      const line = this.frameLine(
        s.start.x + (s.end.x - s.start.x) * tk, s.start.y + (s.end.y - s.start.y) * tk, s.start.z + (s.end.z - s.start.z) * tk,
        s.start.x + (s.end.x - s.start.x) * k, s.start.y + (s.end.y - s.start.y) * k, s.start.z + (s.end.z - s.start.z) * k,
      );
      const p = line[1];
      this.ribbons.frame(line, 1.1, C.fire);
      this.ribbons.frame(line, 0.42, C.white);
      const n = Math.ceil(10 * this.scale);
      for (let j = 0; j < n; j++) {
        this.particles.emit({ x: p.x + (Math.random() - 0.5) * 1.3, y: p.y + (Math.random() - 0.5), z: p.z + (Math.random() - 0.5) * 1.3, life: 0.5, size: 1.2, sizeEnd: 0, color: Math.random() < 0.4 ? C.fireHot : C.fire });
      }
    }
  }

  /** Previews a spell's area on the ground. */
  setTargetRing(x: number, z: number, r: number, color: number, alpha: number) {
    const u = this.stage.uniforms;
    u.uRing2.value.set(x, z, r, alpha);
    u.uRing2Color.value.set(color);
  }

  setRangeRing(x: number, z: number, r: number, color: number, alpha: number) {
    const u = this.stage.uniforms;
    u.uRing.value.set(x, z, r, alpha);
    u.uRingColor.value.set(color);
  }

  setBuildOverlay(v: number) {
    this.stage.uniforms.uBuildOn.value = v;
  }

  /** `alpha` is how far the frame falls between the last two simulation steps. */
  update(dt: number, alpha: number) {
    this.time += dt;
    const game = this.game;
    const now = this.time;
    this.alpha = alpha;
    this.animTime = game.prevTime + (game.time - game.prevTime) * alpha;
    this.beamPtsN = 0;
    this.pointScale = (this.engine.renderer.domElement.height / (2 * Math.tan((this.engine.camera.fov * Math.PI) / 360)));
    this.particles.update(now, this.pointScale);
    this.smoke.update(now, this.pointScale);
    this.rings.update(now);
    for (let i = 0; i < game.events.length; i++) this.handle(game.events[i]);
    game.events.length = 0;
    this.updateEnemies(dt);
    this.updateTowers(dt);
    this.updateUnits(dt);
    this.updateProjectiles(dt);
    this.updateChevrons();
    this.updateFlashes(dt);
    this.updateStars(dt);
    this.ribbons.update(dt, this.engine.camera);
    this.stage.setLanternLife(game.lives / game.maxLives, now);

    // Rift smoke.
    for (const s of this.stage.riftSpots) {
      if (Math.random() < dt * 11 * this.scale) {
        this.smoke.emit({ x: s.x + (Math.random() - 0.5) * 3, y: s.y - 2.2, z: s.z + (Math.random() - 0.5) * 3, vy: 1.6, life: 1.6, size: 1, sizeEnd: 2.6, color: C.gloamDark, alpha: 0.42 });
      }
      if (Math.random() < dt * 7 * this.scale) {
        this.particles.emit({ x: s.x + (Math.random() - 0.5) * 4, y: s.y - 2, z: s.z + (Math.random() - 0.5) * 4, vy: 2.4, life: 1, size: 0.3, sizeEnd: 0, color: C.gloam });
      }
    }
    // Lantern sparks.
    if (Math.random() < dt * 7 * this.scale) {
      const l = this.stage.lanternPos;
      this.particles.emit({ x: l.x + (Math.random() - 0.5) * 1.5, y: l.y + 4.6, z: l.z + (Math.random() - 0.5) * 1.5, vx: (Math.random() - 0.5), vy: 2, vz: (Math.random() - 0.5), life: 1.2, size: 0.22, sizeEnd: 0, color: C.gold });
    }
    if (this.leakShake > 0) {
      this.leakShake = Math.max(0, this.leakShake - dt * 1.6);
      this.stage.lantern.rotation.z = Math.sin(this.time * 44) * this.leakShake * 0.03;
    }
  }

  dispose() {
    this.stage.scene.remove(this.root);
    this.root.traverse((o) => (o as THREE.Mesh).geometry?.dispose());
    this.particles.dispose();
    this.smoke.dispose();
    this.rings.dispose();
    this.ribbons.dispose();
    this.bars.dispose();
    for (const em of this.enemyMeshes.values()) for (const p of em.parts) p.mesh.dispose();
    for (const m of Object.values(this.projMeshes)) m.dispose();
    this.chevrons.dispose();
    this.airChevrons.dispose();
    this.ghostValidMat.dispose();
    this.ghostBadMat.dispose();
  }
}

const isGroundEntry = (p: WavePreview) => !ENEMIES[p.type].flying;
const isAirEntry = (p: WavePreview) => !!ENEMIES[p.type].flying;

function placeChevron(mesh: THREE.InstancedMesh, i: number, y: number, s: number) {
  tmpQ.setFromAxisAngle(UP, Math.atan2(tmpRoad.dx, tmpRoad.dz));
  tmpM.compose(tmpV.set(tmpRoad.x, y, tmpRoad.z), tmpQ, tmpS.setScalar(s));
  mesh.setMatrixAt(i, tmpM);
}

function easeOutBack(t: number) {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function jaggedLine(a: THREE.Vector3, b: THREE.Vector3, n: number, amp: number) {
  const pts = [a.clone()];
  for (let i = 1; i < n; i++) {
    const k = i / n;
    const p = a.clone().lerp(b, k);
    const f = Math.sin(k * Math.PI);
    p.x += (Math.random() - 0.5) * amp * 2 * f;
    p.y += (Math.random() - 0.5) * amp * 2 * f;
    p.z += (Math.random() - 0.5) * amp * 2 * f;
    pts.push(p);
  }
  pts.push(b.clone());
  return pts;
}
