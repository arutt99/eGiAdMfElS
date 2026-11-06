import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, act, botAction, validSave, validPlays, takerOf, splitTrick, collect, winners, nextLeader, standings, createDeck, sum, rng, LIMIT, HAND } from '../games/shady-tricks/engine.mjs';

const card = (suit, rank, id) => ({ id, suit, rank });
const J0 = card('jester', 0, 48), J10 = card('jester', 10, 49);

test('the deck has 50 unique cards: four suits of -3..9 without 0, and two Jesters', () => {
  const d = createDeck();
  assert.equal(d.length, 50);
  assert.equal(new Set(d.map(c => c.id)).size, 50);
  assert.ok(!d.some(c => c.suit !== 'jester' && c.rank === 0));
  assert.deepEqual(d.filter(c => c.suit === 'jester').map(c => c.rank), [0, 10]);
});

test('a deal gives everyone 12 cards, sets two aside, and starts with the leader', () => {
  const s = newGame({ rng: rng(3) });
  const ev = act(s, { type: 'deal' });
  assert.equal(ev[0].t, 'deal');
  assert.ok(s.players.every(p => p.hand.length === HAND));
  assert.equal(s.aside.length, 2);
  assert.equal(s.current, s.leader);
  assert.equal(s.phase, 'play');
  assert.ok(validSave(JSON.parse(JSON.stringify(s))));
});

test('you must follow the lead suit if you can; Jesters are always allowed', () => {
  const s = newGame({ rng: rng(1) });
  s.phase = 'play'; s.lead = 'red'; s.table = [{ pid: 3, card: card('red', 4, 1) }];
  const hand = [card('red', 2, 2), card('blue', 9, 3), J0];
  assert.deepEqual(validPlays(s, hand).map(c => c.id), [2, 48]);
  assert.equal(validPlays(s, [card('blue', 9, 3), card('green', 1, 4)]).length, 2);
  s.lead = null;
  assert.equal(validPlays(s, hand).length, 3);
});

test('the second-highest lead-suit card or Jester takes the trick', () => {
  const table = [{ pid: 0, card: card('red', 8, 1) }, { pid: 1, card: card('red', 5, 2) }, { pid: 2, card: card('blue', 3, 3) }, { pid: 3, card: card('red', 1, 4) }];
  assert.equal(takerOf(table, 'red').pid, 1);
  const { taken, discarded } = splitTrick(table, 'red');
  assert.deepEqual(taken.map(c => c.id).sort(), [2, 3]);
  assert.deepEqual(discarded.map(c => c.id).sort(), [1, 4]);
});

test('a lone eligible card takes it, and Jesters count as eligible', () => {
  assert.equal(takerOf([{ pid: 0, card: card('red', 2, 1) }, { pid: 1, card: card('blue', 9, 2) }], 'red').pid, 0);
  const t = [{ pid: 0, card: J10 }, { pid: 1, card: card('green', 9, 2) }, { pid: 2, card: card('green', -3, 3) }];
  assert.equal(takerOf(t, 'green').pid, 1);
  assert.equal(takerOf([{ pid: 0, card: J0 }], null), null);
});

test('a card matching a rank already in the tableau cancels both', () => {
  const tab = [card('red', 7, 1), card('blue', -2, 2)];
  const cancelled = collect(tab, [card('green', 7, 3), card('orange', 4, 4)]);
  assert.deepEqual(cancelled, [{ rank: 7, ids: [1, 3] }]);
  assert.deepEqual(tab.map(c => c.id), [2, 4]);
});

test('playing a whole trick and collecting it moves cards and passes the lead', () => {
  const s = newGame({ rng: rng(5) });
  act(s, { type: 'deal' });
  for (let i = 0; i < 4; i++) {
    const p = s.players[s.current], c = validPlays(s, p.hand)[0];
    assert.ok(act(s, { type: 'play', id: c.id }));
  }
  assert.equal(s.phase, 'resolve');
  assert.equal(act(s, { type: 'play', id: 0 }), null);
  const ev = act(s, { type: 'collect' });
  assert.equal(ev[0].t, 'trick');
  assert.equal(s.current, ev[0].pid);
  assert.equal(s.leader, ev[0].pid);
  assert.equal(s.trick, 2);
  assert.equal(s.table.length, 0);
  assert.ok(s.lastTrick);
});

test('illegal plays are refused', () => {
  const s = newGame({ rng: rng(9) });
  act(s, { type: 'deal' });
  const other = s.players[(s.current + 1) % 4].hand[0];
  assert.equal(act(s, { type: 'play', id: other.id }), null);
  assert.equal(act(s, { type: 'collect' }), null);
  assert.equal(act(s, { type: 'next' }), null);
});

test('winners: highest at or below 40; tied leaders knock each other out', () => {
  const P = scores => scores.map((score, id) => ({ id, score }));
  assert.deepEqual(winners(P([12, 41, 38, 20])), [2]);
  assert.deepEqual(winners(P([38, 38, 30, 45])), [2]);
  assert.deepEqual(winners(P([42, 50, 41, 44])), [1]);
  assert.deepEqual(winners(P([30, 30, 41, 42])), []);
});

test('the lowest unique total leads the next round', () => {
  const s = newGame({ rng: rng(2) });
  [5, 5, 9, 12].forEach((v, i) => { s.players[i].score = v; });
  assert.equal(nextLeader(s), 2);
});

test('scores never drop below zero at the end of a round', () => {
  const s = newGame({ rng: rng(4) });
  act(s, { type: 'deal' });
  s.players.forEach(p => { p.hand = []; });
  s.players[0].tableau = [card('red', -3, 0), card('blue', -2, 13)];
  s.players[1].hand = [];
  s.table = [{ pid: 1, card: card('green', 5, 30) }, { pid: 2, card: card('green', 6, 31) }, { pid: 3, card: card('green', 7, 32) }, { pid: 0, card: card('orange', 9, 40) }];
  s.lead = 'green'; s.phase = 'resolve';
  const ev = act(s, { type: 'collect' });
  assert.equal(ev.at(-1).t, 'round');
  assert.equal(s.players[0].score, 0);
  assert.equal(s.phase, 'round');
  assert.equal(s.history.length, 1);
  act(s, { type: 'next' });
  assert.equal(s.round, 2);
  assert.equal(s.phase, 'play');
});

test('whole bot games finish with a winner, every state saves, and every card is accounted for', () => {
  for (let seed = 1; seed <= 40; seed++) {
    const s = newGame({ rng: rng(seed) });
    s.players[0].human = false;
    let steps = 0;
    while (s.phase !== 'over') {
      assert.ok(++steps < 5000, 'game should end');
      const a = s.phase === 'deal' ? { type: 'deal' } : s.phase === 'round' ? { type: 'next' } : s.phase === 'resolve' ? { type: 'collect' } : botAction(s);
      assert.ok(act(s, a), `action in phase ${s.phase}`);
      if (s.phase === 'play' || s.phase === 'resolve') {
        const n = s.players.reduce((t, p) => t + p.hand.length, 0) + s.table.length;
        assert.equal(n, (13 - s.trick) * 4);
        assert.ok(validSave(JSON.parse(JSON.stringify(s))));
      }
    }
    assert.ok(s.players.some(p => p.score > LIMIT));
    assert.ok(s.result.winners.every(id => s.players[id].score <= LIMIT) || s.players.every(p => p.score > LIMIT));
    assert.equal(standings(s).length, 4);
    assert.ok(s.players.every(p => sum(p.tableau) === s.roundResults.rows[p.id].points));
  }
});
