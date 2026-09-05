// Run with Playwright installed, or set PLAYWRIGHT_MODULE to its package directory.
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const base = process.env.PIRATES_URL || 'http://127.0.0.1:4173/games/pirates/';

(async () => {
  const engine = await import('../games/pirates/engine.mjs');
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  fs.mkdirSync(path.join('tmp', 'pirates-qa'), { recursive: true });
  const shot = name => page.screenshot({ path: path.join('tmp', 'pirates-qa', `${name}.png`), fullPage: true });
  async function read() { return page.evaluate(() => JSON.parse(localStorage.getItem('pirates.v1'))); }
  async function load(s) {
    await page.evaluate(s => { localStorage.setItem('pirates.v1', JSON.stringify(s)); localStorage.setItem('pirates.fast', 'true'); }, s);
    await page.reload(); await page.locator('[data-action="resume"]').click();
  }
  async function noOverflow() { assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow'); }
  function fixture({ draw = ['mermaid-8'], play = [], banks = [[], []] } = {}) {
    const s = engine.newGame(); const all = engine.allCards(); const get = id => all.find(c => c.id === id);
    s.active = 0; s.deck = draw.map(get).reverse(); s.play = play.map(get); s.banks = banks.map(b => b.map(get));
    const used = [...draw, ...play, ...banks.flat()]; s.discard = all.filter(c => !used.includes(c.id));
    s.seenDraw = all.filter(c => c.value > (c.suit === 'mermaid' ? 4 : 2) && !draw.includes(c.id)).map(c => c.id);
    assert.ok(engine.validSave(s)); return s;
  }
  await page.goto(base); await page.locator('.start-button').waitFor(); await noOverflow(); await shot('01-title-390');
  await page.locator('[data-action="help"]').last().click(); await page.locator('#sheet[open]').waitFor();
  assert.equal(await page.locator('.suit-guide article').count(), 10); await shot('02-guide');
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#sheet[open]').count(), 0);
  for (const width of [320, 375, 430, 768, 1280]) { await page.setViewportSize({ width, height: 844 }); await noOverflow(); }
  await page.setViewportSize({ width: 390, height: 844 });
  const s = fixture({ draw: ['map-6', 'mermaid-8', 'hook-5', 'sword-3'], play: ['key-7', 'anchor-6', 'chest-5'], banks: [['mermaid-9', 'mermaid-5', 'oracle-4', 'cannon-5'], ['sword-7', 'map-7', 'key-6', 'kraken-4']] });
  await load(s); await shot('03-table-390');
  // Landscape uses the whole table, including on a short phone screen.
  for (const [width, height] of [[844, 390], [932, 430], [1280, 800]]) {
    await page.setViewportSize({ width, height }); await noOverflow();
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight), 'landscape table fits vertically');
    for (const action of ['draw', 'collect']) {
      assert.ok(await page.locator(`[data-action="${action}"]`).evaluate(el => {
        const r = el.getBoundingClientRect();
        return r.bottom <= innerHeight && el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
      }), `${action} stays visible and unobscured`);
    }
    await shot(`03-landscape-${width}`);
  }
  const fullHaul = fixture({ draw: ['mermaid-9'], play: engine.SUITS.map(suit => `${suit.id}-${suit.id === 'mermaid' ? 8 : 6}`) });
  await load(fullHaul); await page.setViewportSize({ width: 844, height: 390 });
  assert.equal(await page.locator('.play-grid .loot-card').count(), 10);
  assert.ok(await page.locator('.play-grid').evaluate(el => el.scrollWidth <= el.clientWidth), 'all ten suits fit the landscape play row');
  await shot('03-landscape-ten-suits');
  await page.setViewportSize({ width: 390, height: 844 }); await load(s);
  assert.equal(await page.locator('.draw-button').count(), 0, 'bottom draw button removed');
  assert.equal(await page.locator('.draw-pile[data-action="draw"]').count(), 1, 'deck is the draw control');
  await page.locator('[data-action="draw"]').click(); await page.locator('.choice-grid').waitFor(); await noOverflow(); await shot('04-map-choice');
  const choiceState = await read();
  assert.equal(choiceState.choice.type, 'map');
  await page.reload(); await page.locator('[data-action="resume"]').click();
  assert.deepEqual(await read(), choiceState, 'pending Map choice survives reload');
  await page.locator('.choice-grid [data-action="choose"]').first().click();
  await page.locator('[data-action="menu"]').click(); await page.locator('[data-action="log"]').click(); assert.ok(await page.locator('.voyage-log article').count() > 0);
  await page.keyboard.press('Escape');
  await page.locator('[data-action="bank"][data-player="0"]').click(); assert.equal(await page.locator('.bank-list>div').count(), 10); await page.keyboard.press('Escape');
  const hook = fixture({ draw: ['hook-5'], banks: [['key-7'], []] }); await load(hook);
  await page.locator('.draw-pile').click();
  assert.equal(await page.locator('.choice-panel').count(), 0, 'bank abilities do not open a choice panel');
  await page.locator('.bank-slot[data-drag-card="true"][data-id="key-7"]').dragTo(page.locator('.play-grid[data-drop-target="play"]'));
  assert.equal((await read()).choice, null, 'Hook resolves by dragging into the play line');
  const cannon = fixture({ draw: ['cannon-4'], banks: [[], ['key-7']] }); await load(cannon);
  await page.locator('.draw-pile').click();
  assert.equal(await page.locator('.cannon-drop').count(), 1, 'Cannon renders a discard drop zone');
  await page.locator('.bank-slot[data-drag-card="true"][data-id="key-7"]').dragTo(page.locator('.cannon-drop'));
  assert.equal((await read()).choice, null, 'Cannon resolves by dragging into the discard zone');
  for (const width of [320, 375, 430]) { await page.setViewportSize({ width, height: 740 }); await noOverflow(); await shot(`05-table-${width}`); }
  await page.setViewportSize({ width: 390, height: 844 });
  // Follow the real buttons for an entire match. The app runs Rook on its normal timer.
  const match = engine.newGame(); match.active = 0; await load(match);
  let steps = 0;
  while (++steps < 400) {
    const state = await read();
    if (state.phase === 'over') break;
    if (state.phase === 'turnEnd') await page.locator('[data-action="next"]').click();
    else if (state.active === 1) await page.waitForTimeout(360);
    else {
      const action = engine.botAction(state);
      if (action.type === 'choose') {
        const source = page.locator(`.bank-slot[data-drag-card="true"][data-id="${action.id}"]`);
        if (await source.count()) {
          const target = state.choice.type === 'cannon' ? page.locator('.cannon-drop') : page.locator('.play-grid[data-drop-target="play"]');
          await source.dragTo(target);
        } else await page.locator(`.choice-grid [data-id="${action.id}"]`).click();
      }
      else await page.locator(`[data-action="${action.type}"]`).click();
    }
    await noOverflow();
  }
  const final = await read(); assert.equal(final.phase, 'over'); assert.ok(engine.validSave(final));
  await page.locator('.results-sheet[open]').waitFor(); await shot('06-results');
  assert.equal(await page.locator('.score-breakdown>div').count(), 11);
  await page.locator('[data-action="start"]').click(); assert.equal((await read()).phase, 'play');
  await page.locator('[data-action="menu"]').click(); await page.locator('[data-action="restart"]').click();
  const before = await read(); await page.locator('#sheet [data-action="close"]').last().click(); assert.deepEqual(await read(), before);
  await page.locator('[data-action="menu"]').click(); await page.locator('[data-action="home"]').click();
  await page.locator('[data-action="resume"]').waitFor();
  // Storage-denied browsers can still start and play.
  const blocked = await context.newPage(); await blocked.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('disabled'); }; });
  await blocked.goto(base); await blocked.locator('[data-action="resume"], [data-action="start"]').first().click();
  await blocked.locator('[data-action="menu"]').click(); await blocked.locator('[data-action="restart"]').click(); await blocked.locator('#sheet [data-action="start"]').click();
  assert.equal(await blocked.locator('.storage-warning').count(), 1);
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ result: 'PASS', matchSteps: steps, finalScores: final.banks.map(engine.score), widths: [320, 375, 390, 430, 768, 1280], consoleErrors: errors.length, checks: ['full match via UI', 'all ten rules', 'Map save/resume', 'bank inspection', 'voyage log', 'restart', 'restart cancellation', 'storage denied', 'no overflow'] }));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
