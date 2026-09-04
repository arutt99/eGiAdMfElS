const AGENTS = [
  { id: 'double-agent', name: 'Double Agent', short: 'Double', copies: 6, icon: '◒', color: '#db755f', dark: '#632d32', moves: [-1, 6, -1], flavor: 'Always working both sides.' },
  { id: 'saboteur', name: 'Saboteur', short: 'Saboteur', copies: 6, icon: '⌁', color: '#507aa5', dark: '#243751', moves: [-1, -1, -2], flavor: 'A quiet wrench in the plan.' },
  { id: 'enforcer', name: 'Enforcer', short: 'Enforcer', copies: 6, icon: '✦', color: '#bd8139', dark: '#5b391d', moves: [1, 2, 3], flavor: 'Pressure opens every door.' },
  { id: 'daredevil', name: 'Daredevil', short: 'Daredevil', copies: 6, icon: '×', color: '#d45d67', dark: '#642531', moves: [2, 3, null], flavor: 'Quick enough to blow a cover.' },
  { id: 'codebreaker', name: 'Codebreaker', short: 'Codebreaker', copies: 6, icon: '⌘', color: '#3f9993', dark: '#174a4b', moves: [0, 0, 0], flavor: 'Three clues crack the case.' },
  { id: 'sentinel', name: 'Sentinel', short: 'Sentinel', copies: 6, icon: '◉', color: '#8171ad', dark: '#3c2c5e', moves: [0, 2, 6], flavor: 'Patience, then one clean move.' },
  { id: 'sidekick', name: 'Sidekick', short: 'Sidekick', copies: 1, icon: '➜', color: '#6ba879', dark: '#24523e', moves: [4, 4, 4], flavor: 'The right help at the right time.' },
  { id: 'mole', name: 'Mole', short: 'Mole', copies: 1, icon: '↓', color: '#8a806e', dark: '#463d31', moves: [-3, -3, -3], flavor: 'Sometimes down is the way out.' },
];

// Clockwise from the upper-left corner: 4 top, 3 right, 4 bottom, 3 left.
const TRACK_LAYOUT = [
  [1, 1], [2, 1], [3, 1], [4, 1],
  [4, 2], [4, 3], [4, 4],
  [4, 5], [3, 5], [2, 5], [1, 5],
  [1, 4], [1, 3], [1, 2],
];
const TRACK_SIZE = 14;
const START_POSITIONS = [12, 5];
const CATCH_DISTANCE = 7;
const BOT_NAME = 'Kestrel';
let game;

const $ = selector => document.querySelector(selector);
const uid = (() => { let value = 0; return () => `card-${++value}`; })();

function agentOf(card) { return AGENTS.find(agent => agent.id === card.agentId); }
function makeDeck() { return AGENTS.flatMap(agent => Array.from({ length: agent.copies }, () => ({ id: uid(), agentId: agent.id }))); }
function shuffle(cards) { for (let i = cards.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; } return cards; }
function mod(value, size) { return ((value % size) + size) % size; }
function formatMove(value) { return value === null ? '×' : value > 0 ? `+${value}` : String(value); }
function escapeHTML(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char])); }
function opponentOf(index) { return game.players[1 - index]; }
function countOf(player, agentId) { return player.counts[agentId] || 0; }
function totalAgents(player) { return player.tableau.length; }

function schedule(callback, delay = 500) {
  const runId = game?.runId;
  setTimeout(() => { if (game && game.runId === runId) callback(); }, delay);
}

function wait(delay, runId) {
  return new Promise(resolve => setTimeout(() => resolve(Boolean(game && game.runId === runId)), delay));
}

function abilityValues(agent) {
  if (agent.copies === 1) return [{ value: formatMove(agent.moves[0]), kind: agent.moves[0] < 0 ? 'back' : 'forward' }];
  if (agent.id === 'codebreaker') return [{ value: '0' }, { value: '0' }, { value: '✓', kind: 'win' }];
  return agent.moves.map(value => ({ value: formatMove(value), kind: value === null ? 'danger' : value < 0 ? 'back' : value > 0 ? 'forward' : '' }));
}

function cardMarkup(card, options = {}) {
  const { hidden = false, mini = false, selected = false } = options;
  if (hidden) {
    return `<div class="agent-card card-back ${mini ? 'mini' : ''} ${selected ? 'selected' : ''}"><span class="back-lines"></span><span class="back-eye">◈</span><strong>CLASSIFIED</strong><small>NEIGHBORHOOD FILE</small></div>`;
  }
  const agent = agentOf(card);
  const abilities = abilityValues(agent).map(item => `<span class="ability ${item.kind || ''}">${item.value}</span>`).join('');
  return `<div class="agent-card ${mini ? 'mini' : ''} ${selected ? 'selected' : ''}" style="--accent:${agent.color};--deep:${agent.dark}" title="${escapeHTML(agent.name)}">
    <span class="card-index">FIELD FILE <b>${agent.icon}</b></span>
    <span class="portrait"><i></i><b>${agent.icon}</b></span>
    <span class="nameplate"><strong>${escapeHTML(agent.name)}</strong><small>${escapeHTML(agent.flavor)}</small></span>
    <span class="abilities">${abilities}</span>
  </div>`;
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
    turn: Number(document.querySelector('input[name="starting-player"]:checked').value),
    phase: 'play',
    table: [],
    offerRevealed: false,
    offerDissolving: false,
    recruitChoice: null,
    recruitChooser: null,
    playFaceUp: null,
    playFaceDown: null,
    discarding: false,
    discardsUsed: 0,
    motionPlayers: [],
    locked: false,
    over: false,
    log: [],
  };
  for (let i = 0; i < 4; i++) { drawCard(players[0]); drawCard(players[1]); }
  document.body.classList.add('game-active');
  $('#setup').hidden = true;
  $('#game').hidden = false;
  logEvent(`Operation opened. ${game.players[game.turn].name} has the first move.`);
  setMessage(game.turn === 0 ? 'Show one agent. Hide another.' : `${BOT_NAME} is preparing an offer.`);
  render();
  if (game.turn === 1) schedule(botPlayTurn, 650);
}

function drawCard(player) { if (game.deck.length) player.hand.push(game.deck.pop()); }
function drawToFour(player) { while (player.hand.length < 4 && game.deck.length) drawCard(player); }
function removeCard(player, card) { const index = player.hand.findIndex(candidate => candidate.id === card.id); if (index >= 0) player.hand.splice(index, 1); }
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

function predictHumanChoice(faceUp) {
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
      const predicted = predictHumanChoice(faceUp);
      const botGets = predicted === 'faceup' ? hidden : faceUp;
      const humanGets = predicted === 'faceup' ? faceUp : hidden;
      let score = cardScore(1, botGets) - cardScore(0, humanGets) * 0.28;
      if (hidden.agentId === 'codebreaker' && countOf(game.players[1], 'codebreaker') === 2) score += 42;
      if (faceUp.agentId === 'daredevil' && countOf(game.players[1], 'daredevil') === 2) score += 28;
      score += Math.random() * 9;
      pairs.push({ faceUp, hidden, score });
    }
  }
  pairs.sort((a, b) => b.score - a.score);
  return pairs[0] || { faceUp: hand[0], hidden: hand[1] };
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
  game.offerDissolving = false;
  game.recruitChoice = null;
  game.phase = 'recruit';
  game.recruitChooser = 0;
  game.locked = false;
  logEvent(`${BOT_NAME} placed ${agentOf(plan.faceUp).name} face-up and another agent face-down.`);
  setMessage('Choose one of Kestrel’s agents.');
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
    setMessage('Now hide a different agent.');
    render();
    return;
  }
  if (card.id === game.playFaceUp.id) { setMessage('Choose a second card.'); return; }
  const hasDifferent = player.hand.some(candidate => candidate.id !== game.playFaceUp.id && candidate.agentId !== game.playFaceUp.agentId);
  if (hasDifferent && card.agentId === game.playFaceUp.agentId) { setMessage('The hidden agent needs a different name.'); return; }
  game.playFaceDown = card;
  render();
  schedule(commitHumanPlay, 150);
}

function toggleDiscard() {
  if (!game || game.over || game.turn !== 0 || game.phase !== 'play' || game.locked || game.playFaceUp || game.discardsUsed >= 4 || !game.deck.length) return;
  game.discarding = !game.discarding;
  setMessage(game.discarding ? 'Tap one card to discard it.' : 'Show one agent. Hide another.');
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
  setMessage('Replacement drawn. Make your offer.');
  render();
}

function clearOffer() {
  if (!game || game.phase !== 'play' || game.locked) return;
  game.playFaceUp = null;
  game.playFaceDown = null;
  game.discarding = false;
  setMessage('Show one agent. Hide another.');
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
  game.playFaceUp = null;
  game.playFaceDown = null;
  game.offerRevealed = false;
  game.offerDissolving = false;
  game.recruitChoice = null;
  game.phase = 'recruit';
  game.recruitChooser = 1;
  game.locked = true;
  logEvent(`You offered ${agentOf(faceUp).name} face-up and another agent face-down.`);
  setMessage(`${BOT_NAME} is reading your offer.`);
  render();
  schedule(botChooseRecruit, 700);
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
  game.recruitChoice = choice;
  game.offerRevealed = true;
  game.locked = true;
  logEvent(`${BOT_NAME} recruited the ${choice === 'faceup' ? 'face-up' : 'face-down'} agent.`);
  setMessage(`${BOT_NAME} made a choice.`);
  render();
  schedule(() => resolveRecruit(choice), 420);
}

function offerClicked(choice) {
  if (!game || game.over || game.phase !== 'recruit' || game.recruitChooser !== 0 || game.locked) return;
  game.recruitChoice = choice;
  game.offerRevealed = true;
  game.locked = true;
  logEvent(`You recruited the ${choice === 'faceup' ? 'face-up' : 'face-down'} agent.`);
  setMessage('Choice revealed. Both agents move.');
  render();
  schedule(() => resolveRecruit(choice), 380);
}

function prepareRecruit(playerIndex, card) {
  const player = game.players[playerIndex];
  const agent = agentOf(card);
  player.tableau.push(card);
  player.counts[agent.id] = countOf(player, agent.id) + 1;
  const count = player.counts[agent.id];
  const move = agent.moves[Math.min(count - 1, 2)];
  return { playerIndex, card, agent, count, move };
}

async function resolveRecruit(choice) {
  if (!game || game.over || game.phase !== 'recruit') return;
  const runId = game.runId;
  const chosenIndex = choice === 'faceup' ? 0 : 1;
  const otherIndex = chosenIndex === 0 ? 1 : 0;
  const active = game.turn;
  const opponent = 1 - active;
  const opponentEvent = prepareRecruit(opponent, game.table[chosenIndex].card);
  const activeEvent = prepareRecruit(active, game.table[otherIndex].card);
  const events = [opponentEvent, activeEvent];
  game.phase = 'resolve';
  game.offerDissolving = true;
  game.motionPlayers = events.filter(event => event.move).map(event => event.playerIndex);
  logRecruit(opponentEvent);
  logRecruit(activeEvent);
  setMessage(`${game.players[opponent].name}: ${agentOf(opponentEvent.card).name}. ${game.players[active].name}: ${agentOf(activeEvent.card).name}.`);
  render();

  if (!await wait(70, runId)) return;
  const maxSteps = Math.max(...events.map(event => Math.abs(event.move || 0)), 0);
  for (let step = 1; step <= maxSteps; step++) {
    events.forEach(event => {
      if (event.move && step <= Math.abs(event.move)) game.players[event.playerIndex].progress += Math.sign(event.move);
    });
    game.motionPlayers = events.filter(event => event.move && step <= Math.abs(event.move)).map(event => event.playerIndex);
    renderBoard();
    if (!await wait(105, runId)) return;
  }
  game.motionPlayers = [];
  renderBoard();
  if (!await wait(maxSteps ? 170 : 430, runId)) return;
  game.offerDissolving = false;
  game.table = [];
  game.recruitChoice = null;
  finishTurn();
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
  const { catchFlags, winFlags, loseFlags } = endFlags();
  const active = game.turn;
  const anyWin = winFlags.some(Boolean);
  const anyLose = loseFlags.some(Boolean);
  const samePlayerWinsAndLoses = winFlags.some((wins, index) => wins && loseFlags[index]);
  const tiedConditions = (winFlags[0] && winFlags[1]) || (loseFlags[0] && loseFlags[1]) || samePlayerWinsAndLoses;
  if (anyWin || anyLose) {
    if (tiedConditions) return endGame(active, 'Both sides reached an end condition. The active player wins the tie.');
    const winner = winFlags.findIndex(Boolean) >= 0 ? winFlags.findIndex(Boolean) : 1 - loseFlags.findIndex(Boolean);
    const reason = winFlags[winner] ? (catchFlags[winner] ? 'caught the rival.' : 'assembled three Codebreakers.') : 'survived the rival’s third Daredevil.';
    return endGame(winner, `${game.players[winner].name} ${reason}`);
  }

  const next = 1 - active;
  if (!game.deck.length && game.players[next].hand.length < 2) {
    const relative = [game.players[0].progress - game.players[1].progress, game.players[1].progress - game.players[0].progress];
    const winner = relative[0] === relative[1] ? active : relative[0] > relative[1] ? 0 : 1;
    return endGame(winner, 'The deck is empty. The closer operative wins the final count.');
  }

  game.turn = next;
  game.phase = 'play';
  game.offerRevealed = false;
  game.recruitChooser = null;
  game.playFaceUp = null;
  game.playFaceDown = null;
  game.discarding = false;
  game.locked = false;
  setMessage(game.turn === 0 ? 'Show one agent. Hide another.' : `${BOT_NAME} is preparing an offer.`);
  render();
  if (game.turn === 1) schedule(botPlayTurn, 650);
}

function endGame(winner, reason) {
  game.over = true;
  game.locked = true;
  game.phase = 'over';
  const title = winner === 0 ? 'You unmasked Kestrel.' : `${BOT_NAME} kept the better cover.`;
  $('#game-over-title').textContent = title;
  $('#game-over-copy').textContent = reason;
  logEvent(`${title} ${reason}`);
  setMessage(winner === 0 ? 'Operation complete. You win.' : `Operation complete. ${BOT_NAME} wins.`);
  render();
  schedule(() => $('#game-over-dialog').showModal(), 300);
}

function turnLabel() {
  if (game.phase === 'over') return 'OPERATION CLOSED';
  if (game.phase === 'resolve') return 'AGENTS IN MOTION';
  if (game.phase === 'recruit') return game.recruitChooser === 0 ? 'YOUR CHOICE' : `${BOT_NAME.toUpperCase()} CHOOSES`;
  return game.turn === 0 ? 'YOUR PLAY' : `${BOT_NAME.toUpperCase()} PLAYS`;
}

function renderBoard() {
  const positions = game.players.map((player, index) => mod(START_POSITIONS[index] + player.progress, TRACK_SIZE));
  $('#track').innerHTML = TRACK_LAYOUT.map(([col, row], index) => {
    const homeIndex = START_POSITIONS.indexOf(index);
    const homeClass = homeIndex === 0 ? 'home-you' : homeIndex === 1 ? 'home-bot' : '';
    const homePin = homeIndex >= 0 ? `<span class="home-pin">${homeIndex === 0 ? 'Y' : 'K'}</span>` : '';
    const tokens = game.players.map((player, playerIndex) => positions[playerIndex] === index ? `<span class="board-token ${playerIndex === 0 ? 'token-you' : 'token-bot'} ${game.motionPlayers.includes(playerIndex) ? 'moving' : ''}" title="${player.name}">${playerIndex === 0 ? 'Y' : 'K'}</span>` : '').join('');
    return `<div class="track-space segment-${index} ${homeClass} ${tokens ? 'occupied' : ''}" style="--col:${col};--row:${row}" aria-label="Space ${index + 1}${homeIndex >= 0 ? `, ${game.players[homeIndex].name} home` : ''}">${homePin}<div class="board-tokens">${tokens}</div></div>`;
  }).join('');
}

function renderOffer() {
  const layer = $('#offer-layer');
  const visible = game.table.length && (game.phase === 'recruit' || game.phase === 'resolve');
  layer.hidden = !visible;
  layer.classList.toggle('dissolving', game.offerDissolving);
  if (!visible) { $('#offer').innerHTML = ''; return; }

  const canChoose = game.phase === 'recruit' && game.recruitChooser === 0 && !game.locked;
  $('#offer-kicker').textContent = `${game.players[game.turn].name} offered`;
  $('#offer-title').textContent = game.phase === 'resolve' ? 'Agents in motion' : game.offerRevealed ? 'Choice revealed' : canChoose ? 'Choose your recruit' : `${BOT_NAME} is reading you`;
  $('#offer-hint').textContent = game.phase === 'resolve' ? 'The cards enter the neighborhood as both meeples move.' : game.offerRevealed ? 'The chosen card is highlighted.' : canChoose ? 'Tap either card. Kestrel receives the other.' : 'One card is visible. One remains a bluff.';
  $('#offer').innerHTML = game.table.map(slot => {
    const choice = slot.label === 'face up' ? 'faceup' : 'facedown';
    const hidden = slot.hidden && !game.offerRevealed;
    const chosen = game.recruitChoice === choice;
    const passed = game.recruitChoice && !chosen;
    return `<button class="offer-slot ${canChoose ? 'can-choose' : ''} ${chosen ? 'chosen' : ''} ${passed ? 'passed' : ''}" data-offer-choice="${choice}" type="button" aria-label="Recruit ${slot.label} card" ${canChoose ? '' : 'disabled'}>
      ${cardMarkup(slot.card, { hidden })}
      <span class="offer-label">${slot.label}${chosen ? ' · chosen' : ''}</span>
    </button>`;
  }).join('');
}

function renderTableau(playerIndex, elementId, countId) {
  const player = game.players[playerIndex];
  $(countId).textContent = `${totalAgents(player)} agent${totalAgents(player) === 1 ? '' : 's'}`;
  $(elementId).innerHTML = player.tableau.length ? player.tableau.map(card => cardMarkup(card, { mini: true })).join('') : '<div class="tableau-empty"><span>◈</span><small>No agents yet</small></div>';
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
  $('#legal-hint').textContent = game.discarding ? 'Tap one to replace it.' : selectedUp && !game.playFaceDown ? (hasDifferent ? 'Choose a different name to hide.' : 'A matching pair is allowed.') : canPlay ? 'Show one. Hide one.' : 'Waiting for the table.';
  $('#discard-button').hidden = !(game.phase === 'play' && game.turn === 0 && !game.playFaceUp);
  $('#discard-button').disabled = Boolean(!canPlay || game.discardsUsed >= 4 || !game.deck.length);
  $('#discard-button').classList.toggle('active', game.discarding);
  $('#discard-uses').textContent = Math.max(0, 4 - game.discardsUsed);
  $('#reset-selection').hidden = !(game.phase === 'play' && game.playFaceUp && !game.playFaceDown);
}

function render() {
  if (!game) return;
  $('#turn-label').textContent = turnLabel();
  $('#deck-count').textContent = game.deck.length;
  renderBoard();
  renderOffer();
  renderTableau(0, '#you-tableau', '#you-count');
  renderTableau(1, '#bot-tableau', '#bot-count');
  renderHand();
}

function resetToSetup() {
  if (game && !game.over && !confirm('Start a new game? Current progress will be lost.')) return;
  if ($('#game-over-dialog').open) $('#game-over-dialog').close();
  document.body.classList.remove('game-active');
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
