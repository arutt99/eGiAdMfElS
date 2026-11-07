import type { AttackType } from './towers';

export type EnemyId =
  | 'gloomling'
  | 'swiftclaw'
  | 'bristleboar'
  | 'duskmoth'
  | 'ironhusk'
  | 'shade'
  | 'mireshaman'
  | 'sporeback'
  | 'gargoyle'
  | 'colossus'
  | 'veilwraith'
  | 'runegolem'
  | 'bogbloat'
  | 'glasswing'
  | 'cinderwight'
  | 'broodmother'
  | 'rimewarden'
  | 'dunereaver'
  | 'ashregent'
  | 'stormharrow';

/** What makes each boss fight different. */
export type BossAbility = 'slam' | 'brood' | 'ward' | 'charge' | 'rebirth' | 'gale';

export interface EnemyDef {
  id: EnemyId;
  name: string;
  blurb: string;
  hp: number;
  /** Fraction of each damage type ignored. Negative values are weaknesses. Anything unlisted hits normally. */
  resist: Partial<Record<AttackType, number>>;
  speed: number;
  bounty: number;
  /** Lantern light lost if it reaches the lantern. */
  lives: number;
  flying?: boolean;
  /** Damage per hit dealt to the hero and guards. */
  attack: number;
  size: number;
  /** Letter used in the wave scripts. */
  code: string;
  /** Short tag shown in wave previews. */
  trait: string;
  /** Bosses stand about as tall as other creatures. Their strength is in their health and their ability. */
  boss?: boolean;
  ability?: BossAbility;
}

export const ENEMIES: Record<EnemyId, EnemyDef> = {
  gloomling: {
    id: 'gloomling', name: 'Gloomling', blurb: 'A scurrying imp of living dusk. Weak alone, a nuisance in numbers.',
    hp: 42, resist: { blast: -0.2 }, speed: 3.1, bounty: 4, lives: 1, attack: 6, size: 0.75, code: 'g', trait: 'Swarm',
  },
  swiftclaw: {
    id: 'swiftclaw', name: 'Swiftclaw', blurb: 'A lean shadow-hound that outruns slow-firing towers.',
    hp: 34, resist: { blast: 0.25, venom: -0.25 }, speed: 5.6, bounty: 5, lives: 1, attack: 7, size: 0.8, code: 'w', trait: 'Fast',
  },
  bristleboar: {
    id: 'bristleboar', name: 'Bristleboar', blurb: 'Plated with bone. Arrows glance off its hide.',
    hp: 120, resist: { pierce: 0.4, blast: 0.2, fire: 0.15, venom: 0.2 }, speed: 2.7, bounty: 10, lives: 1, attack: 12, size: 1.0, code: 'b', trait: 'Armored',
  },
  duskmoth: {
    id: 'duskmoth', name: 'Duskmoth', blurb: 'Flies straight for the lantern. Mortars cannot reach it.',
    hp: 48, resist: { fire: -0.25, venom: -0.2 }, speed: 3.5, bounty: 6, lives: 1, flying: true, attack: 0, size: 0.8, code: 'm', trait: 'Flying',
  },
  ironhusk: {
    id: 'ironhusk', name: 'Ironhusk', blurb: 'Empty armor marching on, with no blood to poison. Use arcane, fire, or armor-piercing shots.',
    hp: 260, resist: { pierce: 0.65, blast: 0.5, fire: 0.2, venom: 0.8 }, speed: 1.9, bounty: 18, lives: 2, attack: 20, size: 1.1, code: 'i', trait: 'Heavy armor',
  },
  shade: {
    id: 'shade', name: 'Shade', blurb: 'Blinks forward through the veil. Arcane barely touches it, but fire banishes it.',
    hp: 100, resist: { arcane: 0.7, venom: 0.5, fire: -0.25 }, speed: 3.0, bounty: 11, lives: 1, attack: 10, size: 0.95, code: 's', trait: 'Blinks',
  },
  mireshaman: {
    id: 'mireshaman', name: 'Mire Shaman', blurb: 'Mends the wounds of the creatures around it. Kill it first.',
    hp: 140, resist: { pierce: 0.1, blast: 0.1, arcane: 0.25, venom: 0.6, fire: -0.15 }, speed: 2.4, bounty: 15, lives: 1, attack: 8, size: 0.95, code: 'h', trait: 'Heals allies',
  },
  sporeback: {
    id: 'sporeback', name: 'Sporeback', blurb: 'Bursts into a pack of gloomlings when slain.',
    hp: 170, resist: { pierce: 0.1, blast: 0.1, arcane: 0.2, venom: 0.7, fire: -0.25 }, speed: 2.3, bounty: 12, lives: 2, attack: 14, size: 1.15, code: 'p', trait: 'Splits on death',
  },
  gargoyle: {
    id: 'gargoyle', name: 'Gargoyle', blurb: 'A stone-winged brute of the upper air. Tough for a flyer.',
    hp: 190, resist: { pierce: 0.45, arcane: 0.15, fire: 0.5, venom: 0.8 }, speed: 2.5, bounty: 16, lives: 2, flying: true, attack: 0, size: 1.05, code: 'a', trait: 'Armored flyer',
  },
  colossus: {
    id: 'colossus', name: 'Gloam Colossus', blurb: 'Dense shadow and stone. Slow and very hard to stop, and its slam hurts every defender around it.',
    hp: 1700, resist: { pierce: 0.35, blast: 0.3, arcane: 0.3, fire: 0.35, venom: 0.35, radiant: 0.2 }, speed: 1.35, bounty: 85, lives: 5, attack: 45, size: 0.52, code: 'c', trait: 'Boss: Slam', boss: true, ability: 'slam',
  },
  veilwraith: {
    id: 'veilwraith', name: 'Veilwraith', blurb: 'Half in this world. Arrows and shells pass straight through it. Magic and fire do not.',
    hp: 125, resist: { pierce: 0.75, blast: 0.7, venom: 0.5, arcane: -0.2, fire: -0.25 }, speed: 3.2, bounty: 12, lives: 1, attack: 11, size: 1.0, code: 'v', trait: 'Ghostly',
  },
  runegolem: {
    id: 'runegolem', name: 'Rune Golem', blurb: 'Carved with old wards that drink magic. A plain heavy blow breaks it apart.',
    hp: 240, resist: { arcane: 0.8, fire: 0.3, venom: 0.8, blast: -0.25, pierce: -0.1 }, speed: 2.0, bounty: 16, lives: 2, attack: 18, size: 1.1, code: 'r', trait: 'Warded',
  },
  bogbloat: {
    id: 'bogbloat', name: 'Bogbloat', blurb: 'A bag of swamp gas and rot. It soaks up shells and laughs at poison, but it burns very well.',
    hp: 310, resist: { venom: 0.85, blast: 0.5, pierce: 0.2, fire: -0.3 }, speed: 1.7, bounty: 17, lives: 2, attack: 15, size: 1.2, code: 'l', trait: 'Bloated',
  },
  glasswing: {
    id: 'glasswing', name: 'Glasswing', blurb: 'Its mirrored wings turn magic aside, and they shatter under a good arrow.',
    hp: 85, resist: { arcane: 0.7, fire: 0.25, venom: 0.3, pierce: -0.25 }, speed: 4.0, bounty: 10, lives: 1, flying: true, attack: 0, size: 0.9, code: 'q', trait: 'Mirrored flyer',
  },
  cinderwight: {
    id: 'cinderwight', name: 'Cinderwight', blurb: 'A cinder that walks. Fire only feeds it. Cold magic and poison put it out.',
    hp: 150, resist: { fire: 0.85, blast: 0.3, arcane: -0.2, venom: -0.2 }, speed: 3.0, bounty: 13, lives: 1, attack: 14, size: 1.0, code: 'f', trait: 'Burning',
  },
  broodmother: {
    id: 'broodmother', name: 'Mire Mother', blurb: 'Her egg sacs keep hatching gloomlings as she walks. Kill her quickly, or the road fills up. Fire works best.',
    hp: 1250, resist: { pierce: 0.2, blast: 0.15, arcane: 0.25, venom: 0.7, fire: -0.2, radiant: 0.2 }, speed: 1.5, bounty: 80, lives: 5, attack: 30, size: 1.0, code: 'y', trait: 'Boss: Brood', boss: true, ability: 'brood',
  },
  rimewarden: {
    id: 'rimewarden', name: 'Rime Warden', blurb: 'Keeps raising a shield of ice that must be broken before it can be hurt. Fire works best.',
    hp: 1000, resist: { pierce: 0.4, blast: 0.3, arcane: 0.3, venom: 0.5, fire: -0.2, radiant: 0.2 }, speed: 1.4, bounty: 85, lives: 5, attack: 40, size: 0.9, code: 'x', trait: 'Boss: Ice ward', boss: true, ability: 'ward',
  },
  dunereaver: {
    id: 'dunereaver', name: 'Dune Reaver', blurb: 'Lunges forward in bursts of speed, straight past any defenders. Cover the whole road, not just one corner.',
    hp: 850, resist: { pierce: 0.35, blast: 0.4, fire: 0.3, arcane: 0.1, venom: -0.1, radiant: 0.2 }, speed: 1.8, bounty: 80, lives: 5, attack: 38, size: 1.0, code: 'z', trait: 'Boss: Charge', boss: true, ability: 'charge',
  },
  ashregent: {
    id: 'ashregent', name: 'Ashen Regent', blurb: 'Rises from its own ashes the first time it falls, with half its health back. Fire does little to it, but arcane cuts deep.',
    hp: 950, resist: { fire: 0.5, pierce: 0.2, blast: 0.2, venom: 0.4, arcane: -0.15, radiant: 0.2 }, speed: 1.4, bounty: 90, lives: 5, attack: 40, size: 0.95, code: 'k', trait: 'Boss: Rebirth', boss: true, ability: 'rebirth',
  },
  stormharrow: {
    id: 'stormharrow', name: 'Stormharrow', blurb: 'A flying boss. Mortars cannot reach it, and its gale speeds up every creature near it.',
    hp: 650, resist: { pierce: 0.2, arcane: 0.3, fire: 0.2, venom: 0.5, radiant: 0.2 }, speed: 2.0, bounty: 80, lives: 5, flying: true, attack: 0, size: 1.0, code: 'j', trait: 'Boss: Gale', boss: true, ability: 'gale',
  },
};

export const ENEMY_BY_CODE: Record<string, EnemyId> = Object.fromEntries(
  Object.values(ENEMIES).map((e) => [e.code, e.id]),
);
