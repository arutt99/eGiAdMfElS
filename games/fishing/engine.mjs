// Fishing rules engine. Pure state + actions; no DOM.

export const TYPES = ['shrimp', 'cod', 'lobster', 'swordfish', 'oyster'];
export const HARBOR = ['crab', 'club', 'research', 'barge', 'canoe'];
export const WHARF = ['casino', 'bank', 'salvage', 'bait', 'canning', 'smoke', 'pub', 'buffet'];
export const BOAT_FACES = [...TYPES, 'coins'];
export const TOWN_FACES = ['harbor', 'harbor', 'wharf', 'wharf', 'market', 'market'];
export const HEXES = ['shrimp', 'oyster', 'swordfish', 'lobster', 'cod'];
export const COIN_BOXES = 105;
export const STAR_BOXES = (() => {
  const set = new Set();
  [[2, 5, 10, 14, 19], [1, 5, 10, 14, 19], [1, 5, 10, 14, 19], [1, 5, 10, 14, 19], [1, 5, 10, 14, 19]]
    .forEach((cols, r) => cols.forEach(c => set.add(r * 21 + c)));
  return set;
})();

const COLUMN = [0, 'L', 'B', 0, '?', 0, 'B', 0, '?', 0, 0, '?'];
export const SECTIONS = {
  ...Object.fromEntries(TYPES.map(t => [t, { group: 'boat', acts: COLUMN }])),
  crab: { group: 'harbor', acts: [0, 0, 0, 0, 'K', 0, 'B', 0, 'B', 0, 'B'] },
  club: { group: 'harbor', acts: [0, 'F', 0, 0, 'F', 0, 0, 'F'] },
  research: { group: 'harbor', acts: ['B', 0, 'B'] },
  barge: { group: 'harbor', acts: [0, 0, 'B'] },
  canoe: { group: 'harbor', acts: ['B', 0, 'B'] },
  casino: { group: 'wharf', acts: [0, 0] },
  bank: { group: 'wharf', acts: [0, 0, 0] },
  salvage: { group: 'wharf', acts: [0] },
  bait: { group: 'wharf', acts: [0] },
  canning: { group: 'wharf', acts: [0] },
  smoke: { group: 'wharf', acts: [0] },
  pub: { group: 'wharf', acts: [0, 0, 0, 0] },
  buffet: { group: 'wharf', acts: [0, 0, 0] },
};
export const SHIPS = {
  shrimp: { n: 3, cap: 3, vp: 2 }, cod: { n: 3, cap: 4, vp: 1 }, lobster: { n: 3, cap: 4, vp: 1 },
  swordfish: { n: 3, cap: 4, vp: 2 }, oyster: { n: 3, cap: 10, vp: 1 },
  crab: { n: 3, cap: 4, vp: 3 }, research: { n: 2, cap: 0, vp: 1 }, barge: { n: 1, cap: 10, vp: 0 }, canoe: { n: 2, cap: 4, vp: 0 },
};
export const LICENSE_VP = { shrimp: 5, cod: 6, lobster: 7, swordfish: 4, oyster: 3 };
export const BUILDING_VP = { casino: 2, salvage: 2, bait: 2, smoke: 3, canning: 1, pub: 10 };
export const BUFFET_VP = [0, 1, 3, 6, 10, 15];
export const KC_BONUS = ['building', 'fish', 'license', 'coins'];
export const MARKET = [[40, 7], [30, 6], [20, 5], [12, 4], [5, 3], [0, 2]];
export const RANKS = [[85, 'Legend of the Bay'], [75, 'Harbor Master'], [65, 'Skipper'], [50, 'Deckhand'], [0, 'Landlubber']];

const pickFrom = (arr, rng) => arr[Math.floor(rng() * arr.length) % arr.length];
export const clone = s => JSON.parse(JSON.stringify(s));

// ---------- setup ----------
// Modes: 'rival': the solo game against the Rival, which strikes boxes on your sheet (8 rounds);
//        'ai':    two players: you and a computer opponent draft from the same dice, each on their own sheet (10 rounds);
//        'open':  free play, no opponent (10 rounds).
export const MODES = {
  rival: { name: 'Solo', long: 'Solo vs the Rival', rounds: 8 },
  ai: { name: 'Vs AI', long: 'Versus AI player', rounds: 10 },
  open: { name: 'Free play', long: 'Free play', rounds: 10 },
};
export const modeName = m => (MODES[m] || MODES.open).name;
const hasDraft = s => s.mode === 'rival' || s.mode === 'ai';

export function newGame(mode = 'rival', rng = Math.random) {
  if (!MODES[mode]) mode = 'rival';
  const s = newSheet(mode, rng);
  if (mode === 'ai') { s.bot = newSheet(mode, rng, 'ai'); s.bot.step = { k: 'idle' }; }
  return s;
}

function newSheet(mode, rng, who) {
  const s = {
    v: 1, mode, rounds: MODES[mode].rounds, round: 1, phase: 'boat',
    marks: Object.fromEntries(Object.entries(SECTIONS).map(([k, v]) => [k, v.acts.map(() => 0)])),
    lic: Object.fromEntries(TYPES.map(t => [t, 0])),
    ships: Object.fromEntries(Object.entries(SHIPS).map(([k, v]) => [k, Array.from({ length: v.n }, () => ({ on: false, fish: 0 }))])),
    kc: { on: false, bonus: null }, done: {}, hexes: {}, salvageUses: 0,
    coins: Array(COIN_BOXES).fill(0),
    tokens: { boat: 'shrimp', harbor: 'crab', wharf: 'casino' },
    pool: [], seq: [], si: 0, step: { k: 'roll' }, queue: [], log: [], fishingDone: [], start: null,
  };
  if (who) s.who = who;
  let face; do face = pickFrom(BOAT_FACES, rng); while (face === 'coins');
  s.start = face;
  for (let i = 0; i < 3; i++) fill(s, face);
  s.queue = [];
  note(s, `Starting bonus: ${label(face)} license and boat.`);
  return s;
}

export const label = k => ({
  shrimp: 'Shrimp', cod: 'Cod', lobster: 'Lobster', swordfish: 'Swordfish', oyster: 'Oyster', coins: 'Coins',
  harbor: 'Harbor', wharf: 'Wharf', market: 'Market', crab: 'King Crab', club: "Captain's Club", research: 'Research Vessel',
  barge: 'Barge', canoe: 'Canoes', casino: 'Casino', bank: 'Bank & Trust', salvage: 'Salvage Yard', bait: 'Bait Shop',
  canning: 'Canning Co.', smoke: 'Smokehouse', pub: "Fisherman's Pub", buffet: 'Seafood Buffet',
}[k] || k);

function note(s, text, who = 'you') { s.log.push({ who, text, r: s.round }); if (s.log.length > 60) s.log.shift(); }

// ---------- queries ----------
export const openIdx = (s, sec) => s.marks[sec].indexOf(0);
export const lastOpenIdx = (s, sec) => s.marks[sec].lastIndexOf(0);
export const isOpen = (s, sec) => openIdx(s, sec) >= 0;
export const capacity = (s, type) => type === 'oyster' ? 4 + 2 * s.lic.oyster : SHIPS[type].cap;
export const isFull = (s, type, b) => SHIPS[type].cap > 0 && b.on && b.fish >= capacity(s, type);
export const fullBoats = (s, except) => Object.entries(s.ships).reduce((n, [t, list]) => t === except ? n : n + list.filter(b => isFull(s, t, b)).length, 0);
export const totalFish = s => Object.values(s.ships).flat().reduce((n, b) => n + b.fish, 0);
export const coinCount = s => s.coins.filter(c => c === 1).length;
export const marketValue = s => { const f = totalFish(s); return MARKET.find(([min]) => f >= min)[1] + (s.done.smoke ? 2 : 0); };
export const incomeValue = s => Math.min(10, 1 + s.lic.lobster + (s.done.canning ? fullBoats(s) : 0));
export const cashValue = s => s.done.bait ? 2 : 1;
export const launched = (s, t) => s.ships[t].filter(b => b.on).length;
export const sectionsOf = group => Object.keys(SECTIONS).filter(k => SECTIONS[k].group === group);
export const allSections = () => Object.keys(SECTIONS);
export const buildingsDone = s => WHARF.filter(b => s.done[b]).length;
export const licenseCount = s => TYPES.reduce((n, t) => n + s.lic[t], 0) + (s.kc.on ? 1 : 0);
export const seqActor = s => s.seq[s.si];

// ---------- coins & stars ----------
export function gainCoins(s, n) {
  let got = 0;
  for (let k = 0; k < n; k++) {
    const i = s.coins.indexOf(0);
    if (i < 0) break;
    s.coins[i] = 1; got++;
    if (STAR_BOXES.has(i)) s.queue.push({ t: 'star' });
  }
  return got;
}

// ---------- filling & activations ----------
function fill(s, sec) {
  const i = openIdx(s, sec);
  if (i < 0) return false;
  s.marks[sec][i] = 1;
  const act = SECTIONS[sec].acts[i];
  const group = SECTIONS[sec].group;
  if (group === 'boat') {
    if (act === 'L') license(s, sec);
    else if (act === 'B') launch(s, sec);
    else if (act === '?') {
      const canL = s.lic[sec] < 3, canB = launched(s, sec) < 3;
      if (canL && canB) s.queue.unshift({ t: 'lb', type: sec });
      else if (canL) license(s, sec); else if (canB) launch(s, sec);
    }
  } else if (group === 'harbor') {
    if (act === 'K') { s.kc.on = true; s.queue.unshift({ t: 'kc' }); }
    else if (act === 'B') launch(s, sec);
    else if (act === 'F') fishing(s, true);
  } else if (!isOpen(s, sec)) {
    s.done[sec] = true;
  }
  return true;
}

function license(s, t) {
  if (s.lic[t] >= 3) return;
  s.lic[t]++;
  if (s.lic[t] === 2) gainCoins(s, 2);
}

function launch(s, t) {
  const b = s.ships[t].find(x => !x.on);
  if (!b) return;
  b.on = true;
  if (s.lic.cod) gainCoins(s, s.lic.cod);
}

export function fishing(s, personal = false) {
  const extra = [];
  const barge = s.ships.barge[0];
  if (barge.on) {
    const catchN = Math.min(fullBoats(s, 'barge'), SHIPS.barge.cap - barge.fish);
    barge.fish += Math.max(0, catchN);
  }
  for (const [t, list] of Object.entries(s.ships)) {
    if (t === 'barge') continue;
    list.forEach((b, i) => {
      if (!b.on || SHIPS[t].cap === 0 || isFull(s, t, b)) return;
      if (t === 'oyster') {
        const room = capacity(s, t) - b.fish;
        if (room <= 1) { b.fish += 1; oysterBonus(s); }
        else s.queue.unshift({ t: 'oyster', boat: i });
      } else b.fish += 1;
    });
  }
  // oyster prompts resolve in boat order
  const oy = s.queue.filter(q => q.t === 'oyster').sort((a, b) => a.boat - b.boat);
  s.queue = [...oy, ...s.queue.filter(q => q.t !== 'oyster')];
  if (!personal) {
    const L = s.lic.swordfish;
    if (L >= 1) extra.push({ t: 'star' });
    if (L === 2) gainCoins(s, 1);
    if (L === 3) extra.push({ t: 'star' });
  }
  s.queue.push(...extra);
}

function oysterBonus(s) {
  if (s.lic.oyster === 3) s.queue.push({ t: 'star' });
  else gainCoins(s, 1);
}

// ---------- targets for the current decision ----------
export function dieTargets(s, die, src) {
  const f = die.face;
  if (TYPES.includes(f)) {
    if (src === 'pick' && f === 'shrimp' && s.lic.shrimp > 0) return TYPES.filter(t => isOpen(s, t));
    return isOpen(s, f) ? [f] : [];
  }
  if (f === 'harbor') return HARBOR.filter(k => isOpen(s, k));
  if (f === 'wharf') return WHARF.filter(k => isOpen(s, k));
  return [];
}
export const starTargets = s => allSections().filter(k => isOpen(s, k));

export function currentTask(s) { return s.queue[0] || null; }

// What the player can do right now with a die (for the UI).
export function options(s, dieIndex) {
  const step = s.step, task = currentTask(s);
  if (task || !step) return null;
  let src, idx, left = 1;
  if (step.k === 'pick') { src = 'pick'; idx = dieIndex; }
  else if (step.k === 'use') { src = step.src; idx = step.die; left = step.left; }
  else return null;
  const die = s.pool[idx];
  if (!die || (step.k === 'pick' && die.by)) return null;
  const f = die.face, shrimpLic = src === 'pick' && f === 'shrimp' && s.lic.shrimp > 0;
  const fresh = !(step.k === 'use' && step.used);
  return {
    die: idx, src, face: f, left,
    targets: dieTargets(s, die, src),
    coins: f === 'coins' || shrimpLic ? 3 : 0,
    market: f === 'market' ? marketValue(s) : 0,
    cash: fresh ? cashValue(s) : 0,
    salvage: fresh && s.done.salvage && s.salvageUses < 3,
    hex: fresh && s.done.buffet && TYPES.includes(f) && !s.hexes[f] ? f : null,
    reroll: src === 'pick' && s.done.casino && !(step.k === 'use' && (step.rerolled || step.used)),
  };
}

// ---------- the round flow ----------
export function isAuto(s) {
  if (s.queue.length) return false;
  return ['roll', 'next', 'rival', 'ai', 'income', 'fishing', 'end'].includes(s.step.k);
}

function seqFor(s) {
  if (!hasDraft(s)) return ['you', 'yshared'];
  const o = s.mode === 'ai' ? 'ai' : 'rival', osh = o === 'ai' ? 'ashared' : 'rshared';
  const youFirst = s.round % 2 === 1;
  return youFirst ? ['you', o, 'yshared', osh] : [o, 'you', osh, 'yshared'];
}

function enterSeq(s) {
  const a = s.seq[s.si];
  if (a === undefined) {
    if (s.phase === 'boat') s.step = { k: 'income' };
    else s.step = { k: 'end' };
    return;
  }
  const shared = s.pool.findIndex(d => !d.by);
  if (a === 'you') s.step = { k: 'pick' };
  else if (a === 'rival') s.step = { k: 'rival', shared: false };
  else if (a === 'rshared') s.step = { k: 'rival', shared: true, die: shared };
  else if (a === 'ai') s.step = { k: 'ai', shared: false };
  else if (a === 'ashared') s.step = { k: 'ai', shared: true, die: shared };
  else if (a === 'yshared') s.step = { k: 'use', die: shared, src: 'shared', left: 1 };
}

function roll(s, rng) {
  const n = hasDraft(s) ? 3 : 2;
  if (s.phase === 'boat') s.pool = Array.from({ length: n }, () => ({ kind: 'boat', face: pickFrom(BOAT_FACES, rng), by: null }));
  else s.pool = [...Array.from({ length: n - 1 }, () => ({ kind: 'town', face: pickFrom(TOWN_FACES, rng), by: null })),
    { kind: 'boat', face: pickFrom(BOAT_FACES, rng), by: null }];
  s.seq = seqFor(s); s.si = 0; s.rolls = (s.rolls || 0) + 1;
  enterSeq(s);
}

// Perform one automatic step. Returns a short event (for UI pacing) or null.
export function auto(s, rng = Math.random) { const e = autoStep(s, rng); tidy(s); return e; }
function autoStep(s, rng) {
  if (!isAuto(s)) return null;
  const k = s.step.k;
  if (k === 'roll') { roll(s, rng); return { k: 'roll' }; }
  if (k === 'next') { s.si++; enterSeq(s); return { k: 'next' }; }
  if (k === 'rival') return rivalTurn(s);
  if (k === 'ai') return aiTurn(s);
  if (k === 'income') {
    const n = incomeValue(s); gainCoins(s, n); note(s, `Income: +${n} coin${n > 1 ? 's' : ''}.`);
    if (s.bot) { const b = botCtx(s); gainCoins(b, incomeValue(b)); botTasks(b); botDone(b); }
    s.fishingDone = s.fishingDone || [];
    if (s.round % 2 === 0) s.step = { k: 'fishing' };
    else { s.phase = 'town'; s.step = { k: 'roll' }; }
    return { k: 'income', n };
  }
  if (k === 'fishing') {
    const before = totalFish(s);
    fishing(s, false);
    if (s.bot) { const b = botCtx(s); fishing(b, false); botTasks(b); botDone(b); }
    s.fishingDone.push(s.round);
    s.phase = 'town'; s.step = { k: 'roll' };
    return { k: 'fishing', n: totalFish(s) - before };
  }
  if (k === 'end') {
    if (s.mode === 'rival') moveTokens(s);
    if (s.round >= s.rounds) { s.phase = 'over'; s.step = { k: 'over' }; s.pool = []; return { k: 'over' }; }
    s.round++; s.phase = 'boat'; s.step = { k: 'roll' };
    return { k: 'end' };
  }
  return null;
}

// ---------- player actions ----------
// action: {type:'fill', die, sec} | {type:'coins', die} | {type:'market', die} | {type:'cash', die}
//         {type:'salvage', die} | {type:'hex', die} | {type:'reroll', die}
//         {type:'star', sec} | {type:'skip'} | {type:'lb', choice:'L'|'B'} | {type:'kc', choice} | {type:'oyster', choice:'fish'|'bonus'}
export function act(s, a, rng = Math.random) { const ok = actStep(s, a, rng); tidy(s); return ok; }
function actStep(s, a, rng) {
  const task = currentTask(s);
  if (task) return resolveTask(s, task, a);
  const st = s.step;
  if (st.k !== 'pick' && st.k !== 'use') return false;
  const idx = st.k === 'use' ? st.die : a.die;
  const o = options(s, idx);
  if (!o) return false;
  const die = s.pool[idx];
  const commit = () => {
    if (st.k === 'pick') { die.by = s.who || 'you'; s.step = { k: 'use', die: idx, src: 'pick', left: o.left }; }
    return s.step;
  };
  switch (a.type) {
    case 'reroll': {
      if (!o.reroll) return false;
      const step = commit();
      const faces = die.kind === 'boat' ? BOAT_FACES : TOWN_FACES;
      die.face = pickFrom(faces, rng); step.rerolled = true; s.rolls = (s.rolls || 0) + 1;
      step.left = die.face === 'shrimp' && s.lic.shrimp === 3 ? 2 : 1;
      note(s, `Casino reroll: ${label(die.face)}.`);
      return true;
    }
    case 'fill': {
      if (!o.targets.includes(a.sec)) return false;
      const step = commit();
      if (step.left === undefined || !step.used) step.left = (o.src === 'pick' && die.face === 'shrimp' && s.lic.shrimp === 3) ? 2 : 1;
      fill(s, a.sec); note(s, `${label(die.face)} die → ${label(a.sec)}.`);
      return spend(s, step, o);
    }
    case 'coins': {
      if (!o.coins) return false;
      const step = commit();
      if (!step.used) step.left = (o.src === 'pick' && die.face === 'shrimp' && s.lic.shrimp === 3) ? 2 : 1;
      gainCoins(s, 3); note(s, `+3 coins.`);
      return spend(s, step, o);
    }
    case 'market': {
      if (!o.market) return false;
      const step = commit(); const n = o.market;
      gainCoins(s, n); note(s, `Market: +${n} coins.`);
      return finishUse(s, step);
    }
    case 'cash': {
      if (!o.cash) return false;
      const step = commit(); gainCoins(s, o.cash); note(s, `Die taken as ${o.cash} coin${o.cash > 1 ? 's' : ''}.`);
      return finishUse(s, step);
    }
    case 'salvage': {
      if (!o.salvage) return false;
      const step = commit(); s.salvageUses++; s.queue.unshift({ t: 'star' }); note(s, 'Salvage Yard: star action.');
      return finishUse(s, step);
    }
    case 'hex': {
      if (!o.hex) return false;
      const step = commit(); s.hexes[o.hex] = true; note(s, `Seafood Buffet: ${label(o.hex)} hex.`);
      return finishUse(s, step);
    }
  }
  return false;
}

function spend(s, step, o) {
  step.used = true;
  step.left = (step.left || 1) - 1;
  if (step.left > 0) return true;
  if (o.src === 'pick' && s.pool[step.die].face === 'shrimp' && s.lic.shrimp >= 2) s.queue.push({ t: 'star' });
  return finishUse(s, step);
}
function finishUse(s, step) { s.step = { k: 'next' }; return true; }

function resolveTask(s, task, a) {
  if (task.t === 'star') {
    if (a.type === 'skip') { s.queue.shift(); return true; }
    if (a.type !== 'star' || !isOpen(s, a.sec)) return false;
    s.queue.shift(); fill(s, a.sec); note(s, `Star action → ${label(a.sec)}.`);
    return true;
  }
  if (task.t === 'lb') {
    if (a.type !== 'lb' || !['L', 'B'].includes(a.choice)) return false;
    s.queue.shift();
    if (a.choice === 'L') license(s, task.type); else launch(s, task.type);
    return true;
  }
  if (task.t === 'kc') {
    if (a.type !== 'kc' || !KC_BONUS.includes(a.choice)) return false;
    s.queue.shift(); s.kc.bonus = a.choice; return true;
  }
  if (task.t === 'oyster') {
    if (a.type !== 'oyster' || !['fish', 'bonus'].includes(a.choice)) return false;
    s.queue.shift();
    const b = s.ships.oyster[task.boat], room = capacity(s, 'oyster') - b.fish;
    if (a.choice === 'fish') b.fish += Math.min(2, room);
    else { b.fish += Math.min(1, room); oysterBonus(s); }
    return true;
  }
  return false;
}

// Drop any star tasks that have nowhere to go.
export function tidy(s) {
  while (s.queue[0]?.t === 'star' && !starTargets(s).length) s.queue.shift();
}

// ---------- the rival ----------
function loopFrom(list, start) { const i = Math.max(0, list.indexOf(start)); return list.map((_, k) => list[(i + k) % list.length]); }
function tokenSection(s, kind) {
  const list = kind === 'boat' ? TYPES : kind === 'harbor' ? HARBOR : WHARF;
  return loopFrom(list, s.tokens[kind]).find(k => isOpen(s, k)) || null;
}
function strike(s, sec, n) {
  const hit = [];
  for (let k = 0; k < n && sec; k++) {
    const i = lastOpenIdx(s, sec); if (i < 0) break;
    s.marks[sec][i] = 2; hit.push([sec, i]);
  }
  return hit;
}
function strikeStar(s) {
  const from = s.coins.indexOf(0);
  if (from < 0) return [];
  for (let i = from; i < COIN_BOXES; i++) if (STAR_BOXES.has(i) && s.coins[i] === 0) { s.coins[i] = 2; return [['coin', i]]; }
  return [];
}
function rivalEffect(s, face, n) {
  if (face === 'market') return strikeStar(s);
  if (face === 'harbor') return strike(s, tokenSection(s, 'harbor'), n);
  if (face === 'wharf') return strike(s, tokenSection(s, 'wharf'), n);
  if (TYPES.includes(face) && isOpen(s, face)) return strike(s, face, n);
  return strike(s, tokenSection(s, 'boat'), n);
}
export function rivalChoice(s) {
  const avail = s.pool.map((d, i) => [d, i]).filter(([d]) => !d.by);
  const find = f => avail.find(([d]) => d.face === f);
  if (s.phase === 'town') {
    if (HARBOR.some(k => isOpen(s, k)) && find('harbor')) return find('harbor')[1];
    if (WHARF.some(k => isOpen(s, k)) && find('wharf')) return find('wharf')[1];
    const boat = avail.find(([d]) => d.kind === 'boat');
    if (boat) return boat[1];
    if (find('market')) return find('market')[1];
    return avail[0][1];
  }
  for (const t of loopFrom(TYPES, s.tokens.boat)) if (isOpen(s, t) && find(t)) return find(t)[1];
  if (find('coins')) return find('coins')[1];
  return avail[0][1];
}
function rivalTurn(s) {
  const st = s.step;
  const idx = st.shared ? st.die : rivalChoice(s);
  const die = s.pool[idx];
  if (!st.shared) die.by = 'rival';
  const hits = rivalEffect(s, die.face, st.shared ? 1 : 2);
  const where = hits.length ? (hits[0][0] === 'coin' ? 'a star on your coin track' : label(hits[0][0])) : 'nothing';
  note(s, `${st.shared ? 'Shared' : 'Took'} ${label(die.face)} and struck ${where}.`, 'rival');
  s.lastStrike = hits;
  s.step = { k: 'next' };
  return { k: 'rival', die: idx, face: die.face, shared: st.shared, hits };
}
function moveTokens(s) {
  for (const [kind, list] of [['boat', TYPES], ['harbor', HARBOR], ['wharf', WHARF]]) {
    const order = loopFrom(list, s.tokens[kind]).slice(1).concat(s.tokens[kind]);
    const nxt = order.find(k => isOpen(s, k));
    if (nxt) s.tokens[kind] = nxt;
  }
}

// ---------- the AI player ----------
// The AI keeps a full sheet of its own in s.bot and drafts from the same dice as you.
// It plays greedily: every legal use of every die it may take is tried on a copy of its
// sheet, follow-up choices (stars, license-or-boat, oyster catches…) are resolved the same
// way, and the result with the best projected value is kept.
function botCtx(s) {
  const b = s.bot;
  b.pool = s.pool; b.round = s.round; b.phase = s.phase; b.rounds = s.rounds; b.fishingDone = s.fishingDone || [];
  return b;
}
function botDone(b) { delete b.pool; delete b.fishingDone; b.step = { k: 'idle' }; b.queue = b.queue.filter(q => q.t !== 'star' || starTargets(b).length); }

const fishingLeft = b => {
  let n = 0;
  for (let r = b.round; r <= b.rounds; r++) if (r % 2 === 0 && !(r === b.round && b.fishingDone?.includes(r))) n++;
  return n;
};
// weights tuned by self-play: column progress matters most, loose coins barely at all
const MARK_W = 3, LIC_W = 2, COIN_W = 0, TIME_W = .5;
const ABILITY = { casino: .3, bait: .5, salvage: 1.2, smoke: .6, canning: .5, buffet: .8 };
export function botValue(b) {
  let v = score(b).total;
  const fr = fishingLeft(b), roundsLeft = Math.max(0, b.rounds - b.round), late = TIME_W ? Math.min(1, (roundsLeft + 1) / (b.rounds * TIME_W)) : 1;
  for (const [t, list] of Object.entries(b.ships)) {
    if (t === 'barge' || !SHIPS[t].cap) continue;
    for (const boat of list) if (boat.on) v += Math.min(capacity(b, t) - boat.fish, fr * (t === 'oyster' ? 2 : 1)) * .85;
  }
  if (b.ships.barge[0].on) v += Math.min(SHIPS.barge.cap - b.ships.barge[0].fish, fr * 2) * .6;
  for (const t of TYPES) if (b.lic[t] < 3) v += b.lic[t] * LICENSE_VP[t] / 3 * LIC_W * late;
  v += b.lic.lobster * roundsLeft * .25 + b.lic.cod * .4 + b.lic.swordfish * fr * .5;
  for (const [sec, list] of Object.entries(b.marks)) {
    const g = SECTIONS[sec].group, marked = list.filter(m => m === 1).length;
    if (g !== 'wharf') v += marked * MARK_W * late;
    else if (!b.done[sec]) {
      const worth = (BUILDING_VP[sec] || (sec === 'buffet' ? 4 : 0)) + (ABILITY[sec] || 0) * roundsLeft;
      v += marked / list.length * worth * .6;
    } else v += (ABILITY[sec] || 0) * roundsLeft;
  }
  if (b.done.buffet) v += Object.keys(b.hexes).length * .5;
  return v + coinCount(b) * COIN_W;
}

const lean = b => clone({ ...b, log: [] });
function botMoves(b, idx) {
  const o = options(b, idx);
  if (!o) return [];
  const m = o.targets.map(sec => ({ type: 'fill', die: idx, sec }));
  for (const k of ['coins', 'market', 'salvage', 'hex', 'cash']) if (o[k]) m.push({ type: k, die: idx });
  return m;
}
function taskChoices(b) {
  const t = currentTask(b);
  if (!t) return [];
  if (t.t === 'star') return [...starTargets(b).map(sec => ({ type: 'star', sec })), { type: 'skip' }];
  if (t.t === 'lb') return [{ type: 'lb', choice: 'L' }, { type: 'lb', choice: 'B' }];
  if (t.t === 'kc') return KC_BONUS.map(choice => ({ type: 'kc', choice }));
  if (t.t === 'oyster') return [{ type: 'oyster', choice: 'fish' }, { type: 'oyster', choice: 'bonus' }];
  return [];
}
function bestOf(b, moves, deep) {
  let best = null;
  for (const m of moves) {
    const c = lean(b);
    if (!act(c, m)) continue;
    if (deep) { botTasks(c); if (c.step.k === 'use') botUse(c); }
    const v = botValue(c);
    if (!best || v > best.v + 1e-9) best = { m, v };
  }
  return best?.m || null;
}
// Resolve every pending follow-up (stars, license-or-boat, King Crab bonus, oyster catches).
function botTasks(b) {
  for (let guard = 0; b.queue.length && guard < 60; guard++) {
    const m = bestOf(b, taskChoices(b), false);
    if (!m || !act(b, m)) b.queue.shift();
  }
}
// Keep using the die in hand (a level-3 Shrimp license gives two uses).
function botUse(b) {
  for (let guard = 0; b.step.k === 'use' && guard < 4; guard++) {
    const m = bestOf(b, botMoves(b, b.step.die), false);
    if (!m || !act(b, m)) { b.step = { k: 'next' }; break; }
    botTasks(b);
  }
}
const describe = (b, m, face) => ({
  fill: () => `${label(face)} → ${label(m.sec)}`,
  coins: () => `${label(face)} for +3 coins`,
  market: () => `sold fish at the market`,
  cash: () => `traded ${label(face)} for coins`,
  salvage: () => `${label(face)} for a Salvage ★`,
  hex: () => `${label(face)} on a Buffet hex`,
}[m.type] || (() => label(face)))();

export function aiChoice(s) {
  const st = s.step, b = botCtx(s);
  b.step = st.shared ? { k: 'use', die: st.die, src: 'shared', left: 1 } : { k: 'pick' };
  const dice = st.shared ? [st.die] : s.pool.map((d, i) => i).filter(i => !s.pool[i].by);
  const m = bestOf(b, dice.flatMap(i => botMoves(b, i)), true);
  return { b, m, dice };
}
function aiTurn(s) {
  const st = s.step;
  const { b, m, dice } = aiChoice(s);
  const idx = m ? m.die : dice[0], die = s.pool[idx];
  let text = 'passed';
  if (m && act(b, m)) {
    text = describe(b, m, die.face);
    botTasks(b);
    botUse(b);
  } else if (!st.shared && die) die.by = 'ai';
  const sc = score(b).total;
  botDone(b);
  note(s, `${st.shared ? 'Shared' : 'Took'} ${label(die?.face)}: ${text}.`, 'ai');
  s.step = { k: 'next' };
  return { k: 'ai', die: idx, face: die?.face, shared: st.shared, text, score: sc };
}

// ---------- scoring ----------
export function score(s) {
  const fish = totalFish(s);
  let boats = 0;
  for (const [t, list] of Object.entries(s.ships)) boats += list.filter(b => b.on).length * SHIPS[t].vp;
  const licenses = (s.kc.on ? 5 : 0) + TYPES.reduce((n, t) => n + (s.lic[t] === 3 ? LICENSE_VP[t] : 0), 0);
  let buildings = 0;
  for (const [b, vp] of Object.entries(BUILDING_VP)) if (s.done[b]) buildings += vp;
  buildings += 2 * s.marks.bank.filter(m => m === 1).length;
  if (s.done.buffet) buildings += BUFFET_VP[TYPES.filter(t => s.hexes[t]).length];
  let bonus = 0;
  if (s.kc.on && s.kc.bonus) {
    const raw = { building: 2 * buildingsDone(s), fish: Math.floor(fish / 6), license: licenseCount(s), coins: Math.floor(coinCount(s) / 10) }[s.kc.bonus];
    bonus = Math.min(10, raw);
  }
  return { fish, boats, licenses, buildings, bonus, total: fish + boats + licenses + buildings + bonus };
}
export const rank = total => RANKS.find(([min]) => total >= min)[1];

export function validSave(s) {
  if (s?.mode === 'ai' && !validSheet(s.bot)) return false;
  return validSheet(s) && !!s.step && Array.isArray(s.queue);
}
function validSheet(s) {
  return !!(s && s.v === 1 && s.marks && s.ships && s.lic && Array.isArray(s.coins) && s.coins.length === COIN_BOXES && s.step && Array.isArray(s.queue)
    && Object.keys(SECTIONS).every(k => Array.isArray(s.marks[k]) && s.marks[k].length === SECTIONS[k].acts.length));
}
