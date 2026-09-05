export const SUITS = [
  { id: 'anchor', name: 'Anchor', color: '#77cbbf', short: 'Protect earlier loot', rule: 'If you bust, keep every card before the Anchor. The Anchor itself is not protected.' },
  { id: 'hook', name: 'Hook', color: '#e5ac7c', short: 'Replay your own loot', rule: 'Move the highest card of any suit in your bank into play. Activate its ability. You must choose, even if it makes you bust.' },
  { id: 'cannon', name: 'Cannon', color: '#f28e7f', short: 'Sink rival treasure', rule: 'Discard the highest card of one suit in your rival’s bank. The next card underneath becomes their scoring card.' },
  { id: 'key', name: 'Key', color: '#edcd7e', short: 'Pair with a Chest', rule: 'Collect a Key and Chest together to gain one random discard card for every card collected. Bonus cards go straight to your bank; their abilities do not activate.' },
  { id: 'chest', name: 'Chest', color: '#eab66d', short: 'Pair with a Key', rule: 'Collect a Chest and Key together to gain one random discard card for every card collected, or all remaining discards if there are fewer.' },
  { id: 'map', name: 'Map', color: '#c5bd95', short: 'Recover lost treasure', rule: 'Reveal up to three random discards. Choose one to put into play and activate its ability. Return the others. You must choose, even if it makes you bust.' },
  { id: 'oracle', name: 'Oracle', color: '#baa8e8', short: 'See the next card', rule: 'See the next card on the draw pile. The reveal lasts until you draw that card or collect.' },
  { id: 'sword', name: 'Sword', color: '#9ac6e5', short: 'Steal a missing suit', rule: 'Steal the highest card of a rival’s suit that is absent from your own bank. Put it into play and activate its ability. You must choose, even if it makes you bust.' },
  { id: 'kraken', name: 'Kraken', color: '#d79bc2', short: 'Play two more cards', rule: 'Add two more cards to play before collecting. Cards brought in by a Hook, Sword or Map count toward these two. Resolve every ability along the way.' },
  { id: 'mermaid', name: 'Mermaid', color: '#8acbaa', short: 'A richer prize', rule: 'No activated ability. Mermaids are worth 4–9; every other suit is worth 2–7.' },
];
export const suitOf = card => SUITS.find(s => s.id === card.suit);
export const allCards = () => SUITS.flatMap(s => Array.from({ length: 6 }, (_, i) => ({ id: `${s.id}-${i + (s.id === 'mermaid' ? 4 : 2)}`, suit: s.id, value: i + (s.id === 'mermaid' ? 4 : 2) })));
export function shuffle(cards, rng = Math.random) {
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
export const stack = (bank, suit) => bank.filter(c => c.suit === suit).sort((a, b) => b.value - a.value);
export const tops = bank => SUITS.map(s => stack(bank, s.id)[0]).filter(Boolean);
export const score = bank => tops(bank).reduce((sum, c) => sum + c.value, 0);
export const gain = (bank, cards) => score([...bank, ...cards]) - score(bank);
export const duplicate = (s, card) => s.play.some(c => c.suit === card.suit);
const who = s => s.active === 0 ? 'You' : 'Captain Rook';
function log(s, text) { s.message = text; s.history.unshift({ turn: s.turn, player: s.active, text }); s.history = s.history.slice(0, 100); }

export function newGame(rng = Math.random) {
  const cards = allCards();
  const low = c => c.value === (c.suit === 'mermaid' ? 4 : 2);
  return { version: 1, deck: shuffle(cards.filter(c => !low(c)), rng), discard: shuffle(cards.filter(low), rng), banks: [[], []], active: rng() < .5 ? 0 : 1, turn: 1, phase: 'play', play: [], choice: null, forced: 0, oracle: false, seenDraw: [], history: [], message: 'A fresh sea. A fortune to find.', result: null, winner: null };
}

export function options(s) {
  if (!s.choice) return [];
  if (s.choice.type === 'map') return s.choice.cards;
  if (s.choice.type === 'hook') return tops(s.banks[s.active]);
  const cards = tops(s.banks[1 - s.active]);
  return s.choice.type === 'sword' ? cards.filter(c => !s.banks[s.active].some(b => b.suit === c.suit)) : cards;
}

function bankLoot(s, cards, rng) {
  const combo = cards.some(c => c.suit === 'key') && cards.some(c => c.suit === 'chest');
  const bonus = combo ? shuffle(s.discard, rng).splice(0, cards.length) : [];
  s.banks[s.active].push(...cards, ...bonus);
  return bonus;
}

function finish(s, busted, rng) {
  const before = score(s.banks[s.active]);
  const anchor = s.play.findIndex(c => c.suit === 'anchor');
  const kept = busted ? (anchor >= 0 ? s.play.slice(0, anchor) : []) : [...s.play];
  const lost = busted ? s.play.slice(kept.length) : [];
  // Resolve protected treasure before discarding the rest of the bust.
  const bonus = bankLoot(s, kept, rng);
  s.discard.push(...lost);
  const delta = score(s.banks[s.active]) - before;
  s.result = { player: s.active, busted, kept, lost, bonus, delta, cards: [...s.play] };
  s.play = []; s.choice = null; s.forced = 0; s.oracle = false;
  log(s, `${who(s)} ${busted ? 'bust' + (s.active ? 's' : '') : 'collect' + (s.active ? 's' : '')}. ${kept.length + bonus.length} cards banked, +${delta} points.${bonus.length ? ` ${bonus.length} bonus cards from the discard.` : ''}`);
  if (!s.deck.length) {
    s.phase = 'over';
    const diff = score(s.banks[0]) - score(s.banks[1]) || s.banks[0].length - s.banks[1].length;
    s.winner = diff === 0 ? -1 : diff > 0 ? 0 : 1;
  } else s.phase = 'turnEnd';
}

function enter(s, card, rng) {
  const bust = duplicate(s, card);
  s.play.push(card);
  if (s.forced > 0) s.forced--;
  log(s, `${who(s)} ${s.active ? 'plays' : 'play'} ${suitOf(card).name} ${card.value}.`);
  if (bust) { finish(s, true, rng); return; }
  if (card.suit === 'kraken') s.forced = 2;
  if (card.suit === 'oracle') s.oracle = true;
  if (['hook', 'sword', 'cannon'].includes(card.suit)) {
    s.choice = { type: card.suit };
    if (!options(s).length) { s.choice = null; log(s, `${suitOf(card).name}: no eligible cards. Continue your turn.`); }
  }
  if (card.suit === 'map') {
    const cards = shuffle(s.discard, rng).splice(0, 3);
    if (cards.length) s.choice = { type: 'map', cards };
    else log(s, 'Map: the discard is empty. Continue your turn.');
  }
  if (!s.deck.length) s.forced = 0;
}

// Every state change passes through this reducer, including the bot's moves.
export function act(s, action, rng = Math.random) {
  if (action.type === 'next' && s.phase === 'turnEnd') {
    s.active = 1 - s.active; s.turn++; s.phase = 'play'; s.result = null;
    log(s, `${s.active ? 'Captain Rook’s' : 'Your'} turn.`); return true;
  }
  if (s.phase !== 'play') return false;
  if (action.type === 'choose' && s.choice) {
    const card = options(s).find(c => c.id === action.id);
    if (!card) return false;
    const type = s.choice.type;
    if (type === 'map') s.discard.push(...s.choice.cards.filter(c => c.id !== card.id));
    else {
      const bank = s.banks[type === 'hook' ? s.active : 1 - s.active];
      bank.splice(bank.findIndex(c => c.id === card.id), 1);
    }
    s.choice = null;
    if (type === 'cannon') { s.discard.push(card); log(s, `${who(s)} ${s.active ? 'sinks' : 'sink'} ${suitOf(card).name} ${card.value}.`); }
    else enter(s, card, rng);
    return true;
  }
  if (s.choice) return false;
  if (action.type === 'draw' && s.deck.length) {
    const card = s.deck.pop();
    // Oracle is a one-card reveal. Consume the current reveal before entering
    // the card so a newly drawn Oracle can correctly arm the following reveal.
    s.oracle = false;
    s.seenDraw.push(card.id); enter(s, card, rng); return true;
  }
  if (action.type === 'collect' && s.play.length && (!s.forced || !s.deck.length)) { finish(s, false, rng); return true; }
  return false;
}

export function publicRemaining(s) {
  const drawn = new Set(s.seenDraw);
  return allCards().filter(c => c.value > (c.suit === 'mermaid' ? 4 : 2) && !drawn.has(c.id));
}

function choiceValue(s, c) {
  const own = s.banks[s.active], rival = s.banks[1 - s.active];
  const damage = c.value - (stack(rival, c.suit)[1]?.value || 0);
  if (s.choice.type === 'cannon') return damage + c.value * .03;
  if (duplicate(s, c)) return -100 + (s.choice.type === 'sword' ? damage : 0) - (s.choice.type === 'hook' ? c.value : 0);
  let value = gain(own, [c]) + (s.choice.type === 'sword' ? damage * .9 : 0);
  if (s.choice.type === 'hook') value = -(c.value - (stack(own, c.suit)[1]?.value || 0)) * .2;
  if ((c.suit === 'key' && s.play.some(c => c.suit === 'chest')) || (c.suit === 'chest' && s.play.some(c => c.suit === 'key'))) value += Math.min(s.discard.length, s.play.length + 1) * 2.5;
  if (c.suit === 'anchor') value += 3 + gain(own, s.play) * .4;
  if (c.suit === 'oracle') value += 3;
  if (c.suit === 'kraken') value -= 3 + s.play.length;
  if (c.suit === 'cannon') value += Math.max(0, ...tops(rival).map(t => t.value - (stack(rival, t.suit)[1]?.value || 0))) * .8;
  // Avoid mandatory follow-up abilities when all their targets cause a bust.
  if (['hook', 'sword', 'map'].includes(c.suit)) {
    const candidates = c.suit === 'hook' ? tops(own).filter(t => t.id !== c.id) : c.suit === 'sword' ? tops(rival).filter(t => !own.some(b => b.suit === t.suit)) : [];
    if (candidates.length && candidates.every(t => t.suit === c.suit || duplicate(s, t))) value -= 60;
    else value += 1;
  }
  return value;
}

export function botAction(s) {
  if (s.phase === 'turnEnd') return { type: 'next' };
  if (s.phase !== 'play') return null;
  if (s.choice) return { type: 'choose', id: [...options(s)].sort((a, b) => choiceValue(s, b) - choiceValue(s, a) || b.value - a.value)[0].id };
  if (!s.deck.length) return { type: 'collect' };
  if (!s.play.length || s.forced) return { type: 'draw' };
  const own = s.banks[s.active];
  const cards = s.oracle ? [s.deck[s.deck.length - 1]] : publicRemaining(s);
  const safe = cards.filter(c => !duplicate(s, c));
  const risk = 1 - safe.length / Math.max(1, cards.length);
  if (risk === 1) return { type: 'collect' };
  const current = gain(own, s.play);
  const combo = s.play.some(c => c.suit === 'key') && s.play.some(c => c.suit === 'chest');
  const bonusValue = combo ? Math.min(s.play.length, s.discard.length) * 2 : 0;
  const anchor = s.play.findIndex(c => c.suit === 'anchor');
  const protectedValue = anchor < 0 ? 0 : gain(own, s.play.slice(0, anchor));
  const reward = safe.reduce((sum, c) => sum + gain([...own, ...s.play], [c]) + (c.suit === 'oracle' ? 1 : 0) - (c.suit === 'kraken' ? 1.5 : 0), 0) / Math.max(1, cards.length);
  const behind = score(s.banks[1 - s.active]) - score(own) - current;
  const urgency = s.deck.length < 12 && behind > 0 ? 1.45 : 1;
  return { type: reward * urgency + .35 > risk * (current + bonusValue - protectedValue + 2) ? 'draw' : 'collect' };
}

export function validSave(s) {
  try {
    if (s.version !== 1 || !['play', 'turnEnd', 'over'].includes(s.phase) || ![0, 1].includes(s.active) || !Number.isInteger(s.turn) || s.turn < 1 || !Array.isArray(s.history) || !Array.isArray(s.seenDraw) || s.banks.length !== 2) return false;
    const cards = [...s.deck, ...s.discard, ...s.banks.flat(), ...s.play, ...(s.choice?.cards || [])];
    const canonical = allCards();
    return cards.length === 60 && new Set(cards.map(c => c.id)).size === 60 && cards.every(c => canonical.some(x => x.id === c.id && x.suit === c.suit && x.value === c.value)) && Number.isInteger(s.forced) && s.forced >= 0 && s.forced <= 2 && (!s.choice || ['hook', 'sword', 'cannon', 'map'].includes(s.choice.type) && options(s).length > 0);
  } catch { return false; }
}
