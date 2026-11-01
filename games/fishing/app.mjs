import * as E from './engine.mjs';
import { regionAt, sheetInfo, dieInfo } from './info.mjs';
import { SHEETS, CELLS, SECTION_SHEET, HIT, PIN, LICENSE, SHIP, SHIP_H, KC, HEX, SALVAGE_STARS, MARKET_ROWS, MARKET_X, coinPos, TRACK, PAGE_SETS, composePage, pageAt } from './layout.mjs';

const KEY = 'fishing.v1', BEST = 'fishing.best';
const $ = sel => document.querySelector(sel);
const pages = $('#pages'), stage = $('#stage'), tabsEl = $('#tabs'), promptEl = $('#prompt'), diceEl = $('#dice'), controlsEl = $('#controls'), infoEl = $('#info'), actionsEl = $('#actions'), dlg = $('#dlg');

let s = load() || E.newGame('rival');
let ui = { view: 'you', sel: null, page: 'boats', set: null, toast: null, prevMarks: new Set(), firstPaint: true, lastRolls: -1, hl: null };
let layout = [], panels = []; // composed pages of the current set, and every rendered panel
let history = [], timer = null;

// ---------- persistence ----------
function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return E.validSave(v) ? v : null; } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } }
function best() { try { return JSON.parse(localStorage.getItem(BEST)) || {}; } catch { return {}; } }
function recordBest(total) { const b = best(); if (!(b[s.mode] >= total)) { b[s.mode] = total; try { localStorage.setItem(BEST, JSON.stringify(b)); } catch { } return true; } return false; }

// ---------- helpers ----------
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const xMark = (x, y, r, cls = 'ink', key = '') => {
  const d = r * .78, fresh = key && !ui.prevMarks.has(key) && !ui.firstPaint ? ' fresh' : '';
  if (key) ui.nextMarks.add(key);
  return `<path class="${cls}${fresh}" d="M${x - d} ${y - d}L${x + d} ${y + d}M${x + d} ${y - d}L${x - d} ${y + d}"/>`;
};
const strikeMark = (x, y, r, key) => {
  const fresh = !ui.prevMarks.has(key) && !ui.firstPaint ? ' fresh' : '';
  ui.nextMarks.add(key);
  return `<g class="${fresh.trim()}"><circle class="strike-bg" cx="${x}" cy="${y}" r="${r + 2}"/><path class="strike" d="M${x - r - 4} ${y + r * .55}L${x + r + 4} ${y - r * .55}"/></g>`;
};
const rect = (cls, x0, y0, x1, y1, rx = 10, extra = '') => `<rect class="${cls}" x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" rx="${rx}" ${extra}/>`;

// Whose sheet is on screen: yours, or the AI player's in a game against it.
const viewed = () => ui.view === 'ai' && s.bot ? s.bot : s;
const vsAI = () => s.mode === 'ai' && !!s.bot;
function setView(v) {
  v = v === 'ai' && vsAI() ? 'ai' : 'you';
  if (v === ui.view) return;
  ui.view = v; ui.firstPaint = true; ui.hl = null;
  if (!infoEl.hidden) infoEl.hidden = true;
  render();
  if (v === 'you') focusTargets();
}
function syncView() {
  const btn = $('#who-btn'), on = vsAI();
  btn.hidden = !on;
  document.body.classList.toggle('vs-ai', on);
  document.body.classList.toggle('viewing-ai', on && ui.view === 'ai');
  if (!on) return;
  const me = E.score(s).total, ai = E.score(s.bot).total;
  btn.innerHTML = ui.view === 'ai'
    ? `<span class="who-k">Back to</span><span class="who-v">You ${me}</span>`
    : `<span class="who-k">AI sheet</span><span class="who-v">${ai}</span>`;
  btn.setAttribute('aria-pressed', String(ui.view === 'ai'));
  btn.setAttribute('aria-label', ui.view === 'ai' ? `Back to your sheet (you ${me})` : `View the AI player's sheet (AI ${ai})`);
  $('#viewing').hidden = ui.view !== 'ai';
}
function currentOptions() {
  if (E.currentTask(s)) return null;
  if (s.step.k === 'pick') return ui.sel != null ? E.options(s, ui.sel) : null;
  if (s.step.k === 'use') return E.options(s, s.step.die);
  return null;
}
function targets() {
  const t = E.currentTask(s);
  if (t) return t.t === 'star' ? E.starTargets(s) : [];
  const o = currentOptions();
  return o ? o.targets : [];
}

// ---------- sheet rendering ----------
function renderSheets() {
  ui.nextMarks = new Set();
  const out = { boats: '', harbor: '' };
  const v = viewed(), mine = v === s; // whose sheet is on screen
  const tg = new Set(mine ? targets() : []);
  const task = mine ? E.currentTask(s) : null;

  // section boxes
  for (const [sec, cells] of Object.entries(CELLS)) {
    const sh = SECTION_SHEET[sec];
    v.marks[sec].forEach((m, i) => {
      const c = cells[i];
      if (m === 1) out[sh] += xMark(c.x, c.y, c.r, 'ink', `${sec}:${i}`);
      else if (m === 2) out[sh] += strikeMark(c.x, c.y, c.r, `${sec}:${i}:x`);
    });
  }
  // licenses
  E.TYPES.forEach(t => {
    const circles = LICENSE.circles[t];
    circles.forEach(([x, y], lvl) => {
      if (v.lic[t] > lvl) out.boats += xMark(x, y, 11, 'ink', `lic:${t}:${lvl}`);
      else { const [y0, y1] = LICENSE.cards[lvl]; out.boats += rect('dim', x - 14, y0, x + 192, y1, 12); }
    });
  });
  // boats & fish
  for (const [type, spec] of Object.entries(SHIP)) {
    const sh = spec.box[2], cap = type === 'oyster' ? E.capacity(v, 'oyster') : E.SHIPS[type].cap;
    v.ships[type].forEach((b, i) => {
      const m = spec.marks[i];
      const [dy0, dy1] = SHIP_H[type];
      if (b.on) out[sh] += xMark(m.x, m.y, 11, 'ink', `boat:${type}:${i}`);
      else out[sh] += rect('dim', spec.box[0], m.y + dy0, spec.box[0] + spec.box[1], m.y + dy1, 16);
      (spec.fish[i] || []).forEach((f, k) => {
        if (k < b.fish) out[sh] += xMark(f.x, f.y, 10, 'ink sm', `fish:${type}:${i}:${k}`);
        else if (k >= cap) out[sh] += `<circle class="lock" cx="${f.x}" cy="${f.y}" r="11"/>`;
      });
    });
  }
  // king crab license & bonus
  if (v.kc.on) out.harbor += xMark(KC.circle[0], KC.circle[1], 11, 'ink', 'kc');
  else out.harbor += rect('dim', ...KC.card, 12);
  if (v.kc.bonus) { const [x, y] = KC.bonus[v.kc.bonus]; out.harbor += xMark(x, y, 13, 'ink', 'kcb'); }
  if (task?.t === 'kc') for (const [k, [x, y]] of Object.entries(KC.bonus)) out.harbor += `<circle class="choice" data-kc="${k}" cx="${x}" cy="${y}" r="20"/>`;
  // buffet hexes, salvage stars
  E.HEXES.forEach((t, i) => { if (v.hexes[t]) out.harbor += xMark(HEX.x, HEX.ys[i], 13, 'ink', `hex:${t}`); });
  SALVAGE_STARS.forEach(([x, y], i) => { if (v.salvageUses > i) out.harbor += xMark(x, y, 11, 'ink', `salv:${i}`); });
  // market bracket
  const fish = E.totalFish(v), row = MARKET_ROWS.find(([min]) => fish >= min);
  out.harbor += rect('market-row', MARKET_X[0], row[1] - 16, MARKET_X[1], row[1] + 16, 8);
  // coin track
  const nextCoin = v.coins.indexOf(0);
  v.coins.forEach((c, i) => {
    const { x, y } = coinPos(i);
    if (c === 1) out.harbor += xMark(x, y, 10, 'ink sm', `coin:${i}`);
    else if (c === 2) out.harbor += strikeMark(x, y, 10, `coin:${i}:x`);
  });
  if (nextCoin >= 0) { const { x, y } = coinPos(nextCoin); out.harbor += `<rect class="coin-next" x="${x - 15}" y="${y - 14}" width="30" height="28" rx="4"/>`; }
  // round tracker
  TRACK.x.forEach((x, i) => {
    const r = i + 1;
    if (r > s.rounds) { out.boats += rect('dim', x - 15, TRACK.round - 16, x + 15, TRACK.town + 14, 6); return; }
    const past = r < s.round || s.phase === 'over';
    const cur = r === s.round && s.phase !== 'over';
    if (cur) out.boats += `<circle class="round-ring" cx="${x}" cy="${TRACK.round}" r="15"/>`;
    const doneBoat = past || (cur && (s.phase === 'town' || ['income', 'fishing'].includes(s.step.k)));
    const doneInc = past || (cur && s.phase === 'town');
    const doneTown = past;
    if (doneBoat) out.boats += xMark(x, TRACK.boat, 9, 'ink sm', `trk:b:${r}`);
    if (doneInc) out.boats += xMark(x, TRACK.income, 9, 'ink sm', `trk:i:${r}`);
    if (r % 2 === 0 && (s.fishingDone || []).includes(r)) out.boats += xMark(x, TRACK.fishing, 10, 'ink sm', `trk:f:${r}`);
    if (doneTown) out.boats += xMark(x, TRACK.town, 9, 'ink sm', `trk:t:${r}`);
  });
  // live score
  const sc = E.score(v);
  [sc.fish, sc.boats, sc.licenses, sc.buildings, sc.bonus, sc.total].forEach((v, i) => {
    out.boats += `<text class="score-val${i === 5 ? ' total' : ''}" x="${TRACK.score.x}" y="${TRACK.score.ys[i]}">${v}</text>`;
  });
  // rival tokens
  if (mine && s.mode === 'rival' && s.phase !== 'over') {
    for (const kind of ['boat', 'harbor', 'wharf']) {
      const sec = s.tokens[kind], [x, y] = PIN[sec];
      out[SECTION_SHEET[sec]] += `<g class="pin"><circle cx="${x}" cy="${y}" r="14"/><text x="${x}" y="${y + 1}">R</text></g>`;
    }
  }
  // targets & hit areas
  for (const sec of tg) {
    const sh = SECTION_SHEET[sec], [x0, y0, x1, y1] = HIT[sec];
    out[sh] += rect('target', x0, y0, x1, y1, 16);
    const i = E.openIdx(v, sec); if (i >= 0) { const c = CELLS[sec][i]; out[sh] += `<circle class="next" cx="${c.x}" cy="${c.y}" r="${c.r + 7}"/>`; }
  }
  for (const sec of tg) { const [x0, y0, x1, y1] = HIT[sec]; out[SECTION_SHEET[sec]] += rect('hit', x0, y0, x1, y1, 16, `data-sec="${sec}"`); }

  if (ui.hl) { const [x0, y0, x1, y1] = ui.hl.rect; out[ui.hl.sheet] += rect('info-hl', x0, y0, x1, y1, 14); }
  for (const p of panels) p.marks.innerHTML = out[p.sheet];
  ui.prevMarks = ui.nextMarks; ui.firstPaint = false;
}

// ---------- dock rendering ----------
const faceImg = f => `<img src="assets/dice/${f}.webp" alt="">`;
function phaseName() {
  if (s.phase === 'over') return 'Final';
  if (s.step.k === 'income') return 'Income';
  if (s.step.k === 'fishing') return 'Fishing';
  return s.phase === 'town' ? 'Town' : 'Boat';
}
function renderDock() {
  const task = E.currentTask(s), st = s.step, o = currentOptions();
  renderDice(task);
  // prompt + actions
  const vs = vsAI() ? ` · You ${E.score(s).total} – AI ${E.score(s.bot).total}` : '';
  const head = (s.phase === 'over' ? 'Game over' : `Round ${s.round}/${s.rounds} · ${phaseName()}`) + vs;
  let msg = '', acts = [];
  const btn = (label, data, cls = '') => acts.push(`<button class="act ${cls}" ${data}>${label}</button>`);
  if (s.phase === 'over') {
    const sc = E.score(s);
    if (vsAI()) { const ai = E.score(s.bot).total; msg = sc.total > ai ? `You win ${sc.total}–${ai}!` : sc.total < ai ? `AI wins ${ai}–${sc.total}` : `Tie at ${sc.total}`; }
    else msg = `Final score ${sc.total}${s.mode === 'rival' ? ` — ${E.rank(sc.total)}` : ''}`;
    btn('Score', 'data-a="final"', 'ghost'); btn('New game', 'data-a="new"', 'primary');
  } else if (task) {
    if (task.t === 'star') { msg = '★ Star action — tap any highlighted section'; btn('Skip', 'data-a="skip"', 'ghost'); }
    else if (task.t === 'lb') {
      msg = `${E.label(task.type)}: license or boat?`;
      btn(`${faceImg(task.type)} License`, 'data-a="lb" data-v="L"', 'primary'); btn(`${faceImg(task.type)} Boat`, 'data-a="lb" data-v="B"', 'primary');
    } else if (task.t === 'kc') {
      msg = 'King Crab license — choose your bonus';
      [['building', '2 / building'], ['fish', '1 / 6 fish'], ['license', '1 / license'], ['coins', '1 / 10 coins']].forEach(([k, l]) => btn(l, `data-a="kc" data-v="${k}"`));
    } else if (task.t === 'oyster') {
      msg = `Oyster boat ${task.boat + 1}: what's the catch?`;
      btn(`${faceImg('oyster')} 2 fish`, 'data-a="oyster" data-v="fish"', 'primary');
      btn(`1 fish + ${s.lic.oyster === 3 ? '★' : 'coin'}`, 'data-a="oyster" data-v="bonus"', 'primary');
    }
  } else if (st.k === 'pick') {
    if (!o) msg = 'Pick a die';
    else msg = useMsg(o);
  } else if (st.k === 'use') {
    msg = (st.src === 'shared' ? 'Shared die — ' : '') + useMsg(o);
  } else if (st.k === 'rival') {
    msg = `<span class="rival">Rival is choosing…</span>`;
  } else if (st.k === 'ai') {
    msg = `<span class="rival">AI is choosing${st.shared ? ' how to use the shared die' : ' a die'}…</span>`;
  } else msg = ui.toast || '';
  if (o) {
    if (o.coins) btn(`${faceImg('coins')} +3 coins`, 'data-a="coins"', 'primary');
    if (o.market) btn(`${faceImg('market')} +${o.market} coins`, 'data-a="market"', 'primary');
    if (o.hex) btn(`Buffet: ${E.label(o.hex)}`, 'data-a="hex"');
    if (o.salvage) btn('Salvage ★', 'data-a="salvage"');
    if (o.reroll) btn('Reroll', 'data-a="reroll"');
    if (o.cash) btn(`Take ${o.cash} coin${o.cash > 1 ? 's' : ''}`, 'data-a="cash"', 'ghost');
  }
  const sub = ui.toast && msg !== ui.toast ? `<small>${ui.toast}</small>` : `<small>${head}</small>`;
  promptEl.innerHTML = `<b>${msg}</b>${sub}`;
  const html = acts.join('');
  if (html !== ui.actsHtml) { actionsEl.innerHTML = html; ui.actsHtml = html; } // keep buttons (and their entrance) stable between renders
  const away = !!task || s.phase === 'over' || !s.pool.length;
  diceEl.classList.toggle('away', away);
  controlsEl.classList.toggle('has-dice', !away);
  $('#undo-btn').disabled = !history.length;
}
function useMsg(o) {
  const f = o.face;
  if (o.left === 2 || (s.step.k === 'use' && s.step.used && o.left > 0)) return `Shrimp license: ${s.step.used ? 'second' : 'first'} of two boat faces`;
  if (E.TYPES.includes(f)) {
    if (o.targets.length > 1) return 'Shrimp license — tap any boat column';
    return o.targets.length ? `Tap the ${E.label(f)} column` : `${E.label(f)} column is full`;
  }
  if (f === 'coins') return 'Take three coins';
  if (f === 'market') return `Sell at the market: ${E.totalFish(s)} fish`;
  if (f === 'harbor') return o.targets.length ? 'Tap a harbor ship' : 'Harbor is full';
  if (f === 'wharf') return o.targets.length ? 'Tap a wharf building' : 'Wharf is full';
  return '';
}

// Dice live in the dock. Elements persist between renders so selection and state changes animate;
// a fresh roll rebuilds them with a tumble that flickers through faces before settling.
const FACES = { boat: E.BOAT_FACES, town: ['harbor', 'wharf', 'market'] };
let diceEls = [], prevBy = [], prevFace = [];
function renderDice(task) {
  const st = s.step, rolled = s.rolls !== ui.lastRolls || diceEls.length !== s.pool.length;
  ui.lastRolls = s.rolls;
  if (rolled) {
    diceEl.innerHTML = s.pool.map((d, i) => `<button class="die ${d.kind}" data-die="${i}"><img src="assets/dice/${d.face}.webp" alt=""></button>`).join('');
    diceEls = [...diceEl.children];
    if (!ui.firstPaint) diceEls.forEach((el, i) => tumble(el, s.pool[i], i));
  }
  const usingIdx = st.k === 'use' ? st.die : null;
  const free = s.pool.filter(x => !x.by).length;
  s.pool.forEach((d, i) => {
    const el = diceEls[i];
    if (!rolled && prevFace[i] !== d.face) tumble(el, d, 0); // casino reroll
    const sharedNow = !d.by && ((st.k === 'use' && st.src === 'shared') || ((st.k === 'rival' || st.k === 'ai') && st.shared) || (free === 1 && st.k !== 'pick'));
    const tag = d.by === 'rival' ? ['rival', 'Rival'] : d.by === 'ai' ? ['rival', 'AI'] : d.by === 'you' && usingIdx !== i ? ['', 'Yours'] : sharedNow ? ['shared', 'Shared'] : null;
    const tagHtml = tag ? `<span class="tag ${tag[0]}">${tag[1]}</span>` : '';
    const old = el.querySelector('.tag');
    if ((old?.outerHTML || '') !== tagHtml) { old?.remove(); if (tagHtml) el.insertAdjacentHTML('beforeend', tagHtml); }
    const can = st.k === 'pick' && !d.by && !task;
    const sel = (st.k === 'pick' && ui.sel === i) || usingIdx === i;
    el.classList.toggle('selected', sel);
    el.classList.toggle('pickable', can && ui.sel == null);
    el.classList.toggle('muted', can && ui.sel != null && !sel);
    el.classList.toggle('taken', !!d.by && usingIdx !== i);
    el.classList.toggle('mine', d.by === 'you');
    el.setAttribute('aria-disabled', String(!can));
    el.setAttribute('aria-pressed', String(sel));
    el.setAttribute('aria-label', `${E.label(d.face)} die${d.by ? `, ${d.by === 'rival' ? 'taken by Rival' : d.by === 'ai' ? 'taken by the AI' : 'yours'}` : ''}`);
    if (!rolled && (d.by === 'rival' || d.by === 'ai') && prevBy[i] !== d.by) replay(el, 'grabbed');
  });
  prevBy = s.pool.map(d => d.by); prevFace = s.pool.map(d => d.face);
}
function replay(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); el.addEventListener('animationend', () => el.classList.remove(cls), { once: true }); }
function tumble(el, die, i) {
  const img = el.querySelector('img'), faces = FACES[die.kind];
  el.style.animationDelay = `${i * 90}ms`;
  el.classList.add('rolling');
  let n = 0;
  const spin = setInterval(() => {
    if (!el.isConnected) return clearInterval(spin);
    img.src = `assets/dice/${faces[(i * 3 + n++) % faces.length]}.webp`;
  }, 75);
  setTimeout(() => {
    clearInterval(spin);
    img.src = `assets/dice/${s.pool[i]?.face || die.face}.webp`;
  }, 420 + i * 90);
  el.addEventListener('animationend', () => { el.classList.remove('rolling'); el.style.animationDelay = ''; }, { once: true });
}
// warm the cache so the tumble never flashes an empty face
for (const f of new Set([...FACES.boat, ...FACES.town])) new Image().src = `assets/dice/${f}.webp`;

function render() {
  renderSheets(); renderDock(); syncTabs(); syncView(); save();
}

// ---------- pages ----------
// Phones in portrait get three tall pages (boats, harbor, wharf); wider screens get the two whole sheets.
// The header and dock float over the sheets; pages pad themselves by the bars' measured heights.
const appEl = $('#app'), topEl = $('#top'), dockEl = $('#dock');
let hud = { top: 52, dock: 120 };
function measureHud() {
  const t = Math.ceil(topEl.getBoundingClientRect().height), d = Math.ceil(dockEl.getBoundingClientRect().height);
  if (t === hud.top && d === hud.dock) return false;
  hud = { top: t, dock: d };
  appEl.style.setProperty('--top-h', `${t}px`); appEl.style.setProperty('--dock-h', `${d}px`);
  return true;
}
function pickSet() {
  const r = stage.getBoundingClientRect(), h = r.height - hud.top - hud.dock;
  return r.width && h > 0 && r.width / h > .78 ? 'wide' : 'phone';
}
function buildPages() {
  const set = pickSet();
  if (set === ui.set) return false;
  const prev = ui.set; ui.set = set;
  layout = PAGE_SETS[set].map(composePage);
  pages.classList.toggle('wide', set === 'wide');
  pages.innerHTML = layout.map(pg => `<section class="page" data-page="${pg.id}" aria-label="${pg.label}"><div class="sheet" style="--ar: ${pg.w} / ${pg.h.toFixed(1)}">${pg.panels.map((p, j) => {
    const [x0, y0, x1, y1] = p.crop, sh = SHEETS[p.sheet];
    return `<div class="panel" style="top:${(p.top / pg.h * 100).toFixed(3)}%;height:${(p.height / pg.h * 100).toFixed(3)}%"><svg viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" data-j="${j}" aria-hidden="true"><image href="${sh.src}" width="${sh.w}" height="${sh.h}" preserveAspectRatio="none"/>${p.cover ? `<rect x="${p.cover[0]}" y="${p.cover[1]}" width="${p.cover[2] - p.cover[0]}" height="${p.cover[3] - p.cover[1]}" fill="${p.cover[4]}"/>` : ''}<g class="marks"></g></svg></div>`;
  }).join('')}</div></section>`).join('');
  panels = [];
  pages.querySelectorAll('.page').forEach((el, i) => el.querySelectorAll('svg').forEach((svg, j) => {
    const p = layout[i].panels[j];
    panels.push({ ...p, page: layout[i].id, svg, marks: svg.querySelector('.marks') });
  }));
  tabsEl.style.setProperty('--n', layout.length);
  tabsEl.innerHTML = '<span class="thumb" aria-hidden="true"></span>' + layout.map(pg => `<button role="tab" data-page="${pg.id}" aria-label="${pg.label}"><img src="assets/dice/${pg.icon}.webp" alt=""><span>${pg.label}</span></button>`).join('');
  if (prev) { // carry the view across a rotation
    if (!layout.some(pg => pg.id === ui.page)) ui.page = ui.page === 'wharf' ? 'harbor' : 'boats';
    ui.firstPaint = true;
  }
  return true;
}
const pageIndex = id => Math.max(0, layout.findIndex(pg => pg.id === id));
// The page that shows a sheet area ([x0, y0, x1, y1] on that sheet).
function pageOf(sheet, [x0, y0, x1, y1]) { return pageAt(layout, sheet, (x0 + x1) / 2, (y0 + y1) / 2)?.id || layout[0].id; }
const secPage = sec => pageOf(SECTION_SHEET[sec], HIT[sec]);

function showPage(id, smooth = true) {
  ui.page = id;
  const el = pages.children[pageIndex(id)];
  if (el) pages.scrollTo({ left: el.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  syncTabs();
}
function syncTabs() {
  const tg = new Set(targets().map(secPage));
  tabsEl.querySelectorAll('button').forEach(b => {
    b.setAttribute('aria-selected', String(b.dataset.page === ui.page));
    b.classList.toggle('has-target', tg.has(b.dataset.page) && b.dataset.page !== ui.page);
  });
  if (!scrolling) tabsEl.style.setProperty('--pos', pageIndex(ui.page));
}
function focusTargets() {
  const t = targets(); if (!t.length || ui.view !== 'you') return;
  const ids = new Set(t.map(secPage));
  if (ids.size === 1) { const only = [...ids][0]; if (only !== ui.page) showPage(only); }
  reveal(ids.has(ui.page) ? ui.page : [...ids][0]);
}
// Scroll a page vertically so its highlighted areas sit in the open space between the bars.
function reveal(id) {
  const el = pages.children[pageIndex(id)];
  if (!el || el.scrollHeight <= el.clientHeight + 2) return;
  const rs = [...el.querySelectorAll('rect.target, circle.choice')].map(r => r.getBoundingClientRect());
  if (!rs.length) return;
  const top = Math.min(...rs.map(r => r.top)), bot = Math.max(...rs.map(r => r.bottom));
  const vTop = hud.top + 6, vBot = window.innerHeight - hud.dock - 6;
  if (top >= vTop && bot <= vBot) return;
  const d = bot - top > vBot - vTop ? top - vTop : (top + bot) / 2 - (vTop + vBot) / 2;
  el.scrollBy({ top: d, behavior: 'smooth' });
}
function ping(id) {
  if (id === ui.page) return;
  const b = tabsEl.querySelector(`button[data-page="${id}"]`); if (!b) return;
  b.classList.remove('ping'); void b.offsetWidth; b.classList.add('ping');
}
// the switcher's thumb follows the finger while swiping
let scrollT, scrolling = false, raf = 0;
pages.addEventListener('scroll', () => {
  scrolling = true;
  if (!raf) raf = requestAnimationFrame(() => { raf = 0; tabsEl.style.setProperty('--pos', (pages.scrollLeft / (pages.clientWidth || 1)).toFixed(3)); });
  clearTimeout(scrollT);
  scrollT = setTimeout(() => {
    scrolling = false;
    const i = Math.round(pages.scrollLeft / (pages.clientWidth || 1));
    const id = layout[i]?.id || layout[0].id;
    if (id !== ui.page) ui.page = id;
    syncTabs();
  }, 80);
}, { passive: true });
tabsEl.addEventListener('click', ev => { const b = ev.target.closest('button[data-page]'); if (b) showPage(b.dataset.page); });
function relayout() {
  const moved = measureHud();
  if (buildPages()) render();
  else if (!moved) return;
  showPage(ui.page, false);
}
window.addEventListener('resize', relayout);
new ResizeObserver(() => { if (measureHud() && buildPages()) { render(); showPage(ui.page, false); } }).observe(dockEl);

// ---------- acting ----------
function doAct(a) {
  const before = JSON.stringify(s), rolls = s.rolls;
  if (!E.act(s, a)) return false;
  history.push(before); if (history.length > 40) history.shift();
  if (s.rolls !== rolls) history = []; // no undoing past fresh dice
  ui.toast = null;
  if (s.step.k !== 'pick') ui.sel = null;
  afterChange();
  return true;
}
function afterChange() {
  if (!infoEl.hidden) { infoEl.hidden = true; ui.hl = null; }
  render();
  focusTargets();
  const t = E.currentTask(s);
  if (t?.t === 'kc') { const id = pageOf('harbor', KC.card); showPage(id); reveal(id); }
  if (t?.t === 'lb' || t?.t === 'oyster') showPage('boats');
  if (s.phase === 'over') onOver();
  pump();
}
function pump() {
  clearTimeout(timer);
  if (!E.isAuto(s)) return;
  const k = s.step.k;
  const delay = { rival: 900, ai: 950, roll: 380, income: 450, fishing: 650, end: 450, next: 120 }[k] ?? 300;
  if (k === 'rival' || k === 'ai') renderDock();
  timer = setTimeout(() => {
    const e = E.auto(s);
    if (!e) return;
    if (e.k === 'roll') { history = []; ui.sel = null; }
    if (e.k === 'rival') {
      const where = e.hits.length ? (e.hits[0][0] === 'coin' ? 'a star on your coin track' : E.label(e.hits[0][0])) : 'nothing';
      ui.toast = `<span class="rival">Rival ${e.shared ? 'used the shared' : 'took'} ${E.label(e.face)} — struck ${where}</span>`;
      if (e.hits.length) { const h = e.hits[0][0]; ping(h === 'coin' ? pageOf('harbor', [0, 1200, 1122, 1360]) : secPage(h)); }
    }
    if (e.k === 'ai') ui.toast = `<span class="rival">AI ${e.shared ? 'used the shared die' : 'took'}: ${e.text}</span>`;
    if (e.k === 'income') ui.toast = `Income +${e.n} coin${e.n > 1 ? 's' : ''}`;
    if (e.k === 'fishing') ui.toast = `Fishing: +${e.n} fish`;
    afterChange();
  }, delay);
}

function onDieTap(ev) {
  const b = ev.target.closest('.die'); if (!b) return;
  const i = +b.dataset.die;
  if (b.getAttribute('aria-disabled') === 'true') { if (s.step.k === 'pick' && !E.currentTask(s)) replay(b, 'wiggle'); return; }
  ui.sel = ui.sel === i ? null : i;
  if (ui.view === 'ai') { ui.view = 'you'; ui.firstPaint = true; syncView(); }
  renderSheets(); renderDock(); syncTabs(); focusTargets();
}
diceEl.addEventListener('click', onDieTap);
// a tap on the sheet that can't be used: point back at what's needed
function nudge() {
  replay(promptEl, 'nudge');
  if (s.step.k === 'pick' && ui.sel == null && !E.currentTask(s)) diceEls.forEach((el, i) => { if (!s.pool[i]?.by) setTimeout(() => replay(el, 'wiggle'), i * 60); });
}

// ---------- long-press info ----------
let pressT = null, pressAt = null, suppressClick = false;
function pressTarget(ev) {
  const die = ev.target.closest?.('.die');
  if (die) return { info: () => dieInfo(s, +die.dataset.die) };
  const svg = ev.target.closest?.('.panel svg'); if (!svg) return null;
  const p = panels.find(q => q.svg === svg); if (!p) return null;
  const [cx0, cy0, cx1, cy1] = p.crop, r = svg.getBoundingClientRect(), k = r.width / (cx1 - cx0);
  const x = cx0 + (ev.clientX - r.left) / k, y = cy0 + (ev.clientY - r.top) / k;
  const reg = regionAt(p.sheet, x, y); if (!reg) return null;
  return { info: () => sheetInfo(viewed() === s ? s : { ...s.bot, round: s.round, phase: s.phase, rounds: s.rounds, fishingDone: s.fishingDone }, reg.ref), hl: { sheet: p.sheet, rect: reg.rect }, bottom: r.top + (Math.min(reg.rect[3], cy1) - cy0) * k };
}
document.addEventListener('pointerdown', ev => {
  clearTimeout(pressT); suppressClick = false;
  if (!ev.isPrimary || ev.button > 0) return;
  if (!infoEl.hidden && !infoEl.contains(ev.target)) { closeInfo(); suppressClick = true; return; }
  const t = pressTarget(ev); if (!t) return;
  pressAt = [ev.clientX, ev.clientY];
  pressT = setTimeout(() => { pressT = null; suppressClick = true; openInfo(t); }, 450);
}, true);
document.addEventListener('pointermove', ev => {
  if (pressT && pressAt && Math.hypot(ev.clientX - pressAt[0], ev.clientY - pressAt[1]) > 10) { clearTimeout(pressT); pressT = null; }
}, true);
for (const type of ['pointerup', 'pointercancel']) document.addEventListener(type, () => { clearTimeout(pressT); pressT = null; }, true);
pages.addEventListener('scroll', () => { clearTimeout(pressT); pressT = null; }, { passive: true, capture: true }); // pages scroll both ways
document.addEventListener('click', ev => { if (suppressClick) { suppressClick = false; ev.stopPropagation(); ev.preventDefault(); } }, true);
document.addEventListener('contextmenu', ev => { if (ev.target.closest('.panel, .die')) ev.preventDefault(); });
function openInfo(t) {
  const info = t.info(); if (!info) return;
  infoEl.innerHTML = `<button class="x" data-close aria-label="Close">×</button><p class="kicker">${info.kicker}</p><h2 id="info-title">${info.title}</h2>${info.body}<p class="hint">Tap anywhere to close · hold any area for help</p>`;
  infoEl.classList.remove('top');
  infoEl.hidden = false;
  if (t.bottom && infoEl.getBoundingClientRect().top < t.bottom) infoEl.classList.add('top'); // don't cover what's being explained
  ui.hl = t.hl || null;
  if (navigator.vibrate) navigator.vibrate(12);
  renderSheets();
}
function closeInfo() {
  if (infoEl.hidden) return;
  infoEl.hidden = true; ui.hl = null; renderSheets();
}
infoEl.addEventListener('click', ev => { if (ev.target.closest('[data-close]')) closeInfo(); });
document.addEventListener('keydown', ev => { if (ev.key === 'Escape') closeInfo(); });

pages.addEventListener('click', ev => {
  if (!ev.target.closest('.panel')) return;
  if (ui.view === 'ai') { replay($('#viewing'), 'nudge'); return; }
  const kc = ev.target.closest('[data-kc]'); if (kc) { doAct({ type: 'kc', choice: kc.dataset.kc }); return; }
  const hit = ev.target.closest('[data-sec]');
  if (!hit) { if (E.currentTask(s)?.t === 'star' || ['pick', 'use'].includes(s.step.k)) nudge(); return; }
  const sec = hit.dataset.sec;
  if (E.currentTask(s)?.t === 'star') doAct({ type: 'star', sec });
  else { const o = currentOptions(); if (o) doAct({ type: 'fill', die: o.die, sec }); }
});
actionsEl.addEventListener('click', ev => {
  const b = ev.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, v = b.dataset.v, o = currentOptions();
  if (a === 'new') return openNew();
  if (a === 'final') return onOver(true);
  if (a === 'skip') return doAct({ type: 'skip' });
  if (a === 'lb') return doAct({ type: 'lb', choice: v });
  if (a === 'kc') return doAct({ type: 'kc', choice: v });
  if (a === 'oyster') return doAct({ type: 'oyster', choice: v });
  if (o) doAct({ type: a, die: o.die });
});
$('#undo-btn').addEventListener('click', () => {
  if (!history.length) return;
  clearTimeout(timer);
  s = JSON.parse(history.pop()); ui.sel = null; ui.toast = null;
  afterChange();
});
$('#menu-btn').addEventListener('click', openMenu);
$('#who-btn').addEventListener('click', () => setView(ui.view === 'ai' ? 'you' : 'ai'));
$('#viewing').addEventListener('click', () => setView('you'));

// ---------- dialogs ----------
function openDlg(html) { dlg.innerHTML = `<div class="dlg">${html}</div>`; if (!dlg.open) dlg.showModal(); }
dlg.addEventListener('click', ev => {
  if (ev.target === dlg) return dlg.close();
  const b = ev.target.closest('[data-m]'); if (!b) return;
  const m = b.dataset.m;
  if (m === 'close') dlg.close();
  if (m === 'rules') openRules();
  if (m === 'new') openNew();
  if (m === 'rival' || m === 'open' || m === 'ai') startNew(m);
  if (m === 'view-ai') { dlg.close(); setView('ai'); }
  if (m === 'view-me') { dlg.close(); setView('you'); }
  if (m === 'menu') openMenu();
});
function openMenu() {
  const b = best();
  openDlg(`<h2>Fishing</h2>
    <p class="muted">Round ${Math.min(s.round, s.rounds)} of ${s.rounds} · ${E.modeName(s.mode)} · You ${E.score(s).total}${vsAI() ? ` · AI ${E.score(s.bot).total}` : ''}</p>
    <div class="menu-list">
      <button data-m="close" class="primary">Resume</button>
      ${vsAI() ? `<button data-m="${ui.view === 'ai' ? 'view-me' : 'view-ai'}">${ui.view === 'ai' ? 'View your sheet' : "View AI player's sheet"} <small>${ui.view === 'ai' ? E.score(s).total : E.score(s.bot).total} pts</small></button>` : ''}
      <button data-m="new">New game</button>
      <button data-m="rules">How to play</button>
      <a href="../../">All games <small>↗</small></a>
    </div>
    <p class="muted" style="margin-top:12px">Best: Solo ${b.rival ?? '—'} · Vs AI ${b.ai ?? '—'} · Free play ${b.open ?? '—'}${b.wins ? ` · Wins vs AI ${b.wins}` : ''}</p>`);
}
function openNew() {
  openDlg(`<h2>New game</h2>
    <div class="menu-list">
      <button data-m="rival" class="primary">Solo <small>vs the Rival · 8 rounds</small></button>
      <button data-m="ai" class="primary">Vs AI player <small>10 rounds</small></button>
      <button data-m="open">Free play <small>no opponent · 10 rounds</small></button>
      <button data-m="${s.phase === 'over' ? 'close' : 'menu'}">Back</button>
    </div>
    <p class="muted" style="margin-top:10px"><b>Solo</b> is the solo game: the Rival grabs dice and strikes boxes on your sheet. <b>Vs AI</b>: a computer player drafts from the same dice and fills its own sheet — tap <b>AI sheet</b> at the top any time to watch it. <b>Free play</b> has no opponent.</p>`);
}
function startNew(mode) {
  clearTimeout(timer);
  s = E.newGame(mode); history = []; ui.sel = null; ui.view = 'you'; ui.toast = `Starting bonus: ${E.label(s.start)} license and boat`;
  ui.firstPaint = true; overShown = false; dlg.close(); showPage('boats', false); afterChange();
}
let overShown = false;
function onOver(force = false) {
  if (!force && overShown) return;
  overShown = true;
  const sc = E.score(s), rows = [['Fish', 'fish'], ['Boats', 'boats'], ['Licenses', 'licenses'], ['Buildings', 'buildings'], ['Bonuses', 'bonus']];
  if (vsAI()) {
    const ai = E.score(s.bot), won = sc.total > ai.total, tie = sc.total === ai.total;
    const isBest = !force && recordBest(sc.total);
    if (!force && won) { const b = best(); b.wins = (b.wins || 0) + 1; try { localStorage.setItem(BEST, JSON.stringify(b)); } catch { } }
    setTimeout(() => openDlg(`<h2>${tie ? "It's a tie!" : won ? 'You win!' : 'The AI wins'}</h2>
      <p class="muted">${sc.total} – ${ai.total}${isBest ? ' · New best!' : ''}</p>
      <table class="score-table vs"><tr class="head"><td></td><td>You</td><td>AI</td></tr>${rows.map(([k, f]) => `<tr><td>${k}</td><td>${sc[f]}</td><td>${ai[f]}</td></tr>`).join('')}<tr class="total"><td>Total</td><td>${sc.total}</td><td>${ai.total}</td></tr></table>
      <div class="menu-list"><button data-m="new" class="primary">Play again</button><button data-m="view-ai">View AI player's sheet</button><button data-m="view-me">View your sheet</button></div>`), force ? 0 : 700);
    return;
  }
  const isBest = recordBest(sc.total) && !force;
  setTimeout(() => openDlg(`<h2>${sc.total} points</h2>
    <p class="muted">${s.mode === 'rival' ? `Solo · ${E.rank(sc.total)}` : 'Free play'}${isBest ? ' · New best!' : ''}</p>
    <table class="score-table">${rows.map(([k, f]) => `<tr><td>${k}</td><td>${sc[f]}</td></tr>`).join('')}<tr class="total"><td>Total</td><td>${sc.total}</td></tr></table>
    <div class="menu-list"><button data-m="new" class="primary">Play again</button><button data-m="close">View sheets</button></div>`), force ? 0 : 700);
}
function openRules() {
  openDlg(`<h2>How to play</h2>
  <p>Score the most points by launching boats, catching fish, earning licenses and finishing wharf buildings. Swipe the sheet (or use the tabs at the top) to flip between your boats, the harbor and the wharf.</p>
  <p><b>Hold any area</b> of a sheet, or any die, to see what it does and what it's worth right now. Your dice sit at the bottom of the screen: tap one to pick it (tap again to put it back) and the sheet jumps to where it can go. A gold dot on a sheet tab means there's somewhere to tap on that page too.</p>
  <h3>Each round</h3>
  <ul>
    <li><b>Boat dice</b> — pick a die and tap its column; the top open box is marked for you. Then everyone uses the last die left over.</li>
    <li><b>Income</b> — 1 coin, plus Lobster license and Canning Co. bonuses (max 10).</li>
    <li><b>Fishing</b> — even rounds only. Every launched boat catches 1 fish. Oyster boats catch 2, or 1 fish plus a coin.</li>
    <li><b>Town dice</b> — Harbor marks any harbor ship, Wharf marks any building, Market pays coins for the fish you've caught.</li>
  </ul>
  <h3>Boxes &amp; circles</h3>
  <ul>
    <li>Always the top open box. Circled boxes trigger: <b>L</b> license, <b>B</b> launch a boat, <b>?</b> your choice, <b>F</b> a private fishing trip.</li>
    <li>A second license of a type pays 2 coins. Third-level licenses score their VP.</li>
    <li>Instead of using a die normally you may take 1 coin for it.</li>
  </ul>
  <h3>Coins &amp; stars</h3>
  <p>Coins fill the track on the harbor sheet. Landing on a ★ gives a star action: mark the top open box of any section.</p>
  <h3>Wharf</h3>
  <p>A building works once its last box is marked: Casino rerolls your chosen die, Bait Shop pays 2 coins per traded die, Salvage Yard turns a die into a star action (3×), Smokehouse adds 2 at the market, Canning Co. adds income per full boat, Seafood Buffet lets a boat die mark a matching hex.</p>
  <h3>The Rival (Solo)</h3>
  <p>The red <b>R</b> pins show where the Rival is heading. Each round it takes one die and strikes the two lowest open boxes in that section (one for the shared die). Market dice strike your next coin-track star. Struck boxes are lost to you. The Rival goes first in even rounds.</p>
  <h3>Versus the AI player</h3>
  <p>The AI drafts from the same dice: it takes one die and you take one (you pick first in odd rounds, the AI in even rounds), then you both use the leftover shared die on your own sheets. It never touches your sheet. Tap <b>AI sheet</b> at the top to look at its sheet and live score at any time; tap it again to come back. Highest total after 10 rounds wins.</p>
  <h3>Final score</h3>
  <p>Fish (1 each), launched boats, licenses, buildings, and your King Crab bonus (max 10). The sheet keeps a live total in the corner.</p>
  <div class="close-row"><button class="act primary" data-m="close">Got it</button></div>`);
}

// ---------- boot ----------
requestAnimationFrame(() => {
  syncView(); measureHud();
  buildPages();
  showPage('boats', false);
  if (s.phase === 'over') overShown = true;
  afterChange();
});
