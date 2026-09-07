import test from 'node:test';
import assert from 'node:assert/strict';
import { allCards, lowValue, newGame, act, score, stack, options, choiceZone, botAction, validSave, SUITS, TRAITS, traitPool } from '../games/pirates/engine.mjs';

const card = id => allCards().find(c => c.id === id);
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function scene({ draw = ['mermaid-8'], play = [], banks = [[], []], discard, active = 0, forced = 0, variants = {}, traits } = {}) {
  const s = newGame(rng(1), variants);
  const deck = allCards(Boolean(variants.mermaid)), find = id => deck.find(c => c.id === id);
  s.deck = [...draw].reverse().map(find); s.play = play.map(find); s.banks = banks.map(b => b.map(find)); s.active = active; s.forced = forced;
  const used = [...draw, ...play, ...banks.flat()];
  s.discard = (discard || deck.filter(c => !used.includes(c.id)).map(c => c.id)).map(find);
  s.seenDraw = deck.filter(c => c.value > lowValue(c.suit, Boolean(variants.mermaid)) && !draw.includes(c.id)).map(c => c.id);
  if (traits) { s.traits = traits; s.phase = 'play'; }
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
test('Oracle reveals only the next card and is hidden after that draw or collect', () => {
  const s = scene({ draw: ['oracle-7', 'mermaid-9', 'key-3'] }); draw(s); assert.equal(s.oracle, true);
  draw(s); assert.equal(s.oracle, false); assert.equal(s.play.at(-1).id, 'mermaid-9');
  collect(s); act(s, { type: 'next' }); assert.equal(s.deck.at(-1).id, 'key-3');
  const t = scene({ draw: ['oracle-7', 'mermaid-9'] }); draw(t); assert.equal(t.oracle, true); collect(t); assert.equal(t.oracle, false);
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

// The Mermaid variant: Mermaids drop to 2-7 and gain a replay ability.
test('the Mermaid variant swaps in the low Mermaids and levels the suit', () => {
  const s = newGame(rng(2), { mermaid: true });
  assert.ok(validSave(s)); assert.equal(s.deck.length, 50); assert.equal(s.discard.length, 10);
  assert.equal(s.discard.find(c => c.suit === 'mermaid').value, 2);
  assert.deepEqual([...s.deck, ...s.discard].filter(c => c.suit === 'mermaid').map(c => c.value).sort(), [2, 3, 4, 5, 6, 7]);
});
test('a Mermaid replays an earlier card, moving it to the right and firing its ability', () => {
  const s = scene({ variants: { mermaid: true }, draw: ['mermaid-7'], play: ['cannon-3', 'key-4'], banks: [[], ['chest-6', 'chest-5']] });
  draw(s); assert.equal(s.choice.type, 'mermaid');
  assert.deepEqual(choiceZone(s), { zone: 'play' });
  assert.deepEqual(options(s).map(c => c.id), ['cannon-3', 'key-4']);
  choose(s, 'cannon-3');
  assert.deepEqual(s.play.map(c => c.id), ['key-4', 'mermaid-7', 'cannon-3']);
  assert.equal(s.choice.type, 'cannon'); choose(s, 'chest-6'); assert.equal(score(s.banks[1]), 5);
});
test('an Anchor replayed by a Mermaid protects everything now to its left', () => {
  const s = scene({ variants: { mermaid: true }, draw: ['mermaid-7', 'key-3'], play: ['anchor-4', 'key-5'] });
  draw(s); choose(s, 'anchor-4');
  assert.deepEqual(s.play.map(c => c.id), ['key-5', 'mermaid-7', 'anchor-4']);
  draw(s); assert.deepEqual(s.result.kept.map(c => c.id), ['key-5', 'mermaid-7']);
});
test('a Mermaid with nothing to replay simply enters play', () => {
  const s = scene({ variants: { mermaid: true }, draw: ['mermaid-7', 'key-4'] });
  draw(s); assert.equal(s.choice, null); assert.equal(s.play.length, 1); assert.ok(validSave(s));
});

// Traits: the draft, then every card in the pool.
test('traits deal two cards to each captain and lock in one apiece', () => {
  const s = newGame(rng(7), { traits: true });
  assert.equal(s.phase, 'traitPick'); assert.ok(validSave(s));
  assert.equal(new Set(s.offer.flat()).size, 4);
  assert.equal(s.offer.flat().includes('siren'), false);
  assert.equal(act(s, { type: 'draw' }), false);
  assert.equal(act(s, { type: 'trait', id: s.offer[1][0] }), false);
  assert.ok(act(s, { type: 'trait', id: s.offer[0][1] }));
  assert.equal(s.traits[0], s.offer[0][1]); assert.ok(s.offer[1].includes(s.traits[1]));
  assert.equal(s.phase, 'play'); assert.ok(validSave(s));
  assert.equal(traitPool(true).length, TRAITS.length); assert.equal(traitPool(false).length, TRAITS.length - 1);
});
test('Golden Scales adds five to the top Mermaid only', () => {
  const bank = ['mermaid-9', 'mermaid-5', 'key-4'].map(card);
  assert.equal(score(bank), 13); assert.equal(score(bank, 'golden-scales'), 18);
});
test('Casanova banks Mermaids on sight without feeding the Kraken', () => {
  const s = scene({ variants: { traits: true }, traits: ['casanova', null], draw: ['kraken-7', 'mermaid-9', 'mermaid-5', 'key-4', 'oracle-3'] });
  draw(s); assert.equal(s.forced, 2);
  draw(s); assert.deepEqual(s.banks[0].map(c => c.id), ['mermaid-9']); assert.equal(s.forced, 2); assert.equal(s.play.length, 1);
  draw(s); assert.equal(s.banks[0].length, 2); assert.equal(s.phase, 'play');
  draw(s); assert.equal(s.forced, 1); assert.ok(validSave(s));
});
test('Fisherman banks a Kraken instead of ever playing it', () => {
  const s = scene({ variants: { traits: true }, traits: ['fisherman', null], draw: ['kraken-7', 'key-4'] });
  draw(s); assert.equal(s.play.length, 0); assert.equal(s.forced, 0); assert.deepEqual(s.banks[0].map(c => c.id), ['kraken-7']);
});
test('Safe Harbor shelters the Anchor and two more, but never the busting card', () => {
  const s = scene({ variants: { traits: true }, traits: ['safe-harbor', null], draw: ['key-3'], play: ['mermaid-9', 'anchor-4', 'oracle-6', 'key-5'] });
  draw(s);
  assert.deepEqual(s.result.kept.map(c => c.id), ['mermaid-9', 'anchor-4', 'oracle-6', 'key-5']);
  assert.deepEqual(s.result.lost.map(c => c.id), ['key-3']);
  const t = scene({ variants: { traits: true }, traits: ['safe-harbor', null], draw: ['anchor-7'], play: ['anchor-4', 'key-5'] });
  draw(t); assert.deepEqual(t.result.kept.map(c => c.id), ['anchor-4', 'key-5']);
});
test('a Miser Hook and the card it lands both survive a bust', () => {
  const s = scene({ variants: { traits: true }, traits: ['miser', null], draw: ['hook-5', 'cannon-3'], play: ['cannon-6'], banks: [['mermaid-9'], []] });
  draw(s); choose(s, 'mermaid-9'); draw(s);
  assert.equal(s.result.busted, true);
  assert.deepEqual(s.result.kept.map(c => c.id), ['hook-5', 'mermaid-9']);
});
test('Captains Hook demands a second card from the bank', () => {
  const s = scene({ variants: { traits: true }, traits: ['captains-hook', null], draw: ['hook-5', 'key-3'], banks: [['mermaid-9', 'oracle-6'], []] });
  draw(s); assert.equal(s.choice.type, 'hook'); choose(s, 'mermaid-9');
  assert.equal(s.choice.type, 'hook'); assert.deepEqual(options(s).map(c => c.id), ['oracle-6']);
  choose(s, 'oracle-6');
  assert.equal(s.choice, null); assert.equal(s.play.length, 3); assert.equal(s.banks[0].length, 0); assert.ok(validSave(s));
});
test('Navigator picks any single card from the whole discard', () => {
  const s = scene({ variants: { traits: true }, traits: ['navigator', null], draw: ['map-7', 'key-4'] });
  draw(s);
  assert.equal(options(s).length, s.discard.length); assert.ok(options(s).length > 3); assert.ok(validSave(s));
  const size = s.discard.length;
  choose(s, 'sword-4');
  assert.equal(s.discard.length, size - 1); assert.equal(s.play.at(-1).id, 'sword-4'); assert.ok(validSave(s));
});
test('Master Gunner sinks a whole stack and Scavenger keeps the wreck', () => {
  const s = scene({ variants: { traits: true }, traits: ['master-gunner', null], draw: ['cannon-4'], banks: [[], ['key-7', 'key-5', 'key-3']] });
  draw(s); choose(s, 'key-7');
  assert.equal(s.banks[1].length, 0);
  for (const id of ['key-7', 'key-5', 'key-3']) assert.ok(s.discard.some(c => c.id === id), id);
  const t = scene({ variants: { traits: true }, traits: ['scavenger', null], draw: ['cannon-4'], banks: [[], ['key-7', 'key-5']] });
  draw(t); choose(t, 'key-7');
  assert.deepEqual(t.banks[0].map(c => c.id), ['key-7']); assert.deepEqual(t.banks[1].map(c => c.id), ['key-5']);
});
test('Misfire turns a rival Cannon back on their own bank', () => {
  const s = scene({ variants: { traits: true }, traits: [null, 'misfire'], draw: ['cannon-4'], banks: [['key-7'], ['chest-6']] });
  draw(s);
  assert.deepEqual(options(s).map(c => c.id), ['key-7']);
  assert.deepEqual(choiceZone(s), { zone: 'bank', player: 0 });
  choose(s, 'key-7');
  assert.equal(s.banks[0].length, 0); assert.deepEqual(s.banks[1].map(c => c.id), ['chest-6']);
});
test('Mystic reveals three cards and spends them one draw at a time', () => {
  const s = scene({ variants: { traits: true }, traits: ['mystic', null], draw: ['oracle-7', 'key-4', 'chest-5', 'anchor-3', 'sword-6'] });
  draw(s); assert.equal(s.peek, 3); assert.equal(s.oracle, true); assert.ok(validSave(s));
  draw(s); assert.equal(s.peek, 2);
  draw(s); assert.equal(s.peek, 1);
  draw(s); assert.equal(s.peek, 0); assert.equal(s.oracle, false);
});
test('Swordsman steals a suit already sitting in the bank', () => {
  const s = scene({ variants: { traits: true }, traits: ['swordsman', null], draw: ['sword-7'], banks: [['key-3'], ['key-7', 'anchor-5']] });
  draw(s); assert.deepEqual(options(s).map(c => c.id).sort(), ['anchor-5', 'key-7']);
});
test('Parry limits a rival Sword to a Kraken, or throws it overboard', () => {
  const s = scene({ variants: { traits: true }, traits: [null, 'parry'], draw: ['sword-7'], banks: [[], ['key-7', 'kraken-5']] });
  draw(s); assert.deepEqual(options(s).map(c => c.id), ['kraken-5']);
  const t = scene({ variants: { traits: true }, traits: [null, 'parry'], draw: ['sword-7', 'key-4'], banks: [[], ['key-7']] });
  draw(t); assert.equal(t.choice, null); assert.equal(t.play.length, 0);
  assert.equal(t.discard.some(c => c.id === 'sword-7'), true); assert.ok(validSave(t));
});
test('Beastmaster makes a rival Kraken demand four cards', () => {
  const s = scene({ variants: { traits: true }, traits: [null, 'beastmaster'], draw: ['kraken-7', 'key-4', 'chest-5', 'anchor-3', 'sword-6', 'oracle-2'] });
  draw(s); assert.equal(s.forced, 4); assert.ok(validSave(s));
  draw(s); draw(s); draw(s); assert.equal(s.forced, 1);
  assert.equal(act(s, { type: 'collect' }), false);
});
test('Treasure Hunter doubles the bonus and Plunderer raids the rival bank', () => {
  const a = scene({ variants: { traits: true }, traits: ['treasure-hunter', null], play: ['key-7', 'chest-7'], discard: ['kraken-4', 'hook-4', 'map-5', 'sword-3', 'oracle-6'] });
  collect(a); assert.equal(a.result.bonus.length, 4);
  const b = scene({ variants: { traits: true }, traits: ['plunderer', null], play: ['key-7', 'chest-7'], banks: [[], ['map-5', 'sword-3', 'oracle-6']] });
  collect(b); assert.equal(b.result.bonus.length, 2); assert.equal(b.banks[1].length, 1); assert.equal(b.banks[0].length, 4);
});
test('Davy Jones Locker collects every card a rival loses to a bust', () => {
  const s = scene({ variants: { traits: true }, traits: [null, 'davy-jones'], draw: ['key-3'], play: ['key-7', 'mermaid-9'] });
  draw(s); assert.equal(s.banks[0].length, 0);
  assert.deepEqual(s.banks[1].map(c => c.id).sort(), ['key-3', 'key-7', 'mermaid-9']);
});
test('Siren and Casanova bank the card a Mermaid selects, keeping its Anchor cover', () => {
  const s = scene({ variants: { traits: true, mermaid: true }, traits: [null, 'siren'], draw: ['mermaid-7', 'key-3'], play: ['key-5', 'anchor-4'] });
  draw(s); choose(s, 'anchor-4');
  assert.deepEqual(s.banks[1].map(c => c.id), ['anchor-4']);
  assert.deepEqual(s.play.map(c => c.id), ['key-5', 'mermaid-7']);
  draw(s); assert.deepEqual(s.result.kept.map(c => c.id), ['key-5']);
  const t = scene({ variants: { traits: true, mermaid: true }, traits: ['casanova', null], draw: ['mermaid-7', 'key-4'], play: ['cannon-3'], banks: [[], ['key-7']] });
  draw(t); choose(t, 'cannon-3');
  assert.deepEqual(t.banks[0].map(c => c.id), ['cannon-3']);
  assert.deepEqual(t.banks[1].map(c => c.id), ['key-7']);
  assert.equal(t.choice, null); assert.ok(validSave(t));
});
test('200 seeded matches with both variants stay legal and conserve every card', () => {
  const seen = new Set(), taken = new Set();
  for (let seed = 1; seed <= 200; seed++) {
    const random = rng(seed * 31);
    let s = newGame(random, { traits: true, mermaid: true });
    assert.ok(validSave(s)); assert.equal(s.phase, 'traitPick');
    assert.ok(act(s, { type: 'trait', id: s.offer[0][seed % 2] }, random));
    s.traits.forEach(t => taken.add(t));
    let moves = 0;
    while (s.phase !== 'over' && moves++ < 1500) {
      if (s.choice) seen.add(s.choice.type);
      assert.ok(validSave(s), `invalid state for seed ${seed}, move ${moves}`);
      assert.ok(act(s, botAction(s), random), `illegal action for seed ${seed}, move ${moves}`);
      s = JSON.parse(JSON.stringify(s));
    }
    assert.equal(s.phase, 'over', `match ${seed} did not end`);
    assert.ok(validSave(s)); assert.equal(s.deck.length, 0); assert.ok([-1, 0, 1].includes(s.winner));
  }
  assert.deepEqual([...seen].sort(), ['cannon', 'hook', 'map', 'mermaid', 'sword']);
  assert.ok(taken.size > 12, `only ${taken.size} traits were ever drafted`);
});
