import * as E from './engine.mjs';
import { SHEETS, CELLS, SECTION_SHEET, HIT, PIN, LICENSE, SHIP, SHIP_H, KC, HEX, SALVAGE_STARS, MARKET_ROWS, MARKET_X, coinPos, TRACK } from './layout.mjs';

const KEY = 'fishing.v1', BEST = 'fishing.best';
const $ = sel => document.querySelector(sel);
const pages = $('#pages'), promptEl = $('#prompt'), diceEl = $('#dice'), actionsEl = $('#actions'), dlg = $('#dlg');
const svgs = { boats: $('.page[data-sheet="boats"] svg'), harbor: $('.page[data-sheet="harbor"] svg') };

let s = load() || E.newGame('rival');
let ui = { sel: null, sheet: 'boats', toast: null, prevMarks: new Set(), firstPaint: true, lastRolls: -1 };
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
  const tg = new Set(targets());
  const task = E.currentTask(s);

  // section boxes
  for (const [sec, cells] of Object.entries(CELLS)) {
    const sh = SECTION_SHEET[sec];
    s.marks[sec].forEach((m, i) => {
      const c = cells[i];
      if (m === 1) out[sh] += xMark(c.x, c.y, c.r, 'ink', `${sec}:${i}`);
      else if (m === 2) out[sh] += strikeMark(c.x, c.y, c.r, `${sec}:${i}:x`);
    });
  }
  // licenses
  E.TYPES.forEach(t => {
    const circles = LICENSE.circles[t];
    circles.forEach(([x, y], lvl) => {
      if (s.lic[t] > lvl) out.boats += xMark(x, y, 11, 'ink', `lic:${t}:${lvl}`);
      else { const [y0, y1] = LICENSE.cards[lvl]; out.boats += rect('dim', x - 14, y0, x + 192, y1, 12); }
    });
  });
  // boats & fish
  for (const [type, spec] of Object.entries(SHIP)) {
    const sh = spec.box[2], cap = type === 'oyster' ? E.capacity(s, 'oyster') : E.SHIPS[type].cap;
    s.ships[type].forEach((b, i) => {
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
  if (s.kc.on) out.harbor += xMark(KC.circle[0], KC.circle[1], 11, 'ink', 'kc');
  else out.harbor += rect('dim', ...KC.card, 12);
  if (s.kc.bonus) { const [x, y] = KC.bonus[s.kc.bonus]; out.harbor += xMark(x, y, 13, 'ink', 'kcb'); }
  if (task?.t === 'kc') for (const [k, [x, y]] of Object.entries(KC.bonus)) out.harbor += `<circle class="choice" data-kc="${k}" cx="${x}" cy="${y}" r="20"/>`;
  // buffet hexes, salvage stars
  E.HEXES.forEach((t, i) => { if (s.hexes[t]) out.harbor += xMark(HEX.x, HEX.ys[i], 13, 'ink', `hex:${t}`); });
  SALVAGE_STARS.forEach(([x, y], i) => { if (s.salvageUses > i) out.harbor += xMark(x, y, 11, 'ink', `salv:${i}`); });
  // market bracket
  const fish = E.totalFish(s), row = MARKET_ROWS.find(([min]) => fish >= min);
  out.harbor += rect('market-row', MARKET_X[0], row[1] - 16, MARKET_X[1], row[1] + 16, 8);
  // coin track
  const nextCoin = s.coins.indexOf(0);
  s.coins.forEach((c, i) => {
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
  const sc = E.score(s);
  [sc.fish, sc.boats, sc.licenses, sc.buildings, sc.bonus, sc.total].forEach((v, i) => {
    out.boats += `<text class="score-val${i === 5 ? ' total' : ''}" x="${TRACK.score.x}" y="${TRACK.score.ys[i]}">${v}</text>`;
  });
  // rival tokens
  if (s.mode === 'rival' && s.phase !== 'over') {
    for (const kind of ['boat', 'harbor', 'wharf']) {
      const sec = s.tokens[kind], [x, y] = PIN[sec];
      out[SECTION_SHEET[sec]] += `<g class="pin"><circle cx="${x}" cy="${y}" r="14"/><text x="${x}" y="${y + 1}">R</text></g>`;
    }
  }
  // targets & hit areas
  for (const sec of tg) {
    const sh = SECTION_SHEET[sec], [x0, y0, x1, y1] = HIT[sec];
    out[sh] += rect('target', x0, y0, x1, y1, 16);
    const i = E.openIdx(s, sec); if (i >= 0) { const c = CELLS[sec][i]; out[sh] += `<circle class="next" cx="${c.x}" cy="${c.y}" r="${c.r + 7}"/>`; }
  }
  for (const sec of tg) { const [x0, y0, x1, y1] = HIT[sec]; out[SECTION_SHEET[sec]] += rect('hit', x0, y0, x1, y1, 16, `data-sec="${sec}"`); }

  svgs.boats.innerHTML = out.boats;
  svgs.harbor.innerHTML = out.harbor;
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
  const rolled = s.rolls !== ui.lastRolls; ui.lastRolls = s.rolls;
  // dice
  const usingIdx = st.k === 'use' ? st.die : null;
  diceEl.innerHTML = s.pool.map((d, i) => {
    const sharedNow = !d.by && (st.k === 'use' && st.src === 'shared' || (st.k === 'rival' && st.shared));
    let tag = '';
    if (d.by === 'rival') tag = '<span class="tag rival">Rival</span>';
    else if (d.by === 'you' && usingIdx !== i) tag = '<span class="tag">Yours</span>';
    else if (sharedNow || (!d.by && s.pool.filter(x => !x.by).length === 1 && st.k !== 'pick')) tag = '<span class="tag shared">Shared</span>';
    const sel = (st.k === 'pick' && ui.sel === i) || usingIdx === i;
    const taken = d.by && usingIdx !== i;
    const can = st.k === 'pick' && !d.by && !task;
    return `<button class="die ${d.kind}${sel ? ' selected' : ''}${taken ? ' taken' : ''}${d.by === 'you' ? ' mine' : ''}${rolled ? ' rolling' : ''}" data-die="${i}" ${can ? '' : 'disabled'} aria-label="${E.label(d.face)} die" style="animation-delay:${i * 70}ms">${faceImg(d.face)}${tag}</button>`;
  }).join('');

  // prompt + actions
  const head = s.phase === 'over' ? 'Game over' : `Round ${s.round}/${s.rounds} · ${phaseName()}`;
  let msg = '', acts = [];
  const btn = (label, data, cls = '') => acts.push(`<button class="act ${cls}" ${data}>${label}</button>`);
  if (s.phase === 'over') {
    const sc = E.score(s);
    msg = `Final score ${sc.total}${s.mode === 'rival' ? ` — ${E.rank(sc.total)}` : ''}`;
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
  promptEl.innerHTML = `${msg}${sub}`;
  actionsEl.innerHTML = acts.join('');
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

function render() {
  renderSheets(); renderDock(); syncTabs(); save();
}

// ---------- sheet switching ----------
function showSheet(name, smooth = true) {
  ui.sheet = name;
  const page = pages.querySelector(`.page[data-sheet="${name}"]`);
  pages.scrollTo({ left: page.offsetLeft, behavior: smooth ? 'smooth' : 'auto' });
  syncTabs();
}
function syncTabs() {
  document.querySelectorAll('#tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.sheet === ui.sheet)));
}
function focusTargets() {
  const t = targets(); if (!t.length) return;
  const sheets = new Set(t.map(k => SECTION_SHEET[k]));
  if (sheets.size === 1) { const only = [...sheets][0]; if (only !== ui.sheet) showSheet(only); }
}
function ping(sheet) {
  if (sheet === ui.sheet) return;
  const b = document.querySelector(`#tabs button[data-sheet="${sheet}"]`);
  b.classList.remove('ping'); void b.offsetWidth; b.classList.add('ping');
}
let scrollT;
pages.addEventListener('scroll', () => {
  clearTimeout(scrollT);
  scrollT = setTimeout(() => {
    const i = Math.round(pages.scrollLeft / pages.clientWidth);
    const name = ['boats', 'harbor'][i] || 'boats';
    if (name !== ui.sheet) { ui.sheet = name; syncTabs(); }
  }, 60);
}, { passive: true });
document.querySelectorAll('#tabs button').forEach(b => b.addEventListener('click', () => showSheet(b.dataset.sheet)));
window.addEventListener('resize', () => showSheet(ui.sheet, false));

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
  render();
  focusTargets();
  const t = E.currentTask(s);
  if (t?.t === 'kc') showSheet('harbor');
  if (t?.t === 'lb' || t?.t === 'oyster') showSheet('boats');
  if (s.phase === 'over') onOver();
  pump();
}
function pump() {
  clearTimeout(timer);
  if (!E.isAuto(s)) return;
  const k = s.step.k;
  const delay = { rival: 900, roll: 380, income: 450, fishing: 650, end: 450, next: 120 }[k] ?? 300;
  if (k === 'rival') renderDock();
  timer = setTimeout(() => {
    const e = E.auto(s);
    if (!e) return;
    if (e.k === 'roll') { history = []; ui.sel = null; }
    if (e.k === 'rival') {
      const where = e.hits.length ? (e.hits[0][0] === 'coin' ? 'a star on your coin track' : E.label(e.hits[0][0])) : 'nothing';
      ui.toast = `<span class="rival">Rival ${e.shared ? 'used the shared' : 'took'} ${E.label(e.face)} — struck ${where}</span>`;
      const sheet = e.hits.length ? (e.hits[0][0] === 'coin' ? 'harbor' : SECTION_SHEET[e.hits[0][0]]) : null;
      if (sheet) ping(sheet);
    }
    if (e.k === 'income') ui.toast = `Income +${e.n} coin${e.n > 1 ? 's' : ''}`;
    if (e.k === 'fishing') ui.toast = `Fishing: +${e.n} fish`;
    afterChange();
  }, delay);
}

diceEl.addEventListener('click', ev => {
  const b = ev.target.closest('.die'); if (!b || b.disabled) return;
  const i = +b.dataset.die;
  if (s.step.k !== 'pick') return;
  ui.sel = ui.sel === i ? null : i;
  renderSheets(); renderDock(); focusTargets();
});
for (const svg of Object.values(svgs)) {
  svg.addEventListener('click', ev => {
    const kc = ev.target.closest('[data-kc]'); if (kc) { doAct({ type: 'kc', choice: kc.dataset.kc }); return; }
    const hit = ev.target.closest('[data-sec]'); if (!hit) return;
    const sec = hit.dataset.sec;
    if (E.currentTask(s)?.t === 'star') doAct({ type: 'star', sec });
    else { const o = currentOptions(); if (o) doAct({ type: 'fill', die: o.die, sec }); }
  });
}
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

// ---------- dialogs ----------
function openDlg(html) { dlg.innerHTML = `<div class="dlg">${html}</div>`; if (!dlg.open) dlg.showModal(); }
dlg.addEventListener('click', ev => {
  if (ev.target === dlg) return dlg.close();
  const b = ev.target.closest('[data-m]'); if (!b) return;
  const m = b.dataset.m;
  if (m === 'close') dlg.close();
  if (m === 'rules') openRules();
  if (m === 'new') openNew();
  if (m === 'rival' || m === 'open') startNew(m);
  if (m === 'menu') openMenu();
});
function openMenu() {
  const b = best();
  openDlg(`<h2>Fishing</h2>
    <p class="muted">Round ${Math.min(s.round, s.rounds)} of ${s.rounds} · ${s.mode === 'rival' ? 'vs Rival' : 'Solo'} · ${E.score(s).total} pts</p>
    <div class="menu-list">
      <button data-m="close" class="primary">Resume</button>
      <button data-m="new">New game</button>
      <button data-m="rules">How to play</button>
      <a href="../../">All games <small>↗</small></a>
    </div>
    <p class="muted" style="margin-top:12px">Best: vs Rival ${b.rival ?? '—'} · Solo ${b.open ?? '—'}</p>`);
}
function openNew() {
  openDlg(`<h2>New game</h2>
    <div class="menu-list">
      <button data-m="rival" class="primary">Versus Rival <small>8 rounds</small></button>
      <button data-m="open">Solo waters <small>10 rounds</small></button>
      <button data-m="${s.phase === 'over' ? 'close' : 'menu'}">Back</button>
    </div>
    <p class="muted" style="margin-top:10px">The Rival grabs dice and strikes boxes on your sheet. Solo waters has no Rival and two more rounds.</p>`);
}
function startNew(mode) {
  clearTimeout(timer);
  s = E.newGame(mode); history = []; ui.sel = null; ui.toast = `Starting bonus: ${E.label(s.start)} license and boat`;
  ui.firstPaint = true; overShown = false; dlg.close(); showSheet('boats', false); afterChange();
}
let overShown = false;
function onOver(force = false) {
  if (!force && overShown) return;
  overShown = true;
  const sc = E.score(s), isBest = recordBest(sc.total) && !force;
  const rows = [['Fish', sc.fish], ['Boats', sc.boats], ['Licenses', sc.licenses], ['Buildings', sc.buildings], ['Bonuses', sc.bonus]];
  setTimeout(() => openDlg(`<h2>${sc.total} points</h2>
    <p class="muted">${s.mode === 'rival' ? E.rank(sc.total) : 'Solo waters'}${isBest ? ' · New best!' : ''}</p>
    <table class="score-table">${rows.map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}<tr class="total"><td>Total</td><td>${sc.total}</td></tr></table>
    <div class="menu-list"><button data-m="new" class="primary">Play again</button><button data-m="close">View sheets</button></div>`), force ? 0 : 700);
}
function openRules() {
  openDlg(`<h2>How to play</h2>
  <p>Score the most points by launching boats, catching fish, earning licenses and finishing wharf buildings. Swipe the sheet (or use the two tabs) to flip between your boats and the harbor &amp; wharf.</p>
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
  <h3>The Rival</h3>
  <p>The red <b>R</b> pins show where the Rival is heading. Each round it takes one die and strikes the two lowest open boxes in that section (one for the shared die). Market dice strike your next coin-track star. Struck boxes are lost to you. The Rival goes first in even rounds.</p>
  <h3>Final score</h3>
  <p>Fish (1 each), launched boats, licenses, buildings, and your King Crab bonus (max 10). The sheet keeps a live total in the corner.</p>
  <div class="close-row"><button class="act primary" data-m="close">Got it</button></div>`);
}

// ---------- boot ----------
requestAnimationFrame(() => {
  showSheet('boats', false);
  if (s.phase === 'over') overShown = true;
  afterChange();
});
