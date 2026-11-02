// Slap! rules. Pure functions over a plain, JSON-safe game state; no DOM.
//
// 90 cards: 11 each of 1-5 and 7 each of 6-10. Each turn starts by banking the cards you left
// exposed last turn. Then you draw at least one card. Once three or more cards are exposed in front
// of you, drawing a value you already have busts: everything exposed is lost. Drawing a value
// another player has exposed lets you steal all of those cards. When the deck runs out, everyone
// banks what is in front of them and the richest loot wins.

export const CARD_COUNTS = Object.freeze({ 1: 11, 2: 11, 3: 11, 4: 11, 5: 11, 6: 7, 7: 7, 8: 7, 9: 7, 10: 7 });
export const TOTAL_CARDS = 90;
export const DANGER = 3;
export const DIFFICULTIES = ['easy', 'normal', 'hard'];
export const BOTS = Object.freeze([
  { name: 'Doc', persona: 'The Shark', style: 'shark' },
  { name: 'Wyatt', persona: 'The Maverick', style: 'maverick' },
  { name: 'Jesse', persona: 'The Bandit', style: 'bandit' },
  { name: 'Billy', persona: 'The Rock', style: 'rock' },
]);

export const sum = cards => cards.reduce((t, c) => t + c.v, 0);

export function createDeck(rng = Math.random) {
  const cards = [];
  let id = 0;
  for (const [v, n] of Object.entries(CARD_COUNTS)) for (let i = 0; i < n; i++) cards.push({ id: id++, v: Number(v) });
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}

const blankStats = () => ({ busts: 0, lost: 0, stolen: 0, bestSteal: null, bestBank: 0 });

export function newGame({ rng = Math.random, difficulty = 'normal' } = {}) {
  return {
    v: 1,
    deck: createDeck(rng),
    discard: [],
    players: [
      { id: 0, name: 'You', human: true, style: 'human', score: 0, banked: [], faceUp: [], stats: blankStats() },
      ...BOTS.map((b, i) => ({ id: i + 1, ...b, human: false, score: 0, banked: [], faceUp: [], stats: blankStats() })),
    ],
    current: 0,
    phase: 'turn-start', // turn-start | decide | steal | over
    drawn: null, // the card waiting on a steal decision
    draws: 0, // cards drawn this turn
    turn: 1,
    difficulty: DIFFICULTIES.includes(difficulty) ? difficulty : 'normal',
    result: null,
  };
}

// ---------- reads ----------
export const active = s => s.players[s.current];
export const atRisk = p => p.faceUp.length >= DANGER;
export const bustValues = p => (atRisk(p) ? [...new Set(p.faceUp.map(c => c.v))].sort((a, b) => a - b) : []);
export function bustRisk(s, p = active(s)) {
  if (!atRisk(p) || !s.deck.length) return 0;
  const held = new Set(p.faceUp.map(c => c.v));
  return s.deck.filter(c => held.has(c.v)).length / s.deck.length;
}
export function victimsOf(s, value, pid = s.current) {
  return s.players
    .filter(p => p.id !== pid && p.faceUp.some(c => c.v === value))
    .map(p => ({ pid: p.id, count: p.faceUp.filter(c => c.v === value).length }));
}
export function standings(s) {
  return [...s.players].sort((a, b) => b.score - a.score || a.id - b.id);
}

// ---------- actions ----------
// act() applies one action and returns a list of events describing what happened, or null if the
// action is not legal right now. Events are what the UI animates and logs.
export function act(s, a) {
  if (!s || s.phase === 'over') return null;
  const p = active(s), ev = [];
  switch (a?.type) {
    case 'begin': {
      if (s.phase !== 'turn-start') return null;
      const ids = p.faceUp.map(c => c.id), amount = bank(p);
      if (amount) ev.push({ t: 'bank', pid: p.id, amount, ids });
      s.phase = 'decide'; s.draws = 0;
      ev.push({ t: 'turn', pid: p.id });
      return ev;
    }
    case 'draw': {
      if (s.phase !== 'decide' || !s.deck.length) return null;
      const card = s.deck.pop();
      s.draws++;
      ev.push({ t: 'draw', pid: p.id, card });
      if (atRisk(p) && p.faceUp.some(c => c.v === card.v)) {
        const lost = [...p.faceUp, card];
        s.discard.push(...lost); p.faceUp = [];
        p.stats.busts++; p.stats.lost += sum(lost);
        ev.push({ t: 'bust', pid: p.id, card, ids: lost.map(c => c.id), value: sum(lost), count: lost.length });
        advance(s);
        endIfEmpty(s, ev);
        return ev;
      }
      const victims = victimsOf(s, card.v);
      if (victims.length) {
        s.drawn = card; s.phase = 'steal';
        ev.push({ t: 'offer', pid: p.id, card, victims, count: victims.reduce((t, v) => t + v.count, 0) });
        return ev;
      }
      p.faceUp.push(card);
      ev.push({ t: 'keep', pid: p.id, card });
      endIfEmpty(s, ev);
      return ev;
    }
    case 'steal':
    case 'pass': {
      if (s.phase !== 'steal' || !s.drawn) return null;
      const card = s.drawn, victims = victimsOf(s, card.v);
      const count = victims.reduce((t, v) => t + v.count, 0);
      if (a.type === 'steal') {
        const ids = [];
        for (const v of victims) {
          const victim = s.players[v.pid];
          const taken = victim.faceUp.filter(c => c.v === card.v);
          ids.push(...taken.map(c => c.id));
          victim.faceUp = victim.faceUp.filter(c => c.v !== card.v);
          p.faceUp.push(...taken);
        }
        p.stats.stolen += count * card.v;
        if (!p.stats.bestSteal || count * card.v > p.stats.bestSteal.count * p.stats.bestSteal.v) p.stats.bestSteal = { count, v: card.v };
        ev.push({ t: 'steal', pid: p.id, card, victims, count, ids, value: count * card.v });
      } else {
        ev.push({ t: 'pass', pid: p.id, card, victims, count });
      }
      p.faceUp.push(card); s.drawn = null; s.phase = 'decide';
      ev.push({ t: 'keep', pid: p.id, card });
      endIfEmpty(s, ev);
      return ev;
    }
    case 'stop': {
      if (s.phase !== 'decide' || s.draws < 1) return null;
      ev.push({ t: 'stop', pid: p.id, count: p.faceUp.length, value: sum(p.faceUp) });
      advance(s);
      return ev;
    }
    default: return null;
  }
}

function bank(p) {
  if (!p.faceUp.length) return 0;
  const amount = sum(p.faceUp);
  p.score += amount; p.banked.push(...p.faceUp); p.faceUp = [];
  p.stats.bestBank = Math.max(p.stats.bestBank, amount);
  return amount;
}
function advance(s) { s.current = (s.current + 1) % s.players.length; s.phase = 'turn-start'; s.draws = 0; s.turn++; }
function endIfEmpty(s, ev) {
  if (s.deck.length) return;
  ev.push({ t: 'empty' });
  for (const p of s.players) {
    const ids = p.faceUp.map(c => c.id), amount = bank(p);
    if (amount) ev.push({ t: 'bank', pid: p.id, amount, ids, final: true });
  }
  const high = Math.max(...s.players.map(p => p.score));
  s.phase = 'over'; s.drawn = null;
  s.result = { high, winners: s.players.filter(p => p.score === high).map(p => p.id) };
  ev.push({ t: 'over', ...s.result });
}

// ---------- bots ----------
function read(s, p) {
  const others = new Set(s.players.filter(o => o.id !== p.id).flatMap(o => o.faceUp.map(c => c.v)));
  const n = s.deck.length || 1;
  return {
    risk: bustRisk(s, p),
    exposed: sum(p.faceUp),
    stealChance: s.deck.filter(c => others.has(c.v)).length / n,
  };
}
// Expected value of one more draw for a player at or past the danger line.
function drawEdge(s, p) {
  const held = new Set(p.faceUp.map(c => c.v)), n = s.deck.length;
  if (!n) return -Infinity;
  let gain = 0, bust = 0;
  for (const c of s.deck) {
    if (held.has(c.v)) { bust++; continue; }
    gain += c.v + victimsOf(s, c.v, p.id).reduce((t, v) => t + v.count, 0) * c.v;
  }
  // Cards left exposed can be stolen before they bank: discount the gain a little for that.
  return (gain * .85 - bust * sum(p.faceUp)) / n;
}

export function botAction(s, rng = Math.random) {
  const p = active(s);
  if (s.phase === 'turn-start') return { type: 'begin' };
  if (s.phase === 'steal') return { type: wantsSteal(s, p, rng) ? 'steal' : 'pass' };
  if (s.phase !== 'decide') return null;
  if (s.draws < 1 || !atRisk(p)) return { type: 'draw' };
  return { type: wantsDraw(s, p, rng) ? 'draw' : 'stop' };
}

function wantsDraw(s, p, rng) {
  const r = read(s, p);
  if (s.difficulty === 'hard') return drawEdge(s, p) > 0;
  if (s.difficulty === 'easy') return r.exposed < 8 + rng() * 22 && r.risk < .2 + rng() * .25;
  switch (p.style) {
    case 'maverick': return r.exposed < 31 && r.risk < .35;
    case 'bandit': return r.exposed < 23 && (r.risk < .24 || r.stealChance > .24);
    case 'rock': return r.exposed < 13 && r.risk < .11;
    default: return r.exposed < 21 && r.risk < .17;
  }
}

function wantsSteal(s, p, rng) {
  const card = s.drawn, count = victimsOf(s, card.v).reduce((t, v) => t + v.count, 0);
  // Stealing never adds a new bust value (the drawn card joins you either way), so it is only ever
  // a question of pushing you over the danger line sooner.
  if (s.difficulty === 'hard') return true;
  if (s.difficulty === 'easy') return rng() < .6;
  const gain = card.v * count, crosses = p.faceUp.length < DANGER && p.faceUp.length + count + 1 >= DANGER;
  switch (p.style) {
    case 'maverick': case 'bandit': return true;
    case 'rock': return gain >= 7 && !crosses;
    default: return gain >= 5 || (!crosses && card.v >= 3);
  }
}

// ---------- saves ----------
export function validSave(s) {
  try {
    if (!s || s.v !== 1 || !Array.isArray(s.deck) || !Array.isArray(s.discard) || !Array.isArray(s.players)) return false;
    if (s.players.length !== 1 + BOTS.length || !['turn-start', 'decide', 'steal', 'over'].includes(s.phase)) return false;
    if (!(s.current >= 0 && s.current < s.players.length)) return false;
    if (s.phase === 'steal' && !s.drawn) return false;
    const all = [...s.deck, ...s.discard, ...(s.drawn ? [s.drawn] : []), ...s.players.flatMap(p => [...p.faceUp, ...p.banked])];
    if (all.length !== TOTAL_CARDS || new Set(all.map(c => c.id)).size !== TOTAL_CARDS) return false;
    const counts = {};
    for (const c of all) counts[c.v] = (counts[c.v] || 0) + 1;
    if (Object.entries(CARD_COUNTS).some(([v, n]) => counts[v] !== n)) return false;
    return s.players.every(p => p.score === sum(p.banked));
  } catch { return false; }
}
