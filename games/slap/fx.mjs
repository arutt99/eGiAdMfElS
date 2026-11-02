// Game feel: synthesized sound, haptics, banners, floaters, count-ups and confetti.
// Adapted from games/fishing/fx.mjs. Everything here is decoration: the game plays the same with
// all of it switched off.

const PREFS = 'slap.prefs';
const DEFAULTS = { sound: true, haptics: true, odds: true, speed: 'normal', difficulty: 'normal' };
export const prefs = (() => {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(PREFS)) }; } catch { return { ...DEFAULTS }; }
})();
export function setPref(k, v) { prefs[k] = v; try { localStorage.setItem(PREFS, JSON.stringify(prefs)); } catch { /* storage unavailable */ } }
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
  if (navigator.vibrate) { navigator.vibrate({ light: 8, medium: 16, heavy: [18, 50, 22], success: [10, 60, 14], error: [10, 40, 10, 40, 10] }[kind] || 8); return; }
  const el = hapticEl();
  el.click();
  if (kind === 'heavy' || kind === 'error' || kind === 'success') setTimeout(() => el.click(), 70);
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
  // a card snapped off the deck and flipped onto the felt
  flick(at = 0) { noise(at, .05, { gain: .22, f: 4200, to: 2400, q: 1.2 }); noise(at + .07, .06, { gain: .14, type: 'lowpass', f: 900, q: .7 }); },
  // a poker chip set down; rises with i so a run of chips climbs
  clink(i = 0, at = 0) {
    const f = 2300 * Math.pow(1.04, Math.min(i, 10));
    tone(f, at, .09, { type: 'triangle', gain: .06 }); tone(f * 1.48, at + .005, .07, { gain: .04 }); noise(at, .02, { gain: .08, f: 6000, q: 2 });
  },
  // the steal: a hand slapping the table
  slap(at = 0) { noise(at, .09, { gain: .55, f: 1400, to: 500, q: .7, attack: .002 }); tone(140, at, .14, { gain: .22, to: 70 }); },
  // a bust: a low thud and a falling wobble
  thud(at = 0) {
    noise(at, .18, { gain: .35, type: 'lowpass', f: 380, q: .6 }); tone(110, at, .3, { gain: .28, to: 45 });
    tone(330, at + .12, .32, { type: 'triangle', gain: .07, to: 196 });
  },
  bank(n = 4) { for (let i = 0; i < Math.min(8, n); i++) sfx.clink(i, i * .06); },
  turn() { tone(660, 0, .08, { type: 'triangle', gain: .07 }); tone(990, .07, .1, { type: 'triangle', gain: .06 }); },
  tick(i = 0) { tone(1100 + i * 40, 0, .03, { type: 'square', gain: .02, lp: 3000 }); },
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
const layer = () => document.getElementById('fx');
export function banner({ title, sub = '', kind = '', ms = 1100 }) {
  const el = document.createElement('div');
  el.className = `banner ${kind}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<b>${title}</b>${sub ? `<small>${sub}</small>` : ''}`;
  el.style.setProperty('--ms', `${reduced() ? Math.min(ms, 900) : ms}ms`);
  layer().querySelectorAll('.banner').forEach(b => b.remove());
  layer().append(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// ---------- floaters ----------
// "+18" rising from where it happened and flying into a score pill.
export function floater(text, from, toEl, { kind = '', delay = 0 } = {}) {
  const el = document.createElement('div');
  el.className = `floater ${kind}`; el.textContent = text;
  const to = toEl?.getBoundingClientRect();
  const start = from || (to ? { x: to.left + to.width / 2, y: to.bottom + 18 } : { x: innerWidth / 2, y: innerHeight / 2 });
  el.style.left = `${start.x}px`; el.style.top = `${start.y}px`;
  if (to) { el.style.setProperty('--dx', `${to.left + to.width / 2 - start.x}px`); el.style.setProperty('--dy', `${to.top + to.height / 2 - start.y}px`); }
  el.style.animationDelay = `${delay}ms`;
  layer().append(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

// ---------- count-up ----------
export function countUp(el, to, { from = +el.textContent || 0, ms = 500 } = {}) {
  if (!el) return Promise.resolve();
  if (from === to || reduced()) { el.textContent = to; return Promise.resolve(); }
  return new Promise(res => {
    const t0 = performance.now(); let last = from;
    const step = now => {
      const k = Math.min(1, (now - t0) / ms), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (v !== last) { el.textContent = v; last = v; }
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}
export function bump(el) { if (!el) return; el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }

// ---------- confetti ----------
export function confetti(host = document.body) {
  if (reduced()) return;
  const cv = document.createElement('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
  cv.className = 'confetti'; host.append(cv);
  const W = cv.width = innerWidth * dpr, H = cv.height = innerHeight * dpr, g = cv.getContext('2d');
  const colors = ['#f5c451', '#e85c4a', '#2877b8', '#fff7df', '#24985c', '#7c3fb2'];
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
