import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, act, botAction, validSave, bustRisk, bustValues, victimsOf, standings, sum, TOTAL_CARDS, CARD_COUNTS } from '../games/slap/engine.mjs';

function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let nextId = 1000;
const c = v => ({ id: nextId++, v });
// Build a state with a stacked deck (last item is drawn first) while keeping all 90 cards accounted for.
function scene({ draw = [], faceUp = {}, current = 0, phase = 'decide', draws = 1 } = {}) {
  const s = newGame({ rng: rng(7) });
  const pool = [...s.deck]; s.deck = [];
  const take = v => { const i = pool.findIndex(x => x.v === v); assert.ok(i >= 0, `no ${v} left`); return pool.splice(i, 1)[0]; };
  for (const [pid, vs] of Object.entries(faceUp)) s.players[pid].faceUp = vs.map(take);
  const top = draw.map(take);
  s.deck = [...pool, ...top.reverse()];
  s.current = current; s.phase = phase; s.draws = draws;
  return s;
}

test('a new game holds all 90 cards with the right counts', () => {
  const s = newGame({ rng: rng(1) });
  assert.equal(s.deck.length, TOTAL_CARDS);
  for (const [v, n] of Object.entries(CARD_COUNTS)) assert.equal(s.deck.filter(x => x.v === +v).length, n);
  assert.equal(new Set(s.deck.map(x => x.id)).size, TOTAL_CARDS);
  assert.ok(validSave(s));
  assert.equal(s.players[0].human, true);
  assert.equal(s.phase, 'turn-start');
});

test('begin banks the cards left exposed and opens the turn', () => {
  const s = scene({ faceUp: { 0: [4, 6] }, phase: 'turn-start', draws: 0 });
  const ev = act(s, { type: 'begin' });
  assert.deepEqual(ev.map(e => e.t), ['bank', 'turn']);
  assert.equal(ev[0].amount, 10);
  assert.equal(s.players[0].score, 10);
  assert.equal(s.players[0].faceUp.length, 0);
  assert.equal(s.phase, 'decide');
  assert.ok(validSave(s));
});

test('you must draw before you can keep', () => {
  const s = scene({ draws: 0 });
  assert.equal(act(s, { type: 'stop' }), null);
  assert.ok(act(s, { type: 'draw' }));
  assert.ok(act(s, { type: 'stop' }));
  assert.equal(s.current, 1);
  assert.equal(s.phase, 'turn-start');
});

test('a duplicate below the danger line is kept, not a bust', () => {
  const s = scene({ faceUp: { 0: [5, 7] }, draw: [5] });
  const ev = act(s, { type: 'draw' });
  assert.deepEqual(ev.map(e => e.t), ['draw', 'keep']);
  assert.equal(s.players[0].faceUp.length, 3);
});

test('a duplicate at the danger line busts and loses every exposed card', () => {
  const s = scene({ faceUp: { 0: [2, 3, 9] }, draw: [3] });
  assert.deepEqual(bustValues(s.players[0]), [2, 3, 9]);
  assert.ok(bustRisk(s) > 0);
  const ev = act(s, { type: 'draw' });
  const bust = ev.find(e => e.t === 'bust');
  assert.ok(bust);
  assert.equal(bust.value, 17);
  assert.equal(bust.count, 4);
  assert.equal(s.discard.length, 4);
  assert.equal(s.players[0].faceUp.length, 0);
  assert.equal(s.players[0].stats.busts, 1);
  assert.equal(s.current, 1);
  assert.ok(validSave(s));
});

test('drawing a value others have exposed offers a steal of all of them', () => {
  const s = scene({ faceUp: { 0: [1], 2: [7, 7, 3], 3: [7] }, draw: [7] });
  const ev = act(s, { type: 'draw' });
  const offer = ev.find(e => e.t === 'offer');
  assert.equal(offer.count, 3);
  assert.deepEqual(victimsOf(s, 7).map(v => v.pid), [2, 3]);
  assert.equal(s.phase, 'steal');
  assert.ok(validSave(s));
  act(s, { type: 'steal' });
  assert.equal(s.players[0].faceUp.filter(x => x.v === 7).length, 4);
  assert.deepEqual(s.players[2].faceUp.map(x => x.v), [3]);
  assert.equal(s.players[3].faceUp.length, 0);
  assert.deepEqual(s.players[0].stats.bestSteal, { count: 3, v: 7 });
  assert.equal(s.phase, 'decide');
  assert.ok(validSave(s));
});

test('passing leaves the matching cards with their owners', () => {
  const s = scene({ faceUp: { 1: [8] }, draw: [8] });
  act(s, { type: 'draw' });
  const ev = act(s, { type: 'pass' });
  assert.deepEqual(ev.map(e => e.t), ['pass', 'keep']);
  assert.equal(s.players[1].faceUp.length, 1);
  assert.equal(s.players[0].faceUp.length, 1);
});

test('emptying the deck banks everyone and ends the game', () => {
  const s = scene({ faceUp: { 1: [10, 10], 4: [9] }, draw: [] });
  s.discard.push(...s.deck.splice(0, s.deck.length - 1));
  const last = s.deck[0].v;
  const ev = act(s, { type: 'draw' });
  assert.ok(ev.some(e => e.t === 'empty'));
  assert.equal(s.phase, 'over');
  assert.ok(s.players.every(p => p.faceUp.length === 0));
  assert.equal(s.result.high, Math.max(...s.players.map(p => p.score)));
  assert.ok(s.players[1].score >= 20);
  assert.equal(standings(s)[0].score, s.result.high);
  assert.ok(last >= 1);
  assert.equal(act(s, { type: 'draw' }), null);
});

test('saves reject tampered card counts', () => {
  const s = newGame({ rng: rng(3) });
  assert.ok(validSave(JSON.parse(JSON.stringify(s))));
  const bad = JSON.parse(JSON.stringify(s)); bad.deck.pop();
  assert.equal(validSave(bad), false);
  const bad2 = JSON.parse(JSON.stringify(s)); bad2.players[1].score = 5;
  assert.equal(validSave(bad2), false);
});

for (const difficulty of ['easy', 'normal', 'hard']) {
  test(`bots play whole ${difficulty} games without breaking the card count`, () => {
    for (let seed = 1; seed <= 25; seed++) {
      const r = rng(seed), s = newGame({ rng: r, difficulty });
      for (const p of s.players) p.human = false;
      let steps = 0;
      while (s.phase !== 'over') {
        const ev = act(s, botAction(s, r));
        assert.ok(ev, `illegal bot action in phase ${s.phase}`);
        assert.ok(validSave(s), 'card accounting broke');
        assert.ok(++steps < 2000, 'game did not end');
      }
      const total = s.players.reduce((t, p) => t + p.score, 0) + sum(s.discard);
      assert.equal(total, Object.entries(CARD_COUNTS).reduce((t, [v, n]) => t + v * n, 0));
    }
  });
}

test('hard bots outscore easy bots over many games', () => {
  let hard = 0, easy = 0;
  for (let seed = 1; seed <= 150; seed++) {
    const r = rng(seed), s = newGame({ rng: r, difficulty: 'hard' });
    s.players[0].human = false;
    // Seats 1 and 3 play hard, seats 2 and 4 play easy.
    while (s.phase !== 'over') {
      s.difficulty = s.current % 2 ? 'hard' : 'easy';
      act(s, botAction(s, r));
    }
    hard += s.players[1].score + s.players[3].score; easy += s.players[2].score + s.players[4].score;
  }
  assert.ok(hard > easy, `hard ${hard} vs easy ${easy}`);
});
