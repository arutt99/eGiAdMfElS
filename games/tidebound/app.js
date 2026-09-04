const SUITS = [
  { id: 'orange', name: 'Doldrums', start: 0, end: 10, color: '#db8a32', dark: '#8f491e' },
  { id: 'red', name: 'Reef', start: 11, end: 20, color: '#c95048', dark: '#7f2825' },
  { id: 'gray', name: 'Fog', start: 21, end: 29, color: '#75828a', dark: '#3f4b52' },
  { id: 'blue', name: 'Iceberg', start: 31, end: 38, color: '#3997c6', dark: '#17628a' },
  { id: 'green', name: 'Rocks', start: 41, end: 47, color: '#4d9b67', dark: '#23643b' },
  { id: 'purple', name: 'Storm', start: 51, end: 56, color: '#8260a5', dark: '#442d62' },
  { id: 'teal', name: 'Whirlpool', start: 61, end: 65, color: '#239590', dark: '#0c5958' },
  { id: 'kraken', name: 'Kraken', start: 71, end: 74, color: '#942f3a', dark: '#55141d' },
];
const BOT_NAMES = ['Mara', 'Finn', 'Nell', 'Orson', 'Vela'];
let game;
const $ = (s) => document.querySelector(s);
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function makeDeck(total) {
  return SUITS.filter(s => total !== 3 || !['orange', 'kraken'].includes(s.id)).flatMap(s =>
    Array.from({ length: s.end - s.start + 1 }, (_, i) => ({ suit: s.id, value: s.start + i, rank: i + 1, top: s.start + i === s.end }))
  );
}
function shuffle(cards) { for (let i = cards.length - 1; i; i--) { const j = Math.floor(Math.random() * (i + 1)); [cards[i], cards[j]] = [cards[j], cards[i]]; } return cards; }
function suit(card) { return SUITS.find(s => s.id === card.suit); }
function cardHTML(card, extra = '') { const s = suit(card); return `<div class="card ${card.top ? 'top-card' : ''} ${extra}" style="--suit:${s.color};--dark:${s.dark}" title="${card.value} - ${s.name}"><span class="rank">${card.value}</span><span class="suit">${s.name}</span><span class="flag">${card.top ? '★ ' : ''}${card.rank}</span></div>`; }
function currentPlayer() { return game.players[game.turn]; }
function setMessage(message) { $('#message').textContent = message; }
function logEvent(message) {
  game.log.unshift(message);
  $('#game-log').innerHTML = game.log.map(entry => `<li>${entry}</li>`).join('');
}

function startGame() {
  const bots = Number($('#bot-count').value);
  const players = [{ name: 'You', human: true, total: 0, round: 0, tricks: 0, hand: [] }];
  for (let i = 0; i < bots; i++) players.push({ name: BOT_NAMES[i], human: false, total: 0, round: 0, tricks: 0, hand: [] });
  game = { players, total: bots + 1, roundNumber: 0, trick: [], leader: 0, turn: 0, locked: false, over: false, log: [] };
  $('#setup').hidden = true; $('#game').hidden = false;
  newRound();
}
function newRound() {
  game.roundNumber++; game.trick = []; game.locked = false;
  game.players.forEach(p => { p.hand = []; p.round = 0; p.tricks = 0; });
  const deck = shuffle(makeDeck(game.total));
  deck.forEach((card, i) => game.players[i % game.total].hand.push(card));
  game.players.forEach(p => p.hand.sort((a,b) => a.value - b.value));
  const opening = game.total === 3 ? 11 : 0;
  game.leader = game.players.findIndex(p => p.hand.some(c => c.value === opening));
  game.turn = game.leader;
  setMessage(`${game.players[game.leader].name} opens with the ${opening}.`);
  logEvent(`Round ${game.roundNumber} dealt: ${game.total} players, ${game.players[0].hand.length} cards each. ${game.players[game.leader].name} must open with ${opening}.`);
  render();
  setTimeout(() => forceOpening(opening), 450);
}
function forceOpening(value) {
  const player = currentPlayer(); if (!player || !player.hand.length) return;
  playCard(player.hand.find(c => c.value === value), game.turn, true);
}
function legalCards(player) {
  if (!game.trick.length) return player.hand;
  const present = new Set(game.trick.map(x => x.card.suit));
  const matching = player.hand.filter(c => present.has(c.suit));
  return matching.length ? matching : player.hand;
}
function trickWinner() {
  const counts = {};
  game.trick.forEach(({card}) => { counts[card.suit] = (counts[card.suit] || 0) + 1; });
  const highCount = Math.max(...Object.values(counts));
  const contenders = game.trick.filter(x => counts[x.card.suit] === highCount);
  return contenders.reduce((best, x) => x.card.value > best.card.value ? x : best);
}
function botChoice(player) {
  const legal = legalCards(player);
  if (!game.trick.length) return legal[Math.floor(Math.random() * Math.min(legal.length, 4))];
  const ranked = legal.map(card => {
    const projected = [...game.trick, { card, player: game.turn }];
    const counts = {}; projected.forEach(x => counts[x.card.suit] = (counts[x.card.suit] || 0) + 1);
    const max = Math.max(...Object.values(counts));
    const winner = projected.filter(x => counts[x.card.suit] === max).reduce((a,b) => a.card.value > b.card.value ? a : b);
    let danger = winner.player === game.turn ? 120 : 0;
    danger += card.rank * 2 + (card.top ? 20 : 0) + Math.random() * 12;
    return { card, danger };
  });
  ranked.sort((a,b) => a.danger - b.danger);
  return ranked[0].card;
}
function playCard(card, index, forced = false) {
  if (game.locked || index !== game.turn || !card) return;
  const player = game.players[index];
  if (!forced && player.human && !legalCards(player).includes(card)) return;
  player.hand.splice(player.hand.indexOf(card), 1);
  game.trick.push({ card, player: index });
  logEvent(`Trick ${currentTrickNumber()}: ${player.name} played ${card.value} ${suit(card).name}${forced ? ' (required opener)' : ''}.`);
  game.turn = (game.turn + 1) % game.total;
  render();
  if (game.trick.length === game.total) { game.locked = true; setTimeout(finishTrick, 700); }
  else if (!currentPlayer().human) { game.locked = true; setTimeout(() => { game.locked = false; playCard(botChoice(currentPlayer()), game.turn); }, 600); }
  else setMessage('Your turn - choose a legal card.');
}
function currentTrickNumber() { return game.players.reduce((total, player) => total + player.tricks, 0) + 1; }
function finishTrick() {
  const winner = trickWinner(); const player = game.players[winner.player];
  player.round++; player.tricks++;
  const containsTop = game.trick.some(x => x.card.top);
  setMessage(`${player.name} takes the trick (${suit(winner.card).name} ${winner.card.value}).`);
  logEvent(`Trick ${currentTrickNumber() - 1}: ${player.name} takes the trick with ${winner.card.value} ${suit(winner.card).name}.${containsTop ? ' A highest suit card was present: the winner chooses the next leader.' : ''}`);
  render();
  setTimeout(() => {
    game.trick = []; game.locked = false;
    if (!game.players[0].hand.length) return endRound();
    if (containsTop) chooseLeader(winner.player); else { game.leader = winner.player; game.turn = winner.player; continuePlay(); }
  }, 1150);
}
function chooseLeader(winner) {
  if (game.players[winner].human) {
    const options = $('#lead-options'); options.innerHTML = '';
    game.players.forEach((player, index) => { const b = document.createElement('button'); b.className = 'button'; b.textContent = player.name; b.onclick = () => { $('#lead-dialog').close(); game.leader = index; game.turn = index; logEvent(`You choose ${player.name} to lead the next trick.`); continuePlay(); }; options.append(b); });
    $('#lead-dialog').showModal(); setMessage('You may choose the next leader.');
  } else {
    const target = Math.random() < .7 ? winner : Math.floor(Math.random() * game.total);
    game.leader = target; game.turn = target; setMessage(`${game.players[winner].name} chooses ${game.players[target].name} to lead.`); render(); setTimeout(continuePlay, 650);
    logEvent(`${game.players[winner].name} chooses ${game.players[target].name} to lead the next trick.`);
  }
}
function continuePlay() { render(); if (currentPlayer().human) setMessage('Your turn - lead any card.'); else { game.locked = true; setTimeout(() => { game.locked = false; playCard(botChoice(currentPlayer()), game.turn); }, 550); } }
function endRound() {
  game.players.forEach(p => p.total += p.round);
  const threshold = game.total <= 4 ? 15 : game.total === 5 ? 12 : 10;
  const done = game.players.some(p => p.total >= threshold);
  render();
  const scoreSummary = game.players.map(p => `${p.name}: +${p.round} (${p.total} total)`).join(', ');
  logEvent(`Round ${game.roundNumber} complete. ${scoreSummary}.`);
  if (done) { const low = Math.min(...game.players.map(p => p.total)); const winners = game.players.filter(p => p.total === low).map(p => p.name).join(' & '); game.over = true; setMessage(`Game complete - ${winners} ${winners.includes('&') ? 'win' : 'wins'} with ${low} penalty points!`); logEvent(`Game complete: ${winners} ${winners.includes('&') ? 'win' : 'wins'} with ${low} penalty points.`); }
  else { setMessage('Round complete. Preparing the next deal…'); setTimeout(newRound, 1600); }
}
function render() {
  if (!game) return;
  const threshold = game.total <= 4 ? 15 : game.total === 5 ? 12 : 10;
  $('#round-info').textContent = `ROUND ${game.roundNumber} · FIRST TO ${threshold} ENDS THE GAME`;
  $('#scoreboard').innerHTML = game.players.map((p,i) => `<div class="score ${i === game.turn && !game.locked ? 'active' : ''}"><span class="score-name">${p.name}</span><strong class="score-total">${p.total}</strong><span class="score-detail">this round: ${p.round} · tricks: ${p.tricks}</span></div>`).join('');
  $('#opponents').innerHTML = game.players.filter(p => !p.human).map(p => `<div class="opponent ${game.players.indexOf(p) === game.turn && !game.locked ? 'turn':''}"><div class="avatar">${p.name[0]}</div><div class="opponent-name">${p.name}</div><div class="cards-left">${p.hand.length} cards</div><div class="taken">${'⚓'.repeat(p.tricks)}</div></div>`).join('');
  $('#trick').innerHTML = game.trick.map(({card,player}) => `<div class="played-wrap">${cardHTML(card)}<div>${game.players[player].name}</div></div>`).join('');
  const human = game.players[0]; const legal = !game.locked && game.turn === 0 ? legalCards(human) : [];
  $('#legal-hint').textContent = legal.length ? (game.trick.length ? 'MATCH A SUIT IN THE TRICK IF YOU CAN' : 'YOU LEAD - ANY CARD') : '';
  $('#hand').innerHTML = human.hand.map((card, index) => `<div data-card-index="${index}">${cardHTML(card, legal.includes(card) ? 'playable' : 'not-playable')}</div>`).join('');
  document.querySelectorAll('#hand [data-card-index] .playable').forEach(el => { const card = human.hand[Number(el.parentElement.dataset.cardIndex)]; el.onclick = () => playCard(card, 0); });
}

$('#start-game').onclick = startGame;
$('#new-game').onclick = () => { if (game && !confirm('Start a new game? Current scores will be lost.')) return; $('#game').hidden = true; $('#setup').hidden = false; game = null; };
$('#rules-button').onclick = () => $('#rules-dialog').showModal();
$('#clear-log').onclick = () => { if (!game) return; game.log = []; $('#game-log').innerHTML = ''; };
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => document.getElementById(b.dataset.close).close());
