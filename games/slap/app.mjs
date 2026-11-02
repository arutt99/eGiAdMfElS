import * as E from './engine.mjs';
import { prefs, setPref, haptic, play, banner, floater, countUp, bump, confetti, reduced } from './fx.mjs';

const SAVE = 'slap.v1', STATS = 'slap.stats', TOUR = 'slap.tour';
const $ = sel => document.querySelector(sel), $$ = sel => [...document.querySelectorAll(sel)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- people ----------
const LOOK = {
  0: { tint: '#f5c451', initial: 'Y' },
  1: { tint: '#3d8fd1', initial: 'D' },
  2: { tint: '#e0812a', initial: 'W' },
  3: { tint: '#cf4770', initial: 'J' },
  4: { tint: '#7d8f98', initial: 'B' },
};
const LINES = {
  shark: { steal: ['Thanks for those.', 'Easy money.', 'Read you like a book.'], bust: ['Hm. Noted.', 'The math said go.'], robbed: ['Bold.', "I'll remember that."], bank: ['Into the vault.'] },
  maverick: { steal: ['Yeehaw!', 'Mine now, partner.'], bust: ['Worth it!', 'Ha! Again!'], robbed: ['Hey now!', 'Low blow!'], bank: ['Cha-ching!'] },
  bandit: { steal: ['Hands up.', "Stick 'em up!", "Don't mind me."], bust: ['Rats.', 'Curses.'], robbed: ['Thief!', "That's my line."], bank: ['Stashed.'] },
  rock: { steal: ["Don't mind if I do.", 'Steady wins.'], bust: ["Should've stopped.", 'Hm.'], robbed: ['Fair enough.', 'Patience.'], bank: ['Slow and steady.'] },
};

// ---------- state ----------
let s = null;
const ui = { token: 0, resolve: null, hurry: false, shown: {}, dockKey: '', recorded: false, tour: null, confirmNew: 0, headline: '' };

const name = pid => (pid === 0 ? 'You' : s.players[pid].name);
const obj = pid => (pid === 0 ? 'you' : s.players[pid].name);
const verb = (pid, you, them) => (pid === 0 ? you : them);
const poss = pid => (pid === 0 ? 'Your' : `${s.players[pid].name}'s`);
const list = names => names.length < 2 ? names.join('') : `${names.slice(0, -1).join(', ')} & ${names.at(-1)}`;
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

function load() { try { const v = JSON.parse(localStorage.getItem(SAVE)); return E.validSave(v) && v.phase !== 'over' ? v : null; } catch { return null; } }
function save() { try { if (s && s.phase !== 'over') localStorage.setItem(SAVE, JSON.stringify(s)); } catch { /* storage unavailable */ } }
function clearSave() { try { localStorage.removeItem(SAVE); } catch { /* storage unavailable */ } }
function stats() { try { return { played: 0, wins: 0, best: 0, ...JSON.parse(localStorage.getItem(STATS)) }; } catch { return { played: 0, wins: 0, best: 0 }; } }
function setStats(v) { try { localStorage.setItem(STATS, JSON.stringify(v)); } catch { /* storage unavailable */ } }
function seen(key) { try { return localStorage.getItem(key) === '1'; } catch { return true; } }
function markSeen(key) { try { localStorage.setItem(key, '1'); } catch { /* storage unavailable */ } }

const SPEED = { relaxed: 1.45, normal: 1, fast: .5 };
function wait(ms, bot = true) {
  const k = bot ? (ui.hurry ? .2 : SPEED[prefs.speed] || 1) : 1;
  return new Promise(r => setTimeout(r, ms * k));
}

// ---------- markup ----------
const avatar = (pid, cls = '') => `<span class="avatar ${cls}" style="--tint:${LOOK[pid].tint}" aria-hidden="true">${LOOK[pid].initial}</span>`;
const cardHTML = (c, cls = '') => `<div class="card c${c.v}${cls ? ` ${cls}` : ''}" data-id="${c.id}" data-v="${c.v}"><span class="chip"><span>${c.v}</span></span></div>`;
const mini = v => `<span class="mini c${v}">${v}</span>`;
function groups(cards) {
  const by = new Map();
  for (const c of [...cards].sort((a, b) => a.v - b.v)) by.set(c.v, [...(by.get(c.v) || []), c]);
  return [...by.entries()];
}
function stacksHTML(cards, { fresh = null, target = null } = {}) {
  return groups(cards).map(([v, cs]) => {
    const ordered = fresh ? [...cs.filter(c => c.id !== fresh), ...cs.filter(c => c.id === fresh)] : cs;
    return `<div class="stack" role="img" aria-label="${cs.length} × ${v}">${ordered.map(c => cardHTML(c, c.id === fresh ? 'fresh' : target === v ? 'target' : '')).join('')}</div>`;
  }).join('');
}
const slots = n => Array.from({ length: n }, () => '<span class="slot" aria-hidden="true"></span>').join('');

// ---------- render ----------
// `view` is the state to draw. It is usually `s`, but a draw is first shown on a copy of the state
// from before the draw resolved, so the card can land on the pile before a bust or steal plays out.
function inTurn(v) { return v.phase === 'decide' || v.phase === 'steal'; }

function render(view = s) {
  if (!view || $('#app').hidden) return;
  const cur = view.players[view.current];
  renderOpponents(view);
  renderMe(view);
  renderStage(view, cur);
  renderDock(view);
}

function seatCards(view, p) {
  if (view.phase !== 'over' && view.current === p.id && inTurn(view)) {
    return `<span class="seat-note"><span class="dots" aria-hidden="true"><i></i><i></i><i></i></span> At the table</span>`;
  }
  if (!p.faceUp.length) return slots(3);
  const target = view.phase === 'steal' && view.drawn && view.current !== p.id ? view.drawn.v : null;
  return stacksHTML(p.faceUp, { target });
}

function renderOpponents(view) {
  $('#opponents').innerHTML = view.players.slice(1).map(p => {
    const isCur = view.phase !== 'over' && view.current === p.id;
    const targeted = view.phase === 'steal' && view.drawn && view.current !== p.id && p.faceUp.some(c => c.v === view.drawn.v);
    const label = `${p.name}, ${p.persona}. ${ui.shown[p.id] ?? p.score} Loot. ${p.faceUp.length ? `${plural(p.faceUp.length, 'card')} exposed` : 'Nothing exposed'}.`;
    return `<article class="seat${isCur ? ' active' : ''}${targeted ? ' targeted' : ''}" data-pid="${p.id}" style="--tint:${LOOK[p.id].tint}" aria-label="${esc(label)}">
      <div class="seat-head">${avatar(p.id)}<span class="who"><b>${p.name}</b><small>${p.persona}</small></span><span class="loot" id="loot-${p.id}">${ui.shown[p.id] ?? p.score}</span></div>
      <div class="seat-cards">${seatCards(view, p)}</div>
    </article>`;
  }).join('');
}

function renderMe(view) {
  const me = view.players[0], myTurn = view.current === 0 && inTurn(view) && view.phase !== 'over';
  let body;
  if (myTurn) {
    const cards = [...me.faceUp, ...(view.drawn ? [view.drawn] : [])], n = cards.length, at = E.sum(cards);
    const risk = E.bustRisk(view, me), past = me.faceUp.length >= E.DANGER;
    const third = prefs.odds
      ? (past ? `<div class="hot"><b>${Math.round(risk * 100)}%</b><small>Bust risk</small></div>` : '<div class="safe"><b>0%</b><small>Bust risk</small></div>')
      : (past ? '<div class="hot"><b>Past</b><small>Danger line</small></div>' : `<div class="safe"><b>${E.DANGER - me.faceUp.length}</b><small>To danger</small></div>`);
    body = `<div class="risk"><div><b>${n}</b><small>Cards out</small></div><div><b>${at}</b><small>Loot at risk</small></div>${third}</div>`;
  } else {
    body = `<div class="seat-cards">${seatCards(view, me)}</div>
      <p class="seat-caption">${me.faceUp.length ? `${E.sum(me.faceUp)} Loot banks at your next turn, if nobody steals it.` : 'Cards you keep wait here until your next turn.'}</p>`;
  }
  const el = $('#me');
  el.classList.toggle('active', myTurn);
  el.classList.toggle('targeted', view.phase === 'steal' && view.current !== 0 && view.drawn && me.faceUp.some(c => c.v === view.drawn.v));
  el.innerHTML = `<div class="seat-head">${avatar(0, 'lg me')}<span class="who"><b>You</b><small>${myTurn ? 'Your turn' : 'Your seat'}</small></span><span class="loot" id="loot-0">${ui.shown[0] ?? me.score}</span></div>${body}`;
}

function renderStage(view, cur) {
  const live = view.phase !== 'over' && inTurn(view);
  const pileCards = live ? [...cur.faceUp, ...(view.drawn ? [view.drawn] : [])] : [];
  const atRisk = live && cur.faceUp.length >= E.DANGER;

  // owner and danger meter
  $('#pile-owner').innerHTML = view.phase === 'over' ? '<span>Final count</span>'
    : `${avatar(cur.id, 'sm')}<span>${live ? `${poss(cur.id)} turn pile` : `${name(cur.id)} ${verb(cur.id, 'are', 'is')} up`}</span>`;
  const meter = $('#meter'), n = live ? cur.faceUp.length : 0;
  meter.hidden = !live;
  meter.classList.toggle('hot', atRisk);
  meter.innerHTML = `${[0, 1, 2].map(i => `<i class="pip${i < n ? ' on' : ''}"></i>`).join('')}<span>${atRisk ? 'Danger line' : `${E.DANGER - n} to danger`}</span>`;
  meter.setAttribute('aria-label', atRisk ? 'Past the danger line' : `${E.DANGER - n} cards until the danger line`);
  $('#stage').classList.toggle('danger', atRisk);

  // pile, sized so every group fits on one row
  const pile = $('#pile');
  if (pileCards.length) {
    const gs = groups(pileCards), units = gs.reduce((t, [, cs]) => t + 1 + (cs.length - 1) * .26, 0);
    const w = pile.clientWidth || 220, h = pile.clientHeight || 90;
    const big = matchMedia('(min-width: 700px) and (min-height: 760px)').matches;
    const cw = Math.max(24, Math.min(big ? 104 : 58, (h - 10) / 1.4, (w - 8 * (gs.length - 1)) / units));
    pile.style.setProperty('--cw', `${Math.floor(cw)}px`);
    pile.innerHTML = stacksHTML(pileCards, { fresh: view.drawn?.id ?? null });
  } else {
    pile.style.setProperty('--cw', `${Math.max(30, Math.min(matchMedia('(min-width: 700px) and (min-height: 760px)').matches ? 90 : 52, ((pile.clientHeight || 90) - 10) / 1.4))}px`);
    pile.innerHTML = slots(3);
  }

  // bust values
  const busts = $('#busts');
  busts.innerHTML = atRisk ? `<span>Busts on</span>${E.bustValues(cur).map(mini).join('')}` : '';

  // deck and lost pile
  const deck = $('#deck'), ready = canDraw(view);
  deck.disabled = !ready;
  deck.classList.toggle('ready', ready);
  deck.classList.toggle('empty', !view.deck.length);
  deck.style.setProperty('--layers', `${Math.round(2 + view.deck.length / 90 * 5)}px`);
  deck.setAttribute('aria-label', ready ? `Draw a card. ${view.deck.length} left` : `Deck, ${view.deck.length} cards left`);
  $('#deck-count').textContent = view.deck.length;
  $('#deck-label').textContent = ready ? 'Tap to draw' : view.deck.length ? 'Deck' : 'Empty';
  $('#deck-label').parentElement.classList.toggle('ready', ready);
  const lost = view.discard.length, layers = Math.min(4, Math.ceil(lost / 5));
  $('#lost').innerHTML = `${Array.from({ length: layers }, () => '<span class="card back" aria-hidden="true"></span>').join('')}<span class="lost-count">${lost || ''}</span>`;
  $('#lost').setAttribute('aria-label', `${plural(lost, 'card')} lost`);
}

function canDraw(view = s) { return Boolean(view === s && ui.resolve && view.phase === 'decide' && view.current === 0); }

function renderDock(view = s) {
  const dock = $('#dock'), cur = view.players[view.current];
  let key, html;
  if (view.phase === 'over') {
    key = 'over';
    html = `<button class="btn new" type="button" data-action="results">Results<small>See the final count</small></button>
      <button class="btn draw" type="button" data-action="new">New game<small>Deal again</small></button>`;
  } else if (cur.human && view.phase === 'decide') {
    const out = E.sum(cur.faceUp);
    key = `decide:${view.draws > 0}:${out}`;
    html = `<button class="btn draw" type="button" data-act="draw">Draw<small>${view.draws ? 'Flip another card' : 'Flip the top card'}</small></button>
      <button class="btn keep${view.draws ? '' : ' locked'}" type="button" data-act="stop"${view.draws ? '' : ' aria-disabled="true"'}>Keep<small>${view.draws ? `Bank ${out} next turn` : 'Draw a card first'}</small></button>`;
  } else if (cur.human && view.phase === 'steal' && view.drawn) {
    const victims = E.victimsOf(view, view.drawn.v), count = victims.reduce((t, v) => t + v.count, 0);
    key = `steal:${view.drawn.id}`;
    html = `<button class="btn steal" type="button" data-act="steal">Steal ${count}<small>+${count * view.drawn.v} Loot from ${esc(list(victims.map(v => obj(v.pid))))}</small></button>
      <button class="btn pass" type="button" data-act="pass">Pass<small>Keep just your ${view.drawn.v}</small></button>`;
  } else if (cur.human) {
    key = 'me-wait';
    html = `<div class="status">${avatar(0, 'me')}<span>Your turn</span></div>`;
  } else {
    key = `bot:${cur.id}:${ui.hurry}`;
    html = `<div class="status">${avatar(cur.id)}<span>${cur.name} is thinking <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span><small>${ui.hurry ? 'Hurrying…' : 'Tap the table to hurry'}</small></span></div>`;
  }
  if (key !== ui.dockKey) { dock.innerHTML = `<div class="controls">${html}</div>`; ui.dockKey = key; }
  // Buttons stay put while a move animates, but only take input when the game is waiting for one.
  const waiting = view === s && Boolean(ui.resolve);
  dock.querySelectorAll('[data-act]').forEach(b => { b.disabled = !waiting; });
}

let lastSr = '';
function setMessage(head, note = '', { bad = false } = {}) {
  const h = $('#headline');
  if (head !== ui.headline) { h.textContent = head; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); ui.headline = head; }
  h.classList.toggle('bad', bad);
  $('#note').textContent = note;
  const sr = `${head}. ${note}`;
  if (sr !== lastSr) { $('#sr').textContent = sr; lastSr = sr; }
}

// ---------- motion ----------
function snapshot() {
  const m = new Map();
  for (const el of $$('#app .card[data-id]')) { const r = el.getBoundingClientRect(); if (r.width) m.set(el.dataset.id, { r, html: el.outerHTML }); }
  return m;
}
const ease = 'cubic-bezier(.2,.8,.25,1)';
// FLIP every card from where it was to where it is now. Cards that appeared come off the deck;
// cards that disappeared fly to `gone[id]` (an element getter) or fade out.
async function animate(before, { gone = {}, fromDeck = [] } = {}) {
  const dur = reduced() ? 180 : 430, anims = [], fx = $('#fx'), deckR = $('#deck').getBoundingClientRect();
  const now = new Set();
  for (const el of $$('#app .card[data-id]')) {
    const id = el.dataset.id, r = el.getBoundingClientRect();
    now.add(id);
    if (!r.width) continue;
    const prev = before.get(id);
    if (prev) {
      const dx = prev.r.left - r.left, dy = prev.r.top - r.top, k = prev.r.width / r.width;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(k - 1) < .02) continue;
      el.style.transformOrigin = '0 0';
      const a = el.animate([{ transform: `translate(${dx}px,${dy}px) scale(${k})` }, { transform: 'none' }], { duration: dur, easing: ease });
      a.finished.then(() => { el.style.transformOrigin = ''; }, () => {});
      anims.push(a);
    } else if (fromDeck.includes(+id) && deckR.width) {
      anims.push(dealFrom(deckR, el, r, dur));
    } else {
      anims.push(el.animate([{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'none' }], { duration: dur * .6, easing: ease }));
    }
  }
  for (const [id, prev] of before) {
    if (now.has(id)) continue;
    const ghost = document.createElement('div');
    ghost.innerHTML = prev.html;
    const g = ghost.firstElementChild;
    g.classList.add('fly'); g.classList.remove('target', 'fresh');
    Object.assign(g.style, { left: `${prev.r.left}px`, top: `${prev.r.top}px`, transformOrigin: '0 0' });
    g.style.setProperty('--cw', `${prev.r.width}px`);
    fx.append(g);
    const dest = gone[id]?.()?.getBoundingClientRect();
    const frames = dest
      ? [{ transform: 'none', opacity: 1 }, { transform: `translate(${dest.left + dest.width / 2 - prev.r.left - prev.r.width * .2}px,${dest.top + dest.height / 2 - prev.r.top - prev.r.height * .2}px) scale(.4) rotate(${reduced() ? 0 : 14}deg)`, opacity: .2 }]
      : [{ opacity: 1 }, { opacity: 0, transform: 'scale(.8)' }];
    const a = g.animate(frames, { duration: dur * 1.1, easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
    a.finished.then(() => g.remove(), () => g.remove());
    anims.push(a);
  }
  await Promise.all(anims.map(a => (a.finished ? a.finished.catch(() => {}) : a)));
}

// A face-down card flies off the deck, lands where the real card is, and flips over.
async function dealFrom(deckR, el, r, dur) {
  el.style.visibility = 'hidden';
  const back = document.createElement('div');
  back.className = 'card back fly';
  Object.assign(back.style, { left: `${deckR.left}px`, top: `${deckR.top}px`, width: `${deckR.width}px`, height: `${deckR.height}px`, transformOrigin: '0 0' });
  $('#fx').append(back);
  const tx = r.left - deckR.left, ty = r.top - deckR.top, kx = r.width / deckR.width, ky = r.height / deckR.height;
  const travel = back.animate([
    { transform: 'none' },
    { transform: `translate(${tx * .55}px,${ty * .55 - (reduced() ? 0 : 26)}px) scale(${(1 + kx) / 2},${(1 + ky) / 2}) rotate(${reduced() ? 0 : -8}deg)` },
    { transform: `translate(${tx}px,${ty}px) scale(${kx},${ky})` },
  ], { duration: dur, easing: ease, fill: 'forwards' });
  await travel.finished.catch(() => {});
  if (!reduced()) {
    await back.animate([{ transform: `translate(${tx}px,${ty}px) scale(${kx},${ky})` }, { transform: `translate(${tx + r.width / 2}px,${ty}px) scale(0,${ky})` }], { duration: 90, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  }
  back.remove();
  el.style.visibility = '';
  if (!reduced()) await el.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 110, easing: 'ease-out' }).finished.catch(() => {});
}

function stageFx(cls) {
  const st = $('#stage');
  for (const c of cls.split(' ')) st.classList.remove(c);
  void st.offsetWidth;
  st.classList.add(...cls.split(' '));
  setTimeout(() => st.classList.remove(...cls.split(' ')), 700);
}
function flashSeat(pid) {
  const el = pid === 0 ? $('#me') : $(`.seat[data-pid="${pid}"]`);
  if (!el) return;
  el.classList.remove('victim'); void el.offsetWidth; el.classList.add('victim');
}
function say(pid, kind, chance = .7) {
  if (pid === 0 || Math.random() > chance) return;
  const line = pick(LINES[s.players[pid].style]?.[kind] || []);
  const av = $(`.seat[data-pid="${pid}"] .avatar`);
  if (!line || !av) return;
  const r = av.getBoundingClientRect(), el = document.createElement('div');
  el.className = 'say'; el.textContent = line;
  Object.assign(el.style, { left: `${Math.max(6, Math.min(r.left + 4, innerWidth - 176))}px`, top: `${r.bottom + 6}px` });
  $('#fx').append(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}
function lootEl(pid) { return () => $(`#loot-${pid}`); }

// ---------- presenting events ----------
function logAt(turn, pid, kind, text, v = null) { s.log ||= []; s.log.push({ turn, pid, kind, text, v }); }

function noteFor(pid) {
  const p = s.players[pid], n = p.faceUp.length, at = E.sum(p.faceUp);
  if (n < E.DANGER) return `${plural(n, 'card')} out · ${plural(E.DANGER - n, 'more card')} to the danger line`;
  return `${plural(n, 'card')} out · ${at} Loot at risk`;
}

async function present(prev, ev, token) {
  const bot = !s.players[prev.current].human;
  const drawEv = ev.find(e => e.t === 'draw');
  const turnNo = prev.turn;

  // 1. Land the drawn card on the pile, as it looked before the draw resolved.
  if (drawEv) {
    const view = structuredClone(prev);
    view.deck.pop(); view.drawn = drawEv.card; view.draws++;
    const before = snapshot();
    render(view);
    play('flick'); if (!bot) haptic('light');
    setMessage(`${name(drawEv.pid)} ${verb(drawEv.pid, 'draw', 'draws')} a ${drawEv.card.v}`, ev.some(e => e.t === 'bust') || prev.players[prev.current].faceUp.length >= E.DANGER ? 'Checking for a match…' : '');
    logAt(turnNo, drawEv.pid, 'draw', `Drew a ${drawEv.card.v}`, drawEv.card.v);
    await animate(before, { fromDeck: [drawEv.card.id] });
    if (token !== ui.token) return;
    await wait(ev.some(e => e.t === 'bust' || e.t === 'offer') ? 380 : bot ? 240 : 60, bot);
    if (token !== ui.token) return;
  }

  // 2. Resolve it.
  const gone = {};
  for (const e of ev) {
    if (e.t === 'bank') for (const id of e.ids) gone[id] = lootEl(e.pid);
    if (e.t === 'bust') for (const id of e.ids) gone[id] = () => $('#lost');
  }
  const bust = ev.find(e => e.t === 'bust'), steal = ev.find(e => e.t === 'steal');
  if (bust) {
    stageFx('shake flash red'); play('thud'); haptic('error');
    banner({ title: 'BUST!', sub: `${name(bust.pid)} ${verb(bust.pid, 'lose', 'loses')} ${plural(bust.count, 'card')}, ${bust.value} Loot`, kind: 'bust', ms: 1300 });
    say(bust.pid, 'bust');
    await wait(420, false);
    if (token !== ui.token) return;
  }
  if (steal) {
    stageFx('flash gold'); play('slap'); haptic('heavy');
    for (const v of steal.victims) flashSeat(v.pid);
    banner({ title: 'SLAP!', sub: `${name(steal.pid)} ${verb(steal.pid, 'steal', 'steals')} ${steal.count}× ${steal.card.v} from ${list(steal.victims.map(v => obj(v.pid)))}`, kind: 'steal', ms: 1150 });
  }

  const before = snapshot();
  const fromRects = {};
  for (const e of ev) if (e.t === 'bank') { const r = e.ids.map(id => before.get(String(id))?.r).find(Boolean); if (r) fromRects[e.pid] = { x: r.left + r.width / 2, y: r.top }; }
  render(s);
  await animate(before, { gone });
  if (token !== ui.token) return;

  // 3. Scores, words and the log.
  const bankEvents = ev.filter(e => e.t === 'bank');
  if (bankEvents.length) {
    play('bank', Math.min(8, Math.ceil(bankEvents.reduce((t, e) => t + e.amount, 0) / 4)));
    if (!bot && !bankEvents.some(e => e.final)) haptic('success');
    await Promise.all(bankEvents.map((e, i) => {
      const el = $(`#loot-${e.pid}`);
      floater(`+${e.amount}`, fromRects[e.pid], el, { delay: i * 90 });
      ui.shown[e.pid] = s.players[e.pid].score;
      return wait(700 + i * 90, false).then(() => countUp(el, s.players[e.pid].score, { from: +el?.textContent || 0 })).then(() => bump($(`#loot-${e.pid}`)));
    }));
  }

  let pause = 0;
  for (const e of ev) {
    switch (e.t) {
      case 'bank':
        logAt(e.final ? 'final' : turnNo, e.pid, 'bank', `Banked ${e.amount} Loot`);
        if (!e.final && e.amount >= 15) say(e.pid, 'bank', .35);
        break;
      case 'turn': {
        const banked = ev.find(x => x.t === 'bank');
        if (e.pid === 0) {
          play('turn');
          setMessage('Your turn', banked ? `You banked ${banked.amount}. Draw your first card.` : 'Tap the deck to draw your first card.');
        } else {
          setMessage(banked ? `${name(e.pid)} banks ${banked.amount}` : `${name(e.pid)}'s turn`, banked ? 'Banked Loot is safe for good.' : s.players[e.pid].persona);
        }
        pause = banked ? 520 : 260;
        break;
      }
      case 'keep':
        if (!ev.some(x => x.t === 'steal' || x.t === 'pass')) {
          setMessage(`${name(e.pid)} ${verb(e.pid, 'draw', 'draws')} a ${e.card.v}`, noteFor(e.pid));
        }
        pause = bot ? 160 : 0;
        break;
      case 'offer': {
        const from = list(e.victims.map(v => obj(v.pid)));
        if (e.pid === 0) setMessage(`Steal ${e.count}× ${e.card.v}?`, `From ${from}. Or pass and keep just your ${e.card.v}.`);
        else setMessage(`${name(e.pid)} can steal ${e.count}× ${e.card.v}`, `From ${from}…`);
        if (e.victims.some(v => v.pid === 0) && e.pid !== 0) haptic('medium');
        break;
      }
      case 'steal':
        setMessage(`${name(e.pid)} ${verb(e.pid, 'steal', 'steals')} ${e.count}× ${e.card.v}!`, `+${e.value} Loot from ${list(e.victims.map(v => obj(v.pid)))}`);
        logAt(turnNo, e.pid, 'steal', `Stole ${e.count}× ${e.card.v} from ${list(e.victims.map(v => obj(v.pid)))}`, e.card.v);
        say(e.pid, 'steal');
        for (const v of e.victims) if (v.pid !== 0) setTimeout(() => say(v.pid, 'robbed', .5), 700);
        pause = 650;
        break;
      case 'pass':
        setMessage(`${name(e.pid)} ${verb(e.pid, 'pass', 'passes')}`, `The ${e.card.v}s stay with ${list(e.victims.map(v => obj(v.pid)))}.`);
        logAt(turnNo, e.pid, 'pass', `Passed on ${e.count}× ${e.card.v}`, e.card.v);
        pause = 420;
        break;
      case 'bust':
        setMessage(`${name(e.pid)} ${verb(e.pid, 'bust', 'busts')}!`, `${plural(e.count, 'card')} and ${e.value} Loot are lost.`, { bad: true });
        logAt(turnNo, e.pid, 'bust', `Busted on a ${e.card.v} and lost ${e.value} Loot`, e.card.v);
        if (bot) floater(`-${e.value}`, null, null, { kind: 'bad' });
        pause = 900;
        break;
      case 'stop':
        setMessage(`${name(e.pid)} ${verb(e.pid, 'keep', 'keeps')} ${e.value}`, e.pid === 0 ? 'Your cards bank when your next turn starts.' : `Steal them before ${name(e.pid)}'s next turn.`);
        logAt(turnNo, e.pid, 'stop', `Kept ${plural(e.count, 'card')} out (${e.value} Loot)`);
        play('clink', 2);
        pause = 520;
        break;
      case 'empty':
        setMessage('Last card!', "Everyone banks what's in front of them.");
        logAt('final', null, 'empty', 'The deck ran out. Everyone banked their exposed cards.');
        break;
    }
  }
  if (s.log?.length > 240) s.log.splice(0, s.log.length - 240);
  if (!$('#sheet').hidden && !$('[data-panel="log"]').hidden) renderLog();
  save();
  if (pause) await wait(pause, bot);
}

// ---------- game loop ----------
function input() { return new Promise(r => { ui.resolve = r; render(); }); }
function send(a) {
  if (!ui.resolve) return false;
  const r = ui.resolve; ui.resolve = null; r(a);
  return true;
}

async function loop(token) {
  while (s && token === ui.token) {
    if (s.phase === 'over') { await gameOver(token); return; }
    const p = E.active(s);
    let a;
    if (s.phase === 'turn-start') {
      ui.hurry = false;
      await wait(p.human ? 120 : 260, !p.human);
      a = { type: 'begin' };
    } else if (p.human) {
      a = await input();
      if (token !== ui.token) return;
    } else {
      render();
      await wait(s.phase === 'steal' ? 650 : s.draws === 0 ? 420 : 720);
      if (token !== ui.token) return;
      a = E.botAction(s);
    }
    const prev = structuredClone(s), ev = E.act(s, a);
    if (!ev) { play('error'); haptic('error'); continue; }
    await present(prev, ev, token);
  }
}

async function gameOver(token) {
  clearSave();
  ui.resolve = null;
  render();
  const r = s.result, names = r.winners.map(name);
  const iWon = r.winners.includes(0);
  setMessage(r.winners.length > 1 ? 'A tie at the top!' : iWon ? 'You win!' : `${names[0]} wins`, `${list(names)} · ${r.high} Loot`);
  if (!ui.recorded) {
    ui.recorded = true;
    const st = stats();
    setStats({ played: st.played + 1, wins: st.wins + (iWon ? 1 : 0), best: Math.max(st.best, s.players[0].score) });
  }
  await wait(900, false);
  if (token !== ui.token) return;
  showResult(true);
}

function showResult(celebrate = false) {
  const r = s.result, iWon = r.winners.includes(0), names = r.winners.map(name);
  const title = $('#result-title');
  title.textContent = r.winners.length > 1 ? (iWon ? 'You tie for the win!' : `${list(names)} tie!`) : iWon ? 'You win!' : `${names[0]} wins`;
  title.classList.toggle('defeat', !iWon);
  let rank = 0, last = null;
  $('#standings').innerHTML = E.standings(s).map((p, i) => {
    if (p.score !== last) { rank = i + 1; last = p.score; }
    const bits = [];
    if (p.stats.bestSteal) bits.push(`best steal ${p.stats.bestSteal.count}× ${p.stats.bestSteal.v}`);
    bits.push(p.stats.busts ? `${plural(p.stats.busts, 'bust')}` : 'no busts');
    if (p.stats.bestBank) bits.push(`top bank ${p.stats.bestBank}`);
    const detail = bits.join(' · ');
    return `<li class="${rank === 1 ? 'first' : ''}${p.human ? ' me' : ''}" style="--i:${i}"><span class="st-rank">${rank}</span>${avatar(p.id, p.human ? 'lg me' : 'lg')}<span class="st-name"><b>${p.human ? 'You' : `${p.name} <small style="display:inline;color:var(--muted)">${p.persona}</small>`}</b><small>${detail.charAt(0).toUpperCase() + detail.slice(1)}</small></span><span class="st-score">${p.score}</span></li>`;
  }).join('');
  const st = stats();
  $('#result-career').textContent = st.played ? `You've won ${st.wins} of ${plural(st.played, 'game')} · Best Loot ${st.best}` : '';
  $('#result').hidden = false;
  if (celebrate) {
    if (iWon) { play('win'); haptic('success'); setTimeout(() => confetti(), 250); } else play('lose');
  }
}

function begin(state) {
  ui.token++; ui.resolve = null; ui.hurry = false; ui.recorded = state.phase === 'over'; ui.dockKey = ''; ui.headline = '';
  s = state;
  s.log ||= [];
  ui.shown = Object.fromEntries(s.players.map(p => [p.id, p.score]));
  $('#title').hidden = true; $('#result').hidden = true; $('#app').hidden = false;
  closeSheet(true);
  render();
  const token = ui.token;
  if (s.phase === 'turn-start' && s.turn === 1) setMessage('Cards are shuffled', 'You have the first turn.');
  else setMessage(`${name(s.current)} ${verb(s.current, 'are', 'is')} up`, 'Game resumed.');
  if (!seen(TOUR)) setTimeout(() => startTour(), 450);
  loop(token);
}

function newGame() {
  clearSave();
  begin(E.newGame({ difficulty: prefs.difficulty }));
  save();
}

function showTitle() {
  ui.token++; ui.resolve = null;
  closeSheet(true); endTour(false);
  const saved = load(), st = stats();
  $('[data-action="resume"]').hidden = !saved;
  const newBtn = $('#title [data-action="new"]');
  newBtn.textContent = saved ? 'New game' : 'Deal the cards';
  newBtn.classList.toggle('secondary', Boolean(saved));
  $('#career').textContent = st.played ? `You've won ${st.wins} of ${plural(st.played, 'game')} · Best Loot ${st.best}` : '';
  $('#app').hidden = true; $('#result').hidden = true; $('#title').hidden = false;
}

// ---------- sheet: rules, log, settings ----------
function openSheet(tab = 'rules') {
  const wrap = $('#sheet');
  showTab(tab);
  syncSettings();
  wrap.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('in')));
  $('.sheet-card').focus({ preventScroll: true });
  play('sheet');
}
function closeSheet(instant = false) {
  const wrap = $('#sheet'), card = $('.sheet-card');
  if (wrap.hidden) return;
  wrap.classList.remove('in');
  card.style.transform = '';
  ui.confirmNew = 0;
  if (instant || reduced()) { wrap.hidden = true; return; }
  setTimeout(() => { if (!wrap.classList.contains('in')) wrap.hidden = true; }, 300);
}
function showTab(tab) {
  $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  $$('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== tab; });
  if (tab === 'log') renderLog();
  $('.sheet-body').scrollTop = tab === 'log' ? 1e6 : 0;
}
function renderLog() {
  const el = $('#log');
  if (!s?.log?.length) { el.innerHTML = '<p class="log-empty">Every draw, steal, bust and bank will show up here.</p>'; return; }
  const turns = [];
  for (const e of s.log) {
    const last = turns.at(-1);
    if (last && last.turn === e.turn && (e.turn === 'final' || last.pid === e.pid)) last.items.push(e);
    else turns.push({ turn: e.turn, pid: e.pid, items: [e] });
  }
  const glyph = { bank: '＋', stop: '✋', empty: '◼' };
  el.innerHTML = turns.slice(-40).map(t => {
    const head = t.turn === 'final' ? '<h4>Final count</h4>' : `<h4>${avatar(t.pid, 'sm')}Turn ${t.turn} · ${name(t.pid)}</h4>`;
    const items = t.items.map(e => `<li class="${e.kind}">${e.v ? mini(e.v) : `<span class="glyph" aria-hidden="true">${glyph[e.kind] || '·'}</span>`}<span>${t.turn === 'final' && e.pid != null ? `${name(e.pid)}: ` : ''}${esc(e.text)}</span></li>`).join('');
    return `<section class="log-turn${t.pid === 0 && t.turn !== 'final' ? ' mine' : ''}">${head}<ul>${items}</ul></section>`;
  }).join('');
  if (!$('[data-panel="log"]').hidden) $('.sheet-body').scrollTop = 1e6;
}
function syncSettings() {
  $$('[data-pref]').forEach(i => { i.checked = Boolean(prefs[i.dataset.pref]); });
  $$('[data-choice]').forEach(g => g.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(prefs[g.dataset.choice] === b.dataset.value))));
  const cap = d => d.charAt(0).toUpperCase() + d.slice(1);
  $('#difficulty-hint').textContent = s && s.phase !== 'over' && !$('#app').hidden && s.difficulty !== prefs.difficulty
    ? `This game is on ${cap(s.difficulty)}. ${cap(prefs.difficulty)} starts with your next game.`
    : 'Applies from your next game.';
  const n = $('#sheet [data-action="new"]');
  n.textContent = ui.confirmNew > Date.now() ? 'Tap again to abandon this game' : 'New game';
  n.style.color = ui.confirmNew > Date.now() ? 'var(--danger)' : '';
  $('#sheet [data-action="quit"]').hidden = $('#app').hidden;
}

// swipe the sheet down to close it
let drag = null;
$('.sheet-card').addEventListener('pointerdown', ev => {
  if (!ev.target.closest('.grabber, .sheet-head') || ev.target.closest('button')) return;
  drag = { y0: ev.clientY, t0: performance.now(), dy: 0 };
  $('.sheet-card').style.transition = 'none';
  $('.sheet-card').setPointerCapture?.(ev.pointerId);
});
$('.sheet-card').addEventListener('pointermove', ev => {
  if (!drag) return;
  drag.dy = Math.max(0, ev.clientY - drag.y0);
  $('.sheet-card').style.transform = `translateY(${drag.dy}px)`;
});
function endDrag() {
  if (!drag) return;
  const d = drag, card = $('.sheet-card'); drag = null;
  card.style.transition = '';
  const v = d.dy / Math.max(1, performance.now() - d.t0);
  if (d.dy > 110 || (d.dy > 30 && v > .6)) { haptic(); closeSheet(); } else card.style.transform = '';
}
$('.sheet-card').addEventListener('pointerup', endDrag);
$('.sheet-card').addEventListener('pointercancel', endDrag);

// ---------- walkthrough ----------
const STEPS = [
  { sel: '#deck', title: 'Draw a card', text: 'Tap the deck, or the Draw button, to flip the top card. You must draw at least one card every turn.' },
  { sel: '#stage', title: 'The danger line', text: 'Once three cards are in front of you, drawing a value you already have is a bust, and you lose them all. The dots show how close you are.' },
  { sel: '#opponents', title: 'Steal from the table', text: 'Draw a value another player has exposed and you can take every one of their cards of that value.' },
  { sel: '#dock', title: 'Keep, then bank', text: 'Keep ends your turn. Your cards stay out, where others can steal them, until your next turn starts. Then they bank into your Loot for good.' },
];
function startTour() {
  if ($('#app').hidden) return;
  closeSheet(true);
  ui.tour = 0; $('#tour').hidden = false; showStep();
}
function showStep() {
  const st = STEPS[ui.tour], el = $(st.sel);
  if (!el) return endTour();
  const r = el.getBoundingClientRect(), pad = 6, hole = $('#tour-hole'), tip = $('#tour-tip');
  Object.assign(hole.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
  $('#tour-step').textContent = `${ui.tour + 1} of ${STEPS.length}`;
  $('#tour-title').textContent = st.title;
  $('#tour-text').textContent = st.text;
  $('[data-action="tour-next"]').textContent = ui.tour === STEPS.length - 1 ? 'Got it' : 'Next';
  const tipH = tip.offsetHeight || 170, below = r.bottom + pad + 14, above = r.top - pad - 14 - tipH;
  tip.style.top = `${below + tipH < innerHeight - 10 ? below : Math.max(10, above)}px`;
  $('[data-action="tour-next"]').focus({ preventScroll: true });
}
function endTour(mark = true) { ui.tour = null; $('#tour').hidden = true; if (mark) markSeen(TOUR); }

// ---------- fullscreen ----------
const canFullscreen = Boolean((document.fullscreenEnabled || document.webkitFullscreenEnabled)
  && !matchMedia('(display-mode: standalone)').matches && !navigator.standalone);
$$('[data-needs-fullscreen]').forEach(el => { el.hidden = !canFullscreen; });
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement || document.webkitFullscreenElement) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else await (document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen).call(document.documentElement);
  } catch { toast('Fullscreen is not available here.'); }
}
function syncFullscreen() {
  const on = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
  $$('.icon-button[data-action="fullscreen"]').forEach(b => b.setAttribute('aria-label', on ? 'Exit fullscreen' : 'Enter fullscreen'));
}
document.addEventListener('fullscreenchange', syncFullscreen);
document.addEventListener('webkitfullscreenchange', syncFullscreen);

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.timer); toast.timer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ---------- input wiring ----------
function human(type) {
  if (!s || s.phase === 'over' || ui.tour != null) return;
  const btn = $(`#dock [data-act="${type}"]`);
  if (type === 'stop' && s.draws < 1) { play('error'); haptic('error'); setMessage('Draw a card first', 'You must draw at least one card each turn.'); return; }
  if (btn?.disabled && !ui.resolve) return;
  if (send({ type })) { play('tap'); haptic(type === 'steal' ? 'medium' : 'light'); }
}

$('#deck').addEventListener('click', () => human('draw'));
$('#dock').addEventListener('click', ev => {
  const b = ev.target.closest('[data-act]');
  if (b && !b.disabled) human(b.dataset.act);
});
$('#board').addEventListener('pointerdown', () => {
  if (s && s.phase !== 'over' && !E.active(s).human && !ui.hurry) { ui.hurry = true; render(); }
});

document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'new') {
    if (t.closest('#sheet') && s && s.phase !== 'over' && s.draws + s.turn > 1 && ui.confirmNew < Date.now()) {
      ui.confirmNew = Date.now() + 3000; haptic('medium'); syncSettings(); setTimeout(syncSettings, 3100); return;
    }
    play('tap'); haptic(); newGame();
  } else if (a === 'resume') { const v = load(); play('tap'); haptic(); if (v) begin(v); else newGame(); }
  else if (a === 'rules') { openSheet('rules'); }
  else if (a === 'menu') { haptic(); openSheet(s?.log?.length ? 'log' : 'rules'); }
  else if (a === 'close-sheet') closeSheet();
  else if (a === 'fullscreen') toggleFullscreen();
  else if (a === 'results') { play('tap'); showResult(); }
  else if (a === 'view-table') { $('#result').hidden = true; render(); }
  else if (a === 'quit') { save(); showTitle(); }
  else if (a === 'tour') { if ($('#app').hidden) { toast('Start a game to see the walkthrough.'); return; } startTour(); }
  else if (a === 'tour-next') { play('tap'); if (++ui.tour >= STEPS.length) endTour(); else showStep(); }
  else if (a === 'tour-skip') endTour();
});
$$('[data-tab]').forEach(b => b.addEventListener('click', () => { if (b.getAttribute('aria-selected') !== 'true') { play('tap'); haptic(); } showTab(b.dataset.tab); }));
$$('[data-pref]').forEach(i => i.addEventListener('change', () => {
  setPref(i.dataset.pref, i.checked);
  if (i.dataset.pref === 'haptics' && i.checked) haptic('medium');
  if (i.dataset.pref === 'sound' && i.checked) play('clink', 3);
  render();
}));
$$('[data-choice] button').forEach(b => b.addEventListener('click', () => {
  setPref(b.closest('[data-choice]').dataset.choice, b.dataset.value);
  play('tap'); haptic(); syncSettings();
}));
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { if (ui.tour != null) endTour(); else closeSheet(); return; }
  if (!$('#sheet').hidden || ui.tour != null || $('#app').hidden || !$('#result').hidden || ev.target.closest('button, input, a')) return;
  const k = ev.key.toLowerCase();
  if (k === 'd' || k === ' ') { ev.preventDefault(); human(s?.phase === 'steal' ? 'steal' : 'draw'); }
  else if (k === 'k' || k === 'enter') human(s?.phase === 'steal' ? 'pass' : 'stop');
});
let resizeTimer;
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { render(); if (ui.tour != null) showStep(); }, 120); });
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ---------- boot ----------
document.fonts?.load('25px "Lilita One"').catch(() => {});
showTitle();
