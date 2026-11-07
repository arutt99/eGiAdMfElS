// A development page for hearing and measuring every sound. It builds to SoundTest.html.
import { audio, type SfxName } from './audio';
import { SFX, type SfxDef } from './sfx-recipes';

const DEFS = SFX as Record<SfxName, SfxDef>;
const NAMES = Object.keys(DEFS) as SfxName[];

const css = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin: 0; padding: 20px 24px 60px; background: #17151c; color: #e8e2d4; font: 15px/1.4 system-ui, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 24px 0 8px; color: #d9b873; }
  p { margin: 0 0 12px; color: #a8a196; }
  .bar { position: sticky; top: 0; z-index: 1; display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 10px 0; background: #17151c; border-bottom: 1px solid #332e3a; }
  .bar label { display: flex; gap: 6px; align-items: center; color: #a8a196; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 6px; }
  button { font: inherit; color: inherit; background: #26222e; border: 1px solid #3d3747; border-radius: 6px; padding: 6px 8px; cursor: pointer; text-align: left; }
  button:hover { background: #322c3c; }
  button.on { background: #5a4520; border-color: #d9b873; }
  .sound b { display: block; font-weight: 600; }
  .sound small { color: #958e84; font-variant-numeric: tabular-nums; }
  canvas { display: block; width: 100%; height: 26px; margin-top: 4px; }
  #status { font-variant-numeric: tabular-nums; color: #a8a196; }
`;

document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
document.body.innerHTML = `
  <h1>Lanternfall sound test</h1>
  <p>Click any sound to hear it. Each click plays the next take, so you can hear the variation.</p>
  <div class="bar">
    <button id="battle">Battle stress test</button>
    <button id="beam">Sunforge beam</button>
    <button id="music">Music</button>
    <label>Position <input id="pan" type="range" min="-1" max="1" step="0.1" value="0"></label>
    <label>Music <input id="vm" type="range" min="0" max="1" step="0.01" value="0.55"></label>
    <label>Effects <input id="vs" type="range" min="0" max="1" step="0.01" value="0.75"></label>
    <span id="status">Rendering sounds...</span>
  </div>
  <div id="groups"></div>
`;

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

function measure(name: SfxName) {
  const takes = audio.takesOf(name);
  let peak = 0, sum = 0, n = 0, bad = 0, seconds = 0;
  for (const b of takes) {
    seconds = Math.max(seconds, b.duration);
    for (let c = 0; c < b.numberOfChannels; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < d.length; i++) {
        const v = d[i];
        if (!Number.isFinite(v)) bad++;
        if (c === 0) {
          const a = Math.abs(v);
          if (a > peak) peak = a;
          sum += v * v;
          n++;
        }
      }
    }
  }
  return { name, takes: takes.length, seconds, peak, rms: Math.sqrt(sum / Math.max(1, n)), bad, wet: takes.some((b) => b.numberOfChannels > 1), silent: peak < 1e-4 };
}

function drawWave(canvas: HTMLCanvasElement, name: SfxName) {
  const buffer = audio.takesOf(name)[0];
  if (!buffer) return;
  const g = canvas.getContext('2d')!;
  const w = (canvas.width = 180), h = (canvas.height = 26);
  const d = buffer.getChannelData(0);
  let top = 0;
  for (let i = 0; i < d.length; i++) top = Math.max(top, Math.abs(d[i]));
  g.fillStyle = '#d9b873';
  const step = d.length / w;
  for (let x = 0; x < w; x++) {
    let p = 0;
    const end = Math.min(d.length, Math.floor((x + 1) * step));
    for (let i = Math.floor(x * step); i < end; i++) p = Math.max(p, Math.abs(d[i]));
    const bar = Math.max(0.5, (p / Math.max(top, 1e-4)) * h);
    g.fillRect(x, (h - bar) / 2, 1, bar);
  }
}

function buildGrid() {
  const groups = new Map<string, SfxName[]>();
  for (const name of NAMES) {
    const list = groups.get(DEFS[name].group) ?? [];
    list.push(name);
    groups.set(DEFS[name].group, list);
  }
  const host = $('groups');
  for (const [group, names] of groups) {
    host.insertAdjacentHTML('beforeend', `<h2>${group}</h2>`);
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (const name of names) {
      const m = measure(name);
      const btn = document.createElement('button');
      btn.className = 'sound';
      btn.innerHTML = `<b>${name}</b><small>${m.seconds.toFixed(2)}s, ${m.takes} take${m.takes > 1 ? 's' : ''}</small><canvas></canvas>`;
      btn.addEventListener('click', () => {
        audio.unlock();
        audio.play(name, 1, { pan: +$<HTMLInputElement>('pan').value, gain: 1 });
      });
      grid.append(btn);
      drawWave(btn.querySelector('canvas')!, name);
    }
    host.append(grid);
  }
}

// A rough battle: the same sounds at a busy rate, spread across the stereo field.
const BATTLE: [SfxName, number][] = [
  ['arrow', 9], ['arrowHit', 8], ['arcane', 4], ['orbHit', 4], ['frost', 2], ['shardHit', 2], ['mortar', 1.5], ['explosion', 1.5],
  ['ballista', 1], ['boltHit', 1], ['blight', 1], ['globHit', 1], ['lightning', 1], ['bell', 0.5], ['deathCritter', 5], ['deathBeast', 1],
  ['deathMetal', 0.8], ['deathGhost', 0.5], ['coin', 6], ['crit', 1], ['heroHit', 2], ['guardHit', 3], ['enemyHit', 2],
];
let battleTimer = 0, peakVoices = 0;
function toggleBattle() {
  audio.unlock();
  if (battleTimer) {
    clearInterval(battleTimer);
    battleTimer = 0;
  } else {
    battleTimer = window.setInterval(() => {
      for (const [name, perSecond] of BATTLE) {
        if (Math.random() < perSecond * 0.05) audio.play(name, 1, { pan: Math.random() * 1.4 - 0.7, gain: 1 });
      }
    }, 50);
  }
  $('battle').classList.toggle('on', !!battleTimer);
}

let beamOn = false, beamTimer = 0, beamHeat = 0;
function toggleBeam() {
  audio.unlock();
  beamOn = !beamOn;
  beamHeat = 0;
  clearInterval(beamTimer);
  // Stops calling on purpose when switched off, the same way a paused game does.
  if (beamOn) {
    beamTimer = window.setInterval(() => {
      beamHeat = Math.min(1, beamHeat + 0.01);
      audio.setBeam(1, +$<HTMLInputElement>('pan').value, beamHeat);
    }, 50);
  }
  $('beam').classList.toggle('on', beamOn);
}

let musicOn = false;
function toggleMusic() {
  audio.unlock();
  musicOn = !musicOn;
  if (musicOn) {
    audio.setTheme({ root: 62, scale: 'lydian', bpm: 84 });
    audio.setIntensity(1);
  } else audio.stopMusic();
  $('music').classList.toggle('on', musicOn);
}

$('battle').addEventListener('click', toggleBattle);
$('beam').addEventListener('click', toggleBeam);
$('music').addEventListener('click', toggleMusic);
for (const id of ['vm', 'vs']) {
  $(id).addEventListener('input', () => audio.setVolumes(+$<HTMLInputElement>('vm').value, +$<HTMLInputElement>('vs').value));
}
window.addEventListener('pointerdown', () => audio.unlock(), { capture: true });

// Lets a test script read the same measurements as the page.
Object.assign(window, { soundReport: () => ({ stats: audio.stats(), sounds: NAMES.map(measure), peakVoices }), audio });

void audio.prepare().then(() => {
  buildGrid();
  setInterval(() => {
    const s = audio.stats();
    peakVoices = Math.max(peakVoices, s.voices);
    $('status').textContent = `${s.sounds} sounds, ${s.megabytes.toFixed(1)} MB, rendered in ${(s.bakeMs / 1000).toFixed(2)}s, ${s.voices} voices playing (peak ${peakVoices})`;
  }, 150);
});
