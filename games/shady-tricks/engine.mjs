// Shady Tricks: the rules and the bots. Pure functions over a JSON-safe state, so a game can be
// saved, restored and tested. Nothing here touches the DOM.
//
// 50 cards: four suits of -3, -2, -1 and 1 to 9, plus two Jesters (0 and 10). Twelve each to four
// players; two are set aside unseen. Follow the lead suit if you can; Jesters can always be played
// and never set the lead. The SECOND-highest eligible card (lead suit or Jester) takes the trick,
// along with every off-suit card in it. A card matching the rank of one already in your tableau
// cancels with it. Scores never drop below 0; the round in which someone passes 40 ends the game,
// and the highest score at or below 40 wins.

export const SUITS = ['red', 'blue', 'green', 'orange'];
export const RANKS = [-3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
export const LIMIT = 40;
export const HAND = 12;

export const PEOPLE = [
  { name: 'You', persona: 'South', style: 'human' },
  { name: 'Silas', persona: 'The Schemer', style: 'schemer' },
  { name: 'Morgana', persona: 'The Duchess', style: 'duchess' },
  { name: 'Crispin', persona: 'The Fool', style: 'fool' },
];

export const sum = cards => cards.reduce((t, c) => t + c.rank, 0);
export const isJester = c => c.suit === 'jester';

export function rng(seed = Date.now()) {
  return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const R = s => { s.seed = (s.seed * 1103515245 + 12345) % 2147483648; return s.seed / 2147483648; };

export function createDeck() {
  let id = 0;
  const d = SUITS.flatMap(suit => RANKS.map(rank => ({ id: id++, suit, rank })));
  d.push({ id: id++, suit: 'jester', rank: 0 }, { id: id++, suit: 'jester', rank: 10 });
  return d;
}

function shuffle(a, rand) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function sortHand(h) {
  const order = c => (isJester(c) ? -1 : SUITS.indexOf(c.suit));
  return h.sort((a, b) => order(a) - order(b) || a.rank - b.rank);
}

export function newGame({ rng: rand = Math.random } = {}) {
  const s = {
    v: 1, seed: Math.floor(rand() * 2147483646) + 1, round: 0, trick: 0, leader: 0, current: 0,
    lead: null, table: [], aside: [], phase: 'deal', lastTrick: null, roundResults: null, result: null,
    players: PEOPLE.map((p, id) => ({ id, ...p, human: id === 0, hand: [], tableau: [], score: 0, stats: { tricks: 0, cancels: 0 } })),
  };
  s.leader = Math.floor(rand() * 4);
  return s;
}

// ---------- rules ----------
export function validPlays(s, hand = s.players[s.current].hand) {
  if (!s.lead) return hand.slice();
  const follow = hand.filter(c => c.suit === s.lead);
  return follow.length ? hand.filter(c => isJester(c) || c.suit === s.lead) : hand.slice();
}

// Who takes the cards on the table, if the trick ended now: the second-highest of the lead-suit
// cards and Jesters, or the only one. Null while no lead suit is set.
export function takerOf(table, lead) {
  if (!lead) return null;
  const el = table.filter(x => isJester(x.card) || x.card.suit === lead).sort((a, b) => b.card.rank - a.card.rank);
  if (!el.length) return null;
  return el.length === 1 ? el[0] : el[1];
}

// Split a finished (or partial) trick into what the taker gets and what is discarded.
export function splitTrick(table, lead) {
  const win = takerOf(table, lead);
  if (!win) return { win: null, taken: [], discarded: table.map(x => x.card) };
  const taken = [], discarded = [];
  for (const x of table) {
    if (x === win || (!isJester(x.card) && x.card.suit !== lead)) taken.push(x.card); else discarded.push(x.card);
  }
  return { win, taken, discarded };
}

// Cards entering a tableau: a rank already there cancels with it (both leave).
export function collect(tableau, cards) {
  const cancelled = [];
  for (const c of cards) {
    const i = tableau.findIndex(x => x.rank === c.rank);
    if (i >= 0) cancelled.push({ rank: c.rank, ids: [tableau.splice(i, 1)[0].id, c.id] });
    else tableau.push(c);
  }
  return cancelled;
}

// Lowest unique total leads; if every total is shared, a random player.
export function nextLeader(s) {
  const groups = new Map();
  s.players.forEach(p => groups.set(p.score, [...(groups.get(p.score) || []), p.id]));
  for (const score of [...groups.keys()].sort((a, b) => a - b)) if (groups.get(score).length === 1) return groups.get(score)[0];
  return Math.floor(R(s) * 4);
}

// Highest at or below the limit wins; tied leaders knock each other out and the next score down
// takes over. If everyone is over, the highest score wins.
export function winners(players) {
  const safe = players.filter(p => p.score <= LIMIT);
  if (!safe.length) { const hi = Math.max(...players.map(p => p.score)); return players.filter(p => p.score === hi).map(p => p.id); }
  const left = safe.slice();
  while (left.length) {
    const hi = Math.max(...left.map(p => p.score)), tied = left.filter(p => p.score === hi);
    if (tied.length === 1) return [tied[0].id];
    tied.forEach(p => left.splice(left.indexOf(p), 1));
  }
  return [];
}

export function standings(s) {
  const w = s.result?.winners || winners(s.players);
  const key = p => (w.includes(p.id) ? 2 : p.score <= LIMIT ? 1 : 0);
  return s.players.slice().sort((a, b) => key(b) - key(a) || (key(a) === 0 ? a.score - b.score : b.score - a.score));
}

// ---------- actions ----------
// act(s, action) mutates the state and returns a list of events, or null if the action is illegal.
//   { type: 'deal' }      phase 'deal'     → deal a round
//   { type: 'play', id }  phase 'play'     → current player plays a card
//   { type: 'collect' }   phase 'resolve'  → the four cards go to the taker
//   { type: 'next' }      phase 'round'    → after the round summary
export function act(s, a) {
  if (!a) return null;
  if (a.type === 'deal' && s.phase === 'deal') return deal(s);
  if (a.type === 'play' && s.phase === 'play') return play(s, a.id);
  if (a.type === 'collect' && s.phase === 'resolve') return resolve(s);
  if (a.type === 'next' && s.phase === 'round') { s.phase = 'deal'; s.roundResults = null; return deal(s); }
  return null;
}

function deal(s) {
  const deck = shuffle(createDeck(), () => R(s));
  s.round++; s.trick = 1; s.table = []; s.lead = null; s.lastTrick = null;
  s.players.forEach(p => { p.tableau = []; p.hand = sortHand(deck.splice(0, HAND)); });
  s.aside = deck.splice(0, 2);
  s.current = s.leader; s.phase = 'play';
  return [{ t: 'deal', round: s.round, leader: s.leader }];
}

function play(s, id) {
  const p = s.players[s.current], card = p.hand.find(c => c.id === id);
  if (!card || !validPlays(s, p.hand).includes(card)) return null;
  p.hand.splice(p.hand.indexOf(card), 1);
  const setsLead = !s.lead && !isJester(card);
  if (setsLead) s.lead = card.suit;
  s.table.push({ pid: p.id, card });
  const ev = [{ t: 'play', pid: p.id, card, setsLead, lead: s.lead }];
  if (s.table.length === 4) { s.phase = 'resolve'; ev.push({ t: 'full' }); } else s.current = (s.current + 1) % 4;
  return ev;
}

function resolve(s) {
  const { win, taken, discarded } = splitTrick(s.table, s.lead);
  const p = s.players[win.pid];
  const before = sum(p.tableau);
  const cancelled = collect(p.tableau, taken);
  p.stats.tricks++; p.stats.cancels += cancelled.length;
  const ev = [{ t: 'trick', pid: p.id, card: win.card, taken, discarded, cancelled, delta: sum(p.tableau) - before, lead: s.lead }];
  s.lastTrick = { table: s.table, lead: s.lead, pid: p.id, takenIds: taken.map(c => c.id) };
  s.table = []; s.lead = null; s.leader = s.current = p.id;
  if (s.players.every(x => !x.hand.length)) ev.push(...endRound(s));
  else { s.trick++; s.phase = 'play'; }
  return ev;
}

function endRound(s) {
  const rows = s.players.map(p => {
    const points = sum(p.tableau), before = p.score;
    p.score = Math.max(0, p.score + points);
    return { pid: p.id, points, before, after: p.score, tableau: p.tableau.slice() };
  });
  s.roundResults = { round: s.round, rows, aside: s.aside.slice() };
  (s.history ||= []).push({ round: s.round, points: rows.map(r => r.points), totals: rows.map(r => r.after) });
  if (s.players.some(p => p.score > LIMIT)) {
    s.phase = 'over';
    s.result = { winners: winners(s.players), round: s.round };
    return [{ t: 'round', ...s.roundResults }, { t: 'over', winners: s.result.winners }];
  }
  s.leader = nextLeader(s);
  s.roundResults.leader = s.leader;
  s.phase = 'round';
  return [{ t: 'round', ...s.roundResults }];
}

// ---------- bots ----------
// A light heuristic, with a little noise so the bots don't play identically.
export function chooseCard(s, pid = s.current) {
  const p = s.players[pid], valid = validPlays(s, p.hand);
  if (valid.length === 1) return valid[0];
  let best = valid[0], bestValue = -Infinity;
  for (const c of valid) {
    let v = R(s) * 3;
    if (p.tableau.some(x => x.rank === c.rank)) v += c.rank > 0 ? 28 : -18;
    if (c.rank < 0) v += 8;
    if (s.table.length && s.lead) {
      if (!isJester(c) && c.suit !== s.lead) v += 24;
      const ranks = [...s.table.filter(x => isJester(x.card) || x.card.suit === s.lead).map(x => x.card.rank), c.rank].sort((a, b) => b - a);
      if ((isJester(c) || c.suit === s.lead) && ranks.indexOf(c.rank) === 1) v += p.score > 28 ? -10 : 16;
    } else v -= Math.abs(c.rank - 4) * .6;
    if (v > bestValue) { bestValue = v; best = c; }
  }
  return best;
}
export function botAction(s) {
  if (s.phase !== 'play' || s.players[s.current].human) return null;
  return { type: 'play', id: chooseCard(s).id };
}

// ---------- saves ----------
export function validSave(v) {
  try {
    if (!v || v.v !== 1 || !Array.isArray(v.players) || v.players.length !== 4) return false;
    if (!['deal', 'play', 'resolve', 'round', 'over'].includes(v.phase)) return false;
    if (v.phase === 'deal') return v.players.every(p => Array.isArray(p.hand) && Array.isArray(p.tableau));
    const ids = [...v.players.flatMap(p => [...p.hand, ...p.tableau]), ...v.table.map(x => x.card), ...v.aside].map(c => c.id);
    if (new Set(ids).size !== ids.length || ids.some(id => !Number.isInteger(id) || id < 0 || id > 49)) return false;
    return Number.isInteger(v.current) && v.current >= 0 && v.current < 4 && v.table.length <= 4;
  } catch { return false; }
}
