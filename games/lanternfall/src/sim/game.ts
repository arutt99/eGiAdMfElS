// The authoritative game simulation. Pure logic: runs identically in the browser and in the balance bot.
import { clamp, dist2, makeRng, type Rng } from '../core/util';
import { ENEMIES, ENEMY_BY_CODE, type BossAbility, type EnemyDef, type EnemyId } from '../data/enemies';
import type { MapDef } from '../data/maps';
import { DIFFICULTY, HERO_COMMON, HEROES, SPELLS, SPELL_ORDER, type Difficulty, type HeroAbility, type HeroDef, type HeroId, type MetaId, type MetaRanks, type SpellId } from '../data/meta';
import { TOWERS, towerStats, type AttackType, type TowerId, type TowerStats } from '../data/towers';
import { PATH_WIDTH, RoadPath, World } from './world';

export type TargetMode = 'first' | 'last' | 'strong' | 'close';
export const TARGET_MODES: { id: TargetMode; label: string }[] = [
  { id: 'first', label: 'First' },
  { id: 'last', label: 'Last' },
  { id: 'strong', label: 'Strongest' },
  { id: 'close', label: 'Closest' },
];

export interface Enemy {
  id: number;
  def: EnemyDef;
  elite: boolean;
  hp: number;
  maxHp: number;
  bounty: number;
  lives: number;
  speed: number;
  road: RoadPath;
  flying: boolean;
  dist: number;
  offset: number;
  x: number;
  z: number;
  /** Position before the latest step, for drawing between steps. */
  px: number;
  pz: number;
  dirX: number;
  dirZ: number;
  slow: number;
  slowT: number;
  stunT: number;
  frozenT: number;
  rootT: number;
  poisonDps: number;
  poisonT: number;
  poisonTower: Tower | null;
  shred: number;
  /** Extra damage taken from every type, from hexes, marks and withering venom. */
  vuln: number;
  vulnT: number;
  /** When "Resisted" or "Weak" last floated above this enemy. */
  noteAt: number;
  specialT: number;
  /** Ice ward: absorbs this much damage before health is touched. */
  shield: number;
  /** A burst of extra speed from a charge or a gale. */
  hasteT: number;
  hasteMult: number;
  /** The Ashen Regent only rises once. */
  reborn: boolean;
  engaged: Unit | null;
  attackT: number;
  dead: boolean;
  hitAt: number;
  /** When a distinct blow last landed, for the recoil animation. */
  kickAt: number;
  attackAt: number;
  scale: number;
  animPhase: number;
}

export interface Tower {
  id: number;
  type: TowerId;
  level: number;
  branch: number;
  x: number;
  z: number;
  invested: number;
  stats: TowerStats;
  mode: TargetMode;
  cooldown: number;
  aim: number;
  firedAt: number;
  damageMult: number;
  rangeMult: number;
  rateMult: number;
  range: number;
  beamTargets: Enemy[];
  beamEnd: { x: number; z: number } | null;
  beamRamp: number;
  beamLock: number;
  rootT: number;
  kills: number;
  dealt: number;
  /** Where a garrison stands, on the nearest road. */
  rally: { x: number; z: number } | null;
  squad: Unit[];
  garrisonT: number;
}

export interface Unit {
  id: number;
  kind: 'hero' | 'guard';
  x: number;
  z: number;
  px: number;
  pz: number;
  tx: number;
  tz: number;
  dirX: number;
  dirZ: number;
  hp: number;
  maxHp: number;
  damage: number;
  dtype: AttackType;
  rate: number;
  range: number;
  speed: number;
  cooldown: number;
  blockCap: number;
  blocked: number;
  moving: boolean;
  ordered: boolean;
  dead: boolean;
  expires: number;
  attackAt: number;
  hitAt: number;
  /** The barracks this soldier belongs to. */
  owner: Tower | null;
}

export interface Projectile {
  id: number;
  kind: 'arrow' | 'orb' | 'shell' | 'shard' | 'bolt' | 'glob';
  sx: number;
  sz: number;
  x: number;
  z: number;
  px: number;
  pz: number;
  tx: number;
  tz: number;
  target: Enemy | null;
  speed: number;
  t: number;
  pt: number;
  dur: number;
  damage: number;
  crit: boolean;
  tower: Tower;
  stats: TowerStats;
  total: number;
  dead: boolean;
}

export interface Pool { x: number; z: number; radius: number; dps: number; t: number; dur: number; type: AttackType }

export type FxKind = 'pulse' | 'hex' | 'rally' | 'rift' | 'golden' | 'mark' | 'snipe';

export type GameEvent =
  | { e: 'fire'; tower: Tower; kind: string; tx: number; tz: number }
  | { e: 'impact'; kind: string; x: number; z: number; radius: number; stats: TowerStats }
  | { e: 'lightning'; tower: Tower; points: { x: number; z: number; flying: boolean; scale: number }[] }
  | { e: 'death'; enemy: Enemy }
  | { e: 'leak'; enemy: Enemy }
  | { e: 'dmg'; x: number; z: number; amount: number; crit: boolean; dtype: AttackType; flying: boolean }
  | { e: 'resistNote'; x: number; z: number; flying: boolean; weak: boolean }
  | { e: 'fx'; kind: FxKind; x: number; z: number; radius: number; color: number; tower?: Tower }
  | { e: 'gold'; x: number; z: number; amount: number }
  | { e: 'wave'; wave: number; bonus: number; early: number; income: number }
  | { e: 'boss'; enemy: Enemy }
  | { e: 'bossSkill'; kind: BossAbility; enemy: Enemy; x: number; z: number; radius: number }
  | { e: 'starfall'; x: number; z: number; radius: number; phase: 'cast' | 'hit' }
  | { e: 'winter'; x: number; z: number; radius: number }
  | { e: 'guards'; x: number; z: number }
  | { e: 'sunbreak'; x: number; z: number; radius: number; color: number }
  | { e: 'ward'; x: number; z: number; radius: number }
  | { e: 'heroLevel'; level: number; x: number; z: number }
  | { e: 'unitDown'; unit: Unit }
  | { e: 'respawn'; x: number; z: number }
  | { e: 'unitAttack'; unit: Unit; flying: boolean; ranged: boolean; tx: number; tz: number }
  | { e: 'enemyAttack'; enemy: Enemy }
  | { e: 'build'; tower: Tower }
  | { e: 'upgrade'; tower: Tower }
  | { e: 'sell'; tower: Tower; refund: number }
  | { e: 'blink'; fromX: number; fromZ: number; x: number; z: number }
  | { e: 'heal'; x: number; z: number; radius: number }
  | { e: 'root'; x: number; z: number; enemy: Enemy }
  | { e: 'freeze'; x: number; z: number }
  | { e: 'split'; x: number; z: number }
  | { e: 'won' }
  | { e: 'lost' };

interface SpawnEntry { at: number; type: EnemyId; elite: boolean; road: number }

export interface WavePreview { type: EnemyId; count: number; elite: boolean }

export interface GameOptions {
  map: MapDef;
  difficulty: Difficulty;
  endless: boolean;
  meta: MetaRanks;
  /** Number of campaign maps cleared, used for unlocks. */
  cleared: number;
  hero?: HeroId;
  seed?: number;
  /**
   * Endless only: the first wave to fight (1-based). Earlier waves are skipped, and the player
   * starts with the gold and hero level those waves would have earned.
   */
  startWave?: number;
}

/** Real seconds of calm between waves, counted once the road is clear. */
export const WAVE_INTERVAL = 30;
const EARLY_GOLD_PER_SECOND = 1.6;
export const MAX_GOLD = 9999999;
const FIRST_SPAWN_DELAY = 0.6;

export function parseWave(script: string, roadCount: number, startIndex = 0): SpawnEntry[] {
  const out: SpawnEntry[] = [];
  let t = 0;
  let rotate = startIndex;
  for (const token of script.trim().split(/\s+/)) {
    const m = token.match(/^(\d+)([a-z])(\*?)(?:@(\d))?$/);
    if (!m) throw new Error(`Bad wave token: ${token}`);
    const count = +m[1];
    const type = ENEMY_BY_CODE[m[2]];
    const def = ENEMIES[type];
    const elite = m[3] === '*';
    const fixedRoad = m[4] !== undefined ? clamp(+m[4], 0, roadCount - 1) : -1;
    const gap = clamp((0.46 + def.hp / 900) * (3.2 / def.speed), 0.3, 3.2);
    for (let i = 0; i < count; i++) {
      const road = fixedRoad >= 0 ? fixedRoad : (rotate + i) % roadCount;
      out.push({ at: t, type, elite, road });
      t += gap;
    }
    rotate += 1;
    t += 1.1;
  }
  return out;
}

const ENDLESS_BOSSES = Object.values(ENEMIES).filter((e) => e.boss).map((e) => e.code);

/** Generates an escalating wave for endless mode. */
export function endlessWave(index: number, rng: Rng): string {
  const w = index + 1;
  const pool: [string, number, number][] = [
    ['g', 1, 1], ['w', 3, 1.2], ['b', 4, 2.6], ['m', 6, 1.4], ['s', 8, 2.6], ['i', 9, 5],
    ['p', 11, 4], ['h', 12, 3.5], ['a', 14, 4.5], ['boss', 16, 30],
    ['v', 5, 3], ['q', 7, 2.4], ['r', 10, 6], ['f', 12, 3.8], ['l', 13, 7],
  ];
  const tokens: string[] = [];
  const groups = 2 + Math.min(3, Math.floor(w / 6));
  const budget = 8 + w * 3.1 + Math.pow(w, 1.28);
  const available = pool.filter((p) => p[1] <= w);
  for (let g = 0; g < groups; g++) {
    const p = available[Math.floor(Math.pow(rng(), 0.7) * available.length)];
    const count = Math.max(1, Math.min(40, Math.round((budget / groups) / p[2])));
    tokens.push(`${count}${p[0] === 'boss' ? ENDLESS_BOSSES[Math.floor(rng() * ENDLESS_BOSSES.length)] : p[0]}`);
  }
  if (w % 10 === 0) tokens.push(`${Math.max(1, Math.floor(w / 10))}${ENDLESS_BOSSES[(w / 10 - 1) % ENDLESS_BOSSES.length]}*`);
  return tokens.join(' ');
}

export class Game {
  readonly world: World;
  readonly map: MapDef;
  readonly difficulty: Difficulty;
  readonly endless: boolean;
  readonly meta: MetaRanks;
  readonly cleared: number;
  readonly rng: Rng;

  time = 0;
  /** Game time before the latest step, for drawing between steps. */
  prevTime = 0;
  gold: number;
  lives: number;
  maxLives: number;
  state: 'playing' | 'won' | 'lost' = 'playing';
  /** Number of waves started so far. */
  wave = 0;
  /** Waves skipped before the battle began. The player still calls the first wave fought. */
  readonly firstWave: number;
  totalWaves: number;
  /** Real seconds until the next wave, or -1 until the current wave is cleared. */
  waveTimer = -1;
  /** Where the most recent kill happened, for the closing camera move. */
  lastKill = { x: 0, z: 0 };
  /** Current game speed, so the break between waves lasts the same at any speed. */
  timeScale = 1;
  spawnQueue: SpawnEntry[] = [];
  private waveClock = 0;
  private nextId = 1;
  private auraT = 0;
  private endlessCache: string[] = [];

  towers: Tower[] = [];
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
  pools: Pool[] = [];
  units: Unit[] = [];
  hero: Unit;
  heroLevel = 1;
  heroXp = 0;
  heroRespawnT = 0;
  heroAttackRampAt = 0;
  readonly heroDef: HeroDef;
  abilityCd = [0, 0, 0];
  /** Time left on the hero's ward-style power, and what that power does. */
  wardT = 0;
  wardRadius = 0;
  wardRate = 0;
  wardReduction = 0;
  wardBlock = 0;
  /** Rallying Horn and Golden Hour. */
  rallyT = 0;
  goldenT = 0;
  spellCd: Record<SpellId, number> = { starfall: 0, winter: 0, guards: 0, hex: 0, rally: 0, rift: 0, golden: 0 };
  delayed: { at: number; fn: () => void }[] = [];
  events: GameEvent[] = [];

  kills = 0;
  goldEarned = 0;
  leaks = 0;
  score = 0;

  constructor(opts: GameOptions) {
    this.map = opts.map;
    this.world = World.get(opts.map);
    this.difficulty = opts.difficulty;
    this.endless = opts.endless;
    this.meta = opts.meta;
    this.cleared = opts.cleared;
    this.rng = makeRng(opts.seed ?? 1234);
    this.heroDef = HEROES[opts.hero ?? 'ember'];
    const diff = DIFFICULTY[opts.difficulty];
    this.gold = Math.round(opts.map.startGold * (diff.gold * 0.5 + 0.5) * (1 + this.rank('startGold') * 0.06));
    this.maxLives = diff.lives + this.rank('lives') * 2;
    this.lives = this.maxLives;
    this.totalWaves = opts.endless ? Infinity : opts.map.waves.length;
    this.firstWave = opts.endless ? Math.max(0, Math.floor(opts.startWave ?? 1) - 1) : 0;
    this.wave = this.firstWave;

    const anchor = this.lanternPos();
    const road = this.world.roads[0];
    const p = road.sample(road.length * 0.82, { x: 0, z: 0, dx: 0, dz: 0 });
    this.heroLevel = 1 + this.rank('heroStart');
    const hd = this.heroDef;
    this.hero = {
      id: this.nextId++, kind: 'hero', x: p.x, z: p.z, px: p.x, pz: p.z, tx: p.x, tz: p.z, dirX: anchor.x - p.x, dirZ: anchor.z - p.z,
      hp: 0, maxHp: 0, damage: 0, dtype: hd.damageType, rate: hd.rate, range: hd.range, speed: hd.speed, cooldown: 0,
      blockCap: hd.blockCap, blocked: 0, moving: false, ordered: false, dead: false, expires: Infinity, attackAt: -9, hitAt: -9, owner: null,
    };
    if (this.firstWave) this.skipAhead();
    this.applyHeroStats();
    this.hero.hp = this.hero.maxHp;
    this.units.push(this.hero);

    if (this.rank('spellStart') === 0) {
      for (const id of SPELL_ORDER) this.spellCd[id] = this.spellCooldown(id) * 0.4;
    }
  }

  rank(id: MetaId) {
    return this.meta[id] ?? 0;
  }

  /** True once the player has called a wave in this battle. */
  get started() {
    return this.wave > this.firstWave;
  }

  /** Grants roughly the kill bounties, wave gold and hero levels of the skipped waves. */
  private skipAhead() {
    const diff = DIFFICULTY[this.difficulty];
    const bountyBonus = 1 + this.rank('bounty') * 0.04;
    let gold = 0;
    let xp = 0;
    for (let i = 0; i < this.firstWave; i++) {
      for (const s of parseWave(this.scriptFor(i), this.world.roads.length, i)) {
        const bounty = ENEMIES[s.type].bounty;
        gold += bounty * (1 + 0.025 * i) * (s.elite ? 1.5 : 1) * diff.gold * bountyBonus;
        xp += bounty * 0.5;
      }
      if (i > 0) gold += (22 + i * 5) * diff.gold + this.rank('tithe') * 8;
    }
    this.gold = Math.min(MAX_GOLD, Math.round(this.gold + gold));
    xp *= 1 + this.rank('heroXp') * 0.25;
    while (this.heroLevel < HERO_COMMON.maxLevel && xp >= this.xpToNext()) {
      xp -= this.xpToNext();
      this.heroLevel++;
    }
  }

  lanternPos() {
    const road = this.world.roads[0];
    return { x: road.pts[road.pts.length - 2], z: road.pts[road.pts.length - 1] };
  }

  isTowerUnlocked(id: TowerId) {
    const tech = TOWERS[id].tech;
    if (tech) return this.rank(tech) > 0;
    return this.cleared >= TOWERS[id].unlockAfter || this.endless;
  }

  isSpellUnlocked(id: SpellId) {
    const tech = SPELLS[id].tech;
    if (tech) return this.rank(tech) > 0;
    return this.cleared >= SPELLS[id].unlockAfter || this.endless;
  }

  isAbilityUnlocked(index: number) {
    return index < 2 || this.rank('heroUltimate') > 0;
  }

  abilityCooldown(a: HeroAbility) {
    return a.cooldown * (1 - this.rank('heroAbilityCd') * 0.08);
  }

  spellCooldown(id: SpellId) {
    return SPELLS[id].cooldown * (1 - this.rank('spellCooldown') * 0.06);
  }

  spellRadius(id: SpellId) {
    return SPELLS[id].radius * (1 + this.rank('spellRadius') * 0.15);
  }

  private applyHeroStats() {
    const h = this.hero;
    const prevMax = h.maxHp;
    const d = this.heroDef;
    h.maxHp = (d.baseHp + d.hpPerLevel * (this.heroLevel - 1)) * (1 + this.rank('heroHealth') * 0.12);
    h.damage = (d.baseDamage + d.damagePerLevel * (this.heroLevel - 1)) * (1 + this.rank('heroDamage') * 0.12);
    h.hp += h.maxHp - prevMax;
  }

  xpToNext() {
    return HERO_COMMON.xpForLevel(this.heroLevel);
  }

  private gainXp(amount: number) {
    if (this.heroLevel >= HERO_COMMON.maxLevel) return;
    this.heroXp += amount * (1 + this.rank('heroXp') * 0.25);
    while (this.heroLevel < HERO_COMMON.maxLevel && this.heroXp >= this.xpToNext()) {
      this.heroXp -= this.xpToNext();
      this.heroLevel++;
      this.applyHeroStats();
      this.hero.hp = Math.min(this.hero.maxHp, this.hero.hp + this.hero.maxHp * 0.25);
      this.events.push({ e: 'heroLevel', level: this.heroLevel, x: this.hero.x, z: this.hero.z });
    }
  }

  // ---------- Economy & tower commands ----------

  costOf(stats: TowerStats) {
    return Math.round(stats.cost * (1 - this.rank('towerCost') * 0.03));
  }

  canBuild(type: TowerId, x: number, z: number): string | null {
    if (!this.isTowerUnlocked(type)) return 'Not unlocked yet';
    if (this.gold < this.costOf(towerStats(type, 0, 0))) return 'Not enough gold';
    return this.placementProblem(x, z, type);
  }

  placementProblem(x: number, z: number, type?: TowerId): string | null {
    const p = this.world.buildProblem(x, z);
    if (p) return p;
    for (const t of this.towers) {
      if (dist2(t.x, t.z, x, z) < 2.5 * 2.5) return 'Too close to another tower';
    }
    if (type) {
      const s = towerStats(type, 0, 0);
      if (s.garrison && !this.rallyPoint(x, z, s.range)) return 'Too far from the road';
    }
    return null;
  }

  /** The nearest spot on a road within reach, or null when there's none. */
  rallyPoint(x: number, z: number, reach: number) {
    const p = this.nearestRoadPoint(x, z);
    return dist2(p.x, p.z, x, z) <= reach * reach ? p : null;
  }

  build(type: TowerId, x: number, z: number): Tower | null {
    if (this.canBuild(type, x, z) || this.state !== 'playing') return null;
    const stats = towerStats(type, 0, 0);
    const cost = this.costOf(stats);
    this.gold -= cost;
    const t: Tower = {
      id: this.nextId++, type, level: 0, branch: 0, x, z, invested: cost, stats, mode: 'first', cooldown: 0.2,
      aim: 0, firedAt: -9, damageMult: 1, rangeMult: 1, rateMult: 1, range: stats.range, beamTargets: [], beamEnd: null,
      beamRamp: 0, beamLock: 0, rootT: 2, kills: 0, dealt: 0, rally: null, squad: [], garrisonT: 0,
    };
    if (stats.garrison) t.rally = this.rallyPoint(x, z, stats.range);
    this.towers.push(t);
    this.refreshAuras();
    this.events.push({ e: 'build', tower: t });
    return t;
  }

  upgradeCost(t: Tower, branch: number) {
    if (t.level >= 3) return Infinity;
    const b = t.level >= 2 ? t.branch : branch;
    return this.costOf(towerStats(t.type, t.level + 1, b));
  }

  upgrade(t: Tower, branch = 0): boolean {
    if (t.level >= 3 || this.state !== 'playing') return false;
    const b = t.level >= 2 ? t.branch : branch;
    const stats = towerStats(t.type, t.level + 1, b);
    const cost = this.costOf(stats);
    if (this.gold < cost) return false;
    this.gold -= cost;
    t.invested += cost;
    t.level++;
    t.branch = b;
    t.stats = stats;
    t.beamTargets = [];
    t.beamEnd = null;
    this.refitSquad(t);
    this.refreshAuras();
    this.events.push({ e: 'upgrade', tower: t });
    return true;
  }

  sellValue(t: Tower) {
    return Math.floor(t.invested * (0.7 + this.rank('refund') * 0.08));
  }

  sell(t: Tower) {
    const refund = this.sellValue(t);
    this.gold += refund;
    this.towers.splice(this.towers.indexOf(t), 1);
    for (const u of t.squad) this.removeUnit(u);
    t.squad.length = 0;
    this.refreshAuras();
    this.events.push({ e: 'sell', tower: t, refund });
  }

  /** Cheat menu: sets gold directly. Doesn't count toward gold earned. */
  setGold(amount: number) {
    this.gold = clamp(Math.floor(amount), 0, MAX_GOLD);
  }

  // ---------- Waves ----------

  scriptFor(index: number) {
    if (this.endless) {
      while (this.endlessCache.length <= index) {
        this.endlessCache.push(endlessWave(this.endlessCache.length, this.rng));
      }
      return this.endlessCache[index];
    }
    return this.map.waves[index];
  }

  /** Summary of the next wave for the HUD. */
  preview(index = this.wave): WavePreview[] {
    if (index >= this.totalWaves) return [];
    const list = parseWave(this.scriptFor(index), this.world.roads.length);
    const out: WavePreview[] = [];
    for (const s of list) {
      const found = out.find((o) => o.type === s.type && o.elite === s.elite);
      if (found) found.count++;
      else out.push({ type: s.type, count: 1, elite: s.elite });
    }
    return out;
  }

  get canCallWave() {
    return this.state === 'playing' && this.wave < this.totalWaves && this.spawnQueue.length === 0;
  }

  /** True if the given wave (0-based) sends a boss. */
  waveHasBoss(index: number) {
    return this.preview(index).some((p) => ENEMIES[p.type].boss);
  }

  /** The line announcing the bosses of the given wave (0-based). */
  bossAnnouncement(index: number) {
    const bosses = this.preview(index).filter((p) => ENEMIES[p.type].boss);
    const names = [...new Set(bosses.map((p) => ENEMIES[p.type].name))];
    if (names.length === 1 && bosses.reduce((n, p) => n + p.count, 0) === 1) return `The ${names[0]} approaches`;
    return `Bosses approach: ${names.join(', ')}`;
  }

  /** Gold for calling the next wave now. Calling while enemies remain earns the full bonus. */
  get earlyBonus() {
    if (!this.started || !this.canCallWave) return 0;
    const seconds = this.waveTimer < 0 ? WAVE_INTERVAL : this.waveTimer;
    return Math.round(seconds * EARLY_GOLD_PER_SECOND * (1 + this.rank('earlyBonus') * 0.25));
  }

  callNextWave(): boolean {
    if (!this.canCallWave) return false;
    const early = this.earlyBonus;
    const bonus = this.started ? Math.round((22 + this.wave * 5) * DIFFICULTY[this.difficulty].gold) : 0;
    let income = bonus + early;
    for (const t of this.towers) income += t.stats.goldPerWave ?? 0;
    if (this.started) {
      income += this.rank('tithe') * 8;
      income += Math.min(this.rank('interest') * 45, Math.floor(this.gold * this.rank('interest') * 0.03));
    }
    if (income) {
      this.gold += income;
      this.goldEarned += income;
    }
    this.spawnQueue = parseWave(this.scriptFor(this.wave), this.world.roads.length, this.wave);
    this.waveClock = -FIRST_SPAWN_DELAY;
    this.waveTimer = -1;
    this.wave++;
    this.events.push({ e: 'wave', wave: this.wave, bonus, early, income });
    return true;
  }

  hpScaleFor(waveIdx: number) {
    const w = waveIdx;
    const growth = this.endless ? 1 + 0.1 * w + 0.008 * w * w : 1 + 0.08 * w + 0.0035 * w * w;
    const hard = this.difficulty === 'hard' ? this.map.hardHp ?? 1 : 1;
    return this.map.hpScale * hard * DIFFICULTY[this.difficulty].hp * growth;
  }

  private spawn(type: EnemyId, elite: boolean, roadIndex: number, dist = 0, offset?: number) {
    const def = ENEMIES[type];
    const road = def.flying ? this.world.airRoads[roadIndex] : this.world.roads[roadIndex];
    const scale = this.hpScaleFor(Math.max(0, this.wave - 1)) * (elite ? 1.7 : 1);
    const diff = DIFFICULTY[this.difficulty];
    const bounty = def.bounty * (1 + 0.025 * Math.max(0, this.wave - 1)) * (elite ? 1.5 : 1) * diff.gold * (1 + this.rank('bounty') * 0.04);
    const e: Enemy = {
      id: this.nextId++, def, elite, hp: def.hp * scale, maxHp: def.hp * scale, bounty, lives: def.lives + (elite ? 1 : 0),
      speed: def.speed * diff.speed, road, flying: !!def.flying, dist,
      // Bosses keep to the middle of the road.
      offset: offset ?? (def.boss ? 0 : (this.rng() - 0.5) * (PATH_WIDTH * 0.62)), x: 0, z: 0, px: 0, pz: 0, dirX: 1, dirZ: 0,
      slow: 0, slowT: 0, stunT: 0, frozenT: 0, rootT: 0, poisonDps: 0, poisonT: 0, poisonTower: null, shred: 0, vuln: 0, vulnT: 0, noteAt: -9,
      specialT: 2 + this.rng() * 2, shield: 0, hasteT: 0, hasteMult: 1, reborn: false, engaged: null, attackT: 0.5, dead: false, hitAt: -9, kickAt: -9, attackAt: -9,
      scale: def.size * (elite && !def.boss ? 1.3 : 1), animPhase: this.rng() * 6.28,
    };
    this.placeEnemy(e);
    e.px = e.x;
    e.pz = e.z;
    this.enemies.push(e);
    if (def.boss) this.events.push({ e: 'boss', enemy: e });
    return e;
  }

  private tmp = { x: 0, z: 0, dx: 0, dz: 0 };
  private placeEnemy(e: Enemy) {
    const s = e.road.sample(e.dist, this.tmp);
    e.x = s.x - s.dz * e.offset;
    e.z = s.z + s.dx * e.offset;
    e.dirX = s.dx;
    e.dirZ = s.dz;
  }

  // ---------- Combat ----------

  /** The fraction of a hit this enemy ignores. Negative means the hit lands harder. */
  resistance(e: Enemy, type: AttackType, pierce = 0) {
    let r = e.def.resist[type] ?? 0;
    if (r > 0) {
      r *= 1 - Math.min(1, pierce + this.rank('resistIgnore') * 0.1);
      // Cracked plate only helps against things that have to get through plate.
      if (type === 'pierce' || type === 'blast') r = Math.max(0, r - e.shred);
    }
    return r - (e.vulnT > 0 ? e.vuln : 0);
  }

  damage(e: Enemy, amount: number, type: AttackType, opts: { pierce?: number; crit?: boolean; tower?: Tower; silent?: boolean; trueHit?: boolean } = {}) {
    if (e.dead) return;
    const res = opts.trueHit ? 0 : this.resistance(e, type, opts.pierce ?? 0);
    const dealt = amount * (1 - res);
    const absorbed = Math.min(e.shield, Math.max(0, dealt));
    e.shield -= absorbed;
    e.hp -= dealt - absorbed;
    e.hitAt = this.time;
    if (opts.tower) {
      opts.tower.dealt += dealt;
      // Tells the player when a tower is the wrong tool, or the right one. Poison ticks and beams count too.
      if (this.time - e.noteAt > 2.2 && (res >= 0.5 || res <= -0.2)) {
        e.noteAt = this.time;
        this.events.push({ e: 'resistNote', x: e.x, z: e.z, flying: e.flying, weak: res < 0 });
      }
    }
    if (!opts.silent) {
      e.kickAt = this.time;
      this.events.push({ e: 'dmg', x: e.x, z: e.z, amount: dealt, crit: !!opts.crit, dtype: type, flying: e.flying });
    }
    if (e.hp <= 0) {
      if (e.def.ability === 'rebirth' && !e.reborn) this.rebirth(e);
      else this.kill(e, opts.tower);
    }
  }

  /** The Ashen Regent falls, burns away whatever was on it, and stands back up. */
  private rebirth(e: Enemy) {
    e.reborn = true;
    e.hp = e.maxHp * 0.5;
    e.poisonT = 0;
    e.stunT = Math.max(e.stunT, 1.2);
    this.events.push({ e: 'bossSkill', kind: 'rebirth', enemy: e, x: e.x, z: e.z, radius: 4 });
  }

  private kill(e: Enemy, tower?: Tower) {
    if (e.dead) return;
    e.dead = true;
    this.lastKill.x = e.x;
    this.lastKill.z = e.z;
    if (e.engaged) e.engaged = null;
    const bounty = Math.max(1, Math.round(e.bounty * (this.goldenT > 0 ? SPELLS.golden.power : 1)));
    this.gold += bounty;
    this.goldEarned += bounty;
    this.kills++;
    if (tower) tower.kills++;
    this.score += Math.round(e.maxHp);
    this.events.push({ e: 'death', enemy: e });
    this.events.push({ e: 'gold', x: e.x, z: e.z, amount: bounty });
    const hero = this.hero;
    if (!hero.dead) {
      const near = dist2(hero.x, hero.z, e.x, e.z) < 12 * 12;
      this.gainXp(e.def.bounty * (near ? 1 : 0.35));
    }
    if (e.def.id === 'sporeback') {
      this.events.push({ e: 'split', x: e.x, z: e.z });
      const idx = this.world.roads.indexOf(e.road);
      for (let i = 0; i < 4; i++) {
        const c = this.spawn('gloomling', false, Math.max(0, idx), Math.max(0, e.dist - 0.5 + i * 0.4));
        c.bounty *= 0.5;
      }
    }
  }

  private hitStats(stats: TowerStats, tower: Tower, x: number, z: number, primary: Enemy | null, damage: number, crit: boolean, kind: string) {
    const type = stats.dmgType;
    if (stats.lineShot && primary) {
      // The bolt carries on along its line to the end of the tower's reach.
      const dx = primary.x - tower.x, dz = primary.z - tower.z;
      const l = Math.hypot(dx, dz) || 1;
      const ux = dx / l, uz = dz / l;
      const reach = Math.max(tower.range, l);
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (e.dead) continue;
        if (e.flying && !stats.air) continue;
        if (!e.flying && !stats.ground) continue;
        const ex = e.x - tower.x, ez = e.z - tower.z;
        const along = ex * ux + ez * uz;
        if (along < 0 || along > reach) continue;
        if (e !== primary && Math.abs(ex * uz - ez * ux) > stats.lineShot + e.scale * 0.3) continue;
        this.applyEffects(stats, e, tower);
        this.damage(e, damage, type, { pierce: stats.armorPierce, crit: crit && e === primary, tower, silent: e !== primary });
      }
      this.events.push({ e: 'impact', kind, x: primary.x, z: primary.z, radius: 0, stats });
    } else if (stats.splash) {
      const r2 = stats.splash * stats.splash;
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (e.dead) continue;
        if (e.flying && !stats.air) continue;
        if (!e.flying && !stats.ground) continue;
        const d2 = dist2(e.x, e.z, x, z);
        if (d2 > r2) continue;
        const falloff = e === primary ? 1 : 1 - 0.45 * (Math.sqrt(d2) / stats.splash);
        this.applyEffects(stats, e, tower);
        this.damage(e, damage * falloff, type, { pierce: stats.armorPierce, crit, tower, silent: e !== primary && d2 > 4 });
      }
      this.events.push({ e: 'impact', kind, x, z, radius: stats.splash, stats });
    } else if (primary && !primary.dead) {
      this.applyEffects(stats, primary, tower);
      this.damage(primary, damage, type, { pierce: stats.armorPierce, crit, tower });
      this.events.push({ e: 'impact', kind, x: primary.x, z: primary.z, radius: 0, stats });
    }
    if (stats.pool) {
      this.pools.push({ x, z, radius: stats.pool.radius, dps: stats.pool.dps * tower.damageMult, t: stats.pool.dur, dur: stats.pool.dur, type: 'fire' });
    }
  }

  private applyEffects(stats: TowerStats, e: Enemy, tower?: Tower) {
    if (stats.poison) {
      const dps = stats.poison.dps * (tower?.damageMult ?? 1);
      if (e.poisonT <= 0 || dps >= e.poisonDps) {
        e.poisonDps = dps;
        e.poisonTower = tower ?? null;
      }
      e.poisonT = Math.max(e.poisonT, stats.poison.dur);
    }
    if (stats.wither) {
      e.vuln = Math.max(e.vulnT > 0 ? e.vuln : 0, stats.wither);
      e.vulnT = Math.max(e.vulnT, 3);
    }
    if (stats.slow) {
      e.slow = Math.max(e.slowT > 0 ? e.slow : 0, stats.slow);
      e.slowT = Math.max(e.slowT, stats.slowDur ?? 1.5);
    }
    if (stats.freezeChance && this.rng() < stats.freezeChance && !e.def.boss) {
      e.frozenT = Math.max(e.frozenT, stats.freezeDur ?? 1);
      this.events.push({ e: 'freeze', x: e.x, z: e.z });
    }
    if (stats.stun && !e.flying) {
      e.stunT = Math.max(e.stunT, e.def.boss ? stats.stun * 0.4 : stats.stun);
    }
    if (stats.shred) e.shred = Math.min(0.5, e.shred + stats.shred);
  }

  private inRange(t: Tower, e: Enemy) {
    const s = t.stats;
    if (e.dead) return false;
    if (e.flying && !s.air) return false;
    if (!e.flying && !s.ground) return false;
    return dist2(t.x, t.z, e.x, e.z) <= t.range * t.range;
  }

  private rankTarget(t: Tower, e: Enemy) {
    switch (t.mode) {
      case 'first': return -(e.road.length - e.dist);
      case 'last': return e.road.length - e.dist;
      case 'strong': return e.hp;
      case 'close': return -dist2(t.x, t.z, e.x, e.z);
    }
  }

  private pickTargets(t: Tower, count: number, out: Enemy[]) {
    out.length = 0;
    for (const e of this.enemies) {
      if (!this.inRange(t, e)) continue;
      if (out.length < count) {
        out.push(e);
      } else {
        let worst = 0;
        for (let i = 1; i < out.length; i++) if (this.rankTarget(t, out[i]) < this.rankTarget(t, out[worst])) worst = i;
        if (this.rankTarget(t, e) > this.rankTarget(t, out[worst])) out[worst] = e;
      }
    }
    if (out.length > 1) out.sort((a, b) => this.rankTarget(t, b) - this.rankTarget(t, a));
    return out;
  }

  private rollDamage(t: Tower) {
    const s = t.stats;
    let damage = s.damage * t.damageMult * (t.level === 3 ? 1 + this.rank('masterwork') * 0.1 : 1);
    let crit = false;
    const metaCrit = this.rank('towerCrit') * 0.03;
    if (s.crit && this.rng() < s.crit) {
      damage *= s.critMult ?? 2;
      crit = true;
    } else if (metaCrit && this.rng() < metaCrit) {
      damage *= 2;
      crit = true;
    }
    return { damage, crit };
  }

  private scratch: Enemy[] = [];

  private fire(t: Tower, target: Enemy) {
    const s = t.stats;
    t.aim = Math.atan2(target.x - t.x, target.z - t.z);
    t.firedAt = this.time;
    if (s.chain) {
      this.fireChain(t, target);
      return;
    }
    if (s.pulse) {
      const { damage, crit } = this.rollDamage(t);
      let shown = 0;
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (!this.inRange(t, e)) continue;
        this.applyEffects(s, e, t);
        this.damage(e, damage, s.dmgType, { crit, tower: t, silent: shown++ > 3 });
      }
      this.events.push({ e: 'fx', kind: 'pulse', x: t.x, z: t.z, radius: t.range, color: s.dmgType === 'arcane' ? 0xc2a6ff : 0xffb86b, tower: t });
      return;
    }
    const targets = s.multishot ? this.pickTargets(t, s.multishot, this.scratch).slice() : [target];
    for (let i = 0; i < (s.multishot ?? 1); i++) {
      // With fewer targets than arrows, the leftovers double up on the lead target.
      let tgt = targets[i % targets.length];
      if (s.poison && !s.splash) {
        // A poison is wasted on someone already sick, so spit at the healthy instead.
        let bestR = -Infinity;
        for (const e of this.enemies) {
          if (e.poisonT > 1 || !this.inRange(t, e)) continue;
          const r = this.rankTarget(t, e);
          if (r > bestR) { bestR = r; tgt = e; }
        }
      }
      const { damage, crit } = this.rollDamage(t);
      const kind = s.projectile as Projectile['kind'];
      let tx = tgt.x, tz = tgt.z, dur = 0;
      const homing = kind !== 'shell';
      if (!homing) {
        const d = Math.sqrt(dist2(t.x, t.z, tx, tz));
        dur = 0.7 + d * 0.05;
        const lead = tgt.engaged || tgt.stunT > 0 || tgt.rootT > 0 || tgt.frozenT > 0 ? 0 : tgt.speed * (tgt.slowT > 0 ? 1 - tgt.slow : 1) * dur;
        const p = tgt.road.sample(tgt.dist + lead, this.tmp);
        tx = p.x - p.dz * tgt.offset;
        tz = p.z + p.dx * tgt.offset;
      }
      this.projectiles.push({
        id: this.nextId++, kind, sx: t.x, sz: t.z, x: t.x, z: t.z, px: t.x, pz: t.z, tx, tz, target: homing ? tgt : null, speed: s.projSpeed,
        t: 0, pt: 0, dur, damage, crit, tower: t, stats: s, total: Math.max(0.1, Math.sqrt(dist2(t.x, t.z, tx, tz))), dead: false,
      });
      this.events.push({ e: 'fire', tower: t, kind, tx, tz });
    }
  }

  private fireChain(t: Tower, first: Enemy) {
    const s = t.stats;
    const hit = new Set<Enemy>();
    const points: { x: number; z: number; flying: boolean; scale: number }[] = [];
    let cur: Enemy | null = first;
    let { damage, crit } = this.rollDamage(t);
    for (let i = 0; i < (s.chain ?? 1) && cur; i++) {
      hit.add(cur);
      points.push({ x: cur.x, z: cur.z, flying: cur.flying, scale: cur.scale });
      const origin: Enemy = cur;
      if (s.stun && !origin.flying && i === 0) this.applyEffects({ ...s, slow: undefined }, origin);
      this.damage(origin, damage, s.dmgType, { crit, tower: t, silent: i > 2 });
      damage *= 0.82;
      crit = false;
      let best: Enemy | null = null;
      let bestD = 6.5 * 6.5;
      for (const e of this.enemies) {
        if (e.dead || hit.has(e)) continue;
        const d = dist2(e.x, e.z, origin.x, origin.z);
        if (d < bestD) { bestD = d; best = e; }
      }
      cur = best;
    }
    this.events.push({ e: 'lightning', tower: t, points });
    this.events.push({ e: 'fire', tower: t, kind: 'lightning', tx: first.x, tz: first.z });
  }

  private stepBeam(t: Tower, dt: number) {
    const s = t.stats;
    const b = s.beam!;
    const targets = this.pickTargets(t, b.mode === 'split' ? b.targets : 1, t.beamTargets);
    t.beamEnd = null;
    if (targets.length === 0) {
      t.beamRamp = Math.max(0, t.beamRamp - dt * 2);
      t.beamLock = 0;
      return;
    }
    const primary = targets[0];
    if (t.beamLock !== primary.id) {
      t.beamLock = primary.id;
      t.beamRamp *= 0.45;
    }
    t.beamRamp = Math.min(b.rampTime, t.beamRamp + dt);
    t.aim = Math.atan2(primary.x - t.x, primary.z - t.z);
    const dps = s.damage * t.damageMult * t.rateMult * (1 + b.ramp * (t.beamRamp / b.rampTime));
    if (b.mode === 'line') {
      const dx = primary.x - t.x, dz = primary.z - t.z;
      const l = Math.hypot(dx, dz) || 1;
      const ux = dx / l, uz = dz / l;
      t.beamEnd = { x: t.x + ux * t.range, z: t.z + uz * t.range };
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (e.dead) continue;
        const ex = e.x - t.x, ez = e.z - t.z;
        const along = ex * ux + ez * uz;
        if (along < 0 || along > t.range) continue;
        const across = Math.abs(ex * uz - ez * ux);
        if (across < 1.15 + e.scale * 0.3) this.damage(e, dps * dt, s.dmgType, { tower: t, silent: true });
      }
    } else {
      for (let i = 0; i < targets.length; i++) {
        this.damage(targets[i], dps * dt, s.dmgType, { tower: t, silent: true });
      }
    }
  }

  refreshAuras() {
    const towers = this.towers;
    const hero = this.hero;
    const metaDamage = 1 + this.rank('towerDamage') * 0.03;
    const metaRange = 1 + this.rank('towerRange') * 0.03;
    const metaRate = 1 + this.rank('towerRate') * 0.025;
    for (const t of towers) {
      let bestD = 0, bestR = 0;
      for (const o of towers) {
        const a = o.stats.aura;
        if (!a || o === t) continue;
        if (dist2(o.x, o.z, t.x, t.z) <= o.range * o.range) {
          bestD = Math.max(bestD, a.damage);
          bestR = Math.max(bestR, a.range);
        }
      }
      let rate = metaRate + (this.rallyT > 0 ? SPELLS.rally.power : 0);
      let heroDamage = 0, heroRange = 0;
      if (!hero.dead) {
        const d2 = dist2(hero.x, hero.z, t.x, t.z);
        if (d2 < HERO_COMMON.auraRadius * HERO_COMMON.auraRadius) {
          const a = this.heroDef.aura;
          const lift = a.base + this.heroLevel * a.perLevel;
          if (a.stat === 'rate') rate += lift;
          else if (a.stat === 'damage') heroDamage = lift;
          else heroRange = lift;
        }
        if (this.wardT > 0 && d2 < this.wardRadius * this.wardRadius) rate += this.wardRate;
      }
      t.damageMult = metaDamage + bestD + heroDamage;
      t.rangeMult = metaRange + bestR + heroRange;
      t.rateMult = rate;
      t.range = t.stats.range * t.rangeMult;
    }
  }

  // ---------- Spells & hero ----------

  castSpell(id: SpellId, x: number, z: number): boolean {
    if (!this.isSpellUnlocked(id) || this.spellCd[id] > 0 || this.state !== 'playing') return false;
    const power = 1 + this.rank('spellPower') * 0.12;
    const radius = this.spellRadius(id);
    const def = SPELLS[id];
    if (id === 'starfall') {
      this.events.push({ e: 'starfall', x, z, radius, phase: 'cast' });
      this.delayed.push({
        at: this.time + 0.85,
        fn: () => {
          this.events.push({ e: 'starfall', x, z, radius, phase: 'hit' });
          const growth = 1 + Math.max(0, this.wave - 1) * 0.06;
          for (const e of [...this.enemies]) {
            if (e.dead || dist2(e.x, e.z, x, z) > radius * radius) continue;
            this.damage(e, def.power * power * growth, 'radiant', {});
          }
          this.pools.push({ x, z, radius: radius * 0.7, dps: 30 * power, t: 3, dur: 3, type: 'radiant' });
        },
      });
    } else if (id === 'winter') {
      this.events.push({ e: 'winter', x, z, radius });
      for (const e of this.enemies) {
        if (e.dead || dist2(e.x, e.z, x, z) > radius * radius) continue;
        const dur = def.power * power * (e.def.boss ? 0.45 : 1);
        e.frozenT = Math.max(e.frozenT, dur);
        e.slow = 0.5;
        e.slowT = Math.max(e.slowT, dur + def.duration);
        this.damage(e, 28 * power, 'radiant', { silent: true });
      }
    } else if (id === 'hex') {
      this.events.push({ e: 'fx', kind: 'hex', x, z, radius, color: def.color });
      for (const e of this.enemies) {
        if (e.dead || dist2(e.x, e.z, x, z) > radius * radius) continue;
        e.vuln = Math.max(e.vulnT > 0 ? e.vuln : 0, def.power);
        e.vulnT = Math.max(e.vulnT, def.duration);
      }
    } else if (id === 'rally') {
      this.rallyT = def.duration;
      this.refreshAuras();
      for (const t of this.towers) this.events.push({ e: 'fx', kind: 'rally', x: t.x, z: t.z, radius: 2.4, color: def.color });
    } else if (id === 'golden') {
      this.goldenT = def.duration;
      const l = this.lanternPos();
      this.events.push({ e: 'fx', kind: 'golden', x: l.x, z: l.z, radius: 12, color: def.color });
    } else if (id === 'rift') {
      this.events.push({ e: 'fx', kind: 'rift', x, z, radius, color: def.color });
      for (const e of this.enemies) {
        if (e.dead || dist2(e.x, e.z, x, z) > radius * radius) continue;
        this.shove(e, def.power * power);
      }
    } else {
      const spot = this.nearestRoadPoint(x, z);
      const count = def.power + this.rank('guardCount');
      this.events.push({ e: 'guards', x: spot.x, z: spot.z });
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const gx = spot.x + Math.cos(a) * 1.3;
        const gz = spot.z + Math.sin(a) * 1.3;
        const growth = 1 + Math.max(0, this.wave - 1) * 0.07;
        this.units.push({
          id: this.nextId++, kind: 'guard', x: gx, z: gz, px: gx, pz: gz, tx: gx, tz: gz, dirX: 1, dirZ: 0,
          hp: 160 * power * growth, maxHp: 160 * power * growth, damage: 18 * power * growth, dtype: 'radiant', rate: 1, range: 2.2, speed: 4.5, cooldown: 0,
          blockCap: 2, blocked: 0, moving: false, ordered: false, dead: false, expires: this.time + def.duration, attackAt: -9, hitAt: -9, owner: null,
        });
      }
    }
    this.spellCd[id] = this.spellCooldown(id);
    return true;
  }

  nearestRoadPoint(x: number, z: number) {
    let best = { x, z };
    let bestD = Infinity;
    for (const road of this.world.roads) {
      for (let i = 0; i < road.count; i += 2) {
        const px = road.pts[i * 2], pz = road.pts[i * 2 + 1];
        const d = dist2(px, pz, x, z);
        if (d < bestD) { bestD = d; best = { x: px, z: pz }; }
      }
    }
    return best;
  }

  moveHero(x: number, z: number) {
    const h = this.hero;
    if (h.dead) return false;
    h.tx = Math.max(-this.world.halfW - 4, Math.min(this.world.halfW + 4, x));
    h.tz = Math.max(-this.world.halfH - 4, Math.min(this.world.halfH + 4, z));
    h.ordered = true;
    return true;
  }

  /** Sends an enemy back along its road. A boss only stumbles. */
  private shove(e: Enemy, distance: number) {
    e.dist = Math.max(0, e.dist - distance * (e.def.boss ? 0.25 : 1));
    e.engaged = null;
    this.placeEnemy(e);
    e.px = e.x;
    e.pz = e.z;
  }

  /** Uses one of the hero's powers. */
  useAbility(index: number): boolean {
    const h = this.hero;
    const a = this.heroDef.abilities[index];
    if (!a || h.dead || !this.isAbilityUnlocked(index) || this.abilityCd[index] > 0 || this.state !== 'playing') return false;
    const fx = a.effect;
    const power = 1 + this.rank('heroAbilityPower') * 0.15;
    const color = this.heroDef.accent;
    if (fx.kind === 'snipe') {
      // Held in reserve until there's something worth shooting.
      let best: Enemy | null = null;
      for (const e of this.enemies) {
        if (e.dead || dist2(e.x, e.z, h.x, h.z) > fx.range * fx.range) continue;
        if (!best || e.hp > best.hp) best = e;
      }
      if (!best) return false;
      h.attackAt = this.time;
      this.events.push({ e: 'fx', kind: 'snipe', x: best.x, z: best.z, radius: 1.8, color });
      this.events.push({ e: 'unitAttack', unit: h, flying: best.flying, ranged: true, tx: best.x, tz: best.z });
      this.damage(best, (fx.damage + fx.damagePerLevel * (this.heroLevel - 1)) * power, fx.type, { trueHit: true, crit: true });
    } else if (fx.kind === 'burst') {
      this.events.push({ e: 'sunbreak', x: h.x, z: h.z, radius: fx.radius, color });
      h.attackAt = this.time;
      const dmg = (fx.damage + fx.damagePerLevel * (this.heroLevel - 1)) * (1 + this.rank('heroDamage') * 0.12) * power;
      for (const e of [...this.enemies]) {
        if (e.dead || dist2(e.x, e.z, h.x, h.z) > fx.radius * fx.radius) continue;
        if (e.flying && !fx.hitsAir) continue;
        if (fx.stun && !e.flying) e.stunT = Math.max(e.stunT, e.def.boss ? fx.stun * 0.4 : fx.stun);
        if (fx.slow) {
          e.slow = Math.max(e.slowT > 0 ? e.slow : 0, fx.slow);
          e.slowT = Math.max(e.slowT, fx.slowDur ?? 2);
        }
        this.damage(e, dmg, fx.type, {});
        if (fx.shove && !e.dead && !e.flying) this.shove(e, fx.shove);
      }
      if (fx.pool) this.pools.push({ x: h.x, z: h.z, radius: fx.radius * 0.8, dps: fx.pool.dps * power, t: fx.pool.dur, dur: fx.pool.dur, type: fx.type });
    } else if (fx.kind === 'ward') {
      this.wardT = fx.duration;
      this.wardRadius = fx.radius;
      this.wardRate = fx.rateBonus;
      this.wardReduction = fx.damageReduction;
      this.wardBlock = fx.extraBlock;
      h.hp = Math.min(h.maxHp, h.hp + h.maxHp * fx.heal);
      this.refreshAuras();
      this.events.push({ e: 'ward', x: h.x, z: h.z, radius: Math.max(fx.radius, 3.4) });
    } else {
      this.events.push({ e: 'fx', kind: 'mark', x: h.x, z: h.z, radius: fx.radius, color });
      for (const e of this.enemies) {
        if (e.dead || dist2(e.x, e.z, h.x, h.z) > fx.radius * fx.radius) continue;
        e.vuln = Math.max(e.vulnT > 0 ? e.vuln : 0, fx.vuln);
        e.vulnT = Math.max(e.vulnT, fx.duration);
      }
    }
    this.abilityCd[index] = this.abilityCooldown(a);
    return true;
  }

  // ---------- Barracks ----------

  private removeUnit(u: Unit) {
    u.dead = true;
    const i = this.units.indexOf(u);
    if (i >= 0) this.units.splice(i, 1);
  }

  private soldierSpot(t: Tower, index: number, count: number) {
    const a = (index / Math.max(1, count)) * Math.PI * 2 + 0.6;
    return { x: t.rally!.x + Math.cos(a) * 1.25, z: t.rally!.z + Math.sin(a) * 1.25 };
  }

  private stepGarrison(t: Tower, dt: number) {
    const g = t.stats.garrison!;
    if (!t.rally) return;
    for (let i = t.squad.length - 1; i >= 0; i--) if (t.squad[i].dead) t.squad.splice(i, 1);
    if (t.squad.length >= g.count) {
      t.garrisonT = g.respawn;
      return;
    }
    t.garrisonT -= dt;
    if (t.garrisonT > 0) return;
    t.garrisonT = g.respawn;
    const taken = new Set(t.squad.map((u) => u.tx));
    let index = 0;
    for (let i = 0; i < g.count; i++) if (!taken.has(this.soldierSpot(t, i, g.count).x)) { index = i; break; }
    const spot = this.soldierSpot(t, index, g.count);
    const u: Unit = {
      id: this.nextId++, kind: 'guard', x: t.x, z: t.z, px: t.x, pz: t.z, tx: spot.x, tz: spot.z, dirX: 1, dirZ: 0,
      hp: g.hp, maxHp: g.hp, damage: g.damage, dtype: t.stats.dmgType, rate: g.rate, range: 2.2, speed: 5, cooldown: 0,
      blockCap: g.blockCap, blocked: 0, moving: false, ordered: false, dead: false, expires: Infinity, attackAt: -9, hitAt: -9, owner: t,
    };
    t.squad.push(u);
    this.units.push(u);
    t.firedAt = this.time;
  }

  /** New orders after an upgrade. The soldiers keep the same fraction of their health. */
  private refitSquad(t: Tower) {
    const g = t.stats.garrison;
    if (!g) return;
    t.rally = this.rallyPoint(t.x, t.z, t.stats.range) ?? t.rally;
    t.garrisonT = Math.min(t.garrisonT, 1);
    t.squad.forEach((u, i) => {
      const frac = u.hp / u.maxHp;
      u.maxHp = g.hp;
      u.hp = g.hp * frac;
      u.damage = g.damage;
      u.dtype = t.stats.dmgType;
      u.rate = g.rate;
      u.blockCap = g.blockCap;
      if (t.rally) {
        const spot = this.soldierSpot(t, i, g.count);
        u.tx = spot.x;
        u.tz = spot.z;
      }
    });
  }

  private stepUnits(dt: number) {
    const hero = this.hero;
    if (hero.dead) {
      this.heroRespawnT -= dt;
      if (this.heroRespawnT <= 0) {
        const l = this.lanternPos();
        const road = this.world.roads[0];
        const p = road.sample(road.length - 6, this.tmp);
        hero.dead = false;
        hero.x = p.x; hero.z = p.z; hero.tx = p.x; hero.tz = p.z;
        hero.hp = hero.maxHp;
        hero.ordered = false;
        hero.dirX = l.x - p.x; hero.dirZ = l.z - p.z;
        this.events.push({ e: 'respawn', x: p.x, z: p.z });
      }
    }
    for (let i = this.units.length - 1; i >= 0; i--) {
      const u = this.units[i];
      if (u.dead) continue;
      if (u.kind === 'guard' && this.time > u.expires) {
        u.dead = true;
        this.events.push({ e: 'unitDown', unit: u });
        this.units.splice(i, 1);
        continue;
      }
      u.blocked = 0;
      u.cooldown -= dt;
      const dx = u.tx - u.x, dz = u.tz - u.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.15) {
        const step = Math.min(d, u.speed * dt);
        u.x += (dx / d) * step;
        u.z += (dz / d) * step;
        u.dirX = dx / d;
        u.dirZ = dz / d;
        u.moving = true;
      } else {
        u.moving = false;
        u.ordered = false;
      }
      if (u.kind === 'hero' && !u.moving) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.018 * dt);
      // Soldiers catch their breath between fights.
      if (u.owner && !u.moving && this.time - u.hitAt > 3) u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.08 * dt);
    }
    // Blocking: ground enemies stop to fight whichever defender they reach.
    for (const e of this.enemies) {
      if (e.dead || e.flying) continue;
      if (e.engaged && (e.engaged.dead || dist2(e.x, e.z, e.engaged.x, e.engaged.z) > 3.6 * 3.6)) e.engaged = null;
      if (e.engaged) e.engaged.blocked++;
    }
    for (const e of this.enemies) {
      if (e.dead || e.flying || e.engaged) continue;
      // A charging boss runs straight past defenders.
      if (e.def.ability === 'charge' && e.hasteT > 0) continue;
      for (const u of this.units) {
        if (u.dead || u.blocked >= u.blockCap + (u === this.hero && this.wardT > 0 ? this.wardBlock : 0)) continue;
        if (u.kind === 'hero' && u.ordered) continue;
        if (dist2(e.x, e.z, u.x, u.z) < 2.3 * 2.3) {
          e.engaged = u;
          u.blocked++;
          break;
        }
      }
    }
    // Defender attacks: melee on the ground, radiant bolts at flyers for the hero.
    for (const u of this.units) {
      if (u.dead || u.cooldown > 0) continue;
      let best: Enemy | null = null;
      let bestD = Infinity;
      for (const e of this.enemies) {
        if (e.dead) continue;
        const r = e.flying ? (u.kind === 'hero' ? Math.max(7.5, u.range) : 0) : u.range;
        const d = dist2(e.x, e.z, u.x, u.z);
        if (d <= r * r && d < bestD) { best = e; bestD = d; }
      }
      if (!best) continue;
      u.cooldown = 1 / u.rate;
      u.attackAt = this.time;
      if (!u.moving) {
        const l = Math.sqrt(bestD) || 1;
        u.dirX = (best.x - u.x) / l;
        u.dirZ = (best.z - u.z) / l;
      }
      const ranged = u.range > 4;
      this.events.push({ e: 'unitAttack', unit: u, flying: best.flying, ranged, tx: best.x, tz: best.z });
      const wasDead = best.dead;
      this.damage(best, u.damage * (best.flying && !ranged ? 0.7 : 1), u.dtype, { tower: u.owner ?? undefined });
      if (u.kind === 'hero' && !wasDead) this.gainXp(0.25);
    }
  }

  private hurtUnit(u: Unit, amount: number) {
    if (u.dead) return;
    u.hp -= amount * (u === this.hero && this.wardT > 0 ? 1 - this.wardReduction : 1);
    u.hitAt = this.time;
    if (u.hp <= 0) {
      u.dead = true;
      this.events.push({ e: 'unitDown', unit: u });
      if (u.kind === 'hero') {
        this.heroRespawnT = HERO_COMMON.respawn * (1 - this.rank('heroRespawn') * 0.15);
      } else {
        const i = this.units.indexOf(u);
        if (i >= 0) this.units.splice(i, 1);
      }
    }
  }

  // ---------- Main step ----------

  private snapshot() {
    this.prevTime = this.time;
    for (const e of this.enemies) { e.px = e.x; e.pz = e.z; }
    for (const u of this.units) { u.px = u.x; u.pz = u.z; }
    for (const p of this.projectiles) { p.px = p.x; p.pz = p.z; p.pt = p.t; }
  }

  step(dt: number) {
    this.snapshot();
    if (this.state !== 'playing') return;
    this.time += dt;

    for (const id of SPELL_ORDER) this.spellCd[id] = Math.max(0, this.spellCd[id] - dt);
    for (let i = 0; i < this.abilityCd.length; i++) this.abilityCd[i] = Math.max(0, this.abilityCd[i] - dt);
    if (this.wardT > 0) this.wardT -= dt;
    if (this.rallyT > 0) this.rallyT -= dt;
    if (this.goldenT > 0) this.goldenT -= dt;

    for (let i = this.delayed.length - 1; i >= 0; i--) {
      if (this.time >= this.delayed[i].at) {
        const d = this.delayed[i];
        this.delayed.splice(i, 1);
        d.fn();
      }
    }

    // Spawning and wave timer.
    this.waveClock += dt;
    while (this.spawnQueue.length && this.spawnQueue[0].at <= this.waveClock) {
      const s = this.spawnQueue.shift()!;
      this.spawn(s.type, s.elite, s.road);
    }
    // The break starts once the road is clear, so a slow wave never overlaps the next one.
    const roadClear = this.spawnQueue.length === 0 && this.enemies.length === 0 && this.delayed.length === 0;
    if (this.started && roadClear && this.wave < this.totalWaves) {
      if (this.waveTimer < 0) this.waveTimer = WAVE_INTERVAL;
      this.waveTimer -= dt / this.timeScale;
      if (this.waveTimer <= 0) {
        this.waveTimer = 0;
        this.callNextWave();
      }
    }

    this.auraT -= dt;
    if (this.auraT <= 0) {
      this.auraT = 0.2;
      this.refreshAuras();
    }

    this.stepUnits(dt);
    this.stepEnemies(dt);
    this.stepTowers(dt);
    this.stepProjectiles(dt);
    this.stepPools(dt);

    // Compact the enemy list.
    let write = 0;
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (!e.dead) this.enemies[write++] = e;
    }
    this.enemies.length = write;

    if (this.state === 'playing' && !this.endless && this.wave >= this.totalWaves && this.spawnQueue.length === 0 && this.enemies.length === 0 && this.delayed.length === 0) {
      this.state = 'won';
      this.events.push({ e: 'won' });
    }
  }

  private stepEnemies(dt: number) {
    for (let i = 0; i < this.enemies.length; i++) {
      const e = this.enemies[i];
      if (e.dead) continue;
      if (e.poisonT > 0) {
        e.poisonT -= dt;
        this.damage(e, e.poisonDps * dt, 'venom', { silent: true, tower: e.poisonTower ?? undefined });
        if (e.dead) continue;
      }
      if (e.vulnT > 0) e.vulnT -= dt;
      if (e.slowT > 0) {
        e.slowT -= dt;
        if (e.slowT <= 0) e.slow = 0;
      }
      if (e.stunT > 0) e.stunT -= dt;
      if (e.frozenT > 0) e.frozenT -= dt;
      if (e.rootT > 0) e.rootT -= dt;
      if (e.hasteT > 0) e.hasteT -= dt;
      const held = e.stunT > 0 || e.frozenT > 0 || e.rootT > 0;

      if (e.engaged && !held) {
        e.attackT -= dt;
        if (e.attackT <= 0) {
          e.attackT = 1.1;
          e.attackAt = this.time;
          this.hurtUnit(e.engaged, e.def.attack * (e.elite ? 1.6 : 1) * (1 + Math.max(0, this.wave - 1) * 0.05));
          this.events.push({ e: 'enemyAttack', enemy: e });
        }
      }

      if (!e.engaged && !held) {
        const before = e.dist;
        e.dist = before + e.speed * (1 - e.slow) * (e.hasteT > 0 ? e.hasteMult : 1) * dt;
        if (e.dist >= e.road.length) {
          e.dead = true;
          const loss = e.lives;
          this.lives = Math.max(0, this.lives - loss);
          this.leaks += loss;
          this.events.push({ e: 'leak', enemy: e });
          if (this.lives <= 0) {
            this.state = 'lost';
            this.events.push({ e: 'lost' });
            return;
          }
          continue;
        }
      }

      if (e.def.id === 'shade' && !held && !e.engaged) {
        e.specialT -= dt;
        if (e.specialT <= 0) {
          e.specialT = 4.2 + this.rng() * 2;
          const fromX = e.x, fromZ = e.z;
          e.dist = Math.min(e.road.length - 2, e.dist + 5.5);
          this.placeEnemy(e);
          this.events.push({ e: 'blink', fromX, fromZ, x: e.x, z: e.z });
        }
      } else if (e.def.id === 'mireshaman' && !held) {
        e.specialT -= dt;
        if (e.specialT <= 0) {
          e.specialT = 2.6;
          let healed = false;
          for (const o of this.enemies) {
            if (o.dead || o === e || o.hp >= o.maxHp) continue;
            if (dist2(o.x, o.z, e.x, e.z) < 36) {
              o.hp = Math.min(o.maxHp, o.hp + o.maxHp * 0.09);
              healed = true;
            }
          }
          if (healed) this.events.push({ e: 'heal', x: e.x, z: e.z, radius: 6 });
        }
      } else if (e.def.ability && e.def.ability !== 'rebirth' && !held) {
        e.specialT -= dt;
        if (e.specialT <= 0) this.useBossAbility(e, e.def.ability);
      }
      this.placeEnemy(e);
    }
  }

  private useBossAbility(e: Enemy, ability: BossAbility) {
    const skill = (radius: number) => this.events.push({ e: 'bossSkill', kind: ability, enemy: e, x: e.x, z: e.z, radius });
    if (ability === 'slam') {
      const hit = this.units.filter((u) => !u.dead && dist2(u.x, u.z, e.x, e.z) < 5 * 5);
      if (!hit.length) {
        e.specialT = 0.5;
        return;
      }
      e.specialT = 6;
      e.attackAt = this.time;
      const dmg = e.def.attack * 0.8 * (e.elite ? 1.6 : 1) * (1 + Math.max(0, this.wave - 1) * 0.05);
      for (const u of hit) this.hurtUnit(u, dmg);
      skill(5);
    } else if (ability === 'brood') {
      e.specialT = 7;
      const road = this.world.roads.indexOf(e.road);
      if (road < 0 || this.enemies.length > 150) return;
      for (let i = 0; i < 3; i++) {
        const c = this.spawn('gloomling', false, road, Math.max(0, e.dist - 1.2 + i * 0.6));
        c.bounty *= 0.4;
      }
      skill(3);
    } else if (ability === 'ward') {
      e.specialT = 8;
      e.shield = Math.max(e.shield, e.maxHp * 0.15);
      skill(2.5);
    } else if (ability === 'charge') {
      e.specialT = 7;
      e.hasteT = 1.1;
      e.hasteMult = 2.8;
      e.engaged = null;
      skill(3);
    } else if (ability === 'gale') {
      e.specialT = 7;
      for (const o of this.enemies) {
        if (o.dead || o.def.ability === 'charge' || dist2(o.x, o.z, e.x, e.z) > 8 * 8) continue;
        o.hasteT = Math.max(o.hasteT, 3);
        o.hasteMult = 1.5;
      }
      skill(8);
    }
  }

  private stepTowers(dt: number) {
    for (const t of this.towers) {
      const s = t.stats;
      if (s.beam) {
        this.stepBeam(t, dt);
        continue;
      }
      if (s.garrison) {
        this.stepGarrison(t, dt);
        continue;
      }
      if (s.roots) {
        t.rootT -= dt;
        if (t.rootT <= 0) {
          t.rootT = s.roots.every;
          const candidates = this.enemies.filter((e) => !e.dead && !e.flying && dist2(e.x, e.z, t.x, t.z) < t.range * t.range);
          // Roots favor whoever is furthest along the road.
          candidates.sort((a, b) => b.dist / b.road.length - a.dist / a.road.length);
          for (let i = 0; i < Math.min(s.roots.count, candidates.length); i++) {
            const e = candidates[i];
            e.rootT = Math.max(e.rootT, e.def.boss ? s.roots.dur * 0.4 : s.roots.dur);
            e.poisonDps = Math.max(e.poisonT > 0 ? e.poisonDps : 0, s.roots.dps * t.damageMult);
            e.poisonTower = t;
            e.poisonT = Math.max(e.poisonT, s.roots.dur + 2);
            this.events.push({ e: 'root', x: e.x, z: e.z, enemy: e });
          }
          if (candidates.length) t.firedAt = this.time;
        }
      }
      if (!s.rate) continue;
      t.cooldown -= dt;
      if (t.cooldown > 0) continue;
      let best: Enemy | null = null;
      let bestR = -Infinity;
      for (let i = 0; i < this.enemies.length; i++) {
        const e = this.enemies[i];
        if (!this.inRange(t, e)) continue;
        const r = this.rankTarget(t, e);
        if (r > bestR) { bestR = r; best = e; }
      }
      if (best) {
        this.fire(t, best);
        t.cooldown = 1 / (s.rate * t.rateMult);
      }
    }
  }

  private stepProjectiles(dt: number) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      if (p.kind === 'shell') {
        p.t += dt / p.dur;
        const k = Math.min(1, p.t);
        p.x = p.sx + (p.tx - p.sx) * k;
        p.z = p.sz + (p.tz - p.sz) * k;
        if (p.t >= 1) {
          this.hitStats(p.stats, p.tower, p.tx, p.tz, null, p.damage, p.crit, p.kind);
          this.projectiles.splice(i, 1);
        }
        continue;
      }
      const tgt = p.target;
      if (tgt && !tgt.dead) {
        p.tx = tgt.x;
        p.tz = tgt.z;
      }
      const dx = p.tx - p.x, dz = p.tz - p.z;
      const d = Math.hypot(dx, dz);
      const step = p.speed * dt;
      if (d <= step + 0.15) {
        p.x = p.tx;
        p.z = p.tz;
        if (tgt && !tgt.dead) {
          this.hitStats(p.stats, p.tower, p.tx, p.tz, tgt, p.damage, p.crit, p.kind);
        } else if (p.stats.splash) {
          this.hitStats(p.stats, p.tower, p.tx, p.tz, null, p.damage, p.crit, p.kind);
        }
        this.projectiles.splice(i, 1);
        continue;
      }
      p.x += (dx / d) * step;
      p.z += (dz / d) * step;
      p.t = 1 - Math.min(1, d / p.total);
    }
  }

  private stepPools(dt: number) {
    for (let i = this.pools.length - 1; i >= 0; i--) {
      const p = this.pools[i];
      p.t -= dt;
      if (p.t <= 0) {
        this.pools.splice(i, 1);
        continue;
      }
      const r2 = p.radius * p.radius;
      for (let j = 0; j < this.enemies.length; j++) {
        const e = this.enemies[j];
        if (e.dead || e.flying) continue;
        if (dist2(e.x, e.z, p.x, p.z) < r2) this.damage(e, p.dps * dt, p.type, { silent: true });
      }
    }
  }

  starsEarned() {
    const r = this.lives / this.maxLives;
    return r >= 0.9 ? 3 : r >= 0.5 ? 2 : 1;
  }
}
