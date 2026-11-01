import * as E from './engine.mjs';
import { regionAt, sheetInfo, dieInfo, LIC_TEXT, kcValues, BUILDING_LINE } from './info.mjs';
import { SHEETS, CELLS, SECTION_SHEET, HIT, PIN, LICENSE, SHIP, SHIP_H, KC, HEX, SALVAGE_STARS, MARKET_ROWS, MARKET_X, coinPos, TRACK, PAGE_SETS, composePage, pageAt } from './layout.mjs';
import { moments, nextStarIn, nextRank } from './moments.mjs';
import { prefs, setPref, haptic, play, banner, busyFor, clearBanners, floater, countUp, confetti, reduced } from './fx.mjs';
import { OPPONENT, rivalLine, aiLine } from './people.mjs';

const KEY = 'fishing.v1', BEST = 'fishing.best';
const $ = sel => document.querySelector(sel);
const pages = $('#pages'), stage = $('#stage'), tabsEl = $('#tabs'), promptEl = $('#prompt'), diceEl = $('#dice'), controlsEl = $('#controls'), infoEl = $('#info'), actionsEl = $('#actions'), dlg = $('#dlg');
const oppEl = $('#opp'), bubbleEl = $('#bubble'), whoEl = $('#who'), titleEl = $('#title'), coachEl = $('#coach');
const newsEl = $('#news'), choicesEl = $('#choices'), scoreChip = $('#st-score'), coinChip = $('#st-coins'), roundChip = $('#st-round');

const hadSave = !!load();
let s = load() || E.newGame('rival');
let ui = { view: 'you', sel: null, page: 'boats', set: null, prevMarks: new Set(), firstPaint: true, lastRolls: -1, hl: null, lastMsg: '', title: true, coach: null, flash: null, holdUntil: 0, hudVals: null, choiceKey: null };
let layout = [], panels = []; // composed pages of the current set, and every rendered panel
let history = [], timer = null;

// ---------- persistence ----------
function load() { try { const v = JSON.parse(localStorage.getItem(KEY)); return E.validSave(v) ? v : null; } catch { return null; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable */ } }
function best() { try { return JSON.parse(localStorage.getItem(BEST)) || {}; } catch { return {}; } }
function recordBest(total) { const b = best(); if (!(b[s.mode] >= total)) { b[s.mode] = total; try { localStorage.setItem(BEST, JSON.stringify(b)); } catch { } return true; } return false; }

// ---------- helpers ----------
// Fresh marks pop in. Marks in a stagger group (fish caught, coins gained) pop one after another.
const STAGGER = { fish: 140, coin: 70 };
const xMark = (x, y, r, cls = 'ink', key = '', group = '') => {
  const d = r * .78, isFresh = key && !ui.prevMarks.has(key) && !ui.firstPaint;
  if (key) ui.nextMarks.add(key);
  let extra = '';
  if (isFresh && group) {
    const ms = ui.stagger[group]++ * STAGGER[group];
    extra = ` style="animation-delay:${ms}ms"`;
    if (group === 'fish') extra += `/><circle class="ripple" cx="${x}" cy="${y}" r="${r}" style="animation-delay:${ms}ms"`;
  }
  return `<path class="${cls}${isFresh ? ' fresh' : ''}" d="M${x - d} ${y - d}L${x + d} ${y + d}M${x + d} ${y - d}L${x - d} ${y + d}"${extra}/>`;
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
  if (!infoEl.hidden) { infoEl.hidden = true; ui.hl = null; }
  play('sheet');
  const swap = () => { ui.view = v; ui.firstPaint = true; ui.hudVals = null; render(); if (v === 'you') focusTargets(); };
  syncSeg(v);
  if (reduced()) return swap();
  // turn the sheet over like a card: out to the edge, swap, back in
  stage.classList.remove('flip-in'); stage.classList.add('flip-out');
  setTimeout(() => { swap(); stage.classList.remove('flip-out'); void stage.offsetWidth; stage.classList.add('flip-in'); setTimeout(() => stage.classList.remove('flip-in'), 260); }, 170);
}
function syncSeg(v = ui.view) {
  whoEl.classList.toggle('on-ai', v === 'ai');
  whoEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
}
function syncView() {
  const on = vsAI();
  whoEl.hidden = !on;
  document.body.classList.toggle('vs-ai', on);
  document.body.classList.toggle('viewing-ai', on && ui.view === 'ai');
  if (!on) return;
  const me = E.score(s).total, ai = E.score(s.bot).total;
  const [youB, aiB] = whoEl.querySelectorAll('b');
  if (+youB.textContent !== me) { if (ui.hudVals) countUp(youB, me, { from: +youB.textContent }); else youB.textContent = me; }
  if (+aiB.textContent !== ai) { if (ui.hudVals) countUp(aiB, ai, { from: +aiB.textContent }); else aiB.textContent = ai; }
  whoEl.querySelector('[data-view="you"]').setAttribute('aria-label', `Your sheet, ${me} points`);
  whoEl.querySelector('[data-view="ai"]').setAttribute('aria-label', `AI player's sheet, ${ai} points`);
  syncSeg();
}
// Where "+VP" floaters land: your score chip, or your half of the You | AI toggle.
const scoreTarget = () => vsAI() ? whoEl.querySelector('[data-view="you"]') : scoreChip;
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
  ui.nextMarks = new Set(); ui.stagger = { fish: 0, coin: 0 };
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
        if (k < b.fish) out[sh] += xMark(f.x, f.y, 10, 'ink sm', `fish:${type}:${i}:${k}`, 'fish');
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
  // coin track: new coins fill box by box, and a ★ that was landed on lights up
  const nextCoin = v.coins.indexOf(0);
  v.coins.forEach((c, i) => {
    const { x, y } = coinPos(i);
    if (c === 1) {
      const key = `coin:${i}`, fresh = !ui.prevMarks.has(key) && !ui.firstPaint, at = ui.stagger.coin * STAGGER.coin;
      out.harbor += xMark(x, y, 10, 'ink sm', key, 'coin');
      if (fresh && E.STAR_BOXES.has(i)) out.harbor += `<circle class="star-glow" cx="${x}" cy="${y}" r="16" style="animation-delay:${at}ms"/>`;
    } else if (c === 2) out.harbor += strikeMark(x, y, 10, `coin:${i}:x`);
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

  // boxes the Rival just struck pulse for a moment
  if (ui.flash && mine && performance.now() < ui.flash.until) for (const [sec, i] of ui.flash.hits) {
    if (sec === 'coin') { const { x, y } = coinPos(i); out.harbor += `<circle class="flash" cx="${x}" cy="${y}" r="17"/>`; }
    else { const c = CELLS[sec][i]; out[SECTION_SHEET[sec]] += `<circle class="flash" cx="${c.x}" cy="${c.y}" r="${c.r + 9}"/>`; }
  }
  if (ui.hl) { const [x0, y0, x1, y1] = ui.hl.rect; out[ui.hl.sheet] += rect('info-hl', x0, y0, x1, y1, 14); }
  for (const p of panels) p.marks.innerHTML = out[p.sheet];
  ui.prevMarks = ui.nextMarks; ui.firstPaint = false;
}

// ---------- status strip: score, coins, rounds ----------
const FISH_PIP = '<svg viewBox="0 0 12 8"><path d="M1 4c2-3 6-3 8 0l2-2v4l-2-2c-2 3-6 3-8 0z"/></svg>';
function renderStatus(delay = 0) {
  const v = viewed(), total = E.score(v).total, coins = E.coinCount(v), star = nextStarIn(v);
  const prev = ui.hudVals;
  ui.hudVals = { total, coins };
  const scoreB = scoreChip.querySelector('b'), coinB = coinChip.querySelector('b');
  if (!prev) { scoreB.textContent = total; coinB.textContent = coins; }
  else {
    const go = () => { countUp(scoreB, total, { from: prev.total }); countUp(coinB, coins, { from: prev.coins }); };
    if (delay && !reduced()) setTimeout(go, delay); else go();
  }
  scoreChip.setAttribute('aria-label', `${ui.view === 'ai' ? 'AI score' : 'Score'} ${total}`);
  coinChip.querySelector('.sub').textContent = star ? `★ in ${star}` : '';
  coinChip.setAttribute('aria-label', `${coins} coins${star ? `, next star in ${star}` : ''}`);
  const over = s.phase === 'over';
  roundChip.querySelector('.lbl').innerHTML = over ? '<b>Final</b>' : `<i>Round </i><b>${s.round}</b>/${s.rounds}`;
  roundChip.setAttribute('aria-label', over ? 'Game over' : `Round ${s.round} of ${s.rounds}${s.round % 2 === 0 ? ', a fishing round' : ''}`);
  const pips = Array.from({ length: s.rounds }, (_, i) => {
    const r = i + 1, cls = over || r < s.round ? 'done' : r === s.round ? 'cur' : '';
    return `<span class="pip ${cls}${r % 2 === 0 ? ' fish' : ''}">${r % 2 === 0 ? FISH_PIP : ''}</span>`;
  }).join('');
  const pipsEl = roundChip.querySelector('.pips');
  if (pipsEl.innerHTML !== pips) pipsEl.innerHTML = pips;
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
  renderChoices(task);
  renderOpp();
  // the status line stays put; news has its own place above the dock
  const head = s.phase === 'over' ? `Game over · ${E.modeName(s.mode)}` : `Round ${s.round}/${s.rounds} · ${phaseName()} dice`.replace('Income dice', 'Income').replace('Fishing dice', 'Fishing');
  let msg = '', acts = [];
  const btn = (label, data, cls = '') => acts.push(`<button class="act ${cls}" ${data}>${label}</button>`);
  if (s.phase === 'over') {
    const sc = E.score(s);
    if (vsAI()) { const ai = E.score(s.bot).total; msg = sc.total > ai ? `You win ${sc.total}–${ai}!` : sc.total < ai ? `AI wins ${ai}–${sc.total}` : `Tie at ${sc.total}`; }
    else msg = `Final score ${sc.total}${s.mode === 'rival' ? ` — ${E.rank(sc.total)}` : ''}`;
    btn('Score', 'data-a="final"', 'ghost'); btn('New game', 'data-a="new"', 'primary');
  } else if (task) {
    if (task.t === 'star') { msg = '★ Star action — tap any highlighted section'; btn('Skip', 'data-a="skip"', 'ghost'); }
    else if (task.t === 'lb') msg = `${E.label(task.type)}: license or boat?`;
    else if (task.t === 'kc') msg = 'King Crab license — choose your bonus';
    else if (task.t === 'oyster') msg = `Oyster boat ${task.boat + 1}: what's the catch?`;
  } else if (st.k === 'pick') {
    msg = o ? useMsg(o) : 'Pick a die';
  } else if (st.k === 'use') {
    msg = (st.src === 'shared' ? 'Shared die — ' : '') + useMsg(o);
  } else if (st.k === 'rival') {
    msg = `<span class="rival">Rival is choosing…</span>`;
  } else if (st.k === 'ai') {
    msg = `<span class="rival">AI is choosing${st.shared ? ' how to use the shared die' : ' a die'}…</span>`;
  } else if (st.k === 'roll') msg = 'Rolling the dice…';
  else if (st.k === 'income') msg = 'Collecting income…';
  else if (st.k === 'fishing') msg = 'Boats are out fishing…';
  else msg = coachHolds() ? 'Tour — tap <b>Next</b> to carry on' : ui.lastMsg;
  if (!coachHolds()) ui.lastMsg = msg;
  if (o) {
    if (o.coins) btn(`${faceImg('coins')} +3 coins`, 'data-a="coins"', 'primary');
    if (o.market) btn(`${faceImg('market')} +${o.market} coins`, 'data-a="market"', 'primary');
    if (o.hex) btn(`Buffet: ${E.label(o.hex)}`, 'data-a="hex"');
    if (o.salvage) btn('Salvage ★', 'data-a="salvage"');
    if (o.reroll) btn('Reroll', 'data-a="reroll"');
    if (o.cash) btn(`Take ${o.cash} coin${o.cash > 1 ? 's' : ''}`, 'data-a="cash"', 'ghost');
  }
  promptEl.innerHTML = `<b>${msg}</b><small>${head}</small>`;
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

// ---------- decision cards ----------
// License-or-boat, the King Crab bonus and oyster catches are shown as cards that say what each choice is worth now.
const card = (data, { icon = '', title, sub = '', text = '', perk = '', best = false }) =>
  `<button class="choice-card${best ? ' best' : ''}" ${data}>${best ? '<span class="flag">Best now</span>' : ''}${icon ? `<span class="c-icon">${icon}</span>` : ''}<b>${title}</b>${sub ? `<small>${sub}</small>` : ''}${text ? `<span class="c-text">${text}</span>` : ''}${perk ? `<span class="perk">${perk}</span>` : ''}</button>`;
function renderChoices(task) {
  const show = task && ['lb', 'kc', 'oyster'].includes(task.t) && ui.view === 'you';
  const key = show ? JSON.stringify([task, s.lic, E.totalFish(s)]) : null;
  if (key === ui.choiceKey) return;
  ui.choiceKey = key;
  const above = $('#above-dock');
  if (!show) { choicesEl.hidden = true; choicesEl.innerHTML = ''; above.classList.remove('over-tray'); document.body.classList.remove('choosing'); return; }
  above.classList.add('over-tray'); document.body.classList.add('choosing');
  let html = '';
  if (task.t === 'lb') {
    const t = task.type, lvl = s.lic[t], n = E.launched(s, t), vp = E.SHIPS[t].vp;
    html = card('data-a="lb" data-v="L"', {
      icon: faceImg(t), title: 'License', sub: `${E.label(t)} level ${lvl + 1} of 3`, text: LIC_TEXT[t][lvl],
      perk: lvl + 1 === 2 ? '+2 coins now' : lvl + 1 === 3 ? `+${E.LICENSE_VP[t]} VP` : 'New ability',
    }) + card('data-a="lb" data-v="B"', {
      icon: faceImg(t), title: 'Boat', sub: `${E.label(t)} boat ${n + 1} of 3`,
      text: `Catches ${t === 'oyster' ? '2 fish (or 1 + a bonus)' : '1 fish'} every Fishing phase.`,
      perk: `+${vp} VP${s.lic.cod ? ` · +${s.lic.cod} coin${s.lic.cod > 1 ? 's' : ''}` : ''}`,
    });
  } else if (task.t === 'kc') {
    const vals = kcValues(s), top = Math.max(...Object.values(vals).map(v => Math.min(10, v)));
    const names = { building: ['2 VP', 'per finished building'], fish: ['1 VP', 'per 6 fish'], license: ['1 VP', 'per license level'], coins: ['1 VP', 'per 10 coins'] };
    html = E.KC_BONUS.map(k => card(`data-a="kc" data-v="${k}"`, { title: names[k][0], sub: names[k][1], perk: `${Math.min(10, vals[k])} VP now`, best: top > 0 && Math.min(10, vals[k]) === top })).join('');
  } else if (task.t === 'oyster') {
    const b = s.ships.oyster[task.boat], room = E.capacity(s, 'oyster') - b.fish, star = s.lic.oyster === 3;
    html = card('data-a="oyster" data-v="fish"', { icon: faceImg('oyster'), title: `${Math.min(2, room)} fish`, sub: `Boat ${task.boat + 1}: ${b.fish}/${E.capacity(s, 'oyster')} fish`, perk: `+${Math.min(2, room)} VP` })
      + card('data-a="oyster" data-v="bonus"', { icon: star ? '<span class="glyph">★</span>' : faceImg('coins'), title: `1 fish + ${star ? '★' : 'coin'}`, sub: star ? 'and a star action' : 'and a coin on the track', perk: `+1 VP · ${star ? '★ action' : '+1 coin'}` });
  }
  const q = task.t === 'lb' ? `${E.label(task.type)}: license or boat?` : task.t === 'kc' ? 'King Crab license — choose your bonus' : `Oyster boat ${task.boat + 1}: what's the catch?`;
  choicesEl.className = `n${task.t === 'kc' ? 4 : 2}`;
  choicesEl.setAttribute('aria-label', q);
  choicesEl.innerHTML = `<p class="choices-q">${q}</p>${html}`;
  choicesEl.hidden = false;
}

// ---------- news ----------
// Short-lived news about what just happened (Rival moves, income, fishing) — the status line never changes for it.
let newsT = null;
function news(html, kind = '') {
  newsEl.innerHTML = html; newsEl.className = kind; newsEl.hidden = false;
  replay(newsEl, 'in');
  clearTimeout(newsT); newsT = setTimeout(() => { newsEl.classList.add('out'); newsT = setTimeout(() => { newsEl.hidden = true; newsEl.classList.remove('out'); }, 260); }, 3200);
}
function clearNews() { clearTimeout(newsT); newsEl.hidden = true; }

// ---------- the opponent's seat ----------
// The Rival or the AI sits at the left of the dock: it fidgets while choosing, dice fly to it, and it
// says what it did in a speech bubble — with a button to see the boxes it struck on another page.
const oppKind = () => s.mode === 'rival' ? 'rival' : vsAI() ? 'ai' : null;
function renderOpp() {
  const who = oppKind();
  oppEl.hidden = !who; document.body.classList.toggle('has-opp', !!who);
  if (!who) { bubbleEl.hidden = true; return; }
  if (oppEl.dataset.who !== who) {
    oppEl.dataset.who = who;
    oppEl.querySelector('.face').innerHTML = OPPONENT[who].face;
    oppEl.querySelector('.name').textContent = OPPONENT[who].name;
  }
  const thinking = (s.step.k === 'rival' || s.step.k === 'ai') && s.phase !== 'over';
  oppEl.classList.toggle('thinking', thinking);
  oppEl.setAttribute('aria-label', `${OPPONENT[who].name}${thinking ? ', choosing' : ''}`);
}
let sayT = null;
function say(html, { show = null, see = false } = {}) {
  const btn = show ? `<button class="say-btn" data-show="${show}">Show me</button>` : see ? '<button class="say-btn" data-see>See its sheet</button>' : '';
  bubbleEl.innerHTML = `<div class="say-text">${html}</div>${btn}`;
  bubbleEl.className = oppKind() || ''; bubbleEl.hidden = false;
  replay(bubbleEl, 'in');
  clearTimeout(sayT);
  sayT = setTimeout(() => { bubbleEl.classList.add('out'); sayT = setTimeout(() => { bubbleEl.hidden = true; bubbleEl.classList.remove('out'); }, 260); }, btn ? 4400 : 3400);
}
function hush() { clearTimeout(sayT); bubbleEl.hidden = true; }
bubbleEl.addEventListener('click', ev => {
  const show = ev.target.closest('[data-show]'), see = ev.target.closest('[data-see]');
  if (show) {
    haptic(); play('tap');
    if (ui.view !== 'you') setView('you');
    showPage(show.dataset.show);
    if (ui.lastHits) { ui.flash = { hits: ui.lastHits, until: performance.now() + 2600 }; renderSheets(); setTimeout(() => { ui.flash = null; renderSheets(); }, 2700); }
    show.remove();
  }
  if (see) { haptic(); setView('ai'); see.remove(); }
});
// The engine's short move text ("Cod → King Crab") as a sentence.
function aiDid(t) {
  const m = /→ (.+)$/.exec(t);
  if (m) return `Marked a box in its ${m[1]}${E.TYPES.some(x => E.label(x) === m[1]) ? ' column' : ''}`;
  return t[0].toUpperCase() + t.slice(1);
}
// The die the opponent took flies from the tray into its portrait.
function flyDie(i) {
  const el = diceEls[i], face = oppEl.querySelector('.face');
  if (!el || oppEl.hidden || reduced()) return;
  const a = el.getBoundingClientRect(), b = face.getBoundingClientRect();
  if (!a.width || !b.width) return;
  const c = el.cloneNode(true);
  c.className = `die ${s.pool[i]?.kind || ''} flying`; c.removeAttribute('data-die'); c.querySelector('.tag')?.remove();
  Object.assign(c.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px` });
  document.body.append(c);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
  c.animate([
    { transform: 'none' },
    { transform: `translate(${dx * .55}px, ${dy * .55 - 46}px) rotate(-140deg) scale(.85)`, offset: .55 },
    { transform: `translate(${dx}px, ${dy}px) rotate(-250deg) scale(.32)`, opacity: .3 },
  ], { duration: 540, easing: 'cubic-bezier(.45, 0, .55, 1)' }).onfinish = () => { c.remove(); replay(oppEl, 'gloat'); };
  play('pick');
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
    if (!ui.firstPaint && s.pool.length) { diceEls.forEach((el, i) => tumble(el, s.pool[i], i)); play('rattle', s.pool.length); }
  }
  const usingIdx = st.k === 'use' ? st.die : null;
  const free = s.pool.filter(x => !x.by).length;
  s.pool.forEach((d, i) => {
    const el = diceEls[i];
    if (!rolled && prevFace[i] !== d.face) { tumble(el, d, 0); play('rattle', 1); } // casino reroll
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

function render(statusDelay = 0) {
  renderSheets(); renderDock(); syncTabs(); syncView(); renderStatus(statusDelay); save(); coachSync();
}
// Automatic turns wait while a sheet, the title screen or a tour card that needs reading is up.
const paused = () => dlg.open || ui.title || coachHolds();

// ---------- pages ----------
// Phones in portrait get three tall pages (boats, harbor, wharf); wider screens get the two whole sheets.
// The header and dock float over the sheets; pages pad themselves by the bars' measured heights.
const appEl = $('#app'), topEl = $('#top'), dockEl = $('#dock');
let hud = { top: 52, dock: 120 };
function measureHud() {
  const t = Math.ceil(topEl.getBoundingClientRect().height), d = Math.ceil(dockEl.getBoundingClientRect().height);
  const tray = controlsEl.getBoundingClientRect();
  if (tray.height) appEl.style.setProperty('--tray-bottom', `${Math.round(appEl.getBoundingClientRect().bottom - tray.bottom + 6)}px`);
  if (t === hud.top && d === hud.dock) return false;
  hud = { top: t, dock: d };
  appEl.style.setProperty('--top-h', `${t}px`); appEl.style.setProperty('--dock-h', `${d}px`);
  return true;
}
function pickSet() {
  const r = stage.getBoundingClientRect(), h = r.height - hud.top - hud.dock;
  return r.width >= 560 && h > 0 && r.width / h > .78 ? 'wide' : 'phone'; // phones in portrait always get the phone pages
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
    if (!layout.some(pg => pg.id === ui.page)) ui.page = ui.page === 'boats' ? 'boats' : 'harbor';
    ui.firstPaint = true;
  }
  return true;
}
const pageIndex = id => Math.max(0, layout.findIndex(pg => pg.id === id));
// The page that shows a sheet area ([x0, y0, x1, y1] on that sheet).
function pageOf(sheet, [x0, y0, x1, y1]) { return pageAt(layout, sheet, (x0 + x1) / 2, (y0 + y1) / 2)?.id || layout[0].id; }
const secPage = sec => pageOf(SECTION_SHEET[sec], HIT[sec]);
// Where a sheet point is on screen, if the current page shows it.
function toScreen(sheet, x, y) {
  const p = panels.find(q => q.page === ui.page && q.sheet === sheet && x >= q.crop[0] && x <= q.crop[2] && y >= q.crop[1] && y <= q.crop[3]);
  if (!p) return null;
  const r = p.svg.getBoundingClientRect(), k = r.width / (p.crop[2] - p.crop[0]);
  return { x: r.left + (x - p.crop[0]) * k, y: r.top + (y - p.crop[1]) * k };
}

function showPage(id, smooth = true) {
  ui.page = id;
  const el = pages.children[pageIndex(id)];
  if (el) pages.scrollTo({ left: el.offsetLeft, behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  syncTabs();
}
function syncTabs() {
  const tg = new Set(targets().map(secPage));
  tabsEl.querySelectorAll('button').forEach(b => {
    b.setAttribute('aria-selected', String(b.dataset.page === ui.page));
    b.classList.toggle('has-target', tg.has(b.dataset.page) && b.dataset.page !== ui.page);
  });
  if (!scrolling) tabsEl.style.setProperty('--pos', pageIndex(ui.page));
  if (ui.view === 'you') bubbleEl.querySelector(`[data-show="${ui.page}"]`)?.remove(); // already looking at it
}
function focusTargets() {
  const t = targets(); if (!t.length || ui.view !== 'you') return;
  const ids = new Set(t.map(secPage));
  if (ids.size === 1) { const only = [...ids][0]; if (only !== ui.page) showPage(only); }
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
tabsEl.addEventListener('click', ev => { const b = ev.target.closest('button[data-page]'); if (b) { if (b.dataset.page !== ui.page) { play('tap'); haptic(); } showPage(b.dataset.page); } });
function relayout() {
  const moved = measureHud();
  if (buildPages()) render();
  else if (!moved) return;
  showPage(ui.page, false);
}
window.addEventListener('resize', relayout);
new ResizeObserver(() => { if (measureHud() && buildPages()) { render(); showPage(ui.page, false); } }).observe(dockEl);
new ResizeObserver(() => { if (measureHud() && buildPages()) { render(); showPage(ui.page, false); } }).observe(topEl);

// ---------- staging what just happened ----------
// Sound, haptics, banners and "+VP" floaters for the changes between two states of your sheet.
function momentPoint(m) {
  const at = (sheet, x, y) => toScreen(sheet, x, y);
  if (m.k === 'mark') { const c = CELLS[m.sec][m.i]; return at(SECTION_SHEET[m.sec], c.x, c.y); }
  if (m.k === 'launch') { const b = SHIP[m.type].marks[m.i]; return at(SHIP[m.type].box[2], b.x, b.y); }
  if (m.k === 'fish') { const f = SHIP[m.type].fish[m.i]?.[m.from + m.n - 1] || SHIP[m.type].marks[m.i]; return at(SHIP[m.type].box[2], f.x, f.y); }
  if (m.k === 'license') { const [x, y] = LICENSE.circles[m.type][m.lvl - 1]; return at('boats', x, y); }
  if (m.k === 'kc') return at('harbor', ...KC.circle);
  if (m.k === 'building') { const c = CELLS[m.sec].at(-1); return at('harbor', c.x, c.y); }
  if (m.k === 'coins') { const { x, y } = coinPos(m.first); return at('harbor', x, y); }
  return null;
}
function stageMoments(prev, { user = false } = {}) {
  const list = moments(prev, s);
  if (!list.length) return 0;
  const has = k => list.some(m => m.k === k);
  let hold = 0, floats = 0;
  // sound
  if (has('mark')) play('pencil');
  if (has('strike')) play('strike', .05);
  if (has('launch')) play('horn', .12);
  let fishN = 0;
  for (const m of list.filter(m => m.k === 'fish')) for (let j = 0; j < m.n; j++, fishN++) if (fishN < 16) play('splash', fishN * STAGGER.fish / 1000);
  if (fishN) hold = Math.max(hold, fishN * STAGGER.fish + 300);
  const coinM = list.find(m => m.k === 'coins');
  if (coinM) { for (let i = 0; i < Math.min(coinM.n, 12); i++) play('coin', i, .05 + i * STAGGER.coin / 1000); hold = Math.max(hold, coinM.n * STAGGER.coin + 200); }
  // haptics (only felt inside a tap on iOS)
  if (user) haptic(has('building') || has('license') || has('kc') ? 'heavy' : 'medium');
  // banners for the big moments
  for (const m of list) {
    if (m.k === 'license') banner({ kind: 'license', icon: faceImg(m.type), title: `${E.label(m.type)} license ${'I'.repeat(m.lvl)}`, sub: LIC_TEXT[m.type][m.lvl - 1], sound: 'star' });
    if (m.k === 'kc') banner({ kind: 'license', icon: '<span class="glyph">♛</span>', title: 'King Crab license', sub: '+5 VP — now choose your bonus', sound: 'stamp' });
    if (m.k === 'building') banner({ kind: 'stamp', title: `${E.label(m.sec)} open`, sub: BUILDING_LINE[m.sec], sound: 'stamp' });
  }
  if (has('star') && s.queue.some(q => q.t === 'star')) banner({ kind: 'star', icon: '<span class="glyph">★</span>', title: 'Star action', sub: 'Mark the top open box of any section', sound: ['star', coinM ? coinM.n * STAGGER.coin / 1000 : 0] });
  const rm = list.find(m => m.k === 'round');
  if (rm) roundBanner();
  // score floaters fly into the strip
  if (ui.view === 'you') {
    const vpMoments = list.filter(m => m.vp > 0);
    const shown = vpMoments.slice(0, 6), rest = vpMoments.slice(6).reduce((n, m) => n + m.vp, 0);
    let fishAt = 0;
    for (const m of shown) {
      let delay = 0;
      if (m.k === 'fish') { delay = fishAt * STAGGER.fish; fishAt += m.n; }
      floater(`+${m.vp} VP`, momentPoint(m), scoreTarget(), { delay }); floats++;
    }
    if (rest) { floater(`+${rest} VP`, null, scoreTarget(), { delay: 200 }); floats++; }
    if (coinM) { floater(`+${coinM.n}`, momentPoint(coinM), coinChip, { kind: 'coin' }); floats++; }
  }
  ui.holdUntil = performance.now() + hold;
  return floats ? 650 : 0;
}
function roundBanner() {
  const r = s.round, last = r === s.rounds;
  banner({ kind: 'round', title: `Round ${r}`, sub: last ? 'Final round' : r % 2 === 0 ? 'Fishing round — your boats go out after income' : `${s.rounds - r + 1} rounds to go`, sound: 'sheet', ms: 1100 });
}

// ---------- acting ----------
function doAct(a) {
  const before = JSON.stringify(s), rolls = s.rolls;
  if (!E.act(s, a)) return false;
  history.push(before); if (history.length > 40) history.shift();
  if (s.rolls !== rolls) history = []; // no undoing past fresh dice
  if (s.step.k !== 'pick') ui.sel = null;
  afterChange(JSON.parse(before), { user: true });
  return true;
}
function afterChange(prev = null, opts = {}) {
  if (!infoEl.hidden) { infoEl.hidden = true; ui.hl = null; }
  const delay = prev && !ui.firstPaint ? stageMoments(prev, opts) : 0;
  render(delay);
  focusTargets();
  const t = E.currentTask(s);
  if (t?.t === 'kc') showPage(pageOf('harbor', KC.card));
  if (t?.t === 'lb' || t?.t === 'oyster') showPage('boats');
  if (s.phase === 'over') onOver();
  pump();
}
function pump() {
  clearTimeout(timer);
  if (paused() || !E.isAuto(s)) return;
  const k = s.step.k;
  const base = { rival: 900, ai: 950, roll: 380, income: 450, fishing: 650, end: 450, next: 120 }[k] ?? 300;
  const wait = Math.max(base, busyFor() + (k === 'roll' ? 150 : 0), ui.holdUntil - performance.now());
  if (k === 'rival' || k === 'ai') renderDock();
  timer = setTimeout(() => {
    if (paused()) return;
    const before = JSON.parse(JSON.stringify(s));
    const e = E.auto(s);
    if (!e) return;
    if (e.k === 'roll') { history = []; ui.sel = null; }
    if ((e.k === 'rival' || e.k === 'ai') && !e.shared) flyDie(e.die);
    if (e.k === 'rival') {
      const n = e.hits.length, h = e.hits[0]?.[0];
      const where = !n ? 'Nothing left to strike.' : h === 'coin' ? 'Struck the next ★ on your coin track.' : `Struck ${n} box${n > 1 ? 'es' : ''} in your ${E.label(h)}${E.TYPES.includes(h) ? ' column' : ''}.`;
      const page = !n ? null : h === 'coin' ? pageOf('harbor', [0, 1200, 1122, 1360]) : secPage(h);
      if (n) { ui.lastHits = e.hits; ui.flash = { hits: e.hits, until: performance.now() + 2600 }; setTimeout(() => { ui.flash = null; renderSheets(); }, 2700); ping(page); }
      say(`<b>${rivalLine(e)}</b><span>${where}</span>`, { show: n && (page !== ui.page || ui.view !== 'you') ? page : null });
    }
    if (e.k === 'ai') say(`<b>${aiLine(e)}</b><span>${aiDid(e.text)}${e.score != null ? ` — AI now ${e.score}` : ''}</span>`, { see: ui.view !== 'ai' });
    if (e.k === 'income') news(`<b>Income</b> +${e.n} coin${e.n > 1 ? 's' : ''}`);
    if (e.k === 'fishing') {
      if (ui.view === 'you' && ui.page !== 'boats' && e.n) showPage('boats');
      banner({ kind: 'fishing', title: 'Fishing', sub: e.n ? `Your boats caught ${e.n} fish` : 'No boats out to fish yet', ms: 1300 });
    }
    afterChange(before);
  }, wait);
}

function onDieTap(ev) {
  const b = ev.target.closest('.die'); if (!b) return;
  const i = +b.dataset.die;
  if (b.getAttribute('aria-disabled') === 'true') { if (s.step.k === 'pick' && !E.currentTask(s)) { replay(b, 'wiggle'); play('error'); haptic('error'); } return; }
  ui.sel = ui.sel === i ? null : i;
  play(ui.sel == null ? 'put' : 'pick'); haptic();
  if (ui.view === 'ai') { ui.view = 'you'; ui.firstPaint = true; ui.hudVals = null; syncView(); }
  renderSheets(); renderDock(); syncTabs(); renderStatus(); focusTargets(); coachSync();
}
diceEl.addEventListener('click', onDieTap);
// a tap on the sheet that can't be used: point back at what's needed
function nudge() {
  replay(promptEl, 'nudge'); play('error'); haptic('error');
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
pages.addEventListener('scroll', () => { clearTimeout(pressT); pressT = null; }, { passive: true });
document.addEventListener('click', ev => { if (suppressClick) { suppressClick = false; ev.stopPropagation(); ev.preventDefault(); } }, true);
document.addEventListener('contextmenu', ev => { if (ev.target.closest('.panel, .die')) ev.preventDefault(); });
function openInfo(t) {
  const info = t.info(); if (!info) return;
  infoEl.innerHTML = `<button class="x" data-close aria-label="Close">×</button><p class="kicker">${info.kicker}</p><h2 id="info-title">${info.title}</h2>${info.body}<p class="hint">Tap anywhere to close · hold any area for help</p>`;
  infoEl.classList.remove('top');
  infoEl.hidden = false;
  if (t.bottom && infoEl.getBoundingClientRect().top < t.bottom) infoEl.classList.add('top'); // don't cover what's being explained
  ui.hl = t.hl || null;
  haptic('medium'); play('sheet');
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
  if (ui.view === 'ai') { replay(whoEl, 'nudge'); news("You're looking at the AI's sheet — tap <b>You</b> to go back"); return; }
  const kc = ev.target.closest('[data-kc]'); if (kc) { doAct({ type: 'kc', choice: kc.dataset.kc }); return; }
  const hit = ev.target.closest('[data-sec]');
  if (!hit) { if (E.currentTask(s)?.t === 'star' || ['pick', 'use'].includes(s.step.k)) nudge(); return; }
  const sec = hit.dataset.sec;
  if (E.currentTask(s)?.t === 'star') doAct({ type: 'star', sec });
  else { const o = currentOptions(); if (o) doAct({ type: 'fill', die: o.die, sec }); }
});
function onAction(ev) {
  const b = ev.target.closest('[data-a]'); if (!b) return;
  const a = b.dataset.a, v = b.dataset.v, o = currentOptions();
  if (a === 'new') { play('tap'); haptic(); return openNew(); }
  if (a === 'final') { play('tap'); haptic(); return onOver(true); }
  if (a === 'skip') { play('put'); haptic(); return doAct({ type: 'skip' }); }
  if (a === 'lb') return doAct({ type: 'lb', choice: v });
  if (a === 'kc') return doAct({ type: 'kc', choice: v });
  if (a === 'oyster') return doAct({ type: 'oyster', choice: v });
  if (o) doAct({ type: a, die: o.die });
}
actionsEl.addEventListener('click', onAction);
choicesEl.addEventListener('click', onAction);
$('#undo-btn').addEventListener('click', () => {
  if (!history.length) return;
  clearTimeout(timer); clearBanners();
  s = JSON.parse(history.pop()); ui.sel = null; ui.hudVals = null;
  play('put'); haptic();
  afterChange();
});
$('#menu-btn').addEventListener('click', () => { play('tap'); haptic(); openMenu(); });
whoEl.addEventListener('click', ev => { const b = ev.target.closest('[data-view]'); if (!b || b.dataset.view === ui.view) return; haptic(); setView(b.dataset.view); });

// ---------- bottom sheets ----------
// Menus, rules and the final score slide up from the bottom, close with a swipe down, a tap on the
// dimmed backdrop or Escape, and pause the automatic turns while they are open.
let closeT = null;
function openSheet(html, { tall = false, cls = '' } = {}) {
  clearTimeout(closeT);
  dlg.className = [tall ? 'tall' : '', cls, dlg.open ? 'in' : ''].filter(Boolean).join(' ');
  dlg.innerHTML = `<div class="scrim" data-dismiss></div><div class="sheet-card" tabindex="-1" autofocus><div class="grabber" aria-hidden="true"></div>${html}</div>`;
  if (!dlg.open) {
    dlg.showModal(); play('sheet'); coachSync();
    requestAnimationFrame(() => requestAnimationFrame(() => dlg.classList.add('in')));
  }
  clearTimeout(timer);
}
function closeSheet() {
  if (!dlg.open) return;
  dlg.classList.remove('in');
  const card = dlg.querySelector('.sheet-card'); if (card) { card.style.transform = ''; card.style.transition = ''; }
  closeT = setTimeout(() => { dlg.close(); dlg.innerHTML = ''; pump(); coachSync(); }, reduced() ? 0 : 280);
}
dlg.addEventListener('cancel', ev => { ev.preventDefault(); closeSheet(); });
// swipe down to dismiss
let drag = null, dragged = false;
dlg.addEventListener('pointerdown', ev => {
  const card = ev.target.closest('.sheet-card'); if (!card) return;
  const body = card.querySelector('.sheet-body'), onHead = ev.target.closest('.grabber, .sheet-head');
  if (!onHead && body && body.scrollTop > 0) return;
  drag = { card, y0: ev.clientY, t0: performance.now(), dy: 0, on: false }; dragged = false;
});
dlg.addEventListener('pointermove', ev => {
  if (!drag) return;
  const dy = ev.clientY - drag.y0;
  if (!drag.on) { if (dy > 8) { drag.on = true; drag.card.style.transition = 'none'; drag.card.setPointerCapture?.(ev.pointerId); } else if (dy < -8) { drag = null; return; } else return; }
  drag.dy = Math.max(0, dy - 8); drag.card.style.transform = `translateY(${drag.dy}px)`;
});
for (const type of ['pointerup', 'pointercancel']) dlg.addEventListener(type, () => {
  if (!drag) return;
  const d = drag; drag = null;
  if (!d.on) return;
  dragged = true;
  const v = d.dy / Math.max(1, performance.now() - d.t0);
  d.card.style.transition = '';
  if (d.dy > 110 || v > .6) { haptic(); closeSheet(); } else d.card.style.transform = '';
});
dlg.addEventListener('click', ev => {
  if (dragged) { dragged = false; return; }
  if (ev.target.closest('[data-dismiss]')) return closeSheet();
  const b = ev.target.closest('[data-m]'); if (!b) return;
  const m = b.dataset.m;
  play('tap'); haptic();
  if (m === 'close') closeSheet();
  if (m === 'rules') openRules();
  if (m === 'new') openNew();
  if (m === 'rival' || m === 'open' || m === 'ai') startNew(m);
  if (m === 'view-ai') { closeSheet(); setView('ai'); }
  if (m === 'view-me') { closeSheet(); setView('you'); }
  if (m === 'menu') openMenu();
  if (m === 'tour') { closeSheet(); setView('you'); startCoach(); }
});
dlg.addEventListener('change', ev => {
  const p = ev.target.dataset?.pref; if (!p) return;
  setPref(p, ev.target.checked);
  if (p === 'sound' && ev.target.checked) play('coin');
  if (p === 'haptics' && ev.target.checked) haptic('medium');
});

const toggle = (pref, label) => `<label class="toggle"><span>${label}</span><input type="checkbox" switch data-pref="${pref}"${prefs[pref] ? ' checked' : ''}></label>`;
function openMenu() {
  const b = best();
  openSheet(`<div class="sheet-head"><p class="kicker">Paused</p><h2>Fishing</h2>
    <p class="muted">Round ${Math.min(s.round, s.rounds)} of ${s.rounds} · ${E.modeName(s.mode)} · You ${E.score(s).total}${vsAI() ? ` · AI ${E.score(s.bot).total}` : ''}</p></div>
    <div class="sheet-body">
    <div class="menu-list">
      <button data-m="close" class="primary">Resume</button>
      ${vsAI() ? `<button data-m="${ui.view === 'ai' ? 'view-me' : 'view-ai'}">${ui.view === 'ai' ? 'View your sheet' : "View AI player's sheet"} <small>${ui.view === 'ai' ? E.score(s).total : E.score(s.bot).total} pts</small></button>` : ''}
      <button data-m="new">New game</button>
      <button data-m="rules">How to play</button>
      <button data-m="tour">Replay the tour <small>6 quick tips</small></button>
      <a href="../../">All games <small>↗</small></a>
    </div>
    <div class="group">${toggle('sound', 'Sound effects')}${toggle('haptics', 'Haptics')}</div>
    <div class="bests"><span><small>Solo best</small><b>${b.rival ?? '—'}</b></span><span><small>Vs AI best</small><b>${b.ai ?? '—'}</b></span><span><small>Free play best</small><b>${b.open ?? '—'}</b></span>${b.wins ? `<span><small>Wins vs AI</small><b>${b.wins}</b></span>` : ''}</div>
    </div>`);
}
function openNew() {
  openSheet(`<div class="sheet-head"><h2>New game</h2></div>
    <div class="sheet-body">
    <div class="menu-list modes">
      <button data-m="rival" class="primary"><span><b>Solo</b><small>The Rival grabs dice and strikes boxes on your sheet</small></span><em>8 rounds</em></button>
      <button data-m="ai" class="primary"><span><b>Vs AI player</b><small>Draft the same dice; highest score wins</small></span><em>10 rounds</em></button>
      <button data-m="open"><span><b>Free play</b><small>No opponent — learn the sheet at your pace</small></span><em>10 rounds</em></button>
    </div>
    <button class="text-btn" data-m="${s.phase === 'over' || ui.title ? 'close' : 'menu'}">${s.phase === 'over' || ui.title ? 'Cancel' : 'Back'}</button>
    </div>`);
}
function startNew(mode) {
  clearTimeout(timer); clearBanners(); clearNews(); hush();
  s = E.newGame(mode); history = []; ui.sel = null; ui.view = 'you'; ui.hudVals = null;
  ui.firstPaint = true; overShown = false; showPage('boats', false);
  if (ui.title) hideTitle();
  closeSheet();
  if (!coachDone() && ui.coach == null) startCoach();
  roundBanner();
  setTimeout(() => news(`<b>Starting bonus:</b> ${E.label(s.start)} license and boat`), 900);
  afterChange();
}

// ---------- game over ----------
let overShown = false;
function onOver(force = false) {
  if (!force && overShown) return;
  overShown = true;
  const sc = E.score(s), rows = [['Fish', 'fish'], ['Boats', 'boats'], ['Licenses', 'licenses'], ['Buildings', 'buildings'], ['Bonuses', 'bonus']];
  const ai = vsAI() ? E.score(s.bot) : null;
  const won = ai && sc.total > ai.total, tie = ai && sc.total === ai.total;
  const isBest = !force && recordBest(sc.total);
  if (!force && won) { const b = best(); b.wins = (b.wins || 0) + 1; try { localStorage.setItem(BEST, JSON.stringify(b)); } catch { } }
  const bestNow = best()[s.mode];
  let html;
  if (ai) {
    html = `<div class="sheet-head end ${won ? 'win' : tie ? 'tie' : 'lose'}"><p class="kicker">Vs AI · Game over</p>
      <h2 class="hero">${tie ? "It's a tie" : won ? 'You win!' : 'The AI wins'}</h2>
      <div class="versus"><span><small>You</small><b data-to="${sc.total}">0</b></span><i>–</i><span><small>AI</small><b data-to="${ai.total}">0</b></span></div></div>
      <div class="sheet-body">
      <table class="score-table vs"><tr class="head"><td></td><td>You</td><td>AI</td></tr>${rows.map(([k, f]) => `<tr class="row"><td>${k}</td><td data-to="${sc[f]}">0</td><td data-to="${ai[f]}">0</td></tr>`).join('')}</table>
      <p class="end-note">${isBest ? '<span class="new-best">New best!</span> ' : ''}Best vs AI: ${bestNow ?? sc.total}</p>
      <div class="menu-list"><button data-m="new" class="primary">Play again</button><button data-m="view-ai">View AI player's sheet</button><button data-m="view-me">View your sheet</button></div></div>`;
  } else {
    const nr = nextRank(sc.total), solo = s.mode === 'rival';
    html = `<div class="sheet-head end"><p class="kicker">${solo ? 'Solo' : 'Free play'} · Game over</p>
      <h2 class="hero"><b data-to="${sc.total}">0</b> points</h2></div>
      <div class="sheet-body">
      <table class="score-table">${rows.map(([k, f]) => `<tr class="row"><td>${k}</td><td data-to="${sc[f]}">0</td></tr>`).join('')}</table>
      ${solo ? `<div class="rank-badge" hidden><div class="medal"><span>★</span></div><div><small>Your rank</small><b>${E.rank(sc.total)}</b><em>${nr ? `${nr.need} point${nr.need > 1 ? 's' : ''} to ${nr.name}` : 'The top rank — well fished!'}</em></div></div>` : ''}
      <p class="end-note">${isBest ? '<span class="new-best">New best!</span> ' : ''}Best ${solo ? 'solo' : 'free play'}: ${bestNow ?? sc.total}</p>
      <div class="menu-list"><button data-m="new" class="primary">Play again</button><button data-m="close">View sheets</button></div></div>`;
  }
  setTimeout(() => {
    openSheet(html, { cls: 'end-sheet' });
    revealScore({ quick: force, celebrate: !force && (ai ? won : isBest), lost: !force && ai && !won && !tie });
  }, force ? 0 : 700);
}
async function revealScore({ quick, celebrate, lost }) {
  const card = dlg.querySelector('.sheet-card'); if (!card) return;
  const alive = () => card.isConnected;
  await new Promise(r => setTimeout(r, quick ? 120 : 380));
  for (const row of card.querySelectorAll('tr.row')) {
    if (!alive()) return;
    row.classList.add('show');
    await Promise.all([...row.querySelectorAll('[data-to]')].map(td => countUp(td, +td.dataset.to, { from: 0, ms: quick ? 180 : 360, tick: !quick })));
  }
  if (!alive()) return;
  const totals = [...card.querySelectorAll('.sheet-head [data-to]')];
  await Promise.all(totals.map(el => countUp(el, +el.dataset.to, { from: 0, ms: quick ? 250 : 700, tick: !quick })));
  card.querySelector('.sheet-head')?.classList.add('done');
  const badge = card.querySelector('.rank-badge');
  if (badge) { badge.hidden = false; play('stamp'); }
  card.querySelector('.new-best')?.classList.add('show');
  if (celebrate) { play('win'); confetti(dlg); } else if (lost) play('lose');
}

// How to play, illustrated with pieces of the real sheets.
const art = (sheet, [x0, y0, x1, y1], extra = '', label = '') =>
  `<svg class="rule-art" viewBox="${x0} ${y0} ${x1 - x0} ${y1 - y0}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><image href="${SHEETS[sheet].src}" width="${SHEETS[sheet].w}" height="${SHEETS[sheet].h}"/>${extra}</svg>`;
const X = (x, y, r = 10) => { const d = r * .78; return `<path class="ink" d="M${x - d} ${y - d}L${x + d} ${y + d}M${x + d} ${y - d}L${x - d} ${y + d}"/>`; };
const dice = faces => `<span class="rule-dice">${faces.map(f => `<img src="assets/dice/${f}.webp" alt="${E.label(f)}">`).join('')}</span>`;
function openRules() {
  const col = CELLS.cod, next = col[3];
  const colArt = art('boats', [262, 92, 462, 412], col.slice(0, 3).map(c => X(c.x, c.y)).join('')
    + `<rect class="target" x="${HIT.cod[0]}" y="${HIT.cod[1]}" width="${HIT.cod[2] - HIT.cod[0]}" height="${HIT.cod[3] - HIT.cod[1]}" rx="16"/><circle class="next" cx="${next.x}" cy="${next.y}" r="${next.r + 7}"/>`, 'A boat column with its top boxes marked');
  const licArt = art('boats', [262, 408, 462, 738], X(...LICENSE.circles.cod[0], 11), 'Cod license cards');
  const boatArt = art('boats', [262, 742, 462, 1100], X(SHIP.cod.marks[0].x, SHIP.cod.marks[0].y, 11) + SHIP.cod.fish[0].slice(0, 2).map(f => X(f.x, f.y)).join('')
    + `<rect class="dim" x="262" y="${SHIP.cod.marks[1].y - 24}" width="166" height="94" rx="16"/><rect class="dim" x="262" y="${SHIP.cod.marks[2].y - 24}" width="166" height="94" rx="16"/>`, 'Cod boats, one launched with two fish');
  const coinArt = art('harbor', [0, 1192, 600, 1300], [0, 1].map(i => X(coinPos(i).x, coinPos(i).y)).join('') + `<circle class="star-ring" cx="${coinPos(2).x}" cy="${coinPos(2).y}" r="16"/>`, 'The coin track');
  const casinoArt = art('harbor', [572, 452, 818, 612], '', 'The Casino building');
  const scoreArt = art('boats', [784, 1112, 1100, 1429], '', 'The final score table');
  openSheet(`<div class="sheet-head row"><h2>How to play</h2><button class="done-btn" data-m="close">Done</button></div>
  <div class="sheet-body rules">
  <p class="lead">Launch boats, catch fish, earn licenses and finish wharf buildings. Every round you pick dice and mark boxes on your sheet; highest score wins.</p>
  <div class="tip-card"><b>Hold anything</b> — a box, a boat, a card or a die — to see what it does and what it's worth right now.</div>

  <h3>A round, in four steps</h3>
  <ol class="steps">
    <li>${dice(['shrimp', 'cod', 'coins'])}<div><b>Boat dice</b><span>Pick a die, then tap its column. Everyone then uses the die left over.</span></div></li>
    <li>${dice(['coins'])}<div><b>Income</b><span>1 coin, plus Lobster license and Canning Co. bonuses (max 10).</span></div></li>
    <li><span class="rule-dice fishmark">${FISH_PIP}</span><div><b>Fishing</b><span>Even rounds only: every launched boat catches a fish. Oyster boats catch 2, or 1 plus a coin.</span></div></li>
    <li>${dice(['harbor', 'wharf', 'market'])}<div><b>Town dice</b><span>Harbor marks a harbor ship, Wharf a building, Market pays coins for your fish.</span></div></li>
  </ol>

  <h3>Marking boxes</h3>
  <div class="fig">${colArt}<div><p>Pick a die and the column it fits glows gold. Tap it: the <b>top open box</b> is marked for you.</p><p>Circled boxes do more: <b>L</b> a license, <b>B</b> launch a boat, <b>?</b> your choice, <b>F</b> a private fishing trip.</p><p>Any die can be traded for 1 coin instead.</p></div></div>

  <h3>Licenses</h3>
  <div class="fig">${licArt}<div><p>Each level gives the ability on its card, replacing the one before. The second level pays 2 coins at once; the third scores its VP at the end.</p></div></div>

  <h3>Boats &amp; fish</h3>
  <div class="fig">${boatArt}<div><p>Launched boats score the VP under them, then catch a fish every Fishing phase until full. Every fish is 1 VP.</p></div></div>

  <h3>Coins &amp; stars</h3>
  ${coinArt}
  <p>Coins fill the track left to right. Landing on a <b>★</b> gives a star action: mark the top open box of any section. The strip under the tabs shows how far the next ★ is.</p>

  <h3>The wharf</h3>
  <div class="fig">${casinoArt}<div><p>A building works once its last box is marked — the Casino rerolls your picked die, the Bait Shop pays 2 coins per traded die, the Salvage Yard turns a die into a star action, and more. Hold one to read it.</p></div></div>

  <h3>Opponents</h3>
  <div class="fig opp"><span class="portrait">${OPPONENT.rival.face}</span><div><p><b>Solo:</b> the Rival takes a die each round and strikes the two lowest open boxes in that section (one for the shared die). Red <b>R</b> pins show where it is aiming. It goes first in even rounds.</p></div></div>
  <div class="fig opp"><span class="portrait">${OPPONENT.ai.face}</span><div><p><b>Vs AI:</b> the AI drafts from the same dice for its own sheet and never touches yours. Tap <b>AI</b> in the strip to look at its sheet. Highest total after 10 rounds wins.</p></div></div>

  <h3>Final score</h3>
  <div class="fig">${scoreArt}<div><p>Fish, launched boats, level-3 licenses, buildings and your King Crab bonus (max 10). The sheet keeps a live total.</p></div></div>
  <div class="menu-list"><button data-m="tour">Take the tour <small>on your sheet</small></button></div>
  </div>`, { tall: true });
}

// ---------- title screen ----------
function showTitle() {
  ui.title = true; titleEl.hidden = false; document.body.classList.add('at-title');
  const resumable = hadSave && s.phase !== 'over';
  const meta = `Round ${s.round} of ${s.rounds} · ${E.modeName(s.mode)} · ${E.score(s).total} points`;
  titleEl.querySelector('.t-menu').innerHTML = resumable
    ? `<button class="t-btn primary" data-t="continue"><b>Continue</b><small>${meta}</small></button><button class="t-btn" data-t="new"><b>New game</b></button><button class="t-btn" data-t="rules"><b>How to play</b></button>`
    : `<button class="t-btn primary" data-t="new"><b>Play</b>${coachDone() ? '' : '<small>Starts with a quick tour</small>'}</button><button class="t-btn" data-t="rules"><b>How to play</b></button>`;
}
function hideTitle() {
  ui.title = false; document.body.classList.remove('at-title');
  if (reduced()) { titleEl.hidden = true; return; }
  titleEl.classList.add('out');
  setTimeout(() => { titleEl.hidden = true; titleEl.classList.remove('out'); }, 420);
}
titleEl.addEventListener('click', ev => {
  const b = ev.target.closest('[data-t]'); if (!b) return;
  play('tap'); haptic();
  if (b.dataset.t === 'continue') { hideTitle(); pump(); coachSync(); }
  if (b.dataset.t === 'new') openNew();
  if (b.dataset.t === 'rules') openRules();
});

// ---------- the tour ----------
// Six coach marks over the real screen. The first two wait for you to do it (pick a die, use it);
// the rest have a Next button and hold the automatic turns while they are up.
const COACH = 'fishing.coach';
function coachDone() { try { return localStorage.getItem(COACH) === '1'; } catch { return true; } }
function coachSteps() {
  const sheetTarget = () => [...pages.children[pageIndex(ui.page)]?.querySelectorAll('.target') || []][0] || actionsEl.querySelector('.act.primary') || actionsEl;
  return [
    { id: 'dice', wait: true, target: () => diceEl, text: 'These are your dice. <b>Tap one</b> to pick it — tap it again to put it back.' },
    { id: 'sheet', wait: true, target: sheetTarget, text: () => pages.querySelector('.target') ? 'The <b>gold outline</b> shows where your die can go. <b>Tap it</b> — the top open box is marked for you.' : 'This die has no box to mark here — <b>tap a button</b> to use it instead.' },
    { id: 'status', target: () => $('#status'), text: () => `Your score, your coins — with how many more until a free <b>★ star action</b> — and the round. Fish pips are Fishing rounds.${vsAI() ? ' Tap <b>AI</b> to see its sheet.' : ''}` },
    { id: 'tabs', target: () => tabsEl, text: 'Your sheet has three pages. <b>Swipe</b> or tap a tab for the Harbor and the Wharf. A <b>gold dot</b> means your die fits there too.' },
    { id: 'opp', when: () => !!oppKind(), target: () => oppEl.querySelector('.face'), text: () => s.mode === 'rival' ? 'This is the <b>Rival</b>. Each round it grabs a die and strikes boxes on your sheet. Red <b>R</b> pins show where it is aiming.' : 'This is the <b>AI player</b>. It drafts the same dice for its own sheet. Highest score after 10 rounds wins.' },
    { id: 'hold', target: null, text: '<b>Hold anything</b> — a box, a boat, a card or a die — to see what it does and what it is worth right now. Good luck!' },
  ].filter(st => !st.when || st.when());
}
function startCoach() { ui.coach = 0; ui.coachKey = null; coachSync(); }
function endCoach(done = true) {
  ui.coach = null; ui.coachKey = null; coachEl.hidden = true; document.body.classList.remove('coaching');
  if (done) try { localStorage.setItem(COACH, '1'); } catch { }
  pump();
}
const coachReady = st => !ui.title && !dlg.open && ui.view === 'you' && s.phase !== 'over'
  && (st.wait ? (s.step.k === 'pick' || st.id === 'sheet') && !E.currentTask(s) : true);
function coachHolds() { if (ui.coach == null) return false; const st = coachSteps()[ui.coach]; return !!st && !st.wait && coachReady(st); }
function coachSync() {
  if (ui.coach == null) return;
  const steps = coachSteps();
  let st = steps[ui.coach];
  if (!st) return endCoach();
  // the first two steps move on when you do the thing
  if (st.id === 'dice' && s.step.k === 'pick' && ui.sel != null) { ui.coach++; return coachSync(); }
  if (st.id === 'sheet') {
    if (s.step.k !== 'pick' || E.currentTask(s)) { ui.coach++; return coachSync(); }
    if (ui.sel == null) { ui.coach--; return coachSync(); }
  }
  const ready = coachReady(st);
  coachEl.hidden = !ready; document.body.classList.toggle('coaching', ready);
  if (!ready) return;
  const key = `${st.id}:${typeof st.text === 'function' ? st.text() : st.text}`;
  if (key !== ui.coachKey) {
    ui.coachKey = key;
    const last = ui.coach === steps.length - 1;
    coachEl.querySelector('.coach-tip').innerHTML = `<p class="coach-k">Tour · ${ui.coach + 1} of ${steps.length}</p><p>${typeof st.text === 'function' ? st.text() : st.text}</p>
      <div class="coach-btns"><button data-c="skip">${last ? '' : 'Skip tour'}</button>${st.wait ? '' : `<button data-c="next" class="primary">${last ? 'Got it' : 'Next'}</button>`}</div>`;
    replay(coachEl.querySelector('.coach-tip'), 'in');
  }
  coachPlace();
  requestAnimationFrame(coachPlace); setTimeout(coachPlace, 380); // after page scrolls and layout settle
}
function coachPlace() {
  if (ui.coach == null || coachEl.hidden) return;
  const st = coachSteps()[ui.coach]; if (!st) return;
  const t = st.target?.(), spot = coachEl.querySelector('.coach-spot'), tip = coachEl.querySelector('.coach-tip');
  const r = t?.getBoundingClientRect();
  if (r && r.width) {
    const pad = 6;
    Object.assign(spot.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + 2 * pad}px`, height: `${r.height + 2 * pad}px`, opacity: 1 });
    const below = r.top + r.height / 2 < innerHeight / 2;
    tip.style.top = below ? `${r.bottom + pad + 14}px` : '';
    tip.style.bottom = below ? '' : `${innerHeight - r.top + pad + 14}px`;
    tip.classList.toggle('below', below); tip.classList.remove('center');
    const w = tip.offsetWidth, cx = r.left + r.width / 2, left = Math.min(Math.max(12, cx - w / 2), innerWidth - w - 12);
    tip.style.left = `${left}px`;
    tip.style.setProperty('--arrow', `${Math.min(Math.max(22, cx - left), w - 22)}px`);
  } else {
    Object.assign(spot.style, { left: '50%', top: '50%', width: '0px', height: '0px', opacity: 1 });
    tip.style.top = ''; tip.style.bottom = ''; tip.style.left = ''; tip.classList.add('center'); tip.classList.remove('below');
  }
}
coachEl.addEventListener('click', ev => {
  const b = ev.target.closest('[data-c]'); if (!b) return;
  play('tap'); haptic();
  if (b.dataset.c === 'skip') return endCoach();
  ui.coach++; coachSync(); pump();
});
pages.addEventListener('scroll', () => { if (ui.coach != null) requestAnimationFrame(coachPlace); }, { passive: true });
addEventListener('resize', () => coachPlace());

// ---------- boot ----------
requestAnimationFrame(() => {
  syncView(); measureHud();
  buildPages();
  showPage('boats', false);
  if (s.phase === 'over') overShown = true;
  showTitle();
  afterChange();
});
