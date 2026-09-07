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
  { id: 'mermaid', name: 'Mermaid', color: '#8acbaa', short: 'A richer prize', rule: 'No activated ability. Mermaids are worth 4–9; every other suit is worth 2–7.', variantShort: 'Replay a card in play', variantRule: 'Choose an earlier card in your play area, move it to the right of the Mermaid and activate its ability again. In this variant Mermaids are worth 2–7, like every other suit.' },
];

// Optional advanced play. One trait per captain, active for the whole voyage.
// Siren only joins the pool when the Mermaid variant gives Mermaids an ability.
export const TRAITS = [
  { id: 'golden-scales', name: 'Golden Scales', suit: 'mermaid', weight: 8, rule: 'Your Mermaids are worth an extra five points.' },
  { id: 'casanova', name: 'Casanova', suit: 'mermaid', weight: 7, rule: 'Bank every Mermaid the moment you draw it. It never enters play, so it can never bust you and never counts toward a Kraken.', variantRule: 'When a Mermaid enters your play area, bank the card its ability selects instead of replaying it. The selected card’s ability never activates.' },
  { id: 'plunderer', name: 'Plunderer', suit: 'key', weight: 6, rule: 'Key and Chest bonus cards are drawn at random from your rival’s bank instead of the discard pile.' },
  { id: 'treasure-hunter', name: 'Treasure Hunter', suit: 'chest', weight: 7, rule: 'Double the bonus cards drawn from the discard when you collect a Key and Chest together.' },
  { id: 'navigator', name: 'Navigator', suit: 'map', weight: 8, rule: 'Your Map picks any single card from the entire discard pile instead of three at random.' },
  { id: 'master-gunner', name: 'Master Gunner', suit: 'cannon', weight: 7, rule: 'Your Cannon sinks a rival’s entire suit stack instead of only the top card.' },
  { id: 'scavenger', name: 'Scavenger', suit: 'cannon', weight: 8, rule: 'Cards sunk by your Cannon go into your own bank instead of the discard pile.' },
  { id: 'mystic', name: 'Mystic', suit: 'oracle', weight: 6, rule: 'Your Oracle reveals the next three cards instead of one. Their order cannot be changed.' },
  { id: 'swordsman', name: 'Swordsman', suit: 'sword', weight: 6, rule: 'Your Sword may steal any suit from a rival, even a suit you already hold.' },
  { id: 'miser', name: 'Miser', suit: 'hook', weight: 5, rule: 'A Hook you play, and the card it brings into play, both survive a bust.' },
  { id: 'captains-hook', name: 'Captain’s Hook', suit: 'hook', weight: 3, rule: 'Your Hook must play two cards from your bank instead of one.' },
  { id: 'safe-harbor', name: 'Safe Harbor', suit: 'anchor', weight: 7, rule: 'Your Anchor also protects itself and the next two cards played after it. The card that causes a bust is never kept.' },
  { id: 'fisherman', name: 'Fisherman', suit: 'kraken', weight: 7, rule: 'Bank every Kraken the moment you draw it. It never enters play and never demands more cards.' },
  { id: 'beastmaster', name: 'Beastmaster', suit: 'kraken', weight: 5, rule: 'A Kraken drawn by your rival forces four more cards instead of two.' },
  { id: 'misfire', name: 'Misfire', suit: 'cannon', weight: 5, rule: 'A Cannon drawn by your rival sinks a card from their own bank instead of yours.' },
  { id: 'parry', name: 'Parry', suit: 'sword', weight: 4, rule: 'Your rival’s Sword may only steal a Kraken. With no Kraken to take, the Sword is discarded with no effect.' },
  { id: 'davy-jones', name: 'Davy Jones’ Locker', suit: 'chest', weight: 7, rule: 'When your rival busts, every card they lose goes into your bank instead of the discard pile.' },
  { id: 'siren', name: 'Siren', suit: 'mermaid', weight: 6, mermaidOnly: true, rule: 'When your rival plays a Mermaid, you immediately bank the card its ability selects, before that card’s ability can activate.' },
];

export const suitOf = card => SUITS.find(s => s.id === card.suit);
export const traitOf = id => TRAITS.find(t => t.id === id) || null;
export const traitPool = (mermaid = false) => TRAITS.filter(t => mermaid || !t.mermaidOnly);
// The Mermaid variant rewrites what a couple of cards say; everything else is shared.
export const suitCopy = (suit, variants) => variants?.mermaid && suit.variantRule ? { short: suit.variantShort, rule: suit.variantRule } : { short: suit.short, rule: suit.rule };
export const traitCopy = (t, variants) => (variants?.mermaid && t?.variantRule) || t?.rule || '';

export const lowValue = (suit, mermaid) => (suit === 'mermaid' && !mermaid ? 4 : 2);
export const allCards = (mermaid = false) => SUITS.flatMap(s => { const base = lowValue(s.id, mermaid); return Array.from({ length: 6 }, (_, i) => ({ id: `${s.id}-${i + base}`, suit: s.id, value: i + base })); });
export function shuffle(cards, rng = Math.random) {
  for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; }
  return cards;
}
export const stack = (bank, suit) => bank.filter(c => c.suit === suit).sort((a, b) => b.value - a.value);
export const tops = bank => SUITS.map(s => stack(bank, s.id)[0]).filter(Boolean);
export const score = (bank, trait = null) => tops(bank).reduce((sum, c) => sum + c.value + (trait === 'golden-scales' && c.suit === 'mermaid' ? 5 : 0), 0);
export const gain = (bank, cards, trait = null) => score([...bank, ...cards], trait) - score(bank, trait);
export const duplicate = (s, card) => s.play.some(c => c.suit === card.suit);

const foe = p => 1 - p;
export const traitOfPlayer = (s, p) => s.traits?.[p] || null;
const has = (s, p, id) => traitOfPlayer(s, p) === id;
export const scoreOf = (s, p) => score(s.banks[p], traitOfPlayer(s, p));
const who = s => s.active === 0 ? 'You' : 'Captain Rook';
const verb = (s, singular, plural) => s.active === 0 ? plural : singular;
function log(s, text) { s.message = text; s.history.unshift({ turn: s.turn, player: s.active, text }); s.history = s.history.slice(0, 100); }

export function newGame(rng = Math.random, variants = {}) {
  const v = { traits: Boolean(variants.traits), mermaid: Boolean(variants.mermaid) };
  const cards = allCards(v.mermaid);
  const low = c => c.value === lowValue(c.suit, v.mermaid);
  const pool = shuffle(traitPool(v.mermaid).map(t => t.id), rng);
  return {
    version: 2, variants: v,
    deck: shuffle(cards.filter(c => !low(c)), rng), discard: shuffle(cards.filter(low), rng),
    banks: [[], []], active: rng() < .5 ? 0 : 1, turn: 1,
    phase: v.traits ? 'traitPick' : 'play',
    play: [], choice: null, queue: [], forced: 0, oracle: false, peek: 0, protectedIds: [], seenDraw: [],
    traits: [null, null], offer: v.traits ? [pool.slice(0, 2), pool.slice(2, 4)] : null,
    history: [], message: v.traits ? 'Two traits, one voyage. Choose the power you will sail with.' : 'A fresh sea. A fortune to find.',
    result: null, winner: null,
  };
}

export function options(s) {
  if (!s.choice) return [];
  const p = s.active, c = s.choice;
  if (c.type === 'map') return c.cards;
  if (c.type === 'mermaid') { const i = s.play.findIndex(x => x.id === c.card); return i > 0 ? s.play.slice(0, i) : []; }
  if (c.type === 'hook') return tops(s.banks[p]);
  // Misfire turns a rival's Cannon back on their own bank.
  if (c.type === 'cannon') return tops(s.banks[has(s, foe(p), 'misfire') ? p : foe(p)]);
  let cards = tops(s.banks[foe(p)]);
  if (has(s, foe(p), 'parry')) cards = cards.filter(x => x.suit === 'kraken');
  if (!has(s, p, 'swordsman')) cards = cards.filter(x => !s.banks[p].some(b => b.suit === x.suit));
  return cards;
}

// Which pile the pending choice is picked from, so the interface can point at it.
export function choiceZone(s) {
  if (!s.choice) return null;
  const t = s.choice.type, p = s.active;
  if (t === 'map') return { zone: 'panel' };
  if (t === 'mermaid') return { zone: 'play' };
  if (t === 'hook') return { zone: 'bank', player: p };
  if (t === 'cannon') return { zone: 'bank', player: has(s, foe(p), 'misfire') ? p : foe(p) };
  return { zone: 'bank', player: foe(p) };
}

// Cards in play that would survive a bust: the Anchor prefix, Safe Harbor's tail,
// Miser's Hook pairs, and anything an Anchor covered before it left the table.
export function protectedIds(s) {
  const ids = new Set(s.protectedIds || []);
  const anchor = s.play.findIndex(c => c.suit === 'anchor');
  if (anchor >= 0) s.play.slice(0, anchor + (has(s, s.active, 'safe-harbor') ? 3 : 0)).forEach(c => ids.add(c.id));
  return ids;
}

function queueChoice(s, choice) { s.queue.push(choice); }

// Opens the next pending choice, skipping any whose targets no longer exist.
function advance(s, rng) {
  while (!s.choice && s.queue.length && s.phase === 'play') {
    const c = s.queue.shift();
    if (c.type === 'map') {
      if (has(s, s.active, 'navigator')) { c.cards = [...s.discard]; c.whole = true; }
      else c.cards = shuffle(s.discard, rng).splice(0, 3);
      if (!c.cards.length) { log(s, 'Map: the discard is empty. Continue your turn.'); continue; }
      s.choice = c; return;
    }
    s.choice = c;
    if (options(s).length) return;
    s.choice = null;
    if (c.type === 'sword' && has(s, foe(s.active), 'parry')) { removeFromPlay(s, c.card, true); log(s, 'Parry: the Sword finds no Kraken and is thrown overboard.'); }
    else log(s, `${SUITS.find(x => x.id === c.type).name}: no eligible cards. Continue your turn.`);
  }
}

// Pulling a card back out of play keeps whatever an Anchor was already covering.
function removeFromPlay(s, id, discard) {
  const i = s.play.findIndex(x => x.id === id);
  if (i < 0) return null;
  const [card] = s.play.splice(i, 1);
  if (card.suit === 'anchor') s.play.slice(0, i).forEach(x => { if (!s.protectedIds.includes(x.id)) s.protectedIds.push(x.id); });
  if (discard) s.discard.push(card);
  return card;
}

function reveal(s) {
  s.peek = Math.max(s.peek, Math.min(has(s, s.active, 'mystic') ? 3 : 1, s.deck.length));
  s.oracle = s.peek > 0;
}

function activate(s, card, rng) {
  const p = s.active;
  if (card.suit === 'kraken') s.forced += has(s, foe(p), 'beastmaster') ? 4 : 2;
  if (card.suit === 'oracle') reveal(s);
  if (card.suit === 'mermaid' && s.variants.mermaid) queueChoice(s, { type: 'mermaid', card: card.id });
  if (card.suit === 'hook') queueChoice(s, { type: 'hook', card: card.id, repeat: has(s, p, 'captains-hook') ? 1 : 0 });
  if (card.suit === 'sword' || card.suit === 'cannon') queueChoice(s, { type: card.suit, card: card.id });
  if (card.suit === 'map') queueChoice(s, { type: 'map', card: card.id });
}

// Puts a card on the table. Returns false when it busted the turn.
function place(s, card, rng) {
  const bust = duplicate(s, card);
  s.play.push(card);
  if (s.forced > 0) s.forced--;
  log(s, `${who(s)} ${verb(s, 'plays', 'play')} ${suitOf(card).name} ${card.value}.`);
  if (bust) { finish(s, true, rng); return false; }
  activate(s, card, rng);
  if (!s.deck.length) s.forced = 0;
  return true;
}

function bankLoot(s, cards, rng) {
  const p = s.active;
  const combo = cards.some(c => c.suit === 'key') && cards.some(c => c.suit === 'chest');
  let bonus = [];
  if (combo) {
    const count = cards.length * (has(s, p, 'treasure-hunter') ? 2 : 1);
    // A Plunderer raids the rival's bank instead of the discard, and never both.
    const source = has(s, p, 'plunderer') ? s.banks[foe(p)] : s.discard;
    bonus = shuffle(source, rng).splice(0, count);
  }
  s.banks[p].push(...cards, ...bonus);
  return bonus;
}

function finish(s, busted, rng) {
  const p = s.active;
  const before = scoreOf(s, p);
  const safe = protectedIds(s);
  const bustCard = busted ? s.play.at(-1) : null;
  // The card that causes the bust is never kept, whatever is protecting the rest.
  const kept = busted ? s.play.filter(c => c !== bustCard && safe.has(c.id)) : [...s.play];
  const lost = s.play.filter(c => !kept.includes(c));
  // Resolve protected treasure before the rest of the bust leaves the table.
  const bonus = bankLoot(s, kept, rng);
  const locker = busted && has(s, foe(p), 'davy-jones');
  if (locker) s.banks[foe(p)].push(...lost); else s.discard.push(...lost);
  const delta = scoreOf(s, p) - before;
  s.result = { player: s.active, busted, kept, lost, bonus, delta, cards: [...s.play], protectedIds: busted ? kept.map(c => c.id) : [], locker };
  s.play = []; s.choice = null; s.queue = []; s.forced = 0; s.oracle = false; s.peek = 0; s.protectedIds = [];
  log(s, `${who(s)} ${busted ? verb(s, 'busts', 'bust') : verb(s, 'collects', 'collect')}. ${kept.length + bonus.length} cards banked, +${delta} points.${bonus.length ? ` ${bonus.length} bonus cards${has(s, p, 'plunderer') ? ' plundered from the rival bank' : ' from the discard'}.` : ''}${locker ? ` ${lost.length} lost cards go to Davy Jones’ Locker.` : ''}`);
  if (!s.deck.length) {
    s.phase = 'over';
    const diff = scoreOf(s, 0) - scoreOf(s, 1) || s.banks[0].length - s.banks[1].length;
    s.winner = diff === 0 ? -1 : diff > 0 ? 0 : 1;
  } else s.phase = 'turnEnd';
}

// The Mermaid variant replays an earlier card; a Siren or Casanova banks it instead.
function replay(s, choice, card, rng) {
  const p = s.active;
  const siren = has(s, foe(p), 'siren'), casanova = has(s, p, 'casanova');
  if (siren || casanova) {
    const taker = siren ? foe(p) : p;
    removeFromPlay(s, card.id, false);
    s.banks[taker].push(card);
    log(s, `${siren ? 'The Siren claims' : `${who(s)} ${verb(s, 'banks', 'bank')}`} ${suitOf(card).name} ${card.value} before its ability can stir.`);
    return;
  }
  removeFromPlay(s, card.id, false);
  s.play.splice(s.play.findIndex(x => x.id === choice.card) + 1, 0, card);
  log(s, `${who(s)} ${verb(s, 'replays', 'replay')} ${suitOf(card).name} ${card.value}.`);
  activate(s, card, rng);
}

function fireCannon(s, card, rng) {
  const p = s.active;
  const misfire = has(s, foe(p), 'misfire');
  const owner = misfire ? p : foe(p);
  const bank = s.banks[owner];
  const taken = has(s, p, 'master-gunner') ? stack(bank, card.suit) : [card];
  for (const t of taken) bank.splice(bank.findIndex(x => x.id === t.id), 1);
  const salvage = !misfire && has(s, p, 'scavenger');
  if (salvage) s.banks[p].push(...taken); else s.discard.push(...taken);
  log(s, `${who(s)} ${verb(s, 'sinks', 'sink')} ${taken.map(c => `${suitOf(c).name} ${c.value}`).join(', ')}${misfire ? ' from their own bank' : ''}${salvage ? ' and salvages the wreck' : ''}.`);
}

// Every state change passes through this reducer, including the bot's moves.
export function act(s, action, rng = Math.random) {
  if (action.type === 'trait' && s.phase === 'traitPick') {
    if (!s.offer?.[0].includes(action.id)) return false;
    s.traits[0] = action.id;
    s.traits[1] = [...s.offer[1]].sort((a, b) => traitOf(b).weight - traitOf(a).weight || (a < b ? -1 : 1))[0];
    s.phase = 'play';
    log(s, `You sail as ${traitOf(s.traits[0]).name}. Captain Rook answers with ${traitOf(s.traits[1]).name}.`);
    return true;
  }
  if (action.type === 'next' && s.phase === 'turnEnd') {
    s.active = 1 - s.active; s.turn++; s.phase = 'play'; s.result = null;
    log(s, `${s.active ? 'Captain Rook’s' : 'Your'} turn.`); return true;
  }
  if (s.phase !== 'play') return false;
  if (action.type === 'choose' && s.choice) {
    const card = options(s).find(c => c.id === action.id);
    if (!card) return false;
    const choice = s.choice, type = choice.type;
    s.choice = null;
    if (type === 'map') {
      if (choice.whole) s.discard.splice(s.discard.findIndex(x => x.id === card.id), 1);
      else s.discard.push(...choice.cards.filter(c => c.id !== card.id));
      place(s, card, rng);
    } else if (type === 'mermaid') replay(s, choice, card, rng);
    else if (type === 'cannon') fireCannon(s, card, rng);
    else {
      const bank = s.banks[type === 'hook' ? s.active : foe(s.active)];
      bank.splice(bank.findIndex(c => c.id === card.id), 1);
      // A Miser's Hook shelters itself and whatever it drags back onto the table.
      if (type === 'hook' && has(s, s.active, 'miser')) s.protectedIds.push(choice.card, card.id);
      const alive = place(s, card, rng);
      if (alive && type === 'hook' && choice.repeat) queueChoice(s, { type: 'hook', card: choice.card, repeat: choice.repeat - 1 });
    }
    advance(s, rng);
    return true;
  }
  if (s.choice) return false;
  if (action.type === 'draw' && s.deck.length) {
    const card = s.deck.pop(), p = s.active;
    // Oracle is a running reveal. Consume one card of it before the draw resolves
    // so a newly drawn Oracle can correctly arm the following reveal.
    s.peek = Math.max(0, s.peek - 1); s.oracle = s.peek > 0;
    s.seenDraw.push(card.id);
    const straightToBank = (card.suit === 'mermaid' && !s.variants.mermaid && has(s, p, 'casanova')) || (card.suit === 'kraken' && has(s, p, 'fisherman'));
    if (straightToBank) {
      s.banks[p].push(card);
      log(s, `${who(s)} ${verb(s, 'banks', 'bank')} ${suitOf(card).name} ${card.value} the moment it is drawn.`);
      if (!s.deck.length) s.forced = 0;
    } else place(s, card, rng);
    advance(s, rng);
    return true;
  }
  if (action.type === 'collect' && s.play.length && (!s.forced || !s.deck.length)) { finish(s, false, rng); return true; }
  return false;
}

export function publicRemaining(s) {
  const drawn = new Set(s.seenDraw), mermaid = Boolean(s.variants?.mermaid);
  return allCards(mermaid).filter(c => c.value > lowValue(c.suit, mermaid) && !drawn.has(c.id));
}

function choiceValue(s, c) {
  const p = s.active, own = s.banks[p], rival = s.banks[foe(p)], mine = traitOfPlayer(s, p);
  const type = s.choice.type;
  const damage = c.value - (stack(rival, c.suit)[1]?.value || 0);
  if (type === 'cannon') {
    if (has(s, foe(p), 'misfire')) return -(c.value - (stack(own, c.suit)[1]?.value || 0)) - c.value * .03;
    const whole = has(s, p, 'master-gunner') ? stack(rival, c.suit).length : 1;
    return damage + c.value * .03 + (has(s, p, 'scavenger') ? gain(own, stack(rival, c.suit).slice(0, whole), mine) : 0);
  }
  if (type === 'mermaid') {
    if (has(s, foe(p), 'siren')) return -c.value - (c.suit === 'anchor' ? 4 : 0);
    if (has(s, p, 'casanova')) return gain(own, [c], mine) + 2;
    if (c.suit === 'anchor') return 4 + gain(own, s.play.filter(x => x.suit !== 'anchor'), mine) * .35;
    if (c.suit === 'cannon') return Math.max(0, ...tops(rival).map(t => t.value - (stack(rival, t.suit)[1]?.value || 0))) * .9;
    if (c.suit === 'oracle') return 2;
    if (c.suit === 'kraken') return -4 - s.play.length;
    if (['hook', 'sword', 'map'].includes(c.suit)) return tops(own).length > 1 || s.discard.length ? 1.5 : -2;
    return 0;
  }
  if (duplicate(s, c)) return -100 + (type === 'sword' ? damage : 0) - (type === 'hook' ? c.value : 0);
  let value = gain(own, [c], mine) + (type === 'sword' ? damage * .9 : 0);
  if (type === 'hook') value = -(c.value - (stack(own, c.suit)[1]?.value || 0)) * .2 + (has(s, p, 'miser') ? 4 : 0);
  if ((c.suit === 'key' && s.play.some(x => x.suit === 'chest')) || (c.suit === 'chest' && s.play.some(x => x.suit === 'key'))) value += Math.min(s.discard.length, s.play.length + 1) * 2.5;
  if (c.suit === 'anchor') value += 3 + gain(own, s.play, mine) * .4;
  if (c.suit === 'oracle') value += 3;
  if (c.suit === 'kraken') value -= 3 + s.play.length;
  if (c.suit === 'cannon') value += Math.max(0, ...tops(rival).map(t => t.value - (stack(rival, t.suit)[1]?.value || 0))) * .8;
  // Avoid mandatory follow-up abilities when all their targets cause a bust.
  if (['hook', 'sword', 'map'].includes(c.suit)) {
    const candidates = c.suit === 'hook' ? tops(own).filter(t => t.id !== c.id)
      : c.suit === 'sword' ? tops(rival).filter(t => has(s, p, 'swordsman') || !own.some(b => b.suit === t.suit)) : [];
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
  const p = s.active, own = s.banks[p], mine = traitOfPlayer(s, p);
  const cards = s.oracle ? [s.deck[s.deck.length - 1]] : publicRemaining(s);
  // Traits that bank a suit on sight make that suit harmless to draw.
  const sheltered = c => (c.suit === 'mermaid' && !s.variants.mermaid && mine === 'casanova') || (c.suit === 'kraken' && mine === 'fisherman');
  const safe = cards.filter(c => sheltered(c) || !duplicate(s, c));
  const risk = 1 - safe.length / Math.max(1, cards.length);
  if (risk === 1) return { type: 'collect' };
  const current = gain(own, s.play, mine);
  const combo = s.play.some(c => c.suit === 'key') && s.play.some(c => c.suit === 'chest');
  const bonusValue = combo ? Math.min(s.play.length * (mine === 'treasure-hunter' ? 2 : 1), (mine === 'plunderer' ? s.banks[foe(p)] : s.discard).length) * 2 : 0;
  const shelter = protectedIds(s);
  const protectedValue = gain(own, s.play.filter(c => shelter.has(c.id)), mine);
  const reward = safe.reduce((sum, c) => sum + (sheltered(c) ? gain(own, [c], mine) : gain([...own, ...s.play], [c], mine)) + (c.suit === 'oracle' ? 1 : 0) - (c.suit === 'kraken' && !sheltered(c) ? 1.5 : 0), 0) / Math.max(1, cards.length);
  const behind = scoreOf(s, foe(p)) - scoreOf(s, p) - current;
  const urgency = s.deck.length < 12 && behind > 0 ? 1.45 : 1;
  return { type: reward * urgency + .35 > risk * (current + bonusValue - protectedValue + 2) ? 'draw' : 'collect' };
}

export function validSave(s) {
  try {
    if (s.version !== 2 || !['traitPick', 'play', 'turnEnd', 'over'].includes(s.phase) || ![0, 1].includes(s.active) || !Number.isInteger(s.turn) || s.turn < 1) return false;
    if (!Array.isArray(s.history) || !Array.isArray(s.seenDraw) || !Array.isArray(s.queue) || !Array.isArray(s.protectedIds) || !Array.isArray(s.traits) || s.traits.length !== 2 || s.banks.length !== 2) return false;
    const mermaid = Boolean(s.variants?.mermaid);
    if (s.traits.some(t => t !== null && !traitPool(mermaid).some(x => x.id === t))) return false;
    if (s.phase === 'traitPick' && (!s.variants?.traits || s.offer?.length !== 2 || s.offer.some(pair => pair.length !== 2))) return false;
    const cards = [...s.deck, ...s.discard, ...s.banks.flat(), ...s.play, ...(s.choice?.whole ? [] : s.choice?.cards || [])];
    const canonical = allCards(mermaid);
    return cards.length === 60 && new Set(cards.map(c => c.id)).size === 60 && cards.every(c => canonical.some(x => x.id === c.id && x.suit === c.suit && x.value === c.value))
      && Number.isInteger(s.forced) && s.forced >= 0 && s.forced <= 8 && Number.isInteger(s.peek) && s.peek >= 0 && s.peek <= 3
      && s.queue.every(c => ['hook', 'sword', 'cannon', 'map', 'mermaid'].includes(c.type))
      && (!s.choice || ['hook', 'sword', 'cannon', 'map', 'mermaid'].includes(s.choice.type) && options(s).length > 0);
  } catch { return false; }
}
