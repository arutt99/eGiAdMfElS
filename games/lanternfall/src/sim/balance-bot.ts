// Headless playtester. Plays every map on every difficulty with a simple, human-like build order.
// It uses spells and the hero in a simple way, and never reads ahead, so skilled players will do better.
// Beyond the plain campaign it also checks the things that keep the game fair: that one tower type
// can't carry a map alone, that no new tower or hero is out of line, and that the tech tree helps without breaking it.
import { MAPS, type MapDef } from '../data/maps';
import { DIFFICULTY, ENDLESS_WAVES_PER_STARLIGHT, FIRST_CLEAR_BONUS, META, type Difficulty, type HeroId, type MetaRanks } from '../data/meta';
import { TOWERS, towerStats, TOWER_ORDER, type TowerId } from '../data/towers';
import { ENEMIES, type EnemyId } from '../data/enemies';
import { Game, parseWave } from './game';
import { dist2 } from '../core/util';

declare const process: { env: Record<string, string | undefined> };

interface Spot { x: number; z: number; score: number }

function coverage(game: Game, x: number, z: number, range: number, air: boolean) {
  let n = 0;
  const roads = air ? [...game.world.roads, ...game.world.airRoads] : game.world.roads;
  for (const road of roads) {
    for (let i = 0; i < road.count; i += 4) {
      if (dist2(road.pts[i * 2], road.pts[i * 2 + 1], x, z) < range * range) n++;
    }
  }
  return n;
}

function spots(game: Game, type: TowerId): Spot[] {
  const s = towerStats(type, 0, 0);
  const out: Spot[] = [];
  const w = game.world;
  for (let x = -w.halfW; x <= w.halfW; x += 2) {
    for (let z = -w.halfH; z <= w.halfH; z += 2) {
      if (game.placementProblem(x, z, type)) continue;
      out.push({ x, z, score: coverage(game, x, z, s.range, s.air) });
    }
  }
  return out.sort((a, b) => b.score - a.score);
}

const BUILD_ORDER: TowerId[] = ['roost', 'mortar', 'spire', 'roost', 'mortar', 'spire', 'sunforge', 'shrine', 'mortar', 'spire', 'roost', 'sunforge', 'mortar', 'spire'];
const BRANCH: Record<TowerId, number> = { roost: 0, spire: 0, mortar: 1, shrine: 0, sunforge: 1, ballista: 0, blightwell: 1, thunderbell: 0, barracks: 0 };

/** Casts ready spells on the enemy furthest along, and keeps the hero on the front line. */
function useActives(game: Game) {
  if (!game.enemies.length) return;
  let lead = game.enemies[0];
  let best = -1;
  for (const e of game.enemies) {
    const k = e.dist / e.road.length;
    if (k > best) {
      best = k;
      lead = e;
    }
  }
  if (game.enemies.length >= 4 || game.lives < game.maxLives) {
    for (const id of ['starfall', 'winter', 'guards', 'hex', 'rift', 'rally', 'golden'] as const) {
      if (game.isSpellUnlocked(id) && game.spellCd[id] <= 0) game.castSpell(id, lead.x, lead.z);
    }
  }
  const hero = game.hero;
  if (!hero.dead) {
    if (!lead.flying) game.moveHero(lead.x, lead.z);
    const near = game.enemies.some((e) => dist2(e.x, e.z, hero.x, hero.z) < 25);
    if (near) {
      game.useAbility(0);
      game.useAbility(2);
    }
    const def = game.heroDef.abilities[1].effect;
    if (def.kind === 'mark' ? near : hero.hp < hero.maxHp * 0.5) game.useAbility(1);
  }
}

interface BotOpts {
  meta?: MetaRanks;
  cleared?: number;
  skill?: number;
  order?: TowerId[];
  hero?: HeroId;
  seed?: number;
  /** Forces every upgrade down this branch, instead of the bot's usual pick. */
  branch?: number;
  /** Stops building at this many towers per road and spends everything on upgrades, as most players do. */
  capPerRoad?: number;
}

export function playBot(map: MapDef, difficulty: Difficulty, o: BotOpts = {}) {
  const game = new Game({ map, difficulty, endless: false, meta: o.meta ?? {}, cleared: o.cleared ?? map.index, hero: o.hero, seed: o.seed });
  const order = o.order ?? BUILD_ORDER;
  const skill = o.skill ?? 1;
  const branchOf = (t: TowerId) => o.branch ?? BRANCH[t];
  let orderIdx = 0;
  let thinkT = 0;
  const dt = 1 / 30;
  let steps = 0;
  const debug = process.env.DEBUG_WAVES === map.id && difficulty === 'normal' && !o.order && !o.hero;
  game.callNextWave();
  while (game.state === 'playing' && steps < 30 * 60 * 40) {
    steps++;
    const before = game.lives, wavesBefore = game.wave;
    game.step(dt);
    if (debug) {
      if (game.lives !== before) {
        const leak = game.enemies.filter((e) => e.dist > e.road.length - 3).map((e) => e.def.id).join(',');
        console.log('t', game.time.toFixed(0), 'wave', game.wave, 'lives', game.lives, 'towers', game.towers.map((t) => t.type[0] + t.level).join(' '), 'near', leak);
      }
      if (game.wave !== wavesBefore) console.log('--- wave', game.wave, 'gold', Math.round(game.gold));
    }
    game.events.length = 0;
    thinkT -= dt;
    if (thinkT > 0) continue;
    thinkT = 1.5 / skill;
    useActives(game);
    // Upgrade before expanding once a basic defense exists.
    const upgradable = game.towers
      .filter((t) => t.level < 3 && t.stats.damage + (t.stats.aura || t.stats.garrison ? 40 : 0) > 0)
      .sort((a, b) => a.level - b.level);
    const next = upgradable[0];
    if (o.capPerRoad && game.towers.length >= 6 + o.capPerRoad * game.world.roads.length) {
      if (next && game.gold >= game.upgradeCost(next, branchOf(next.type))) game.upgrade(next, branchOf(next.type));
      continue;
    }
    if (game.towers.length >= 6 && next && game.gold >= game.upgradeCost(next, branchOf(next.type)) && orderIdx % 2 === 0) {
      game.upgrade(next, branchOf(next.type));
      orderIdx++;
      continue;
    }
    let type = order[orderIdx % order.length];
    if (!game.isTowerUnlocked(type)) {
      orderIdx++;
      type = order[orderIdx % order.length];
      if (!game.isTowerUnlocked(type)) continue;
    }
    if (game.gold >= game.costOf(towerStats(type, 0, 0))) {
      const list = spots(game, type);
      if (list.length) {
        game.build(type, list[0].x, list[0].z);
        orderIdx++;
      } else if (next && game.gold >= game.upgradeCost(next, branchOf(next.type))) {
        game.upgrade(next, branchOf(next.type));
      }
    } else if (next && game.towers.length >= 12 && game.gold >= game.upgradeCost(next, branchOf(next.type))) {
      game.upgrade(next, branchOf(next.type));
    }
  }
  const dealt: Partial<Record<TowerId, number>> = {};
  const count: Partial<Record<TowerId, number>> = {};
  for (const t of game.towers) {
    dealt[t.type] = (dealt[t.type] ?? 0) + t.dealt;
    count[t.type] = (count[t.type] ?? 0) + 1;
  }
  return {
    state: game.state,
    lives: game.lives,
    maxLives: game.maxLives,
    wave: game.wave,
    total: game.totalWaves,
    towers: game.towers.length,
    levels: game.towers.map((t) => t.level).sort().join(''),
    gold: Math.round(game.gold),
    minutes: +(game.time / 60).toFixed(1),
    dealt,
    count,
    invested: game.towers.reduce((sum, t) => sum + t.invested, 0),
  };
}

const SEEDS = [1234, 77, 4242];

/** Plays a setup on several seeds, and summarizes it as wins and average light left. */
function trial(map: MapDef, diff: Difficulty, o: BotOpts = {}) {
  let wins = 0, frac = 0, wave = 0;
  for (const seed of SEEDS) {
    const r = playBot(map, diff, { ...o, seed });
    if (r.state === 'won') wins++;
    frac += r.lives / r.maxLives;
    wave += r.wave;
  }
  const total = map.waves.length;
  return `${wins}/${SEEDS.length} ${wins === SEEDS.length ? `${Math.round((frac / SEEDS.length) * 100)}%` : `w${Math.round(wave / SEEDS.length)}/${total}`}`;
}

const section = (title: string) => console.log(`\n=== ${title} ===`);
const ONLY = process.env.ONLY;
const wants = (name: string) => !ONLY || ONLY.split(',').includes(name);

// The tree as a typical player might have it by each chapter. Starlight comes to about 8 per map on Normal.
const metaByMap: MetaRanks[] = [
  {},
  { towerDamage: 1, techBallista: 1, startGold: 1 },
  { towerDamage: 2, techBallista: 1, startGold: 2, spellCooldown: 1, heroDamage: 1, techBlightwell: 1 },
  { towerDamage: 2, techBallista: 1, startGold: 2, spellCooldown: 1, heroDamage: 1, techBlightwell: 1, towerRange: 1, towerRate: 1, spellRadius: 1, spellHex: 1 },
  { towerDamage: 3, techBallista: 1, startGold: 3, spellCooldown: 1, heroDamage: 1, techBlightwell: 1, towerRange: 1, towerRate: 2, spellRadius: 1, spellHex: 1, techThunderbell: 1, bounty: 1 },
  { towerDamage: 3, techBallista: 1, startGold: 3, spellCooldown: 2, heroDamage: 2, heroHealth: 1, techBlightwell: 1, towerRange: 2, towerRate: 2, spellRadius: 1, spellHex: 1, techThunderbell: 1, techBarracks: 1, bounty: 2, tithe: 1 },
];
const WITH_NEW: TowerId[] = ['roost', 'mortar', 'spire', 'ballista', 'mortar', 'spire', 'blightwell', 'sunforge', 'shrine', 'thunderbell', 'barracks', 'spire', 'ballista', 'sunforge'];
const ALL_TECH = Object.fromEntries(META.map((m) => [m.id, m.max])) as MetaRanks;
const TOWER_TECH = { techBallista: 1, techBlightwell: 1, techThunderbell: 1, techBarracks: 1 } as MetaRanks;

if (wants('campaign')) {
  section('Campaign: wins out of 3 seeds, then average light left, or average wave reached');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    for (const diff of ['easy', 'normal', 'hard'] as Difficulty[]) {
      rows.push({
        map: map.name,
        diff,
        'no tree': trial(map, diff),
        'typical tree': trial(map, diff, { meta: metaByMap[map.index], order: WITH_NEW }),
        'full tree': trial(map, diff, { meta: ALL_TECH, order: WITH_NEW, cleared: 6 }),
      });
    }
  }
  console.table(rows);
}

if (wants('mono')) {
  section('One tower type only, on Normal. These should do clearly worse than a mix');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    const row: Record<string, unknown> = { map: map.name, mix: trial(map, 'normal', { meta: TOWER_TECH, cleared: 6, order: WITH_NEW }) };
    for (const t of TOWER_ORDER) {
      if (t === 'shrine') continue;
      row[t] = trial(map, 'normal', { meta: TOWER_TECH, cleared: 6, order: [t] });
    }
    rows.push(row);
  }
  console.table(rows);
}

const UPGRADER = { capPerRoad: 3 };

if (wants('upgrader')) {
  section('Campaign again, for a bot that stops at a modest tower count and upgrades to the top');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    for (const diff of ['easy', 'normal', 'hard'] as Difficulty[]) {
      rows.push({
        map: map.name,
        diff,
        'no tree': trial(map, diff, UPGRADER),
        'typical tree': trial(map, diff, { ...UPGRADER, meta: metaByMap[map.index], order: WITH_NEW }),
      });
    }
  }
  console.table(rows);
}

if (wants('branches')) {
  section('One tower type only, fully upgraded down each path, on Normal. These should do clearly worse than a mix');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    const row: Record<string, unknown> = { map: map.name, mix: trial(map, 'normal', { ...UPGRADER, meta: TOWER_TECH, cleared: 6, order: WITH_NEW }) };
    for (const t of ['roost', 'spire', 'sunforge', 'ballista'] as TowerId[]) {
      for (const branch of [0, 1]) row[towerStats(t, 3, branch).name] = trial(map, 'normal', { ...UPGRADER, meta: TOWER_TECH, cleared: 6, order: [t], branch });
    }
    rows.push(row);
  }
  console.table(rows);
}

if (wants('heroes')) {
  section('Each hero, no tree other than the hero, on Normal');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    rows.push({
      map: map.name,
      ember: trial(map, 'normal', {}),
      sable: trial(map, 'normal', { hero: 'sable', meta: { heroSable: 1 } }),
      oakheart: trial(map, 'normal', { hero: 'oakheart', meta: { heroOakheart: 1 } }),
      'ember+ult': trial(map, 'normal', { meta: { heroUltimate: 1 } }),
      'sable+ult': trial(map, 'normal', { hero: 'sable', meta: { heroSable: 1, heroUltimate: 1 } }),
      'oak+ult': trial(map, 'normal', { hero: 'oakheart', meta: { heroOakheart: 1, heroUltimate: 1 } }),
    });
  }
  console.table(rows);
}

if (wants('towers')) {
  section('Adding one new tower to the mix, on Hard. Should help without one being far ahead');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    const row: Record<string, unknown> = { map: map.name, base: trial(map, 'hard', { cleared: 6 }) };
    for (const t of ['ballista', 'blightwell', 'thunderbell', 'barracks'] as TowerId[]) {
      row[t] = trial(map, 'hard', { cleared: 6, meta: TOWER_TECH, order: ['roost', 'mortar', 'spire', t, 'mortar', 'spire', 'sunforge', 'shrine', t, 'spire', 'roost', 'sunforge', t, 'spire'] });
    }
    rows.push(row);
  }
  console.table(rows);

  section('Damage per gold invested, per tower type, over the whole campaign on Normal');
  const dealt: Partial<Record<TowerId, number>> = {};
  const count: Partial<Record<TowerId, number>> = {};
  for (const map of MAPS) {
    const r = playBot(map, 'normal', { cleared: 6, meta: TOWER_TECH, order: WITH_NEW });
    for (const k of Object.keys(r.dealt) as TowerId[]) {
      dealt[k] = (dealt[k] ?? 0) + r.dealt[k]!;
      count[k] = (count[k] ?? 0) + r.count[k]!;
    }
  }
  console.table(TOWER_ORDER.map((t) => ({ tower: TOWERS[t].name, built: count[t] ?? 0, 'damage per tower': Math.round((dealt[t] ?? 0) / Math.max(1, count[t] ?? 0)) })));
}

if (wants('waves')) {
  section('Share of each map\'s enemy health that each damage type can reach at full strength');
  const rows: Record<string, unknown>[] = [];
  for (const map of MAPS) {
    const types = ['pierce', 'blast', 'arcane', 'fire', 'venom'] as const;
    const sum = { pierce: 0, blast: 0, arcane: 0, fire: 0, venom: 0 };
    let total = 0;
    for (const script of map.waves) {
      for (const s of parseWave(script, map.paths.length)) {
        const def = ENEMIES[s.type as EnemyId];
        total += def.hp;
        for (const t of types) sum[t] += def.hp * (1 - (def.resist[t] ?? 0));
      }
    }
    const row: Record<string, unknown> = { map: map.name };
    for (const t of types) row[t] = `${Math.round((sum[t] / total) * 100)}%`;
    rows.push(row);
  }
  console.table(rows);
}

if (wants('tree')) {
  section('Tech tree');
  const total = META.reduce((s, m) => s + m.costs.reduce((a, b) => a + b, 0), 0);
  const stars = (d: Difficulty) => MAPS.length * 3 * DIFFICULTY[d].reward;
  const normal = stars('normal') + MAPS.length * FIRST_CLEAR_BONUS;
  const all = stars('easy') + stars('normal') + stars('hard') + MAPS.length * FIRST_CLEAR_BONUS;
  const wavesLeft = Math.ceil(Math.max(0, total - all) / MAPS.length) * ENDLESS_WAVES_PER_STARLIGHT;
  console.log(`The whole tree costs ${total} Starlight. Three stars on every map earn ${normal} on Normal, ${all} across all difficulties. The rest takes Endless wave ${wavesLeft} on every map.`);
}

if (wants('endless')) {
  section('Endless: difficulty must keep climbing, and the bot should eventually lose');
  for (const [label, meta, upgrader] of [['mass-building, no tree', {}, false], ['upgrading, full tree', ALL_TECH, true]] as const) for (const map of [MAPS[0], MAPS[3]]) {
    const game = new Game({ map, difficulty: 'normal', endless: true, meta, cleared: 6 });
    let steps = 0;
    let orderIdx = 0;
    game.callNextWave();
    while (game.state === 'playing' && steps < 30 * 60 * 90) {
      steps++;
      game.step(1 / 30);
      game.events.length = 0;
      if (steps % 45 !== 0) continue;
      if (upgrader) useActives(game);
      const next = game.towers.filter((t) => t.level < 3 && t.stats.damage > 0).sort((a, b) => a.level - b.level)[0];
      if (upgrader && game.towers.length >= 6 + UPGRADER.capPerRoad * game.world.roads.length) {
        if (next && game.gold >= game.upgradeCost(next, BRANCH[next.type])) game.upgrade(next, BRANCH[next.type]);
        continue;
      }
      if (next && game.towers.length >= 8 && game.gold >= game.upgradeCost(next, 0)) {
        game.upgrade(next, BRANCH[next.type]);
        continue;
      }
      const type = BUILD_ORDER[orderIdx % BUILD_ORDER.length];
      if (game.gold >= game.costOf(towerStats(type, 0, 0))) {
        const list = spots(game, type);
        if (list.length) { game.build(type, list[0].x, list[0].z); orderIdx++; }
      }
    }
    console.log(`Endless on ${map.name}, ${label}: reached wave ${game.wave} (${game.state}), ${game.towers.length} towers, ${(game.time / 60).toFixed(1)} min`);
  }
}
