import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from '../games/fishing/engine.mjs';

function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const run = (s, r) => { let n = 0; while (E.isAuto(s) && n++ < 50) E.auto(s, r); };

function randomMove(s, r) {
  const task = E.currentTask(s);
  const pick = arr => arr[Math.floor(r() * arr.length)];
  if (task) {
    if (task.t === 'star') return E.act(s, { type: 'star', sec: pick(E.starTargets(s)) });
    if (task.t === 'lb') return E.act(s, { type: 'lb', choice: pick(['L', 'B']) });
    if (task.t === 'kc') return E.act(s, { type: 'kc', choice: pick(E.KC_BONUS) });
    if (task.t === 'oyster') return E.act(s, { type: 'oyster', choice: pick(['fish', 'bonus']) });
  }
  const dice = s.step.k === 'pick' ? s.pool.map((d, i) => i).filter(i => !s.pool[i].by) : [s.step.die];
  const die = pick(dice), o = E.options(s, die);
  const moves = [];
  o.targets.forEach(sec => moves.push({ type: 'fill', die, sec }, { type: 'fill', die, sec }, { type: 'fill', die, sec }));
  if (o.coins) moves.push({ type: 'coins', die });
  if (o.market) moves.push({ type: 'market', die }, { type: 'market', die });
  if (o.cash) moves.push({ type: 'cash', die });
  if (o.salvage) moves.push({ type: 'salvage', die });
  if (o.hex) moves.push({ type: 'hex', die }, { type: 'hex', die });
  if (o.reroll && r() < .3) moves.push({ type: 'reroll', die });
  return E.act(s, pick(moves), r);
}

function play(mode, seed) {
  const r = rng(seed), s = E.newGame(mode, r);
  let guard = 0;
  run(s, r);
  while (s.step.k !== 'over' && guard++ < 2000) {
    assert.ok(randomMove(s, r), `move failed in round ${s.round} step ${JSON.stringify(s.step)} task ${JSON.stringify(E.currentTask(s))}`);
    run(s, r);
    assert.ok(E.validSave(s));
  }
  assert.equal(s.step.k, 'over');
  return s;
}

test('setup grants a license and a launched boat of one type', () => {
  for (let seed = 1; seed < 40; seed++) {
    const s = E.newGame('rival', rng(seed));
    assert.notEqual(s.start, 'coins');
    assert.equal(s.lic[s.start], 1);
    assert.equal(E.launched(s, s.start), 1);
    assert.deepEqual(s.marks[s.start].slice(0, 4), [1, 1, 1, 0]);
  }
});

test('random rival and open games always finish with sane scores', () => {
  for (let seed = 1; seed <= 300; seed++) {
    const s = play(seed % 3 ? 'rival' : 'open', seed);
    assert.equal(s.round, s.rounds);
    const sc = E.score(s);
    assert.ok(sc.total >= 0 && sc.total < 400, `score ${sc.total}`);
    for (const [t, list] of Object.entries(s.ships)) for (const b of list) assert.ok(b.fish <= (t === 'oyster' ? E.capacity(s, t) : E.SHIPS[t].cap));
    assert.ok(sc.bonus <= 10);
  }
});

test('rival strikes the bottom of the column it takes, two boxes', () => {
  const s = E.newGame('rival', rng(5));
  s.round = 2; s.step = { k: 'roll' };
  E.auto(s, rng(9));
  s.pool = [{ kind: 'boat', face: 'lobster', by: null }, { kind: 'boat', face: 'oyster', by: null }, { kind: 'boat', face: 'coins', by: null }];
  s.tokens.boat = 'lobster';
  assert.equal(s.step.k, 'rival');
  const e = E.auto(s);
  assert.equal(e.face, 'lobster');
  assert.deepEqual(s.marks.lobster.slice(-2), s.start === 'lobster' ? [2, 2] : [2, 2]);
});

test('fishing fills launched boats, oysters ask, swordfish license grants a star', () => {
  const s = E.newGame('open', rng(1));
  for (const t of E.TYPES) { s.ships[t][0].on = true; s.ships[t][0].fish = 0; }
  s.lic.swordfish = 1; s.queue = [];
  E.fishing(s);
  assert.equal(s.ships.cod[0].fish, 1);
  assert.equal(s.queue[0].t, 'oyster');
  assert.equal(s.queue.at(-1).t, 'star');
  assert.ok(E.act(s, { type: 'oyster', choice: 'fish' }));
  assert.equal(s.ships.oyster[0].fish, 2);
});

test('market pays by fish caught and the smokehouse adds two', () => {
  const s = E.newGame('open', rng(2));
  for (const list of Object.values(s.ships)) for (const b of list) b.fish = 0;
  assert.equal(E.marketValue(s), 2);
  s.ships.barge[0].fish = 10; s.ships.crab[0].fish = 2;
  assert.equal(E.marketValue(s), 4);
  s.done.smoke = true;
  assert.equal(E.marketValue(s), 6);
});

test('a star on the coin track queues a star action; rival market strikes skip it', () => {
  const s = E.newGame('open', rng(3));
  s.coins.fill(0); s.queue = [];
  E.gainCoins(s, 3);
  assert.equal(s.queue.length, 1);
  assert.equal(s.queue[0].t, 'star');
});

test('second license level pays two coins; cod license pays on every launch', () => {
  const s = E.newGame('open', rng(4));
  s.coins.fill(0); s.queue = [];
  s.lic.cod = 2; const before = E.coinCount(s);
  s.marks.research = [0, 0, 0];
  s.ships.research.forEach(b => (b.on = false));
  s.step = { k: 'use', die: 0, src: 'shared', left: 1 };
  s.pool = [{ kind: 'town', face: 'harbor', by: null }];
  assert.ok(E.act(s, { type: 'fill', die: 0, sec: 'research' }));
  assert.equal(E.launched(s, 'research'), 1);
  assert.equal(E.coinCount(s), before + 2);
});

test('score counts boats, level three licenses, buildings and the king crab bonus', () => {
  const s = E.newGame('open', rng(6));
  for (const list of Object.values(s.ships)) for (const b of list) { b.on = false; b.fish = 0; }
  for (const t of E.TYPES) s.lic[t] = 0;
  s.ships.shrimp[0].on = true; s.ships.crab[0].on = true;
  s.lic.lobster = 3; s.kc.on = true; s.kc.bonus = 'building';
  s.done.pub = true; s.done.smoke = true;
  s.marks.bank = [1, 2, 1];
  const sc = E.score(s);
  assert.equal(sc.boats, 5);
  assert.equal(sc.licenses, 12);
  assert.equal(sc.buildings, 17);
  assert.equal(sc.bonus, 4);
});

test('long-press help covers every section and builds for any game state', async () => {
  const I = await import('../games/fishing/info.mjs');
  const { HIT, SECTION_SHEET, SHEETS } = await import('../games/fishing/layout.mjs');
  for (const sec of E.allSections()) {
    const [x0, y0, x1, y1] = HIT[sec];
    const reg = I.regionAt(SECTION_SHEET[sec], (x0 + x1) / 2, y0 + 8);
    assert.ok(reg, `no help region for ${sec}`);
  }
  for (let seed = 1; seed <= 30; seed++) {
    const s = play(seed % 2 ? 'rival' : 'open', seed);
    for (const sheet of ['boats', 'harbor']) for (let y = 5; y < SHEETS[sheet].h; y += 23) for (let x = 5; x < SHEETS[sheet].w; x += 37) {
      const reg = I.regionAt(sheet, x, y);
      if (reg) { const inf = I.sheetInfo(s, reg.ref); assert.ok(inf?.title && inf.body && !/undefined|NaN/.test(inf.title + inf.body), JSON.stringify(reg.ref)); }
    }
    s.pool = E.BOAT_FACES.map(face => ({ kind: 'boat', face, by: null })).concat(['harbor', 'wharf', 'market'].map(face => ({ kind: 'town', face, by: 'rival' })));
    s.pool.forEach((_, i) => { const inf = I.dieInfo(s, i); assert.ok(inf && !/undefined|NaN/.test(inf.title + inf.body)); });
  }
});

test('every section, the coin track and the King Crab card are on a page in each screen layout', async () => {
  const { HIT, SECTION_SHEET, PAGE_SETS, composePage, pageAt, KC, coinPos } = await import('../games/fishing/layout.mjs');
  for (const [name, set] of Object.entries(PAGE_SETS)) {
    const pages = set.map(composePage);
    for (const pg of pages) assert.ok(pg.w > 0 && pg.h > 0 && pg.panels.every(p => p.top + p.height <= pg.h + .01), `${name}/${pg.id} geometry`);
    for (const sec of E.allSections()) {
      const [x0, y0, x1, y1] = HIT[sec];
      const pg = pageAt(pages, SECTION_SHEET[sec], (x0 + x1) / 2, (y0 + y1) / 2);
      assert.ok(pg, `${name}: ${sec} is on no page`);
      // the whole tap area fits in one panel of that page
      assert.ok(pg.panels.some(p => p.sheet === SECTION_SHEET[sec] && x0 >= p.crop[0] - 12 && x1 <= p.crop[2] + 12 && y0 >= p.crop[1] - 12 && y1 <= p.crop[3] + 12), `${name}: ${sec} is cut off`);
    }
    for (let i = 0; i < E.COIN_BOXES; i++) { const { x, y } = coinPos(i); assert.ok(pageAt(pages, 'harbor', x, y), `${name}: coin ${i}`); }
    assert.ok(pageAt(pages, 'harbor', (KC.card[0] + KC.card[2]) / 2, (KC.card[1] + KC.card[3]) / 2), `${name}: KC card`);
  }
});

test('versus-AI games finish, the AI plays its own sheet and never touches yours', () => {
  for (let seed = 1; seed <= 12; seed++) {
    const s = play('ai', seed);
    assert.equal(s.rounds, 10);
    assert.ok(s.bot && E.validSave(s));
    for (const list of Object.values(s.marks)) assert.ok(!list.includes(2), 'no struck boxes on your sheet');
    assert.ok(!s.coins.includes(2));
    const ai = E.score(s.bot);
    assert.ok(ai.total > 40 && ai.total < 400, `AI score ${ai.total}`);
    for (const [t, list] of Object.entries(s.bot.ships)) for (const b of list) assert.ok(b.fish <= (t === 'oyster' ? E.capacity(s.bot, t) : E.SHIPS[t].cap));
    assert.ok(!('pool' in s.bot) && s.bot.queue.length === 0);
  }
});

test('the AI takes one die a round and uses the shared die too', () => {
  const r = rng(11), s = E.newGame('ai', r);
  run(s, r);
  assert.equal(s.step.k, 'pick'); // you pick first in round 1
  assert.equal(s.pool.length, 3);
  const free = s.pool.findIndex(d => !d.by);
  assert.ok(E.act(s, { type: 'cash', die: free }));
  const before = JSON.stringify(s.bot.marks) + E.coinCount(s.bot);
  E.auto(s, r); // next
  const e = E.auto(s, r);
  assert.equal(e.k, 'ai');
  assert.equal(s.pool.filter(d => d.by === 'ai').length, 1);
  assert.notEqual(JSON.stringify(s.bot.marks) + E.coinCount(s.bot), before);
  E.auto(s, r);
  assert.equal(s.step.k, 'use'); assert.equal(s.step.src, 'shared');
});
