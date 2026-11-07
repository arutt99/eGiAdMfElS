// Persistent progress and settings, stored in the browser.
import { MAPS } from '../data/maps';
import { DIFFICULTY, ENDLESS_WAVES_PER_STARLIGHT, FIRST_CLEAR_BONUS, heroAvailable, META, META_BY_ID, type Difficulty, type HeroId, type MetaId, type MetaRanks } from '../data/meta';
import type { QualityId } from '../render/engine';

/** Opening the game with ?demo in the URL plays from a separate, fully unlocked save. */
export const DEMO = new URLSearchParams(location.search).has('demo');

export interface Settings {
  quality: QualityId;
  autoRes: boolean;
  painterly: boolean;
  tilt: boolean;
  shake: boolean;
  numbers: boolean;
  music: number;
  sfx: number;
}

export interface SaveData {
  v: 1;
  stars: Record<string, Partial<Record<Difficulty, number>>>;
  endless: Record<string, number>;
  meta: MetaRanks;
  hero: HeroId;
  settings: Settings;
  seen: string[];
  tutorialDone: boolean;
  seenPrologue: boolean;
  seenChapters: string[];
  lastMap: string;
  lastDifficulty: Difficulty;
  qualityChosen: boolean;
  /** Extra Starlight on top of what was earned. Only the demo save has any. */
  bonusStarlight: number;
}

const KEY = DEMO ? 'lanternfall.demo.v1' : 'lanternfall.save.v1';

const blank = (): SaveData => ({
  v: 1,
  stars: {},
  endless: {},
  meta: {},
  hero: 'ember',
  settings: { quality: 'high', autoRes: true, painterly: true, tilt: true, shake: true, numbers: true, music: 0.55, sfx: 0.75 },
  seen: [],
  tutorialDone: false,
  seenPrologue: false,
  seenChapters: [],
  lastMap: MAPS[0].id,
  lastDifficulty: 'normal',
  qualityChosen: false,
  bonusStarlight: 0,
});

/** Every map cleared and the whole Tech Tree bought, with enough spare Starlight to refund and rebuy it. */
const unlockAll = (d: SaveData): SaveData => {
  for (const m of MAPS) d.stars[m.id] = { easy: 3, normal: 3, hard: 3 };
  for (const def of META) {
    d.meta[def.id] = def.max;
    d.bonusStarlight += def.costs.reduce((sum, cost) => sum + cost, 0);
  }
  d.tutorialDone = true;
  d.seenPrologue = true;
  d.seenChapters = MAPS.map((m) => m.id);
  return d;
};

const fresh = () => (DEMO ? unlockAll(blank()) : blank());

export class Save {
  data: SaveData;
  persisted = true;

  constructor() {
    this.data = fresh();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SaveData>;
        const base = fresh();
        this.data = { ...base, ...parsed, settings: { ...base.settings, ...parsed.settings } };
      }
    } catch {
      this.persisted = false;
    }
  }

  write() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      this.persisted = false;
    }
  }

  reset() {
    const settings = this.data.settings;
    this.data = fresh();
    this.data.settings = settings;
    this.data.qualityChosen = true;
    this.write();
  }

  /** Number of campaign maps beaten on any difficulty, counted in order. */
  get cleared() {
    let n = 0;
    for (const m of MAPS) {
      const s = this.data.stars[m.id];
      if (s && (s.easy || s.normal || s.hard)) n = m.index + 1;
      else break;
    }
    return n;
  }

  bestStars(mapId: string, d: Difficulty) {
    return this.data.stars[mapId]?.[d] ?? 0;
  }

  /** Records a result and returns the Starlight gained by it. */
  recordWin(mapId: string, d: Difficulty, stars: number) {
    const prev = this.bestStars(mapId, d);
    if (stars <= prev) return 0;
    const entry = (this.data.stars[mapId] ??= {});
    const firstClear = !(entry.easy || entry.normal || entry.hard);
    entry[d] = stars;
    this.write();
    return (stars - prev) * DIFFICULTY[d].reward + (firstClear ? FIRST_CLEAR_BONUS : 0);
  }

  recordEndless(mapId: string, wave: number) {
    const prev = this.data.endless[mapId] ?? 0;
    if (wave <= prev) return 0;
    this.data.endless[mapId] = wave;
    this.write();
    return Math.floor(wave / ENDLESS_WAVES_PER_STARLIGHT) - Math.floor(prev / ENDLESS_WAVES_PER_STARLIGHT);
  }

  get totalStarlight() {
    let total = this.data.bonusStarlight;
    for (const m of MAPS) {
      const s = this.data.stars[m.id];
      if (s) for (const d of ['easy', 'normal', 'hard'] as Difficulty[]) total += (s[d] ?? 0) * DIFFICULTY[d].reward;
      if (s && (s.easy || s.normal || s.hard)) total += FIRST_CLEAR_BONUS;
      total += Math.floor((this.data.endless[m.id] ?? 0) / ENDLESS_WAVES_PER_STARLIGHT);
    }
    return total;
  }

  get spentStarlight() {
    let spent = 0;
    for (const [id, rank] of Object.entries(this.data.meta)) {
      const def = META_BY_ID[id as MetaId];
      if (!def) continue;
      for (let r = 0; r < (rank ?? 0); r++) spent += def.costs[r];
    }
    return spent;
  }

  get availableStarlight() {
    return this.totalStarlight - this.spentStarlight;
  }

  /** The nodes still needed before this one can be bought. */
  missingFor(id: MetaId) {
    return META_BY_ID[id].requires.filter((r) => !(this.data.meta[r] ?? 0));
  }

  /** The hero to play as, falling back to Ember if the chosen one was refunded. */
  get activeHero(): HeroId {
    return heroAvailable(this.data.hero, this.data.meta) ? this.data.hero : 'ember';
  }

  buyMeta(id: MetaId) {
    const def = META_BY_ID[id];
    const rank = this.data.meta[id] ?? 0;
    if (rank >= def.max || this.availableStarlight < def.costs[rank] || this.missingFor(id).length) return false;
    this.data.meta[id] = rank + 1;
    this.write();
    return true;
  }

  refundMeta() {
    this.data.meta = {};
    this.write();
  }
}
