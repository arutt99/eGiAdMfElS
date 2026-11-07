// Procedural card art. Every card gets its own seeded scene as an SVG string (200 x 150):
// sky and time of day, layered ridges, a faction landscape, the subject, particles and light.
// No images; the same card always draws the same picture.

import { RARITIES } from './data.mjs';

const W = 200, H = 150;

// ---------- seeded helpers ----------
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function mulberry(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const n1 = v => Math.round(v * 10) / 10;

// ---------- colour ----------
function rgb(hex) { const v = parseInt(hex.slice(1), 16); return [v >> 16 & 255, v >> 8 & 255, v & 255]; }
function hex([r, g, b]) { return '#' + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join(''); }
function mix(a, b, t) { const A = rgb(a), B = rgb(b); return hex(A.map((x, i) => x + (B[i] - x) * t)); }
const dark = (c, t) => mix(c, '#000000', t);
const light = (c, t) => mix(c, '#ffffff', t);

const TIMES = {
  dawn: { top: '#26345f', bot: '#f0a27a', sun: '#ffd9a0', night: false },
  day: { top: '#3d78b8', bot: '#cfe3df', sun: '#fff6d8', night: false },
  dusk: { top: '#2a1c46', bot: '#e06e4e', sun: '#ffb070', night: false },
  night: { top: '#060b1e', bot: '#24395e', sun: '#e8eeff', night: true },
};
const FACTION = {
  sylvan: { tint: '#3f9a72', accent: '#b8f5d2', metal: '#d9e6e8', times: ['night', 'dawn', 'day', 'night'], particles: 'fireflies' },
  deephold: { tint: '#b07a3c', accent: '#ffcf7a', metal: '#c99a52', times: ['dusk', 'dawn', 'dusk', 'night'], particles: 'embers' },
  westmarch: { tint: '#4f7fc2', accent: '#ffe7a3', metal: '#dfe4ec', times: ['day', 'dawn', 'day', 'dusk'], particles: 'motes' },
  horde: { tint: '#b8402c', accent: '#ff8a4a', metal: '#7d746e', times: ['dusk', 'night', 'dusk', 'dusk'], particles: 'embers' },
  conclave: { tint: '#7a4fc2', accent: '#9ff0ff', metal: '#cdb8ff', times: ['night', 'night', 'dusk', 'night'], particles: 'stars' },
  hearth: { tint: '#c79a45', accent: '#ffe08a', metal: '#d8a85a', times: ['day', 'dusk', 'day', 'dawn'], particles: 'fireflies' },
  wilds: { tint: '#5d8796', accent: '#ffffff', metal: '#e6e9ee', times: ['night', 'dusk', 'dawn', 'night'], particles: 'motes' },
};
const SPELL = {
  fire: ['#ff7a2f', '#ffd27a'], frost: ['#6fd8ff', '#e8fbff'], light: ['#ffd76a', '#fffbe6'],
  shadow: ['#8a4dff', '#e0c8ff'], nature: ['#6ed27a', '#e2ffd8'], storm: ['#5aa6ff', '#e6f2ff'],
  rune: ['#ffb347', '#fff0c8'], earth: ['#c98a4a', '#ffe2b0'],
};

// ---------- shapes ----------
function smooth(pts, close = false) {
  // Catmull-Rom through the points as cubic beziers.
  let d = `M${n1(pts[0][0])},${n1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${n1(c1[0])},${n1(c1[1])} ${n1(c2[0])},${n1(c2[1])} ${n1(p2[0])},${n1(p2[1])}`;
  }
  return close ? d + 'Z' : d;
}
function ridge(rng, base, amp, step, jag) {
  const pts = [];
  let y = base + (rng() - 0.5) * amp;
  for (let x = -10; x <= W + 10; x += step) {
    y += (rng() - 0.5) * amp * jag;
    y = base + (y - base) * 0.75 + (rng() - 0.5) * amp * 0.5;
    pts.push([x, y]);
  }
  return pts;
}
const ridgePath = (pts, sharp) =>
  (sharp ? 'M' + pts.map(p => `${n1(p[0])},${n1(p[1])}`).join(' L') : smooth(pts)) + ` L${W + 10},${H + 2} L-10,${H + 2} Z`;

function pine(x, y, h, w, fill) {
  let d = '';
  for (let i = 0; i < 3; i++) {
    const ty = y - h * (0.35 + i * 0.3), by = y - h * (i * 0.25), ww = w * (1 - i * 0.22);
    d += `M${n1(x)},${n1(ty - h * 0.12)} L${n1(x + ww / 2)},${n1(by)} L${n1(x - ww / 2)},${n1(by)} Z `;
  }
  return `<path d="${d}" fill="${fill}"/>`;
}
function roundTree(x, y, h, r, fill) {
  return `<rect x="${n1(x - r * 0.12)}" y="${n1(y - h)}" width="${n1(r * 0.24)}" height="${n1(h)}" fill="${fill}"/>` +
    `<ellipse cx="${n1(x)}" cy="${n1(y - h)}" rx="${n1(r)}" ry="${n1(r * 1.25)}" fill="${fill}"/>`;
}
function glowGrad(id, color, op = 0.9) {
  return `<radialGradient id="${id}"><stop offset="0" stop-color="${color}" stop-opacity="${op}"/><stop offset=".35" stop-color="${color}" stop-opacity="${op * 0.35}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient>`;
}

// ---------- the scene ----------
export function cardArt(card) {
  const rng = mulberry(hashStr(card.id + card.name));
  const fac = FACTION[card.faction];
  const rank = RARITIES[card.rarity].rank;
  const [kind, a, b] = card.subject.split(':');
  const id = card.id.replace(/[^a-z0-9]/gi, '');
  const P = (s) => `${id}${s}`;

  let timeKey = fac.times[Math.floor(rng() * fac.times.length)];
  if (kind === 'spell') timeKey = rng() < 0.6 ? 'night' : timeKey;
  if (b === 'lantern' || a === 'lantern') timeKey = 'night';
  const t = TIMES[timeKey];
  const skyTop = mix(t.top, fac.tint, 0.18);
  const skyBot = mix(t.bot, fac.tint, 0.22);
  const haze = mix(skyBot, skyTop, 0.25);
  const landFar = mix(dark(mix(skyBot, fac.tint, 0.4), 0.35), skyBot, 0.35);
  const landMid = dark(mix(skyBot, fac.tint, 0.5), 0.62);
  const landNear = dark(mix(skyTop, fac.tint, 0.4), 0.8);
  const figure = dark(mix(skyTop, fac.tint, 0.35), 0.72);
  const sunX = 25 + rng() * 150;
  const sunY = 18 + rng() * 30;
  const litLeft = sunX < 100;
  const accent = kind === 'spell' ? SPELL[a][0] : fac.accent;

  const defs = [];
  const out = [];
  defs.push(`<linearGradient id="${P('sky')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${skyTop}"/><stop offset="1" stop-color="${skyBot}"/></linearGradient>`);
  defs.push(glowGrad(P('sun'), t.sun, 0.95));
  defs.push(glowGrad(P('acc'), accent, 1));
  defs.push(glowGrad(P('dot'), light(accent, 0.3), 1));
  defs.push(`<linearGradient id="${P('fig')}" x1="${litLeft ? 0 : 1}" y1="0" x2="${litLeft ? 1 : 0}" y2="0"><stop offset="0" stop-color="${light(mix(figure, t.sun, 0.25), 0.08)}"/><stop offset=".55" stop-color="${figure}"/><stop offset="1" stop-color="${dark(figure, 0.45)}"/></linearGradient>`);
  defs.push(`<linearGradient id="${P('metal')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${light(fac.metal, 0.55)}"/><stop offset=".45" stop-color="${fac.metal}"/><stop offset=".55" stop-color="${dark(fac.metal, 0.35)}"/><stop offset="1" stop-color="${light(fac.metal, 0.2)}"/></linearGradient>`);
  defs.push(`<radialGradient id="${P('vig')}" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`);
  defs.push(`<linearGradient id="${P('mist')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haze}" stop-opacity="0"/><stop offset=".5" stop-color="${haze}" stop-opacity=".5"/><stop offset="1" stop-color="${haze}" stop-opacity="0"/></linearGradient>`);

  // Sky
  out.push(`<rect width="${W}" height="${H}" fill="url(#${P('sky')})"/>`);
  if (t.night || kind === 'spell') {
    let st = '';
    for (let i = 0; i < 40 + rank * 15; i++) {
      st += `<circle cx="${n1(rng() * W)}" cy="${n1(rng() * H * 0.6)}" r="${n1(0.2 + rng() * 0.7)}" opacity="${n1(0.3 + rng() * 0.7)}"/>`;
    }
    out.push(`<g fill="#fff">${st}</g>`);
  }
  if (kind !== 'spell' && kind !== 'relic') {
    out.push(`<circle cx="${n1(sunX)}" cy="${n1(sunY)}" r="${t.night ? 34 : 48}" fill="url(#${P('sun')})"/>`);
    if (t.night) {
      out.push(`<circle cx="${n1(sunX)}" cy="${n1(sunY)}" r="7" fill="${t.sun}"/><circle cx="${n1(sunX + 3)}" cy="${n1(sunY - 2)}" r="6" fill="${mix(skyTop, skyBot, 0.25)}"/>`);
    } else {
      out.push(`<circle cx="${n1(sunX)}" cy="${n1(sunY)}" r="${timeKey === 'day' ? 7 : 9}" fill="${t.sun}" opacity=".95"/>`);
    }
    // Clouds
    if (!t.night || rng() < 0.4) {
      let cl = '';
      for (let i = 0; i < 2 + Math.floor(rng() * 3); i++) {
        const cx = rng() * W, cy = 10 + rng() * 50, w = 30 + rng() * 50;
        cl += `<ellipse cx="${n1(cx)}" cy="${n1(cy)}" rx="${n1(w)}" ry="${n1(2 + rng() * 3)}"/>`;
      }
      out.push(`<g fill="${light(skyBot, 0.25)}" opacity="${t.night ? 0.12 : 0.35}">${cl}</g>`);
    }
  }

  if (kind === 'relic' || kind === 'spell') {
    // Close-up: a dim backdrop, then the object or sigil
    out.push(`<rect width="${W}" height="${H}" fill="${dark(skyTop, 0.35)}" opacity=".55"/>`);
    out.push(`<circle cx="100" cy="72" r="${80 + rank * 8}" fill="url(#${P('acc')})" opacity="${0.45 + rank * 0.08}"/>`);
    out.push(rays(rng, accent, rank, 100, 72));
    if (kind === 'relic') {
      out.push(`<path d="${ridgePath(ridge(rng, 128, 10, 18, 0.6))}" fill="${landNear}" opacity=".9"/>`);
      out.push(pedestal(landMid, accent));
      out.push(relic(a, rng, P, accent, fac, rank));
    } else {
      out.push(spell(a, rng, P, rank));
    }
  } else {
    // Ridges
    const sharp = card.faction === 'deephold' || card.faction === 'horde';
    out.push(`<path d="${ridgePath(ridge(rng, 78 + rng() * 10, 22, sharp ? 9 : 16, sharp ? 1.6 : 0.8), sharp)}" fill="${landFar}"/>`);
    out.push(`<rect y="70" width="${W}" height="40" fill="url(#${P('mist')})"/>`);
    out.push(`<path d="${ridgePath(ridge(rng, 98 + rng() * 6, 16, sharp ? 11 : 20, sharp ? 1.3 : 0.7), sharp)}" fill="${mix(landFar, landMid, 0.55)}"/>`);
    out.push(environment(card.faction, rng, landMid, landNear, accent, kind === 'realm' ? 0.6 : 1));
    if (kind === 'realm') out.push(realm(a, rng, P, { landMid, landNear, accent, fac, skyBot, skyTop, rank, t }));
    else {
      out.push(`<path d="${ridgePath(ridge(rng, 128, 8, 25, 0.6))}" fill="${landNear}"/>`);
      if (kind === 'hero') out.push(hero(a, b, rng, P, { figure, accent, fac, rank, card }));
      if (kind === 'beast') out.push(beast(a, rng, P, { figure, accent, fac, rank, landNear, card }));
    }
  }

  out.push(particles(rng, kind === 'spell' ? 'stars' : fac.particles, P, rank));
  out.push(`<rect width="${W}" height="${H}" fill="url(#${P('vig')})"/>`);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>${defs.join('')}</defs>${out.join('')}</svg>`;
}

function rays(rng, color, rank, cx, cy) {
  const n = 8 + rank * 4;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 + rng() * 0.2, w = 0.04 + rng() * 0.06, r = 140;
    d += `M${cx},${cy} L${n1(cx + Math.cos(a0 - w) * r)},${n1(cy + Math.sin(a0 - w) * r)} L${n1(cx + Math.cos(a0 + w) * r)},${n1(cy + Math.sin(a0 + w) * r)} Z`;
  }
  return `<path d="${d}" fill="${color}" opacity="${0.06 + rank * 0.025}"/>`;
}

function particles(rng, type, P, rank) {
  const n = 8 + rank * 7;
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = rng() * W, y = type === 'embers' ? 40 + rng() * 110 : rng() * H;
    const r = type === 'stars' ? 0.6 + rng() * 1.6 : 0.8 + rng() * 2.2;
    s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r * 2.2)}" fill="url(#${P('dot')})" opacity="${n1(0.4 + rng() * 0.6)}"/>`;
  }
  return `<g>${s}</g>`;
}

// ---------- landscapes ----------
function environment(faction, rng, mid, near, accent, k) {
  let s = '';
  const y0 = 112 + rng() * 6;
  if (faction === 'sylvan' || faction === 'wilds') {
    for (let i = 0; i < 14 * k; i++) {
      const x = rng() * W, h = 30 + rng() * 45;
      s += rng() < 0.55 ? pine(x, y0 + rng() * 8, h, 12 + rng() * 8, mid) : roundTree(x, y0 + rng() * 8, h * 0.8, 7 + rng() * 6, mid);
    }
  } else if (faction === 'deephold') {
    for (let i = 0; i < 3; i++) {
      const x = 20 + rng() * 160, h = 40 + rng() * 40, w = 30 + rng() * 30;
      s += `<path d="M${n1(x - w)},${y0 + 10} L${n1(x - w * 0.2)},${n1(y0 - h)} L${n1(x + w * 0.1)},${n1(y0 - h + 6)} L${n1(x + w)},${y0 + 10} Z" fill="${mid}"/>`;
      if (rng() < 0.6) s += `<rect x="${n1(x - 3)}" y="${n1(y0 - h * 0.35)}" width="6" height="8" rx="3" fill="${accent}" opacity=".85"/>`;
    }
  } else if (faction === 'westmarch') {
    const cx = 20 + rng() * 160;
    s += `<path d="M${n1(cx - 40)},${y0} L${n1(cx - 40)},${y0 - 14} L${n1(cx + 40)},${y0 - 14} L${n1(cx + 40)},${y0} Z" fill="${mid}"/>`;
    for (let i = 0; i < 4; i++) {
      const x = cx - 40 + i * 26.6, h = 22 + rng() * 18;
      s += `<rect x="${n1(x - 4)}" y="${n1(y0 - h)}" width="8" height="${n1(h)}" fill="${mid}"/><path d="M${n1(x - 6)},${n1(y0 - h)} L${n1(x)},${n1(y0 - h - 9)} L${n1(x + 6)},${n1(y0 - h)} Z" fill="${mid}"/>`;
      if (rng() < 0.5) s += `<rect x="${n1(x - 1)}" y="${n1(y0 - h + 5)}" width="2" height="3" fill="${accent}" opacity=".8"/>`;
    }
    for (let i = 0; i < 6 * k; i++) s += roundTree(rng() * W, y0 + 6, 10 + rng() * 10, 5 + rng() * 4, mid);
  } else if (faction === 'horde') {
    for (let i = 0; i < 9; i++) {
      const x = rng() * W, h = 14 + rng() * 34, w = 4 + rng() * 8;
      s += `<path d="M${n1(x - w)},${y0 + 10} L${n1(x + (rng() - 0.5) * 8)},${n1(y0 - h)} L${n1(x + w)},${y0 + 10} Z" fill="${mid}"/>`;
    }
    for (let i = 0; i < 2; i++) {
      const x = rng() * W;
      s += `<path d="M${n1(x)},${y0} C${n1(x - 10)},${y0 - 30} ${n1(x + 15)},${y0 - 50} ${n1(x + 5)},${y0 - 90}" stroke="${mid}" stroke-width="${n1(8 + rng() * 6)}" fill="none" opacity=".35" stroke-linecap="round"/>`;
    }
  } else if (faction === 'conclave') {
    for (let i = 0; i < 4; i++) {
      const x = rng() * W, y = 40 + rng() * 50, w = 8 + rng() * 14;
      s += `<path d="M${n1(x - w)},${n1(y)} L${n1(x + w)},${n1(y)} L${n1(x + w * 0.3)},${n1(y + w * 1.2)} L${n1(x - w * 0.4)},${n1(y + w)} Z" fill="${mid}"/>`;
      s += `<path d="M${n1(x - 2)},${n1(y)} L${n1(x)},${n1(y - w)} L${n1(x + 2)},${n1(y)} Z" fill="${accent}" opacity=".8"/>`;
    }
    const sx = 20 + rng() * 160;
    s += `<path d="M${n1(sx - 6)},${y0} L${n1(sx - 3)},${y0 - 60} L${n1(sx)},${y0 - 72} L${n1(sx + 3)},${y0 - 60} L${n1(sx + 6)},${y0} Z" fill="${mid}"/><circle cx="${n1(sx)}" cy="${y0 - 62}" r="2" fill="${accent}"/>`;
  } else if (faction === 'hearth') {
    for (let i = 0; i < 4; i++) {
      const x = rng() * W, r = 30 + rng() * 30;
      s += `<ellipse cx="${n1(x)}" cy="${y0 + 8}" rx="${n1(r)}" ry="${n1(r * 0.45)}" fill="${mid}"/>`;
      if (rng() < 0.7) s += `<circle cx="${n1(x + (rng() - 0.5) * r * 0.6)}" cy="${n1(y0 - r * 0.1)}" r="3.4" fill="${accent}" opacity=".85"/>`;
    }
    for (let i = 0; i < 5 * k; i++) s += roundTree(rng() * W, y0 - 2, 8 + rng() * 10, 5 + rng() * 5, mid);
  }
  return s;
}

// ---------- heroes ----------
const RACE = {
  elf: { hy: 76, rx: 12.5, ry: 17, sw: 50, sy: 112 },
  dwarf: { hy: 88, rx: 15, ry: 15, sw: 64, sy: 116 },
  human: { hy: 78, rx: 13.5, ry: 16.5, sw: 56, sy: 112 },
  orc: { hy: 80, rx: 17, ry: 17, sw: 70, sy: 112 },
  goblin: { hy: 92, rx: 13, ry: 12, sw: 44, sy: 122 },
  mage: { hy: 78, rx: 13.5, ry: 16.5, sw: 54, sy: 112 },
  halfling: { hy: 92, rx: 14, ry: 14, sw: 46, sy: 124 },
};

function hero(race, gear, rng, P, o) {
  const r = RACE[race];
  const { hy, rx, ry, sw, sy } = r;
  const fig = `url(#${P('fig')})`;
  const rim = `stroke="${o.accent}" stroke-opacity=".45" stroke-width=".8"`;
  const cloth = dark(o.fac.tint, 0.45);
  const flip = rng() < 0.5;
  const back = [], body = [], front = [];
  const SKIN = {
    elf: ['#eadbc6', '#d9c1a4', '#c9b8d8'], human: ['#e3bb96', '#c58c62', '#8d5a3b', '#f0cfb0'], halfling: ['#e8b98e', '#b9784e', '#f1caa4'],
    dwarf: ['#dca47e', '#b97a56'], orc: ['#6f8a4a', '#7d7458', '#5a7a52'], goblin: ['#86a64a', '#9a9a44'], mage: ['#d9b49a'],
  }[race];
  const skin = SKIN[Math.floor(rng() * SKIN.length)];
  const lite = o.card.subject.includes('lantern') ? o.accent : '#fff3dc';
  const skinG = `url(#${P('skin')})`;
  const defs = `<defs><linearGradient id="${P('skin')}" x1="${flip ? 1 : 0}" y1="0" x2="${flip ? 0 : 1}" y2="0"><stop offset="0" stop-color="${mix(skin, lite, 0.15)}"/><stop offset=".6" stop-color="${mix(skin, o.figure, 0.35)}"/><stop offset="1" stop-color="${mix(skin, o.figure, 0.7)}"/></linearGradient></defs>`;
  const clothes = [o.fac.tint, o.fac.metal, mix(o.fac.tint, '#7a2020', 0.5), mix(o.fac.tint, '#20304a', 0.6), '#5a4a3a'];
  const tunic = dark(clothes[Math.floor(rng() * clothes.length)], 0.35);
  const armored = ['sword', 'spear', 'shield', 'hammer', 'axe'].includes(gear) && race !== 'halfling' && race !== 'goblin';
  const dx = n1((rng() - 0.5) * 36), sc = n1(0.92 + rng() * 0.14);

  // Cape for rare and up
  if (o.rank >= 2) {
    back.push(`<path d="M${100 - sw * 0.7},${sy - 8} C${100 - sw * 1.3},${sy + 10} ${100 - sw * 1.5},${H} ${100 - sw * 1.6},${H} L${100 + sw * 1.6},${H} C${100 + sw * 1.5},${H} ${100 + sw * 1.3},${sy + 10} ${100 + sw * 0.7},${sy - 8} Z" fill="${cloth}" ${rim}/>`);
  }
  // Gear behind the body
  const g = gearArt(gear, rng, P, o, r);
  back.push(g.back);

  const elfHair = dark(['#efe6c4', '#d9b26a', '#b8b8c8', '#2a2018', '#8a4a2a'][Math.floor(rng() * 5)], 0.3);
  // Hair behind (elves)
  if (race === 'elf') {
    back.push(`<path d="M${100 - rx - 1},${hy - 6} Q${100 - rx - 9},${hy + 26} ${100 - rx - 16},${sy + 10} L${100 + rx + 16},${sy + 10} Q${100 + rx + 9},${hy + 26} ${100 + rx + 1},${hy - 6} Z" fill="${elfHair}"/>`);
  }

  // Body: shoulders and neck
  const nw = race === 'dwarf' || race === 'orc' ? 9 : 6;
  body.push(`<rect x="${100 - nw}" y="${hy + ry * 0.5}" width="${nw * 2}" height="${sy - hy - ry * 0.5}" fill="${fig}"/>`);
  body.push(`<path d="M${100 - sw},${H + 2} C${100 - sw},${sy - 4} ${100 - sw * 0.75},${sy - 12} ${100 - nw - 4},${sy - 14} L${100 + nw + 4},${sy - 14} C${100 + sw * 0.75},${sy - 12} ${100 + sw},${sy - 4} ${100 + sw},${H + 2} Z" fill="${fig}" ${rim}/>`);
  // Armour/cloth detail: a collar line and a chest emblem
  body.push(`<path d="M${100 - sw * 0.88},${H + 2} C${100 - sw * 0.82},${sy} ${100 - sw * 0.5},${sy - 10} ${100 - nw - 2},${sy - 13} L100,${sy + 14} L${100 + nw + 2},${sy - 13} C${100 + sw * 0.5},${sy - 10} ${100 + sw * 0.82},${sy} ${100 + sw * 0.88},${H + 2} Z" fill="${tunic}" opacity=".7"/>`);
  body.push(`<path d="M${100 - nw - 2},${sy - 13} L100,${sy + 14} L${100 + nw + 2},${sy - 13}" fill="none" stroke="${o.accent}" stroke-opacity=".45" stroke-width="1"/>`);
  if (armored) body.push(`<path d="M${100 - sw},${sy + 10} C${100 - sw},${sy - 8} ${100 - sw * 0.6},${sy - 14} ${100 - sw * 0.35},${sy - 12} C${100 - sw * 0.4},${sy} ${100 - sw * 0.6},${sy + 8} ${100 - sw},${sy + 10} Z M${100 + sw},${sy + 10} C${100 + sw},${sy - 8} ${100 + sw * 0.6},${sy - 14} ${100 + sw * 0.35},${sy - 12} C${100 + sw * 0.4},${sy} ${100 + sw * 0.6},${sy + 8} ${100 + sw},${sy + 10} Z" fill="url(#${P('metal')})" opacity=".75"/>`);
  if (o.rank >= 1) body.push(`<circle cx="100" cy="${sy + 12}" r="${2 + o.rank}" fill="${o.accent}" opacity=".75"/><circle cx="100" cy="${sy + 12}" r="${8 + o.rank * 3}" fill="url(#${P('acc')})" opacity=".5"/>`);

  // Head
  const head = [];
  if (race === 'elf') {
    head.push(`<path d="M${100 - rx + 2},${hy - 1} L${100 - rx - 11},${hy - 13} L${100 - rx + 1},${hy + 6} Z M${100 + rx - 2},${hy - 1} L${100 + rx + 11},${hy - 13} L${100 + rx - 1},${hy + 6} Z" fill="${skinG}" ${rim}/>`);
  }
  if (race === 'orc') {
    head.push(`<path d="M${100 - rx + 2},${hy - 2} L${100 - rx - 8},${hy - 6} L${100 - rx + 2},${hy + 5} Z M${100 + rx - 2},${hy - 2} L${100 + rx + 8},${hy - 6} L${100 + rx - 2},${hy + 5} Z" fill="${skinG}"/>`);
  }
  if (race === 'goblin') {
    head.push(`<path d="M${100 - rx + 2},${hy - 2} L${100 - rx - 24},${hy - 12} L${100 - rx + 1},${hy + 5} Z M${100 + rx - 2},${hy - 2} L${100 + rx + 24},${hy - 12} L${100 + rx - 1},${hy + 5} Z" fill="${skinG}" ${rim}/>`);
  }
  // Jawed head shape
  const jaw = race === 'orc' ? 1.15 : race === 'elf' ? 0.82 : 0.95;
  head.push(`<path d="M${100 - rx},${hy - 2} C${100 - rx},${hy - ry * 1.25} ${100 + rx},${hy - ry * 1.25} ${100 + rx},${hy - 2} C${100 + rx},${hy + ry * 0.55} ${100 + rx * jaw * 0.5},${hy + ry} 100,${hy + ry} C${100 - rx * jaw * 0.5},${hy + ry} ${100 - rx},${hy + ry * 0.55} ${100 - rx},${hy - 2} Z" fill="${race === 'mage' ? fig : skinG}" ${rim}/>`);
  const faceEyes = `<circle cx="${100 - rx * 0.4}" cy="${hy + 1}" r="1.1" fill="#1a120c"/><circle cx="${100 + rx * 0.4}" cy="${hy + 1}" r="1.1" fill="#1a120c"/><path d="M${100 - rx * 0.62},${hy - 2.6} l${n1(rx * 0.4)},-.6 M${100 + rx * 0.62},${hy - 2.6} l-${n1(rx * 0.4)},-.6" stroke="#1a120c" stroke-opacity=".6" stroke-width=".7"/><path d="M${100 - 2.6},${hy + ry * 0.62} q2.6,1.2 5.2,0" stroke="#3a1a14" stroke-opacity=".5" stroke-width=".7" fill="none"/>`;
  const eyes = (c, rr = 1.3, dy = 0) => `<circle cx="${100 - rx * 0.4}" cy="${hy + dy}" r="${rr}" fill="${c}"/><circle cx="${100 + rx * 0.4}" cy="${hy + dy}" r="${rr}" fill="${c}"/>`;

  if (race === 'elf') {
    head.push(faceEyes);
    head.push(`<path d="M${100 - rx - 1.5},${hy + 12} Q${100 - rx - 3},${hy - ry * 1.35} 100,${hy - ry * 1.18} Q${100 + rx + 3},${hy - ry * 1.35} ${100 + rx + 1.5},${hy + 12} L${100 + rx - 1.5},${hy - 3} Q${100 + 4},${hy - ry * 0.8} 100,${hy - ry * 0.95} Q${100 - 4},${hy - ry * 0.8} ${100 - rx + 1.5},${hy - 3} Z" fill="${elfHair}"/>`);
  }
  if (race === 'elf' && o.rank >= 1) {
    head.push(`<path d="M${100 - rx},${hy - 7} Q100,${hy - 12} ${100 + rx},${hy - 7}" stroke="url(#${P('metal')})" stroke-width="1.6" fill="none"/><circle cx="100" cy="${hy - 10}" r="1.8" fill="${o.accent}"/>`);
    if (o.rank >= 3) head.push(crown(100, hy - 12, rx * 1.1, P));
  }
  if (race === 'dwarf') {
    const beard = ['#7a4a26', '#a8452a', '#9a9aa0', '#e8e4da', '#3a2a1e'][Math.floor(rng() * 5)];
    head.push(`<path d="M${100 - rx - 1},${hy} Q${100 - rx - 6},${hy + 26} 100,${sy + 18} Q${100 + rx + 6},${hy + 26} ${100 + rx + 1},${hy} Q100,${hy + 9} ${100 - rx - 1},${hy} Z" fill="${dark(beard, 0.35)}" stroke="${light(beard, 0.2)}" stroke-opacity=".5" stroke-width=".8"/>`);
    head.push(`<path d="M${100 - 4},${hy + 12} L100,${sy + 14} M${100 + 4},${hy + 12} L${100 + 1},${sy + 12}" stroke="${light(beard, 0.15)}" stroke-opacity=".35" stroke-width="1"/>`);
    if (o.rank >= 3) head.push(crown(100, hy - 10, rx * 1.15, P));
    else {
      head.push(`<path d="M${100 - rx - 2},${hy - 3} Q100,${hy - ry * 1.9} ${100 + rx + 2},${hy - 3} Z" fill="url(#${P('metal')})" opacity=".9"/>`);
      if (rng() < 0.6) head.push(`<path d="M${100 - rx},${hy - 7} Q${100 - rx - 14},${hy - 10} ${100 - rx - 12},${hy - 26} Q${100 - rx - 5},${hy - 13} ${100 - rx + 4},${hy - 11} Z M${100 + rx},${hy - 7} Q${100 + rx + 14},${hy - 10} ${100 + rx + 12},${hy - 26} Q${100 + rx + 5},${hy - 13} ${100 + rx - 4},${hy - 11} Z" fill="#e9dcc0"/>`);
    }
    head.push(`<circle cx="${100 - rx * 0.4}" cy="${hy + 1}" r="1.1" fill="#1a120c"/><circle cx="${100 + rx * 0.4}" cy="${hy + 1}" r="1.1" fill="#1a120c"/><path d="M${100 - rx * 0.7},${hy - 3} L${100 - 2},${hy - 1.5} M${100 + rx * 0.7},${hy - 3} L${100 + 2},${hy - 1.5}" stroke="${dark(skin, 0.5)}" stroke-width="1.6"/>`);
  }
  if (race === 'human') {
    if (gear === 'sword' || gear === 'spear' || gear === 'shield') {
      if (o.rank >= 3) {
        head.push(`<path d="M${100 - rx - 1},${hy - 4} C${100 - rx - 2},${hy - ry * 1.4} ${100 + rx + 2},${hy - ry * 1.4} ${100 + rx + 1},${hy - 4} L${100 + rx + 2},${hy + 14} L${100 + 4},${hy + 4} L${100 - 4},${hy + 4} L${100 - rx - 2},${hy + 14} Z" fill="${dark(o.fac.metal, 0.5)}"/>`);
        head.push(crown(100, hy - 12, rx * 1.05, P));
      } else {
        head.push(`<path d="M${100 - rx - 2},${hy + ry * 0.7} L${100 - rx - 2},${hy - 4} C${100 - rx - 2},${hy - ry * 1.45} ${100 + rx + 2},${hy - ry * 1.45} ${100 + rx + 2},${hy - 4} L${100 + rx + 2},${hy + ry * 0.7} Z" fill="url(#${P('metal')})" opacity=".85"/>`);
        head.push(`<rect x="${100 - rx + 1}" y="${hy - 2}" width="${rx * 2 - 2}" height="2.2" fill="#000" opacity=".85"/><rect x="${100 - rx + 3}" y="${hy - 1.6}" width="${rx * 2 - 6}" height="1" fill="${o.accent}" opacity=".7"/>`);
        if (o.rank >= 1) head.push(`<path d="M100,${hy - ry * 1.1} C${100 + 6},${hy - ry * 1.9} ${100 + 22},${hy - ry * 1.6} ${100 + 28},${hy - ry * 0.4} C${100 + 18},${hy - ry * 1.1} ${100 + 8},${hy - ry * 1.2} 100,${hy - ry * 1.1} Z" fill="${o.fac.tint}"/>`);
      }
    } else if (gear === 'lantern') {
      head.push(faceEyes);
      head.push(`<path d="M${100 - rx - 1},${hy + 10} Q${100 - rx - 3},${hy - 8} 100,${hy - 9} Q${100 + rx + 3},${hy - 8} ${100 + rx + 1},${hy + 10} L${100 + rx - 2},${hy - 2} Q100,${hy - 6} ${100 - rx + 2},${hy - 2} Z" fill="${dark('#5a3a2a', 0.3)}"/>`);
      head.push(`<path d="M${100 - rx - 14},${hy - 5} L${100 + rx + 14},${hy - 5} L${100 + rx},${hy - 9} L${100 + 6},${hy - ry * 2.6} L${100 - rx},${hy - 9} Z" fill="${fig}" ${rim}/>`);
    } else {
      head.push(faceEyes);
      head.push(`<path d="M${100 - rx - 5},${hy + ry} Q${100 - rx - 6},${hy - ry * 1.5} 100,${hy - ry * 1.55} Q${100 + rx + 6},${hy - ry * 1.5} ${100 + rx + 5},${hy + ry} L${100 + rx - 2},${hy + ry * 0.4} Q100,${hy - ry * 0.9} ${100 - rx + 2},${hy + ry * 0.4} Z" fill="${tunic}" ${rim}/>`);
    }
  }
  if (race === 'orc') {
    head.push(`<path d="M${100 - rx + 1},${hy - 4} L${100 + rx - 1},${hy - 4} L${100 + rx - 3},${hy - 1} L${100 - rx + 3},${hy - 1} Z" fill="#000" opacity=".5"/>`);
    head.push(eyes('#ff4a2a', 1.5, 1));
    head.push(`<path d="M${100 - 7},${hy + ry - 4} L${100 - 6},${hy + ry - 12} L${100 - 4},${hy + ry - 4} Z M${100 + 7},${hy + ry - 4} L${100 + 6},${hy + ry - 12} L${100 + 4},${hy + ry - 4} Z" fill="#efe6cf"/>`);
    head.push(`<path d="M${100 - 3},${hy - ry * 1.05} Q${100 + 2},${hy - ry * 1.9} ${100 + 12},${hy - ry * 2.1} Q${100 + 4},${hy - ry * 1.4} ${100 + 3},${hy - ry * 1.02} Z" fill="${fig}"/>`);
    if (o.rank >= 3) head.push(crown(100, hy - 13, rx * 1.05, P, true));
    body.push(`<path d="M${100 - sw * 0.9},${sy - 2} L${100 - sw * 0.85},${sy - 22} L${100 - sw * 0.6},${sy - 8} L${100 - sw * 0.5},${sy - 24} L${100 - sw * 0.35},${sy - 10} Z M${100 + sw * 0.9},${sy - 2} L${100 + sw * 0.85},${sy - 22} L${100 + sw * 0.6},${sy - 8} L${100 + sw * 0.5},${sy - 24} L${100 + sw * 0.35},${sy - 10} Z" fill="url(#${P('metal')})" opacity=".8"/>`);
  }
  if (race === 'goblin') {
    head.push(eyes('#ffd84a', 2, 0));
    head.push(`<path d="M${100 - 5},${hy + ry - 4} L${100 - 3},${hy + ry - 1} L${100 - 1},${hy + ry - 4} L${100 + 1},${hy + ry - 1} L${100 + 3},${hy + ry - 4} L${100 + 5},${hy + ry - 1}" stroke="#efe6cf" stroke-width=".8" fill="none"/>`);
  }
  if (race === 'mage') {
    const hood = rng() < 0.5;
    const tip = 100 + (rng() - 0.5) * 20;
    head.push(`<path d="M${100 - rx - 6},${hy + ry + 4} Q${100 - rx - 9},${hy - 8} ${n1(tip)},${hy - ry * (hood ? 2.2 : 3.2)} Q${100 + rx + 9},${hy - 8} ${100 + rx + 6},${hy + ry + 4} Z" fill="${dark(o.fac.tint, 0.5)}" ${rim}/>`);
    head.push(`<ellipse cx="100" cy="${hy + 3}" rx="${rx - 2}" ry="${ry - 3}" fill="#05030a"/>`);
    head.push(eyes(o.accent, 1.3, 1));
    if (rng() < 0.5 || o.rank >= 2) head.push(`<path d="M${100 - rx + 3},${hy + 7} Q${100 - 4},${sy + 16} 100,${sy + 26} Q${100 + 4},${sy + 16} ${100 + rx - 3},${hy + 7} Q100,${hy + 11} ${100 - rx + 3},${hy + 7} Z" fill="#d9d4cc" opacity=".8"/>`);
    if (!hood) head.push(`<path d="M${100 - rx - 16},${hy - 4} Q100,${hy - 12} ${100 + rx + 16},${hy - 4} Q100,${hy - 6} ${100 - rx - 16},${hy - 4} Z" fill="${dark(o.fac.tint, 0.5)}" ${rim}/>`);
    if (o.rank >= 2) head.push(`<circle cx="${n1(tip)}" cy="${hy - ry * (hood ? 2.2 : 3.2)}" r="2" fill="${o.accent}"/>`);
  }
  if (race === 'halfling') {
    const hc = ['#6a3a1c', '#a8652a', '#3a2414', '#c9934a'][Math.floor(rng() * 4)];
    let curls = '';
    for (let i = 0; i < 8; i++) {
      const ang = Math.PI * (1.05 + i * 0.12);
      curls += `<circle cx="${n1(100 + Math.cos(ang) * rx)}" cy="${n1(hy - 2 + Math.sin(ang) * ry)}" r="${n1(4 + rng() * 2)}"/>`;
    }
    head.push(`<g fill="${dark(hc, 0.4)}">${curls}</g>`);
    head.push(`<circle cx="${100 - rx + 1}" cy="${hy + 2}" r="3.2" fill="${skinG}"/><circle cx="${100 + rx - 1}" cy="${hy + 2}" r="3.2" fill="${skinG}"/>`);
    body.push(`<path d="M${100 - 13},${sy - 12} Q100,${sy - 2} ${100 + 13},${sy - 12} L${100 + 15},${sy - 6} Q100,${sy + 4} ${100 - 15},${sy - 6} Z" fill="${o.fac.tint}" opacity=".9"/>`);
    head.push(faceEyes);
    if (o.rank >= 3) head.push(crown(100, hy - 12, rx, P));
  }

  const flipT = flip ? ` transform="translate(${W},0) scale(-1,1)"` : '';
  return `${defs}<g transform="translate(${dx} 0) translate(100 150) scale(${sc}) translate(-100 -150)"><g${flipT}>${back.join('')}</g>${body.join('')}${head.join('')}<g${flipT}>${g.front}</g></g>`;
}

function crown(cx, y, w, P, spiky = false) {
  const pts = 5;
  let d = `M${cx - w},${y + 4}`;
  for (let i = 0; i <= pts * 2; i++) {
    const x = cx - w + (i / (pts * 2)) * w * 2;
    d += ` L${n1(x)},${n1(i % 2 ? y - (spiky ? 7 : 3) : y - (spiky ? 0 : 8))}`;
  }
  d += ` L${cx + w},${y + 4} Z`;
  return `<path d="${d}" fill="url(#${P('metal')})" stroke="#000" stroke-opacity=".3" stroke-width=".5"/><circle cx="${cx}" cy="${y}" r="1.6" fill="#ff5a6a"/>`;
}

function gearArt(gear, rng, P, o, r) {
  const metal = `url(#${P('metal')})`;
  const wood = dark(o.fac.tint, 0.7);
  const glow = o.rank >= 2;
  const gx = 100 + r.sw * 0.8;
  let back = '', front = '';
  switch (gear) {
    case 'bow':
      back = `<path d="M${gx - 4},28 Q${gx + 26},86 ${gx - 4},146" fill="none" stroke="${wood}" stroke-width="3.2" stroke-linecap="round"/><path d="M${gx - 4},28 Q${gx + 26},86 ${gx - 4},146" fill="none" stroke="${o.accent}" stroke-opacity=".5" stroke-width=".7"/><path d="M${gx - 4},28 L${gx - 4},146" stroke="#e8e2d0" stroke-opacity=".6" stroke-width=".5"/>`;
      break;
    case 'sword':
      back = `<path d="M${gx},22 L${gx + 3.2},30 L${gx + 3.2},112 L${gx - 3.2},112 L${gx - 3.2},30 Z" fill="${metal}"/>` +
        (glow ? `<path d="M${gx},26 L${gx},110" stroke="${o.accent}" stroke-width="1"/><ellipse cx="${gx}" cy="70" rx="12" ry="50" fill="url(#${P('acc')})" opacity=".5"/>` : '') +
        `<rect x="${gx - 11}" y="112" width="22" height="3.5" rx="1.5" fill="${metal}"/><rect x="${gx - 2}" y="115" width="4" height="16" fill="${wood}"/><circle cx="${gx}" cy="133" r="3" fill="${metal}"/>`;
      break;
    case 'spear':
      back = `<rect x="${gx - 1.4}" y="26" width="2.8" height="130" fill="${wood}"/><path d="M${gx},6 L${gx + 5},26 L${gx},34 L${gx - 5},26 Z" fill="${metal}"/>` +
        (glow ? `<circle cx="${gx}" cy="22" r="14" fill="url(#${P('acc')})"/>` : '') +
        `<path d="M${gx - 1},34 Q${gx + 8},42 ${gx + 3},52" stroke="${o.fac.tint}" stroke-width="2" fill="none"/>`;
      break;
    case 'staff': {
      back = `<path d="M${gx},34 Q${gx + 3},90 ${gx - 1},152" stroke="${wood}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${gx},34 Q${gx - 10},26 ${gx - 4},16 Q${gx + 6},14 ${gx + 6},26" stroke="${wood}" stroke-width="2.6" fill="none"/>` +
        `<circle cx="${gx + 1}" cy="26" r="${18 + o.rank * 4}" fill="url(#${P('acc')})"/><circle cx="${gx + 1}" cy="26" r="3.6" fill="${light(o.accent, 0.5)}"/>`;
      break;
    }
    case 'axe':
      back = `<rect x="${gx - 1.6}" y="30" width="3.2" height="124" fill="${wood}"/><path d="M${gx},32 L${gx + 8},34 C${gx + 16},28 ${gx + 22},22 ${gx + 24},18 C${gx + 30},30 ${gx + 30},46 ${gx + 24},58 C${gx + 20},52 ${gx + 14},48 ${gx + 8},48 L${gx},50 Z M${gx},36 L${gx - 6},34 L${gx - 10},38 L${gx - 6},46 L${gx},46 Z" fill="${metal}"/>` +
        (glow ? `<path d="M${gx + 24},18 C${gx + 30},30 ${gx + 30},46 ${gx + 24},58" stroke="${o.accent}" stroke-width="1.4" fill="none"/>` : '');
      break;
    case 'hammer':
      back = `<rect x="${gx - 1.8}" y="40" width="3.6" height="116" fill="${wood}"/><rect x="${gx - 14}" y="28" width="28" height="16" rx="2" fill="${metal}"/><rect x="${gx - 14}" y="34" width="28" height="2" fill="#000" opacity=".3"/>` +
        (glow ? `<path d="M${gx - 6},36 h12" stroke="${o.accent}" stroke-width="1.6"/><circle cx="${gx}" cy="36" r="16" fill="url(#${P('acc')})" opacity=".6"/>` : '');
      break;
    case 'dagger':
      front = `<g transform="rotate(-28 66 134)"><path d="M66,104 L69,110 L69,128 L63,128 L63,110 Z" fill="${metal}"/><rect x="58" y="128" width="16" height="3" fill="${metal}"/><rect x="64.5" y="131" width="3" height="10" fill="${wood}"/></g>`;
      break;
    case 'shield':
      front = `<path d="M54,112 L86,112 L86,130 Q86,146 70,152 Q54,146 54,130 Z" fill="${dark(o.fac.tint, 0.25)}" stroke="${metal}" stroke-width="2.2"/><path d="M70,118 L76,128 L70,142 L64,128 Z" fill="${o.accent}" opacity=".8"/>`;
      break;
    case 'lantern':
      front = `<circle cx="140" cy="132" r="${24 + o.rank * 4}" fill="url(#${P('acc')})"/><path d="M140,108 L140,118" stroke="${metal}" stroke-width="1.2"/><path d="M133,118 L147,118 L145,140 L135,140 Z" fill="${light(o.accent, 0.4)}" opacity=".9" stroke="${dark(o.fac.metal, 0.4)}" stroke-width="1.6"/><rect x="132" y="139" width="16" height="3" fill="${dark(o.fac.metal, 0.4)}"/><path d="M140,113 a4,4 0 0 1 0,6" stroke="${metal}" fill="none"/>`;
      break;
    case 'pipe':
      front = `<path d="M${100 + r.rx * 0.3},${r.hy + r.ry * 0.7} L${100 + r.rx + 8},${r.hy + r.ry * 0.9}" stroke="${wood}" stroke-width="1.6"/><rect x="${100 + r.rx + 6}" y="${r.hy + r.ry * 0.9 - 4}" width="4" height="5" fill="${wood}"/>` +
        `<path d="M${100 + r.rx + 8},${r.hy + r.ry * 0.5} C${100 + r.rx + 2},${r.hy - 4} ${100 + r.rx + 18},${r.hy - 12} ${100 + r.rx + 10},${r.hy - 26} C${100 + r.rx + 4},${r.hy - 36} ${100 + r.rx + 20},${r.hy - 42} ${100 + r.rx + 16},${r.hy - 54}" stroke="#f0ece4" stroke-opacity=".4" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      break;
    case 'tome':
      front = `<ellipse cx="100" cy="134" rx="40" ry="18" fill="url(#${P('acc')})"/><path d="M78,140 L100,136 L122,140 L122,126 L100,122 L78,126 Z" fill="${light(o.accent, 0.6)}" stroke="${dark(o.fac.tint, 0.5)}" stroke-width="1.8"/><path d="M100,122 L100,136" stroke="${dark(o.fac.tint, 0.4)}" stroke-width="1"/>`;
      break;
    default:
      break;
  }
  return { back, front };
}

// ---------- beasts ----------
// Silhouettes drawn in the 200 x 150 frame, standing on the ground line near y = 140.
const BEASTS = {
  wolf: 'M150,141 C162,132 160,118 150,114 C146,100 138,90 128,84 C120,70 114,58 110,48 L114,32 L104,41 L100,29 L95,42 C88,40 80,34 70,26 L67,31 C74,40 82,48 86,56 C88,66 90,78 90,90 C88,104 86,118 90,132 L84,141 L100,141 L100,128 C104,124 110,126 112,132 L110,141 Z',
  stag: 'M62,141 L66,104 C60,96 60,86 70,82 L118,80 C124,72 126,62 128,56 C126,52 128,46 132,46 L140,48 C146,52 146,56 142,58 L136,60 C134,70 132,80 130,88 C134,96 134,106 130,112 L134,141 L127,141 L124,114 L104,112 L100,141 L93,141 L94,112 L78,110 L72,141 Z M130,46 C126,34 118,30 112,18 C118,26 124,28 126,26 C122,18 124,10 120,4 C128,12 128,22 130,28 C132,18 138,14 136,6 C142,16 136,26 136,36 C142,30 148,30 152,22 C150,32 142,38 136,46 Z',
  owl: 'M100,30 C82,30 72,44 72,62 C72,84 76,104 84,120 L80,134 L92,128 L100,134 L108,128 L120,134 L116,120 C124,104 128,84 128,62 C128,44 118,30 100,30 Z M76,36 L84,24 L90,34 Z M124,36 L116,24 L110,34 Z M60,141 L140,141 L140,134 L60,134 Z',
  eagle: 'M100,46 C94,46 92,52 94,58 C80,56 64,44 40,30 C36,40 44,48 30,48 C40,58 34,62 26,64 C44,72 70,76 92,80 C90,92 90,104 96,118 L92,132 L100,126 L108,132 L104,118 C110,104 110,92 108,80 C130,76 156,72 174,64 C166,62 160,58 170,48 C156,48 164,40 160,30 C136,44 120,56 106,58 C108,52 106,46 100,46 Z M100,48 L104,54 L100,58 Z',
  horse: 'M56,141 L60,108 C50,104 46,94 52,84 C60,78 80,78 96,80 L116,80 C120,66 124,56 128,46 L126,38 L132,42 L136,36 L138,44 C146,48 152,56 156,64 C156,70 152,72 148,70 L140,66 C138,78 134,92 132,106 L134,141 L127,141 L124,110 L106,112 L104,141 L97,141 L96,112 L76,110 L68,141 Z M128,46 C120,52 116,62 114,76 L118,70 C120,62 124,54 128,46 Z',
  ram: 'M66,141 L68,108 C58,104 56,92 62,84 C72,76 96,76 110,78 C116,72 120,66 124,62 C130,56 140,56 146,62 L150,74 L142,78 L136,74 C132,84 130,96 128,108 L130,141 L123,141 L120,112 L104,112 L102,141 L95,141 L94,112 L80,110 L74,141 Z M124,62 C116,52 120,40 132,38 C144,38 150,48 146,58 C142,50 134,46 128,50 C126,54 126,58 124,62 Z',
  bear: 'M50,141 L54,112 C44,104 44,88 56,80 C70,68 96,64 116,70 C126,72 134,78 140,84 L150,84 C158,86 162,92 160,98 L152,104 L144,106 C142,118 140,130 142,141 L132,141 L128,118 L108,120 L106,141 L96,141 L94,118 L72,116 L66,141 Z M136,80 L138,72 L144,78 Z',
  troll: 'M70,141 L74,118 C62,114 56,100 58,86 C60,72 68,62 82,60 C84,48 90,40 100,40 C110,40 116,48 116,58 C128,60 138,70 142,86 C146,100 140,114 128,118 L132,141 L118,141 L114,120 L104,124 L96,124 L86,120 L84,141 Z M142,86 C152,90 158,104 160,118 L170,120 C168,104 160,82 146,76 Z M150,118 C152,96 160,60 168,40 C176,40 180,48 178,56 C170,74 164,98 162,120 Z',
  golem: 'M66,141 L70,116 L58,112 L56,82 L66,66 L84,62 L84,46 L116,46 L116,62 L134,66 L144,82 L142,112 L130,116 L134,141 L112,141 L110,120 L90,120 L88,141 Z M56,82 L44,90 L42,120 L54,124 L58,112 Z M144,82 L156,90 L158,120 L146,124 L142,112 Z',
  treant: 'M80,141 C84,120 86,100 84,80 C70,74 58,62 54,44 C62,52 70,56 78,56 C70,46 68,34 72,22 C78,34 84,42 92,46 C92,34 96,24 102,16 C104,28 104,38 108,46 C114,38 122,32 132,30 C126,40 120,50 118,58 C128,58 138,54 146,46 C142,62 130,74 116,80 C114,100 116,120 120,141 L110,141 C108,130 104,124 100,124 C96,124 92,130 90,141 Z',
  dragon: 'M18,138 C36,132 52,126 64,118 C64,106 72,96 86,94 C100,92 112,92 122,88 C130,80 134,68 138,58 C140,50 144,44 150,41 L153,30 L158,40 L174,45 L176,52 L162,55 C154,58 149,64 147,72 C145,84 141,96 135,104 L139,124 L147,141 L134,141 L128,124 L96,122 L86,141 L73,141 L76,122 C60,128 42,136 18,138 Z M110,91 L96,50 L74,16 Q60,30 28,24 Q44,38 42,52 Q58,52 64,66 Q76,66 84,80 Q96,82 100,94 Z M126,86 L136,44 L160,12 Q162,34 182,42 Q166,48 164,60 Q150,62 144,76 Z',
};
BEASTS.crow = BEASTS.eagle; BEASTS.griffin = BEASTS.eagle; BEASTS.phoenix = BEASTS.eagle;
BEASTS.badger = BEASTS.bear; BEASTS.wyvern = BEASTS.dragon;

function beast(shape, rng, P, o) {
  const fig = `url(#${P('fig')})`;
  const rim = `stroke="${o.accent}" stroke-opacity=".5" stroke-width=".9"`;
  let s = '';
  if (shape === 'elemental' || shape === 'wisp') {
    const c = shape === 'wisp' ? o.accent : '#bfe4ff';
    s += `<circle cx="100" cy="82" r="${shape === 'wisp' ? 40 : 60}" fill="url(#${P('acc')})"/>`;
    const turns = shape === 'wisp' ? 5 : 9;
    for (let i = 0; i < turns; i++) {
      const r0 = 6 + i * (shape === 'wisp' ? 3 : 5), a0 = rng() * 6.28;
      s += `<path d="M${n1(100 + Math.cos(a0) * r0)},${n1(82 + Math.sin(a0) * r0 * 1.3)} A${r0},${n1(r0 * 1.3)} 0 0 1 ${n1(100 + Math.cos(a0 + 2.6) * r0)},${n1(82 + Math.sin(a0 + 2.6) * r0 * 1.3)}" stroke="${c}" stroke-opacity="${n1(0.9 - i * 0.07)}" stroke-width="${n1(2.6 - i * 0.18)}" fill="none" stroke-linecap="round"/>`;
    }
    if (shape === 'elemental') {
      s += `<path d="M86,30 L94,52 L86,54 L98,80 M118,26 L110,46 L118,48 L104,74" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round"/>`;
      s += `<circle cx="93" cy="80" r="2.4" fill="#fff"/><circle cx="107" cy="80" r="2.4" fill="#fff"/>`;
    } else {
      s += `<circle cx="100" cy="82" r="5" fill="#fff"/>`;
      for (let i = 0; i < 4; i++) s += `<circle cx="${n1(60 + rng() * 80)}" cy="${n1(50 + rng() * 60)}" r="${n1(1.5 + rng() * 2)}" fill="${light(o.accent, 0.5)}"/>`;
    }
    return s;
  }
  const flip = rng() < 0.5;
  const sc = shape === 'badger' ? 0.65 : shape === 'crow' ? 0.7 : 1;
  const tx = flip ? `translate(${W},0) scale(-1,1)` : '';
  const scT = sc !== 1 ? ` translate(${100 * (1 - sc)},${141 * (1 - sc)}) scale(${sc})` : '';
  let fill = fig;
  let extra = '';
  if (shape === 'phoenix') {
    fill = `url(#${P('fire')})`;
    s += `<defs><linearGradient id="${P('fire')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#ff9a3a"/><stop offset="1" stop-color="#b8261a"/></linearGradient></defs>`;
    s += `<circle cx="100" cy="70" r="80" fill="url(#${P('acc')})" opacity=".8"/>`;
    extra = `<path d="M96,118 C90,132 84,140 70,148 M100,120 C100,134 100,142 98,150 M104,118 C110,132 118,140 132,148" stroke="#ffb347" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>`;
  }
  if (shape === 'griffin' || /White/.test(o.card.name)) fill = `url(#${P('metal')})`;
  if (o.rank >= 3 && shape !== 'phoenix') s += `<ellipse cx="100" cy="90" rx="90" ry="60" fill="url(#${P('acc')})" opacity=".45"/>`;
  s += `<g transform="${tx}${scT}"><path d="${BEASTS[shape]}" fill="${fill}" ${rim} stroke-linejoin="round"/>${extra}`;
  // Eyes
  const eye = {
    wolf: [92, 40], stag: [136, 51], owl: [[91, 54], [109, 54]], eagle: [[97, 52], [103, 52]], horse: [140, 52], ram: [138, 64],
    bear: [146, 90], troll: [[95, 52], [105, 52]], golem: [[93, 56], [107, 56]], treant: [[94, 72], [106, 72]], dragon: [162, 47],
  }[shape in { crow: 1, griffin: 1, phoenix: 1 } ? 'eagle' : shape in { badger: 1 } ? 'bear' : shape in { wyvern: 1 } ? 'dragon' : shape];
  const eyeColor = o.fac.key === 'horde' || shape === 'dragon' || shape === 'wyvern' ? '#ff5a2a' : o.accent;
  if (eye) {
    const list = Array.isArray(eye[0]) ? eye : [eye];
    for (const [x, y] of list) s += `<circle cx="${x}" cy="${y}" r="5" fill="url(#${P('acc')})"/><circle cx="${x}" cy="${y}" r="1.4" fill="${eyeColor}"/>`;
  }
  if (shape === 'dragon' || shape === 'wyvern') s += `<path d="M74,16 L42,52 M74,16 L64,66 M74,16 L84,80 M160,12 L164,60 M160,12 L144,76" stroke="${o.accent}" stroke-opacity=".35" stroke-width=".8" fill="none"/>`;
  if (shape === 'owl') s += `<circle cx="91" cy="54" r="8" fill="${light(o.figure, 0.12)}"/><circle cx="109" cy="54" r="8" fill="${light(o.figure, 0.12)}"/><path d="M98,60 L100,66 L102,60 Z" fill="${o.accent}"/><path d="M76,66 C78,90 84,106 92,118 M124,66 C122,90 116,106 108,118" stroke="${o.accent}" stroke-opacity=".4" fill="none"/><path d="M92,80 l4,3 4,-3 4,3 4,-3 M92,90 l4,3 4,-3 4,3 4,-3" stroke="${light(o.figure, 0.2)}" fill="none"/><circle cx="91" cy="54" r="2.2" fill="${o.accent}"/><circle cx="109" cy="54" r="2.2" fill="${o.accent}"/>`;
  if (shape === 'golem') s += `<path d="M90,78 L100,90 L110,78 M100,90 L100,104" stroke="${o.accent}" stroke-width="1.6" fill="none"/>`;
  if (shape === 'stag' && o.fac.key === 'sylvan') s += `<path d="M130,46 C126,34 118,30 112,18" stroke="${o.accent}" stroke-width=".6" fill="none" opacity=".8"/>`;
  s += `</g>`;
  if (shape === 'dragon' || shape === 'wyvern') {
    s += `<g opacity=".7">${Array.from({ length: 12 }, () => `<circle cx="${n1(rng() * W)}" cy="${n1(100 + rng() * 50)}" r="${n1(1 + rng() * 2)}" fill="#ff8a3a"/>`).join('')}</g>`;
  }
  s += `<path d="M0,141 L${W},141 L${W},${H} L0,${H} Z" fill="${o.landNear}"/>`;
  return s;
}

// ---------- realms ----------
function windows(rng, x, y, w, h, n, color) {
  let s = '';
  for (let i = 0; i < n; i++) s += `<rect x="${n1(x + rng() * (w - 3))}" y="${n1(y + rng() * (h - 4))}" width="2" height="3" fill="${color}"/>`;
  return s;
}
function realm(mark, rng, P, o) {
  const { landMid, landNear, accent, fac, rank, skyBot, skyTop } = o;
  const stone = dark(mix(skyBot, fac.tint, 0.3), 0.55);
  const lit = mix(stone, o.t.sun, 0.25);
  let s = '';
  const halo = `<ellipse cx="100" cy="80" rx="${60 + rank * 10}" ry="${50 + rank * 8}" fill="url(#${P('acc')})" opacity="${0.18 + rank * 0.08}"/>`;
  s += halo;
  switch (mark) {
    case 'tower': {
      const x = 70 + rng() * 60, h = 80 + rng() * 20, w = 13 + rng() * 6;
      s += `<path d="M${n1(x - w)},132 L${n1(x - w * 0.75)},${n1(132 - h)} L${n1(x + w * 0.75)},${n1(132 - h)} L${n1(x + w)},132 Z" fill="${stone}"/>`;
      s += `<path d="M${n1(x - w)},132 L${n1(x - w * 0.75)},${n1(132 - h)} L${n1(x - w * 0.2)},${n1(132 - h)} L${n1(x - w * 0.3)},132 Z" fill="${lit}" opacity=".5"/>`;
      s += `<path d="M${n1(x - w * 1.05)},${n1(132 - h)} L${n1(x)},${n1(132 - h - 30)} L${n1(x + w * 1.05)},${n1(132 - h)} Z" fill="${dark(fac.tint, 0.4)}"/>`;
      s += windows(rng, x - w * 0.6, 132 - h + 8, w * 1.2, h - 16, 6 + rank * 2, accent);
      s += `<circle cx="${n1(x)}" cy="${n1(132 - h + 10)}" r="14" fill="url(#${P('acc')})"/><rect x="${n1(x - 2)}" y="${n1(132 - h + 6)}" width="4" height="7" fill="${light(accent, 0.4)}"/>`;
      break;
    }
    case 'gate': {
      s += `<path d="M40,134 L44,52 L64,48 L66,134 Z M134,134 L136,48 L156,52 L160,134 Z" fill="${stone}"/>`;
      s += `<path d="M64,134 L64,74 Q100,34 136,74 L136,134 Z" fill="${dark(stone, 0.2)}"/>`;
      s += `<path d="M72,134 L72,80 Q100,48 128,80 L128,134 Z" fill="${accent}" opacity=".85"/>`;
      s += `<path d="M72,134 L72,80 Q100,48 128,80 L128,134 Z" fill="url(#${P('acc')})"/>`;
      s += `<path d="M100,60 L100,134 M86,66 L86,134 M114,66 L114,134" stroke="${dark(stone, 0.4)}" stroke-width="1.4" opacity=".6"/>`;
      s += `<path d="M38,52 L66,46 L66,40 L38,46 Z M134,46 L162,52 L162,46 L134,40 Z" fill="${lit}"/>`;
      break;
    }
    case 'tree': {
      s += `<path d="M90,136 C92,112 94,92 90,70 L110,70 C106,92 108,112 112,136 C122,138 130,142 136,146 L64,146 C70,142 80,138 90,136 Z" fill="${dark(landNear, 0.2)}"/>`;
      for (let i = 0; i < 9; i++) {
        const cx = 100 + (rng() - 0.5) * 110, cy = 40 + rng() * 40, r = 18 + rng() * 18;
        s += `<circle cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}" fill="${mix(landMid, fac.tint, 0.2 + rng() * 0.2)}"/>`;
      }
      for (let i = 0; i < 18 + rank * 6; i++) s += `<circle cx="${n1(100 + (rng() - 0.5) * 120)}" cy="${n1(30 + rng() * 60)}" r="${n1(0.8 + rng() * 1.2)}" fill="${light(accent, 0.3)}"/>`;
      break;
    }
    case 'bridge': {
      s += `<rect x="0" y="116" width="${W}" height="40" fill="${mix(skyBot, skyTop, 0.4)}"/>`;
      s += `<path d="M0,104 L200,104 L200,122 L176,122 Q160,96 140,122 L120,122 Q100,90 80,122 L60,122 Q40,96 24,122 L0,122 Z" fill="${mix(stone, o.t.sun, 0.3)}"/><path d="M0,104 L200,104 L200,122 L176,122 Q160,96 140,122 L120,122 Q100,90 80,122 L60,122 Q40,96 24,122 L0,122 Z" fill="none" stroke="${accent}" stroke-opacity=".35" stroke-width=".8"/>`;
      s += `<path d="M0,101 L200,101 L200,105 L0,105 Z" fill="${light(lit, 0.2)}"/>`;
      s += `<path d="M30,101 L30,86 M70,101 L70,86 M130,101 L130,86 M170,101 L170,86" stroke="${mix(stone, o.t.sun, 0.3)}" stroke-width="3"/>`;
      s += `<circle cx="70" cy="84" r="9" fill="url(#${P('acc')})"/><circle cx="130" cy="84" r="9" fill="url(#${P('acc')})"/><circle cx="70" cy="84" r="1.6" fill="${accent}"/><circle cx="130" cy="84" r="1.6" fill="${accent}"/>`;
      s += `<path d="M0,128 L200,128 M10,136 L190,136" stroke="${light(skyBot, 0.4)}" stroke-width=".6" opacity=".5"/>`;
      break;
    }
    case 'hall': {
      s += `<path d="M-10,140 L30,30 L100,10 L170,30 L210,140 Z" fill="${stone}"/>`;
      s += `<path d="M66,140 L66,70 L100,52 L134,70 L134,140 Z" fill="${dark(stone, 0.35)}"/>`;
      s += `<path d="M76,140 L76,76 L100,62 L124,76 L124,140 Z" fill="${accent}" opacity=".8"/><path d="M76,140 L76,76 L100,62 L124,76 L124,140 Z" fill="url(#${P('acc')})"/>`;
      s += `<path d="M56,62 L60,140 M144,62 L140,140" stroke="${lit}" stroke-width="5"/>`;
      for (let i = 0; i < 4; i++) s += `<rect x="${60 - i * 6}" y="${140 - i * 3}" width="${80 + i * 12}" height="3" fill="${lit}" opacity=".5"/>`;
      break;
    }
    case 'village': {
      for (let i = 0; i < 5; i++) {
        const x = 20 + i * 40 + (rng() - 0.5) * 12, w = 16 + rng() * 10, h = 12 + rng() * 10, y = 128 - rng() * 8;
        if (fac.key === 'hearth') {
          s += `<ellipse cx="${n1(x)}" cy="${n1(y + 4)}" rx="${n1(w * 1.3)}" ry="${n1(h)}" fill="${landMid}"/><circle cx="${n1(x)}" cy="${n1(y)}" r="5" fill="${accent}" opacity=".9"/><circle cx="${n1(x)}" cy="${n1(y)}" r="12" fill="url(#${P('acc')})"/><rect x="${n1(x - 0.6)}" y="${n1(y - 5)}" width="1.2" height="10" fill="${landNear}"/>`;
        } else {
          s += `<rect x="${n1(x - w / 2)}" y="${n1(y - h)}" width="${n1(w)}" height="${n1(h)}" fill="${stone}"/><path d="M${n1(x - w / 2 - 3)},${n1(y - h)} L${n1(x)},${n1(y - h - 10)} L${n1(x + w / 2 + 3)},${n1(y - h)} Z" fill="${dark(fac.tint, 0.5)}"/>`;
          s += windows(rng, x - w / 2 + 2, y - h + 2, w - 4, h - 4, 2, accent);
          s += `<path d="M${n1(x + w * 0.2)},${n1(y - h - 6)} c-4,-10 6,-16 0,-28" stroke="#ddd" stroke-opacity=".25" stroke-width="2" fill="none"/>`;
        }
      }
      s += `<path d="M0,140 Q100,124 200,140 L200,150 L0,150 Z" fill="${landNear}"/>`;
      break;
    }
    case 'forge': {
      s += `<path d="M40,134 L40,86 L100,64 L160,86 L160,134 Z" fill="${stone}"/>`;
      s += `<rect x="122" y="40" width="14" height="40" fill="${dark(stone, 0.2)}"/>`;
      s += `<path d="M129,40 C120,24 140,14 128,-4" stroke="#999" stroke-opacity=".35" stroke-width="7" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M80,134 L80,104 Q100,88 120,104 L120,134 Z" fill="#ff8a3a"/><path d="M80,134 L80,104 Q100,88 120,104 L120,134 Z" fill="url(#${P('acc')})"/>`;
      s += `<circle cx="100" cy="120" r="40" fill="url(#${P('acc')})" opacity=".7"/>`;
      for (let i = 0; i < 16; i++) s += `<circle cx="${n1(85 + rng() * 30)}" cy="${n1(60 + rng() * 50)}" r="${n1(0.6 + rng())}" fill="#ffcf7a"/>`;
      break;
    }
    case 'camp': {
      for (let i = 0; i < 5; i++) {
        const x = 18 + i * 42 + (rng() - 0.5) * 10, w = 14 + rng() * 8, h = 18 + rng() * 10;
        s += `<path d="M${n1(x - w)},132 L${n1(x)},${n1(132 - h)} L${n1(x + w)},132 Z" fill="${dark(fac.tint, 0.6)}"/><path d="M${n1(x)},${n1(132 - h)} L${n1(x)},${n1(132 - h - 16)} L${n1(x + 10)},${n1(132 - h - 12)} L${n1(x)},${n1(132 - h - 8)}" fill="${fac.tint}" stroke="${landNear}" stroke-width=".8"/>`;
      }
      s += `<circle cx="100" cy="128" r="36" fill="url(#${P('acc')})"/><path d="M92,134 Q94,118 100,108 Q104,120 108,134 Z" fill="#ffb347"/><path d="M96,134 Q98,124 100,118 Q102,126 104,134 Z" fill="#fff0b0"/>`;
      s += `<path d="M100,108 C92,90 110,74 98,50" stroke="#777" stroke-opacity=".3" stroke-width="8" fill="none" stroke-linecap="round"/>`;
      s += `<path d="M0,134 L200,134 L200,150 L0,150 Z" fill="${landNear}"/>`;
      break;
    }
    case 'peak': {
      s += `<path d="M-10,140 L60,70 L84,40 L100,20 L118,44 L138,62 L210,140 Z" fill="${stone}"/>`;
      s += `<path d="M84,40 L100,20 L118,44 L110,40 L104,50 L96,42 L90,48 Z" fill="#f2f4f8"/>`;
      s += `<path d="M-10,140 L60,70 L84,40 L100,20 L96,60 L80,100 L60,140 Z" fill="${lit}" opacity=".35"/>`;
      s += `<path d="M100,140 C110,120 86,110 100,92 C110,80 96,70 104,58" stroke="${accent}" stroke-opacity=".55" stroke-width="1.2" fill="none" stroke-dasharray="2 2"/>`;
      break;
    }
    case 'lake': {
      s += `<rect x="0" y="112" width="${W}" height="40" fill="${mix(skyBot, skyTop, 0.45)}"/>`;
      for (let i = 0; i < 12; i++) s += `<rect x="${n1(rng() * W)}" y="${n1(114 + rng() * 34)}" width="${n1(10 + rng() * 30)}" height=".7" fill="${light(skyBot, 0.5)}" opacity=".45"/>`;
      s += `<ellipse cx="100" cy="128" rx="18" ry="3" fill="${accent}" opacity=".45"/><circle cx="100" cy="100" r="22" fill="url(#${P('acc')})" opacity=".8"/>`;
      for (let i = 0; i < 10; i++) {
        const x = rng() < 0.5 ? rng() * 40 : 160 + rng() * 40;
        s += `<path d="M${n1(x)},150 Q${n1(x + 2)},${n1(130 - rng() * 10)} ${n1(x + 4 * (rng() - 0.5))},${n1(118 - rng() * 14)}" stroke="${landNear}" stroke-width="1.4" fill="none"/>`;
      }
      break;
    }
    case 'citadel': {
      s += `<path d="M30,150 L44,110 L60,96 L140,96 L156,110 L170,150 Z" fill="${dark(stone, 0.3)}"/>`;
      const towers = [[62, 46], [84, 30], [100, 14], [116, 30], [138, 46]];
      for (const [x, top] of towers) {
        s += `<rect x="${x - 6}" y="${top}" width="12" height="${100 - top}" fill="${stone}"/><path d="M${x - 8},${top} L${x},${top - 16} L${x + 8},${top} Z" fill="${dark(fac.tint, 0.45)}"/>`;
        s += windows(rng, x - 4, top + 4, 8, 90 - top, 3, accent);
      }
      s += `<rect x="56" y="70" width="88" height="30" fill="${stone}"/>`;
      s += windows(rng, 58, 74, 84, 22, 10, accent);
      s += `<circle cx="100" cy="20" r="14" fill="url(#${P('acc')})"/>`;
      if (o.fac.key === 'wilds' || rng() < 0.4) s += `<rect x="0" y="118" width="${W}" height="32" fill="${mix(skyBot, skyTop, 0.5)}" opacity=".85"/><path d="M0,124 L200,124 M0,134 L200,134" stroke="${light(skyBot, 0.4)}" stroke-width=".6" opacity=".5"/>`;
      break;
    }
    default:
      break;
  }
  return s;
}

// ---------- relics ----------
function pedestal(stone, accent) {
  return `<path d="M64,140 L136,140 L130,130 L70,130 Z" fill="${stone}"/><path d="M70,130 L130,130" stroke="${accent}" stroke-opacity=".5"/>`;
}
function relic(obj, rng, P, accent, fac, rank) {
  const metal = `url(#${P('metal')})`;
  const gem = ['#ff4a6a', '#4ad2ff', '#7cff8a', '#c08aff', '#ffd24a'][Math.floor(rng() * 5)];
  const gemDot = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="url(#${P('acc')})"/><path d="M${x},${y - r} L${x + r},${y} L${x},${y + r} L${x - r},${y} Z" fill="${gem}" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>`;
  const wood = dark(fac.tint, 0.65);
  switch (obj) {
    case 'sword':
      return `<g transform="rotate(${n1((rng() - 0.5) * 20)} 100 80)"><path d="M100,12 L105,22 L105,102 L95,102 L95,22 Z" fill="${metal}"/><path d="M100,16 L100,100" stroke="${accent}" stroke-width="1"/><path d="M78,102 L122,102 L118,108 L82,108 Z" fill="${metal}"/><rect x="97" y="108" width="6" height="18" fill="${wood}"/><circle cx="100" cy="129" r="4.5" fill="${metal}"/>${gemDot(100, 105, 3)}</g>`;
    case 'ring':
      return `<ellipse cx="100" cy="86" rx="28" ry="24" fill="none" stroke="${metal}" stroke-width="7"/>${gemDot(100, 60, 8)}`;
    case 'crown':
      return `<g transform="translate(100 82)"><path d="M-40,16 L-44,-20 L-24,-2 L-12,-30 L0,-6 L12,-30 L24,-2 L44,-20 L40,16 Z" fill="${metal}" stroke="#000" stroke-opacity=".3"/>${rank >= 4 ? '<path d="M-2,-34 L4,-2 L-4,6 L2,18" stroke="#120a10" stroke-width="2.4" fill="none"/>' : ''}<rect x="-40" y="10" width="80" height="8" fill="${metal}"/>${gemDot(0, 13, 4)}${gemDot(-22, 13, 3)}${gemDot(22, 13, 3)}<circle cx="-44" cy="-22" r="3" fill="${gem}"/><circle cx="44" cy="-22" r="3" fill="${gem}"/><circle cx="-12" cy="-32" r="3" fill="${gem}"/><circle cx="12" cy="-32" r="3" fill="${gem}"/></g>`;
    case 'chalice':
      return `<path d="M72,40 L128,40 Q128,76 104,84 L104,112 L118,124 L82,124 L96,112 L96,84 Q72,76 72,40 Z" fill="${metal}"/><ellipse cx="100" cy="40" rx="28" ry="5" fill="${dark(fac.metal, 0.4)}"/><ellipse cx="100" cy="40" rx="24" ry="3.5" fill="${accent}" opacity=".9"/>${gemDot(100, 62, 5)}`;
    case 'amulet':
      return `<path d="M64,24 Q100,90 136,24" stroke="${metal}" stroke-width="2" fill="none" stroke-dasharray="3 1.5"/><circle cx="100" cy="82" r="22" fill="${metal}"/><circle cx="100" cy="82" r="16" fill="${dark(fac.tint, 0.3)}"/>${gemDot(100, 82, 9)}<path d="M100,60 L100,104 M78,82 L122,82" stroke="${accent}" stroke-opacity=".3"/>`;
    case 'tome':
      return `<path d="M54,104 L100,96 L146,104 L146,58 L100,50 L54,58 Z" fill="${dark(fac.tint, 0.5)}" stroke="${metal}" stroke-width="2"/><path d="M58,100 L100,92 L142,100 L142,60 L100,54 L58,60 Z" fill="${light(accent, 0.7)}"/><path d="M100,54 L100,92" stroke="${dark(fac.tint, 0.4)}"/>${[0, 1, 2, 3, 4].map(i => `<path d="M64,${66 + i * 6} L94,${62 + i * 6} M106,${62 + i * 6} L136,${66 + i * 6}" stroke="${dark(fac.tint, 0.4)}" stroke-opacity=".45" stroke-width=".8"/>`).join('')}<circle cx="100" cy="66" r="${26 + rank * 4}" fill="url(#${P('acc')})"/>${Array.from({ length: 6 }, (_, i) => `<path d="M${100 + (i - 2.5) * 10},50 l2,-${8 + i % 3 * 5} l2,${3 + i % 2 * 2}" stroke="${accent}" fill="none" stroke-width="1.2"/>`).join('')}`;
    case 'staff':
      return `<path d="M100,30 L100,132" stroke="${wood}" stroke-width="5" stroke-linecap="round"/><path d="M84,28 Q100,48 116,28 Q110,14 100,12 Q90,14 84,28 Z" fill="${dark(fac.metal, 0.5)}"/><circle cx="91" cy="26" r="3" fill="#000" opacity=".7"/><circle cx="109" cy="26" r="3" fill="#000" opacity=".7"/><circle cx="91" cy="26" r="1.4" fill="${accent}"/><circle cx="109" cy="26" r="1.4" fill="${accent}"/><path d="M92,50 L108,50 L104,60 L96,60 Z" fill="${metal}"/><path d="M100,62 C88,70 112,80 100,88" stroke="#c9a" stroke-opacity=".4" fill="none"/>`;
    case 'shield':
      return `<path d="M64,30 L136,30 L136,74 Q136,110 100,128 Q64,110 64,74 Z" fill="${dark(fac.tint, 0.2)}" stroke="${metal}" stroke-width="4"/><path d="M100,40 L118,70 L100,112 L82,70 Z" fill="${metal}"/>${gemDot(100, 70, 6)}`;
    case 'horn':
      return `<path d="M56,92 C70,60 110,48 146,54 L150,40 L156,58 L146,70 C116,68 84,82 70,104 Z" fill="${light(fac.metal, 0.6)}" stroke="${dark(fac.metal, 0.5)}" stroke-width="1.4"/><path d="M70,80 L78,92 M86,70 L92,82 M104,62 L108,74 M122,58 L124,70" stroke="${metal}" stroke-width="3"/><path d="M52,90 L74,106" stroke="${metal}" stroke-width="5" stroke-linecap="round"/>`;
    case 'gem': {
      const g = gem;
      return `<circle cx="100" cy="80" r="${40 + rank * 6}" fill="url(#${P('acc')})"/><path d="M100,30 L132,60 L118,116 L82,116 L68,60 Z" fill="${g}"/><path d="M100,30 L112,62 L100,116 L88,62 Z" fill="#fff" opacity=".25"/><path d="M68,60 L132,60 M88,62 L82,116 M112,62 L118,116" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/><path d="M80,50 L92,38" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`;
    }
    case 'bow':
      return `<path d="M86,14 Q140,80 86,146" stroke="${wood}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M86,14 Q140,80 86,146" stroke="${accent}" stroke-width="1.4" fill="none"/><path d="M86,14 L86,146" stroke="#f0ece0" stroke-width=".8"/><path d="M60,80 L128,80" stroke="${metal}" stroke-width="2"/><path d="M128,80 L120,76 L120,84 Z" fill="${accent}"/>`;
    case 'axe':
      return `<path d="M100,20 L100,134" stroke="${wood}" stroke-width="5"/><path d="M100,30 L112,32 C126,24 136,14 140,6 C154,26 154,58 140,80 C132,70 122,64 112,64 L100,66 Z M100,36 L88,34 L80,42 L88,58 L100,58 Z" fill="${metal}"/><path d="M140,6 C154,26 154,58 140,80" stroke="${accent}" stroke-width="1.8" fill="none"/>`;
    default:
      return '';
  }
}

// ---------- spells ----------
function spell(style, rng, P, rank) {
  const [c, hi] = SPELL[style];
  let s = '';
  const rings = 2 + Math.min(rank, 3);
  for (let i = 0; i < rings; i++) {
    const r = 22 + i * 12;
    s += `<circle cx="100" cy="74" r="${r}" fill="none" stroke="${c}" stroke-opacity="${n1(0.8 - i * 0.12)}" stroke-width="${i % 2 ? 0.8 : 1.6}" ${i % 2 ? 'stroke-dasharray="3 3"' : ''}/>`;
    const glyphs = 8 + i * 4;
    for (let k = 0; k < glyphs; k++) {
      if (i % 2) continue;
      const ang = (k / glyphs) * Math.PI * 2;
      const gx = 100 + Math.cos(ang) * (r + 5), gy = 74 + Math.sin(ang) * (r + 5);
      const g = Math.floor(rng() * 4);
      const d = g === 0 ? 'M-2,-3 L0,3 L2,-3' : g === 1 ? 'M-2,-3 L-2,3 M-2,0 L2,-3 M-2,0 L2,3' : g === 2 ? 'M0,-3 L0,3 M-2,-1 L2,1' : 'M-2,3 L0,-3 L2,3 M-1,0 L1,0';
      s += `<path d="${d}" transform="translate(${n1(gx)} ${n1(gy)}) rotate(${n1(ang * 57.3 + 90)})" stroke="${hi}" stroke-width=".7" fill="none" opacity=".8"/>`;
    }
  }
  // Polygon star in the middle
  const pts = 5 + Math.floor(rng() * 4);
  let d = '';
  for (let i = 0; i <= pts; i++) {
    const a = (i * 2 / pts) * Math.PI * 2 - Math.PI / 2;
    d += `${i ? 'L' : 'M'}${n1(100 + Math.cos(a) * 22)},${n1(74 + Math.sin(a) * 22)} `;
  }
  s += `<path d="${d}" stroke="${hi}" stroke-width="1" fill="none" opacity=".8"/>`;
  s += `<circle cx="100" cy="74" r="${18 + rank * 3}" fill="url(#${P('acc')})"/><circle cx="100" cy="74" r="${5 + rank}" fill="${hi}"/>`;
  // Style flourish
  if (style === 'storm') {
    for (let i = 0; i < 3; i++) {
      let x = 100, y = 74, path = `M${x},${y}`;
      const dir = rng() * 6.28;
      for (let k = 0; k < 6; k++) { x += Math.cos(dir) * 10 + (rng() - 0.5) * 12; y += Math.sin(dir) * 10 + (rng() - 0.5) * 12; path += ` L${n1(x)},${n1(y)}`; }
      s += `<path d="${path}" stroke="${hi}" stroke-width="1.4" fill="none"/>`;
    }
  } else if (style === 'fire') {
    for (let i = 0; i < 7; i++) {
      const x = 70 + i * 10 + (rng() - 0.5) * 6, h = 30 + rng() * 40;
      s += `<path d="M${n1(x - 6)},${116} Q${n1(x - 4)},${n1(116 - h * 0.6)} ${n1(x)},${n1(116 - h)} Q${n1(x + 4)},${n1(116 - h * 0.6)} ${n1(x + 6)},116 Z" fill="${c}" opacity=".55"/>`;
    }
  } else if (style === 'frost') {
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      s += `<path d="M100,74 L${n1(100 + Math.cos(a) * 60)},${n1(74 + Math.sin(a) * 60)}" stroke="${hi}" stroke-width="1.2" opacity=".7"/>`;
      for (const f of [0.5, 0.75]) {
        const bx = 100 + Math.cos(a) * 60 * f, by = 74 + Math.sin(a) * 60 * f;
        s += `<path d="M${n1(bx + Math.cos(a + 0.8) * 8)},${n1(by + Math.sin(a + 0.8) * 8)} L${n1(bx)},${n1(by)} L${n1(bx + Math.cos(a - 0.8) * 8)},${n1(by + Math.sin(a - 0.8) * 8)}" stroke="${hi}" fill="none" opacity=".7"/>`;
      }
    }
  } else if (style === 'nature') {
    for (let i = 0; i < 10; i++) {
      const a = rng() * 6.28, r = 30 + rng() * 40, x = 100 + Math.cos(a) * r, y = 74 + Math.sin(a) * r * 0.8;
      s += `<path d="M${n1(x)},${n1(y)} q4,-6 10,-4 q-2,6 -10,4 Z" fill="${c}" opacity=".8" transform="rotate(${n1(a * 57)} ${n1(x)} ${n1(y)})"/>`;
    }
  } else if (style === 'shadow') {
    for (let i = 0; i < 5; i++) {
      const a = rng() * 6.28;
      s += `<path d="M100,74 C${n1(100 + Math.cos(a) * 30)},${n1(74 + Math.sin(a) * 10)} ${n1(100 + Math.cos(a + 1) * 50)},${n1(74 + Math.sin(a + 1) * 50)} ${n1(100 + Math.cos(a + 1.5) * 80)},${n1(74 + Math.sin(a + 1.5) * 70)}" stroke="#1a0630" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>`;
    }
  } else if (style === 'earth') {
    for (let i = 0; i < 8; i++) {
      const x = 30 + rng() * 140, y = 100 + rng() * 30, w = 4 + rng() * 8;
      s += `<path d="M${n1(x - w)},${n1(y)} L${n1(x)},${n1(y - w * 1.6)} L${n1(x + w)},${n1(y)} Z" fill="${dark(c, 0.3)}" stroke="${hi}" stroke-opacity=".4" stroke-width=".6"/>`;
    }
    s += `<path d="M40,130 L80,118 L100,130 L124,116 L160,130" stroke="${hi}" stroke-width="1.6" fill="none" opacity=".8"/>`;
  } else if (style === 'light' || style === 'rune') {
    s += `<path d="M100,20 L100,128 M46,74 L154,74" stroke="${hi}" stroke-width=".8" opacity=".6"/>`;
  }
  return s;
}

const cache = new Map();
export function artFor(card) {
  if (!cache.has(card.id)) cache.set(card.id, `<img src="data:image/svg+xml,${encodeURIComponent(cardArt(card))}" width="200" height="150" alt="" draggable="false">`);
  return cache.get(card.id);
}
