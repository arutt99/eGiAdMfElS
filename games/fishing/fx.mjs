// Game feel: synthesized sound effects, haptics, banners, score floaters, confetti and count-ups.
// Everything here is decoration; the game plays the same with all of it switched off.

const PREFS = 'fishing.prefs';
export const prefs = (() => {
  const d = { sound: true, haptics: true };
  try { return { ...d, ...JSON.parse(localStorage.getItem(PREFS)) }; } catch { return d; }
})();
export function setPref(k, v) { prefs[k] = v; try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch { } }
export const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- haptics ----------
// iOS Safari has no Vibration API. Since iOS 18, toggling a switch-style checkbox through its label
// gives a system haptic tick, which only works inside a user gesture. Android uses navigator.vibrate.
let hLabel = null;
function hapticEl() {
  if (hLabel) return hLabel;
  hLabel = document.createElement('label');
  hLabel.setAttribute('aria-hidden', 'true');
  hLabel.style.cssText = 'position:fixed;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;left:-9px;top:-9px';
  const input = document.createElement('input');
  input.type = 'checkbox'; input.setAttribute('switch', ''); input.tabIndex = -1;
  hLabel.append(input); document.body.append(hLabel);
  return hLabel;
}
export function haptic(kind = 'light') {
  if (!prefs.haptics) return;
  if (navigator.vibrate) { navigator.vibrate({ light: 8, medium: 16, heavy: [18, 50, 22], error: [10, 40, 10, 40, 10] }[kind] || 8); return; }
  const el = hapticEl();
  el.click();
  if (kind === 'heavy' || kind === 'error') setTimeout(() => el.click(), 70);
  if (kind === 'error') setTimeout(() => el.click(), 140);
}

// ---------- sound ----------
let ac = null, out = null, noiseBuf = null;
function audio() {
  if (!prefs.sound) return null;
  if (!ac) {
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    ac = new C();
    out = ac.createGain(); out.gain.value = .55;
    const comp = ac.createDynamicsCompressor(); out.connect(comp); comp.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  if (ac.state === 'suspended') ac.resume();
  return ac;
}
// iOS only lets audio start inside a gesture: wake the context on the first touch.
addEventListener('pointerdown', () => { if (prefs.sound) audio(); }, { capture: true, passive: true });

function env(g, t, a, d, peak) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}
function tone(f, at, dur, { type = 'sine', gain = .2, to = null, attack = .005, lp = null } = {}) {
  const c = audio(); if (!c) return;
  const t = c.currentTime + at, o = c.createOscillator(), g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  let node = o;
  if (lp) { const fl = c.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = lp; o.connect(fl); node = fl; }
  node.connect(g); g.connect(out); env(g, t, attack, dur, gain);
  o.start(t); o.stop(t + attack + dur + .05);
}
function noise(at, dur, { gain = .2, type = 'bandpass', f = 2000, to = null, q = 1, attack = .004 } = {}) {
  const c = audio(); if (!c) return;
  const t = c.currentTime + at, src = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain();
  src.buffer = noiseBuf; src.loop = true;
  fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
  if (to) fl.frequency.exponentialRampToValueAtTime(to, t + dur);
  src.connect(fl); fl.connect(g); g.connect(out); env(g, t, attack, dur, gain);
  src.start(t, Math.random() * .5); src.stop(t + attack + dur + .05);
}

export const sfx = {
  tap() { tone(820, 0, .045, { type: 'triangle', gain: .09, to: 600 }); },
  pick() { tone(440, 0, .07, { type: 'triangle', gain: .14, to: 620 }); noise(0, .03, { gain: .08, f: 3500 }); },
  put() { tone(600, 0, .07, { type: 'triangle', gain: .1, to: 420 }); },
  rattle(n = 3) {
    for (let i = 0; i < 6 + n * 2; i++) {
      const at = i * .045 + Math.random() * .03;
      noise(at, .025, { gain: .22, f: 2200 + Math.random() * 2200, q: 3 });
      tone(260 + Math.random() * 240, at, .03, { type: 'triangle', gain: .07 });
    }
  },
  pencil(at = 0) {
    noise(at, .07, { gain: .2, f: 3200, to: 2400, q: 1.4 });
    noise(at + .09, .07, { gain: .18, f: 2800, to: 3600, q: 1.4 });
  },
  coin(i = 0, at = 0) {
    const f = 1650 * Math.pow(1.03, Math.min(i, 12));
    tone(f, at, .16, { gain: .08 }); tone(f * 1.5, at + .01, .12, { gain: .05 });
  },
  horn(at = 0) {
    tone(110, at, .55, { type: 'sawtooth', gain: .1, attack: .06, lp: 650 });
    tone(165, at, .55, { type: 'sawtooth', gain: .07, attack: .06, lp: 650 });
  },
  // a fish landing in the hold: a soft rising water 'bloop', stepping up a pentatonic scale fish by fish
  plop(i = 0, at = 0) {
    const f = [392, 440, 523, 587, 659, 784, 880][i % 7];
    tone(f * .6, at, .16, { gain: .1, to: f, attack: .015 });
    tone(f / 2, at + .01, .18, { type: 'triangle', gain: .025, lp: 900, attack: .02 });
    noise(at, .1, { gain: .02, type: 'lowpass', f: 700, q: .5, attack: .02 });
  },
  strike(at = 0) {
    tone(170, at, .2, { type: 'square', gain: .08, to: 55, lp: 900 });
    noise(at, .12, { gain: .2, f: 1800, to: 900, q: 2 });
  },
  star(at = 0) { [880, 1175, 1568, 2093].forEach((f, i) => tone(f, at + i * .07, .28, { type: 'triangle', gain: .07 })); },
  stamp(at = 0) { noise(at, .1, { gain: .35, type: 'lowpass', f: 600, q: .8 }); tone(95, at, .16, { gain: .25, to: 50 }); },
  tick(i = 0) { tone(1100 + i * 40, 0, .03, { type: 'square', gain: .025, lp: 3000 }); },
  win() {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .12, .3, { type: 'triangle', gain: .12 }));
    [523, 659, 784, 1047].forEach(f => tone(f, .52, .9, { type: 'triangle', gain: .07, attack: .02 }));
  },
  lose() { [392, 349, 311, 262].forEach((f, i) => tone(f, i * .2, .32, { type: 'triangle', gain: .1 })); },
  error() { tone(210, 0, .09, { type: 'triangle', gain: .12, to: 150 }); tone(160, .1, .1, { type: 'triangle', gain: .1, to: 120 }); },
  sheet() { noise(0, .16, { gain: .05, f: 500, to: 1400, q: .8, attack: .03 }); },
};
export function play(name, ...args) { try { sfx[name]?.(...args); } catch { /* audio unavailable */ } }

// ---------- banners ----------
// Big centred titles for the moments that matter. They queue, never block input, and report how long
// they still need so automatic steps can wait for them.
const layer = () => document.getElementById('fx');
let bannerQ = [], bannerBusyUntil = 0, bannerRunning = false;
export function banner({ title, sub = '', kind = '', icon = '', sound = null, ms = 1250 }) {
  bannerQ.push({ title, sub, kind, icon, sound, ms: reduced() ? Math.min(ms, 900) : ms });
  bannerBusyUntil = Math.max(bannerBusyUntil, performance.now()) + bannerQ.at(-1).ms;
  if (!bannerRunning) nextBanner();
}
function nextBanner() {
  const b = bannerQ.shift();
  if (!b) { bannerRunning = false; return; }
  bannerRunning = true;
  const el = document.createElement('div');
  el.className = `banner ${b.kind}`;
  el.setAttribute('role', 'status');
  el.innerHTML = `${b.icon ? `<span class="b-icon">${b.icon}</span>` : ''}<b>${b.title}</b>${b.sub ? `<small>${b.sub}</small>` : ''}`;
  el.style.setProperty('--ms', `${b.ms}ms`);
  layer().append(el);
  if (b.sound) play(...[].concat(b.sound));
  setTimeout(() => { el.remove(); nextBanner(); }, b.ms);
}
export const busyFor = () => Math.max(0, bannerBusyUntil - performance.now());
export function clearBanners() { bannerQ = []; bannerBusyUntil = 0; }

// ---------- floaters ----------
// "+2 VP" rising from where it happened and flying into a HUD chip.
export function floater(text, from, toEl, { kind = '', delay = 0 } = {}) {
  const el = document.createElement('div');
  el.className = `floater ${kind}`; el.textContent = text;
  const to = toEl?.getBoundingClientRect();
  const start = from || (to ? { x: to.left + to.width / 2, y: to.bottom + 18 } : { x: innerWidth / 2, y: innerHeight / 2 });
  el.style.left = `${start.x}px`; el.style.top = `${start.y}px`;
  if (to) { el.style.setProperty('--dx', `${to.left + to.width / 2 - start.x}px`); el.style.setProperty('--dy', `${to.top + to.height / 2 - start.y}px`); }
  el.style.animationDelay = `${delay}ms`;
  layer().append(el);
  el.addEventListener('animationend', () => {
    el.remove();
    if (toEl) { toEl.classList.remove('bump'); void toEl.offsetWidth; toEl.classList.add('bump'); }
  }, { once: true });
}

// ---------- count-up ----------
export function countUp(el, to, { from = +el.textContent || 0, ms = 450, tick = false } = {}) {
  if (from === to) { el.textContent = to; return Promise.resolve(); }
  return new Promise(res => {
    const t0 = performance.now(); let last = from;
    const step = now => {
      const k = Math.min(1, (now - t0) / ms), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (v !== last) { el.textContent = v; if (tick) play('tick', v % 8); last = v; }
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

// ---------- confetti ----------
export function confetti(host = document.body) {
  if (reduced()) return;
  const cv = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
  cv.className = 'confetti'; host.append(cv);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, g = cv.getContext('2d');
  const colors = ['#ffd23f', '#f0b92a', '#e04a3a', '#2f8fd8', '#f7efdc', '#3fae7a'];
  const bits = Array.from({ length: 140 }, () => ({
    x: W / 2 + (Math.random() - .5) * W * .3, y: H * .35, vx: (Math.random() - .5) * 16 * dpr, vy: (-Math.random() * 15 - 6) * dpr,
    r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, w: (5 + Math.random() * 5) * dpr, h: (8 + Math.random() * 8) * dpr, c: colors[Math.random() * colors.length | 0],
  }));
  const t0 = performance.now();
  const frame = now => {
    const t = now - t0; g.clearRect(0, 0, W, H);
    for (const b of bits) {
      b.vy += .45 * dpr; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      g.save(); g.translate(b.x, b.y); g.rotate(b.r); g.globalAlpha = Math.max(0, 1 - t / 2800);
      g.fillStyle = b.c; g.fillRect(-b.w / 2, -b.h / 2 * Math.abs(Math.cos(b.r * 2)), b.w, b.h * Math.abs(Math.cos(b.r * 2)) + 1); g.restore();
    }
    if (t < 2800) requestAnimationFrame(frame); else cv.remove();
  };
  requestAnimationFrame(frame);
}
