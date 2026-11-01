// Long-press help: which area of a sheet is under a point, and what it means right now.
import * as E from './engine.mjs';
import { HIT, LICENSE, SHIP, SHIP_H, KC, TRACK } from './layout.mjs';

const L = E.label;
const plural = (n, one, many = one + 's') => `${n} ${n === 1 ? one : many}`;

// ---------- regions (first match wins, so specific areas come first) ----------
const COL_SPAN = { shrimp: [48, 254], cod: [262, 456], lobster: [462, 656], swordfish: [664, 862], oyster: [866, 1070] };
const REGIONS = { boats: [], harbor: [] };
const add = (sheet, rect, ref) => REGIONS[sheet].push({ rect, ref });

E.TYPES.forEach(t => {
  const [x0, x1] = COL_SPAN[t];
  LICENSE.cards.forEach(([y0, y1], lvl) => add('boats', [x0, y0 - 4, x1, y1 + 4], { k: 'license', type: t, lvl }));
});
for (const [type, spec] of Object.entries(SHIP)) {
  const [dy0, dy1] = SHIP_H[type], [bx, bw, sheet] = spec.box;
  spec.marks.forEach((m, i) => add(sheet, [bx - 6, m.y + dy0, bx + bw + 6, m.y + dy1 + 18], { k: 'ship', type, i }));
}
E.TYPES.forEach(t => { const [x0, x1] = COL_SPAN[t]; add('boats', [x0, 0, x1, 410], { k: 'section', sec: t }); });
add('boats', [0, 1110, 282, 1429], { k: 'income' });
add('boats', [282, 1110, 784, 1429], { k: 'rounds' });
add('boats', [784, 1110, 1100, 1429], { k: 'score' });

add('harbor', KC.card, { k: 'kc' });
for (const sec of [...E.HARBOR, ...E.WHARF]) add('harbor', HIT[sec], { k: 'section', sec });
add('harbor', [0, 0, 190, 470], { k: 'section', sec: 'crab' });
add('harbor', [560, 0, 1122, 450], { k: 'market' });
add('harbor', [0, 1140, 1122, 1402], { k: 'coins' });

export function regionAt(sheet, x, y) {
  return REGIONS[sheet].find(({ rect: [x0, y0, x1, y1] }) => x >= x0 && x <= x1 && y >= y0 && y <= y1) || null;
}

// ---------- shared wording ----------
const ACT_WORD = {
  0: 'a plain box', L: 'a license', B: 'a boat launch', '?': 'your choice of license or boat',
  K: 'the King Crab license', F: 'a private fishing trip',
};
export const LIC_TEXT = {
  shrimp: ['When you pick a Shrimp die it can be used as any boat face (any column) or as 3 coins.',
    'As level 1, plus a ★ star action after using the picked Shrimp die.',
    'Use the picked Shrimp die twice, then take a ★ star action.'],
  cod: ['Every boat you launch (any kind) earns 1 coin.', 'Every boat you launch earns 2 coins.', 'Every boat you launch earns 3 coins.'],
  lobster: ['Income phase: +1 coin.', 'Income phase: +2 coins.', 'Income phase: +3 coins.'],
  swordfish: ['After each Fishing phase: a ★ star action.', 'After each Fishing phase: a ★ star action and 1 coin.', 'After each Fishing phase: two ★ star actions.'],
  oyster: ['Oyster boats hold 6 fish. Each catches 2 fish, or 1 fish + 1 coin.', 'Oyster boats hold 8 fish. Each catches 2 fish, or 1 fish + 1 coin.',
    'Oyster boats hold 10 fish. Each catches 2 fish, or 1 fish + a ★ star action.'],
};
const SECTION_TEXT = {
  crab: 'Marked with a Harbor die. The 5th box gives the King Crab license (5 VP and a bonus you choose). Boxes 7, 9 and 11 each launch a King Crab boat worth 3 VP that holds 4 fish.',
  club: 'Marked with a Harbor die. Each F box sends you on a private fishing trip: every launched boat catches fish right away. Swordfish license bonuses don\'t apply to these trips.',
  research: 'Marked with a Harbor die. Boxes 1 and 3 each launch a Research Vessel, worth 1 VP each. They carry no fish.',
  barge: 'Marked with a Harbor die. The 3rd box launches the Barge. In each Fishing phase it catches 1 fish for every full boat you have (up to 10 fish). No VP for the boat itself, but every fish scores.',
  canoe: 'Marked with a Harbor die. Boxes 1 and 3 each launch a canoe. Canoes hold 4 fish each; no VP for the boat, but every fish scores.',
  casino: 'Wharf building, 2 boxes. When finished: after picking a die you may reroll it once. Worth 2 VP.',
  bank: 'Wharf building, 3 boxes. Every box you mark here is worth 2 VP, finished or not.',
  buffet: 'Wharf building, 3 boxes. When finished: instead of using a boat die normally, mark that fish\'s hex. Scores by hexes marked: 1 → 1, 2 → 3, 3 → 6, 4 → 10, 5 → 15 VP.',
  salvage: 'Wharf building, 1 box. When finished: you may turn any die into a ★ star action, up to 3 times. Worth 2 VP.',
  pub: 'Wharf building, 4 boxes. Worth 10 VP when all four are marked. No other effect.',
  bait: 'Wharf building, 1 box. When finished: trading a die for coins pays 2 instead of 1. Worth 2 VP.',
  smoke: 'Wharf building, 1 box. When finished: Market dice pay 2 extra coins. Worth 3 VP.',
  canning: 'Wharf building, 1 box. When finished: Income pays +1 coin per full boat. Worth 1 VP.',
};
const FACE_TEXT = {
  shrimp: 'Boat die. Mark the top open box in the Shrimp column.',
  cod: 'Boat die. Mark the top open box in the Cod column.',
  lobster: 'Boat die. Mark the top open box in the Lobster column.',
  swordfish: 'Boat die. Mark the top open box in the Swordfish column.',
  oyster: 'Boat die. Mark the top open box in the Oyster column.',
  coins: 'Boat die. Gain 3 coins on the coin track.',
  harbor: 'Town die. Mark the top open box of any harbor ship: King Crab, Captain\'s Club, Research Vessel, Barge or Canoes.',
  wharf: 'Town die. Mark the top open box of any wharf building.',
  market: 'Town die. Sell your catch: coins based on how many fish you have caught in total.',
};

const stat = (items) => `<div class="stat">${items.filter(Boolean).map(([t, cls = '']) => `<span class="${cls}">${t}</span>`).join('')}</div>`;
const rivalNote = (s, sec) => {
  if (s.mode !== 'rival' || s.phase === 'over') return '';
  const kinds = Object.entries(s.tokens).filter(([, v]) => v === sec);
  return kinds.length ? '<p><b>R</b>: the Rival is aiming here. If it takes a matching die it strikes the lowest open boxes of this section.</p>' : '';
};

// ---------- builders ----------
function sectionInfo(s, sec) {
  const marks = s.marks[sec], acts = E.SECTIONS[sec].acts, group = E.SECTIONS[sec].group;
  const mine = marks.filter(m => m === 1).length, struck = marks.filter(m => m === 2).length, open = marks.filter(m => m === 0).length;
  const next = E.openIdx(s, sec);
  const kicker = group === 'boat' ? 'Boat column' : group === 'harbor' ? 'Harbor ship' : 'Wharf building';
  let body = '';
  if (group === 'boat') {
    body += `<p>Use a ${L(sec)} die (or a picked Shrimp die with a Shrimp license, or a ★ star action) to mark the top open box. Circled boxes trigger: <b>L</b> license, <b>B</b> launch a boat, <b>?</b> license or boat.</p>`;
    body += `<p>Licenses (the three cards below) and boats (the three ships) are explained if you hold on them.</p>`;
  } else body += `<p>${SECTION_TEXT[sec]}</p>`;
  if (group !== 'boat') body += '<p>A ★ star action can also mark the top open box here.</p>';
  const items = [[`${mine} marked`], struck ? [`${struck} struck by Rival`, 'warn'] : null, [`${open} open`]];
  if (next >= 0) items.push([`Next: ${ACT_WORD[acts[next]]}`]);
  else items.push([group === 'wharf' ? 'Built ✓' : 'Full', 'good']);
  if (group === 'boat') items.push([`License ${s.lic[sec]}/3`], [`Boats ${E.launched(s, sec)}/3`]);
  if (group === 'wharf') {
    const vp = sectionVP(s, sec);
    if (vp != null) items.push([`${vp} VP now`, vp ? 'good' : '']);
    if (sec === 'buffet') items.push([`Hexes: ${E.TYPES.filter(t => s.hexes[t]).length}/5`]);
    if (sec === 'salvage' && s.done.salvage) items.push([`Uses left: ${3 - s.salvageUses}`]);
  }
  if (group === 'harbor' && sec !== 'club') items.push([`Launched ${E.launched(s, sec)}/${E.SHIPS[sec].n}`]);
  return { kicker, title: sec === 'canoe' ? 'Canoes (Inuit)' : L(sec), body: body + stat(items) + rivalNote(s, sec) };
}
function sectionVP(s, sec) {
  if (sec === 'bank') return 2 * s.marks.bank.filter(m => m === 1).length;
  if (sec === 'buffet') return s.done.buffet ? E.BUFFET_VP[E.TYPES.filter(t => s.hexes[t]).length] : 0;
  if (E.BUILDING_VP[sec] != null) return s.done[sec] ? E.BUILDING_VP[sec] : 0;
  return null;
}

function licenseInfo(s, type, lvl) {
  const have = s.lic[type];
  const items = LIC_TEXT[type].map((t, i) => `<li class="${i === have - 1 ? 'on' : i < have ? '' : 'off'}">Level ${i + 1}${i === have - 1 ? ' (yours)' : ''}: ${t}</li>`).join('');
  let body = `<p>${LIC_TEXT[type][lvl]}</p>`;
  if (lvl === 1) body += '<p>Reaching level 2 of any license also pays 2 coins at once.</p>';
  if (lvl === 2) body += `<p>Level 3 scores <b>${E.LICENSE_VP[type]} VP</b> at the end of the game.</p>`;
  body += `<p>Each level replaces the one before it:</p><ul>${items}</ul>`;
  body += '<p>Licenses come from <b>L</b> and <b>?</b> boxes in the column above.</p>';
  body += stat([[have > lvl ? 'Owned ✓' : 'Not yet', have > lvl ? 'good' : ''], [`Your level: ${have}/3`]]);
  return { kicker: 'License card', title: `${L(type)} license, level ${lvl + 1}`, body };
}

function shipInfo(s, type, i) {
  const b = s.ships[type][i], spec = E.SHIPS[type];
  const cap = type === 'oyster' ? E.capacity(s, 'oyster') : spec.cap;
  const name = { crab: 'King Crab boat', research: 'Research Vessel', barge: 'Barge', canoe: 'Canoe' }[type] || `${L(type)} boat`;
  let body = '';
  if (type === 'research') body += '<p>Launched from the Research Vessel boxes. Carries no fish; worth 1 VP once launched.</p>';
  else if (type === 'barge') body += '<p>Launched from the 3rd Barge box. In each Fishing phase it catches 1 fish for every full boat you have, up to 10. Each fish scores 1 VP.</p>';
  else {
    body += `<p>Launched from a <b>B</b> (or <b>?</b>) box. In every even-round Fishing phase (and on Captain's Club trips) it catches ${type === 'oyster' ? '2 fish, or 1 fish plus a bonus' : '1 fish'} until full.</p>`;
    body += `<p>${spec.vp ? `Worth <b>${spec.vp} VP</b> once launched, plus` : 'No VP for the boat itself, but'} 1 VP per fish.${type === 'oyster' ? ' Capacity grows with the Oyster license (4 → 6 → 8 → 10).' : ''}</p>`;
  }
  const items = [[b.on ? 'Launched ✓' : 'Not launched', b.on ? 'good' : '']];
  if (cap) items.push([`Fish ${b.fish}/${cap}`, b.on && b.fish >= cap ? 'good' : ''], b.on && b.fish >= cap ? ['Full: counts for Barge & Canning', 'good'] : null);
  if (b.on) items.push([`Scoring ${spec.vp + b.fish} VP`]);
  return { kicker: 'Boat', title: `${name} ${s.ships[type].length > 1 ? i + 1 : ''}`.trim(), body: body + stat(items) };
}

// What each King Crab bonus would score right now (before the 10 VP cap).
export function kcValues(s) {
  const fish = E.totalFish(s);
  return { building: 2 * E.buildingsDone(s), fish: Math.floor(fish / 6), license: E.licenseCount(s), coins: Math.floor(E.coinCount(s) / 10) };
}
export const KC_NAMES = { building: '2 VP per finished building', fish: '1 VP per 6 fish', license: '1 VP per license level', coins: '1 VP per 10 coins' };
// One line for what a finished wharf building does, for the "building open" banner.
export const BUILDING_LINE = {
  casino: 'Reroll your picked die once', bank: 'All three boxes scored', salvage: 'Turn a die into a ★ star action (3×)',
  bait: 'Trading a die now pays 2 coins', canning: 'Income +1 coin per full boat', smoke: 'Market dice pay 2 extra coins',
  pub: '10 VP', buffet: 'Boat dice can mark fish hexes',
};

function kcInfo(s) {
  const raw = kcValues(s), names = KC_NAMES;
  const li = E.KC_BONUS.map(k => `<li class="${s.kc.bonus === k ? 'on' : ''}">${names[k]}: would be ${Math.min(10, raw[k])} VP now${s.kc.bonus === k ? ' (chosen)' : ''}</li>`).join('');
  return {
    kicker: 'Harbor', title: 'King Crab license',
    body: `<p>Earned by marking the 5th King Crab box. Worth <b>5 VP</b>, and you pick one end-game bonus (max 10 VP):</p><ul>${li}</ul>`
      + stat([[s.kc.on ? 'Owned ✓' : 'Not yet', s.kc.on ? 'good' : ''], s.kc.bonus ? [`Bonus: ${Math.min(10, raw[s.kc.bonus])} VP`, 'good'] : null]),
  };
}

function marketInfo(s) {
  const fish = E.totalFish(s);
  const rows = E.MARKET.slice().reverse().map(([min, c], i, a) => {
    const max = i < a.length - 1 ? a[i + 1][0] - 1 : null;
    const on = fish >= min && (max == null || fish <= max);
    return `<li class="${on ? 'on' : ''}">${min}${max == null ? '+' : `–${max}`} fish: ${c} coins${on ? ' ← you' : ''}</li>`;
  }).join('');
  return {
    kicker: 'Town', title: 'Market',
    body: `<p>Use a Market die to sell: gain coins by the total fish caught across all your boats. Fish stay on your boats and still score.</p><ul>${rows}</ul>`
      + (s.done.smoke ? '<p>Smokehouse: +2 coins.</p>' : '')
      + (s.mode === 'rival' ? '<p>A Market die taken by the Rival strikes your next ★ on the coin track.</p>' : '')
      + stat([[`${fish} fish caught`], [`Market pays ${E.marketValue(s)}`, 'good']]),
  };
}

function coinsInfo(s) {
  const have = E.coinCount(s), next = s.coins.indexOf(0);
  let stars = 0; for (let i = Math.max(0, next); i < E.COIN_BOXES && next >= 0; i++) if (E.STAR_BOXES.has(i) && s.coins[i] === 0) { stars = i - next + 1; break; }
  const struck = s.coins.filter(c => c === 2).length;
  return {
    kicker: 'Coin track', title: 'Coins',
    body: '<p>Every coin you gain marks the next box, left to right, row by row. Landing on a ★ gives a <b>star action</b>: mark the top open box of any section on either sheet.</p>'
      + '<p>Coins don\'t score directly, only through the King Crab "per 10 coins" bonus.</p>'
      + (s.mode === 'rival' ? '<p>Rival Market dice strike your next open ★, so it is skipped.</p>' : '')
      + stat([[`${have} coins`], next >= 0 && stars ? [`Next ★ in ${plural(stars, 'coin')}`, 'good'] : null, struck ? [`${struck} struck`, 'warn'] : null]),
  };
}

function incomeInfo(s) {
  return {
    kicker: 'Income', title: 'Income phase',
    body: '<p>After the boat dice each round you gain 1 coin, plus 1 per Lobster license level, plus 1 per full boat if Canning Co. is built. Income is capped at 10.</p>'
      + stat([[`Base 1`], [`Lobster +${s.lic.lobster}`], s.done.canning ? [`Canning +${E.fullBoats(s)}`] : null, [`Income now ${E.incomeValue(s)}`, 'good']]),
  };
}

function roundsInfo(s) {
  const fishLeft = Array.from({ length: s.rounds }, (_, i) => i + 1).filter(r => r % 2 === 0 && r >= s.round && !(s.fishingDone || []).includes(r)).length;
  return {
    kicker: 'Round tracker', title: `Round ${Math.min(s.round, s.rounds)} of ${s.rounds}`,
    body: `<ol style="padding-left:18px;margin:4px 0">
      <li><b>Boat dice</b>: pick a die and use it; then the leftover shared die.${s.mode === 'rival' ? ' The Rival also takes one.' : ''}</li>
      <li><b>Income</b>: coins from the formula at the left.</li>
      <li><b>Fishing</b>: even rounds only (the fish icons). Launched boats catch fish.</li>
      <li><b>Town dice</b>: Harbor, Wharf and Market, plus one boat die.</li></ol>`
      + (s.mode === 'rival' ? '<p>You choose first in odd rounds; the Rival goes first in even rounds.</p>' : '')
      + stat([[`${Math.max(0, s.rounds - s.round + (s.phase === 'over' ? 0 : 1))} rounds left`], [`${fishLeft} Fishing phases left`]]),
  };
}

function scoreInfo(s) {
  const sc = E.score(s);
  return {
    kicker: 'Final score', title: `${plural(sc.total, 'point')} so far`,
    body: `<ul>
      <li><b>Fish ${sc.fish}</b>: 1 VP per fish on any boat.</li>
      <li><b>Boats ${sc.boats}</b>: the VP printed under each launched boat.</li>
      <li><b>Licenses ${sc.licenses}</b>: level 3 licenses score their VP; King Crab license 5 VP.</li>
      <li><b>Buildings ${sc.buildings}</b>: finished wharf buildings, Bank boxes, Buffet hexes.</li>
      <li><b>Bonuses ${sc.bonus}</b>: your King Crab bonus (max 10).</li></ul>`
      + (s.mode === 'rival' ? `<p>Rank now: <b>${E.rank(sc.total)}</b>. ${E.RANKS.slice().reverse().map(([m, n]) => `${n} ${m}+`).slice(1).join(' · ')}</p>` : ''),
  };
}

export function sheetInfo(s, ref) {
  if (ref.k === 'section') return sectionInfo(s, ref.sec);
  if (ref.k === 'license') return licenseInfo(s, ref.type, ref.lvl);
  if (ref.k === 'ship') return shipInfo(s, ref.type, ref.i);
  if (ref.k === 'kc') return kcInfo(s);
  if (ref.k === 'market') return marketInfo(s);
  if (ref.k === 'coins') return coinsInfo(s);
  if (ref.k === 'income') return incomeInfo(s);
  if (ref.k === 'rounds') return roundsInfo(s);
  if (ref.k === 'score') return scoreInfo(s);
  return null;
}

export function dieInfo(s, i) {
  const d = s.pool[i]; if (!d) return null;
  const f = d.face;
  let body = `<p>${FACE_TEXT[f]}</p>`;
  if (f === 'shrimp' && s.lic.shrimp) body += '<p>With your Shrimp license, a <b>picked</b> Shrimp die can go in any boat column or be taken as 3 coins.</p>';
  if (E.TYPES.includes(f) && s.done.buffet && !s.hexes[f]) body += `<p>Seafood Buffet: you could mark the ${L(f)} hex instead.</p>`;
  if (f === 'market') body += `<p>Right now it pays <b>${E.marketValue(s)} coins</b> (${E.totalFish(s)} fish).</p>`;
  body += `<p>Any die can instead be traded for ${E.cashValue(s)} coin${E.cashValue(s) > 1 ? 's' : ''}.</p>`;
  const who = d.by === 'rival' ? ['Taken by the Rival', 'warn'] : d.by === 'ai' ? ['Taken by the AI player', 'warn'] : d.by === 'you' ? ['Yours this round', 'good'] : ['Available'];
  if (s.mode === 'rival' && !d.by) body += `<p>If the Rival takes it, it strikes ${f === 'market' ? 'your next ★ on the coin track' : f === 'harbor' || f === 'wharf' ? `the ${f} section with its <b>R</b> pin` : E.TYPES.includes(f) ? `the bottom of the ${L(f)} column` : 'the boat column with its <b>R</b> pin'}.</p>`;
  return { kicker: d.kind === 'town' ? 'Town die' : 'Boat die', title: L(f), body: body + stat([who]) };
}

