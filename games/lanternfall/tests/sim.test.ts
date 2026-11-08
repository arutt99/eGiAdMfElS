// Headless checks of the battle simulation: barracks bonuses and saving a battle between waves.
import test from 'node:test';
import assert from 'node:assert/strict';
import { MAPS } from '../src/data/maps';
import type { MetaRanks } from '../src/data/meta';
import { towerStats, type TowerId } from '../src/data/towers';
import { dist2 } from '../src/core/util';
import { Game, type BattleSnapshot, type Tower } from '../src/sim/game';

const MAP = MAPS[0];
const UNLOCKED: MetaRanks = { techBarracks: 1 };

/** The first open spot for a tower, scanning the map in a fixed order, optionally within reach of a point. */
function spot(g: Game, type: TowerId, near?: { x: number; z: number; r: number }) {
  const w = g.world;
  for (let x = -w.halfW; x <= w.halfW; x += 1) {
    for (let z = -w.halfH; z <= w.halfH; z += 1) {
      if (near && dist2(x, z, near.x, near.z) > near.r * near.r) continue;
      if (!g.placementProblem(x, z, type)) return { x, z };
    }
  }
  throw new Error(`No room for ${type}`);
}

/** Plays until the barracks' soldiers land a blow, and reports its size and the soldier's next cooldown. */
function firstSoldierHit(meta: MetaRanks, withShrine: boolean) {
  const g = new Game({ map: MAP, difficulty: 'normal', endless: false, meta: { ...UNLOCKED, ...meta }, cleared: 6, seed: 7 });
  g.setGold(99999);
  const at = spot(g, 'barracks');
  const barracks = g.build('barracks', at.x, at.z)!;
  if (withShrine) assert.ok(g.build('shrine', ...Object.values(spot(g, 'shrine', { x: at.x, z: at.z, r: towerStats('shrine', 0, 0).range - 0.5 })) as [number, number]));
  // Keep the hero away so only the barracks can be credited with a hit.
  g.hero.dead = true;
  g.heroRespawnT = Infinity;
  let hit = 0;
  const damage = g.damage.bind(g);
  g.damage = (e, amount, type, opts = {}) => {
    if (!hit && opts.tower === barracks) hit = amount;
    damage(e, amount, type, opts);
  };
  g.callNextWave();
  for (let i = 0; i < 60 * 240 && !hit; i++) g.step(1 / 60);
  assert.ok(hit > 0, 'the soldiers never attacked');
  const soldier = g.units.find((u) => u.owner === barracks && u.attackAt === g.time)!;
  return { hit, cooldown: soldier.cooldown, tower: barracks as Tower };
}

test('barracks soldiers deal the Tech Tree damage bonus', () => {
  const base = firstSoldierHit({}, false);
  const boosted = firstSoldierHit({ towerDamage: 5 }, false);
  assert.ok(Math.abs(boosted.hit / base.hit - 1.15) < 1e-6, `expected +15%, got ${boosted.hit / base.hit}`);
});

test('barracks soldiers attack faster with the Tech Tree rate bonus', () => {
  const base = firstSoldierHit({}, false);
  const boosted = firstSoldierHit({ towerRate: 4 }, false);
  assert.ok(Math.abs(base.cooldown / boosted.cooldown - 1.1) < 0.02, `expected 10% faster, got ${base.cooldown / boosted.cooldown}`);
});

test('a Grove Shrine boosts barracks soldiers like any other tower', () => {
  const base = firstSoldierHit({}, false);
  const blessed = firstSoldierHit({}, true);
  assert.ok(Math.abs(blessed.tower.damageMult - 1.12) < 1e-6);
  assert.ok(Math.abs(blessed.hit / base.hit - 1.12) < 1e-6, `expected +12%, got ${blessed.hit / base.hit}`);
});

/** A battle a few waves in, with a mix of towers, sitting between waves. */
function battleInProgress(endless = false) {
  const g = new Game({ map: MAP, difficulty: 'normal', endless, meta: UNLOCKED, cleared: 6, seed: 11 });
  g.setGold(5000);
  for (const type of ['roost', 'mortar', 'barracks', 'spire'] as TowerId[]) {
    const at = spot(g, type);
    const t = g.build(type, at.x, at.z)!;
    g.upgrade(t);
  }
  g.towers[0].mode = 'strong';
  for (let wave = 0; wave < 3; wave++) {
    assert.ok(g.callNextWave());
    let i = 0;
    while (!g.betweenWaves && i++ < 60 * 600) g.step(1 / 60);
    assert.ok(g.betweenWaves, `wave ${wave + 1} never cleared`);
  }
  return g;
}

const strip = (s: BattleSnapshot) => JSON.parse(JSON.stringify(s));

test('a battle saved between waves comes back exactly', () => {
  for (const endless of [false, true]) {
    const g = battleInProgress(endless);
    const snap = strip(g.serialize());
    const back = Game.restore(MAP, snap);
    assert.deepEqual(strip(back.serialize()), snap);
    assert.equal(back.towers.length, 4);
    const barracks = back.towers.find((t) => t.type === 'barracks')!;
    assert.equal(barracks.squad.length, snap.towers.find((t: { type: string }) => t.type === 'barracks').squad.length);
    assert.ok(back.betweenWaves);
  }
});

test('a restored battle keeps the same random rolls', () => {
  const g = battleInProgress(true);
  const back = Game.restore(MAP, strip(g.serialize()));
  // The next Endless waves are rolled from the saved seed, so both battles must face the same foes.
  assert.equal(back.scriptFor(g.wave + 3), g.scriptFor(g.wave + 3));
});

test('calling a wave keeps a checkpoint of the moment before', () => {
  const g = battleInProgress();
  const gold = g.gold;
  g.callNextWave();
  assert.ok(g.checkpoint);
  assert.equal(g.checkpoint!.wave, g.wave - 1);
  assert.equal(g.checkpoint!.gold, gold);
  const back = Game.restore(MAP, strip(g.checkpoint!));
  assert.equal(back.wave, g.wave - 1);
  assert.ok(back.canCallWave);
});

// ---------- Damage bonuses and statistics ----------

/** A fresh battle with every tower unlocked and plenty of gold. */
function sandbox(meta: MetaRanks = {}, endless = false) {
  const g = new Game({ map: MAP, difficulty: 'normal', endless, meta: { techBarracks: 1, ...meta }, cleared: 6, seed: 5 });
  g.setGold(999999);
  return g;
}

/** Builds a tower and upgrades it to the top, along the branch that has the given feature if any. */
function topTower(g: Game, type: TowerId, want?: (b: number) => boolean) {
  const at = spot(g, type);
  const t = g.build(type, at.x, at.z)!;
  const branch = [0, 1].find((b) => !want || want(b)) ?? 0;
  while (t.level < 3) assert.ok(g.upgrade(t, branch));
  return t;
}

/** Plays until the tower deals damage of its own, and returns the first amount it was credited with. */
function firstHitBy(g: Game, t: Tower, filter: (type: string, silent: boolean) => boolean = () => true) {
  g.hero.dead = true;
  g.heroRespawnT = Infinity;
  let hit = 0;
  const damage = g.damage.bind(g);
  g.damage = (e, amount, type, opts = {}) => {
    if (!hit && opts.tower === t && filter(type, !!opts.silent)) hit = amount;
    damage(e, amount, type, opts);
  };
  g.callNextWave();
  for (let i = 0; i < 60 * 240 && !hit; i++) g.step(1 / 60);
  assert.ok(hit > 0, `${t.type} never dealt damage`);
  return hit;
}

test('Masterwork boosts the Sunforge beam and Barracks soldiers', () => {
  for (const type of ['sunforge', 'barracks', 'roost'] as TowerId[]) {
    const plain = sandbox();
    const base = firstHitBy(plain, topTower(plain, type));
    const crafted = sandbox({ masterwork: 1 });
    const boosted = firstHitBy(crafted, topTower(crafted, type));
    assert.ok(Math.abs(boosted / base - 1.1) < 1e-6, `${type}: expected +10%, got ${boosted / base}`);
  }
});

test('mortar fire pools are credited to the mortar that made them', () => {
  const g = sandbox();
  const mortar = topTower(g, 'mortar', (b) => !!towerStats('mortar', 3, b).pool);
  assert.ok(mortar.stats.pool);
  assert.ok(firstHitBy(g, mortar, (type, silent) => type === 'fire' && silent) > 0);
});

/** Plays until an enemy is on the road. */
function firstEnemy(g: Game) {
  g.hero.dead = true;
  g.heroRespawnT = Infinity;
  g.callNextWave();
  for (let i = 0; i < 600 && !g.enemies.length; i++) g.step(1 / 60);
  return g.enemies[0];
}

test('tower statistics leave out overkill', () => {
  const g = sandbox();
  const t = topTower(g, 'roost');
  const e = firstEnemy(g);
  e.hp = 10;
  e.shield = 0;
  g.damage(e, 500, 'pierce', { tower: t, trueHit: true });
  assert.ok(e.dead);
  assert.equal(t.dealt, 10);
});

test('Sundering Hex adds the advertised 35% even against resisted damage', () => {
  const g = sandbox();
  const e = firstEnemy(g);
  e.def = { ...e.def, resist: { pierce: 0.8 } };
  e.shield = 0;
  e.hp = e.maxHp = 1e9;
  const hitFor = () => { const before = e.hp; g.damage(e, 100, 'pierce', { silent: true }); return before - e.hp; };
  const plain = hitFor();
  e.vuln = 0.35;
  e.vulnT = 8;
  const hexed = hitFor();
  assert.ok(Math.abs(plain - 20) < 1e-6);
  assert.ok(Math.abs(hexed / plain - 1.35) < 1e-6, `expected +35%, got ${hexed / plain}`);
});

// ---------- Endless rewards ----------

/** Lets every enemy on the road reach the lantern, with the lantern at one life. */
function loseCurrentWave(g: Game) {
  g.lives = 1;
  for (let i = 0; i < 60 * 600 && g.state === 'playing'; i++) g.step(1 / 60);
  assert.equal(g.state, 'lost');
}

test('Endless counts only waves fought to the end', () => {
  const g = sandbox({}, true);
  firstEnemy(g);
  loseCurrentWave(g);
  assert.equal(g.wave, 1);
  assert.equal(g.wavesCompleted, 0, 'dying in wave 1 completes nothing');

  const h = sandbox({}, true);
  h.hero.dead = true;
  h.heroRespawnT = Infinity;
  for (let w = 0; w < 5; w++) {
    h.callNextWave();
    for (let i = 0; i < 60 * 600 && !h.betweenWaves; i++) {
      h.step(1 / 60);
      for (const e of h.enemies) h.damage(e, 1e9, 'pierce', { trueHit: true, silent: true });
    }
  }
  assert.equal(h.wavesCompleted, 5);
  h.callNextWave();
  for (let i = 0; i < 600 && !h.enemies.length; i++) h.step(1 / 60);
  loseCurrentWave(h);
  assert.equal(h.wave, 6);
  assert.equal(h.wavesCompleted, 5, 'reaching wave 6 is not finishing it');
});
