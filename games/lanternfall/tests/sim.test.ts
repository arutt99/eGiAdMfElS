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
