const AGENTS = [
  { id: 'double-agent', name: 'Double Agent', short: 'Double', copies: 6, icon: '◒', color: '#df765e', dark: '#742f30', moves: [-1, 6, -1], flavor: 'A switchback in plain clothes.' },
  { id: 'saboteur', name: 'Saboteur', short: 'Saboteur', copies: 6, icon: '⌁', color: '#5f88bd', dark: '#243e72', moves: [-1, -1, -2], flavor: 'Quiet work. Bad timing.' },
  { id: 'enforcer', name: 'Enforcer', short: 'Enforcer', copies: 6, icon: '✦', color: '#cf9346', dark: '#69421c', moves: [1, 2, 3], flavor: 'The reliable push.' },
  { id: 'daredevil', name: 'Daredevil', short: 'Daredevil', copies: 6, icon: '×', color: '#e26d72', dark: '#762934', moves: [2, 3, null], flavor: 'Fast, loud, and dangerous.' },
  { id: 'codebreaker', name: 'Codebreaker', short: 'Codebreaker', copies: 6, icon: '⌘', color: '#4fa9a1', dark: '#1e5a5b', moves: [0, 0, 0], flavor: 'Three clues crack the case.' },
  { id: 'sentinel', name: 'Sentinel', short: 'Sentinel', copies: 6, icon: '◉', color: '#9984c7', dark: '#49316e', moves: [0, 2, 6], flavor: 'Stillness with a long view.' },
  { id: 'sidekick', name: 'Sidekick', short: 'Sidekick', copies: 1, icon: '➜', color: '#75ae7e', dark: '#285e46', moves: [4, 4, 4], flavor: 'One good turn.' },
  { id: 'mole', name: 'Mole', short: 'Mole', copies: 1, icon: '↓', color: '#9a8e75', dark: '#51442f', moves: [-3, -3, -3], flavor: 'Go underground.' },
];

const TRACK_LAYOUT = [
  [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
  [6, 2], [6, 3], [6, 4], [5, 4], [4, 4], [3, 4],
  [2, 4], [1, 4], [1, 3], [1, 2],
];
const TRACK_SIZE = TRACK_LAYOUT.length;
const START_POSITIONS = [2, 10];
const CATCH_DISTANCE = 8;
const BOT_NAME = 'Kestrel';
let game;

const $ = (selector) => document.querySelector(selector);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const uid = (() => { let value = 0; return () => `card-${++value}`; })();

function agentOf(card) { return AGENTS.find(agent => agent.id === card.agentId); }
function makeDeck() { return AGENTS.flatMap(agent => Array.from({ length: agent.copies }, () => ({ id: uid(), agentId: agent.id }))); }
function shuffle(cards) { for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; } return cards; }
function mod(value, size) { return ((value % size) + size) % size; }
function formatMove(value) { return value === null ? '×' : value > 0 ? `+${value}` : String(value); }
function movementLabel(agent) {
  if (agent.copies === 1) return formatMove(agent.moves[0]);
  if (agent.id === 'codebreaker') return '0  0  ✓';
  return agent.moves.map(formatMove).join('  ');
}
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function currentPlayer() { return game.players[game.turn]; }
function opponentOf(index) { return game.players[1 - index]; }
function schedule(callback, delay = 500) {
  const runId = game?.runId;
  setTimeout(() => { if (game && game.runId === runId) callback(); }, delay);
}

function cardMarkup(card, options = {}) {
  const { hidden = false, mini = false, selected = false, tone = '' } = options;
  if (hidden) return `<div class="agent-card card-back ${mini ? 'mini' : ''} ${selected ? 'selected' : ''}"><span class="back-sigil">◈</span><strong>?</strong><small>CLASSIFIED</small></div>`;
  const agent = agentOf(card);
  return `<div class="agent-card ${mini ? 'mini' : ''} ${selected ? 'selected' : ''} ${tone}" style="--accent:${agent.color};--deep:${agent.dark}" title="${escapeHTML(agent.name)}"><span class="card-kicker">FIELD AGENT <b>${agent.icon}</b></span><span class="card-icon">${agent.icon}</span><strong>${escapeHTML(agent.name)}</strong><span class="card-moves">${movementLabel(agent)}</span><small>${escapeHTML(agent.flavor)}</small></div>`;
}

function startGame() {
  const players = [
    { name: 'You', human: true, hand: [], tableau: [], counts: {}, progress: 0 },
    { name: BOT_NAME, human: false, hand: [], tableau: [], counts: {}, progress: 0 },
  ];
  game = {
    runId: `${Date.now()}-${Math.random()}`,
    players,
    deck: shuffle(makeDeck()),
    discarded: [],
    turn: Math.random() < 0.5 ? 0 : 1,
    phase: 'play',
    step: 1,
    table: [],
    offerRevealed: false,
    recruitChooser: null,
    playFaceUp: null,
    playFaceDown: null,
    discarding: false,
    discardsUsed: 0,
    locked: false,
    over: false,
    log: [],
  };
  for (let i = 0; i < 4; i++) { drawCard(players[0]); drawCard(players[1]); }
  $('#setup').hidden = true;
  $('#game').hidden = false;
  logEvent(`Operation opened. ${game.players[game.turn].name} has the first move.`);
  setMessage(game.turn === 0 ? 'Your move. Choose a card to show.' : `${BOT_NAME} is making the first approach.`);
  render();
  if (game.turn === 1) schedule(botPlayTurn, 850);
}

function drawCard(player) { if (game.deck.length) player.hand.push(game.deck.pop()); }
function drawToFour(player) { while (player.hand.length < 4 && game.deck.length) drawCard(player); }
function removeCard(player, card) { const index = player.hand.findIndex(candidate => candidate.id === card.id); if (index >= 0) player.hand.splice(index, 1); }
function countOf(player, agentId) { return player.counts[agentId] || 0; }
function totalAgents(player) { return player.tableau.length; }

function setMessage(message) { if ($('#message')) $('#message').textContent = message; }
function logEvent(message) {
  if (!game) return;
  game.log.unshift(message);
  $('#game-log').innerHTML = game.log.map(entry => `<li>${escapeHTML(entry)}</li>`).join('');
}

function cardScore(playerIndex, card) {
  const player = game.players[playerIndex];
  const rival = opponentOf(playerIndex);
  const agent = agentOf(card);
  const count = countOf(player, agent.id);
  const move = agent.moves[Math.min(count, 2)];
  let score = (move || 0) * 14;
  if (move > 0) score += 8;
  if (move < 0) score -= 8;
  if (agent.id === 'codebreaker' && count >= 2) score += 118;
  if (agent.id === 'codebreaker' && count === 1) score += 24;
  if (agent.id === 'daredevil' && count >= 2) score -= 145;
  if (agent.id === 'sentinel' && count === 1) score += 26;
  if (agent.id === 'double-agent' && count === 1) score += 30;
  if (agent.id === 'mole' && player.progress - rival.progress > 2) score -= 12;
  if (agent.id === 'sidekick') score += player.progress - rival.progress < 2 ? 18 : 6;
  score += (player.progress - rival.progress) * 1.5;
  return score;
}

function hiddenPool(excludeCard) {
  const used = Object.fromEntries(AGENTS.map(agent => [agent.id, 0]));
  game.players.forEach(player => player.tableau.forEach(card => { used[card.agentId]++; }));
  game.players[1].hand.forEach(card => { used[card.agentId]++; });
  if (excludeCard) used[excludeCard.agentId]++;
  const pool = [];
  AGENTS.forEach(agent => { for (let i = used[agent.id]; i < agent.copies; i++) pool.push({ id: `estimate-${agent.id}-${i}`, agentId: agent.id }); });
  return pool;
}

function expectedHiddenScore(playerIndex, excludeCard) {
  const pool = hiddenPool(excludeCard);
  if (!pool.length) return 0;
  return pool.reduce((total, card) => total + cardScore(playerIndex, card), 0) / pool.length;
}

function predictHumanChoice(faceUp, hidden) {
  const visibleValue = cardScore(0, faceUp);
  const hiddenValue = expectedHiddenScore(0, faceUp);
  if (visibleValue > hiddenValue + 4) return 'faceup';
  if (hiddenValue > visibleValue + 4) return 'facedown';
  return Math.random() < 0.58 ? 'faceup' : 'facedown';
}

function botPlan() {
  const hand = game.players[1].hand;
  const pairs = [];
  for (let i = 0; i < hand.length; i++) {
    for (let j = 0; j < hand.length; j++) {
      if (i === j) continue;
      const faceUp = hand[i];
      const hidden = hand[j];
      const allSame = hand.every(card => card.agentId === faceUp.agentId);
      if (!allSame && faceUp.agentId === hidden.agentId) continue;
      const predicted = predictHumanChoice(faceUp, hidden);
      const botGets = predicted === 'faceup' ? hidden : faceUp;
      const humanGets = predicted === 'faceup' ? faceUp : hidden;
      let score = cardScore(1, botGets) - cardScore(0, humanGets) * 0.28;
      if (agentOf(hidden).id === 'codebreaker' && countOf(game.players[1], 'codebreaker') === 2) score += 42;
      if (agentOf(faceUp).id === 'daredevil' && countOf(game.players[1], 'daredevil') === 2) score += 28;
      score += Math.random() * 9;
      pairs.push({ faceUp, hidden, predicted, score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  return pairs[0] || { faceUp: hand[0], hidden: hand[1], predicted: 'faceup' };
}

function botPlayTurn() {
  if (!game || game.over || game.turn !== 1 || game.phase !== 'play') return;
  if (game.players[1].hand.length < 2) return finishTurn();
  game.locked = true;
  const plan = botPlan();
  removeCard(game.players[1], plan.faceUp);
  removeCard(game.players[1], plan.hidden);
  drawToFour(game.players[1]);
  game.table = [{ card: plan.faceUp, hidden: false, label: 'face up' }, { card: plan.hidden, hidden: true, label: 'face down' }];
  game.offerRevealed = false;
  game.phase = 'recruit';
  game.step = 2;
  game.recruitChooser = 0;
  game.locked = false;
  logEvent(`${BOT_NAME} placed ${agentOf(plan.faceUp).name} face-up and held another card behind a cover.`);
  setMessage(`Kestrel leaves one card in plain sight. Take one agent.`);
  render();
}

function handCardClicked(cardId) {
  if (!game || game.over || game.turn !== 0 || game.phase !== 'play' || game.locked) return;
  const player = game.players[0];
  const card = player.hand.find(candidate => candidate.id === cardId);
  if (!card) return;
  if (game.discarding) return discardCard(card);
  if (!game.playFaceUp) {
    game.playFaceUp = card;
    game.playFaceDown = null;
    setMessage('Now choose a different agent to keep hidden.');
    render();
    return;
  }
  if (card.id === game.playFaceUp.id) { setMessage('Your two agents need different names.'); return; }
  const hasDifferent = player.hand.some(candidate => candidate.id !== game.playFaceUp.id && candidate.agentId !== game.playFaceUp.agentId);
  if (hasDifferent && card.agentId === game.playFaceUp.agentId) { setMessage('Choose a different agent name for the hidden card.'); return; }
  game.playFaceDown = card;
  render();
  schedule(commitHumanPlay, 260);
}

function toggleDiscard() {
  if (!game || game.over || game.turn !== 0 || game.phase !== 'play' || game.locked || game.playFaceUp || game.discardsUsed >= 4 || !game.deck.length) return;
  game.discarding = !game.discarding;
  setMessage(game.discarding ? 'Tap a card to discard and draw a replacement.' : 'Choose the card to show.');
  render();
}

function discardCard(card) {
  if (!game.deck.length || game.discardsUsed >= 4 || game.playFaceUp) return;
  const player = game.players[0];
  removeCard(player, card);
  game.discarded.push(card);
  game.discardsUsed++;
  drawCard(player);
  game.discarding = false;
  logEvent(`You discarded ${agentOf(card).name} and drew a replacement.`);
  setMessage(game.discardsUsed < 4 && game.deck.length ? 'Replacement drawn. Choose the card to show.' : 'Choose the card to show.');
  render();
}

function clearOffer() {
  if (!game || game.phase !== 'play' || game.locked) return;
  game.playFaceUp = null;
  game.playFaceDown = null;
  game.discarding = false;
  setMessage('Your move. Choose a card to show.');
  render();
}

function commitHumanPlay() {
  if (!game || game.over || game.turn !== 0 || !game.playFaceUp || !game.playFaceDown) return;
  const player = game.players[0];
  const faceUp = game.playFaceUp;
  const hidden = game.playFaceDown;
  removeCard(player, faceUp);
  removeCard(player, hidden);
  drawToFour(player);
  game.table = [{ card: faceUp, hidden: false, label: 'face up' }, { card: hidden, hidden: true, label: 'face down' }];
  game.offerRevealed = false;
  game.phase = 'recruit';
  game.step = 2;
  game.recruitChooser = 1;
  game.locked = true;
  logEvent(`You offered ${agentOf(faceUp).name} face-up and another agent face-down.`);
  setMessage(`${BOT_NAME} is studying your offer.`);
  render();
  schedule(botChooseRecruit, 850);
}

function botChooseRecruit() {
  if (!game || game.over || game.phase !== 'recruit' || game.recruitChooser !== 1) return;
  const faceUp = game.table[0].card;
  const ownFace = cardScore(1, faceUp);
  const hiddenValue = expectedHiddenScore(1, faceUp);
  const humanFace = cardScore(0, faceUp);
  const humanHidden = expectedHiddenScore(0, faceUp);
  const chooseFaceUpScore = ownFace - humanHidden * 0.33;
  const chooseHiddenScore = hiddenValue - humanFace * 0.33;
  const choice = chooseFaceUpScore > chooseHiddenScore + 3 ? 'faceup' : chooseHiddenScore > chooseFaceUpScore + 3 ? 'facedown' : (Math.random() < 0.5 ? 'faceup' : 'facedown');
  logEvent(`${BOT_NAME} recruited the ${choice === 'faceup' ? 'face-up' : 'face-down'} agent.`);
  setMessage(`${BOT_NAME} chose the ${choice === 'faceup' ? 'visible' : 'hidden'} agent.`);
  game.locked = true;
  game.offerRevealed = true;
  render();
  schedule(() => resolveRecruit(choice), 720);
}

function offerClicked(choice) {
  if (!game || game.over || game.phase !== 'recruit' || game.recruitChooser !== 0 || game.locked) return;
  game.locked = true;
  game.offerRevealed = true;
  logEvent(`You recruited the ${choice === 'faceup' ? 'face-up' : 'face-down'} agent.`);
  setMessage(`You take the ${choice === 'faceup' ? 'visible' : 'hidden'} agent. The other goes to ${BOT_NAME}.`);
  render();
  schedule(() => resolveRecruit(choice), 620);
}

function recruit(playerIndex, card) {
  const player = game.players[playerIndex];
  const agent = agentOf(card);
  player.tableau.push(card);
  player.counts[agent.id] = countOf(player, agent.id) + 1;
  const count = player.counts[agent.id];
  const move = agent.moves[Math.min(count - 1, 2)];
  if (move !== null && move !== 0) player.progress += move;
  return { playerIndex, card, agent, count, move };
}

function resolveRecruit(choice) {
  if (!game || game.over || game.phase !== 'recruit') return;
  const chosenIndex = choice === 'faceup' ? 0 : 1;
  const otherIndex = chosenIndex === 0 ? 1 : 0;
  const active = game.turn;
  const opponent = 1 - active;
  const opponentCard = game.table[chosenIndex].card;
  const activeCard = game.table[otherIndex].card;
  game.offerRevealed = true;
  game.phase = 'resolve';
  game.step = 2;
  game.locked = true;
  render();
  schedule(() => {
    const opponentEvent = recruit(opponent, opponentCard);
    const activeEvent = recruit(active, activeCard);
    game.lastRecruit = [opponentEvent, activeEvent];
    logRecruit(opponentEvent);
    logRecruit(activeEvent);
    setMessage(`${game.players[opponent].name} recruits ${opponentEvent.agent.name}; ${game.players[active].name} gets ${activeEvent.agent.name}.`);
    render();
    schedule(() => finishTurn(), 850);
  }, 480);
}

function logRecruit(event) {
  const owner = game.players[event.playerIndex].name;
  if (event.agent.id === 'codebreaker' && event.count >= 3) logEvent(`${owner} recruited a third Codebreaker.`);
  else if (event.agent.id === 'daredevil' && event.count >= 3) logEvent(`${owner} recruited a third Daredevil.`);
  else if (event.move === null) logEvent(`${owner} recruited ${event.agent.name} (${event.count} in play).`);
  else if (event.move === 0) logEvent(`${owner} recruited ${event.agent.name} (${event.count} in play): no movement.`);
  else logEvent(`${owner} recruited ${event.agent.name} (${event.count} in play): ${formatMove(event.move)} space${Math.abs(event.move) === 1 ? '' : 's'}.`);
}

function endFlags() {
  const lead = game.players[0].progress - game.players[1].progress;
  const catchFlags = [lead >= CATCH_DISTANCE, lead <= -CATCH_DISTANCE];
  const winFlags = game.players.map((player, index) => catchFlags[index] || countOf(player, 'codebreaker') >= 3);
  const loseFlags = game.players.map(player => countOf(player, 'daredevil') >= 3);
  return { catchFlags, winFlags, loseFlags };
}

function finishTurn() {
  if (!game || game.over) return;
  game.step = 3;
  const { catchFlags, winFlags, loseFlags } = endFlags();
  const active = game.turn;
  const anyWin = winFlags.some(Boolean);
  const anyLose = loseFlags.some(Boolean);
  const ambiguous = (winFlags[0] && winFlags[1]) || (loseFlags[0] && loseFlags[1]) || (anyWin && anyLose);
  if (anyWin || anyLose) {
    if (ambiguous) return endGame(active, 'Both sides hit a condition at once. The active player wins the tie.');
    const winner = winFlags.findIndex(Boolean) >= 0 ? winFlags.findIndex(Boolean) : 1 - loseFlags.findIndex(Boolean);
    const reason = winFlags[winner] ? (catchFlags[winner] ? 'caught the rival' : 'assembled three Codebreakers') : 'survived the final Daredevil';
    return endGame(winner, `${game.players[winner].name} ${reason}.`);
  }
  const next = 1 - active;
  if (!game.deck.length && game.players[next].hand.length < 2) {
    const relative = [game.players[0].progress - game.players[1].progress, game.players[1].progress - game.players[0].progress];
    const winner = relative[0] === relative[1] ? active : relative[0] > relative[1] ? 0 : 1;
    return endGame(winner, 'The agent deck is empty. The closer operative wins the final count.');
  }
  game.turn = next;
  game.phase = 'play';
  game.step = 1;
  game.table = [];
  game.offerRevealed = false;
  game.recruitChooser = null;
  game.playFaceUp = null;
  game.playFaceDown = null;
  game.discarding = false;
  game.locked = false;
  setMessage(game.turn === 0 ? 'Your move. Choose a card to show.' : `${BOT_NAME} is planning a new offer.`);
  render();
  if (game.turn === 1) schedule(botPlayTurn, 900);
}

function endGame(winner, reason) {
  game.over = true;
  game.locked = true;
  game.step = 3;
  game.phase = 'over';
  const won = winner === 0;
  const title = won ? 'You unmasked Kestrel.' : `${BOT_NAME} kept the better cover.`;
  $('#game-over-title').textContent = title;
  $('#game-over-copy').textContent = `${reason} Final progress: You ${game.players[0].progress}, ${BOT_NAME} ${game.players[1].progress}.`;
  logEvent(`${title} ${reason}`);
  setMessage(won ? 'Operation complete. You win.' : 'Operation complete. Kestrel wins.');
  render();
  schedule(() => $('#game-over-dialog').showModal(), 350);
}

function renderScore(playerIndex, elementId) {
  const player = game.players[playerIndex];
  const rival = opponentOf(playerIndex);
  const relative = player.progress - rival.progress;
  const distance = Math.max(0, CATCH_DISTANCE - relative);
  const counts = AGENTS.filter(agent => countOf(player, agent.id)).map(agent => `<span style="--accent:${agent.color}">${agent.short} <b>${countOf(player, agent.id)}</b></span>`).join('');
  const choosing = game.phase === 'recruit' && game.recruitChooser === playerIndex && !game.locked;
  const active = game.turn === playerIndex && !game.locked;
  const state = choosing ? 'YOUR CHOICE' : active ? (playerIndex === 0 ? 'YOUR TURN' : 'PLANNING') : playerIndex === 1 ? 'RIVAL' : 'OPERATIVE';
  $(elementId).innerHTML = `<div class="score-top"><span class="score-name">${player.name}</span><span class="score-state">${state}</span></div><strong class="score-progress">${player.progress > 0 ? '+' : ''}${player.progress}</strong><span class="score-distance">${distance} to catch</span><div class="score-agents">${counts || '<span class="empty-count">No agents in play</span>'}</div>`;
}

function renderBoard() {
  const positions = game.players.map((player, index) => mod(START_POSITIONS[index] + player.progress, TRACK_SIZE));
  $('#track').innerHTML = TRACK_LAYOUT.map(([col, row], index) => {
    const tokens = game.players.map((player, playerIndex) => positions[playerIndex] === index ? `<span class="board-token ${playerIndex === 0 ? 'token-you' : 'token-bot'}" title="${player.name}">${playerIndex === 0 ? 'Y' : 'K'}</span>` : '').join('');
    const home = START_POSITIONS.includes(index);
    return `<div class="track-space ${home ? 'home-space' : ''} ${tokens ? 'occupied' : ''}" style="--col:${col};--row:${row}"><span class="space-number">${String(index + 1).padStart(2, '0')}</span><div class="board-tokens">${tokens}</div></div>`;
  }).join('');
}

function renderOffer() {
  const selected = game.phase === 'play' ? [game.playFaceUp ? { card: game.playFaceUp, hidden: false, label: 'face up' } : null, game.playFaceDown ? { card: game.playFaceDown, hidden: true, label: 'face down' } : null] : game.table;
  const activeOffer = selected.filter(Boolean);
  if (!activeOffer.length) {
    $('#offer').innerHTML = '<div class="offer-empty"><span>◈</span><p>Your two-card offer will appear here.</p></div>';
  } else {
    const canChoose = game.phase === 'recruit' && game.recruitChooser === 0 && !game.locked;
    $('#offer').innerHTML = activeOffer.map((slot, index) => {
      const isHidden = slot.hidden && !game.offerRevealed;
      const label = slot.label === 'face down' ? 'face down' : 'face up';
      const inner = cardMarkup(slot.card, { hidden: isHidden, selected: false });
      return `<button class="offer-slot ${canChoose ? 'can-choose' : ''}" data-offer-choice="${label === 'face up' ? 'faceup' : 'facedown'}" type="button" aria-label="Recruit ${label} card" ${canChoose ? '' : 'tabindex="-1"'}>${inner}<span class="offer-label">${label}${canChoose ? ' · take this' : ''}</span></button>`;
    }).join('');
  }
  $('#offer-title').textContent = game.phase === 'recruit' ? 'Choose one' : 'The offer';
  $('#offer-hint').textContent = game.phase === 'recruit' && game.recruitChooser === 0 && !game.locked ? 'Kestrel will take the other' : game.phase === 'play' ? 'Two different names' : 'Revealing the choice';
}

function renderTableau(playerIndex, elementId, countId) {
  const player = game.players[playerIndex];
  $(countId).textContent = `${totalAgents(player)} agent${totalAgents(player) === 1 ? '' : 's'}`;
  $(elementId).innerHTML = player.tableau.length ? player.tableau.map(card => cardMarkup(card, { mini: true })).join('') : '<div class="tableau-empty"><span>—</span><small>No agents recruited</small></div>';
}

function renderHand() {
  const player = game.players[0];
  const canPlay = game.phase === 'play' && game.turn === 0 && !game.locked;
  const selectedUp = game.playFaceUp;
  const hasDifferent = selectedUp && player.hand.some(card => card.id !== selectedUp.id && card.agentId !== selectedUp.agentId);
  $('#hand').innerHTML = player.hand.map(card => {
    const selected = selectedUp?.id === card.id || game.playFaceDown?.id === card.id;
    const sameAsUp = selectedUp && selectedUp.id !== card.id && selectedUp.agentId === card.agentId;
    const blocked = canPlay && !game.discarding && selectedUp && !game.playFaceDown && hasDifferent && sameAsUp;
    return `<button class="hand-card ${selected ? 'selected' : ''} ${blocked ? 'blocked' : ''} ${canPlay ? 'interactive' : ''}" data-hand-card="${card.id}" type="button" aria-label="${escapeHTML(agentOf(card).name)}${selected ? ', selected' : ''}">${cardMarkup(card, { selected })}</button>`;
  }).join('');
  $('#hand-title').textContent = game.discarding ? 'Discard one' : game.phase === 'play' && game.turn === 0 ? 'Your hand' : 'Your hand · watch the table';
  $('#legal-hint').textContent = game.discarding ? 'Tap a card to discard it and draw a replacement.' : selectedUp && !game.playFaceDown ? (hasDifferent ? 'Choose a different agent for the hidden card.' : 'All cards share a name - an identical card is allowed.') : canPlay ? 'Play one card face-up, then hide a different name.' : 'Your cards stay ready for the next turn.';
  $('#discard-button').hidden = !(game.phase === 'play' && game.turn === 0 && !game.playFaceUp);
  $('#discard-button').disabled = !!(!canPlay || game.discardsUsed >= 4 || !game.deck.length);
  $('#discard-button').classList.toggle('active', game.discarding);
  $('#discard-uses').textContent = `${Math.max(0, 4 - game.discardsUsed)} left`;
  $('#reset-selection').hidden = !(game.phase === 'play' && game.playFaceUp && !game.playFaceDown);
}

function render() {
  if (!game) return;
  $('#turn-label').textContent = `TURN · ${game.turn === 0 ? 'YOU' : BOT_NAME.toUpperCase()} · STEP ${game.step} OF 3`;
  $('#deck-count').textContent = game.deck.length;
  $('#discard-count').textContent = `${game.discarded.length} discarded`;
  $('#catch-gap').textContent = CATCH_DISTANCE;
  renderScore(0, '#score-you');
  renderScore(1, '#score-bot');
  renderBoard();
  renderOffer();
  renderTableau(0, '#you-tableau', '#you-count');
  renderTableau(1, '#bot-tableau', '#bot-count');
  renderHand();
}

function resetToSetup() {
  if (game && !game.over && !confirm('Start a new game? Current progress will be lost.')) return;
  $('#game-over-dialog').close();
  $('#game').hidden = true;
  $('#setup').hidden = false;
  game = null;
}

const menuPopover = $('#game-menu-popover');
const menuButton = $('#menu-button');
function closeMenu() { menuPopover.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); }
menuButton.onclick = () => { const open = menuPopover.hidden; menuPopover.hidden = !open; menuButton.setAttribute('aria-expanded', String(open)); };
$('#start-game').onclick = startGame;
$('#new-game').onclick = resetToSetup;
$('#play-again').onclick = () => { $('#game-over-dialog').close(); startGame(); };
$('#discard-button').onclick = toggleDiscard;
$('#reset-selection').onclick = clearOffer;
$('#hand').addEventListener('click', event => { const button = event.target.closest('[data-hand-card]'); if (button) handCardClicked(button.dataset.handCard); });
$('#offer').addEventListener('click', event => { const button = event.target.closest('[data-offer-choice]'); if (button) offerClicked(button.dataset.offerChoice); });
$('#log-button').onclick = () => { closeMenu(); $('#log-dialog').showModal(); };
$('#rules-button').onclick = () => { closeMenu(); $('#rules-dialog').showModal(); };
document.addEventListener('click', event => { if (!event.target.closest('.game-menu')) closeMenu(); });
$('#clear-log').onclick = () => { if (!game) return; game.log = []; $('#game-log').innerHTML = ''; };
document.querySelectorAll('[data-close]').forEach(button => { button.onclick = () => document.getElementById(button.dataset.close).close(); });
