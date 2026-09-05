import { SUITS, suitOf, newGame, act, options, score, stack, gain, duplicate, botAction, validSave } from './engine.mjs';
import { icon } from './icons.mjs';

const $ = selector => document.querySelector(selector);
const SAVE_KEY = 'pirates.v1';
let game = null, saved = null, timer, fast = false, screen = 'home', saveFailed = false, scrollFrame;
try { const data = JSON.parse(localStorage.getItem(SAVE_KEY)); if (validSave(data)) saved = data; fast = localStorage.getItem('pirates.fast') === 'true'; } catch { /* Storage can be unavailable in private browsers. */ }
const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const playerName = n => n === 0 ? 'You' : 'Captain Rook';

function persist() {
  saved = game;
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(game)); } catch { saveFailed = true; }
}
function smallCard(c, { action = 'suit', danger = false, protectedCard = false, caption = '' } = {}) {
  const s = suitOf(c);
  return `<button class="loot-card ${danger ? 'danger' : ''} ${protectedCard ? 'protected' : ''}" style="--suit:${s.color}" data-action="${action}" data-id="${c.id}" data-suit="${c.suit}" aria-label="${s.name} ${c.value}${danger ? ', causes a bust' : ''}${protectedCard ? ', protected by Anchor' : ''}"><span class="card-value">${c.value}</span>${icon(c.suit)}<span class="card-name">${s.name}</span>${caption ? `<span class="card-caption">${caption}</span>` : ''}${protectedCard ? '<span class="protected-dot" title="Protected">•</span>' : ''}</button>`;
}
function bankMarkup(n) {
  const bank = game.banks[n];
  const selectable = game.active === 0 && game.choice && ((game.choice.type === 'hook' && n === 0) || (['sword', 'cannon'].includes(game.choice.type) && n === 1));
  const eligible = selectable ? options(game).map(c => c.id) : [];
  return `<section data-bank="${n}" class="bank ${n === game.active && game.phase === 'play' ? 'active-bank' : ''}" aria-label="${playerName(n)} bank"><div class="section-heading"><span>${n === 0 ? 'Your treasure' : 'Rook’s treasure'}</span><button class="text-button" data-action="bank" data-player="${n}">${bank.length} cards <span aria-hidden="true">↗</span></button></div><div class="bank-grid">${SUITS.map(s => {
    const cards = stack(bank, s.id), top = cards[0], can = eligible.includes(top?.id);
    return `<button class="bank-slot ${top ? 'filled' : ''} ${can ? 'target drag-source' : ''}" style="--suit:${s.color}" data-action="${can ? 'choose' : 'stack'}" data-drag-card="${can ? 'true' : 'false'}" data-player="${n}" data-suit="${s.id}" data-id="${top?.id || ''}" aria-grabbed="false" aria-label="${s.name}: ${top ? cards.map(c => c.value).join(', ') : 'empty'}${can ? ', drag this card to continue' : ''}">${icon(s.id)}<b>${top?.value || '–'}</b><span>${s.name}</span>${cards.length > 1 ? `<i>${cards.length}</i>` : ''}</button>`;
  }).join('')}</div></section>`;
}
function topbar(home = false) {
  return `<header class="topbar"><a class="shelf-link" href="../../" aria-label="Back to game shelf">←</a><span class="brand">${icon('ship')} Pirates</span><button class="round-button" data-action="${home ? 'help' : 'menu'}" aria-label="${home ? 'How to play' : 'Game menu'}">${home ? '?' : '☰'}</button></header>`;
}
function home() {
  screen = 'home';
  const resume = saved && saved.phase !== 'over';
  $('#app').innerHTML = `<div class="shell home">${topbar(true)}<section class="landing"><div class="title-lockup"><p class="eyebrow">A GAME OF CHANCE & CUNNING</p><h1>Pirates</h1><p class="intro">Fortune favors the bold.</p></div><span class="match-versus" aria-hidden="true">VS</span><div class="match-banner"><span class="captain-name">Player 1<small>The daring duelist</small></span><button class="primary start-button" data-action="${resume ? 'resume' : 'start'}">${resume ? 'Continue' : 'Play'}<span aria-hidden="true">›</span></button><span class="captain-name">Captain Rook<small>The ruthless rival</small></span></div><div class="landing-tools"><button class="secondary learn-button" data-action="help">Learn the ropes</button>${resume ? '<button class="text-button new-voyage" data-action="restart">Start a new voyage</button>' : '<p class="save-note">Draw your fortune. Know when to walk away.</p>'}</div></section><footer class="home-footer">TEN SUITS · TWO CAPTAINS · ONE FORTUNE</footer></div>`;
}
function status() {
  if (game.phase === 'over') return ['Voyage complete', 'The final treasure has been counted.'];
  if (game.phase === 'turnEnd') return [game.result.busted ? 'Overboard!' : 'Treasure secured', game.message];
  if (game.active === 1) return ['Rook is at the helm', game.choice ? `Resolving ${game.choice.type}…` : game.forced ? `${game.forced} more ${game.forced === 1 ? 'card' : 'cards'} required by the Kraken.` : game.message];
  if (game.choice) {
    const text = { hook: ['Replay your loot', 'Drag a highlighted card from your bank into the card line.'], sword: ['Take what’s missing', 'Drag a highlighted card from Rook’s bank into the card line.'], cannon: ['Fire the cannon', 'Drag a highlighted card from Rook’s bank into the red discard zone.'], map: ['Follow the map', 'Choose one recovered card to play.'] };
    return text[game.choice.type];
  }
  if (game.forced) return ['The Kraken demands more', `Play ${game.forced} more ${game.forced === 1 ? 'card' : 'cards'} before collecting.`];
  if (!game.play.length) return ['Your move, Captain', 'Draw your first card to begin.'];
  if (!game.deck.length) return ['The last of the loot', 'Collect your treasure to finish the voyage.'];
  return ['Press on or sail away?', 'A repeated suit busts. Collect to keep your loot.'];
}
function render() {
  screen = 'game';
  const [title, subtitle] = status(), cards = game.result?.cards || game.play;
  const anchor = cards.findIndex(c => c.suit === 'anchor');
  const combo = cards.some(c => c.suit === 'key') && cards.some(c => c.suit === 'chest');
  const human = game.active === 0, playing = game.phase === 'play';
  const preview = gain(game.banks[game.active], game.play);
  const last = cards.at(-1), s = last && suitOf(last);
  const choice = human && game.choice;
  const focus = document.activeElement?.dataset?.focus;
  const bankChoice = choice && ['hook', 'sword', 'cannon'].includes(game.choice.type);
  const playDrop = bankChoice && game.choice.type !== 'cannon';
  const cannonDrop = bankChoice && game.choice.type === 'cannon';
  const deckDisabled = !human || !playing || Boolean(game.choice) || !game.deck.length;
  const dragCopy = { hook: 'Drag a highlighted card from your bank to the card line.', sword: 'Drag a highlighted card from Rook’s bank to the card line.', cannon: 'Drag a highlighted card from Rook’s bank to the red discard zone.' };
  const dropLabel = { hook: 'Drop here to replay', sword: 'Drop here to steal' };
  $('#app').innerHTML = `<div class="shell game-shell">${topbar()}<div class="scoreboard"><div class="score-panel ${human && playing ? 'at-helm' : ''}"><div><span class="eyebrow">YOU</span><small>${human && playing ? 'At the helm' : 'Your bank'}</small></div><strong>${score(game.banks[0])}<small>pts</small></strong></div><span class="versus">vs</span><div class="score-panel ${!human && playing ? 'at-helm rival' : ''}"><div><span class="eyebrow">CAPTAIN ROOK</span><small>${!human && playing ? 'At the helm' : 'Bot captain'}</small></div><strong>${score(game.banks[1])}<small>pts</small></strong></div></div>${bankMarkup(1)}<section class="table" aria-label="Cards in play"><div class="table-topline"><span class="eyebrow">TURN ${game.turn} <span class="turn-dot ${human ? '' : 'rival-dot'}"></span> ${human ? 'YOUR' : 'ROOK’S'} HAUL</span><span class="pile-count"><b>${game.deck.length}</b> draw <span>·</span> <b>${game.discard.length}</b> discard</span></div><div class="draw-pile" aria-hidden="true"><div class="deck-ornament">✦</div>${icon('ship')}<strong>${game.deck.length}</strong><span>PIRATES</span><div class="deck-ornament">✦</div></div><div class="play-grid ${!cards.length ? 'empty-play' : ''}">${cards.length ? cards.map((c, i) => smallCard(c, { protectedCard: anchor >= 0 && i < anchor, danger: Boolean(game.result?.busted && i === cards.length - 1) })).join('') : `<div class="empty-sea">${icon('compass')}<span>Every fortune starts<br>with a little courage.</span></div>`}</div>${last ? `<button class="ability-note" data-action="suit" data-suit="${s.id}" style="--suit:${s.color}">${icon(s.id)}<span><b>${s.name}</b> ${s.short}</span><span class="info-mark">i</span></button>` : ''}<div class="table-tags">${anchor > 0 ? `<span class="tag safe">${anchor} protected by Anchor</span>` : ''}${combo ? '<span class="tag gold">Key + Chest bonus ready</span>' : ''}${game.forced && playing ? `<span class="tag warning">${game.forced} more required</span>` : ''}</div>${game.oracle && game.deck.length && playing ? `<div class="oracle-peek" style="--suit:${suitOf(game.deck.at(-1)).color}">${icon('oracle')}<span>Next card <b>${suitOf(game.deck.at(-1)).name} ${game.deck.at(-1).value}</b></span><strong class="${duplicate(game, game.deck.at(-1)) ? 'risk-text' : ''}">${duplicate(game, game.deck.at(-1)) ? 'Will bust' : 'New suit'}</strong></div>` : ''}</section><section class="turn-status ${game.result?.busted ? 'bust-status' : ''}" aria-label="Turn instructions"><h2>${title}</h2><p>${esc(subtitle)}</p></section>${choice ? `<section class="choice-panel" aria-label="${game.choice.type} card choices"><div class="choice-heading"><span>CHOOSE A CARD</span><span>Ability required</span></div><div class="choice-grid">${options(game).map(c => smallCard(c, { action: 'choose', danger: game.choice.type !== 'cannon' && duplicate(game, c), caption: game.choice.type === 'cannon' ? 'Discard' : duplicate(game, c) ? 'Will bust' : 'Play card' })).join('')}</div></section>` : ''}${bankMarkup(0)}<div class="bottom-space"></div><footer class="action-dock">${game.phase === 'over' ? '<button class="primary" data-action="results">View final scores <span>→</span></button>' : game.phase === 'turnEnd' ? `<div class="turn-receipt"><span>${game.result.busted ? 'BUST' : 'COLLECTED'}</span><b>+${game.result.delta} pts${game.result.bonus.length ? ` · ${game.result.bonus.length} bonus cards` : ''}</b></div><button class="primary" data-action="next">${human ? 'Rook’s turn' : 'Your turn'} <span>→</span></button>` : !human ? `<div class="bot-working"><span class="thinking-dots"><i></i><i></i><i></i></span><span>Captain Rook is weighing the odds</span><button class="text-button" data-action="speed">${fast ? '1×' : '2×'}</button></div>` : choice ? '<div class="choice-reminder">Choose a highlighted card above to continue.</div>' : `<button class="secondary draw-button" data-focus="draw" data-action="draw" ${!game.deck.length ? 'disabled' : ''}>${icon('ship')}<span>${game.forced ? 'Draw required' : 'Draw a card'}<small>${game.deck.length} remaining</small></span></button><button class="primary collect-button" data-focus="collect" data-action="collect" ${!game.play.length || game.forced && game.deck.length ? 'disabled' : ''}><span>Collect<small>${game.forced ? 'Kraken must resolve' : game.play.length ? `${game.play.length} cards · +${preview} pts${combo ? ' + bonus' : ''}` : 'Draw to begin'}</small></span><span>→</span></button>`}</footer>${saveFailed ? '<p class="storage-warning">Saving is unavailable in this browser. Keep this tab open to finish your voyage.</p>' : ''}</div>`;
  const table = $('.table');
  if (table) {
    const deck = table.querySelector('.draw-pile');
    deck.outerHTML = `<button class="draw-pile" data-focus="draw" data-action="draw" ${deckDisabled ? 'disabled' : ''} aria-label="${game.deck.length ? 'Draw the next card' : 'The draw deck is empty'}"><div class="deck-ornament">✦</div>${icon('ship')}<strong>${game.deck.length}</strong><span>PIRATES</span><small>CLICK TO DRAW</small><div class="deck-ornament">✦</div></button>`;
    $('.draw-button')?.remove();
    if (bankChoice) $('.choice-panel')?.remove();
    if (playDrop) {
      const play = table.querySelector('.play-grid');
      play.dataset.dropTarget = 'play';
      play.classList.add('drag-target');
      play.setAttribute('aria-label', `${dropLabel[game.choice.type]}; ${dragCopy[game.choice.type]}`);
      play.insertAdjacentHTML('afterend', `<div class="ability-instruction"><span class="instruction-icon">${icon(game.choice.type)}</span><span><b>${dropLabel[game.choice.type]}</b><small>${dragCopy[game.choice.type]}</small></span></div>`);
    } else if (cannonDrop) {
      table.querySelector('.play-grid').insertAdjacentHTML('afterend', `<div class="ability-drop-zone cannon-drop" data-drop-target="discard" role="status" aria-label="Drop a highlighted card here to discard it"><span class="instruction-icon">${icon('cannon')}</span><span><b>Drop to discard</b><small>${dragCopy.cannon}</small></span></div>`);
    }
    if (bankChoice) $('.choice-reminder').textContent = dragCopy[game.choice.type];
  }
  if (focus) $(`[data-focus="${focus}"]`)?.focus({ preventScroll: true });
  $('#announcer').textContent = `${title}. ${subtitle}`;
  scheduleBot();
}
function scheduleBot() {
  clearTimeout(timer);
  if (screen !== 'game' || !game || $('#sheet').open) return;
  if (game.active === 1 && game.phase === 'play') timer = setTimeout(() => move(botAction(game)), fast ? 330 : 1100);
}
function move(action) {
  const wasChoice = Boolean(game.choice);
  if (!act(game, action)) return;
  persist(); render();
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(() => {
    if (game.active === 0 && game.choice?.type === 'map') $('.choice-panel')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    else if (wasChoice || action.type === 'next') $('.table')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
  if (game.phase === 'over') showResults();
}
let returnFocus;
function modal(title, content, cls = '') {
  clearTimeout(timer);
  const sheet = $('#sheet');
  if (!sheet.open) returnFocus = document.activeElement;
  sheet.className = cls;
  sheet.innerHTML = `<div class="sheet-header"><h2 id="sheet-title">${title}</h2><button class="round-button" data-action="close" aria-label="Close dialog">×</button></div>${content}`;
  if (!sheet.open) sheet.showModal();
  sheet.scrollTop = 0;
}
function closeModal() { $('#sheet').close(); }
$('#sheet').addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus(); scheduleBot(); });
$('#sheet').addEventListener('click', e => { if (e.target === $('#sheet')) { const rect = e.target.getBoundingClientRect(); if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) closeModal(); } });

function help() {
  modal('Learn the ropes', `<div class="help-intro">The richest captain wins.<br><span>Only your highest card in each suit scores.</span></div><ol class="help-steps"><li><b>Draw treasure</b><p>Click the deck to draw a card. Its ability activates immediately. Resolve it before doing anything else.</p></li><li><b>Keep your nerve</b><p>Keep drawing different suits to grow your haul. Repeat any suit in play and you bust: discard the haul, except cards protected by an Anchor.</p></li><li><b>Know when to leave</b><p>Collect to move the whole haul into your bank. Then your rival takes a turn. The highest card of each suit scores; lower cards stay underneath.</p></li></ol><div class="rules-note"><b>The last card</b><p>Finish every required ability on the final draw, then collect or bust. Highest score wins. Ties go to the captain with more banked cards, then a shared victory.</p></div><h3 class="guide-title">Know your ten suits</h3><div class="suit-guide">${SUITS.map(s => `<article style="--suit:${s.color}">${icon(s.id)}<div><h3>${s.name}</h3><p>${s.rule}</p></div></article>`).join('')}</div><div class="rules-note"><b>A few finer points</b><p>Abilities trigger whenever a card enters play, including stolen or recovered cards. Hook, Sword, and Cannon cards are resolved by dragging a highlighted bank card to the card line or discard zone. A card that causes a bust never activates. If there is no legal target, skip that ability. When an Anchor saves both a Key and Chest, those protected cards earn the bonus, too.</p><p>The 60-card deck has six cards per suit. The lowest of each suit starts in the discard; shuffle the other 50 to draw from. The starting captain is chosen at random.</p><p>Tap any suit to read its ability. Tap a bank to inspect all its cards. Your voyage saves after every move.</p></div><button class="primary full" data-action="close">Ready, Captain</button>`);
}
function showSuit(id, n) {
  const s = SUITS.find(s => s.id === id); if (!s) return;
  const cards = n === undefined ? [] : stack(game.banks[n], id);
  modal(s.name, `<div class="suit-detail" style="--suit:${s.color}">${icon(id)}<p>${s.rule}</p></div>${n !== undefined ? `<div class="rules-note"><b>${n === 0 ? 'Your' : 'Rook’s'} ${s.name} stack</b><p>${cards.length ? `${cards.map(c => c.value).join(' · ')} — the highest card scores ${cards[0].value} points.` : 'No cards collected in this suit yet.'}</p></div>` : ''}<button class="primary full" data-action="close">Back to the voyage</button>`);
}
function showBank(n) {
  modal(n === 0 ? 'Your treasure' : 'Rook’s treasure', `<div class="bank-total"><strong>${score(game.banks[n])}</strong><span>points across ${game.banks[n].length} cards</span></div><div class="bank-list">${SUITS.map(s => { const cards = stack(game.banks[n], s.id); return `<div style="--suit:${s.color}">${icon(s.id)}<span>${s.name}<small>${cards.map(c => c.value).join(' · ') || 'No treasure yet'}</small></span><b>${cards[0]?.value || '–'}</b></div>`; }).join('')}</div><p class="muted">Each suit’s highest card scores. The rest remain in your bank, ready to be exposed or replayed.</p>`);
}
function showResults() {
  const a = score(game.banks[0]), b = score(game.banks[1]);
  modal(game.winner === 0 ? 'The sea is yours.' : game.winner === 1 ? 'Rook takes the riches.' : 'A fortune shared.', `<div class="result-hero">${icon(game.winner === 0 ? 'chest' : game.winner === 1 ? 'ship' : 'anchor')}<p>${game.winner === 0 ? 'Well sailed, Captain.' : game.winner === 1 ? 'There’s always another horizon.' : 'Two captains. Equal treasure.'}</p></div><div class="final-scores"><div class="${game.winner === 0 ? 'winner' : ''}"><span>YOU</span><strong>${a}</strong><small>${game.banks[0].length} cards</small></div><div class="${game.winner === 1 ? 'winner' : ''}"><span>CAPTAIN ROOK</span><strong>${b}</strong><small>${game.banks[1].length} cards</small></div></div>${a === b ? `<p class="rules-note">${game.winner === -1 ? 'Scores and card counts are equal. You share the victory.' : 'Scores tied. The captain with more banked cards wins.'}</p>` : ''}<div class="score-breakdown"><div class="breakdown-heading"><span>SUIT</span><b>YOU</b><b>ROOK</b></div>${SUITS.map(s => `<div style="--suit:${s.color}"><span>${icon(s.id)}${s.name}</span><b>${stack(game.banks[0], s.id)[0]?.value || '–'}</b><b>${stack(game.banks[1], s.id)[0]?.value || '–'}</b></div>`).join('')}</div><p class="muted">${esc(game.message)}</p><button class="primary full" data-action="start">Sail again <span>→</span></button><button class="text-button full" data-action="close">Inspect the final table</button>`, 'results-sheet');
}
function menu() {
  modal('Captain’s quarters', `<div class="menu-list"><button data-action="help">Learn the ropes <span>→</span></button><button data-action="log">Voyage log <span>→</span></button><button data-action="speed">Bot pace <span>${fast ? 'Quick' : 'Leisurely'}</span></button><button data-action="restart">New voyage <span>↗</span></button><button data-action="home">Return to title <span>→</span></button></div><p class="muted">${saveFailed ? 'Saving is unavailable. Keep this tab open.' : 'Your voyage is saved automatically on this device.'}</p>`);
}
function start() { clearTimeout(timer); closeModal(); game = newGame(); persist(); render(); }
let dragState = null, dragGhost = null, suppressClick = false;
function clearDragPreview() {
  document.querySelectorAll('.dragging').forEach(el => { el.classList.remove('dragging'); el.setAttribute('aria-grabbed', 'false'); });
  document.querySelectorAll('.drop-hover').forEach(el => el.classList.remove('drop-hover'));
  dragGhost?.remove(); dragGhost = null;
}
function dropTargetAt(x, y) {
  const target = document.elementFromPoint(x, y)?.closest('[data-drop-target]');
  if (!target || !dragState || !game?.choice) return null;
  const expected = game.choice.type === 'cannon' ? 'discard' : 'play';
  return target.dataset.dropTarget === expected ? target : null;
}
document.addEventListener('pointerdown', e => {
  if ((e.pointerType === 'mouse' && e.button !== 0) || !game?.choice) return;
  const source = e.target.closest('[data-drag-card="true"]');
  if (!source || !options(game).some(c => c.id === source.dataset.id)) return;
  dragState = { id: source.dataset.id, source, pointerId: e.pointerId, startX: e.clientX, startY: e.clientY, moved: false };
  source.setPointerCapture?.(e.pointerId);
});
document.addEventListener('pointermove', e => {
  if (!dragState || e.pointerId !== dragState.pointerId) return;
  const distance = Math.hypot(e.clientX - dragState.startX, e.clientY - dragState.startY);
  if (!dragState.moved && distance < 6) return;
  e.preventDefault();
  if (!dragState.moved) {
    dragState.moved = true;
    dragState.source.classList.add('dragging');
    dragState.source.setAttribute('aria-grabbed', 'true');
    dragGhost = dragState.source.cloneNode(true);
    dragGhost.classList.add('drag-ghost');
    dragGhost.style.width = `${dragState.source.getBoundingClientRect().width}px`;
    document.body.append(dragGhost);
  }
  dragGhost.style.transform = `translate(${e.clientX + 12}px, ${e.clientY + 12}px)`;
  document.querySelectorAll('[data-drop-target].drop-hover').forEach(el => el.classList.remove('drop-hover'));
  dropTargetAt(e.clientX, e.clientY)?.classList.add('drop-hover');
}, { passive: false });
function endDrag(e) {
  if (!dragState || e.pointerId !== dragState.pointerId) return;
  const { id, moved } = dragState;
  const target = moved ? dropTargetAt(e.clientX, e.clientY) : null;
  clearDragPreview(); dragState = null;
  if (!moved) return;
  suppressClick = true;
  setTimeout(() => { suppressClick = false; }, 0);
  if (target) move({ type: 'choose', id });
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', e => { if (dragState?.pointerId === e.pointerId) { clearDragPreview(); dragState = null; } });
document.addEventListener('click', e => {
  if (suppressClick) return;
  const b = e.target.closest('[data-action]'); if (!b || b.disabled) return;
  const action = b.dataset.action;
  if (action === 'close') closeModal();
  else if (action === 'help') help();
  else if (action === 'start') start();
  else if (action === 'resume') { game = saved; render(); }
  else if (action === 'restart') modal('Start a new voyage?', '<p class="confirm-copy">Your current treasure and progress will be replaced by a freshly shuffled deck.</p><button class="primary full" data-action="start">Start new voyage</button><button class="secondary full" data-action="close">Keep this voyage</button>');
  else if (action === 'home') { closeModal(); clearTimeout(timer); home(); }
  else if (action === 'menu') menu();
  else if (action === 'results') showResults();
  else if (action === 'bank') showBank(Number(b.dataset.player));
  else if (action === 'suit') showSuit(b.dataset.suit);
  else if (action === 'stack') showSuit(b.dataset.suit, Number(b.dataset.player));
  else if (action === 'speed') { fast = !fast; try { localStorage.setItem('pirates.fast', fast); } catch {} if ($('#sheet').open) menu(); else render(); }
  else if (action === 'log') modal('Voyage log', `<div class="voyage-log">${game.history.length ? game.history.map(h => `<article><span>TURN ${h.turn} · ${h.player === 0 ? 'YOU' : 'ROOK'}</span><p>${esc(h.text)}</p></article>`).join('') : '<p>Your story is still unwritten. Draw your first card.</p>'}</div>`);
  else if (game && (game.active === 0 || action === 'next')) {
    if (['draw', 'collect', 'next'].includes(action)) move({ type: action });
    else if (action === 'choose') move({ type: 'choose', id: b.dataset.id });
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) clearTimeout(timer); else scheduleBot(); });
home();
