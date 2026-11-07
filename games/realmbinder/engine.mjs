// Realmbinder engine: packs, copies, prices, the shop and the save. Pure functions over a
// plain, JSON-safe save; no DOM. Time is passed in as `now` (ms) so everything is testable.

import { CARDS, CARD_BY_ID, RARITIES, SET, byRarity } from './data.mjs';

export { CARDS, CARD_BY_ID, RARITIES, SET };

export const HOUR = 3600e3;
export const DAY = 24 * HOUR;
export const SHIFT_MS = 4 * HOUR; // the shop restocks every four hours
export const PACK_SIZE = 10;
export const STARTING_GOLD = 1000;
export const STARTING_PACKS = 3;
export const ALLOWANCE_PER_HOUR = 30;
export const ALLOWANCE_CAP = 360;
export const SHELF_SLOTS = 8;
export const BUY_RATE = 0.45; // the shop pays 45% of market for your cards
export const CASE_MARKUP = 1.25; // and sells singles at a premium

// Rare slot odds: Rare 85%, Legendary 12.5%, Mythic 2.5% (about one in forty packs).
export const RARE_SLOT = Object.freeze([['R', 0.85], ['L', 0.125], ['M', 0.025]]);
export const FOIL_PACK_CHANCE = 0.3; // a foil replaces one common
export const FOIL_SLOT = Object.freeze([['C', 0.55], ['U', 0.3], ['R', 0.12], ['L', 0.025], ['M', 0.005]]);
export const GILDED_CHANCE = 0.06; // a Legendary or Mythic pull can come gilded (alt art frame)

export const CONDITIONS = Object.freeze({
  M: { key: 'M', name: 'Mint', mult: 1.25 },
  NM: { key: 'NM', name: 'Near Mint', mult: 1 },
  EX: { key: 'EX', name: 'Excellent', mult: 0.8 },
  LP: { key: 'LP', name: 'Lightly Played', mult: 0.6 },
});
const COND_ODDS = [['M', 0.18], ['NM', 0.6], ['EX', 0.16], ['LP', 0.06]];
export const PRINT_RUN = Object.freeze({ C: 9999, U: 6000, R: 2500, L: 800, M: 250 });

// ---------- randomness ----------
export function mulberry(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function hash(...parts) {
  const s = parts.join('|');
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return h >>> 0;
}
const pick = (rng, list) => list[Math.floor(rng() * list.length)];
function weighted(rng, table) {
  let r = rng();
  for (const [v, w] of table) { if ((r -= w) < 0) return v; }
  return table[table.length - 1][0];
}

// ---------- prices ----------
// Market prices drift day to day: a smooth wobble per card between seeded knots every 3 days.
function knot(cardId, k) { return mulberry(hash('drift', cardId, k))() * 2 - 1; }
export function drift(cardId, now) {
  const t = now / (3 * DAY);
  const k = Math.floor(t), f = t - k;
  const s = f * f * (3 - 2 * f);
  return 1 + 0.18 * (knot(cardId, k) * (1 - s) + knot(cardId, k + 1) * s);
}
export function marketPrice(cardId, now) {
  const c = CARD_BY_ID[cardId];
  const v = RARITIES[c.rarity].base * c.pop * drift(cardId, now);
  return Math.max(1, Math.round(v));
}
export function variantMult(copy) {
  return (copy.gilded ? 4 : copy.foil ? 3 : 1) * CONDITIONS[copy.cond].mult;
}
export function copyValue(copy, now) {
  return Math.max(1, Math.round(marketPrice(copy.card, now) * variantMult(copy)));
}
export const sellPrice = (copy, now) => Math.max(1, Math.floor(copyValue(copy, now) * BUY_RATE));
// Price trend over the last day, as a fraction (+0.05 = up 5%).
export const trend = (cardId, now) => marketPrice(cardId, now) / marketPrice(cardId, now - DAY) - 1;

// ---------- copies ----------
// A copy is one physical card: which card, foil or not, gilded or not, its condition and print number.
export function makeCopy(cardId, rng, { foil = false, gilded = false } = {}) {
  const c = CARD_BY_ID[cardId];
  return {
    card: cardId,
    foil: !!foil,
    gilded: !!gilded,
    cond: weighted(rng, COND_ODDS),
    print: 1 + Math.floor(rng() * PRINT_RUN[c.rarity]),
  };
}
const fromRarity = (rng, r) => pick(rng, byRarity(r)).id;

// One booster: 6 commons, 3 uncommons and a rare slot, with a foil sometimes replacing a common.
// Returned in reveal order: commons, uncommons, the foil, then the rare slot last.
export function rollPack(rng) {
  const out = [];
  const foil = rng() < FOIL_PACK_CHANCE;
  const commons = foil ? 5 : 6;
  const seen = new Set();
  const draw = r => {
    for (let tries = 0; tries < 20; tries++) {
      const id = fromRarity(rng, r);
      if (!seen.has(id)) { seen.add(id); return id; }
    }
    return fromRarity(rng, r);
  };
  for (let i = 0; i < commons; i++) out.push(makeCopy(draw('C'), rng));
  for (let i = 0; i < 3; i++) out.push(makeCopy(draw('U'), rng));
  if (foil) {
    const r = weighted(rng, FOIL_SLOT);
    out.push(makeCopy(fromRarity(rng, r), rng, { foil: true }));
  }
  const r = weighted(rng, RARE_SLOT);
  const gilded = (r === 'L' || r === 'M') && rng() < GILDED_CHANCE;
  out.push(makeCopy(draw(r), rng, { gilded, foil: gilded }));
  return out;
}

// ---------- save ----------
export function newSave(now, seed = Math.floor(Math.random() * 2 ** 31)) {
  return {
    v: 1,
    seed,
    created: now,
    gold: STARTING_GOLD,
    packs: STARTING_PACKS,
    copies: [],
    nextUid: 1,
    shelf: Array(SHELF_SLOTS).fill(null),
    allowanceAt: now,
    shop: { shift: shiftOf(now), packsBought: 0, boxBought: false, caseSold: [] },
    stats: { opened: 0, bought: 0, sold: 0, earned: 0, spent: 0, best: null },
    log: [],
  };
}

export function validSave(s) {
  if (!s || typeof s !== 'object' || s.v !== 1) return false;
  if (!Number.isFinite(s.gold) || s.gold < 0 || !Number.isInteger(s.packs) || s.packs < 0) return false;
  if (!Array.isArray(s.copies) || !Array.isArray(s.shelf) || s.shelf.length !== SHELF_SLOTS) return false;
  if (!s.shop || !s.stats || !Number.isFinite(s.allowanceAt)) return false;
  return s.copies.every(c => c && Number.isInteger(c.uid) && CARD_BY_ID[c.card] && CONDITIONS[c.cond]);
}

function addCopy(s, copy, now, how) {
  const full = { uid: s.nextUid++, ...copy, got: now, how };
  s.copies.push(full);
  return full;
}
function note(s, text, now) {
  s.log.unshift({ t: now, text });
  if (s.log.length > 40) s.log.length = 40;
}
const rngFor = (s, ...parts) => mulberry(hash(s.seed, ...parts));

export function openPack(s, now) {
  if (s.packs < 1) return { ok: false, error: 'No packs to open' };
  const rng = rngFor(s, 'pack', s.stats.opened, s.nextUid);
  const owned = new Set(s.copies.map(c => c.card));
  const pulled = rollPack(rng).map(c => {
    const isNew = !owned.has(c.card);
    owned.add(c.card);
    return { ...addCopy(s, c, now, 'pack'), isNew };
  });
  s.packs--;
  s.stats.opened++;
  const top = pulled.reduce((a, b) => (copyValue(b, now) > copyValue(a, now) ? b : a));
  if (!s.stats.best || copyValue(top, now) > s.stats.best.value) {
    s.stats.best = { uid: top.uid, card: top.card, value: copyValue(top, now) };
  }
  const big = pulled.filter(c => RARITIES[CARD_BY_ID[c.card].rarity].rank >= 3);
  for (const c of big) note(s, `Pulled ${CARD_BY_ID[c.card].name}${c.gilded ? ' (Gilded)' : c.foil ? ' (Foil)' : ''}`, now);
  return { ok: true, pulled };
}

// ---------- the shop ----------
export const shiftOf = now => Math.floor(now / SHIFT_MS);
export const nextRestock = now => (shiftOf(now) + 1) * SHIFT_MS;

const KEEPER_LINES = [
  'Fresh crates came in on the morning cart. Mind the dust.',
  'A traveller swore he pulled a Mythic in here last week. Swore a lot, that one.',
  'The Conclave folk bought up half my rares. Wizards. Honestly.',
  'Kettle’s on. Take your time, dear.',
  'I hear prices on Horde cards are climbing. Can’t think why anyone wants them.',
  'If you find the Sundered Crown, you come show me first. Promise?',
  'Quiet day. Good day for opening packs, I always say.',
  'Don’t lick the foils. You would be surprised how often I have to say it.',
];

// The shop's stock for one shift. Same shift + same save seed = same stock.
export function shopStock(s, now) {
  const shift = shiftOf(now);
  const rng = mulberry(hash(s.seed, 'shop', shift));
  const packPrice = 110 + Math.floor(rng() * 6) * 5; // 110..135
  const packs = 8 + Math.floor(rng() * 9); // 8..16
  const hasBox = rng() < 0.4;
  const box = hasBox ? { packs: 12, price: Math.round(packPrice * 12 * 0.85 / 5) * 5 } : null;
  const caseRarities = ['U', 'R', 'R', 'R', weighted(rng, [['R', 0.5], ['L', 0.45], ['M', 0.05]]), weighted(rng, [['U', 0.4], ['R', 0.4], ['L', 0.2]])];
  const glass = caseRarities.map((r, i) => {
    const copy = makeCopy(fromRarity(rng, r), rng, { foil: rng() < 0.15 });
    return { slot: i, copy, price: Math.max(5, Math.round(copyValue(copy, now) * CASE_MARKUP)) };
  });
  return {
    shift,
    packPrice,
    packs,
    box,
    glass,
    line: KEEPER_LINES[shift % KEEPER_LINES.length],
    restock: nextRestock(now),
  };
}

function syncShop(s, now) {
  const shift = shiftOf(now);
  if (s.shop.shift !== shift) s.shop = { shift, packsBought: 0, boxBought: false, caseSold: [] };
}

// What is left on the shelves for this player right now.
export function shopView(s, now) {
  syncShop(s, now);
  const st = shopStock(s, now);
  return {
    ...st,
    packsLeft: Math.max(0, st.packs - s.shop.packsBought),
    boxLeft: !!st.box && !s.shop.boxBought,
    glass: st.glass.map(g => ({ ...g, sold: s.shop.caseSold.includes(g.slot) })),
  };
}

function spend(s, amount) {
  if (s.gold < amount) return false;
  s.gold -= amount;
  s.stats.spent += amount;
  return true;
}

export function buyPacks(s, now, n = 1) {
  const v = shopView(s, now);
  if (n < 1 || v.packsLeft < n) return { ok: false, error: 'Not enough packs on the shelf' };
  if (!spend(s, v.packPrice * n)) return { ok: false, error: 'Not enough gold' };
  s.shop.packsBought += n;
  s.packs += n;
  s.stats.bought += n;
  return { ok: true, cost: v.packPrice * n };
}

export function buyBox(s, now) {
  const v = shopView(s, now);
  if (!v.boxLeft) return { ok: false, error: 'No booster box this shift' };
  if (!spend(s, v.box.price)) return { ok: false, error: 'Not enough gold' };
  s.shop.boxBought = true;
  s.packs += v.box.packs;
  s.stats.bought += v.box.packs;
  note(s, `Bought a booster box (${v.box.packs} packs)`, now);
  return { ok: true, cost: v.box.price };
}

export function buySingle(s, now, slot) {
  const v = shopView(s, now);
  const g = v.glass.find(x => x.slot === slot);
  if (!g || g.sold) return { ok: false, error: 'That card is gone' };
  if (!spend(s, g.price)) return { ok: false, error: 'Not enough gold' };
  s.shop.caseSold.push(slot);
  const copy = addCopy(s, g.copy, now, 'shop');
  note(s, `Bought ${CARD_BY_ID[copy.card].name} for ${g.price}g`, now);
  return { ok: true, copy, cost: g.price };
}

export function sellCopy(s, now, uid) {
  const i = s.copies.findIndex(c => c.uid === uid);
  if (i < 0) return { ok: false, error: 'Card not found' };
  const [copy] = s.copies.splice(i, 1);
  const price = sellPrice(copy, now);
  s.gold += price;
  s.stats.earned += price;
  s.stats.sold++;
  s.shelf = s.shelf.map(u => (u === uid ? null : u));
  return { ok: true, price, copy };
}

// Duplicates: for every card you own more than one of, everything except the most valuable copy
// (shelved copies are never sold).
export function duplicates(s, now) {
  const groups = new Map();
  for (const c of s.copies) {
    if (!groups.has(c.card)) groups.set(c.card, []);
    groups.get(c.card).push(c);
  }
  const shelved = new Set(s.shelf.filter(Boolean));
  const out = [];
  for (const list of groups.values()) {
    if (list.length < 2) continue;
    const keep = list.reduce((a, b) => (shelved.has(b.uid) || (!shelved.has(a.uid) && copyValue(b, now) > copyValue(a, now)) ? b : a));
    for (const c of list) if (c !== keep && !shelved.has(c.uid)) out.push(c);
  }
  return out;
}

export function sellDuplicates(s, now, { maxRank = 2 } = {}) {
  const list = duplicates(s, now).filter(c => RARITIES[CARD_BY_ID[c.card].rarity].rank <= maxRank);
  let total = 0;
  for (const c of list) total += sellCopy(s, now, c.uid).price;
  return { ok: true, count: list.length, total };
}

// ---------- allowance ----------
export function allowance(s, now) {
  const hours = Math.max(0, now - s.allowanceAt) / HOUR;
  return Math.min(ALLOWANCE_CAP, Math.floor(hours * ALLOWANCE_PER_HOUR));
}
export function claimAllowance(s, now) {
  const amount = allowance(s, now);
  if (amount < 1) return { ok: false, error: 'Nothing to collect yet' };
  s.gold += amount;
  s.stats.earned += amount;
  s.allowanceAt = amount >= ALLOWANCE_CAP ? now : s.allowanceAt + (amount / ALLOWANCE_PER_HOUR) * HOUR;
  return { ok: true, amount };
}

// ---------- shelf ----------
export function shelve(s, uid, slot) {
  if (!s.copies.some(c => c.uid === uid)) return { ok: false, error: 'Card not found' };
  if (slot == null) slot = s.shelf.indexOf(null);
  if (slot < 0 || slot >= SHELF_SLOTS) return { ok: false, error: 'The shelf is full' };
  s.shelf = s.shelf.map(u => (u === uid ? null : u));
  s.shelf[slot] = uid;
  return { ok: true, slot };
}
export function unshelve(s, uid) {
  s.shelf = s.shelf.map(u => (u === uid ? null : u));
  return { ok: true };
}

// ---------- collection reads ----------
export function owned(s) {
  const m = new Map();
  for (const c of s.copies) {
    if (!m.has(c.card)) m.set(c.card, []);
    m.get(c.card).push(c);
  }
  return m;
}
// The copy to show in the binder: gilded beats foil beats plain, then condition.
export function showcase(list, now) {
  return list.reduce((a, b) => (copyValue(b, now) > copyValue(a, now) ? b : a));
}
export function collectionValue(s, now) {
  return s.copies.reduce((t, c) => t + copyValue(c, now), 0);
}
export function completion(s) {
  const have = new Set(s.copies.map(c => c.card));
  return { have: have.size, total: CARDS.length };
}
