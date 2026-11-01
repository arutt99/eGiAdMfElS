// What changed on a sheet between two states: the moments the UI stages with sound, haptics,
// banners and score floaters. Pure: no DOM, so it can be tested in node.
import * as E from './engine.mjs';

// Each moment: { k, ...details, vp } where vp is the score it is worth (0 when it scores nothing by itself).
export function moments(a, b) {
  if (!a || !b || a.mode !== b.mode) return [];
  const out = [];
  // boxes in sections
  for (const sec of Object.keys(E.SECTIONS)) {
    const pa = a.marks[sec], pb = b.marks[sec];
    pb.forEach((m, i) => {
      if (pa[i] === m) return;
      if (m === 1) out.push({ k: 'mark', sec, i, vp: sec === 'bank' ? 2 : 0 });
      else if (m === 2) out.push({ k: 'strike', sec, i, vp: 0 });
    });
  }
  // boats launched, fish caught
  for (const [type, list] of Object.entries(b.ships)) {
    list.forEach((boat, i) => {
      const old = a.ships[type][i];
      if (boat.on && !old.on) out.push({ k: 'launch', type, i, vp: E.SHIPS[type].vp });
      if (boat.fish > old.fish) out.push({ k: 'fish', type, i, n: boat.fish - old.fish, from: old.fish, vp: boat.fish - old.fish });
    });
  }
  // licenses
  for (const t of E.TYPES) if (b.lic[t] > a.lic[t]) out.push({ k: 'license', type: t, lvl: b.lic[t], vp: b.lic[t] === 3 ? E.LICENSE_VP[t] : 0 });
  if (b.kc.on && !a.kc.on) out.push({ k: 'kc', vp: 5 });
  if (b.kc.bonus && !a.kc.bonus) out.push({ k: 'kcBonus', bonus: b.kc.bonus, vp: 0 });
  // wharf buildings switching on
  for (const w of E.WHARF) if (b.done[w] && !a.done[w]) out.push({ k: 'building', sec: w, vp: E.BUILDING_VP[w] || 0 });
  for (const t of E.TYPES) if (b.hexes[t] && !a.hexes[t]) out.push({ k: 'hex', type: t, vp: 0 });
  // coin track: coins gained, stars landed on, stars struck
  const gained = [];
  b.coins.forEach((c, i) => {
    if (c === a.coins[i]) return;
    if (c === 1) gained.push(i);
    else if (c === 2) out.push({ k: 'strike', sec: 'coin', i, vp: 0 });
  });
  if (gained.length) {
    out.push({ k: 'coins', n: gained.length, first: gained[0], vp: 0 });
    for (const i of gained) if (E.STAR_BOXES.has(i)) out.push({ k: 'star', i, vp: 0 });
  }
  // rounds
  if (b.phase === 'over' && a.phase !== 'over') out.push({ k: 'over', vp: 0 });
  else if (b.round !== a.round) out.push({ k: 'round', round: b.round, vp: 0 });
  return out;
}

// Score difference between two states, overall and per category.
export function scoreDelta(a, b) {
  const sa = E.score(a), sb = E.score(b);
  return Object.fromEntries(Object.keys(sb).map(k => [k, sb[k] - sa[k]]));
}

// Coins needed to reach the next open ★ on the coin track (null when none is left).
export function nextStarIn(s) {
  const from = s.coins.indexOf(0);
  if (from < 0) return null;
  for (let i = from; i < E.COIN_BOXES; i++) if (E.STAR_BOXES.has(i) && s.coins[i] === 0) return i - from + 1;
  return null;
}

// The rank above a score, and how far away it is (solo ranks).
export function nextRank(total) {
  const up = E.RANKS.slice().reverse().find(([min]) => min > total);
  return up ? { name: up[1], need: up[0] - total } : null;
}
