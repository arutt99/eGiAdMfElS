import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CARDS, CARD_BY_ID, RARITIES, SET, HOUR, BUY_RATE, SHIFT_MS, PACK_SIZE, STARTING_GOLD, STARTING_PACKS, ALLOWANCE_CAP, SHELF_SLOTS,
  mulberry, rollPack, newSave, validSave, openPack, shopView, buyPacks, buyBox, buySingle, sellCopy, duplicates,
  sellDuplicates, allowance, claimAllowance, shelve, copyValue, marketPrice, sellPrice, completion,
} from '../games/realmbinder/engine.mjs';
import { cardArt } from '../games/realmbinder/art.mjs';

const T0 = Date.UTC(2026, 10, 7, 9, 0, 0);

test('the set has 130 unique cards with the planned rarity spread', () => {
  assert.equal(CARDS.length, SET.size);
  assert.equal(new Set(CARDS.map(c => c.id)).size, SET.size);
  assert.equal(new Set(CARDS.map(c => c.name)).size, SET.size);
  const count = r => CARDS.filter(c => c.rarity === r).length;
  assert.deepEqual([count('C'), count('U'), count('R'), count('L'), count('M')], [60, 36, 20, 10, 4]);
  for (const c of CARDS) {
    assert.ok(c.flavor.length > 10, `${c.name} has flavor text`);
    assert.ok(c.cost >= 1 && c.cost <= 9);
  }
});

test('every card draws art with no broken numbers', () => {
  for (const c of CARDS) {
    const svg = cardArt(c);
    assert.ok(svg.startsWith('<svg') && svg.endsWith('</svg>'), c.name);
    assert.ok(!/NaN|undefined/.test(svg), `${c.name} art has NaN/undefined`);
    assert.equal(cardArt(c), svg, 'art is deterministic');
  }
});

test('a pack has 10 cards: commons, 3 uncommons, and a rare-or-better last', () => {
  const rng = mulberry(42);
  for (let i = 0; i < 300; i++) {
    const p = rollPack(rng);
    assert.equal(p.length, PACK_SIZE);
    const rs = p.map(c => CARD_BY_ID[c.card].rarity);
    assert.ok(RARITIES[rs[9]].rank >= 2, 'last card is Rare+');
    assert.equal(rs.filter((r, k) => r === 'U' && k < 9 && !p[k].foil).length, 3);
    const foils = p.filter(c => c.foil && !c.gilded).length;
    assert.ok(foils <= 1);
  }
});

test('pull rates land near the published odds and a pack is a fair gamble', () => {
  const rng = mulberry(7);
  const N = 20000;
  const top = { R: 0, L: 0, M: 0 };
  let value = 0;
  for (let i = 0; i < N; i++) {
    const p = rollPack(rng);
    top[CARD_BY_ID[p[9].card].rarity]++;
    value += p.reduce((a, c) => a + copyValue(c, T0), 0);
  }
  assert.ok(Math.abs(top.M / N - 0.025) < 0.006, `mythic rate ${top.M / N}`);
  assert.ok(Math.abs(top.L / N - 0.125) < 0.015, `legendary rate ${top.L / N}`);
  const ev = value / N;
  // Worth more than a pack on the open market, but less than a pack if you sell it all back to the shop.
  assert.ok(ev > 120 && ev * BUY_RATE < 110, `expected pack value ${ev.toFixed(1)}`);
});

test('a new save starts with gold and packs and validates', () => {
  const s = newSave(T0, 1);
  assert.equal(s.gold, STARTING_GOLD);
  assert.equal(s.packs, STARTING_PACKS);
  assert.ok(validSave(s));
  assert.ok(validSave(JSON.parse(JSON.stringify(s))));
  assert.equal(validSave({ ...s, gold: -5 }), false);
  assert.equal(validSave({ ...s, copies: [{ uid: 1, card: 'nope', cond: 'M' }] }), false);
});

test('opening a pack adds 10 copies with unique ids and marks new cards', () => {
  const s = newSave(T0, 3);
  const r = openPack(s, T0);
  assert.ok(r.ok);
  assert.equal(s.packs, STARTING_PACKS - 1);
  assert.equal(s.copies.length, 10);
  assert.equal(new Set(s.copies.map(c => c.uid)).size, 10);
  assert.ok(r.pulled.every(c => c.isNew));
  assert.ok(s.stats.best && s.stats.best.value > 0);
  openPack(s, T0); openPack(s, T0);
  assert.equal(openPack(s, T0).ok, false);
});

test('the shop restocks each shift and is the same for the same shift', () => {
  const s = newSave(T0, 5);
  const a = shopView(s, T0), b = shopView(s, T0 + 60e3);
  assert.deepEqual(a.glass.map(g => g.copy), b.glass.map(g => g.copy));
  let differs = false;
  for (let k = 1; k < 6; k++) {
    const c = shopView(s, T0 + k * SHIFT_MS);
    if (JSON.stringify(c.glass.map(g => g.copy.card)) !== JSON.stringify(a.glass.map(g => g.copy.card))) differs = true;
  }
  assert.ok(differs);
  assert.ok(a.packs >= 8 && a.packs <= 16 && a.packPrice >= 110 && a.packPrice <= 135);
});

test('buying spends gold, respects stock, and resets next shift', () => {
  const s = newSave(T0, 9);
  const v = shopView(s, T0);
  const r = buyPacks(s, T0, 2);
  assert.ok(r.ok);
  assert.equal(s.gold, STARTING_GOLD - v.packPrice * 2);
  assert.equal(s.packs, STARTING_PACKS + 2);
  assert.equal(shopView(s, T0).packsLeft, v.packs - 2);
  s.gold = 1e6;
  assert.ok(buyPacks(s, T0, v.packs - 2).ok);
  assert.equal(buyPacks(s, T0, 1).ok, false);
  assert.equal(shopView(s, T0 + SHIFT_MS).packsLeft, shopView(s, T0 + SHIFT_MS).packs);
  const single = buySingle(s, T0, 0);
  assert.ok(single.ok);
  assert.equal(buySingle(s, T0, 0).ok, false, 'a single sells once');
  const poor = newSave(T0, 9); poor.gold = 0;
  assert.equal(buyPacks(poor, T0, 1).error, 'Not enough gold');
  // Find a shift with a box and buy it once.
  let t = T0;
  while (!shopView(s, t).box) t += SHIFT_MS;
  const before = s.packs;
  assert.ok(buyBox(s, t).ok);
  assert.equal(s.packs, before + 12);
  assert.equal(buyBox(s, t).ok, false);
});

test('selling pays the buy rate and duplicates keep the best and shelved copies', () => {
  const s = newSave(T0, 11);
  s.packs = 30;
  for (let i = 0; i < 30; i++) openPack(s, T0);
  const one = s.copies[0];
  const gold = s.gold;
  const price = sellPrice(one, T0);
  assert.equal(price, Math.max(1, Math.floor(copyValue(one, T0) * BUY_RATE)));
  assert.ok(sellCopy(s, T0, one.uid).ok);
  assert.equal(s.gold, gold + price);

  const d = duplicates(s, T0);
  const shelvedDupe = d[0];
  shelve(s, shelvedDupe.uid, 0);
  const haveBefore = completion(s).have;
  const res = sellDuplicates(s, T0, { maxRank: 4 });
  assert.ok(res.count > 0);
  assert.equal(completion(s).have, haveBefore, 'no card is lost from the binder');
  assert.ok(s.copies.some(c => c.uid === shelvedDupe.uid), 'shelved copy kept');
  const counts = new Map();
  for (const c of s.copies) counts.set(c.card, (counts.get(c.card) || 0) + 1);
  for (const [card, n] of counts) assert.ok(n === 1 || (n === 2 && s.shelf.some(u => s.copies.find(c => c.uid === u)?.card === card)));
});

test('the allowance accrues by the hour up to a cap', () => {
  const s = newSave(T0, 2);
  assert.equal(allowance(s, T0), 0);
  assert.equal(allowance(s, T0 + 2 * HOUR), 60);
  assert.equal(allowance(s, T0 + 100 * HOUR), ALLOWANCE_CAP);
  const r = claimAllowance(s, T0 + 2 * HOUR);
  assert.equal(r.amount, 60);
  assert.equal(s.gold, STARTING_GOLD + 60);
  assert.equal(claimAllowance(s, T0 + 2 * HOUR).ok, false);
});

test('the shelf holds eight cards and a sold card leaves it', () => {
  const s = newSave(T0, 4);
  openPack(s, T0);
  for (let i = 0; i < SHELF_SLOTS; i++) assert.ok(shelve(s, s.copies[i].uid).ok);
  assert.equal(shelve(s, s.copies[8].uid).ok, false);
  sellCopy(s, T0, s.copies[0].uid);
  assert.equal(s.shelf.filter(u => u != null).length, SHELF_SLOTS - 1);
});

test('market prices drift but stay near the rarity base', () => {
  for (const c of CARDS) {
    for (let d = 0; d < 10; d++) {
      const p = marketPrice(c.id, T0 + d * 24 * HOUR);
      const base = RARITIES[c.rarity].base;
      assert.ok(p >= base * 0.5 && p <= base * 2.1, `${c.name} ${p}`);
    }
  }
});
