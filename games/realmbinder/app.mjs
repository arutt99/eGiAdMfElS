// Realmbinder UI: shop, pack opening, binder and shelf. All rules live in engine.mjs.
import {
  CARDS, CARD_BY_ID, RARITIES, SET, CONDITIONS, PRINT_RUN, SHELF_SLOTS, BUY_RATE,
  newSave, validSave, openPack, shopView, buyPacks, buyBox, buySingle, sellCopy, duplicates, sellDuplicates,
  allowance, claimAllowance, shelve, unshelve, owned, showcase, collectionValue, completion,
  copyValue, sellPrice, marketPrice, trend, shiftOf,
} from './engine.mjs';
import { FACTIONS, KINDS } from './data.mjs';
import { artFor } from './art.mjs';

const KEY = 'realmbinder.save.v1';
const PREFS = 'realmbinder.prefs';
const $ = (sel, el = document) => el.querySelector(sel);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmt = n => Math.round(n).toLocaleString('en-US');
const g = n => `<span class="price"><i class="coin"></i>${fmt(n)}</span>`;

// Fast-forward for testing restocks and price drift: ?ff=6 adds six hours to the clock.
const ffHours = Number(new URLSearchParams(location.search).get('ff')) || 0;
const now = () => Date.now() + ffHours * 3600e3;

// ---------- save ----------
let S;
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (validSave(raw)) return raw;
  } catch (e) { /* fresh start */ }
  return null;
}
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage full or blocked */ }
}
let prefs = { sound: true };
try { prefs = { ...prefs, ...JSON.parse(localStorage.getItem(PREFS) || '{}') }; } catch (e) { /* defaults */ }
const savePrefs = () => { try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch (e) { /* ignore */ } };

// ---------- sound ----------
let ac;
function audio() {
  if (!prefs.sound) return null;
  if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
function tone(f, dur = 0.15, { type = 'sine', gain = 0.12, at = 0, slide = 0 } = {}) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + at, o = a.createOscillator(), v = a.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(f * slide, t + dur);
  v.gain.setValueAtTime(0.0001, t); v.gain.exponentialRampToValueAtTime(gain, t + 0.012); v.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(v).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
}
function noise(dur = 0.3, { from = 3000, to = 600, gain = 0.25 } = {}) {
  const a = audio(); if (!a) return;
  const t = a.currentTime, len = Math.floor(a.sampleRate * dur), buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource(), f = a.createBiquadFilter(), v = a.createGain();
  src.buffer = buf; f.type = 'bandpass'; f.Q.value = 1.2;
  f.frequency.setValueAtTime(from, t); f.frequency.exponentialRampToValueAtTime(to, t + dur);
  v.gain.value = gain; src.connect(f).connect(v).connect(a.destination); src.start(t);
}
const sfx = {
  tap: () => tone(520, 0.06, { type: 'triangle', gain: 0.05 }),
  tear: () => { noise(0.45, { from: 5000, to: 900, gain: 0.35 }); },
  flip: () => { noise(0.08, { from: 2500, to: 1800, gain: 0.15 }); },
  coin: () => { tone(1320, 0.12, { type: 'triangle', gain: 0.08 }); tone(1760, 0.18, { type: 'triangle', gain: 0.07, at: 0.07 }); },
  reveal(rank) {
    const chords = [[], [523, 659], [523, 659, 784], [392, 523, 659, 784, 1047], [262, 392, 523, 659, 784, 1047, 1319]];
    chords[rank].forEach((f, i) => tone(f, 0.9 + rank * 0.2, { type: rank >= 3 ? 'triangle' : 'sine', gain: 0.07, at: i * 0.07 }));
    if (rank >= 4) tone(80, 1.4, { type: 'sawtooth', gain: 0.05, slide: 0.5 });
  },
};
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { /* no haptics */ } };

// ---------- toast ----------
let toastTimer;
function toast(text, bad = false) {
  const t = $('#toast');
  t.textContent = text; t.className = 'toast' + (bad ? ' bad' : ''); t.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
}

// ---------- pieces ----------
const SWORD = '<svg viewBox="0 0 24 24"><path d="M14.5 3H21v6.5L10 20.5l-1.5-1.5L7 20.5 3.5 17 5 15.5 3.5 14z"/></svg>';
const rClass = r => `r-${r}`;
const rarityName = r => RARITIES[r].name;

function cardHTML(card, copy = null, extra = '') {
  const cls = ['card', `f-${card.faction}`, rClass(card.rarity)];
  if (copy?.foil) cls.push('foil');
  if (copy?.gilded) cls.push('gilded');
  return `<div class="${cls.join(' ')} ${extra}" data-card="${card.id}">
    <div class="c-in">
      <div class="c-head"><span class="c-name">${esc(card.name)}</span><span class="c-cost">${card.cost}</span></div>
      <div class="c-art">${artFor(card)}</div>
      <div class="c-type"><span>${KINDS[card.kind]} <b>· ${FACTIONS[card.faction].short}</b></span><i class="gem"></i></div>
      <div class="c-text">${esc(card.flavor)}</div>
      <div class="c-foot"><span><span class="set">${SET.code} · </span>${String(card.num).padStart(3, '0')}/${SET.size}</span>${card.might != null ? `<span class="c-might">${SWORD}${card.might}</span>` : '<span></span>'}</div>
    </div>
    <div class="holo"></div>
  </div>`;
}
const BACK = `<div class="card-back"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#e8bf5e" stroke-width="2"/><circle cx="50" cy="50" r="33" fill="none" stroke="#e8bf5e" stroke-width=".8" stroke-dasharray="2 3"/><path d="M28 60l-3-20 12 9 8-15 5 13 5-13 8 15 12-9-3 20z" fill="#e8bf5e"/><path d="M49 36l3 9-2 4 3 8" stroke="#1a1030" stroke-width="2" fill="none"/></svg><span>REALMBINDER</span></div>`;

const FEATURES = CARDS.filter(c => c.rarity === 'L' || c.rarity === 'M');
function packHTML(size = '', feature = CARD_BY_ID['SC-127'], torn = false) {
  return `<div class="pack ${size}"><div class="body"><div class="wrap"></div><div class="crimp b"></div>
    <div class="p-logo">REALMBINDER</div><div class="p-art">${artFor(feature)}</div>
    <div class="p-set">${SET.name}</div><div class="p-count">10 CARDS · SET ${SET.number}</div></div>
    <div class="tear"><div class="wrap"></div><div class="crimp t"></div></div></div>`;
}

function copyTags(copy) {
  const t = [];
  if (copy.gilded) t.push('<span class="tag gild">Gilded</span>');
  else if (copy.foil) t.push('<span class="tag foil">Foil</span>');
  t.push(`<span class="tag">${CONDITIONS[copy.cond].name}</span>`);
  const c = CARD_BY_ID[copy.card];
  t.push(`<span class="tag">#${copy.print} / ${fmt(PRINT_RUN[c.rarity])}</span>`);
  if (S.shelf.includes(copy.uid)) t.push('<span class="tag shelf">On shelf</span>');
  return t.join('');
}
function ago(t) {
  const m = Math.round((now() - t) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.round(h / 24)}d ago`;
}
function untilText(ms) {
  const m = Math.max(0, Math.ceil(ms / 60000));
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

// ---------- top bar ----------
let lastGold = null;
function renderTop() {
  const goldEl = $('#gold');
  $('b', goldEl).textContent = fmt(S.gold);
  if (lastGold !== null && S.gold !== lastGold) { goldEl.classList.remove('bump'); void goldEl.offsetWidth; goldEl.classList.add('bump'); }
  lastGold = S.gold;
  const a = allowance(S, now());
  const al = $('#allowance');
  al.hidden = a < 10;
  al.innerHTML = `<i class="coin"></i>+${fmt(a)}`;
  al.setAttribute('aria-label', `Collect ${a} gold allowance`);
  const b = $('#pack-badge');
  b.hidden = S.packs < 1; b.textContent = S.packs;
  $('#sound').classList.toggle('off', !prefs.sound);
  $('#sound').setAttribute('aria-label', prefs.sound ? 'Sound on' : 'Sound off');
}

// ---------- router ----------
const TABS = ['shop', 'packs', 'binder', 'shelf'];
let tab = 'packs';
function go(t, { scroll = true } = {}) {
  tab = TABS.includes(t) ? t : 'packs';
  if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
  document.querySelectorAll('.tabs button').forEach(b => { if (b.dataset.tab === tab) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  render();
  if (scroll) window.scrollTo(0, 0);
}
function render() {
  renderTop();
  const v = $('#view');
  v.innerHTML = { shop: shopPage, packs: packsPage, binder: binderPage, shelf: shelfPage }[tab]();
  if (tab === 'binder') bindBinder();
}

// ---------- shop ----------
const KEEPER = { id: 'keeper', name: 'Marta Copperkettle', faction: 'hearth', rarity: 'U', subject: 'hero:halfling:lantern', kind: 'hero' };
function shopPage() {
  const t = now();
  const v = shopView(S, t);
  const dupes = duplicates(S, t).filter(c => RARITIES[CARD_BY_ID[c.card].rarity].rank <= 2);
  const dupeTotal = dupes.reduce((a, c) => a + sellPrice(c, t), 0);
  const movers = CARDS.map(c => ({ c, tr: trend(c.id, t), p: marketPrice(c.id, t) }))
    .filter(x => x.c.rarity !== 'C')
    .sort((a, b) => Math.abs(b.tr) * Math.sqrt(b.p) - Math.abs(a.tr) * Math.sqrt(a.p)).slice(0, 6);
  return `
  <section class="panel keeper">
    <div class="portrait">${artFor(KEEPER)}</div>
    <div>
      <h1>The Copper Kettle</h1>
      <div class="who">Marta Copperkettle, proprietor</div>
      <div class="bubble">${esc(v.line)}</div>
    </div>
  </section>
  <div class="restock"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span id="restock">New stock in ${untilText(v.restock - t)}</span></div>

  <div class="section"><h2>On the shelves</h2><span class="note">Stock changes every few hours</span></div>
  <div class="products">
    <div class="panel product ${v.packsLeft ? '' : 'soldout'}">
      <div class="art">${packHTML('', FEATURES[v.shift % FEATURES.length])}</div>
      <div><h3>Booster Pack</h3><div class="meta">10 cards · ${v.packsLeft} left on the shelf</div></div>
      <div class="price" style="font-size:1.1rem">${g(v.packPrice)}</div>
      <div class="row">
        <button class="btn" data-act="buy1" ${v.packsLeft < 1 || S.gold < v.packPrice ? 'disabled' : ''}>Buy 1</button>
        <button class="btn ghost" data-act="buy5" ${v.packsLeft < 5 || S.gold < v.packPrice * 5 ? 'disabled' : ''}>Buy 5</button>
      </div>
    </div>
    <div class="panel product ${v.boxLeft ? '' : 'soldout'}">
      <div class="art"><div class="stack">${[0, 1, 2].map(i => `<div style="position:absolute;transform:translate(${(i - 1) * 28}px,${i === 1 ? -6 : 6}px) rotate(${(i - 1) * 8}deg)">${packHTML('', FEATURES[(v.shift + i * 3) % FEATURES.length])}</div>`).join('')}</div></div>
      <div><h3>Booster Box</h3><div class="meta">${v.box ? (v.boxLeft ? `12 packs · save ${fmt(v.packPrice * 12 - v.box.price)}g` : 'Sold out this shift') : 'None in this delivery'}</div></div>
      <div class="price" style="font-size:1.1rem">${v.box ? g(v.box.price) : '<span class="muted">—</span>'}</div>
      <div class="row"><button class="btn" data-act="box" ${!v.boxLeft || S.gold < (v.box?.price || 0) ? 'disabled' : ''}>${v.box ? 'Buy box' : 'Check back later'}</button></div>
    </div>
  </div>

  <div class="section"><h2>Glass case</h2><span class="note">Singles at market + 25%</span></div>
  <div class="case">
    ${v.glass.map(x => `<div class="case-item ${x.sold ? 'sold' : ''}">
      <div data-glass="${x.slot}">${cardHTML(CARD_BY_ID[x.copy.card], x.copy)}</div>
      ${x.sold ? '<div class="sold-tag">SOLD</div>' : `<button class="btn ${S.gold < x.price ? 'ghost' : ''}" data-act="single" data-slot="${x.slot}" ${S.gold < x.price ? 'disabled' : ''}>${g(x.price)}</button>`}
    </div>`).join('')}
  </div>

  <div class="section"><h2>Sell counter</h2><span class="note">Marta pays ${Math.round(BUY_RATE * 100)}% of market</span></div>
  <div class="panel sell-box">
    <div>${dupes.length ? `<b>${dupes.length}</b> spare ${dupes.length === 1 ? 'copy' : 'copies'} of Common, Uncommon and Rare cards<div class="muted" style="font-size:.8rem;margin-top:3px">Your best copy of each card is always kept.</div>` : '<span class="muted">No spare copies to sell yet. Legendary and Mythic copies are sold one at a time from the binder.</span>'}</div>
    <button class="btn" data-act="selldupes" ${dupes.length ? '' : 'disabled'}>Sell for ${g(dupeTotal)}</button>
  </div>

  <div class="section"><h2>Market watch</h2><span class="note">Today's biggest movers</span></div>
  <div class="panel market">
    ${movers.map(x => `<div class="market-row ${rClass(x.c.rarity)}" data-card="${x.c.id}"><i></i><span>${esc(x.c.name)}</span><span>${g(x.p)}</span><span class="t ${x.tr >= 0 ? 'up' : 'down'}">${x.tr >= 0 ? '▲' : '▼'} ${Math.abs(x.tr * 100).toFixed(1)}%</span></div>`).join('')}
  </div>`;
}

// ---------- packs ----------
function packsPage() {
  const log = S.log.slice(0, 8);
  if (S.packs < 1) {
    return `<div class="empty panel"><h2>No packs left</h2><p>Marta has fresh boosters at the Copper Kettle.</p><button class="btn big" data-go="shop">Visit the shop</button></div>
      ${log.length ? `<div class="section"><h2>Recent</h2></div><ul class="log panel">${log.map(l => `<li><span>${esc(l.text)}</span><span>${ago(l.t)}</span></li>`).join('')}</ul>` : ''}`;
  }
  return `<div class="packs-hero">
      <div class="pile">${Array.from({ length: Math.min(S.packs, 3) }, (_, i) => `<div style="position:absolute;inset:0;transform:translate(${i * 7}px,${i * -7}px) rotate(${i * 2}deg);z-index:${-i}">${packHTML('lg')}</div>`).join('')}</div>
      <div class="count">${S.packs} sealed ${S.packs === 1 ? 'pack' : 'packs'}</div>
      <div class="row"><button class="btn big" data-act="open">Open a pack</button></div>
    </div>
    ${log.length ? `<div class="section"><h2>Big pulls</h2></div><ul class="log panel">${log.map(l => `<li><span>${esc(l.text)}</span><span>${ago(l.t)}</span></li>`).join('')}</ul>` : `<p class="muted" style="text-align:center;font-size:.86rem">Each pack holds 6 commons, 3 uncommons and one Rare or better. About one pack in forty has a Mythic.</p>`}`;
}

// ---------- binder ----------
const B = { page: 0, faction: 'all', show: 'all' };
const PER_PAGE = 9;
function binderList() {
  const own = owned(S);
  return CARDS.filter(c => (B.faction === 'all' || c.faction === B.faction)
    && (B.show === 'all' || (B.show === 'missing' ? !own.has(c.id) : own.has(c.id))));
}
function binderPage() {
  const t = now();
  const own = owned(S);
  const { have, total } = completion(S);
  const list = binderList();
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  B.page = Math.min(B.page, pages - 1);
  const slice = list.slice(B.page * PER_PAGE, B.page * PER_PAGE + PER_PAGE);
  const viewed = new Set(S.viewed || []);
  const facs = [['all', 'All'], ...Object.values(FACTIONS).map(f => [f.key, f.short])];
  return `<div class="panel progress">
      <div class="nums"><span><b>${have}</b> / ${total} cards found</span><span>${Math.round(have / total * 100)}%</span></div>
      <div class="bar"><i style="width:${have / total * 100}%"></i></div>
      <div class="nums"><span>${Object.entries(RARITIES).map(([k, r]) => `<span class="${rClass(k)}" style="color:var(--rc)">◆</span> ${CARDS.filter(c => c.rarity === k && own.has(c.id)).length}/${CARDS.filter(c => c.rarity === k).length}`).join('&nbsp;&nbsp;')}</span></div>
    </div>
    <div class="filters">${facs.map(([k, n]) => `<button data-fac="${k}" aria-pressed="${B.faction === k}">${n}</button>`).join('')}</div>
    <div class="filters">${[['all', 'Every card'], ['owned', 'Owned'], ['missing', 'Missing']].map(([k, n]) => `<button data-show="${k}" aria-pressed="${B.show === k}">${n}</button>`).join('')}</div>
    <div class="binder" id="binder"><div class="page flip-in">
      ${slice.map(c => {
        const list2 = own.get(c.id);
        if (!list2) return `<div class="pocket missing ${rClass(c.rarity)}" data-card="${c.id}"><div><i></i>#${String(c.num).padStart(3, '0')}<small>${esc(c.name)}</small></div></div>`;
        const best = showcase(list2, t);
        return `<div class="pocket" data-card="${c.id}">${!viewed.has(c.id) ? '<span class="new-dot" title="New"></span>' : ''}${list2.length > 1 ? `<span class="qty">×${list2.length}</span>` : ''}${cardHTML(c, best)}</div>`;
      }).join('') || '<p class="muted" style="grid-column:1/-1;text-align:center;padding:30px 0">Nothing here yet.</p>'}
    </div></div>
    <div class="pager"><button class="btn ghost" data-page="-1" ${B.page ? '' : 'disabled'} aria-label="Previous page">‹</button><span>Page ${B.page + 1} of ${pages}</span><button class="btn ghost" data-page="1" ${B.page < pages - 1 ? '' : 'disabled'} aria-label="Next page">›</button></div>`;
}
function turnPage(d) {
  const pages = Math.max(1, Math.ceil(binderList().length / PER_PAGE));
  const n = Math.max(0, Math.min(pages - 1, B.page + d));
  if (n === B.page) return;
  B.page = n; sfx.flip();
  render();
  const pg = $('#binder .page');
  if (pg) pg.style.setProperty('--from', d > 0 ? '40px' : '-40px');
}
function bindBinder() {
  const el = $('#binder');
  if (!el) return;
  let x0 = null, y0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 == null) return;
    const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) turnPage(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

// ---------- shelf ----------
function shelfPage() {
  const t = now();
  const byUid = new Map(S.copies.map(c => [c.uid, c]));
  const { have, total } = completion(S);
  const best = S.stats.best && CARD_BY_ID[S.stats.best.card];
  const slot = (uid, i) => {
    const c = uid != null && byUid.get(uid);
    return c ? `<div class="slot" data-slot="${i}">${cardHTML(CARD_BY_ID[c.card], c)}</div>` : `<div class="slot empty-slot" data-slot="${i}" aria-label="Empty display slot">+</div>`;
  };
  const rows = [];
  for (let r = 0; r < SHELF_SLOTS / 4; r++) rows.push(`<div class="shelf-row">${S.shelf.slice(r * 4, r * 4 + 4).map((u, i) => slot(u, r * 4 + i)).join('')}</div>`);
  return `<div class="section" style="margin-top:6px"><h2>Display shelf</h2><span class="note">Tap a stand to show off a card</span></div>
    <div class="shelves">${rows.join('')}
      <div class="sealed-row">${S.packs ? Array.from({ length: Math.min(S.packs, 12) }, (_, i) => packHTML('', FEATURES[i % FEATURES.length])).join('') : '<span class="muted" style="font-size:.8rem;padding:0 4px 10px">Sealed packs you keep will sit here.</span>'}</div>
    </div>
    <div class="section"><h2>Collection</h2></div>
    <div class="stats">
      <div class="stat"><span>Collection value</span><b>${g(collectionValue(S, t))}</b></div>
      <div class="stat"><span>Cards owned</span><b>${fmt(S.copies.length)}</b></div>
      <div class="stat"><span>Set progress</span><b>${have} / ${total}</b></div>
      <div class="stat"><span>Packs opened</span><b>${fmt(S.stats.opened)}</b></div>
      <div class="stat wide"><span>Best pull</span><b>${best ? `<span class="${rClass(best.rarity)}" style="color:var(--rc)">◆</span> ${esc(best.name)} · ${g(S.stats.best.value)}` : 'Open a pack to find out'}</b></div>
      <div class="stat"><span>Gold spent</span><b>${g(S.stats.spent)}</b></div>
      <div class="stat"><span>Gold earned</span><b>${g(S.stats.earned)}</b></div>
    </div>
    <div style="text-align:center;margin-top:28px"><button class="btn danger" data-act="reset">Start a new collection</button></div>`;
}

// ---------- sheet ----------
function openSheet(html, onBind) {
  const sh = $('#sheet');
  const p = $('.sheet-panel', sh);
  p.innerHTML = `<button class="sheet-close" data-close aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>${html}`;
  sh.hidden = false;
  p.scrollTop = 0;
  onBind && onBind(p);
}
function closeSheet() { $('#sheet').hidden = true; }

function openDetail(cardId, ctx = {}) {
  const t = now();
  const c = CARD_BY_ID[cardId];
  const mine = (owned(S).get(cardId) || []).slice().sort((a, b) => copyValue(b, t) - copyValue(a, t));
  if (!S.viewed) S.viewed = [];
  if (mine.length && !S.viewed.includes(cardId)) { S.viewed.push(cardId); persist(); }
  const glass = ctx.glass != null ? shopView(S, t).glass.find(x => x.slot === ctx.glass) : null;
  const shown = glass ? glass.copy : mine[0] || null;
  const tr = trend(cardId, t);
  openSheet(`<div class="detail ${rClass(c.rarity)}">
    <div class="detail-card"><div class="tilt" id="tilt">${cardHTML(c, shown)}</div></div>
    <h2>${esc(c.name)}</h2>
    <div class="sub"><b>${rarityName(c.rarity)}</b> · ${KINDS[c.kind]} · ${FACTIONS[c.faction].name} · #${c.num}</div>
    <div class="mkt"><span>Market ${g(marketPrice(cardId, t))}</span><span class="${tr >= 0 ? 'up' : 'down'}">${tr >= 0 ? '▲' : '▼'} ${Math.abs(tr * 100).toFixed(1)}% today</span></div>
    ${glass ? `<div class="copies"><div class="copy"><div class="tags">${copyTags(glass.copy).replace(/<span class="tag shelf">.*?<\/span>/, '')}</div><div class="val">${g(glass.price)}</div>
        <div class="acts">${glass.sold ? '<span class="muted">Sold</span>' : `<button class="btn" data-act="single" data-slot="${glass.slot}" ${S.gold < glass.price ? 'disabled' : ''}>Buy for ${g(glass.price)}</button>`}</div></div></div>`
      : mine.length ? `<div class="section" style="margin-top:14px"><h2>Your copies (${mine.length})</h2></div><div class="copies">${mine.map(cp => `<div class="copy">
        <div class="tags">${copyTags(cp)}</div><div class="val">${g(copyValue(cp, t))}</div>
        <div class="acts">
          ${S.shelf.includes(cp.uid) ? `<button class="btn ghost" data-act="unshelve" data-uid="${cp.uid}">Take off shelf</button>` : `<button class="btn ghost" data-act="shelve" data-uid="${cp.uid}">Put on shelf</button>`}
          <button class="btn ghost" data-act="sell" data-uid="${cp.uid}">Sell · ${g(sellPrice(cp, t))}</button>
        </div></div>`).join('')}</div>`
      : `<p class="muted" style="text-align:center;margin-top:16px">You haven't found this card yet. Keep opening packs, or watch Marta's glass case.</p>`}
  </div>`, p => { bindTilt($('#tilt', p)); });
  if (tab === 'binder') render();
}

function bindTilt(el) {
  if (!el) return;
  const card = $('.card', el);
  const move = (x, y) => {
    const r = el.getBoundingClientRect();
    const px = (x - r.left) / r.width, py = (y - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 18}deg) rotateX(${(0.5 - py) * 18}deg)`;
    card.style.setProperty('--mx', `${px * 100}%`); card.style.setProperty('--my', `${py * 100}%`);
  };
  el.addEventListener('pointermove', e => move(e.clientX, e.clientY));
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

function openPicker(slot) {
  const t = now();
  const onShelf = new Set(S.shelf.filter(u => u != null));
  const list = S.copies.filter(c => !onShelf.has(c.uid)).sort((a, b) => copyValue(b, t) - copyValue(a, t)).slice(0, 30);
  openSheet(`<h2>Choose a card to display</h2><p class="muted" style="font-size:.84rem;margin:6px 0 0">Your most valuable cards first.</p>
    ${list.length ? `<div class="picker">${list.map(c => `<button data-pick="${c.uid}" data-slot="${slot}">${cardHTML(CARD_BY_ID[c.card], c)}<span>${g(copyValue(c, t))}</span></button>`).join('')}</div>` : '<p class="empty">Open some packs first.</p>'}`);
}

function confirmSheet(title, body, yes, onYes, danger = false) {
  openSheet(`<div class="confirm"><h2>${title}</h2><p>${body}</p><div class="row"><button class="btn ghost" data-close>Cancel</button><button class="btn ${danger ? 'danger' : ''}" id="yes">${yes}</button></div></div>`,
    p => { $('#yes', p).addEventListener('click', () => { closeSheet(); onYes(); }); });
}

// ---------- pack opening ----------
const O = { pulled: [], i: 0, state: 'idle', busy: false };
function startOpening() {
  if (S.packs < 1) { toast('No packs to open', true); return; }
  closeSheet();
  const op = $('#opener');
  O.state = 'sealed'; O.busy = false; O.feature = FEATURES[Math.floor(Math.random() * FEATURES.length)];
  op.hidden = false;
  document.body.style.overflow = 'hidden';
  op.innerHTML = `<div class="counter">${S.packs} ${S.packs === 1 ? 'pack' : 'packs'}</div>
    <button class="btn ghost skip" data-op="close">Close</button>
    <div class="stage" id="stage">${packHTML('lg', O.feature)}</div>
    <div class="hint">Tap the pack to tear it open</div>`;
}
function tearPack() {
  if (O.busy) return;
  const res = openPack(S, now());
  if (!res.ok) { toast(res.error, true); return; }
  persist(); renderTop();
  O.pulled = res.pulled; O.i = 0; O.busy = true;
  sfx.tear(); buzz(20);
  $('#stage .pack').classList.add('torn');
  $('.hint', $('#opener')).textContent = '';
  setTimeout(() => { O.busy = false; O.state = 'reveal'; dealCard(); }, 750);
}
function dealCard() {
  const op = $('#opener');
  const copy = O.pulled[O.i];
  const card = CARD_BY_ID[copy.card];
  const rank = RARITIES[card.rarity].rank;
  const left = O.pulled.length - O.i - 1;
  O.flipped = false;
  op.innerHTML = `<div class="counter">${O.i + 1} / ${O.pulled.length}</div>
    <button class="btn ghost skip" data-op="skip">Skip</button>
    <div class="stage ${rClass(card.rarity)}" id="stage">
      ${left > 1 ? `<div class="under under2">${BACK}</div>` : ''}${left > 0 ? `<div class="under">${BACK}</div>` : ''}
      <div class="flip enter ${rank >= 2 || copy.foil ? 'tell' : ''}" id="flip"><div class="backface">${BACK}</div><div class="face">${cardHTML(card, copy)}</div></div>
    </div>
    <div class="reveal-label ${rClass(card.rarity)}" id="label"><div class="hint">${rank >= 3 ? 'Something is glowing…' : rank >= 2 || copy.foil ? 'Ooh, a shimmer…' : 'Tap to flip'}</div></div>`;
}
function flipCard() {
  const copy = O.pulled[O.i];
  const card = CARD_BY_ID[copy.card];
  const rank = RARITIES[card.rarity].rank;
  const f = $('#flip');
  f.classList.remove('enter', 'tell');
  f.classList.add('up');
  O.flipped = true;
  sfx.flip();
  if (rank >= 1 || copy.foil) setTimeout(() => sfx.reveal(Math.max(rank, copy.foil ? 2 : 0)), 250);
  if (rank >= 2 || copy.foil) {
    const b = document.createElement('div'); b.className = 'burst'; $('#stage').appendChild(b);
    buzz(rank >= 3 ? [30, 40, 60] : 15);
  }
  const variant = copy.gilded ? ' · Gilded' : copy.foil ? ' · Foil' : '';
  $('#label').innerHTML = `<div class="rn">${rarityName(card.rarity)}${variant}</div><div class="nm">${esc(card.name)}${copy.isNew ? '<span class="nw">NEW</span>' : ''}</div>`;
  bindTilt($('.face', f));
}
function nextCard() {
  const f = $('#flip');
  f.classList.add('leave');
  O.busy = true;
  setTimeout(() => {
    O.busy = false;
    O.i++;
    if (O.i >= O.pulled.length) showSummary(); else dealCard();
  }, 280);
}
function showSummary() {
  O.state = 'summary';
  const t = now();
  const total = O.pulled.reduce((a, c) => a + copyValue(c, t), 0);
  const fresh = O.pulled.filter(c => c.isNew).length;
  $('#opener').innerHTML = `<div class="summary">
    <h2>Your pulls</h2>
    <div class="tot">Worth about ${g(total)} on the market${fresh ? ` · <b style="color:var(--ink)">${fresh} new</b> for your binder` : ''}</div>
    <div class="grid">${O.pulled.map((c, i) => `<div class="cell" style="animation-delay:${i * 45}ms" data-card="${c.card}">${c.isNew ? '<span class="nw">NEW</span>' : ''}${cardHTML(CARD_BY_ID[c.card], c)}<div class="v">${g(copyValue(c, t))}</div></div>`).join('')}</div>
    <div class="row">${S.packs ? `<button class="btn big" data-op="again">Open another (${S.packs})</button>` : `<button class="btn big" data-op="shop">Buy more packs</button>`}<button class="btn ghost big" data-op="close">Done</button></div>
  </div>`;
}
function closeOpener() {
  $('#opener').hidden = true;
  $('#opener').innerHTML = '';
  document.body.style.overflow = '';
  O.state = 'idle';
  render();
}

// ---------- actions ----------
function act(name, el) {
  const t = now();
  let r;
  switch (name) {
    case 'buy1': case 'buy5':
      r = buyPacks(S, t, name === 'buy1' ? 1 : 5);
      if (r.ok) { sfx.coin(); toast(`Bought ${name === 'buy1' ? 'a pack' : '5 packs'} for ${fmt(r.cost)}g. Open ${name === 'buy1' ? 'it' : 'them'} in Packs.`); }
      break;
    case 'box':
      r = buyBox(S, t);
      if (r.ok) { sfx.coin(); toast(`A whole box! 12 packs added for ${fmt(r.cost)}g.`); }
      break;
    case 'single':
      r = buySingle(S, t, Number(el.dataset.slot));
      if (r.ok) { sfx.coin(); closeSheet(); toast(`${CARD_BY_ID[r.copy.card].name} is yours.`); }
      break;
    case 'selldupes': {
      const d = duplicates(S, t).filter(c => RARITIES[CARD_BY_ID[c.card].rarity].rank <= 2);
      const total = d.reduce((a, c) => a + sellPrice(c, t), 0);
      confirmSheet('Sell spare copies?', `Marta will buy ${d.length} spare ${d.length === 1 ? 'copy' : 'copies'} for ${fmt(total)} gold. You keep your best copy of every card.`, 'Sell', () => {
        const res = sellDuplicates(S, now());
        sfx.coin(); toast(`Sold ${res.count} cards for ${fmt(res.total)}g.`); persist(); render();
      });
      return;
    }
    case 'sell': {
      const uid = Number(el.dataset.uid);
      const cp = S.copies.find(c => c.uid === uid);
      const card = CARD_BY_ID[cp.card];
      const doSell = () => {
        const res = sellCopy(S, now(), uid);
        if (res.ok) { sfx.coin(); toast(`Sold ${card.name} for ${fmt(res.price)}g.`); persist(); render(); if (S.copies.some(c => c.card === card.id)) openDetail(card.id); else closeSheet(); }
      };
      const last = S.copies.filter(c => c.card === card.id).length === 1;
      if (RARITIES[card.rarity].rank >= 3 || last) {
        confirmSheet(`Sell ${esc(card.name)}?`, `${last ? 'This is your only copy. ' : ''}Marta will pay ${fmt(sellPrice(cp, t))} gold.`, 'Sell it', doSell, true);
      } else doSell();
      return;
    }
    case 'shelve':
      r = shelve(S, Number(el.dataset.uid));
      if (r.ok) { toast('On display.'); persist(); render(); openDetail(S.copies.find(c => c.uid === Number(el.dataset.uid)).card); return; }
      break;
    case 'unshelve': {
      const uid = Number(el.dataset.uid);
      unshelve(S, uid); persist(); render(); openDetail(S.copies.find(c => c.uid === uid).card);
      return;
    }
    case 'open':
      startOpening();
      return;
    case 'reset':
      confirmSheet('Start over?', 'This clears every card, pack and coin in this collection. It cannot be undone.', 'Start over', () => {
        S = newSave(now()); persist(); B.page = 0; toast('A fresh start: 1,000 gold and 3 packs.'); go('packs');
      }, true);
      return;
    default:
      return;
  }
  if (r && !r.ok) { toast(r.error, true); return; }
  persist();
  render();
}

// ---------- events ----------
document.addEventListener('click', e => {
  audio();
  const t = e.target;
  // Opener
  if (!$('#opener').hidden && $('#opener').contains(t)) {
    const op = t.closest('[data-op]');
    if (op) {
      const k = op.dataset.op;
      if (k === 'close') closeOpener();
      else if (k === 'skip') showSummary();
      else if (k === 'again') startOpening();
      else if (k === 'shop') { closeOpener(); go('shop'); }
      return;
    }
    if (O.state === 'summary') {
      const cell = t.closest('[data-card]');
      if (cell) openDetail(cell.dataset.card);
      return;
    }
    if (O.busy) return;
    if (O.state === 'sealed' && t.closest('#stage')) tearPack();
    else if (O.state === 'reveal') { if (!O.flipped) flipCard(); else nextCard(); }
    return;
  }
  if (t.closest('[data-close]')) { closeSheet(); return; }
  const tabBtn = t.closest('.tabs button');
  if (tabBtn) { sfx.tap(); go(tabBtn.dataset.tab); return; }
  const goBtn = t.closest('[data-go]');
  if (goBtn) { go(goBtn.dataset.go); return; }
  const a = t.closest('[data-act]');
  if (a && !a.disabled) { act(a.dataset.act, a); return; }
  const pick = t.closest('[data-pick]');
  if (pick) { shelve(S, Number(pick.dataset.pick), Number(pick.dataset.slot)); persist(); closeSheet(); render(); toast('On display.'); return; }
  const fac = t.closest('[data-fac]');
  if (fac) { B.faction = fac.dataset.fac; B.page = 0; render(); return; }
  const show = t.closest('[data-show]');
  if (show) { B.show = show.dataset.show; B.page = 0; render(); return; }
  const pg = t.closest('[data-page]');
  if (pg && !pg.disabled) { turnPage(Number(pg.dataset.page)); return; }
  const gl = t.closest('[data-glass]');
  if (gl) { openDetail(CARD_BY_ID[shopView(S, now()).glass[Number(gl.dataset.glass)].copy.card].id, { glass: Number(gl.dataset.glass) }); return; }
  const slot = t.closest('[data-slot]');
  if (slot && slot.classList.contains('slot')) {
    const uid = S.shelf[Number(slot.dataset.slot)];
    if (uid != null) openDetail(S.copies.find(c => c.uid === uid).card); else openPicker(Number(slot.dataset.slot));
    return;
  }
  const cardEl = t.closest('[data-card]');
  if (cardEl && $('#view').contains(cardEl)) { openDetail(cardEl.dataset.card); return; }
});
$('#allowance').addEventListener('click', () => {
  const r = claimAllowance(S, now());
  if (r.ok) { sfx.coin(); toast(`Collected ${r.amount} gold from your stipend.`); persist(); render(); }
});
$('#sound').addEventListener('click', () => { prefs.sound = !prefs.sound; savePrefs(); renderTop(); if (prefs.sound) sfx.tap(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (!$('#sheet').hidden) closeSheet(); else if (!$('#opener').hidden && O.state !== 'reveal') closeOpener(); }
  if (tab === 'binder' && $('#sheet').hidden && $('#opener').hidden) {
    if (e.key === 'ArrowRight') turnPage(1);
    if (e.key === 'ArrowLeft') turnPage(-1);
  }
  if (!$('#opener').hidden && (e.key === ' ' || e.key === 'Enter') && O.state !== 'summary') {
    e.preventDefault();
    if (O.busy) return;
    if (O.state === 'sealed') tearPack(); else if (!O.flipped) flipCard(); else nextCard();
  }
});
window.addEventListener('hashchange', () => go(location.hash.slice(1)));

// Keep the clock-driven bits fresh: allowance, restock countdown, and a new shift's stock.
let shownShift = null;
setInterval(() => {
  const t = now();
  renderTop();
  const rs = $('#restock');
  if (tab === 'shop' && rs && $('#sheet').hidden) {
    if (shownShift !== null && shiftOf(t) !== shownShift) { render(); toast('Marta just restocked the shelves!'); }
    else rs.textContent = `New stock in ${untilText(shopView(S, t).restock - t)}`;
  }
  shownShift = shiftOf(t);
}, 20000);

// ---------- boot ----------
S = load();
const first = !S;
if (first) { S = newSave(now()); persist(); }
shownShift = shiftOf(now());
go(location.hash.slice(1) || 'packs', { scroll: false });
if (first) toast('Welcome, collector! Here are 1,000 gold and 3 packs to start.');
