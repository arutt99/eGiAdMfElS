import type { MetaId } from './meta';

export type TowerId = 'roost' | 'spire' | 'mortar' | 'shrine' | 'sunforge' | 'ballista' | 'blightwell' | 'thunderbell' | 'barracks';
/** The five schools of tower damage. Every enemy resists some and is weak to others. */
export type DamageType = 'pierce' | 'blast' | 'arcane' | 'fire' | 'venom';
/** Spells and some hero powers use radiant damage, which only bosses resist. */
export type AttackType = DamageType | 'radiant';
export type ProjectileKind = 'arrow' | 'orb' | 'shell' | 'shard' | 'bolt' | 'glob' | 'none';

export const DAMAGE_TYPES: Record<AttackType, { label: string; color: string; blurb: string }> = {
  pierce: { label: 'Pierce', color: '#ffd9b0', blurb: 'Arrows and bolts. Armor turns them aside.' },
  blast: { label: 'Blast', color: '#ff9f5a', blurb: 'Shells and shockwaves. Good against crowds, poor against plate.' },
  arcane: { label: 'Arcane', color: '#c2a6ff', blurb: 'Raw magic. Passes through armor, but warded creatures shrug it off.' },
  fire: { label: 'Fire', color: '#ffb84a', blurb: 'Burning light. Banishes spirits and scorches moths.' },
  venom: { label: 'Venom', color: '#9fe86a', blurb: 'Poison that eats flesh over time. Useless on the bloodless.' },
  radiant: { label: 'Radiant', color: '#fff0c0', blurb: 'Pure lantern light. Almost nothing resists it.' },
};
export const DAMAGE_ORDER: DamageType[] = ['pierce', 'blast', 'arcane', 'fire', 'venom'];

export interface TowerStats {
  name: string;
  desc: string;
  cost: number;
  range: number;
  damage: number;
  /** Attacks per second. */
  rate: number;
  dmgType: DamageType;
  air: boolean;
  ground: boolean;
  projectile: ProjectileKind;
  projSpeed: number;
  splash?: number;
  multishot?: number;
  chain?: number;
  slow?: number;
  slowDur?: number;
  freezeChance?: number;
  freezeDur?: number;
  stun?: number;
  shred?: number;
  pool?: { dps: number; dur: number; radius: number };
  crit?: number;
  critMult?: number;
  armorPierce?: number;
  /** Continuous beam tower. `damage` is base DPS; ramps up to damage*(1+ramp) over rampTime. */
  beam?: { ramp: number; rampTime: number; mode: 'single' | 'split' | 'line'; targets: number };
  /** Support aura applied to nearby towers. */
  aura?: { damage: number; range: number };
  goldPerWave?: number;
  /** Periodic roots from the Thornroot branch. */
  roots?: { every: number; count: number; dur: number; dps: number };
  /** Bolts that carry on through the target and strike everything in a line this wide. */
  lineShot?: number;
  /** Poison applied on hit. It does not stack, so spreading it around is what counts. */
  poison?: { dps: number; dur: number };
  /** Enemies hit take this much more damage of every type for a short time. */
  wither?: number;
  /** Strikes everything in range at once, instead of aiming at one target. */
  pulse?: boolean;
  /** Soldiers stationed on the nearest road. They come back after falling. */
  garrison?: { count: number; hp: number; damage: number; rate: number; respawn: number; blockCap: number };
}

export interface TowerDef {
  id: TowerId;
  name: string;
  role: string;
  hotkey: string;
  levels: [TowerStats, TowerStats];
  branches: [[TowerStats, TowerStats], [TowerStats, TowerStats]];
  /** Number of campaign maps that must be cleared before this tower is available. */
  unlockAfter: number;
  /** When set, the tower is bought in the tech tree instead of unlocking with the campaign. */
  tech?: MetaId;
}

const PIERCE = { dmgType: 'pierce' as const, air: true, ground: true };
const ARCANE = { dmgType: 'arcane' as const, air: true, ground: true };

const roostBase = { ...PIERCE, projectile: 'arrow' as const, projSpeed: 34 };
const spireBase = { ...ARCANE, projectile: 'orb' as const, projSpeed: 22 };
const mortarBase = { dmgType: 'blast' as const, air: false, ground: true, projectile: 'shell' as const, projSpeed: 0 };
const shrineBase = { dmgType: 'venom' as const, air: true, ground: true, projectile: 'none' as const, projSpeed: 0, damage: 0, rate: 0 };
const forgeBase = { dmgType: 'fire' as const, air: true, ground: true, projectile: 'none' as const, projSpeed: 0, rate: 0 };
const ballistaBase = { ...PIERCE, projectile: 'bolt' as const, projSpeed: 44 };
const blightBase = { dmgType: 'venom' as const, air: true, ground: true, projectile: 'glob' as const, projSpeed: 20 };
const bellBase = { dmgType: 'blast' as const, air: false, ground: true, projectile: 'none' as const, projSpeed: 0, pulse: true };
const barracksBase = { dmgType: 'pierce' as const, air: false, ground: true, projectile: 'none' as const, projSpeed: 0, damage: 0, rate: 0 };

export const TOWERS: Record<TowerId, TowerDef> = {
  roost: {
    id: 'roost', name: "Archer's Roost", role: 'Fast pierce damage. Hits air.', hotkey: '1', unlockAfter: 0,
    levels: [
      { ...roostBase, name: "Archer's Roost", desc: 'A watchful archer on a timber perch. Cheap, quick, reliable.', cost: 70, range: 11, damage: 13, rate: 1.3 },
      { ...roostBase, name: 'Fletcher\'s Roost', desc: 'Better bows and a higher perch.', cost: 85, range: 12.5, damage: 22, rate: 1.45 },
    ],
    branches: [
      [
        { ...roostBase, name: 'Hawkeye Aerie', desc: 'A lone marksman. Huge range, armor-piercing shots, and critical hits.', cost: 180, range: 18, damage: 66, rate: 0.62, armorPierce: 0.5, crit: 0.25, critMult: 2, projSpeed: 60 },
        { ...roostBase, name: 'Sky Sentinel', desc: 'Sees all. Its shots pierce nearly any armor.', cost: 320, range: 21, damage: 130, rate: 0.7, armorPierce: 0.75, crit: 0.35, critMult: 2.5, projSpeed: 70 },
      ],
      [
        { ...roostBase, name: 'Volley Lodge', desc: 'A whole hunting party. Looses three arrows at three targets.', cost: 170, range: 13, damage: 21, rate: 1.7, multishot: 3 },
        { ...roostBase, name: 'Arrowstorm Keep', desc: 'Five archers, one dark cloud of arrows.', cost: 310, range: 14, damage: 28, rate: 2.1, multishot: 5 },
      ],
    ],
  },
  spire: {
    id: 'spire', name: 'Arcane Spire', role: 'Arcane bolts that cut through armor.', hotkey: '2', unlockAfter: 0,
    levels: [
      { ...spireBase, name: 'Arcane Spire', desc: 'A focusing crystal that hurls arcane force through any armor.', cost: 100, range: 10, damage: 25, rate: 0.85 },
      { ...spireBase, name: 'Greater Spire', desc: 'A larger crystal and a deeper charge.', cost: 115, range: 11, damage: 42, rate: 0.9 },
    ],
    branches: [
      [
        { ...spireBase, name: 'Storm Spire', desc: 'Lightning leaps from enemy to enemy.', cost: 230, range: 12, damage: 50, rate: 0.85, chain: 4 },
        { ...spireBase, name: 'Tempest Spire', desc: 'A captive thunderhead. Chains through entire columns.', cost: 390, range: 13, damage: 82, rate: 0.95, chain: 7, stun: 0.2 },
      ],
      [
        { ...spireBase, name: 'Frost Spire', desc: 'Bursting ice shards slow everything they touch.', cost: 210, range: 11.5, damage: 32, rate: 1, splash: 2.6, slow: 0.35, slowDur: 2, projectile: 'shard' },
        { ...spireBase, name: 'Glacier Spire', desc: 'Deep cold. A strong slow that sometimes freezes solid.', cost: 370, range: 12.5, damage: 54, rate: 1.1, splash: 3.6, slow: 0.5, slowDur: 2.5, freezeChance: 0.14, freezeDur: 1.1, projectile: 'shard' },
      ],
    ],
  },
  mortar: {
    id: 'mortar', name: 'Ember Mortar', role: 'Blast damage in an area. Ground only.', hotkey: '3', unlockAfter: 0,
    levels: [
      { ...mortarBase, name: 'Ember Mortar', desc: 'Lobs burning shells into the thick of the horde.', cost: 125, range: 12, damage: 38, rate: 0.48, splash: 2.7 },
      { ...mortarBase, name: 'Siege Mortar', desc: 'Heavier shells, wider blasts.', cost: 140, range: 13, damage: 64, rate: 0.5, splash: 3.1 },
    ],
    branches: [
      [
        { ...mortarBase, name: 'Dragonmaw', desc: 'Shells leave pools of dragonfire. The pools deal fire damage.', cost: 270, range: 14, damage: 78, rate: 0.52, splash: 3.3, pool: { dps: 24, dur: 3.5, radius: 3 } },
        { ...mortarBase, name: 'Wyrm Furnace', desc: 'Wide lakes of fire. Nothing crosses them unharmed.', cost: 430, range: 15, damage: 124, rate: 0.56, splash: 3.7, pool: { dps: 52, dur: 4.5, radius: 3.8 } },
      ],
      [
        { ...mortarBase, name: 'Thunderkeg', desc: 'Massive blasts that stun everything caught in them.', cost: 280, range: 14, damage: 145, rate: 0.42, splash: 4, stun: 0.6 },
        { ...mortarBase, name: 'Titan Keg', desc: 'Earth-shaking blasts that crack armor for good.', cost: 460, range: 15.5, damage: 290, rate: 0.44, splash: 4.8, stun: 1.1, shred: 0.15 },
      ],
    ],
  },
  shrine: {
    id: 'shrine', name: 'Grove Shrine', role: 'Boosts the damage of nearby towers.', hotkey: '4', unlockAfter: 1,
    levels: [
      { ...shrineBase, name: 'Grove Shrine', desc: 'Old magic that strengthens every tower in its grove.', cost: 95, range: 8, aura: { damage: 0.12, range: 0 } },
      { ...shrineBase, name: 'Elder Shrine', desc: 'A deeper blessing, a wider grove.', cost: 110, range: 9.5, aura: { damage: 0.18, range: 0 } },
    ],
    branches: [
      [
        { ...shrineBase, name: 'Sunwell', desc: 'Grants more damage and range, and produces gold each wave.', cost: 210, range: 10.5, aura: { damage: 0.26, range: 0.1 }, goldPerWave: 20 },
        { ...shrineBase, name: 'Radiant Sunwell', desc: 'A wellspring of light and riches.', cost: 360, range: 12, aura: { damage: 0.36, range: 0.15 }, goldPerWave: 50 },
      ],
      [
        { ...shrineBase, name: 'Thornroot', desc: 'Roots enemies in place and poisons them, on top of its blessing.', cost: 210, range: 10, aura: { damage: 0.18, range: 0 }, roots: { every: 5, count: 3, dur: 1.5, dps: 26 } },
        { ...shrineBase, name: 'Worldroot', desc: 'The earth itself seizes the invaders.', cost: 350, range: 12, aura: { damage: 0.24, range: 0 }, roots: { every: 4, count: 6, dur: 2, dps: 60 } },
      ],
    ],
  },
  sunforge: {
    id: 'sunforge', name: 'Sunforge', role: 'Burning fire beam that grows stronger.', hotkey: '5', unlockAfter: 3,
    levels: [
      { ...forgeBase, name: 'Sunforge', desc: 'A lens of captured daylight. The longer it burns, the hotter it gets.', cost: 180, range: 10, damage: 18, beam: { ramp: 2, rampTime: 3, mode: 'single', targets: 1 } },
      { ...forgeBase, name: 'Greater Sunforge', desc: 'A polished lens with a fiercer burn.', cost: 200, range: 11, damage: 27, beam: { ramp: 2.2, rampTime: 3, mode: 'single', targets: 1 } },
    ],
    branches: [
      [
        { ...forgeBase, name: 'Prism Core', desc: 'Splits the beam across three targets.', cost: 380, range: 12, damage: 50, beam: { ramp: 2, rampTime: 3, mode: 'split', targets: 3 } },
        { ...forgeBase, name: 'Solar Crown', desc: 'Five beams of pure noon.', cost: 590, range: 13, damage: 72, beam: { ramp: 2.2, rampTime: 2.5, mode: 'split', targets: 5 } },
      ],
      [
        { ...forgeBase, name: 'Solar Lance', desc: 'A piercing line that burns everything in its path.', cost: 420, range: 14, damage: 34, beam: { ramp: 1.6, rampTime: 2, mode: 'line', targets: 1 } },
        { ...forgeBase, name: 'Daybreak Lance', desc: 'A blade of dawn drawn across the battlefield.', cost: 650, range: 16, damage: 50, beam: { ramp: 1.8, rampTime: 2, mode: 'line', targets: 1 } },
      ],
    ],
  },
  ballista: {
    id: 'ballista', name: 'Ironbolt Ballista', role: 'Armor-piercing bolts that pass through a whole line.', hotkey: '6', unlockAfter: 0, tech: 'techBallista',
    levels: [
      { ...ballistaBase, name: 'Ironbolt Ballista', desc: 'A heavy crossbow on a turntable. Its bolts punch through armor and whatever stands behind it.', cost: 145, range: 14, damage: 32, rate: 0.5, armorPierce: 0.25, lineShot: 1.1 },
      { ...ballistaBase, name: 'Steelbolt Ballista', desc: 'Steel limbs and a longer bolt.', cost: 160, range: 15, damage: 50, rate: 0.52, armorPierce: 0.3, lineShot: 1.2 },
    ],
    branches: [
      [
        { ...ballistaBase, name: 'Harpoon Battery', desc: 'Barbed harpoons that drag at everything they pass through.', cost: 300, range: 16, damage: 96, rate: 0.55, armorPierce: 0.4, lineShot: 1.2, slow: 0.3, slowDur: 1.6 },
        { ...ballistaBase, name: 'Leviathan Battery', desc: 'Harpoons made to bring down a walking hill.', cost: 480, range: 17.5, damage: 175, rate: 0.6, armorPierce: 0.5, lineShot: 1.4, slow: 0.4, slowDur: 2 },
      ],
      [
        { ...ballistaBase, name: 'Repeater Ballista', desc: 'A cranked magazine trades raw weight for a storm of bolts.', cost: 280, range: 15, damage: 42, rate: 1.25, armorPierce: 0.25, lineShot: 1.1 },
        { ...ballistaBase, name: 'Siege Repeater', desc: 'Twin magazines and a crew who never tire.', cost: 450, range: 16, damage: 68, rate: 1.75, armorPierce: 0.3, lineShot: 1.2 },
      ],
    ],
  },
  blightwell: {
    id: 'blightwell', name: 'Blightwell', role: 'Venom that keeps burning long after the hit.', hotkey: '7', unlockAfter: 0, tech: 'techBlightwell',
    levels: [
      { ...blightBase, name: 'Blightwell', desc: 'A cauldron of swamp poison. It seeks out the unpoisoned, so a crowd feeds it.', cost: 95, range: 10.5, damage: 4, rate: 0.95, poison: { dps: 14, dur: 4 } },
      { ...blightBase, name: 'Deep Blightwell', desc: 'Drawn from further down, and much fouler.', cost: 110, range: 11.5, damage: 7, rate: 1, poison: { dps: 25, dur: 4.5 } },
    ],
    branches: [
      [
        { ...blightBase, name: 'Plague Censer', desc: 'A choking cloud that poisons everything nearby.', cost: 230, range: 12, damage: 10, rate: 0.8, splash: 2.8, poison: { dps: 36, dur: 4.5 } },
        { ...blightBase, name: 'Pestilence Censer', desc: 'The road itself turns sick. Those caught in it stagger.', cost: 380, range: 13, damage: 18, rate: 0.85, splash: 3.6, poison: { dps: 64, dur: 5 }, slow: 0.15, slowDur: 2 },
      ],
      [
        { ...blightBase, name: 'Witherfang', desc: 'A venom that rots defenses. Victims take more damage from everything.', cost: 215, range: 12.5, damage: 12, rate: 1.05, poison: { dps: 46, dur: 5 }, wither: 0.14 },
        { ...blightBase, name: 'Wither Queen', desc: 'One bite, and even a Colossus begins to come apart.', cost: 360, range: 14, damage: 22, rate: 1.15, poison: { dps: 90, dur: 6 }, wither: 0.24 },
      ],
    ],
  },
  thunderbell: {
    id: 'thunderbell', name: 'Thunderbell', role: 'Shockwaves hit everything nearby. Never misses. Ground only.', hotkey: '8', unlockAfter: 0, tech: 'techThunderbell',
    levels: [
      { ...bellBase, name: 'Thunderbell', desc: 'Each toll knocks the road flat. Short reach, but it cannot miss.', cost: 125, range: 6.5, damage: 26, rate: 0.5 },
      { ...bellBase, name: 'Great Thunderbell', desc: 'Cast heavier, and heard further.', cost: 140, range: 7.2, damage: 44, rate: 0.52 },
    ],
    branches: [
      [
        { ...bellBase, name: 'Cathedral Bell', desc: 'A toll so deep that it stuns everything in reach.', cost: 275, range: 8, damage: 88, rate: 0.52, stun: 0.35 },
        { ...bellBase, name: 'Doomsday Bell', desc: 'The ground jumps. So does everything on it.', cost: 440, range: 9, damage: 165, rate: 0.55, stun: 0.6 },
      ],
      [
        { ...bellBase, dmgType: 'arcane', air: true, name: 'Warding Carillon', desc: 'Silver bells ring out arcane force, reaching the sky and slowing all they touch.', cost: 250, range: 8, damage: 54, rate: 0.72, slow: 0.25, slowDur: 1.5 },
        { ...bellBase, dmgType: 'arcane', air: true, name: 'Choir of Silver', desc: 'A ceaseless peal. Nothing passes through it at speed.', cost: 410, range: 9.2, damage: 96, rate: 0.82, slow: 0.35, slowDur: 1.8 },
      ],
    ],
  },
  barracks: {
    id: 'barracks', name: 'Lantern Barracks', role: 'Soldiers hold the nearest road, and return when they fall.', hotkey: '9', unlockAfter: 0, tech: 'techBarracks',
    levels: [
      { ...barracksBase, name: 'Lantern Barracks', desc: 'Two spearmen march out to stand on the nearest road.', cost: 115, range: 7, garrison: { count: 2, hp: 210, damage: 20, rate: 1, respawn: 8, blockCap: 2 } },
      { ...barracksBase, name: 'Lantern Garrison', desc: 'Better steel, and sergeants who shout.', cost: 130, range: 7.5, garrison: { count: 2, hp: 360, damage: 34, rate: 1, respawn: 7, blockCap: 2 } },
    ],
    branches: [
      [
        { ...barracksBase, name: 'Knight Hall', desc: 'Three armored knights who will not be moved.', cost: 240, range: 8, garrison: { count: 3, hp: 620, damage: 52, rate: 1, respawn: 7, blockCap: 3 } },
        { ...barracksBase, name: 'Order of the Lantern', desc: 'The road belongs to them now.', cost: 400, range: 9, garrison: { count: 3, hp: 1150, damage: 95, rate: 1, respawn: 6, blockCap: 4 } },
      ],
      [
        { ...barracksBase, dmgType: 'fire', name: 'Flame Zealots', desc: 'Burning blades instead of heavy armor. They deal fire damage.', cost: 240, range: 8, garrison: { count: 3, hp: 360, damage: 80, rate: 1.2, respawn: 6, blockCap: 2 } },
        { ...barracksBase, dmgType: 'fire', name: 'Ashen Crusade', desc: 'Four true believers, burning very brightly.', cost: 390, range: 9, garrison: { count: 4, hp: 540, damage: 125, rate: 1.3, respawn: 5, blockCap: 2 } },
      ],
    ],
  },
};

export const TOWER_ORDER: TowerId[] = ['roost', 'spire', 'mortar', 'shrine', 'sunforge', 'ballista', 'blightwell', 'thunderbell', 'barracks'];

/** level is 0..3; branch applies from level 2 onward. */
export function towerStats(id: TowerId, level: number, branch: number): TowerStats {
  const def = TOWERS[id];
  if (level < 2) return def.levels[level];
  return def.branches[branch][level - 2];
}

export function towerTotalCost(id: TowerId, level: number, branch: number): number {
  let total = 0;
  for (let l = 0; l <= level; l++) total += towerStats(id, l, branch).cost;
  return total;
}
