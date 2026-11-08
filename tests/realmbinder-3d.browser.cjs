const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const base=process.env.REALMBINDER_URL || 'http://127.0.0.1:4173/games/realmbinder/';
async function fallbackCheck(browser) {
  const context=await browser.newContext({reducedMotion:'no-preference'}), page=await context.newPage(), errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args);};
    localStorage.setItem('realmbinder.prefs',JSON.stringify({sound:false,opener3d:true}));
  });
  await page.goto(base);await page.locator('[data-act="open"]').click();
  await page.waitForFunction(()=>document.querySelector('.opener-mode').hidden && !document.querySelector('.opener-advance').disabled);
  assert.equal(await page.locator('#opener canvas').count(),0);
  await page.locator('[data-op="advance"]').click();await page.waitForSelector('#flip');
  await page.locator('[data-op="skip"]').click();assert.equal(await page.locator('.summary .cell').count(),10);
  assert.deepEqual(errors,[]);await context.close();
}
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
  if(process.argv.includes('--fallback-only')) { await fallbackCheck(browser); await browser.close(); console.log('Unavailable WebGL falls back and opens a pack successfully.'); return; }
  fs.mkdirSync('tmp/realmbinder-qa',{recursive:true});
  const context=await browser.newContext({viewport:{width:1100,height:900},reducedMotion:'no-preference',recordVideo:{dir:'tmp/realmbinder-qa/video',size:{width:1100,height:900}}});
  await context.addInitScript(()=>{
    window.cardAudio={buffers:0,oscillators:0};
    for(const [method,key] of [['createBufferSource','buffers'],['createOscillator','oscillators']]) {
      const original=AudioContext.prototype[method];
      AudioContext.prototype[method]=function(...args){window.cardAudio[key]++;return original.apply(this,args);};
    }
  });
  const page=await context.newPage(), errors=[], requests=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('request',r=>requests.push(r.url()));
  const shot=n=>page.screenshot({path:`tmp/realmbinder-qa/3d-${n}.png`});
  const save=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('realmbinder.save.v1')));
  const ready=()=>page.waitForFunction(()=>document.querySelector('#opener.has-3d canvas') && !document.querySelector('.opener-advance').disabled,{},{timeout:45000});
  const advance=()=>page.locator('[data-op="advance"]').click();
  await page.goto(base);
  await page.evaluate(()=>localStorage.setItem('realmbinder.prefs',JSON.stringify({sound:false,opener3d:true})));
  await page.reload();assert.ok(!requests.some(u=>u.includes('/opener-3d.mjs')),'Three.js is lazy-loaded');
  await page.locator('[data-act="open"]').click();await ready();await shot('sealed');
  assert.equal(await page.locator('#opener').getAttribute('data-renderer'),'three');
  const before=await save();await advance();assert.equal((await save()).packs,before.packs-1);
  await page.waitForTimeout(600);await shot('tearing');
  await page.waitForSelector('#flip',{state:'attached'});await ready();await shot('card-back');
  await advance();await page.waitForTimeout(450);await shot('mid-flip');
  await ready();await shot('card-front');
  await advance();await ready();assert.ok((await page.locator('.counter').textContent()).startsWith('2 /'));
  assert.equal(await page.locator('.opener-advance').textContent(),'Next card →');
  assert.equal(await page.locator('#flip.up').count(),1,'the second card is already face-up');
  await shot('second-card-face-up');
  // Skipping during a GPU-driven card slide must cancel its continuation.
  await advance();await page.locator('[data-op="skip"]').click();
  await page.waitForTimeout(1100);assert.equal(await page.locator('.summary .cell').count(),10);assert.equal(await page.locator('#opener canvas').count(),0);
  await page.locator('[data-op="close"]').click();
  // Dragging the sealed top commits exactly one pack.
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-act="open"]').click();await ready();await shot('phone-sealed');
  const r=await page.locator('#stage').boundingBox();const b=await save();
  await page.mouse.move(r.x+20,r.y+r.height*.16);await page.mouse.down();await page.mouse.move(r.x+r.width-15,r.y+r.height*.16,{steps:12});await page.mouse.up();
  await page.waitForSelector('#flip',{state:'attached'});await ready();assert.equal((await save()).packs,b.packs-1);await advance();await ready();await shot('phone-front');
  // A lost graphics context falls back to the pulls, preserving the committed pack.
  const saved=await save();await page.locator('#opener canvas').evaluate(c=>c.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
  await page.waitForSelector('.summary');assert.deepEqual(await save(),saved);assert.equal(await page.locator('#opener canvas').count(),0);
  await page.locator('[data-op="close"]').click();
  // User-controlled simple mode works and persists without taking a pack.
  await page.locator('[data-act="open"]').click();await ready();
  await page.locator('[data-op="mode"]').click();assert.equal(await page.locator('#opener canvas').count(),0);assert.equal(await page.locator('#opener').getAttribute('data-renderer'),'simple');
  await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('realmbinder.prefs')).opener3d),false);
  // One whole-deck flip followed by one deck click per face-up card.
  await page.locator('#sound').click();
  await page.locator('[data-act="open"]').click();
  await page.locator('[data-op="mode"]').click();await ready();await advance();
  await page.waitForSelector('#flip',{state:'attached'});await ready();
  const audioBefore=await page.evaluate(()=>({...window.cardAudio}));
  assert.equal(await page.locator('.opener-advance').textContent(),'Flip the deck');
  await page.locator('#stage').click();await ready();
  for(let i=0;i<10;i++) {
    assert.equal(await page.locator('.counter').textContent(),`${i+1} / 10`);
    assert.equal(await page.locator('#flip.up').count(),1);
    assert.equal(await page.locator('.opener-advance').textContent(),i<9?'Next card →':'See your pulls');
    if(i===0) {
      const box=await page.locator('#stage').boundingBox();
      await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();
      await page.mouse.move(box.x+box.width/2+45,box.y+box.height/2-20,{steps:8});await page.mouse.up();
      await page.waitForTimeout(150);
      assert.ok((await page.locator('.counter').textContent()).startsWith('1 /'),'inspecting a card never advances it');
    }
    if(i<9){await page.locator('#stage').click();await ready();}
    else {await advance();await page.waitForSelector('.summary');}
  }
  assert.equal(await page.locator('.summary .cell').count(),10);
  assert.equal(await page.locator('#opener canvas').count(),0);
  const audioAfter=await page.evaluate(()=>window.cardAudio);
  assert.equal(audioAfter.buffers-audioBefore.buffers,20,'one quiet two-layer paper sound per reveal');
  assert.equal(audioAfter.oscillators,audioBefore.oscillators,'no musical rarity chimes during reveals');
  assert.deepEqual(errors,[]);
  const video=page.video();await context.close();await video.saveAs('tmp/realmbinder-qa/pack-opening-3d.webm');await fallbackCheck(browser);await browser.close();
  console.log('Three.js checks passed: lazy loading, tear, flip, next, phone drag, skip cancellation, context-loss recovery, disposal and persisted simple mode.');
})().catch(e=>{console.error(e);process.exit(1)});
