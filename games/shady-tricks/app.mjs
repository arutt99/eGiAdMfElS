import * as E from './engine.mjs';
import { prefs, setPref, haptic, play as sfx, banner, floater, countUp, bump, confetti, reduced } from './fx.mjs';

const SAVE = 'shady.v1', STATS = 'shady.stats', TOUR = 'shady.tour';
const $ = sel => document.querySelector(sel), $$ = sel => [...document.querySelectorAll(sel)];
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// ---------- people ----------
const LOOK = {
  0: { tint: '#e8b84d', initial: 'Y' },
  1: { tint: '#4f9fd4', initial: 'S' },
  2: { tint: '#a877d6', initial: 'M' },
  3: { tint: '#e07b54', initial: 'C' },
};
const LINES = {
  schemer: { take: ['As planned.', 'Second best is best.', 'Mine, I think.'], cancel: ['Poof.', 'Gone, just like that.'], ouch: ['Hm. A setback.', 'Not ideal.'] },
  duchess: { take: ['How delightful.', 'I shall keep these.'], cancel: ['Much tidier.', 'Splendid.'], ouch: ['How vulgar.', 'Unacceptable.'] },
  fool: { take: ['Wheee!', 'Did I do that?'], cancel: ['Abracadabra!', 'Ha! Vanished!'], ouch: ['Oops.', 'Oh dear, oh dear.'] },
};
const SUIT = { red: 'Red', blue: 'Blue', green: 'Green', orange: 'Orange', jester: 'Jester' };

// ---------- state ----------
let s = null;
const ui = { token: 0, resolve: null, hurry: false, sel: null, shown: {}, recorded: false, tour: null, confirmNew: 0, headline: '', roundShown: 0, focusPid: null };

const name = pid => (pid === 0 ? 'You' : s.players[pid].name);
const obj = pid => (pid === 0 ? 'you' : s.players[pid].name);
const verb = (pid, you, them) => (pid === 0 ? you : them);
const poss = pid => (pid === 0 ? 'your' : `${s.players[pid].name}'s`);
const Poss = pid => (pid === 0 ? 'Your' : `${s.players[pid].name}'s`);
const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const num = r => (r < 0 ? `−${-r}` : `${r}`);
const signed = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
const cardName = c => (c.suit === 'jester' ? `Jester ${c.rank}` : `${SUIT[c.suit]} ${num(c.rank)}`);
const cardLower = c => (c.suit === 'jester' ? `Jester ${c.rank}` : `${c.suit} ${num(c.rank)}`);
const list = xs => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

function load() { try { const v = JSON.parse(localStorage.getItem(SAVE)); return E.validSave(v) && v.phase !== 'over' ? v : null; } catch { return null; } }
function save() { try { if (s && s.phase !== 'over') localStorage.setItem(SAVE, JSON.stringify(s)); } catch { /* storage unavailable */ } }
function clearSave() { try { localStorage.removeItem(SAVE); } catch { /* storage unavailable */ } }
function stats() { try { return { played: 0, wins: 0, best: 0, ...JSON.parse(localStorage.getItem(STATS)) }; } catch { return { played: 0, wins: 0, best: 0 }; } }
function setStats(v) { try { localStorage.setItem(STATS, JSON.stringify(v)); } catch { /* storage unavailable */ } }
function seen(key) { try { return localStorage.getItem(key) === '1'; } catch { return true; } }
function markSeen(key) { try { localStorage.setItem(key, '1'); } catch { /* storage unavailable */ } }
const careerText = st => (st.played ? `You've won ${st.wins} of ${plural(st.played, 'game')}${st.best ? ` · Best finish ${st.best}` : ''}` : '');

const SPEED = { relaxed: 1.5, normal: 1, fast: .5 };
function wait(ms, bot = true) {
  const k = bot ? (ui.hurry ? .25 : SPEED[prefs.speed] || 1) : 1;
  return new Promise(r => setTimeout(r, ms * k));
}

// ---------- markup ----------
const avatar = (pid, cls = '') => `<span class="avatar ${cls}" style="--tint:${LOOK[pid].tint}" aria-hidden="true">${LOOK[pid].initial}</span>`;
const icon = suit => `<svg aria-hidden="true"><use href="#i-${suit}"/></svg>`;
function cardHTML(c, cls = '', attrs = '') {
  const idx = `<b>${num(c.rank)}</b>${icon(c.suit)}`;
  return `<div class="card s-${c.suit}${c.rank < 0 ? ' neg' : ''}${cls ? ` ${cls}` : ''}" data-id="${c.id}" ${attrs}><span class="idx">${idx}</span><svg class="art" aria-hidden="true"><use href="#i-${c.suit}"/></svg><span class="idx br" aria-hidden="true">${idx}</span></div>`;
}
const pip = (c, cls = '') => `<span class="pip s-${c.suit}${cls ? ` ${cls}` : ''}" data-pip="${c.id}" title="${cardName(c)}">${num(c.rank)}</span>`;
const pips = (cards, mark = {}) => cards.slice().sort((a, b) => a.rank - b.rank).map(c => pip(c, mark[c.id] || '')).join('');
const gauge = (total, round) => {
  const proj = Math.max(0, total + round), w = v => `${Math.min(100, v / E.LIMIT * 100)}%`;
  return `<span class="gauge${proj > E.LIMIT ? ' over' : ''}" aria-hidden="true"><i class="proj" style="width:${w(Math.max(total, proj))}"></i><i class="now" style="width:${w(Math.min(total, proj))}"></i><i class="line"></i></span>`;
};

// ---------- render ----------
function render(view = s) {
  if (!view || $('#app').hidden) return;
  $('#progress').textContent = view.phase === 'round' || view.phase === 'over' ? `Round ${view.round} complete` : `Round ${Math.max(1, view.round)} · Trick ${Math.min(12, Math.max(1, view.trick))} of 12`;
  for (const pid of [1, 2, 3]) renderSeat(view, pid);
  renderMe(view);
  renderTrick(view);
  renderHand(view);
}

const playing = v => v.phase === 'play';
function renderSeat(view, pid) {
  const p = view.players[pid], el = $(`#seat-${pid}`), round = E.sum(p.tableau), total = ui.shown[pid] ?? p.score;
  const active = playing(view) && view.current === pid, proj = Math.max(0, total + round);
  el.classList.toggle('active', active);
  el.classList.toggle('danger', proj > E.LIMIT);
  el.style.setProperty('--tint', LOOK[pid].tint);
  el.setAttribute('aria-label', `${p.name}, ${p.persona}. ${total} points, ${signed(round)} this round. ${plural(p.hand.length, 'card')} in hand.`);
  el.innerHTML = `<button class="seat-btn" type="button" data-action="seat" data-pid="${pid}" aria-label="Show ${esc(p.name)}'s tableau">
    <span class="seat-head">${avatar(pid)}<span class="who"><b>${p.name}</b><small>${active ? '<span class="dots"><i></i><i></i><i></i></span>' : p.persona}</small></span></span>
    <span class="seat-score"><b class="total" id="total-${pid}">${total}</b><span class="delta${round < 0 ? ' neg' : round > 0 ? ' pos' : ''}" id="delta-${pid}">${signed(round)}</span><span class="in-hand" title="${plural(p.hand.length, 'card')} in hand"><i></i>${p.hand.length}</span></span>
    ${gauge(total, round)}
    <span class="tab" id="tab-${pid}">${p.tableau.length ? pips(p.tableau, ui.mark?.[pid]) : '<span class="tab-empty">No cards yet</span>'}</span>
  </button>`;
}

function renderMe(view) {
  const me = view.players[0], round = E.sum(me.tableau), total = ui.shown[0] ?? me.score, el = $('#seat-0');
  const myTurn = playing(view) && view.current === 0, proj = Math.max(0, total + round);
  el.classList.toggle('active', myTurn);
  el.classList.toggle('danger', proj > E.LIMIT);
  el.innerHTML = `<button class="seat-btn" type="button" data-action="seat" data-pid="0" aria-label="Show your tableau">
    ${avatar(0, 'me')}
    <span class="me-mid"><span class="me-title"><b>Your tableau</b><small>${proj > E.LIMIT ? `Over ${E.LIMIT} if the round ended now` : me.tableau.length ? `${plural(me.tableau.length, 'card')}` : 'No cards yet'}</small></span>
      <span class="tab" id="tab-0">${me.tableau.length ? pips(me.tableau, ui.mark?.[0]) : ''}</span></span>
    <span class="me-score"><span class="seat-score"><b class="total" id="total-0">${total}</b><span class="delta${round < 0 ? ' neg' : round > 0 ? ' pos' : ''}" id="delta-0">${signed(round)}</span></span>${gauge(total, round)}</span>
  </button>`;
}

function renderTrick(view) {
  const tr = $('#trick');
  tr.querySelectorAll('.card').forEach(c => c.remove());
  const resolving = view.phase === 'resolve';
  const taker = (resolving || prefs.hints) ? E.takerOf(view.table, view.lead) : null;
  const html = view.table.map(x => cardHTML(x.card, `pos-${x.pid}${taker === x ? (resolving ? ' winner' : ' taking') : ''}`, `aria-label="${esc(`${name(x.pid)}: ${cardName(x.card)}`)}"`)).join('');
  tr.insertAdjacentHTML('beforeend', html);
  if (taker) tr.querySelector(`.card[data-id="${taker.card.id}"]`)?.insertAdjacentHTML('beforeend', `<span class="ribbon">${resolving ? 'Takes it' : 'Taking'}</span>`);
  tr.querySelectorAll('.slot').forEach((sl, i) => sl.classList.toggle('turn', playing(view) && view.current === i && !view.table.some(x => x.pid === i)));
  const lead = $('#lead');
  tr.style.setProperty('--lead', view.lead ? `var(--${view.lead})` : 'transparent');
  tr.classList.toggle('has-lead', Boolean(view.lead));
  if (view.lead) lead.innerHTML = `<span class="lead-chip s-${view.lead}">${icon(view.lead)}${SUIT[view.lead]} led</span>`;
  else if (view.table.length) lead.innerHTML = '<span class="lead-chip open">No lead yet</span>';
  else lead.innerHTML = '';
}

function canPlay(view = s) { return Boolean(view === s && ui.resolve && s.phase === 'play' && s.current === 0); }

function renderHand(view) {
  const hand = $('#hand'), me = view.players[0], live = canPlay(view);
  const legal = new Set(live ? E.validPlays(view, me.hand).map(c => c.id) : []);
  const pairs = new Set(me.tableau.map(c => c.rank));
  if (ui.sel != null && !legal.has(ui.sel)) ui.sel = null;
  hand.classList.toggle('live', live);
  hand.innerHTML = me.hand.map(c => {
    const ok = legal.has(c.id), cls = [live ? (ok ? 'legal' : 'illegal') : 'idle', ui.sel === c.id ? 'selected' : '', prefs.hints && pairs.has(c.rank) ? 'pairs' : ''].filter(Boolean).join(' ');
    const label = `${cardName(c)}${live && !ok ? ', cannot be played now' : ''}${prefs.hints && pairs.has(c.rank) ? ', cancels a card in your tableau' : ''}`;
    return cardHTML(c, cls, `role="button" tabindex="${live && ok ? 0 : -1}" aria-label="${esc(label)}"${live && !ok ? ' aria-disabled="true"' : ''}`);
  }).join('');
  layoutHand();
  hand.setAttribute('aria-label', live ? `Your hand. ${plural(legal.size, 'card')} you can play.` : `Your hand, ${plural(me.hand.length, 'card')}`);
}

function layoutHand() {
  const hand = $('#hand'), cards = [...hand.querySelectorAll('.card')], n = cards.length;
  const W = hand.clientWidth || innerWidth - 20;
  const big = matchMedia('(min-width: 700px) and (min-height: 760px)').matches;
  const cw = Math.round(Math.max(44, Math.min(big ? 100 : 74, W * .19, innerHeight * (innerHeight < 500 ? .15 : .105))));
  hand.style.setProperty('--cw', `${cw}px`);
  const step = n > 1 ? Math.min(cw * .74, (W - cw - 30) / (n - 1)) : 0, x0 = (W - cw - step * (n - 1)) / 2;
  cards.forEach((el, i) => {
    const k = i - (n - 1) / 2, spread = Math.min(1.6, 15 / Math.max(n, 1));
    el.style.setProperty('--x', `${(x0 + i * step).toFixed(1)}px`);
    el.style.setProperty('--y', `${(k * k * .22 * cw / 66).toFixed(1)}px`);
    el.style.setProperty('--r', `${(k * spread).toFixed(2)}deg`);
    el.style.zIndex = String(i + 1);
  });
}

let lastSr = '';
function setMessage(head, note = '', { bad = false, good = false } = {}) {
  const h = $('#headline');
  if (head !== ui.headline) { h.textContent = head; h.classList.remove('pop'); void h.offsetWidth; h.classList.add('pop'); ui.headline = head; }
  h.classList.toggle('bad', bad);
  h.classList.toggle('good', good);
  $('#note').innerHTML = note;
  const sr = `${head}. ${$('#note').textContent}`;
  if (sr !== lastSr) { $('#sr').textContent = sr; lastSr = sr; }
}

// What the status line says when it is someone's turn.
function turnMessage() {
  if (s.phase !== 'play') return;
  const pid = s.current, taker = prefs.hints ? E.takerOf(s.table, s.lead) : null;
  const takerNote = taker ? `${name(taker.pid)} ${verb(taker.pid, 'are', 'is')} taking it with ${cardLower(taker.card)}` : '';
  if (pid !== 0) {
    setMessage(`${name(pid)}'s turn`, takerNote || (ui.hurry ? 'Hurrying…' : 'Tap the table to hurry'));
    return;
  }
  if (ui.sel != null) return previewMessage();
  const hand = s.players[0].hand;
  if (!s.table.length) setMessage('Your lead', 'Any card. The first coloured card sets the lead.');
  else if (!s.lead) setMessage('Your turn', 'No lead yet: the next coloured card sets it.');
  else if (hand.some(c => c.suit === s.lead)) setMessage(`Follow ${s.lead}`, takerNote ? `${takerNote}. Jesters are always allowed.` : 'Or play a Jester.');
  else setMessage(`No ${s.lead}: play anything`, takerNote ? `${takerNote}. Off-colour cards go to the taker.` : 'Off-colour cards go to whoever takes the trick.');
}

// With a card picked, say what playing it would do.
function previewMessage() {
  const c = s.players[0].hand.find(x => x.id === ui.sel);
  if (!c) return turnMessage();
  const again = prefs.oneTap ? '' : ' Tap again to play.';
  const pairs = s.players[0].tableau.find(x => x.rank === c.rank);
  if (!prefs.hints) { setMessage(cardName(c), `Tap again to play it.`); return; }
  const lead = s.lead || (E.isJester(c) ? null : c.suit);
  const table = [...s.table, { pid: 0, card: c }], split = E.splitTrick(table, lead);
  let note;
  if (!s.table.length) note = E.isJester(c) ? 'A Jester leaves the lead open.' : `Leads ${c.suit}. Lower cards are safer: second-highest takes it.`;
  else if (split.win?.pid === 0) note = `You'd be taking it so far: ${signed(E.sum(split.taken))}.`;
  else if (lead && !E.isJester(c) && c.suit !== lead) note = split.win ? `Off-colour: goes to ${obj(split.win.pid)} if ${split.win.pid === 0 ? 'you' : 'they'} keep it.` : 'Off-colour: goes to whoever takes the trick.';
  else note = split.win ? `${name(split.win.pid)} would be taking it${E.takerOf(s.table, s.lead)?.pid === split.win.pid ? ' still' : ' instead'}.` : 'No lead yet.';
  if (pairs && (split.win?.pid === 0 || !s.table.length)) note += ` Cancels your ${num(c.rank)} if you take it.`;
  setMessage(cardName(c), `${note}${again}`);
}

// ---------- motion ----------
function snapshot() {
  const m = new Map();
  for (const el of $$('#app .card[data-id]')) {
    const r = el.getBoundingClientRect();
    if (r.width) m.set(el.dataset.id, { r, html: el.outerHTML, cw: parseFloat(getComputedStyle(el).getPropertyValue('--cw')) || r.width });
  }
  return m;
}
const ease = 'cubic-bezier(.2,.8,.25,1)';
// FLIP every card from where it was to where it is now. Cards that appeared fly from `from[id]`
// face down and flip; cards that disappeared fly to `gone[id]` or sink away.
async function animate(before, { gone = {}, from = {} } = {}) {
  const dur = reduced() ? 160 : 420, anims = [], fx = $('#fx'), now = new Set();
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
    } else if (from[id]) {
      const fr = from[id]()?.getBoundingClientRect();
      if (fr?.width) anims.push(flyIn(fr, el, r, dur));
    }
  }
  for (const [id, prev] of before) {
    if (now.has(id)) continue;
    const g = ghost(prev), dest = gone[id]?.()?.getBoundingClientRect();
    const frames = dest
      ? [{ transform: 'none', opacity: 1 }, { transform: `translate(${dest.left + dest.width / 2 - prev.r.left - prev.r.width * .15}px,${dest.top + dest.height / 2 - prev.r.top - prev.r.height * .15}px) scale(.3) rotate(${reduced() ? 0 : 12}deg)`, opacity: .3 }]
      : [{ opacity: 1, transform: 'none', filter: 'none' }, { opacity: 0, transform: `translateY(${reduced() ? 0 : 26}px) scale(.7)`, filter: 'grayscale(1) brightness(.5)' }];
    const a = g.animate(frames, { duration: dur * (dest ? 1.15 : 1.3), easing: 'cubic-bezier(.5,0,.3,1)', fill: 'forwards' });
    a.finished.then(() => g.remove(), () => g.remove());
    anims.push(a);
  }
  await Promise.all(anims.map(a => (a.finished ? a.finished.catch(() => {}) : a)));
}
function ghost(prev) {
  const wrap = document.createElement('div');
  wrap.innerHTML = prev.html;
  const g = wrap.firstElementChild;
  g.className = g.className.replace(/\b(pos-\d|selected|legal|illegal|idle|taking|winner|pairs)\b/g, '');
  g.classList.add('fly');
  g.querySelector('.ribbon')?.remove();
  Object.assign(g.style, { left: `${prev.r.left}px`, top: `${prev.r.top}px`, transformOrigin: '0 0', rotate: '', translate: '' });
  g.style.setProperty('--cw', `${prev.cw}px`);
  $('#fx').append(g);
  return g;
}

// A face-down card flies from a seat, lands where the real card is, and flips over.
async function flyIn(fr, el, r, dur) {
  el.style.visibility = 'hidden';
  const back = document.createElement('div'), w = r.width * .55, h = r.height * .55;
  back.className = 'card back fly';
  const x0 = fr.left + fr.width / 2 - w / 2, y0 = fr.top + fr.height / 2 - h / 2;
  Object.assign(back.style, { left: `${x0}px`, top: `${y0}px`, width: `${w}px`, height: `${h}px`, transformOrigin: '0 0' });
  $('#fx').append(back);
  const tx = r.left - x0, ty = r.top - y0, kx = r.width / w, ky = r.height / h;
  await back.animate([
    { transform: 'none', opacity: .4 },
    { transform: `translate(${tx * .55}px,${ty * .55 - (reduced() ? 0 : 18)}px) scale(${(1 + kx) / 2},${(1 + ky) / 2}) rotate(${reduced() ? 0 : -10}deg)`, opacity: 1 },
    { transform: `translate(${tx}px,${ty}px) scale(${kx},${ky})`, opacity: 1 },
  ], { duration: dur, easing: ease, fill: 'forwards' }).finished.catch(() => {});
  if (!reduced()) await back.animate([{ transform: `translate(${tx}px,${ty}px) scale(${kx},${ky})` }, { transform: `translate(${tx + r.width / 2}px,${ty}px) scale(0,${ky})` }], { duration: 80, easing: 'ease-in', fill: 'forwards' }).finished.catch(() => {});
  back.remove();
  el.style.visibility = '';
  if (!reduced()) await el.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 100, easing: 'ease-out' }).finished.catch(() => {});
}

// Deal: cards spin out of the middle of the table into your hand, one by one.
async function dealIn() {
  const src = $('#trick').getBoundingClientRect(), cx = src.left + src.width / 2, cy = src.top + src.height / 2;
  const cards = $$('#hand .card'), d = reduced() ? 0 : 38;
  for (let i = 0; i < 6; i++) sfx('deal', i * .09);
  await Promise.all(cards.map((el, i) => {
    const r = el.getBoundingClientRect(), dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
    return el.animate([{ transform: `translate(${dx}px,${dy}px) scale(.45) rotate(${reduced() ? 0 : -30}deg)`, opacity: 0 }, { opacity: 1, offset: .25 }, { transform: 'none', opacity: 1 }],
      { duration: reduced() ? 160 : 460, delay: i * d, easing: ease, fill: 'backwards' }).finished.catch(() => {});
  }));
}

function flashSeat(pid, cls = 'took') {
  const el = $(`#seat-${pid}`);
  if (!el) return;
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), 900);
}
function say(pid, kind, chance = .6) {
  if (pid === 0 || Math.random() > chance) return;
  const line = pick(LINES[s.players[pid].style]?.[kind] || []), av = $(`#seat-${pid} .avatar`);
  if (!line || !av) return;
  const r = av.getBoundingClientRect(), el = document.createElement('div');
  el.className = 'say'; el.textContent = line;
  $('#fx').append(el);
  const w = el.offsetWidth;
  Object.assign(el.style, { left: `${Math.max(8, Math.min(r.left - 4, innerWidth - w - 8))}px`, top: `${r.bottom + 6}px` });
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// ---------- presenting events ----------
function logAdd(e) { (s.log ||= []).push({ round: s.round, trick: s.trick, ...e }); if (s.log.length > 400) s.log.splice(0, s.log.length - 400); }

async function present(prev, ev, token) {
  for (const e of ev) {
    if (token !== ui.token) return;
    if (e.t === 'deal') await presentDeal(e, token);
    else if (e.t === 'play') await presentPlay(prev, e, token);
    else if (e.t === 'full') await presentFull(token);
    else if (e.t === 'trick') await presentTrick(prev, e, token);
  }
  if (!$('#sheet').hidden) refreshSheet();
  save();
}

async function presentDeal(e, token) {
  ui.sel = null; ui.mark = null;
  ui.shown = Object.fromEntries(s.players.map(p => [p.id, p.score]));
  render();
  logAdd({ trick: 0, kind: 'round', text: `Round ${e.round}: ${name(e.leader)} ${verb(e.leader, 'lead', 'leads')}.` });
  setMessage(`Round ${e.round}`, `${name(e.leader)} ${verb(e.leader, 'lead', 'leads')}. Two cards are set aside unseen.`);
  banner({ title: `Round ${e.round}`, sub: `${name(e.leader)} ${verb(e.leader, 'lead', 'leads')}`, kind: 'round', ms: 1300 });
  await dealIn();
  if (token !== ui.token) return;
  await wait(380, false);
}

async function presentPlay(prev, e, token) {
  const before = snapshot(), bot = e.pid !== 0;
  if (!bot) ui.sel = null;
  render();
  sfx('deal');
  if (!bot) haptic('light');
  await animate(before, { from: bot ? { [e.card.id]: () => $(`#seat-${e.pid} .avatar`) } : {} });
  if (token !== ui.token) return;
  if (E.isJester(e.card)) sfx('jester');
  if (e.setsLead) $('#lead .lead-chip')?.classList.add('pop');
  logAdd({ pid: e.pid, kind: 'play', text: `${name(e.pid)} ${verb(e.pid, 'play', 'plays')} ${cardLower(e.card)}${e.setsLead ? `, leading ${e.lead}` : ''}`, card: e.card });
  turnMessage();
  if (s.phase === 'play' && s.current === 0) { sfx('turn'); haptic('light'); }
  await wait(bot ? 200 : 120, bot);
}

async function presentFull(token) {
  render();
  const taker = E.takerOf(s.table, s.lead), el = taker && $(`#trick .card[data-id="${taker.card.id}"]`);
  if (el) { el.classList.remove('land'); void el.offsetWidth; el.classList.add('land'); }
  const eligible = s.table.filter(x => E.isJester(x.card) || x.card.suit === s.lead).length;
  setMessage(`${name(taker.pid)} ${verb(taker.pid, 'take', 'takes')} it`, eligible === 1 ? `The only ${s.lead} card or Jester` : `${cardName(taker.card)} is second-highest`);
  await wait(820);
  if (token !== ui.token) return;
}

async function presentTrick(prev, e, token) {
  const pid = e.pid, taker = prev.players[pid];
  // 1. Taken cards fly into the tableau (before any pairs cancel); the rest sink away.
  const view = structuredClone(prev);
  view.table = []; view.lead = null; view.phase = 'resolve';
  view.players[pid].tableau = [...taker.tableau, ...e.taken];
  const mark = {};
  for (const id of e.taken.map(c => c.id)) mark[id] = 'new';
  for (const cx of e.cancelled) for (const id of cx.ids) mark[id] = 'doomed';
  ui.mark = { [pid]: mark };
  const before = snapshot(), gone = {};
  for (const c of e.taken) gone[c.id] = () => $(`#tab-${pid}`);
  render(view);
  sfx('sweep', e.delta <= 0 || pid !== 0);
  if (pid === 0) haptic(e.delta > 0 ? 'medium' : 'success');
  flashSeat(pid);
  await animate(before, { gone });
  if (token !== ui.token) return;

  // 2. Pairs cancel.
  if (e.cancelled.length) {
    await wait(200, false);
    $$(`#tab-${pid} .pip.doomed`).forEach(p => p.classList.add('poof'));
    sfx('poof'); if (pid === 0) haptic('success');
    const tab = $(`#tab-${pid}`).getBoundingClientRect();
    floater(`${list(e.cancelled.map(c => `${num(c.rank)}s`))} cancel`, { x: tab.left + tab.width / 2, y: tab.top - 4 }, null, { kind: 'magic' });
    await wait(520, false);
    if (token !== ui.token) return;
  }
  ui.mark = null;
  render();
  const d = $(`#delta-${pid}`);
  bump(d);

  // 3. Words and the log.
  const takenTxt = e.taken.length > 1 ? ` with ${list(e.taken.filter(c => c.id !== e.card.id).map(cardLower))}` : '';
  const cancelTxt = e.cancelled.length ? ` · ${list(e.cancelled.map(c => `${num(c.rank)}s`))} cancelled` : '';
  setMessage(`${name(pid)} ${verb(pid, 'take', 'takes')} the trick`, `${signed(e.delta)} this round${cancelTxt}`, { good: pid === 0 && e.delta < 0, bad: pid === 0 && E.sum(s.players[0].tableau) + s.players[0].score > E.LIMIT });
  logAdd({ trick: prev.trick, pid, kind: 'take', text: `${name(pid)} ${verb(pid, 'take', 'takes')} it with ${cardLower(e.card)}${takenTxt} (${signed(e.delta)})${cancelTxt}` });
  if (e.cancelled.length) say(pid, 'cancel', .7);
  else if (s.players[pid].score + E.sum(s.players[pid].tableau) > E.LIMIT || e.delta >= 8) say(pid, 'ouch', .6);
  else say(pid, 'take', .3);
  await wait(s.phase === 'play' ? 560 : 900, pid !== 0);
  if (token !== ui.token) return;
  if (s.phase === 'play') turnMessage();
}

// ---------- round summary ----------
function showRound(rr, final) {
  return new Promise(resolve => {
    const modal = $('#round');
    $('#round-kicker').textContent = final ? 'Final round' : 'Round complete';
    $('#round-title').textContent = `Round ${rr.round}`;
    $('#summary').innerHTML = rr.rows.map((r, i) => {
      const fell = r.after > E.LIMIT;
      return `<li class="${r.pid === 0 ? 'me' : ''}${fell ? ' fell' : ''}" style="--i:${i}">
        ${avatar(r.pid)}
        <span class="sum-mid"><b>${name(r.pid)}</b><span class="tab">${r.tableau.length ? pips(r.tableau) : '<span class="tab-empty">Empty tableau</span>'}</span>${gauge(r.before, r.points)}</span>
        <span class="sum-pts${r.points < 0 ? ' neg' : r.points > 0 ? ' pos' : ''}">${signed(r.points)}</span>
        <span class="sum-total"><b data-to="${r.after}">${r.before}</b>${fell ? '<small>Fallen</small>' : `<small>${E.LIMIT - r.after} to spare</small>`}</span>
      </li>`;
    }).join('');
    $('#aside').innerHTML = rr.aside?.length ? `Set aside this round: ${rr.aside.map(c => pip(c)).join('')}` : '';
    $('#next-lead').innerHTML = final ? '' : `${avatar(rr.leader)} <span><b>${name(rr.leader)}</b> ${verb(rr.leader, 'lead', 'leads')} round ${rr.round + 1}: lowest unique total.</span>`;
    const btn = $('[data-action="next-round"]');
    btn.textContent = final ? 'See the final standings' : `Deal round ${rr.round + 1}`;
    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('in'));
    sfx('sheet');
    const totals = $$('#summary .sum-total b');
    setTimeout(() => {
      totals.forEach((el, i) => countUp(el, +el.dataset.to, { ms: 700 }));
      $$('#summary .gauge').forEach((g, i) => { const r = rr.rows[i]; g.querySelector('.now').style.width = `${Math.min(100, r.after / E.LIMIT * 100)}%`; g.querySelector('.proj').style.width = `${Math.min(100, r.after / E.LIMIT * 100)}%`; });
      const me = rr.rows[0];
      if (me.after > E.LIMIT) { sfx('fallen'); haptic('error'); } else if (me.points < 0) { sfx('sweep', true); } else sfx('tick');
    }, reduced() ? 60 : 520);
    setTimeout(() => btn.focus({ preventScroll: true }), 50);
    ui.roundDone = () => {
      modal.classList.remove('in');
      setTimeout(() => { modal.hidden = true; }, reduced() ? 0 : 220);
      ui.roundDone = null;
      resolve();
    };
  });
}

// ---------- game loop ----------
function input() { return new Promise(r => { ui.resolve = r; ui.hurry = false; render(); turnMessage(); }); }
function send(a) {
  if (!ui.resolve) return false;
  const r = ui.resolve; ui.resolve = null; r(a);
  return true;
}

async function loop(token) {
  while (s && token === ui.token) {
    if (s.phase === 'over') {
      if (ui.roundShown !== s.round && s.roundResults) { ui.roundShown = s.round; await showRound(s.roundResults, true); if (token !== ui.token) return; }
      await gameOver(token); return;
    }
    let a;
    if (s.phase === 'deal') a = { type: 'deal' };
    else if (s.phase === 'round') {
      ui.roundShown = s.round;
      await showRound(s.roundResults, false);
      if (token !== ui.token) return;
      a = { type: 'next' };
    } else if (s.phase === 'resolve') {
      await presentFull(token);
      if (token !== ui.token) return;
      a = { type: 'collect' };
    } else if (s.players[s.current].human) {
      a = await input();
      if (token !== ui.token) return;
    } else {
      render(); turnMessage();
      await wait(s.table.length ? 640 : 760);
      if (token !== ui.token) return;
      a = E.botAction(s);
    }
    const prev = structuredClone(s), ev = E.act(s, a);
    if (!ev) { sfx('error'); haptic('error'); continue; }
    // The 'full' event is shown by the 'resolve' phase above, so the pause survives a resume.
    await present(prev, ev.filter(e => e.t !== 'full'), token);
  }
}

async function gameOver(token) {
  clearSave();
  ui.resolve = null;
  render();
  const w = s.result.winners, iWon = w.includes(0);
  if (!ui.recorded) {
    ui.recorded = true;
    const st = stats(), me = s.players[0].score;
    setStats({ played: st.played + 1, wins: st.wins + (iWon ? 1 : 0), best: me <= E.LIMIT ? Math.max(st.best, me) : st.best });
  }
  if (token !== ui.token) return;
  showResult(true);
}

function showResult(celebrate = false) {
  const w = s.result.winners, iWon = w.includes(0), names = w.map(name);
  const title = $('#result-title'), fell = s.players.filter(p => p.score > E.LIMIT);
  title.textContent = !w.length ? 'Nobody survives' : w.length > 1 ? (iWon ? 'You share the win!' : `${list(names)} share it`) : iWon ? 'You win!' : `${names[0]} wins`;
  title.classList.toggle('defeat', !iWon);
  $('#result-sub').textContent = `After ${plural(s.round, 'round')}. ${fell.length ? `${list(fell.map(p => name(p.id)))} fell past ${E.LIMIT}.` : ''}`;
  $('#standings').innerHTML = E.standings(s).map((p, i) => {
    const won = w.includes(p.id), over = p.score > E.LIMIT;
    const detail = [over ? `Fell past ${E.LIMIT}` : won ? 'Winner' : `${E.LIMIT - p.score} under the line`, plural(p.stats.tricks, 'trick'), p.stats.cancels ? plural(p.stats.cancels, 'pair') : ''].filter(Boolean).join(' · ');
    return `<li class="${won ? 'first' : ''}${p.human ? ' me' : ''}${over ? ' fell' : ''}" style="--i:${i}"><span class="st-rank">${over ? '✕' : i + 1}</span>${avatar(p.id, 'lg')}<span class="st-name"><b>${p.human ? 'You' : `${p.name} <small>${p.persona}</small>`}</b><small>${detail}</small></span><span class="st-score">${p.score}</span></li>`;
  }).join('');
  $('#result-career').textContent = careerText(stats());
  $('#result').hidden = false;
  if (celebrate) {
    if (iWon) { sfx('win'); haptic('success'); setTimeout(() => confetti(), 250); } else sfx('lose');
  }
}

function begin(state) {
  ui.token++; ui.resolve = null; ui.hurry = false; ui.sel = null; ui.mark = null; ui.headline = '';
  ui.recorded = false; ui.roundShown = state.phase === 'round' ? 0 : state.round;
  s = state;
  s.log ||= [];
  ui.shown = Object.fromEntries(s.players.map(p => [p.id, p.score]));
  if (s.phase === 'round') ui.shown = Object.fromEntries(s.roundResults.rows.map(r => [r.pid, r.before]));
  $('#title').hidden = true; $('#result').hidden = true; $('#round').hidden = true; $('#app').hidden = false;
  closeSheet(true);
  render();
  if (s.phase !== 'deal') setMessage('Game resumed', `Round ${s.round}, trick ${s.trick}.`);
  const token = ui.token;
  const go = () => loop(token);
  if (!seen(TOUR) && s.phase === 'deal') { ui.afterTour = go; setTimeout(() => startTour(true), 300); } else go();
}

function newGame() {
  clearSave();
  begin(E.newGame());
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
  if (saved) $('[data-action="resume"]').textContent = `Resume round ${saved.round || 1}`;
  $('#career').textContent = careerText(st);
  $('#app').hidden = true; $('#result').hidden = true; $('#round').hidden = true; $('#title').hidden = false;
}

// ---------- human input ----------
function tapCard(id, { swipe = false } = {}) {
  if (!canPlay() || ui.tour != null) return;
  const c = s.players[0].hand.find(x => x.id === id);
  if (!c) return;
  if (!E.validPlays(s, s.players[0].hand).includes(c)) {
    sfx('error'); haptic('error');
    const el = $(`#hand .card[data-id="${id}"]`);
    el?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-5px)' }, { transform: 'translateX(5px)' }, { transform: 'translateX(-3px)' }, { transform: 'none' }], { duration: 300 });
    setMessage(`You must follow ${s.lead}`, `You have ${s.lead} cards. A Jester is also allowed.`, { bad: true });
    return;
  }
  if (prefs.oneTap || swipe || ui.sel === id) { ui.sel = null; send({ type: 'play', id }); return; }
  select(id);
}
function select(id) {
  ui.sel = id;
  $$('#hand .card').forEach(el => el.classList.toggle('selected', +el.dataset.id === id));
  sfx('lift'); haptic('light');
  previewMessage();
}
function deselect() {
  if (ui.sel == null) return;
  ui.sel = null;
  $$('#hand .card.selected').forEach(el => el.classList.remove('selected'));
  turnMessage();
}

// Tap, or flick a card upward to throw it in.
let press = null;
$('#hand').addEventListener('pointerdown', ev => {
  const el = ev.target.closest('.card[data-id]');
  if (!el) return;
  press = { id: +el.dataset.id, x: ev.clientX, y: ev.clientY, el };
});
$('#hand').addEventListener('pointermove', ev => {
  if (!press || !canPlay()) return;
  const dy = Math.min(0, ev.clientY - press.y);
  if (dy < -6 && press.el.classList.contains('legal')) press.el.style.transform = `translateY(${dy * .6}px)`;
});
function endPress(ev, cancel = false) {
  if (!press) return;
  const p = press; press = null;
  p.el.style.transform = '';
  if (cancel) return;
  const dy = ev.clientY - p.y, dx = ev.clientX - p.x;
  if (dy < -40 && Math.abs(dx) < 60) tapCard(p.id, { swipe: true });
  else if (Math.abs(dy) < 14 && Math.abs(dx) < 14) {
    // A tap lands on the top-most card under the finger, which is what the player sees.
    const under = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('#hand .card[data-id]');
    tapCard(under ? +under.dataset.id : p.id);
  }
}
$('#hand').addEventListener('pointerup', ev => endPress(ev));
$('#hand').addEventListener('pointercancel', ev => endPress(ev, true));
$('#hand').addEventListener('keydown', ev => {
  const el = ev.target.closest('.card[data-id]');
  if (!el) return;
  if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tapCard(+el.dataset.id, { swipe: true }); }
  else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
    ev.preventDefault();
    const legal = $$('#hand .card.legal'), i = legal.indexOf(el), next = legal[(i + (ev.key === 'ArrowRight' ? 1 : -1) + legal.length) % legal.length];
    next?.focus(); if (next && !prefs.oneTap) select(+next.dataset.id);
  }
});
$('#board').addEventListener('pointerdown', ev => {
  if (!s) return;
  if (s.phase === 'play' && !s.players[s.current].human) { if (!ui.hurry) { ui.hurry = true; turnMessage(); } return; }
  if (!ev.target.closest('.seat-btn')) deselect();
});

// ---------- sheet: rules, scores, log, settings ----------
function openSheet(tab = 'rules') {
  const wrap = $('#sheet');
  showTab(tab);
  syncSettings();
  wrap.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => wrap.classList.add('in')));
  $('.sheet-card').focus({ preventScroll: true });
  sfx('sheet');
}
function closeSheet(instant = false) {
  const wrap = $('#sheet'), card = $('.sheet-card');
  if (wrap.hidden) return;
  wrap.classList.remove('in');
  card.style.transform = '';
  ui.confirmNew = 0; ui.focusPid = null;
  if (instant || reduced()) { wrap.hidden = true; return; }
  setTimeout(() => { if (!wrap.classList.contains('in')) wrap.hidden = true; }, 300);
}
function showTab(tab) {
  $$('[data-tab]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === tab)));
  $$('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== tab; });
  refreshSheet();
  $('.sheet-body').scrollTop = tab === 'log' ? 1e6 : 0;
  if (tab === 'scores' && ui.focusPid != null) $(`#scores [data-score-pid="${ui.focusPid}"]`)?.scrollIntoView({ block: 'nearest' });
}
function refreshSheet() {
  const tab = $('[data-tab][aria-selected="true"]')?.dataset.tab;
  if (tab === 'log') renderLog();
  if (tab === 'scores') renderScores();
}
function renderScores() {
  const el = $('#scores');
  if (!s || $('#app').hidden) { el.innerHTML = '<p class="log-empty">Scores appear once a game is underway.</p>'; return; }
  const order = s.players.slice().sort((a, b) => (a.score > E.LIMIT) - (b.score > E.LIMIT) || b.score - a.score);
  const rows = order.map(p => {
    const round = E.sum(p.tableau);
    return `<section class="score-card${ui.focusPid === p.id ? ' focus' : ''}" data-score-pid="${p.id}">
      <div class="score-head">${avatar(p.id)}<span class="who"><b>${p.human ? 'You' : p.name}</b><small>${p.human ? `${plural(p.hand.length, 'card')} in hand` : `${p.persona} · ${plural(p.hand.length, 'card')} in hand`}</small></span>
        <span class="score-nums"><span class="delta${round < 0 ? ' neg' : round > 0 ? ' pos' : ''}">${signed(round)}</span><b>${p.score}</b></span></div>
      ${gauge(p.score, round)}
      <div class="score-cards">${p.tableau.length ? p.tableau.slice().sort((a, b) => a.rank - b.rank).map(c => cardHTML(c, 'mini')).join('') : '<p class="log-empty">No cards taken this round.</p>'}</div>
    </section>`;
  }).join('');
  const lt = s.lastTrick;
  const last = lt ? `<p class="group-label">Last trick</p><div class="last-trick">${lt.table.map(x => `<div class="lt-cell${lt.takenIds.includes(x.card.id) ? ' taken' : ''}${x.pid === lt.pid && E.takerOf(lt.table, lt.lead)?.card.id === x.card.id ? ' won' : ''}">${cardHTML(x.card, 'mini')}<small>${name(x.pid)}</small></div>`).join('')}</div><p class="group-hint">${name(lt.pid)} took the highlighted cards. ${lt.lead ? `${SUIT[lt.lead]} was led.` : ''}</p>` : '';
  const hist = s.history?.length ? `<p class="group-label">Rounds</p><table class="history"><thead><tr><th></th>${s.players.map(p => `<th>${p.human ? 'You' : p.name}</th>`).join('')}</tr></thead><tbody>${s.history.map(h => `<tr><td>${h.round}</td>${h.points.map((pt, i) => `<td><b>${h.totals[i]}</b><small>${signed(pt)}</small></td>`).join('')}</tr>`).join('')}</tbody></table>` : '';
  el.innerHTML = `<p class="group-hint top">The bar fills toward ${E.LIMIT}; red means this round would push past it.</p>${rows}${last}${hist}`;
}
function renderLog() {
  const el = $('#log');
  if (!s?.log?.length) { el.innerHTML = '<p class="log-empty">Every card played and every trick taken will show up here.</p>'; return; }
  const groups = [];
  for (const e of s.log) {
    const key = `${e.round}:${e.trick}`, last = groups.at(-1);
    if (last && last.key === key) last.items.push(e); else groups.push({ key, round: e.round, trick: e.trick, items: [e] });
  }
  el.innerHTML = groups.slice(-30).map(g => {
    const head = g.trick ? `Round ${g.round} · Trick ${g.trick}` : `Round ${g.round}`;
    const items = g.items.map(e => `<li class="${e.kind}${e.pid === 0 ? ' mine' : ''}">${e.card ? pip(e.card) : e.pid != null ? avatar(e.pid, 'sm') : '<span class="glyph" aria-hidden="true">◆</span>'}<span>${esc(e.text)}</span></li>`).join('');
    return `<section class="log-turn"><h4>${head}</h4><ul>${items}</ul></section>`;
  }).join('');
  if (!$('[data-panel="log"]').hidden) $('.sheet-body').scrollTop = 1e6;
}
function syncSettings() {
  $$('[data-pref]').forEach(i => { i.checked = Boolean(prefs[i.dataset.pref]); });
  $$('[data-choice]').forEach(g => g.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(prefs[g.dataset.choice] === b.dataset.value))));
  const n = $('#sheet [data-action="new"]'), armed = ui.confirmNew > Date.now();
  n.textContent = armed ? 'Tap again to abandon this game' : 'New game';
  n.style.color = armed ? 'var(--danger)' : '';
  n.hidden = $('#app').hidden;
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
  { sel: '#hand', title: 'Your hand', text: 'Tap a card to pick it and see what it would do, then tap it again (or flick it up) to play. Cards you can\'t play right now are dimmed.' },
  { sel: '#trick', title: 'Second best takes it', text: 'The first coloured card sets the lead. Of the lead-colour cards and Jesters, the second-highest takes the trick, plus every off-colour card in it. A gold glow shows who is taking it.' },
  { sel: '#seat-0', title: 'Your tableau', text: 'Cards you take land here and add up for the round. Negatives help. A number you already hold cancels both cards.' },
  { sel: '#seat-2', title: 'Stay at or below 40', text: 'The bar fills toward 40 and turns red when this round would push a player over. When anyone passes 40, the highest total still at or below 40 wins. Tap a seat to see their cards.' },
  { sel: '[data-action="menu"]', title: 'Rules any time', text: 'Rules, scores, the last trick, the game log and settings live here.' },
];
function startTour(fromStart = false) {
  if ($('#app').hidden) return;
  closeSheet(true);
  ui.tour = 0; $('#tour').hidden = false;
  if (fromStart && !s.players[0].hand.length) {
    // Show a dealt-looking table behind the walkthrough.
    const preview = structuredClone(s); E.act(preview, { type: 'deal' });
    preview.phase = 'deal'; render(preview);
  }
  showStep();
}
function showStep() {
  const st = STEPS[ui.tour], el = $(st.sel);
  if (!el) return endTour();
  const r = el.getBoundingClientRect(), pad = 6, hole = $('#tour-hole'), tip = $('#tour-tip');
  Object.assign(hole.style, { left: `${r.left - pad}px`, top: `${r.top - pad}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
  $('#tour-step').textContent = `${ui.tour + 1} of ${STEPS.length}`;
  $('#tour-title').textContent = st.title;
  $('#tour-text').textContent = st.text;
  $('[data-action="tour-next"]').textContent = ui.tour === STEPS.length - 1 ? (ui.afterTour ? 'Deal the cards' : 'Got it') : 'Next';
  const tipH = tip.offsetHeight || 190, below = r.bottom + pad + 14, above = r.top - pad - 14 - tipH;
  tip.style.top = `${above > 10 && (below + tipH > innerHeight - 10 || r.top > innerHeight / 2) ? above : Math.min(below, innerHeight - tipH - 10)}px`;
  $('[data-action="tour-next"]').focus({ preventScroll: true });
}
function endTour(mark = true) {
  if (ui.tour == null && $('#tour').hidden) return;
  ui.tour = null; $('#tour').hidden = true;
  if (mark) markSeen(TOUR);
  const go = ui.afterTour; ui.afterTour = null;
  if (go) { render(); go(); }
}

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

// ---------- wiring ----------
document.addEventListener('click', ev => {
  const t = ev.target.closest('[data-action]');
  if (!t) return;
  const a = t.dataset.action;
  if (a === 'new') {
    if (t.closest('#sheet') && s && s.phase !== 'over' && (s.round > 1 || s.trick > 1 || s.table.length) && ui.confirmNew < Date.now()) {
      ui.confirmNew = Date.now() + 3000; haptic('medium'); syncSettings(); setTimeout(syncSettings, 3100); return;
    }
    sfx('tap'); haptic(); newGame();
  } else if (a === 'resume') { const v = load(); sfx('tap'); haptic(); if (v) begin(v); else newGame(); }
  else if (a === 'rules') { openSheet('rules'); }
  else if (a === 'menu') { haptic(); openSheet(s?.log?.length ? 'scores' : 'rules'); }
  else if (a === 'seat') { haptic(); ui.focusPid = +t.dataset.pid; openSheet('scores'); }
  else if (a === 'close-sheet') closeSheet();
  else if (a === 'fullscreen') toggleFullscreen();
  else if (a === 'next-round') { sfx('tap'); haptic(); ui.roundDone?.(); }
  else if (a === 'quit') { save(); showTitle(); }
  else if (a === 'tour') { if ($('#app').hidden) { toast('Start a game to see the walkthrough.'); return; } startTour(); }
  else if (a === 'tour-next') { sfx('tap'); if (++ui.tour >= STEPS.length) endTour(); else showStep(); }
  else if (a === 'tour-skip') endTour();
});
$$('[data-tab]').forEach(b => b.addEventListener('click', () => { if (b.getAttribute('aria-selected') !== 'true') { sfx('tap'); haptic(); } showTab(b.dataset.tab); }));
$$('[data-pref]').forEach(i => i.addEventListener('change', () => {
  setPref(i.dataset.pref, i.checked);
  if (i.dataset.pref === 'haptics' && i.checked) haptic('medium');
  if (i.dataset.pref === 'sound' && i.checked) sfx('sweep', true);
  if (s && !$('#app').hidden) { render(); turnMessage(); }
}));
$$('[data-choice] button').forEach(b => b.addEventListener('click', () => {
  setPref(b.closest('[data-choice]').dataset.choice, b.dataset.value);
  sfx('tap'); haptic(); syncSettings();
}));
document.addEventListener('keydown', ev => {
  if (ev.key === 'Escape') { if (ui.tour != null) endTour(); else if (!$('#sheet').hidden) closeSheet(); else deselect(); return; }
  if (ev.key === 'Enter' && !$('#round').hidden && ui.roundDone && !ev.target.closest('button')) { ev.preventDefault(); ui.roundDone(); }
});
let resizeTimer;
addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { if (s && !$('#app').hidden && ui.tour == null) render(); if (ui.tour != null) showStep(); }, 120); });
document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });

// ---------- boot ----------
showTitle();
