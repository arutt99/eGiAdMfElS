import test from 'node:test';
import assert from 'node:assert/strict';
import { allCards, newGame, act, score, stack, options, botAction, validSave, SUITS } from '../games/pirates/engine.mjs';

const card = id => allCards().find(c => c.id === id);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function scene({ draw = ['mermaid-8'], play = [], banks = [[], []], discard, active = 0, forced = 0 } = {}) {
  const s = newGame(rng(1));
  s.deck = [...draw].reverse().map(card); s.play = play.map(card); s.banks = banks.map(b => b.map(card)); s.active = active; s.forced = forced;
  const used = [...draw, ...play, ...banks.flat()];
  s.discard = (discard || allCards().filter(c => !used.includes(c.id)).map(c => c.id)).map(card);
  s.seenDraw = allCards().filter(c => c.value > (c.suit === 'mermaid' ? 4 : 2) && !draw.includes(c.id)).map(c => c.id);
  return s;
}
function draw(s) { assert.equal(act(s, { type: 'draw' }, rng(3)), true); }
function choose(s, id) { assert.equal(act(s, { type: 'choose', id }, rng(4)), true); }
function collect(s) { assert.equal(act(s, { type: 'collect' }, rng(5)), true); }

test('setup uses exactly 60 unique cards, ten low discards and 50 draws', () => {
  const s = newGame(); assert.ok(validSave(s)); assert.equal(s.deck.length, 50); assert.equal(s.discard.length, 10);
  for (const suit of SUITS) { assert.equal(allCards().filter(c => c.suit === suit.id).length, 6); assert.equal(s.discard.find(c => c.suit === suit.id).value, suit.id === 'mermaid' ? 4 : 2); }
});
test('only top cards score, and lower cards remain publicly inspectable', () => {
  const bank = ['key-3', 'key-7', 'key-5', 'mermaid-9'].map(card);
  assert.equal(score(bank), 16); assert.deepEqual(stack(bank, 'key').map(c => c.value), [7, 5, 3]);
});
test('collect requires a first card and cannot interrupt a forced ability', () => {
  const s = scene({ draw: ['hook-5', 'key-4'], banks: [['mermaid-9'], []] });
  assert.equal(act(s, { type: 'collect' }), false); draw(s);
  assert.equal(act(s, { type: 'collect' }), false); assert.equal(act(s, { type: 'draw' }), false);
  assert.equal(act(s, { type: 'choose', id: 'key-4' }), false);
  choose(s, 'mermaid-9'); collect(s); assert.equal(score(s.banks[0]), 14); assert.ok(validSave(s));
});
test('duplicate suit busts without activating the duplicate ability', () => {
  const s = scene({ draw: ['cannon-7'], play: ['cannon-3'], banks: [[], ['key-7']] });
  draw(s); assert.equal(s.phase, 'over'); assert.equal(s.result.busted, true); assert.equal(s.banks[1].length, 1); assert.equal(s.choice, null);
});
test('Anchor protects only preceding cards, including when a second Anchor busts', () => {
  const s = scene({ play: ['mermaid-9', 'anchor-4', 'key-6'], draw: ['anchor-7'] });
  draw(s); assert.deepEqual(s.banks[0].map(c => c.id), ['mermaid-9']); assert.equal(s.result.lost.length, 3); assert.ok(validSave(s));
});
test('a duplicate Hook is mandatory even if it busts and loses the bank card', () => {
  const s = scene({ draw: ['hook-7'], banks: [['hook-4'], []] }); draw(s);
  assert.deepEqual(options(s).map(c => c.id), ['hook-4']); choose(s, 'hook-4');
  assert.equal(s.result.busted, true); assert.equal(s.banks[0].length, 0); assert.ok(validSave(s));
});
test('Sword eligibility depends on bank suits, not the current play area', () => {
  const s = scene({ draw: ['sword-7'], play: ['key-6'], banks: [['anchor-3'], ['anchor-7', 'key-7']] }); draw(s);
  assert.deepEqual(options(s).map(c => c.id), ['key-7']); choose(s, 'key-7');
  assert.equal(s.result.busted, true); assert.deepEqual(s.banks[1].map(c => c.id), ['anchor-7']);
});
test('Cannon discards only the top card, exposing the lower score', () => {
  const s = scene({ draw: ['cannon-4'], banks: [[], ['key-7', 'key-5']] }); draw(s);
  assert.deepEqual(options(s).map(c => c.id), ['key-7']); choose(s, 'key-7');
  assert.equal(score(s.banks[1]), 5); assert.equal(s.play.length, 1); assert.equal(s.discard.some(c => c.id === 'key-7'), true); collect(s); assert.ok(validSave(s));
});
test('Map reveals at most three discards, returns the unchosen cards and activates the chosen card', () => {
  const s = scene({ draw: ['map-7', 'key-3'], discard: ['oracle-4', 'mermaid-5', 'anchor-6'] }); draw(s);
  assert.equal(options(s).length, 3); assert.equal(s.discard.length, 0); choose(s, 'oracle-4');
  assert.equal(s.discard.length, 2); assert.equal(s.oracle, true); assert.equal(s.play.length, 2);
});
test('Map still requires a choice when every card will bust', () => {
  const s = scene({ draw: ['map-7'], discard: ['map-3'] }); draw(s);
  assert.equal(act(s, { type: 'collect' }), false); choose(s, 'map-3'); assert.equal(s.result.busted, true);
});
test('missing targets and empty discard nullify abilities', () => {
  for (const suit of ['hook', 'sword', 'cannon', 'map']) {
    const s = scene({ draw: [`${suit}-7`], discard: [] }); draw(s); assert.equal(s.choice, null); collect(s); assert.equal(s.phase, 'over');
  }
});
test('Key and Chest collect an equal number of bonus cards without activating them', () => {
  const s = scene({ play: ['key-7', 'chest-7'], discard: ['kraken-4', 'hook-4'] }); collect(s);
  assert.equal(s.result.bonus.length, 2); assert.equal(s.banks[0].length, 4); assert.equal(s.choice, null); assert.equal(s.forced, 0);
});
test('bonus is capped by discard size and an unpaired Key has no bonus', () => {
  const a = scene({ play: ['key-7', 'chest-7', 'mermaid-9'], discard: ['cannon-4'] }); collect(a); assert.equal(a.result.bonus.length, 1);
  const b = scene({ play: ['key-7'] }); collect(b); assert.equal(b.result.bonus.length, 0);
});
test('Anchor-protected Key and Chest earn bonus, an unprotected partner does not', () => {
  const a = scene({ draw: ['key-3'], play: ['key-7', 'chest-7', 'anchor-4'], discard: ['mermaid-4', 'hook-2'] }); draw(a); assert.equal(a.result.bonus.length, 2);
  const b = scene({ draw: ['key-3'], play: ['key-7', 'anchor-4', 'chest-7'], discard: ['mermaid-4', 'hook-2'] }); draw(b); assert.equal(b.result.bonus.length, 0);
});
test('Kraken requires two additional cards; replayed cards count', () => {
  const s = scene({ draw: ['kraken-7', 'hook-6', 'key-3'], banks: [['mermaid-9'], []] }); draw(s);
  assert.equal(s.forced, 2); assert.equal(act(s, { type: 'collect' }), false); draw(s); assert.equal(s.forced, 1);
  choose(s, 'mermaid-9'); assert.equal(s.forced, 0); collect(s); assert.equal(s.result.kept.length, 3); assert.equal(s.deck.length, 1); assert.ok(validSave(s));
});
test('Kraken at the end of the draw pile finishes without impossible draws', () => {
  const s = scene({ draw: ['kraken-7', 'mermaid-9'] }); draw(s); draw(s); collect(s); assert.equal(s.phase, 'over');
});
test('last-card abilities resolve completely before game end', () => {
  const s = scene({ draw: ['sword-7'], banks: [[], ['map-7']], discard: ['hook-6'] }); draw(s);
  assert.equal(s.phase, 'play'); choose(s, 'map-7'); assert.equal(s.choice.type, 'map'); choose(s, 'hook-6');
  assert.equal(s.choice, null); collect(s); assert.equal(s.phase, 'over'); assert.equal(s.result.kept.length, 3);
});
test('Oracle reveals safely and is hidden again when a turn ends', () => {
  const s = scene({ draw: ['oracle-7', 'mermaid-9'] }); draw(s); assert.equal(s.oracle, true); collect(s);
  assert.equal(s.oracle, false); act(s, { type: 'next' }); assert.equal(s.deck.at(-1).id, 'mermaid-9');
});
test('score ties use total bank cards, then share victory', () => {
  const a = scene({ draw: [], play: ['key-7'], banks: [[], ['chest-7', 'chest-3']] }); collect(a); assert.equal(a.winner, 1);
  const b = scene({ draw: [], play: ['key-7'], banks: [[], ['chest-7']] }); collect(b); assert.equal(b.winner, -1);
});
test('bot choices do not change when unseen deck order changes', () => {
  const s = scene({ draw: ['mermaid-9', 'key-3', 'anchor-5', 'chest-6'], play: ['key-7'] });
  const a = botAction(s); s.deck.reverse(); assert.deepEqual(botAction(s), a);
  s.oracle = true; s.deck = [card('mermaid-9'), card('key-3')]; assert.equal(botAction(s).type, 'collect');
});
test('bot targets maximum Cannon damage and avoids a busting choice when safe loot exists', () => {
  const s = scene({ draw: ['cannon-7'], banks: [[], ['key-7', 'key-6', 'chest-5']] }); draw(s); assert.equal(botAction(s).id, 'chest-5');
  const t = scene({ draw: ['map-7'], play: ['key-5'], discard: ['key-7', 'mermaid-9'] }); draw(t); assert.equal(botAction(t).id, 'mermaid-9');
});
test('invalid or corrupt saves are rejected', () => {
  assert.equal(validSave(null), false); assert.equal(validSave({}), false);
  const s = newGame(); s.deck[0] = s.deck[1]; assert.equal(validSave(s), false);
});
test('500 complete seeded matches preserve all 60 cards, legal actions and resumable state', () => {
  const seen = new Set(); let busts = 0, bonuses = 0;
  for (let seed = 1; seed <= 500; seed++) {
    const random = rng(seed); let s = newGame(random), moves = 0;
    while (s.phase !== 'over' && moves++ < 1000) {
      if (s.choice) seen.add(s.choice.type);
      assert.ok(validSave(s), `invalid state for seed ${seed}, move ${moves}`);
      // Alternate strong bot decisions with a more adventurous legal policy.
      let action = botAction(s);
      if (seed % 2 === 0 && s.phase === 'play' && !s.choice && s.deck.length && random() < .35) action = { type: 'draw' };
      assert.ok(act(s, action, random), `illegal action for seed ${seed}`);
      if (s.phase === 'turnEnd' || s.phase === 'over') { if (s.result.busted) busts++; if (s.result.bonus.length) bonuses++; }
      s = JSON.parse(JSON.stringify(s));
    }
    assert.equal(s.phase, 'over', `match ${seed} did not end`); assert.ok(validSave(s));
    assert.equal(s.deck.length, 0); assert.ok([-1, 0, 1].includes(s.winner));
  }
  assert.deepEqual([...seen].sort(), ['cannon', 'hook', 'map', 'sword']); assert.ok(busts > 500); assert.ok(bonuses > 100);
});
