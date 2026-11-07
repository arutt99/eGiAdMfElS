// The tech tree bought with Starlight earned in the campaign, plus spell and hero data.
import type { AttackType } from './towers';

export type MetaId =
  | 'startGold' | 'bounty' | 'earlyBonus' | 'refund' | 'lives' | 'tithe' | 'interest'
  | 'towerDamage' | 'towerRange' | 'towerCost' | 'towerRate' | 'towerCrit' | 'resistIgnore' | 'masterwork'
  | 'techBallista' | 'techBlightwell' | 'techThunderbell' | 'techBarracks'
  | 'spellCooldown' | 'spellPower' | 'spellRadius' | 'guardCount' | 'spellStart'
  | 'spellHex' | 'spellRally' | 'spellRift' | 'spellGolden'
  | 'heroHealth' | 'heroDamage' | 'heroRespawn' | 'heroXp' | 'heroStart'
  | 'heroAbilityCd' | 'heroAbilityPower' | 'heroUltimate' | 'heroSable' | 'heroOakheart';

export type School = 'Prosperity' | 'Masonry' | 'Sorcery' | 'Valor';
export type NodeKind = 'stat' | 'tower' | 'spell' | 'hero' | 'power';

export interface MetaDef {
  id: MetaId;
  school: School;
  name: string;
  kind: NodeKind;
  /** Effect text for a rank count. */
  effect: (rank: number) => string;
  max: number;
  /** Starlight cost of each rank. */
  costs: number[];
  /** Position in its school's tree. Row 0 is the top. */
  row: number;
  col: 0 | 1 | 2;
  /** Nodes that need at least one rank first. */
  requires: MetaId[];
  /** What a tower, spell or hero node's picture shows. */
  subject?: string;
}

const pct = (n: number) => `${Math.round(n * 100)}%`;
const unlock = (text: string) => () => text;

export const META: MetaDef[] = [
  { id: 'startGold', school: 'Prosperity', kind: 'stat', name: 'War Chest', row: 0, col: 1, requires: [], max: 5, costs: [1, 1, 1, 2, 3], effect: (r) => `+${pct(r * 0.06)} starting gold` },
  { id: 'bounty', school: 'Prosperity', kind: 'stat', name: 'Bounty Hunters', row: 1, col: 0, requires: ['startGold'], max: 4, costs: [2, 2, 2, 2], effect: (r) => `+${pct(r * 0.04)} gold from kills` },
  { id: 'lives', school: 'Prosperity', kind: 'stat', name: 'Brighter Wick', row: 1, col: 1, requires: ['startGold'], max: 4, costs: [2, 2, 2, 3], effect: (r) => `+${r * 2} lantern light` },
  { id: 'earlyBonus', school: 'Prosperity', kind: 'stat', name: 'Eager Scouts', row: 1, col: 2, requires: ['startGold'], max: 3, costs: [1, 1, 2], effect: (r) => `+${pct(r * 0.25)} gold for early waves` },
  { id: 'tithe', school: 'Prosperity', kind: 'stat', name: 'Village Tithe', row: 2, col: 0, requires: ['bounty'], max: 3, costs: [2, 2, 3], effect: (r) => `+${r * 8} gold at the start of each wave` },
  { id: 'refund', school: 'Prosperity', kind: 'stat', name: 'Salvage Rights', row: 2, col: 2, requires: ['earlyBonus'], max: 3, costs: [1, 1, 2], effect: (r) => `Sell towers for ${70 + r * 8}% of their cost` },
  { id: 'spellGolden', school: 'Prosperity', kind: 'spell', name: 'Golden Hour', row: 3, col: 0, requires: ['tithe'], max: 1, costs: [4], subject: 'golden', effect: unlock('New spell: for 10 seconds, kills pay double gold') },
  { id: 'interest', school: 'Prosperity', kind: 'stat', name: 'Lantern Interest', row: 3, col: 2, requires: ['refund'], max: 2, costs: [3, 3], effect: (r) => `Each wave, earn ${r * 3}% of your banked gold, up to ${r * 45}` },

  { id: 'towerDamage', school: 'Masonry', kind: 'stat', name: 'Tempered Craft', row: 0, col: 1, requires: [], max: 5, costs: [2, 2, 2, 2, 3], effect: (r) => `+${pct(r * 0.03)} tower damage` },
  { id: 'towerRange', school: 'Masonry', kind: 'stat', name: 'High Vantage', row: 1, col: 0, requires: ['towerDamage'], max: 3, costs: [2, 2, 2], effect: (r) => `+${pct(r * 0.03)} tower range` },
  { id: 'techBallista', school: 'Masonry', kind: 'tower', name: 'Ironbolt Ballista', row: 1, col: 1, requires: ['towerDamage'], max: 1, costs: [3], subject: 'ballista', effect: unlock('New tower: armor-piercing bolts that pass through a whole line') },
  { id: 'towerCost', school: 'Masonry', kind: 'stat', name: "Mason's Guild", row: 1, col: 2, requires: ['towerDamage'], max: 3, costs: [2, 2, 2], effect: (r) => `-${pct(r * 0.03)} tower cost` },
  { id: 'towerRate', school: 'Masonry', kind: 'stat', name: 'Swift Drills', row: 2, col: 0, requires: ['towerRange'], max: 4, costs: [2, 2, 2, 2], effect: (r) => `+${pct(r * 0.025)} tower attack speed` },
  { id: 'techBlightwell', school: 'Masonry', kind: 'tower', name: 'Blightwell', row: 2, col: 1, requires: ['techBallista'], max: 1, costs: [3], subject: 'blightwell', effect: unlock('New tower: venom that keeps burning long after the hit') },
  { id: 'towerCrit', school: 'Masonry', kind: 'stat', name: 'Lucky Strikes', row: 2, col: 2, requires: ['towerCost'], max: 3, costs: [2, 2, 2], effect: (r) => `${pct(r * 0.03)} chance to deal double damage` },
  { id: 'techThunderbell', school: 'Masonry', kind: 'tower', name: 'Thunderbell', row: 3, col: 0, requires: ['towerRate'], max: 1, costs: [3], subject: 'thunderbell', effect: unlock('New tower: shockwaves that strike everything nearby') },
  { id: 'techBarracks', school: 'Masonry', kind: 'tower', name: 'Lantern Barracks', row: 3, col: 1, requires: ['techBlightwell'], max: 1, costs: [3], subject: 'barracks', effect: unlock('New tower: soldiers who hold the road and return when they fall') },
  { id: 'resistIgnore', school: 'Masonry', kind: 'stat', name: 'Sundering Craft', row: 3, col: 2, requires: ['towerCrit'], max: 2, costs: [3, 3], effect: (r) => `Towers ignore ${pct(r * 0.1)} of enemy resistances` },
  { id: 'masterwork', school: 'Masonry', kind: 'stat', name: 'Masterwork', row: 4, col: 1, requires: ['techBarracks'], max: 1, costs: [4], effect: unlock('Fully upgraded towers deal 10% more damage') },

  { id: 'spellCooldown', school: 'Sorcery', kind: 'stat', name: 'Quick Recitation', row: 0, col: 1, requires: [], max: 4, costs: [1, 1, 2, 2], effect: (r) => `-${pct(r * 0.06)} spell cooldowns` },
  { id: 'spellPower', school: 'Sorcery', kind: 'stat', name: 'Deep Lore', row: 1, col: 0, requires: ['spellCooldown'], max: 4, costs: [2, 2, 2, 2], effect: (r) => `+${pct(r * 0.12)} spell power` },
  { id: 'spellStart', school: 'Sorcery', kind: 'stat', name: 'Prepared Scrolls', row: 1, col: 1, requires: ['spellCooldown'], max: 1, costs: [2], effect: unlock('Spells start each map ready to cast') },
  { id: 'spellRadius', school: 'Sorcery', kind: 'stat', name: 'Wide Circles', row: 1, col: 2, requires: ['spellCooldown'], max: 2, costs: [2, 2], effect: (r) => `+${pct(r * 0.15)} spell radius` },
  { id: 'guardCount', school: 'Sorcery', kind: 'stat', name: 'Lantern Levy', row: 2, col: 0, requires: ['spellPower'], max: 2, costs: [2, 2], effect: (r) => `+${r} Lantern Guard per summon` },
  { id: 'spellRally', school: 'Sorcery', kind: 'spell', name: 'Rallying Horn', row: 2, col: 1, requires: ['spellStart'], max: 1, costs: [3], subject: 'rally', effect: unlock('New spell: every tower attacks 30% faster for 8 seconds') },
  { id: 'spellHex', school: 'Sorcery', kind: 'spell', name: 'Sundering Hex', row: 2, col: 2, requires: ['spellRadius'], max: 1, costs: [3], subject: 'hex', effect: unlock('New spell: cursed enemies take 35% more damage of every type for 8 seconds') },
  { id: 'spellRift', school: 'Sorcery', kind: 'spell', name: 'Riftback', row: 3, col: 2, requires: ['spellHex'], max: 1, costs: [3], subject: 'rift', effect: unlock('New spell: throws enemies back along the road') },

  { id: 'heroHealth', school: 'Valor', kind: 'stat', name: 'Stout Heart', row: 0, col: 0, requires: [], max: 4, costs: [1, 1, 1, 2], effect: (r) => `+${pct(r * 0.12)} hero health` },
  { id: 'heroDamage', school: 'Valor', kind: 'stat', name: 'Keen Blade', row: 0, col: 2, requires: [], max: 4, costs: [1, 1, 1, 2], effect: (r) => `+${pct(r * 0.12)} hero damage` },
  { id: 'heroRespawn', school: 'Valor', kind: 'stat', name: 'Second Wind', row: 1, col: 0, requires: ['heroHealth'], max: 3, costs: [1, 1, 1], effect: (r) => `-${pct(r * 0.15)} hero respawn time` },
  { id: 'heroXp', school: 'Valor', kind: 'stat', name: 'Veteran Eye', row: 1, col: 2, requires: ['heroDamage'], max: 2, costs: [1, 2], effect: (r) => `+${pct(r * 0.25)} hero experience` },
  { id: 'heroOakheart', school: 'Valor', kind: 'hero', name: 'Oakheart', row: 2, col: 0, requires: ['heroRespawn'], max: 1, costs: [3], subject: 'oakheart', effect: unlock('New hero: a huge stone-clad guardian who blocks six enemies at once') },
  { id: 'heroAbilityCd', school: 'Valor', kind: 'power', name: 'Practiced Forms', row: 2, col: 1, requires: ['heroHealth', 'heroDamage'], max: 3, costs: [1, 1, 2], effect: (r) => `-${pct(r * 0.08)} hero power cooldowns` },
  { id: 'heroSable', school: 'Valor', kind: 'hero', name: 'Sable', row: 2, col: 2, requires: ['heroXp'], max: 1, costs: [3], subject: 'sable', effect: unlock('New hero: a far-seeing huntress who strikes from long range') },
  { id: 'heroAbilityPower', school: 'Valor', kind: 'power', name: 'Battle Hymn', row: 3, col: 0, requires: ['heroAbilityCd'], max: 3, costs: [1, 1, 2], effect: (r) => `+${pct(r * 0.15)} hero power damage` },
  { id: 'heroStart', school: 'Valor', kind: 'stat', name: 'Seasoned Warden', row: 3, col: 2, requires: ['heroAbilityCd'], max: 3, costs: [1, 1, 2], effect: (r) => `Hero starts at level ${1 + r}` },
  { id: 'heroUltimate', school: 'Valor', kind: 'power', name: 'Awakened Power', row: 4, col: 1, requires: ['heroAbilityPower'], max: 1, costs: [4], effect: unlock('Every hero gains a third, far stronger power') },
];

export const SCHOOLS: { id: School; blurb: string }[] = [
  { id: 'Prosperity', blurb: 'Gold and lantern light' },
  { id: 'Masonry', blurb: 'Stronger towers, and new ones' },
  { id: 'Sorcery', blurb: 'Mightier spells, and new ones' },
  { id: 'Valor', blurb: 'New heroes and hero powers' },
];

export const META_BY_ID = Object.fromEntries(META.map((m) => [m.id, m])) as Record<MetaId, MetaDef>;
export type MetaRanks = Partial<Record<MetaId, number>>;

export type SpellId = 'starfall' | 'winter' | 'guards' | 'hex' | 'rally' | 'rift' | 'golden';
export interface SpellDef {
  id: SpellId;
  name: string;
  desc: string;
  hotkey: string;
  cooldown: number;
  radius: number;
  power: number;
  duration: number;
  unlockAfter: number;
  /** When set, the spell is bought in the tech tree instead of unlocking with the campaign. */
  tech?: MetaId;
  /** Casts at once, with no target to choose. */
  instant?: boolean;
  /** Color of the targeting circle. */
  color: number;
}
export const SPELLS: Record<SpellId, SpellDef> = {
  starfall: {
    id: 'starfall', name: 'Starfall', desc: 'Call down a burning star. Heavy radiant damage in an area.',
    hotkey: 'Z', cooldown: 40, radius: 5.5, power: 320, duration: 0, unlockAfter: 0, color: 0xff8a3c,
  },
  winter: {
    id: 'winter', name: "Winter's Breath", desc: 'Freezes enemies in the area, then leaves them slowed.',
    hotkey: 'X', cooldown: 50, radius: 7, power: 2.6, duration: 5, unlockAfter: 1, color: 0x9fecff,
  },
  guards: {
    id: 'guards', name: 'Lantern Guard', desc: 'Summons guards who block and fight on the road.',
    hotkey: 'C', cooldown: 35, radius: 2, power: 3, duration: 16, unlockAfter: 2, color: 0x7fb8ff,
  },
  hex: {
    id: 'hex', name: 'Sundering Hex', desc: 'Curses an area. Enemies inside take 35% more damage of every type, even those they resist.',
    hotkey: 'G', cooldown: 38, radius: 6.5, power: 0.35, duration: 8, unlockAfter: 0, tech: 'spellHex', color: 0xc76bff,
  },
  rally: {
    id: 'rally', name: 'Rallying Horn', desc: 'Every tower on the field attacks 30% faster for 8 seconds.',
    hotkey: 'Y', cooldown: 55, radius: 0, power: 0.3, duration: 8, unlockAfter: 0, tech: 'spellRally', instant: true, color: 0xffd36b,
  },
  rift: {
    id: 'rift', name: 'Riftback', desc: 'Throws enemies in the area back along the road. A boss only stumbles.',
    hotkey: 'U', cooldown: 45, radius: 5.5, power: 13, duration: 0, unlockAfter: 0, tech: 'spellRift', color: 0x8a6bff,
  },
  golden: {
    id: 'golden', name: 'Golden Hour', desc: 'For 10 seconds, every kill pays double gold.',
    hotkey: 'J', cooldown: 75, radius: 0, power: 2, duration: 10, unlockAfter: 0, tech: 'spellGolden', instant: true, color: 0xffcf4f,
  },
};
export const SPELL_ORDER: SpellId[] = ['starfall', 'winter', 'guards', 'hex', 'rally', 'rift', 'golden'];

export type HeroId = 'ember' | 'sable' | 'oakheart';

export type AbilityEffect =
  /** Damages and hinders everything around the hero. */
  | { kind: 'burst'; radius: number; damage: number; damagePerLevel: number; type: AttackType; stun?: number; slow?: number; slowDur?: number; pool?: { dps: number; dur: number }; hitsAir: boolean; shove?: number }
  /** Heals the hero and lifts nearby towers. */
  | { kind: 'ward'; radius: number; duration: number; heal: number; rateBonus: number; damageReduction: number; extraBlock: number }
  /** Enemies around the hero take more damage from everything. */
  | { kind: 'mark'; radius: number; duration: number; vuln: number }
  /** One enormous hit on the toughest enemy in reach. Ignores resistances. */
  | { kind: 'snipe'; range: number; damage: number; damagePerLevel: number; type: AttackType };

export interface HeroAbility {
  id: string;
  name: string;
  hotkey: string;
  cooldown: number;
  desc: string;
  effect: AbilityEffect;
}

export interface HeroDef {
  id: HeroId;
  name: string;
  title: string;
  blurb: string;
  /** What's needed to play this hero. Ember is always available. */
  tech?: MetaId;
  baseHp: number;
  hpPerLevel: number;
  baseDamage: number;
  damagePerLevel: number;
  damageType: AttackType;
  rate: number;
  range: number;
  speed: number;
  blockCap: number;
  /** Which stat the hero lifts on nearby towers, and by how much at level 0. */
  aura: { stat: 'rate' | 'damage' | 'range'; base: number; perLevel: number; label: string };
  /** The third power needs the Awakened Power node. */
  abilities: [HeroAbility, HeroAbility, HeroAbility];
  /** Color used for the hero's effects. */
  accent: number;
}

export const HERO_COMMON = {
  respawn: 14,
  maxLevel: 10,
  auraRadius: 7,
  xpForLevel: (lvl: number) => Math.round(40 * Math.pow(lvl, 1.55)),
};

export const HEROES: Record<HeroId, HeroDef> = {
  ember: {
    id: 'ember', name: 'Warden Ember', title: 'The Last Warden', blurb: 'Sword and lantern. A steady fighter who makes nearby towers fire faster.',
    baseHp: 340, hpPerLevel: 55, baseDamage: 26, damagePerLevel: 7, damageType: 'fire', rate: 1.15, range: 2.6, speed: 7, blockCap: 3,
    aura: { stat: 'rate', base: 0.05, perLevel: 0.01, label: 'attack speed' }, accent: 0xffc76b,
    abilities: [
      { id: 'sunbreak', name: 'Sunbreak', hotkey: 'V', cooldown: 13, desc: 'A burst of light that burns and stuns nearby enemies.', effect: { kind: 'burst', radius: 5, damage: 70, damagePerLevel: 28, type: 'radiant', stun: 0.9, hitsAir: true } },
      { id: 'ward', name: 'Lantern Ward', hotkey: 'B', cooldown: 26, desc: 'Heals the Warden, and nearby towers attack faster for a short time.', effect: { kind: 'ward', radius: 9, duration: 7, heal: 0.3, rateBonus: 0.35, damageReduction: 0, extraBlock: 0 } },
      { id: 'phoenix', name: 'Phoenix Flare', hotkey: 'N', cooldown: 45, desc: 'A great wheel of fire that leaves the ground burning.', effect: { kind: 'burst', radius: 8, damage: 170, damagePerLevel: 50, type: 'fire', hitsAir: true, pool: { dps: 50, dur: 4 } } },
    ],
  },
  sable: {
    id: 'sable', name: 'Sable', title: 'Huntress of the Border', blurb: 'Strikes from long range and at flyers, but cannot hold the road. Nearby towers see further.', tech: 'heroSable',
    baseHp: 210, hpPerLevel: 34, baseDamage: 21, damagePerLevel: 6.5, damageType: 'pierce', rate: 1.3, range: 9.5, speed: 7.5, blockCap: 1,
    aura: { stat: 'range', base: 0.05, perLevel: 0.008, label: 'range' }, accent: 0x9fe86a,
    abilities: [
      { id: 'arrowrain', name: 'Arrow Rain', hotkey: 'V', cooldown: 12, desc: 'A hail of arrows that wounds and slows everything nearby.', effect: { kind: 'burst', radius: 7, damage: 56, damagePerLevel: 24, type: 'pierce', slow: 0.35, slowDur: 2.5, hitsAir: true } },
      { id: 'huntersmark', name: "Hunter's Mark", hotkey: 'B', cooldown: 24, desc: 'Marks nearby prey. Marked enemies take 25% more damage of every type.', effect: { kind: 'mark', radius: 10, duration: 7, vuln: 0.25 } },
      { id: 'deadeye', name: 'Deadeye', hotkey: 'N', cooldown: 28, desc: 'One perfect shot at the toughest enemy in sight. Ignores all resistance.', effect: { kind: 'snipe', range: 24, damage: 420, damagePerLevel: 120, type: 'radiant' } },
    ],
  },
  oakheart: {
    id: 'oakheart', name: 'Oakheart', title: 'The Walking Bulwark', blurb: 'Slow and hard to kill. Blocks six enemies at once, and nearby towers hit harder.', tech: 'heroOakheart',
    baseHp: 560, hpPerLevel: 90, baseDamage: 20, damagePerLevel: 5, damageType: 'blast', rate: 0.95, range: 2.9, speed: 5.4, blockCap: 6,
    aura: { stat: 'damage', base: 0.05, perLevel: 0.008, label: 'damage' }, accent: 0x8fd6a0,
    abilities: [
      { id: 'earthshatter', name: 'Earthshatter', hotkey: 'V', cooldown: 14, desc: 'Cracks the ground. A long stun for everything on foot nearby.', effect: { kind: 'burst', radius: 6, damage: 38, damagePerLevel: 15, type: 'blast', stun: 1.7, hitsAir: false } },
      { id: 'stonewall', name: 'Stonewall', hotkey: 'B', cooldown: 28, desc: 'Heals Oakheart, who then takes 60% less damage and blocks far more enemies for a short time.', effect: { kind: 'ward', radius: 0, duration: 7, heal: 0.4, rateBonus: 0, damageReduction: 0.6, extraBlock: 6 } },
      { id: 'avalanche', name: 'Avalanche', hotkey: 'N', cooldown: 40, desc: 'A wall of stone that crushes nearby enemies and hurls them back along the road.', effect: { kind: 'burst', radius: 9, damage: 120, damagePerLevel: 38, type: 'blast', stun: 0.6, hitsAir: false, shove: 10 } },
    ],
  },
};
export const HERO_ORDER: HeroId[] = ['ember', 'sable', 'oakheart'];

export function heroAvailable(id: HeroId, meta: MetaRanks) {
  const tech = HEROES[id].tech;
  return !tech || (meta[tech] ?? 0) > 0;
}

/** Starlight granted once for each campaign map cleared on any difficulty. */
export const FIRST_CLEAR_BONUS = 2;
/** Each map pays one Starlight for this many Endless waves at its best. */
export const ENDLESS_WAVES_PER_STARLIGHT = 5;

export type Difficulty = 'easy' | 'normal' | 'hard';
export const DIFFICULTY: Record<Difficulty, { label: string; hp: number; speed: number; lives: number; gold: number; reward: number; blurb: string }> = {
  easy: { label: 'Easy', hp: 0.95, speed: 0.98, lives: 25, gold: 1.1, reward: 1, blurb: 'A forgiving road for new Wardens.' },
  normal: { label: 'Normal', hp: 1.14, speed: 1, lives: 20, gold: 1, reward: 2, blurb: 'The intended challenge.' },
  hard: { label: 'Hard', hp: 1.42, speed: 1.08, lives: 10, gold: 0.88, reward: 5, blurb: 'Tough enemies, little room for error.' },
};
