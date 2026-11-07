// PLAYWRIGHT_MODULE=/path/to/playwright CHROMIUM_PATH=/usr/bin/chromium node tests/realmbinder.browser.cjs
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base = process.env.REALMBINDER_URL || 'http://127.0.0.1:4173/games/realmbinder/';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH || undefined, args:['--no-sandbox']});
  const errors = [];
  const context = await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page = await context.newPage();
  page.on('pageerror', e => errors.push(e.message));
  fs.mkdirSync('tmp/realmbinder-qa',{recursive:true});
  const shot = name => page.screenshot({path:`tmp/realmbinder-qa/${name}.png`,fullPage: !/reveal|detail|summary|sealed/.test(name)});
  const save = () => page.evaluate(() => JSON.parse(localStorage.getItem('realmbinder.save.v1')));
  const tab = async name => {await page.locator(`.tabs [data-tab="${name}"]`).click();};
  const noOverflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontal overflow');
  const closed = () => page.locator('#sheet').evaluate(el=>el.hidden);
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('realmbinder.prefs',JSON.stringify({sound:false,opener3d:false})));
  await page.reload();
  assert.equal((await save()).packs,3);
  await shot('desktop-packs'); await noOverflow();
  await page.locator('[data-act="open"]').click();
  // Sealed pack is stationary, and closing before a tear costs nothing.
  const a = await page.locator('#stage .pack').boundingBox();
  await page.waitForTimeout(200);
  assert.deepEqual(await page.locator('#stage .pack').boundingBox(),a);
  await page.keyboard.press('Escape'); assert.equal((await save()).packs,3);
  await page.locator('[data-act="open"]').click();
  await page.locator('[data-op="advance"]').click();
  await page.waitForSelector('#flip');
  assert.equal((await save()).copies.length,10);
  await page.locator('[data-op="advance"]').click();
  await page.waitForSelector('#flip.up');
  await shot('desktop-reveal');
  // Reveal-all during a pending transition must not resurrect the previous card.
  await page.locator('[data-op="skip"]').click();
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.summary .cell').count(),10);
  await page.locator('.summary .cell').first().click();
  await page.locator('.sheet-panel [data-act="shelve"]').first().click();
  assert.equal((await save()).shelf.filter(x=>x!==null).length,1);
  assert.ok(await page.locator('.tag.shelf').isVisible());
  await page.locator('.sheet-close').click(); assert.ok(await closed());
  assert.equal(await page.locator('#opener').evaluate(el=>el.inert),false);
  await shot('desktop-summary');
  await page.locator('[data-op="close"]').click();
  // Cancel while tearing, then leave enough time for old animation callbacks.
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('[data-act="open"]').click();
  await page.locator('[data-op="advance"]').click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  assert.equal(await page.locator('#opener').evaluate(el=>el.hidden),true);
  assert.equal(await page.locator('#flip').count(),0);
  assert.equal((await save()).copies.length,20);
  await tab('shop'); await noOverflow(); await shot('desktop-shop');
  const before = await save();
  await page.locator('[data-act="buy1"]').click();
  assert.equal((await save()).packs,before.packs+1);
  assert.ok((await save()).gold < before.gold);
  await page.locator('[data-glass]').first().click();
  assert.equal(await page.locator('.detail-card .card').count(),1);
  // Full art remains 4:3, independent of parent width or frame padding.
  const art = await page.locator('.detail-card .c-art').boundingBox();
  assert.ok(Math.abs(art.width/art.height - 4/3)<.03);
  await shot('desktop-detail');
  await page.keyboard.press('Escape');
  await tab('binder');
  await page.locator('#card-search').fill('crown');
  assert.ok((await page.locator('.pocket').count())>0);
  await page.locator('#rarity-filter').selectOption('M');
  await shot('desktop-binder-filtered');
  await page.locator('#card-search').fill('zzzz-no-card');
  assert.equal(await page.locator('.pocket').count(),0);
  await page.locator('#card-search').fill('');
  await page.locator('#rarity-filter').selectOption('all');
  await page.locator('[data-show="owned"]').click();
  await shot('desktop-binder');
  const preserved=await save(); await page.reload();
  assert.deepEqual(await save(),preserved);
  await tab('shelf'); await shot('desktop-shelf');
  await page.locator('.slot:not(.empty-slot)').first().click();
  await page.locator('[data-act="unshelve"]').click();
  assert.equal((await save()).shelf.filter(x=>x!==null).length,0);
  await page.keyboard.press('Escape');
  await page.locator('.empty-slot').first().click();
  await page.locator('[data-pick]').first().click();
  assert.equal((await save()).shelf.filter(x=>x!==null).length,1);
  // Phone and small-phone layouts across all four screens.
  for (const width of [390,320]) {
    await page.setViewportSize({width,height:844});
    for(const name of ['packs','shop','binder','shelf']) {
      await tab(name); await noOverflow();
      if (name === 'packs') {
        const display = await page.locator('.pack-display').boundingBox();
        const pack = await page.locator('.pack-layer').last().boundingBox();
        assert.ok(pack.y >= display.y && pack.y + pack.height <= display.y + display.height, 'pack stays inside display');
      }
      await shot(`mobile-${width}-${name}`);
    }
  }
  await page.setViewportSize({width:390,height:844});
  await tab('packs'); await page.locator('[data-act="open"]').click();
  await shot('mobile-sealed');
  await page.locator('[data-op="advance"]').click();
  await page.waitForSelector('#flip');
  await page.locator('[data-op="advance"]').click();
  await shot('mobile-reveal');
  await page.waitForTimeout(650);
  await page.locator('[data-op="skip"]').click();
  await shot('mobile-summary');
  await page.locator('.summary .cell').first().click();
  await shot('mobile-detail');
  await page.keyboard.press('Escape'); await page.locator('[data-op="close"]').click();
  // Landscape opener must fit without cropping card or action.
  await page.setViewportSize({width:844,height:390});
  await page.locator('[data-act="open"]').click();
  await noOverflow(); await shot('landscape-sealed');
  const stage=await page.locator('#stage').boundingBox();
  assert.ok(stage.y>=0 && stage.y+stage.height<=390);
  // Finish an entire pack through keyboard controls, not just Reveal all.
  await page.keyboard.press('Escape');
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.locator('[data-act="open"]').click();
  await page.locator('[data-op="advance"]').press('Enter');
  await page.waitForSelector('#flip');
  assert.equal(await page.locator('.opener-advance').textContent(),'Flip the deck');
  await page.locator('[data-op="advance"]').press('Enter');
  for(let i=0;i<10;i++) {
    await page.waitForFunction(() => !document.querySelector('.opener-advance').disabled);
    assert.equal(await page.locator('.counter').textContent(),`${i+1} / 10`);
    assert.ok(await page.locator('#flip.up').isVisible(),'each card is already face-up');
    assert.equal(await page.locator('#opener').getAttribute('data-turned'),'true');
    assert.equal(await page.locator('.opener-advance').textContent(),i<9?'Next card →':'See your pulls');
    await page.locator('[data-op="advance"]').press('Enter');
    if(i<9)await page.waitForFunction(n=>document.querySelector('.counter').textContent===`${n} / 10`,i+2);
  }
  await page.waitForSelector('.summary');
  assert.equal(await page.locator('.summary .cell').count(),10);
  await page.locator('[data-op="close"]').click();
  assert.equal(await page.locator('[data-act="open"]').count(),0);
  assert.ok(await page.locator('.pack-actions [data-go="shop"]').isVisible());
  // Exercise every card's actual frame, including the longest names and flavor.
  const engine = await import('../games/realmbinder/engine.mjs');
  const fixture = engine.newSave(Date.now(),72);
  fixture.copies = engine.CARDS.map((c,i)=>({card:c.id,uid:i+1,cond:'NM',print:1,foil:false,gilded:false,got:Date.now(),how:'pack'}));
  fixture.nextUid=131;
  await page.evaluate(s=>localStorage.setItem('realmbinder.save.v1',JSON.stringify(s)),fixture);
  await page.reload(); await tab('binder');
  await page.locator('[data-show="owned"]').click();
  const clipped=[];
  do {
    clipped.push(...await page.locator('.card').evaluateAll(cards=>cards.flatMap(card=>{
      const name=card.querySelector('.c-name'), art=card.querySelector('.c-art'), text=card.querySelector('.c-text');
      const rect=art.getBoundingClientRect();
      return name.scrollHeight>name.clientHeight+1 || text.scrollHeight>text.clientHeight+1 || Math.abs(rect.width/rect.height-4/3)>.03 ? [card.dataset.card] : [];
    })));
    if(await page.locator('[data-page="1"]').isDisabled()) break;
    await page.locator('[data-page="1"]').click();
  } while(true);
  assert.deepEqual(clipped,[], 'all 130 cards fit their frames');
  assert.deepEqual(errors,[]);
  console.log('Realm Binder browser checks passed: opening, cancellation, summary detail, shop, binder, shelf, save reload, 320/390px and landscape.');
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
