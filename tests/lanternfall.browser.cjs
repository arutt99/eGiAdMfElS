// Browser checks for Lanternfall: HUD hit-testing, graphics context loss, resuming a battle, and the art style switch.
// cd games/lanternfall && npm run build && npm run serve   (then, from the repo root)
// node tests/lanternfall.browser.cjs
const { chromium, devices } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.LANTERNFALL_URL || 'http://localhost:4173/?demo';

/** Starts a battle with Oakheart and everything unlocked, and waits for the HUD. */
async function startBattle(page) {
  await page.goto(base);
  await page.waitForFunction(() => window.__lanternfall && document.querySelector('.title-screen'), null, { timeout: 60000 });
  await page.evaluate(() => {
    const a = window.__lanternfall;
    a.save.clearBattle?.();
    a.save.data.hero = 'oakheart';
    a.startGame(a.currentMap, 'normal', false);
  });
  await page.waitForFunction(() => window.__lanternfall.game && document.querySelector('#h-towers .tower-card'));
  await page.waitForTimeout(400);
}

/** Every HUD control must be the thing a tap at its center lands on. */
async function blockedControls(page) {
  return page.evaluate(() => {
    const bad = [];
    for (const el of document.querySelectorAll('#hud button')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height || getComputedStyle(el).visibility === 'hidden') continue;
      const bar = el.closest('.tower-bar');
      if (bar) {
        // A card scrolled out of a scrolling bar, even partly, is reached by scrolling, not hidden.
        const b = bar.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        if (cx <= b.left || cx >= b.right) continue;
      }
      const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
      const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
      const hit = document.elementFromPoint(x, y);
      if (!hit || !el.contains(hit)) bad.push(`${el.getAttribute('aria-label') || el.id || el.className} is covered by ${hit?.closest('button')?.getAttribute('aria-label') || hit?.className || hit?.tagName}`);
    }
    return bad;
  });
}

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
  const errors = [];
  const watch = (page) => page.on('pageerror', (e) => errors.push(e.message));

  // 1. No HUD control sits under another, on tablets, laptops, desktops and phones.
  const sizes = [
    { name: 'iPad upright', ...devices['iPad Mini'] },
    { name: 'iPad sideways', ...devices['iPad Mini landscape'] },
    { name: 'iPad Air upright', viewport: { width: 820, height: 1180 }, hasTouch: true, isMobile: true },
    { name: 'laptop', viewport: { width: 1280, height: 800 } },
    { name: 'small laptop', viewport: { width: 1024, height: 700 } },
    { name: 'desktop', viewport: { width: 1920, height: 1080 } },
    { name: 'phone sideways', ...devices['iPhone 13 landscape'] },
  ];
  for (const { name, ...opts } of sizes) {
    const context = await browser.newContext(opts);
    const page = await context.newPage();
    watch(page);
    await startBattle(page);
    const bad = await blockedControls(page);
    assert.deepEqual(bad, [], `${name}: ${bad.join('; ')}`);
    const fit = await page.locator('#h-towers').getAttribute('data-fit');
    console.log(`ok - HUD controls clear at ${name} (tower bar: ${fit ?? 'centered'})`);
    await context.close();
  }

  // 2. On short screens no HUD panel overlaps another, with every power unlocked and a five-digit gold count.
  {
    const context = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    watch(page);
    await startBattle(page);
    await page.evaluate(() => window.__lanternfall.game.setGold(99999));
    for (const [w, h] of [[568, 320], [667, 375], [844, 390], [932, 430], [1180, 540]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(400);
      const overlaps = await page.evaluate(() => {
        const sel = { gold: '.top-left', wave: '.wave-box', speed: '.top-right', hero: '.bottom-left', towers: '#h-towers', spells: '#h-spells' };
        const rects = Object.entries(sel).map(([k, s]) => [k, document.querySelector(s).getBoundingClientRect()]);
        const out = [];
        for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
          const [ka, a] = rects[i], [kb, b] = rects[j];
          if (Math.min(a.right, b.right) - Math.max(a.left, b.left) > 0.5 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 0.5) out.push(`${ka}/${kb}`);
        }
        return out;
      });
      assert.deepEqual(overlaps, [], `${w}x${h}: ${overlaps.join(', ')}`);
      assert.deepEqual(await blockedControls(page), [], `${w}x${h}`);
    }
    console.log('ok - compact HUD panels never overlap');

    // 3. Picking a chapter half past the rail's edge brings it fully into view.
    await page.setViewportSize({ width: 844, height: 390 });
    await page.evaluate(() => window.__lanternfall.quitToMenu());
    await page.waitForSelector('.map-rail');
    await page.waitForTimeout(600);
    for (const i of [5, 0, 4]) {
      const shown = await page.evaluate(async (i) => {
        const r = document.querySelector('.map-rail');
        const c = r.children[i];
        r.scrollLeft = c.offsetLeft - r.clientWidth + c.offsetWidth / 2;
        c.click();
        await new Promise((res) => setTimeout(res, 300));
        const rr = r.getBoundingClientRect(), cr = r.querySelector('.map-card.on').getBoundingClientRect();
        return cr.left >= rr.left - 1 && cr.right <= rr.right + 1;
      }, i);
      assert.ok(shown, `chapter ${i + 1} stayed partly hidden after picking it`);
    }
    console.log('ok - a picked chapter is shown whole in the map rail');
    await context.close();
  }

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  watch(page);
  await startBattle(page);

  // 4. Losing the graphics stops the battle and explains what happened; getting them back opens the pause menu.
  await page.evaluate(() => window.__lanternfall.game.callNextWave());
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.__lose = window.__lanternfall.engine.renderer.getContext().getExtension('WEBGL_lose_context');
    window.__lose.loseContext();
  });
  await page.waitForSelector('#gfx-lost');
  const lostAt = await page.evaluate(() => window.__lanternfall.game.time);
  await page.waitForTimeout(1000);
  assert.equal(await page.evaluate(() => window.__lanternfall.game.time), lostAt, 'the battle kept running with no graphics');
  await page.evaluate(() => window.__lose.restoreContext());
  await page.waitForFunction(() => !document.querySelector('#gfx-lost'));
  assert.ok(await page.evaluate(() => window.__lanternfall.paused), 'the battle should wait in the pause menu');
  assert.ok(await page.isVisible('#modal:not(.hidden)'));
  await page.evaluate(() => window.__lanternfall.resume());
  await page.waitForTimeout(500);
  assert.ok(await page.evaluate(() => window.__lanternfall.game.time) > lostAt, 'the battle should run again after resuming');
  console.log('ok - graphics loss pauses the battle and recovers');

  // 5. A battle survives a reload, from the start of the wave in progress.
  await startBattle(page);
  const built = await page.evaluate(() => {
    const g = window.__lanternfall.game;
    const w = g.world;
    for (let x = -w.halfW; x <= w.halfW; x++) for (let z = -w.halfH; z <= w.halfH; z++) {
      if (!g.canBuild('roost', x, z)) { g.upgrade(g.build('roost', x, z)); return { gold: g.gold }; }
    }
  });
  await page.evaluate(() => window.__lanternfall.game.callNextWave());
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForSelector('[data-a="resume"]', { timeout: 60000 });
  await page.click('[data-a="resume"]');
  await page.waitForFunction(() => window.__lanternfall.game && window.__lanternfall.paused);
  const resumed = await page.evaluate(() => {
    const g = window.__lanternfall.game;
    return { towers: g.towers.map((t) => `${t.type}:${t.level}`), wave: g.wave, gold: g.gold, views: window.__lanternfall.view.towerViews.size };
  });
  assert.deepEqual(resumed, { towers: ['roost:1'], wave: 0, gold: built.gold, views: 1 });
  console.log('ok - a reloaded battle resumes from the start of its wave');

  // 6. Changing the art style mid-battle waits until the battle is left.
  await page.evaluate(() => { window.__marker = 1; window.__lanternfall.ui.showSettings(); });
  await page.click('[data-art]');
  await page.waitForTimeout(500);
  assert.equal(await page.evaluate(() => window.__marker), 1, 'the page reloaded during the battle');
  assert.match(await page.textContent('#art-note'), /return to the map/);
  await Promise.all([page.waitForEvent('load'), page.evaluate(() => window.__lanternfall.quitToMenu())]);
  await page.waitForSelector('.title-screen', { timeout: 60000 });
  assert.equal(await page.evaluate(() => localStorage.getItem('lanternfall.artStyle')), 'classic');
  assert.equal(await page.locator('[data-a="resume"]').count(), 0, 'a battle that was left should not be offered again');
  console.log('ok - the art style switches after leaving the battle');

  assert.deepEqual(errors, []);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
