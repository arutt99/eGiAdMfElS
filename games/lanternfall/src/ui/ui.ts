// All menus and the in-game HUD.
import { audio } from '../audio/audio';
import { INK, setArtStyle } from '../render/style';
import { BIOMES } from '../render/biomes';
import { DEMO, type Save } from '../core/save';
import { ENDLESS_WAVES_PER_STARLIGHT, FIRST_CLEAR_BONUS } from '../data/meta';
import { ENEMIES, type EnemyId } from '../data/enemies';
import { ENDLESS_UNLOCK_AFTER, MAPS, type MapDef } from '../data/maps';
import { CHAPTERS, CREDITS, EPILOGUE, PROLOGUE, type StoryScene } from '../data/story';
import { LOCK_ICON, mapArt } from './map-art';
import { DIFFICULTY, heroAvailable, HERO_COMMON, HEROES, HERO_ORDER, META, META_BY_ID, SCHOOLS, SPELLS, SPELL_ORDER, type Difficulty, type HeroDef, type HeroId, type MetaDef, type MetaId, type SpellId } from '../data/meta';
import { DAMAGE_ORDER, DAMAGE_TYPES, TOWERS, TOWER_ORDER, towerStats, type AttackType, type TowerId, type TowerStats } from '../data/towers';
import { QUALITY, type QualityId } from '../render/engine';
import { enemyPortrait, heroPortrait, towerPortrait } from '../render/portraits';
import { MAX_GOLD, TARGET_MODES, type Game, type TargetMode, type Tower } from '../sim/game';

export interface AppActions {
  previewMap(map: MapDef): void;
  startGame(map: MapDef, difficulty: Difficulty, endless: boolean): void;
  quitToMenu(): void;
  restart(): void;
  resume(): void;
  applySettings(): void;
  pickTower(t: TowerId): void;
  pickSpell(s: SpellId): void;
  callWave(): void;
  cycleSpeed(): void;
  togglePause(): void;
  useAbility(index: number): void;
  upgrade(branch: number): void;
  sell(): void;
  setTargetMode(m: TargetMode): void;
  centerHero(): void;
  deselect(): void;
}

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
const star = (on: boolean, cls = '') => `<svg class="star ${on ? 'on' : ''} ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6.2 6.8.8-5 4.6 1.3 6.7-6-3.3-6 3.3 1.3-6.7-5-4.6 6.8-.8z"/></svg>`;
const stars = (n: number, max = 3) => Array.from({ length: max }, (_, i) => star(i < n)).join('');

const ICONS = {
  flame: '<svg viewBox="0 0 24 24"><path d="M12 2c1 4 6 6.5 6 12a6 6 0 0 1-12 0c0-2.7 1.4-4.3 2.6-5.7.3 1.5 1 2.5 2.1 3C10.300 8 10.800 4.800 12 2z"/></svg>',
  coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9 9.500h4.500a2 2 0 0 1 0 4H10a2 2 0 0 0 0 4" fill="none" stroke="rgba(60,30,0,.55)" stroke-width="1.700" transform="translate(0 -1.500)"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.600l2.900 6.200 6.800.8-5 4.600 1.300 6.700-6-3.300-6 3.300 1.300-6.700-5-4.600 6.800-.8z"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><path d="M19.400 13a7.500 7.500 0 0 0 0-2l2-1.600-2-3.400-2.400 1a7.500 7.500 0 0 0-1.700-1L15 3.500h-4l-.4 2.500a7.500 7.500 0 0 0-1.700 1l-2.400-1-2 3.400 2 1.600a7.500 7.500 0 0 0 0 2l-2 1.600 2 3.400 2.400-1a7.500 7.500 0 0 0 1.700 1l.4 2.500h4l.4-2.500a7.500 7.500 0 0 0 1.700-1l2.400 1 2-3.400zM13 15.200a3.200 3.200 0 1 1 0-6.400 3.200 3.200 0 0 1 0 6.400z" transform="translate(-1 0)"/></svg>',
  starfall: '<svg viewBox="0 0 48 48"><path d="M40 6 22 24l-7 2-5 6 3 6 6 3 6-5 2-7L45 11z" fill="#ffb24d"/><circle cx="16" cy="33" r="7" fill="#ffe7a8"/><path d="M28 6 14 20M42 20 28 34" stroke="#ffd98a" stroke-width="2.500" stroke-linecap="round"/></svg>',
  winter: '<svg viewBox="0 0 48 48" fill="none" stroke="#a8ecff" stroke-width="3" stroke-linecap="round"><path d="M24 5v38M7.500 14.500l33 19M40.500 14.500l-33 19"/><path d="M24 12l-4-4M24 12l4-4M24 36l-4 4M24 36l4 4M13.600 18l-5.400-1.500M13.600 18l1.500-5.400M34.400 30l5.400 1.500M34.400 30l-1.500 5.400M34.400 18l5.400-1.500M34.400 18l-1.500-5.400M13.600 30l-5.400 1.500M13.600 30l1.500 5.400"/></svg>',
  guards: '<svg viewBox="0 0 48 48"><path d="M24 4l16 6v12c0 11-7 18-16 22C15 40 8 33 8 22V10z" fill="#5a8fd0"/><path d="M24 4v40c9-4 16-11 16-22V10z" fill="#7fb8ff"/><path d="M24 14v18M17 21h14" stroke="#f6ead2" stroke-width="3.500" stroke-linecap="round"/></svg>',
  sunbreak: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="9" fill="#ffd36b"/><g stroke="#ff9a3c" stroke-width="3.500" stroke-linecap="round"><path d="M24 4v7M24 37v7M4 24h7M37 24h7M9.900 9.900l5 5M33.100 33.100l5 5M38.100 9.900l-5 5M14.900 33.100l-5 5"/></g></svg>',
  ward: '<svg viewBox="0 0 48 48"><path d="M24 44S7 35 7 19a9.500 9.500 0 0 1 17-5.800A9.500 9.500 0 0 1 41 19c0 16-17 25-17 25z" fill="#ffb86b"/><path d="M24 15v18M15 24h18" stroke="#fff4d6" stroke-width="3.500" stroke-linecap="round"/></svg>',
  hex: '<svg viewBox="0 0 48 48" fill="none" stroke="#d48bff" stroke-width="3" stroke-linejoin="round"><path d="M24 4l17 10v20L24 44 7 34V14z"/><path d="M24 12l10 18H14z" stroke="#f0d8ff"/><circle cx="24" cy="24" r="3" fill="#f0d8ff" stroke="none"/></svg>',
  rally: '<svg viewBox="0 0 48 48"><path d="M6 32c12 2 24-4 30-20l6 3c-2 16-12 28-30 26z" fill="#e8b64c"/><ellipse cx="39" cy="13" rx="4" ry="6" transform="rotate(25 39 13)" fill="#7a4a22"/><path d="M6 32l-2 7 8 2" fill="#ffd98a"/></svg>',
  rift: '<svg viewBox="0 0 48 48" fill="none" stroke="#a78bff" stroke-width="3.500" stroke-linecap="round"><path d="M38 12C26 2 8 10 9 25c1 13 17 19 26 10 7-8 2-19-8-19-9 0-12 11-6 15"/></svg>',
  golden: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" fill="#ffcf4f"/><circle cx="24" cy="24" r="12" fill="none" stroke="#b87d1a" stroke-width="2.500"/><path d="M24 15v9l6 4" fill="none" stroke="#7a4a10" stroke-width="3.500" stroke-linecap="round"/></svg>',
  phoenix: '<svg viewBox="0 0 48 48"><path d="M24 44c-9 0-14-6-14-13 0-8 8-10 8-20 6 3 8 8 8 12 3-1 4-5 3-8 7 5 9 11 9 16 0 8-5 13-14 13z" fill="#ff7a24"/><path d="M24 42c-4 0-7-3-7-7 0-5 5-6 7-12 3 5 7 7 7 12 0 4-3 7-7 7z" fill="#ffd25a"/></svg>',
  arrowrain: '<svg viewBox="0 0 48 48" stroke="#c8ff8a" stroke-width="3" stroke-linecap="round" fill="none"><path d="M12 6v26M24 4v34M36 6v26"/><path d="M7 26l5 8 5-8M19 32l5 8 5-8M31 26l5 8 5-8" stroke="#9fe86a"/></svg>',
  huntersmark: '<svg viewBox="0 0 48 48" fill="none" stroke="#c8ff8a" stroke-width="3" stroke-linecap="round"><circle cx="24" cy="24" r="15"/><circle cx="24" cy="24" r="5" fill="#ff6a5a" stroke="none"/><path d="M24 3v10M24 35v10M3 24h10M35 24h10"/></svg>',
  deadeye: '<svg viewBox="0 0 48 48"><path d="M4 24s8-13 20-13 20 13 20 13-8 13-20 13S4 24 4 24z" fill="#e6f8d0"/><circle cx="24" cy="24" r="8" fill="#3a6a30"/><circle cx="24" cy="24" r="3.500" fill="#10200c"/></svg>',
  earthshatter: '<svg viewBox="0 0 48 48"><path d="M3 34l12-4 7 3 8-5 15 6v10H3z" fill="#7a7468"/><path d="M24 4l-4 14 6 2-5 14 11-19-6-2 4-9z" fill="#ffd36b"/></svg>',
  stonewall: '<svg viewBox="0 0 48 48"><path d="M8 8h32v24L24 44 8 32z" fill="#8a9488"/><path d="M8 18h32M8 28h32M20 8v10M30 18v10M18 28v8" stroke="#3f4a40" stroke-width="2.500"/></svg>',
  avalanche: '<svg viewBox="0 0 48 48"><path d="M3 42L20 10l8 12 5-6 12 26z" fill="#a4b0a4"/><path d="M20 10l-5 10 5-2 4 4 4-0z" fill="#f0f4ee"/><circle cx="10" cy="40" r="4" fill="#6a7468"/><circle cx="38" cy="40" r="5" fill="#6a7468"/></svg>',
};

function statRows(s: TowerStats, prev?: TowerStats): string {
  const row = (label: string, v: string, was?: string) =>
    `<div class="stat"><span>${label}</span><b>${was && was !== v ? `<i>${was}</i> ` : ''}${v}</b></div>`;
  const rows: string[] = [];
  if (s.garrison) {
    const g = s.garrison, was = prev?.garrison;
    rows.push(row('Soldiers', `${g.count}`, was && `${was.count}`));
    rows.push(row('Health', `${g.hp}`, was && `${was.hp}`));
    rows.push(row('Damage', `${g.damage}`, was && `${was.damage}`));
    rows.push(row('Enemies blocked each', `${g.blockCap}`, was && `${was.blockCap}`));
    rows.push(row('Return after', `${g.respawn}s`, was && `${was.respawn}s`));
    return rows.join('');
  }
  if (s.aura) {
    rows.push(row('Damage boost', `+${Math.round(s.aura.damage * 100)}%`, prev?.aura ? `+${Math.round(prev.aura.damage * 100)}%` : undefined));
    rows.push(row('Aura radius', s.range.toFixed(1), prev?.range.toFixed(1)));
    if (s.aura.range) rows.push(row('Range boost', `+${Math.round(s.aura.range * 100)}%`));
    if (s.goldPerWave) rows.push(row('Gold per wave', `${s.goldPerWave}`, prev?.goldPerWave ? `${prev.goldPerWave}` : undefined));
    if (s.roots) rows.push(row('Roots', `${s.roots.count} every ${s.roots.every}s`));
    return rows.join('');
  }
  if (s.beam) {
    rows.push(row('Burn per second', `${s.damage}–${Math.round(s.damage * (1 + s.beam.ramp))}`, prev?.beam ? `${prev.damage}–${Math.round(prev.damage * (1 + prev.beam.ramp))}` : undefined));
    if (s.beam.mode === 'split') rows.push(row('Beams', `${s.beam.targets}`));
    if (s.beam.mode === 'line') rows.push(row('Beam', 'Piercing line'));
  } else {
    rows.push(row(s.pulse ? 'Damage to all in reach' : 'Damage', `${s.damage}`, prev && !prev.beam ? `${prev.damage}` : undefined));
    rows.push(row('Attacks per second', s.rate.toFixed(2), prev?.rate ? prev.rate.toFixed(2) : undefined));
  }
  rows.push(row('Range', s.range.toFixed(1), prev?.range.toFixed(1)));
  if (s.splash) rows.push(row('Blast radius', s.splash.toFixed(1), prev?.splash?.toFixed(1)));
  if (s.poison) rows.push(row('Poison', `${s.poison.dps}/s for ${s.poison.dur}s`, prev?.poison && `${prev.poison.dps}/s for ${prev.poison.dur}s`));
  if (s.wither) rows.push(row('Extra damage taken', `+${Math.round(s.wither * 100)}%`));
  if (s.lineShot) rows.push(row('Bolt', 'Passes through a line'));
  if (s.multishot) rows.push(row('Arrows per volley', `${s.multishot}`));
  if (s.chain) rows.push(row('Chain targets', `${s.chain}`));
  if (s.slow) rows.push(row('Slow', `${Math.round(s.slow * 100)}%`));
  if (s.freezeChance) rows.push(row('Freeze chance', `${Math.round(s.freezeChance * 100)}%`));
  if (s.stun) rows.push(row('Stun', `${s.stun}s`));
  if (s.crit) rows.push(row('Critical chance', `${Math.round(s.crit * 100)}%`));
  if (s.armorPierce) rows.push(row('Armor pierce', `${Math.round(s.armorPierce * 100)}%`));
  if (s.pool) rows.push(row('Fire pool burn', `${s.pool.dps}/s`));
  if (s.shred) rows.push(row('Armor shred', `${Math.round(s.shred * 100)}%`));
  return rows.join('');
}

const typeTag = (type: AttackType, extra = '') =>
  `<span class="tag dtype" style="--dt:${DAMAGE_TYPES[type].color}" title="${DAMAGE_TYPES[type].blurb}">${DAMAGE_TYPES[type].label}${extra}</span>`;

function tags(s: TowerStats) {
  if (s.aura) return `<span class="tag support">Support</span>${s.roots ? typeTag('venom') : ''}`;
  const t = [typeTag(s.dmgType)];
  if (s.pool) t.push(typeTag('fire', ' pools'));
  t.push(s.air ? '<span class="tag air">Hits air</span>' : '<span class="tag ground">Ground only</span>');
  return t.join('');
}

/** How an enemy takes each damage type, strongest resistance first. */
function resistChips(id: EnemyId) {
  const r = ENEMIES[id].resist;
  const list = DAMAGE_ORDER.map((t) => ({ t, v: r[t] ?? 0 })).filter((x) => x.v !== 0).sort((a, b) => b.v - a.v);
  if (!list.length) return '<p class="dim">No resistances.</p>';
  const chip = (x: { t: AttackType; v: number }) => typeTag(x.t, ` ${x.v > 0 ? '-' : '+'}${Math.round(Math.abs(x.v) * 100)}%`);
  const res = list.filter((x) => x.v > 0), weak = list.filter((x) => x.v < 0);
  return `${res.length ? `<div class="res-line"><span>Resists</span><div class="tags">${res.map(chip).join('')}</div></div>` : ''}${weak.length ? `<div class="res-line weak"><span>Weak to</span><div class="tags">${weak.map(chip).join('')}</div></div>` : ''}`;
}

/** Small colored dots marking the damage types an enemy strongly resists. */
function resistDots(id: EnemyId) {
  const r = ENEMIES[id].resist;
  const hard = DAMAGE_ORDER.filter((t) => (r[t] ?? 0) >= 0.5);
  return hard.length ? `<span class="pv-res">${hard.map((t) => `<i style="--dt:${DAMAGE_TYPES[t].color}"></i>`).join('')}</span>` : '';
}

const abilityIcon = (id: string) => (ICONS as Record<string, string>)[id] ?? ICONS.sunbreak;

function heroAuraText(h: HeroDef) {
  return `Nearby towers gain ${h.aura.label}.`;
}

class Cached {
  private text = new Map<HTMLElement, string>();
  set(el: HTMLElement | null, s: string) {
    if (!el) return;
    if (this.text.get(el) !== s) {
      el.textContent = s;
      this.text.set(el, s);
    }
  }
  clear() {
    this.text.clear();
  }
}

interface Float { el: HTMLElement; x: number; y: number; z: number; t: number; life: number; active: boolean }
interface Coin { el: HTMLElement; wx: number; wy: number; wz: number; sx: number; sy: number; t: number; life: number; active: boolean; started: boolean; arc: number }

const CINE_TITLE_SECONDS = 3.6;
const CINE_SECONDS_PER_WORD = 0.34;
const CINE_MIN_LINE_SECONDS = 3.4;
const CREDITS_SECONDS = 26;
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export class UI {
  root: HTMLElement;
  menu: HTMLElement;
  hud: HTMLElement;
  floats: HTMLElement;
  modal: HTMLElement;
  private cache = new Cached();
  private selectedMap: MapDef = MAPS[0];
  private selectedDiff: Difficulty = 'normal';
  private endless = false;
  private floatPool: Float[] = [];
  private shownLives = -1;
  private shownMaxLives = -1;
  private coins: Coin[] = [];
  private lastGoldPop = 0;
  private cineCards: { html: string; seconds: number }[] = [];
  private cineIndex = 0;
  private cineTimer = 0;
  private cineDone: (() => void) | null = null;
  private floatNext = 0;
  private lastTowerPanelKey = '';
  private lastPreviewKey = '';
  private game: Game | null = null;
  private toastTimer = 0;
  private tooltip!: HTMLElement;
  private cards = new Map<TowerId, HTMLElement>();
  private spellBtns = new Map<SpellId, HTMLElement>();
  private abilityBtns: (HTMLElement | null)[] = [];
  private tutorialStep = -1;
  private inGame = false;

  constructor(public save: Save, public app: AppActions) {
    this.root = $('#ui');
    this.root.innerHTML = `
      <div id="floats"></div>
      <div id="hud" class="hidden"></div>
      <div id="menu"></div>
      <div id="coins"></div>
      <div id="modal" class="hidden"></div>
      <div id="cine" class="hidden">
        <div class="cine-bar top"></div><div class="cine-bar bottom"></div>
        <div class="cine-card" id="cine-card"></div>
        <div class="credits-roll hidden" id="cine-credits"></div>
        <button class="cine-skip" id="cine-skip">Skip <kbd>Esc</kbd></button>
      </div>
      <div id="tooltip" class="hidden"></div>
      <div id="loading"><div class="load-inner"><div class="wordmark small">Lanternfall</div><div class="load-bar"><i></i></div><div class="load-text">Kindling the lantern</div></div></div>
    `;
    this.menu = $('#menu');
    this.hud = $('#hud');
    this.floats = $('#floats');
    this.modal = $('#modal');
    this.tooltip = $('#tooltip');
    for (let i = 0; i < 48; i++) {
      const el = document.createElement('div');
      el.className = 'float';
      el.style.display = 'none';
      this.floats.appendChild(el);
      this.floatPool.push({ el, x: 0, y: 0, z: 0, t: 0, life: 1, active: false });
    }
    const coinLayer = $('#coins');
    for (let i = 0; i < 26; i++) {
      const el = document.createElement('div');
      el.className = 'coin-fly';
      el.style.display = 'none';
      coinLayer.appendChild(el);
      this.coins.push({ el, wx: 0, wy: 0, wz: 0, sx: 0, sy: 0, t: 0, life: 0.7, active: false, started: false, arc: 0 });
    }
    $('#cine').addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('#cine-skip')) this.cineSkip();
      else this.cineNext();
    });
    document.addEventListener('pointerover', (e) => {
      const t = e.target as HTMLElement;
      if (t.closest('button:not(:disabled)')) {
        const rel = e.relatedTarget as HTMLElement | null;
        if (!rel || rel.closest('button') !== t.closest('button')) audio.play('hover');
      }
      const tipHost = t.closest('[data-tip]') as HTMLElement | null;
      if (tipHost) this.showTip(tipHost);
      else this.hideTip();
    });
    this.root.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('button')) audio.play('click');
    });
    this.selectedDiff = save.data.lastDifficulty;
    this.selectedMap = MAPS.find((m) => m.id === save.data.lastMap) ?? MAPS[0];
  }

  setLoading(k: number, text?: string) {
    const bar = $('#loading .load-bar i');
    if (bar) bar.style.transform = `scaleX(${Math.max(0.03, k).toFixed(3)})`;
    if (text) $('#loading .load-text').textContent = text;
  }

  hideLoading() {
    const l = $('#loading');
    l.classList.add('gone');
    setTimeout(() => l.remove(), 900);
  }

  private showTip(host: HTMLElement) {
    const kind = host.dataset.tip!;
    let html = '';
    if (kind === 'tower') {
      const id = host.dataset.id as TowerId;
      const def = TOWERS[id];
      const s = towerStats(id, 0, 0);
      const locked = this.game && !this.game.isTowerUnlocked(id);
      html = `<h4>${def.name}</h4><p>${s.desc}</p>${locked ? `<p class="warn">${def.tech ? 'Unlock it in the Tech Tree.' : `Unlocks after clearing map ${def.unlockAfter}.`}</p>` : `<div class="tags">${tags(s)}</div><div class="stats">${statRows(s)}</div>`}`;
    } else if (kind === 'spell') {
      const def = SPELLS[host.dataset.id as SpellId];
      const locked = this.game && !this.game.isSpellUnlocked(def.id);
      html = `<h4>${def.name}</h4><p>${def.desc}</p>${locked ? `<p class="warn">${def.tech ? 'Unlock it in the Tech Tree.' : `Unlocks after clearing map ${def.unlockAfter}.`}</p>` : `<p class="dim">Cooldown ${Math.round(this.game?.spellCooldown(def.id) ?? def.cooldown)}s</p>`}`;
    } else if (kind === 'ability') {
      const heroDef = this.game?.heroDef ?? HEROES.ember;
      const index = +host.dataset.id!;
      const a = heroDef.abilities[index];
      html = `<h4>${a.name}</h4><p>${a.desc}</p><p class="dim">Cooldown ${Math.round(this.game?.abilityCooldown(a) ?? a.cooldown)}s</p>`;
    } else if (kind === 'enemy') {
      const e = ENEMIES[host.dataset.id as EnemyId];
      html = `<h4>${e.name}</h4><p>${e.blurb}</p><div class="tags"><span class="tag trait">${e.trait}</span></div>${resistChips(e.id)}`;
    } else if (kind === 'tech') {
      html = this.techTip(host.dataset.id as MetaId);
    } else if (kind === 'heroCard') {
      const h = HEROES[host.dataset.id as HeroId];
      html = `<h4>${h.name}</h4><p class="dim">${h.title}</p><p>${h.blurb}</p><div class="tags">${typeTag(h.damageType)}</div><div class="stats">${h.abilities.map((a, i) => `<div class="stat"><span>${a.name}</span><b>${i === 2 ? 'Awakened' : a.hotkey}</b></div>`).join('')}</div>`;
    } else if (kind === 'text') {
      html = `<p>${host.dataset.text}</p>`;
    }
    this.tooltip.innerHTML = html;
    this.tooltip.classList.remove('hidden');
    const r = host.getBoundingClientRect();
    const tr = this.tooltip.getBoundingClientRect();
    let x = r.left + r.width / 2 - tr.width / 2;
    let y = r.top - tr.height - 10;
    if (y < 8) y = r.bottom + 10;
    x = Math.max(8, Math.min(window.innerWidth - tr.width - 8, x));
    this.tooltip.style.transform = `translate(${x}px, ${y}px)`;
  }

  private hideTip() {
    this.tooltip.classList.add('hidden');
  }

  // ---------- Menus ----------

  showTitle() {
    this.inGame = false;
    this.hideTip();
    this.hud.classList.add('hidden');
    const cleared = this.save.cleared;
    const avail = this.save.availableStarlight;
    this.menu.innerHTML = `
      <div class="title-screen">
        <div class="title-block">
          <p class="eyebrow">A tale of light and the long dark</p>
          <h1 class="wordmark">Lanternfall</h1>
          <nav class="title-nav">
            <button class="nav-btn primary" data-a="play">${cleared > 0 ? 'Continue the Campaign' : 'Begin the Campaign'}</button>
            <button class="nav-btn" data-a="endless" ${cleared < ENDLESS_UNLOCK_AFTER ? 'disabled' : ''}>Endless Night${cleared < ENDLESS_UNLOCK_AFTER ? '<small>Clear Aldergreen to unlock</small>' : ''}</button>
            <button class="nav-btn" data-a="upgrades">Tech Tree${avail > 0 ? `<em class="pill">${avail} to spend</em>` : ''}</button>
            <button class="nav-btn" data-a="chronicle">The Chronicle</button>
            <button class="nav-btn" data-a="settings">Settings</button>
            <button class="nav-btn" data-a="credits">Credits</button>
          </nav>
        </div>
        ${!this.save.persisted ? '<p class="save-warn">Your browser is blocking local storage, so progress will not be saved after you close this page.</p>' : DEMO ? '<p class="save-warn">Demo mode: everything is unlocked. Your real save is untouched.</p>' : ''}
      </div>`;
    this.menu.classList.remove('hidden');
    this.menu.onclick = (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'play') {
        this.endless = false;
        if (cleared === 0 && !this.save.data.seenPrologue) {
          this.save.data.seenPrologue = true;
          this.save.write();
          audio.unlock();
          this.playMenuScene(PROLOGUE, () => this.showMapSelect());
        } else this.showMapSelect();
      }
      else if (a === 'chronicle') this.showChronicle();
      else if (a === 'credits') {
        this.menu.classList.add('hidden');
        this.showCredits(() => this.showTitle());
      }
      else if (a === 'endless') { this.endless = true; this.showMapSelect(); }
      else if (a === 'upgrades') this.showUpgrades(() => this.showTitle());
      else if (a === 'settings') this.showSettings();
    };
  }

  private mapUnlocked(m: MapDef) {
    if (this.endless) return this.save.cleared > m.index;
    return m.index <= this.save.cleared;
  }

  showMapSelect() {
    const cleared = this.save.cleared;
    if (!this.mapUnlocked(this.selectedMap)) {
      this.selectedMap = this.endless ? MAPS[Math.max(0, cleared - 1)] : MAPS[Math.min(cleared, MAPS.length - 1)];
    } else if (!this.endless && this.selectedMap.index < cleared && !this.save.data.stars[MAPS[Math.min(cleared, 5)].id]) {
      // Default to the newest available map when returning to the campaign.
      this.selectedMap = MAPS[Math.min(cleared, MAPS.length - 1)];
    }
    this.app.previewMap(this.selectedMap);
    this.renderMapSelect();
    this.enterScreen();
  }

  /** Plays the entrance animation for a newly opened menu screen, but not when it merely redraws. */
  private enterScreen() {
    this.menu.classList.remove('enter');
    void this.menu.offsetWidth;
    this.menu.classList.add('enter');
    window.setTimeout(() => this.menu.classList.remove('enter'), 900);
  }

  private playMenuScene(scene: StoryScene, onDone: () => void) {
    this.hideModal();
    this.menu.classList.add('hidden');
    this.playCinematic(scene, () => {
      this.menu.classList.remove('hidden');
      onDone();
    });
  }

  private renderMapSelect() {
    const m = this.selectedMap;
    const best = (d: Difficulty) => this.save.bestStars(m.id, d);
    const biome = BIOMES[m.biome];
    const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
    const unlockNote = (() => {
      const unlocked: string[] = [];
      for (const t of TOWER_ORDER) if (TOWERS[t].unlockAfter === m.index + 1) unlocked.push(TOWERS[t].name);
      for (const s of SPELL_ORDER) if (SPELLS[s].unlockAfter === m.index + 1) unlocked.push(SPELLS[s].name);
      return unlocked.length && !this.endless && this.save.cleared <= m.index ? `<p class="unlock-note">Clearing this map unlocks <b>${unlocked.join(' and ')}</b>.</p>` : '';
    })();
    this.menu.innerHTML = `
      <div class="select-screen">
        <button class="back" data-a="back">Back</button>
        <section class="map-info panel">
          <p class="eyebrow">${this.endless ? 'Endless Night' : `Chapter ${m.index + 1}`}</p>
          <h2>${m.name}</h2>
          <p class="subtitle">${m.subtitle}</p>
          <p class="story">${m.story}</p>
          <div class="facts">
            <div><span>Roads</span><b>${m.paths.length}</b></div>
            <div><span>Waves</span><b>${this.endless ? 'Endless' : m.waves.length}</b></div>
            ${this.endless ? `<div><span>Best</span><b>Wave ${this.save.data.endless[m.id] ?? 0}</b></div>` : ''}
          </div>
          <div class="diff" role="radiogroup" aria-label="Difficulty">
            ${(['easy', 'normal', 'hard'] as Difficulty[]).map((d) => `
              <button class="diff-btn ${d === this.selectedDiff ? 'on' : ''}" role="radio" aria-checked="${d === this.selectedDiff}" data-d="${d}">
                <span class="d-name">${DIFFICULTY[d].label}</span>
                ${this.endless ? '' : `<span class="d-stars">${stars(best(d))}</span>`}
              </button>`).join('')}
          </div>
          <p class="diff-blurb">${DIFFICULTY[this.selectedDiff].blurb} ${this.endless ? `Every ${ENDLESS_WAVES_PER_STARLIGHT} waves survived earns 1 Starlight.` : `Each star earns <b>${DIFFICULTY[this.selectedDiff].reward}</b> Starlight, plus <b>${FIRST_CLEAR_BONUS}</b> for a first clear.`}</p>
          ${unlockNote}
          ${this.heroPicker()}
          <button class="play-btn" data-a="start">Defend ${m.name}</button>
        </section>
        <div class="map-rail">
          ${MAPS.map((x) => {
            const open = this.mapUnlocked(x);
            const b = BIOMES[x.biome];
            const total = Math.max(this.save.bestStars(x.id, 'easy'), this.save.bestStars(x.id, 'normal'), this.save.bestStars(x.id, 'hard'));
            return `<button class="map-card ${x === m ? 'on' : ''}" data-m="${x.id}" ${open ? '' : 'disabled'} style="--a:${hex(b.zenith)};--b:${hex(b.horizon)};--c:${hex(b.groundB)}">
              ${mapArt(x.biome)}
              <span class="m-index">${x.index + 1}</span>
              ${open ? '' : LOCK_ICON}
              <span class="m-name">${open ? x.name : 'Locked'}</span>
              <span class="m-stars">${open && !this.endless ? stars(total) : this.endless && open ? `<em>Wave ${this.save.data.endless[x.id] ?? 0}</em>` : ''}</span>
            </button>`;
          }).join('')}
        </div>
        <span class="sr">${hex(biome.fog)}</span>
      </div>`;
    this.menu.onclick = (e) => {
      const t = e.target as HTMLElement;
      const a = t.closest<HTMLElement>('[data-a]')?.dataset.a;
      const d = t.closest<HTMLElement>('[data-d]')?.dataset.d as Difficulty | undefined;
      const id = t.closest<HTMLElement>('[data-m]')?.dataset.m;
      const heroPick = t.closest<HTMLButtonElement>('[data-hero]:not(:disabled)')?.dataset.hero as HeroId | undefined;
      if (heroPick) {
        this.save.data.hero = heroPick;
        this.save.write();
        this.renderMapSelect();
        return;
      }
      if (a === 'back') this.showTitle();
      else if (a === 'start') {
        this.save.data.lastMap = m.id;
        this.save.data.lastDifficulty = this.selectedDiff;
        this.save.write();
        this.app.startGame(m, this.selectedDiff, this.endless);
      } else if (d) {
        this.selectedDiff = d;
        this.renderMapSelect();
      } else if (id) {
        const next = MAPS.find((x) => x.id === id)!;
        if (next !== this.selectedMap) {
          this.selectedMap = next;
          this.app.previewMap(next);
          this.renderMapSelect();
        }
      }
    };
  }

  /** The hero choice on the map screen. Locked heroes show as silhouettes. */
  private heroPicker() {
    const active = this.save.activeHero;
    return `<div class="hero-pick" role="radiogroup" aria-label="Hero">${HERO_ORDER.map((id) => {
      const h = HEROES[id];
      const open = heroAvailable(id, this.save.data.meta);
      return `<button class="hero-opt ${id === active ? 'on' : ''}" data-hero="${id}" role="radio" aria-checked="${id === active}" data-tip="heroCard" data-id="${id}" ${open ? '' : 'disabled'}>
        <img src="${heroPortrait(id)}" alt=""><span>${open ? h.name.replace('Warden ', '') : 'Locked'}</span>${open ? '' : '<small>Tech Tree</small>'}
      </button>`;
    }).join('')}</div>`;
  }

  /** Tooltip for a tech tree node. */
  private techTip(id: MetaId) {
    const m = META_BY_ID[id];
    const rank = this.save.data.meta[id] ?? 0;
    const maxed = rank >= m.max;
    const now = rank > 0 && m.max > 1 ? `<p class="dim">Now: ${m.effect(rank)}</p>` : '';
    const next = maxed ? (m.max > 1 ? '' : `<p>${m.effect(rank)}</p>`) : `<p>${m.max > 1 ? `Rank ${rank + 1}: ` : ''}${m.effect(rank + 1)}</p>`;
    const missing = this.save.missingFor(id).map((r) => META_BY_ID[r].name);
    let detail = '';
    if (m.kind === 'tower') {
      const s = towerStats(m.subject as TowerId, 0, 0);
      detail = `<div class="tags">${tags(s)}</div><div class="stats">${statRows(s)}</div>`;
    } else if (m.kind === 'spell') {
      const sp = SPELLS[m.subject as SpellId];
      detail = `<p class="dim">Cooldown ${sp.cooldown}s. Hotkey ${sp.hotkey}.</p>`;
    } else if (m.kind === 'hero') {
      const h = HEROES[m.subject as HeroId];
      detail = `<p>${h.blurb}</p><div class="tags">${typeTag(h.damageType)}</div><div class="stats">${h.abilities.slice(0, 2).map((a) => `<div class="stat"><span>${a.name}</span><b>${a.hotkey}</b></div>`).join('')}</div>`;
    } else if (id === 'heroUltimate') {
      detail = `<div class="stats">${HERO_ORDER.map((h) => `<div class="stat"><span>${HEROES[h].name}</span><b>${HEROES[h].abilities[2].name}</b></div>`).join('')}</div>`;
    }
    return `<h4>${m.name}</h4>${now}${next}${detail}${missing.length ? `<p class="warn">First buy ${missing.join(' and ')}.</p>` : ''}${maxed ? '<p class="dim">Owned.</p>' : ''}`;
  }

  private techNode(m: MetaDef, avail: number) {
    const rank = this.save.data.meta[m.id] ?? 0;
    const maxed = rank >= m.max;
    const cost = maxed ? 0 : m.costs[rank];
    const sealed = this.save.missingFor(m.id).length > 0;
    const poor = !maxed && cost > avail;
    const cls = [
      m.kind === 'stat' ? '' : 'unlock',
      rank > 0 ? 'owned' : '',
      maxed ? 'max' : '',
      sealed ? 'sealed' : '',
      !sealed && poor ? 'poor' : '',
      !sealed && !maxed && !poor ? 'buyable' : '',
    ].join(' ');
    let art = '';
    if (m.kind === 'tower') art = `<img src="${towerPortrait(m.subject as TowerId, 0, 0)}" alt="">`;
    else if (m.kind === 'hero') art = `<img src="${heroPortrait(m.subject as HeroId)}" alt="">`;
    else if (m.kind === 'spell') art = `<span class="n-ic">${(ICONS as Record<string, string>)[m.subject!]}</span>`;
    else if (m.id === 'heroUltimate') art = `<span class="n-ic">${ICONS.phoenix}</span>`;
    return `<button class="node ${cls}" data-u="${m.id}" data-tip="tech" data-id="${m.id}" style="grid-row:${m.row + 1};grid-column:${m.col + 1}" ${sealed || maxed || poor ? 'aria-disabled="true"' : ''}>
      ${art}
      <span class="n-name">${m.name}</span>
      ${m.max > 1 ? `<span class="pips">${Array.from({ length: m.max }, (_, i) => `<i class="${i < rank ? 'on' : ''}"></i>`).join('')}</span>` : ''}
      <span class="n-cost">${maxed ? 'Owned' : `${cost}${ICONS.star}`}</span>
    </button>`;
  }

  /** Draws the lines between a school's nodes, in percentages of its grid. */
  private techLines(nodes: MetaDef[], rows: number) {
    const lines: string[] = [];
    const rowH = 100 / rows;
    for (const m of nodes) {
      for (const r of m.requires) {
        const from = META_BY_ID[r];
        if (from.school !== m.school) continue;
        const lit = (this.save.data.meta[r] ?? 0) > 0;
        lines.push(`<line class="${lit ? 'lit' : ''}" x1="${(from.col + 0.5) * (100 / 3)}%" y1="${(from.row + 0.5) * rowH}%" x2="${(m.col + 0.5) * (100 / 3)}%" y2="${(m.row + 0.5) * rowH}%"/>`);
      }
    }
    return `<svg class="tree-lines" aria-hidden="true">${lines.join('')}</svg>`;
  }

  showUpgrades(onBack: () => void) {
    const render = () => {
      const avail = this.save.availableStarlight;
      const scroller = this.menu.querySelector('.upgrades-screen');
      const scroll = scroller ? scroller.scrollTop : 0;
      this.menu.innerHTML = `
        <div class="upgrades-screen">
          <header class="up-head">
            <button class="back" data-a="back">Back</button>
            <div><h2>Tech Tree</h2><p class="subtitle">New towers, spells and heroes, paid for with stars earned in battle.</p></div>
            <div class="starlight"><span class="ic">${ICONS.star}</span><b>${avail}</b><span>of ${this.save.totalStarlight} available</span></div>
            <button class="ghost-btn" data-a="refund" ${this.save.spentStarlight ? '' : 'disabled'}>Refund all</button>
          </header>
          <div class="damage-key"><span>Damage types. Every enemy resists some and is weak to others, so build a mix:</span><span class="tags">${DAMAGE_ORDER.map((t) => typeTag(t)).join('')}</span></div>
          <div class="up-grid">
            ${SCHOOLS.map((sc) => {
              const nodes = META.filter((m) => m.school === sc.id);
              const rows = Math.max(...nodes.map((m) => m.row)) + 1;
              return `<section class="up-col tree-school panel">
                <h3>${sc.id}</h3><p class="dim">${sc.blurb}</p>
                <div class="tree" style="grid-template-rows:repeat(${rows}, 86px)">
                  ${this.techLines(nodes, rows)}
                  ${nodes.map((m) => this.techNode(m, avail)).join('')}
                </div>
              </section>`;
            }).join('')}
          </div>
        </div>`;
      const next = this.menu.querySelector('.upgrades-screen');
      if (next) next.scrollTop = scroll;
    };
    render();
    this.enterScreen();
    this.menu.onclick = (e) => {
      const t = e.target as HTMLElement;
      const a = t.closest<HTMLElement>('[data-a]')?.dataset.a;
      const u = t.closest<HTMLElement>('[data-u]')?.dataset.u as MetaId | undefined;
      if (a === 'back') onBack();
      else if (a === 'refund') { this.save.refundMeta(); this.hideTip(); render(); }
      else if (u) {
        if (this.save.buyMeta(u)) {
          audio.play(META_BY_ID[u].kind === 'stat' ? 'upgrade' : 'unlock');
          this.hideTip();
          render();
        } else audio.play('error');
      }
    };
  }

  showSettings(onClose?: () => void) {
    const s = this.save.data.settings;
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <div class="dialog panel wide" role="dialog" aria-label="Settings">
        <h2>Settings</h2>
        <div class="settings-grid">
          <section>
            <h3>Graphics</h3>
            <label class="field"><span>Quality</span>
              <select data-s="quality">${(Object.keys(QUALITY) as QualityId[]).map((q) => `<option value="${q}" ${q === s.quality ? 'selected' : ''}>${QUALITY[q].label}</option>`).join('')}</select>
            </label>
            <label class="check"><input type="checkbox" data-s="autoRes" ${s.autoRes ? 'checked' : ''}><span>Lower resolution automatically to keep things smooth</span></label>
            <label class="check"><input type="checkbox" data-art ${INK ? 'checked' : ''}><span>Inked storybook art (restarts the game)</span></label>
            ${INK ? '' : `<label class="check"><input type="checkbox" data-s="painterly" ${s.painterly ? 'checked' : ''}><span>Painterly filter (High and Ultra)</span></label>
            <label class="check"><input type="checkbox" data-s="tilt" ${s.tilt ? 'checked' : ''}><span>Miniature tilt-shift blur</span></label>`}
            <label class="check"><input type="checkbox" data-s="shake" ${s.shake ? 'checked' : ''}><span>Screen shake</span></label>
            <label class="check"><input type="checkbox" data-s="numbers" ${s.numbers ? 'checked' : ''}><span>Floating damage numbers</span></label>
            <h3>Audio</h3>
            <label class="field"><span>Music</span><input type="range" min="0" max="1" step="0.05" value="${s.music}" data-s="music"></label>
            <label class="field"><span>Sound effects</span><input type="range" min="0" max="1" step="0.05" value="${s.sfx}" data-s="sfx"></label>
          </section>
          <section>
            <h3>Controls</h3>
            <dl class="keys">
              <dt>Left-click</dt><dd>Build, select a tower, cast a spell</dd>
              <dt>Right-click</dt><dd>Send the hero / cancel</dd>
              <dt>Right-drag, Q / E</dt><dd>Rotate the camera</dd>
              <dt>Left-drag, WASD</dt><dd>Move the camera</dd>
              <dt>Scroll</dt><dd>Zoom</dd>
              <dt>1 – 9</dt><dd>Choose a tower (hold Shift to build several)</dd>
              <dt>Z X C G Y U J</dt><dd>Cast spells</dd>
              <dt>V B N</dt><dd>Hero powers</dd>
              <dt>H</dt><dd>Center on the hero</dd>
              <dt>Space</dt><dd>Call the next wave</dd>
              <dt>F</dt><dd>Change game speed</dd>
              <dt>R, Delete, T</dt><dd>Upgrade, sell, change targeting</dd>
              <dt>P, Esc</dt><dd>Pause</dd>
              <dt>&#96;</dt><dd>Cheats</dd>
            </dl>
          </section>
        </div>
        <div class="dialog-foot">
          <button class="ghost-btn danger" data-a="wipe">Erase all progress</button>
          <button class="play-btn small" data-a="close">Done</button>
        </div>
      </div>`;
    this.modal.oninput = (e) => {
      const t = e.target as HTMLInputElement;
      if (t.dataset.art !== undefined) {
        setArtStyle(t.checked);
        return;
      }
      const key = t.dataset.s as keyof typeof s | undefined;
      if (!key) return;
      if (t.type === 'checkbox') (s[key] as boolean) = t.checked;
      else if (t.type === 'range') (s[key] as number) = +t.value;
      else (s[key] as string) = t.value;
      if (key === 'quality') this.save.data.qualityChosen = true;
      this.save.write();
      this.app.applySettings();
    };
    this.modal.onclick = (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'close') {
        this.modal.classList.add('hidden');
        onClose?.();
      } else if (a === 'wipe') {
        const btn = (e.target as HTMLElement).closest('button')!;
        if (btn.dataset.armed) {
          this.save.reset();
          this.endless = false;
          this.modal.classList.add('hidden');
          // During a battle this dialog was opened from the pause menu, which has to come back.
          if (this.inGame) onClose?.();
          else this.showTitle();
        } else {
          btn.dataset.armed = '1';
          btn.textContent = 'Click again to confirm';
        }
      }
    };
  }

  // ---------- In-game HUD ----------

  showHud(game: Game) {
    this.game = game;
    this.shownLives = -1;
    this.shownMaxLives = -1;
    this.inGame = true;
    this.menu.innerHTML = '';
    this.menu.classList.add('hidden');
    this.cache.clear();
    this.lastTowerPanelKey = '';
    this.lastPreviewKey = '';
    this.cards.clear();
    this.spellBtns.clear();
    this.hud.classList.remove('hidden');
    this.hud.innerHTML = `
      <div class="top-left panel slim">
        <div class="res lives" data-tip="text" data-text="Lantern health. Enemies that reach the lantern dim it. If it goes out, the map is lost.">
          <span class="ic flame">${ICONS.flame}</span><b id="h-lives"></b><div class="life-bar"><i id="h-life-fill"></i></div>
        </div>
        <div class="res gold" data-tip="text" data-text="Gold. Earned from kills and from each new wave. Call waves early for a bonus.">
          <span class="ic coin" id="h-gold-icon">${ICONS.coin}</span><b id="h-gold"></b><span class="income" id="h-income"></span>
        </div>
      </div>
      <div class="top-center">
        <div class="wave-box panel slim">
          <div class="wave-line"><span id="h-wave-label"></span><span id="h-wave-time" class="dim"></span></div>
          <div class="wave-preview" id="h-preview"></div>
          <button class="wave-btn" id="h-call" aria-keyshortcuts="Space"><span id="h-call-text">Call wave</span><kbd>Space</kbd></button>
        </div>
        <div class="boss-bar panel slim hidden" id="h-boss">
          <span class="boss-name" id="h-boss-name"></span>
          <div class="boss-track"><i id="h-boss-fill"></i></div>
        </div>
        <div class="coach hidden" id="h-coach"></div>
      </div>
      <div class="top-right">
        <button class="icon-btn speed" id="h-speed" data-tip="text" data-text="Game speed (F)"><span id="h-speed-text">1×</span></button>
        <button class="icon-btn" id="h-pause" aria-label="Pause" data-tip="text" data-text="Pause (P)">${ICONS.pause}</button>
      </div>
      <div class="bottom-left panel slim">
        <button class="hero-portrait" id="h-hero" data-tip="text" data-text="${game.heroDef.name}. ${heroAuraText(game.heroDef)} Right-click the map to move. Press H to center the camera.">
          <img src="${heroPortrait(game.heroDef.id)}" alt=""><span class="lvl" id="h-hero-level"></span><span class="respawn hidden" id="h-hero-respawn"></span>
        </button>
        <div class="hero-side">
          <div class="hero-name">${game.heroDef.name}</div>
          <div class="mini-bar hp"><i id="h-hero-hp"></i></div>
          <div class="mini-bar xp"><i id="h-hero-xp"></i></div>
          <div class="abilities">
            ${game.heroDef.abilities.map((a, i) => (game.isAbilityUnlocked(i) ? `<button class="skill small" id="h-ability-${i}" data-tip="ability" data-id="${i}" aria-label="${a.name}">${abilityIcon(a.id)}<kbd>${a.hotkey}</kbd><span class="cd"></span></button>` : '')).join('')}
          </div>
        </div>
      </div>
      <div class="vignette" id="h-vignette"></div>
      <div class="tower-bar" id="h-towers"></div>
      <div class="lantern-hp" id="h-lantern-hp" role="img" aria-label="Lantern health"><b></b><div class="lantern-hp-bar"><i></i></div></div>
      <div class="bottom-right panel slim" id="h-spells"></div>
      <aside class="tower-panel panel hidden" id="h-panel"></aside>
      <div class="banner" id="h-banner"></div>
      <div class="toast hidden" id="h-toast"></div>
      <div class="hint-line hidden" id="h-hint"></div>
    `;
    const towers = $('#h-towers');
    for (const id of TOWER_ORDER) {
      const def = TOWERS[id];
      const unlocked = game.isTowerUnlocked(id);
      // Towers from the tech tree only take up room once they've been bought.
      if (def.tech && !unlocked) continue;
      const b = document.createElement('button');
      b.className = `tower-card ${unlocked ? '' : 'locked'}`;
      b.dataset.tip = 'tower';
      b.dataset.id = id;
      b.setAttribute('aria-label', def.name);
      b.innerHTML = `<img src="${towerPortrait(id, 0, 0)}" alt=""><kbd>${def.hotkey}</kbd><span class="t-cost">${unlocked ? game.costOf(towerStats(id, 0, 0)) : ''}</span>`;
      b.onclick = () => unlocked && this.app.pickTower(id);
      towers.appendChild(b);
      this.cards.set(id, b);
    }
    const spells = $('#h-spells');
    for (const id of SPELL_ORDER) {
      const def = SPELLS[id];
      const unlocked = game.isSpellUnlocked(id);
      if (def.tech && !unlocked) continue;
      const b = document.createElement('button');
      b.className = `skill ${unlocked ? '' : 'locked'}`;
      b.dataset.tip = 'spell';
      b.dataset.id = id;
      b.setAttribute('aria-label', def.name);
      b.innerHTML = `${ICONS[id]}<kbd>${def.hotkey}</kbd><span class="cd"></span>`;
      b.onclick = () => unlocked && this.app.pickSpell(id);
      spells.appendChild(b);
      this.spellBtns.set(id, b);
    }
    $('#h-call').onclick = () => this.app.callWave();
    $('#h-speed').onclick = () => this.app.cycleSpeed();
    $('#h-pause').onclick = () => this.app.togglePause();
    $('#h-hero').onclick = () => this.app.centerHero();
    this.abilityBtns = game.heroDef.abilities.map((_, i) => this.hud.querySelector<HTMLElement>(`#h-ability-${i}`));
    this.abilityBtns.forEach((btn, i) => {
      if (btn) btn.onclick = () => this.app.useAbility(i);
    });
    this.tutorialStep = this.save.data.tutorialDone || game.map.index !== 0 || game.endless ? -1 : 0;
  }

  hideHud() {
    this.hud.classList.add('hidden');
    this.hud.innerHTML = '';
    this.game = null;
    for (const f of this.floatPool) {
      f.active = false;
      f.el.style.display = 'none';
    }
    for (const coin of this.coins) {
      coin.active = false;
      coin.el.style.display = 'none';
    }
    this.hideTip();
  }

  banner(title: string, sub = '', cls = '') {
    const b = $('#h-banner');
    if (!b) return;
    b.classList.toggle('boss', cls === 'boss');
    b.innerHTML = `<h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}`;
    b.classList.remove('show');
    void b.offsetWidth;
    b.classList.add('show');
  }

  toast(html: string, ms = 5200) {
    const t = $('#h-toast');
    if (!t) return;
    t.innerHTML = html;
    t.classList.remove('hidden');
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => t.classList.add('hidden'), ms);
  }

  hint(text: string | null, bad = false) {
    const h = $('#h-hint');
    if (!h) return;
    if (!text) {
      h.classList.add('hidden');
      return;
    }
    this.cache.set(h, text);
    h.classList.remove('hidden');
    h.classList.toggle('bad', bad);
  }

  announceEnemy(id: EnemyId) {
    const e = ENEMIES[id];
    this.toast(`<img src="${enemyPortrait(id)}" alt=""><div><p class="eyebrow">New enemy</p><h4>${e.name}</h4><p>${e.blurb}</p>${resistChips(id)}</div>`, 7000);
  }

  private updateCoach(game: Game, heroOrdered: boolean, upgraded: boolean) {
    const el = $('#h-coach');
    if (!el) return;
    if (this.tutorialStep < 0) {
      el.classList.add('hidden');
      return;
    }
    const steps: [string, () => boolean][] = [
      ["<b>Build a tower.</b> Press <kbd>1</kbd> for the Archer's Roost, then click open ground beside the road.", () => game.towers.length >= 1],
      ['<b>Build another, then start the fight.</b> Try the Arcane Spire <kbd>2</kbd>, then press <kbd>Space</kbd> to call the first wave.', () => game.wave >= 1],
      ['<b>Send your hero.</b> Right-click the road. Your hero stops enemies and fights them, and also strengthens nearby towers.', () => heroOrdered],
      ['<b>Upgrade.</b> Click any tower to open its panel. After level 2, each tower can specialize in one of two forms.', () => upgraded],
      ['<b>Use your spells.</b> Press <kbd>Z</kbd> and click a crowded stretch of road to call down Starfall.', () => game.spellCd.starfall > 5],
    ];
    if (this.tutorialStep >= steps.length) {
      this.tutorialStep = -1;
      this.save.data.tutorialDone = true;
      this.save.write();
      el.classList.add('hidden');
      return;
    }
    const [text, done] = steps[this.tutorialStep];
    if (done()) {
      this.tutorialStep++;
      return;
    }
    if (el.dataset.step !== String(this.tutorialStep)) {
      el.dataset.step = String(this.tutorialStep);
      el.innerHTML = `<span class="coach-text">${text}</span><button class="link" data-skip>Skip tips</button>`;
      el.classList.remove('hidden');
      ($('[data-skip]', el) as HTMLElement).onclick = () => {
        this.tutorialStep = -1;
        this.save.data.tutorialDone = true;
        this.save.write();
      };
    }
  }

  update(game: Game, ctx: { selected: Tower | null; speed: number; buildType: TowerId | null; spell: SpellId | null; heroOrdered: boolean; upgraded: boolean }) {
    const c = this.cache;
    const hudRoot = this.hud;
    if (!hudRoot.firstChild) return;
    c.set($('#h-gold'), fmt(game.gold));
    c.set($('#h-lives'), `${game.lives}`);
    const lifeFill = $('#h-life-fill');
    const lifeFrac = `scaleX(${(game.lives / game.maxLives).toFixed(3)})`;
    if (lifeFill.dataset.v !== lifeFrac) {
      lifeFill.dataset.v = lifeFrac;
      lifeFill.style.transform = lifeFrac;
    }
    c.set($('#h-speed-text'), `${ctx.speed}×`);

    c.set($('#h-wave-label'), game.endless ? `Wave ${game.wave}` : `Wave ${game.wave} of ${game.totalWaves}`);
    const moreWaves = game.wave < game.totalWaves;
    const timer = game.waveTimer;
    const waveTime = $('#h-wave-time');
    c.set(waveTime, moreWaves && timer > 0 ? `Next in ${Math.ceil(timer)}s` : game.spawnQueue.length ? 'Attacking' : !moreWaves ? 'Final wave' : game.wave === 0 ? 'Ready when you are' : 'Clear the road');
    waveTime.classList.toggle('urgent', moreWaves && timer > 0 && timer <= 5);
    const callBtn = $<HTMLButtonElement>('#h-call');
    callBtn.disabled = !game.canCallWave;
    callBtn.classList.toggle('hide', !moreWaves);
    if (game.wave === 0) c.set($('#h-call-text'), 'Start wave 1');
    else {
      const early = game.earlyBonus;
      c.set($('#h-call-text'), early > 0 ? `Call early +${early} gold` : 'Call next wave');
    }
    let bossHp = 0, bossMax = 0, bossCount = 0, bossName = '';
    for (const e of game.enemies) {
      if (!e.def.boss) continue;
      // Different bosses on the road at once share one bar.
      bossName = !bossName || bossName === e.def.name ? e.def.name : 'Bosses';
      bossHp += Math.max(0, e.hp);
      bossMax += e.maxHp;
      bossCount++;
    }
    $('#h-boss').classList.toggle('hidden', bossCount === 0);
    if (bossCount > 0) {
      c.set($('#h-boss-name'), bossCount > 1 ? `${bossName} × ${bossCount}` : bossName);
      $('#h-boss-fill').style.transform = `scaleX(${(bossHp / bossMax).toFixed(3)})`;
    }
    const previewKey = `${game.wave}`;
    if (previewKey !== this.lastPreviewKey) {
      this.lastPreviewKey = previewKey;
      const list = game.preview();
      $('#h-preview').innerHTML = list.length
        ? `${list.some((p) => ENEMIES[p.type].boss) ? '<span class="boss-tag">Boss</span>' : '<span class="dim">Next</span>'}${list.map((p) => `<span class="pv ${p.elite ? 'elite' : ''} ${ENEMIES[p.type].boss ? 'boss' : ''}" data-tip="enemy" data-id="${p.type}"><img src="${enemyPortrait(p.type)}" alt="${ENEMIES[p.type].name}"><b>${p.count}</b>${resistDots(p.type)}</span>`).join('')}`
        : '<span class="dim">Clear the road to win</span>';
    }

    for (const [id, card] of this.cards) {
      if (card.classList.contains('locked')) continue;
      const afford = game.gold >= game.costOf(towerStats(id, 0, 0));
      card.classList.toggle('poor', !afford);
      card.classList.toggle('active', ctx.buildType === id);
    }
    const setCd = (el: HTMLElement, frac: number, label: string) => {
      const cd = el.querySelector('.cd') as HTMLElement;
      const v = frac.toFixed(3);
      if (cd.dataset.v !== v) {
        cd.dataset.v = v;
        cd.style.setProperty('--cd', `${frac * 360}deg`);
        cd.textContent = label;
        el.classList.toggle('ready', frac <= 0);
      }
    };
    for (const [id, btn] of this.spellBtns) {
      if (btn.classList.contains('locked')) continue;
      const left = game.spellCd[id];
      setCd(btn, left > 0 ? left / game.spellCooldown(id) : 0, left > 0 ? `${Math.ceil(left)}` : '');
      btn.classList.toggle('active', ctx.spell === id);
    }
    const hero = game.hero;
    this.abilityBtns.forEach((btn, i) => {
      if (!btn) return;
      const left = game.abilityCd[i];
      setCd(btn, left > 0 ? left / game.abilityCooldown(game.heroDef.abilities[i]) : 0, left > 0 ? `${Math.ceil(left)}` : '');
    });
    c.set($('#h-hero-level'), `${game.heroLevel}`);
    const hpEl = $('#h-hero-hp');
    const hpW = `${hero.dead ? 0 : Math.max(0, (hero.hp / hero.maxHp) * 100).toFixed(1)}%`;
    if (hpEl.style.width !== hpW) hpEl.style.width = hpW;
    const xpEl = $('#h-hero-xp');
    const xpW = `${game.heroLevel >= HERO_COMMON.maxLevel ? 100 : ((game.heroXp / game.xpToNext()) * 100).toFixed(1)}%`;
    if (xpEl.style.width !== xpW) xpEl.style.width = xpW;
    const respawn = $('#h-hero-respawn');
    respawn.classList.toggle('hidden', !hero.dead);
    if (hero.dead) c.set(respawn, `${Math.ceil(game.heroRespawnT)}`);

    this.updateTowerPanel(game, ctx.selected);
    this.updateCoach(game, ctx.heroOrdered, ctx.upgraded);
  }

  private updateTowerPanel(game: Game, t: Tower | null) {
    const panel = $('#h-panel');
    if (!t) {
      if (this.lastTowerPanelKey) {
        panel.classList.add('hidden');
        this.lastTowerPanelKey = '';
      }
      return;
    }
    const key = `${t.id}-${t.level}-${t.branch}-${t.mode}`;
    if (key !== this.lastTowerPanelKey) {
      this.lastTowerPanelKey = key;
      const s = t.stats;
      const branchOptions = t.level === 1 ? [0, 1] : t.level === 0 || t.level === 2 ? [t.branch] : [];
      const upgrades = branchOptions.map((b) => {
        const next = towerStats(t.type, t.level + 1, b);
        return `<button class="up-card" data-up="${b}">
            <img src="${towerPortrait(t.type, t.level + 1, b)}" alt="">
            <span class="up-body">
              <span class="up-title">${next.name}<span class="up-price" data-price="${b}"><span class="ic coin">${ICONS.coin}</span>${game.costOf(next)}</span></span>
              <span class="up-desc">${next.desc}</span>
              <span class="stats compact">${statRows(next, s)}</span>
            </span>
          </button>`;
      }).join('');
      const pips = Array.from({ length: 4 }, (_, i) => `<i class="${i <= t.level ? 'on' : ''}"></i>`).join('');
      panel.innerHTML = `
        <header>
          <img src="${towerPortrait(t.type, t.level, t.branch)}" alt="">
          <div>
            <h3>${s.name}</h3>
            <div class="pips">${pips}</div>
            <div class="tags">${tags(s)}</div>
          </div>
          <button class="close" data-close aria-label="Close">×</button>
        </header>
        <p class="p-desc">${s.desc}</p>
        <div class="stats">${statRows(s)}</div>
        <div class="kills dim" id="h-kills"></div>
        ${s.aura || s.pulse || s.garrison ? '' : `<div class="targeting"><span class="dim">Target</span><div class="seg">${TARGET_MODES.map((m) => `<button data-mode="${m.id}" class="${m.id === t.mode ? 'on' : ''}">${m.label}</button>`).join('')}</div></div>`}
        ${upgrades ? `<div class="up-list">${t.level === 1 ? '<p class="eyebrow">Choose a specialization</p>' : ''}${upgrades}</div>` : '<p class="maxed">Fully upgraded</p>'}
        <button class="sell-btn" data-sell>Sell for <b>${game.sellValue(t)}</b> gold <kbd>Del</kbd></button>
      `;
      panel.classList.remove('hidden');
      panel.onclick = (e) => {
        const el = e.target as HTMLElement;
        const up = el.closest<HTMLElement>('[data-up]');
        if (up) this.app.upgrade(+up.dataset.up!);
        else if (el.closest('[data-sell]')) this.app.sell();
        else if (el.closest('[data-close]')) this.app.deselect();
        else {
          const m = el.closest<HTMLElement>('[data-mode]');
          if (m) this.app.setTargetMode(m.dataset.mode as TargetMode);
        }
      };
    }
    const kills = $('#h-kills');
    if (kills) this.cache.set(kills, t.stats.aura && !t.stats.roots ? '' : t.stats.garrison ? `${t.squad.length} of ${t.stats.garrison.count} soldiers on the road` : `${t.kills} kills, ${fmt(t.dealt)} damage dealt`);
    for (const b of panel.querySelectorAll<HTMLButtonElement>('[data-up]')) {
      const cost = game.upgradeCost(t, +b.dataset.up!);
      b.classList.toggle('poor', game.gold < cost);
    }
  }

  // ---------- Floating text ----------

  float(x: number, y: number, z: number, text: string, cls: string) {
    const f = this.floatPool[this.floatNext++ % this.floatPool.length];
    f.x = x; f.y = y; f.z = z; f.t = 0; f.active = true;
    f.life = cls === 'f-level' ? 1.5 : 0.95;
    f.el.textContent = text;
    f.el.className = `float ${cls}`;
    f.el.style.display = 'block';
  }

  /** Keeps the lantern's health bar floating above it. */
  updateLanternHp(game: Game, at: { x: number; y: number; visible: boolean }) {
    const el = this.hud.querySelector<HTMLElement>('#h-lantern-hp');
    if (!el) return;
    el.style.display = at.visible ? 'block' : 'none';
    // The lantern often sits near the edge of the view, so keep the whole bar on screen.
    const x = Math.min(window.innerWidth - el.offsetWidth / 2 - 6, Math.max(el.offsetWidth / 2 + 6, at.x));
    el.style.transform = `translate(${x.toFixed(1)}px, ${at.y.toFixed(1)}px) translate(-50%, -100%)`;
    if (game.lives === this.shownLives && game.maxLives === this.shownMaxLives) return;
    if (game.lives < this.shownLives) {
      el.animate([{ scale: '1.22', filter: 'brightness(1.8)' }, { scale: '1', filter: 'none' }], { duration: 380, easing: 'ease-out' });
      if (this.shownLives > 0) this.flashVignette('hurt');
    }
    this.shownLives = game.lives;
    this.shownMaxLives = game.maxLives;
    const frac = game.lives / game.maxLives;
    el.querySelector('b')!.textContent = `${game.lives} / ${game.maxLives}`;
    el.querySelector<HTMLElement>('i')!.style.transform = `scaleX(${frac.toFixed(3)})`;
    el.classList.toggle('low', frac <= 0.4);
  }

  /** Sends coins from a kill up to the gold counter. */
  flyCoin(x: number, y: number, z: number, amount: number) {
    const count = Math.min(4, 1 + Math.floor(amount / 15));
    for (let i = 0; i < count; i++) {
      const coin = this.coins.find((c) => !c.active);
      if (!coin) return;
      coin.active = true;
      coin.started = false;
      coin.wx = x;
      coin.wy = y;
      coin.wz = z;
      coin.t = -i * 0.07;
      coin.life = 0.62 + Math.random() * 0.14;
      coin.arc = 50 + Math.random() * 70;
    }
  }

  /** Shows gold paid at the start of a wave next to the counter. */
  incomePop(amount: number) {
    const el = this.hud.querySelector<HTMLElement>('#h-income');
    if (!el) return;
    el.textContent = `+${fmt(amount)}`;
    el.animate(
      [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none', offset: 0.15 }, { opacity: 1, transform: 'none', offset: 0.75 }, { opacity: 0, transform: 'translateY(-10px)' }],
      { duration: 1700, easing: 'ease-out' },
    );
    this.popGold();
  }

  /** Flashes the screen edges when a boss arrives. */
  alarm() {
    this.flashVignette('boss');
  }

  private flashVignette(kind: 'hurt' | 'boss') {
    const el = this.hud.querySelector<HTMLElement>('#h-vignette');
    if (!el) return;
    el.dataset.kind = kind;
    el.animate([{ opacity: 0 }, { opacity: 1, offset: 0.14 }, { opacity: 0 }], { duration: kind === 'boss' ? 1500 : 620, easing: 'ease-out' });
  }

  private popGold() {
    const now = performance.now();
    if (now - this.lastGoldPop < 90) return;
    this.lastGoldPop = now;
    this.hud.querySelector('.res.gold')?.animate([{ scale: '1.14' }, { scale: '1' }], { duration: 170, easing: 'ease-out' });
  }

  private updateCoins(dt: number, project: (x: number, y: number, z: number) => { x: number; y: number; visible: boolean }) {
    let target: DOMRect | null = null;
    for (const coin of this.coins) {
      if (!coin.active) continue;
      coin.t += dt;
      if (coin.t < 0) continue;
      target ??= this.hud.querySelector('#h-gold-icon')?.getBoundingClientRect() ?? null;
      if (!target) {
        coin.active = false;
        continue;
      }
      if (!coin.started) {
        const p = project(coin.wx, coin.wy, coin.wz);
        coin.sx = p.x;
        coin.sy = p.y;
        coin.started = true;
        coin.el.style.display = 'block';
      }
      const k = Math.min(1, coin.t / coin.life);
      if (k >= 1) {
        coin.active = false;
        coin.el.style.display = 'none';
        this.popGold();
        continue;
      }
      // A curve that lifts off the battlefield and then speeds up toward the counter.
      const e = k * k;
      const tx = target.left + target.width / 2, ty = target.top + target.height / 2;
      const midX = coin.sx + (tx - coin.sx) * 0.3, midY = coin.sy - coin.arc;
      const x = (1 - e) * (1 - e) * coin.sx + 2 * (1 - e) * e * midX + e * e * tx;
      const y = (1 - e) * (1 - e) * coin.sy + 2 * (1 - e) * e * midY + e * e * ty;
      coin.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${(1.1 - e * 0.45).toFixed(2)})`;
    }
  }

  updateFloats(dt: number, project: (x: number, y: number, z: number) => { x: number; y: number; visible: boolean }) {
    this.updateCoins(dt, project);
    for (const f of this.floatPool) {
      if (!f.active) continue;
      f.t += dt;
      const k = f.t / f.life;
      if (k >= 1) {
        f.active = false;
        f.el.style.display = 'none';
        continue;
      }
      const p = project(f.x, f.y, f.z);
      const rise = 44 * (1 - Math.pow(1 - k, 2.2));
      const scale = k < 0.16 ? 0.7 + (k / 0.16) * 0.42 : 1.12 - Math.min(0.12, (k - 0.16) * 0.6);
      f.el.style.transform = `translate(${p.x}px, ${p.y - rise}px) translate(-50%, -50%) scale(${scale})`;
      f.el.style.opacity = `${k > 0.66 ? 1 - (k - 0.66) / 0.34 : 1}`;
    }
  }

  // ---------- Story scenes ----------

  get cineActive() {
    return this.cineDone !== null;
  }

  /** Plays narration over the live scene with letterbox bars, and returns its length in seconds. */
  playCinematic(scene: StoryScene, onDone: () => void) {
    const cards: { html: string; seconds: number }[] = [];
    if (scene.title) {
      cards.push({
        html: `${scene.eyebrow ? `<p class="eyebrow">${scene.eyebrow}</p>` : ''}<h2>${scene.title}</h2>${scene.subtitle ? `<p class="subtitle">${scene.subtitle}</p>` : ''}`,
        seconds: CINE_TITLE_SECONDS,
      });
    }
    for (const line of scene.lines) {
      cards.push({ html: `<p class="cine-line">${line}</p>`, seconds: Math.max(CINE_MIN_LINE_SECONDS, line.split(/\s+/).length * CINE_SECONDS_PER_WORD) });
    }
    this.openCine(onDone);
    this.cineCards = cards;
    this.cineIndex = -1;
    this.cineNext();
    return cards.reduce((sum, card) => sum + card.seconds, 0);
  }

  private openCine(onDone: () => void) {
    this.hideTip();
    this.cineDone = onDone;
    this.root.classList.add('cine-on');
    $('#cine').classList.remove('hidden');
    $('#cine-credits').classList.add('hidden');
    $('#cine-card').innerHTML = '';
  }

  /** Moves to the next line, or ends the scene after the last one. */
  cineNext() {
    if (!this.cineDone) return;
    clearTimeout(this.cineTimer);
    this.cineIndex++;
    const card = this.cineCards[this.cineIndex];
    if (!card) {
      this.cineSkip();
      return;
    }
    const el = $('#cine-card');
    el.innerHTML = card.html;
    el.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none', offset: 0.14 }, { opacity: 1, transform: 'none', offset: 0.9 }, { opacity: 0, transform: 'none' }],
      { duration: card.seconds * 1000, fill: 'both', easing: 'ease-out' },
    );
    this.cineTimer = window.setTimeout(() => this.cineNext(), card.seconds * 1000);
  }

  /** Ends the current scene right away. */
  cineSkip() {
    const done = this.cineDone;
    if (!done) return;
    clearTimeout(this.cineTimer);
    this.cineDone = null;
    this.cineCards = [];
    this.root.classList.remove('cine-on');
    $('#cine').classList.add('hidden');
    $('#cine').classList.remove('dark');
    $('#cine-card').innerHTML = '';
    $('#cine-credits').classList.add('hidden');
    done();
  }

  showCredits(onDone: () => void) {
    this.openCine(onDone);
    this.cineCards = [];
    this.cineIndex = -1;
    $('#cine').classList.add('dark');
    const roll = $('#cine-credits');
    roll.innerHTML = `
      <div class="wordmark small">Lanternfall</div>
      ${CREDITS.map((c) => `<section><h3>${c.heading}</h3>${c.names.map((n) => `<p>${n}</p>`).join('')}</section>`).join('')}
      <p class="credits-end">And to you, Warden, for keeping the light.</p>`;
    roll.style.animationDuration = `${CREDITS_SECONDS}s`;
    roll.classList.remove('hidden');
    this.cineTimer = window.setTimeout(() => this.cineSkip(), CREDITS_SECONDS * 1000);
  }

  /** The story so far, with each scene available to watch again once reached. */
  showChronicle() {
    const cleared = this.save.cleared;
    const reached = (m: MapDef) => cleared > m.index || this.save.data.seenChapters.includes(m.id);
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <div class="dialog panel chronicle" role="dialog" aria-label="The Chronicle">
        <h2>The Chronicle</h2>
        <div class="chronicle-list">
          <button class="chronicle-row" data-s="prologue"><span class="eyebrow">Prologue</span><b>${PROLOGUE.title}</b></button>
          ${MAPS.map((m) => `<button class="chronicle-row" data-s="${m.id}" ${reached(m) ? '' : 'disabled'}><span class="eyebrow">Chapter ${m.index + 1}</span><b>${reached(m) ? m.name : 'Not yet written'}</b></button>`).join('')}
          <button class="chronicle-row" data-s="epilogue" ${cleared >= MAPS.length ? '' : 'disabled'}><span class="eyebrow">Epilogue</span><b>${cleared >= MAPS.length ? EPILOGUE.title : 'Not yet written'}</b></button>
        </div>
        <div class="dialog-row"><button class="play-btn small" data-a="close">Done</button></div>
      </div>`;
    this.modal.oninput = null;
    this.modal.onclick = (e) => {
      const t = e.target as HTMLElement;
      if (t.closest<HTMLElement>('[data-a]')?.dataset.a === 'close') {
        this.hideModal();
        return;
      }
      const id = t.closest<HTMLButtonElement>('[data-s]:not(:disabled)')?.dataset.s;
      if (!id) return;
      const map = MAPS.find((m) => m.id === id);
      const scene: StoryScene = id === 'prologue' ? PROLOGUE : id === 'epilogue' ? EPILOGUE : {
        eyebrow: `Chapter ${map!.index + 1}`, title: map!.name, subtitle: map!.subtitle,
        lines: cleared > map!.index ? [...CHAPTERS[id].opening, CHAPTERS[id].closing] : CHAPTERS[id].opening,
      };
      this.playMenuScene(scene, () => this.showChronicle());
    };
  }

  // ---------- Dialogs ----------

  showCheats(game: Game, onClose: () => void) {
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <div class="dialog panel" role="dialog" aria-label="Cheats">
        <h2>Cheats</h2>
        <label class="cheat-field" for="cheat-gold"><span class="ic">${ICONS.coin}</span>Gold</label>
        <div class="cheat-row">
          <input id="cheat-gold" class="cheat-input" type="number" min="0" max="${MAX_GOLD}" step="1" value="${Math.floor(game.gold)}">
          <button class="ghost-btn" data-a="set">Set</button>
        </div>
        <div class="cheat-row">
          <button class="ghost-btn" data-add="100">+100</button>
          <button class="ghost-btn" data-add="1000">+1,000</button>
          <button class="ghost-btn" data-add="10000">+10,000</button>
        </div>
        <div class="dialog-row">
          <button class="play-btn small" data-a="close">Done</button>
        </div>
      </div>`;
    const input = this.modal.querySelector<HTMLInputElement>('#cheat-gold')!;
    const apply = () => {
      const value = input.valueAsNumber;
      if (Number.isFinite(value)) game.setGold(value);
      input.value = String(Math.floor(game.gold));
    };
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') apply();
      else if (e.key === 'Escape') onClose();
    });
    this.modal.oninput = null;
    this.modal.onclick = (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('[data-a], [data-add]');
      if (!target) return;
      if (target.dataset.add) {
        game.setGold(game.gold + +target.dataset.add);
        input.value = String(Math.floor(game.gold));
      } else if (target.dataset.a === 'set') apply();
      else if (target.dataset.a === 'close') {
        apply();
        onClose();
      }
    };
    input.select();
  }

  showPause(onSettings: () => void, onCheats: () => void) {
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <div class="dialog panel" role="dialog" aria-label="Paused">
        <h2>Paused</h2>
        <div class="dialog-col">
          <button class="play-btn" data-a="resume">Resume</button>
          <button class="nav-btn" data-a="settings">Settings</button>
          <button class="nav-btn" data-a="cheats">Cheats</button>
          <button class="nav-btn" data-a="restart">Restart Map</button>
          <button class="nav-btn" data-a="quit">Leave Battle</button>
        </div>
      </div>`;
    this.modal.oninput = null;
    this.modal.onclick = (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'resume') this.app.resume();
      else if (a === 'settings') onSettings();
      else if (a === 'cheats') onCheats();
      else if (a === 'restart') { this.hideModal(); this.app.restart(); }
      else if (a === 'quit') { this.hideModal(); this.app.quitToMenu(); }
    };
  }

  hideModal() {
    this.modal.classList.add('hidden');
    this.modal.innerHTML = '';
  }

  showEnd(game: Game, won: boolean, gained: number, nextMap: MapDef | null, onNext: () => void, unlocks: string[]) {
    const earned = won && !game.endless ? game.starsEarned() : 0;
    const best = game.endless ? this.save.data.endless[game.map.id] ?? 0 : 0;
    this.modal.classList.remove('hidden');
    this.modal.innerHTML = `
      <div class="dialog panel end ${won ? 'won' : 'lost'}" role="dialog" aria-label="${won ? 'Victory' : 'Defeat'}">
        ${game.endless
          ? `<p class="eyebrow">Endless Night</p><h2>The Lantern Fades</h2><p class="big-stat">Wave ${game.wave}</p><p class="dim">Your best here: wave ${best}</p>`
          : won
            ? `<p class="eyebrow">${game.map.name} · ${DIFFICULTY[game.difficulty].label}</p><h2>${game.map.index === MAPS.length - 1 ? 'The Long Night Ends' : 'The Lantern Holds'}</h2><div class="end-stars">${[0, 1, 2].map((i) => star(i < earned, `s${i}`)).join('')}</div>`
            : `<p class="eyebrow">${game.map.name} · ${DIFFICULTY[game.difficulty].label}</p><h2>The Lantern Goes Dark</h2><p class="dim">The Gloam reached wave ${game.wave} of ${game.totalWaves}. Check what each enemy resists, try a different mix of towers, or spend Starlight in the Tech Tree.</p>`}
        <div class="end-facts">
          <div><span>Foes vanquished</span><b data-count="${game.kills}">0</b></div>
          <div><span>Gold earned</span><b data-count="${Math.round(game.goldEarned)}">0</b></div>
          <div><span>Light remaining</span><b>${game.lives} of ${game.maxLives}</b></div>
          <div><span>Towers standing</span><b>${game.towers.length}</b></div>
          <div><span>Waves faced</span><b>${game.wave}</b></div>
          <div><span>Battle time</span><b>${formatTime(game.time)}</b></div>
        </div>
        ${won && game.lives === game.maxLives ? '<p class="flawless">Flawless defense. The lantern never dimmed.</p>' : ''}
        ${this.topTowers(game)}
        ${gained > 0 ? `<p class="gain"><span class="ic">${ICONS.star}</span>You earned <b>${gained}</b> Starlight</p>` : ''}
        ${unlocks.length ? `<p class="unlock-note">Now unlocked: <b>${unlocks.join(', ')}</b></p>` : ''}
        ${won && !game.endless ? `<p class="story">${CHAPTERS[game.map.id].closing}${game.map.index === MAPS.length - 1 ? ' Try harder difficulties to earn more Starlight, or see how long you can last in Endless Night.' : ''}</p>` : ''}
        <div class="dialog-row">
          ${won && nextMap ? '<button class="play-btn" data-a="next">Next Map</button>' : ''}
          <button class="${won && nextMap ? 'nav-btn' : 'play-btn'}" data-a="retry">${won ? 'Play Again' : 'Try Again'}</button>
          ${gained > 0 || this.save.availableStarlight > 0 ? '<button class="nav-btn" data-a="upgrades">Tech Tree</button>' : ''}
          <button class="nav-btn" data-a="quit">World Map</button>
        </div>
      </div>`;
    this.countUp();
    this.modal.oninput = null;
    this.modal.onclick = (e) => {
      const a = (e.target as HTMLElement).closest<HTMLElement>('[data-a]')?.dataset.a;
      if (a === 'next') { this.hideModal(); onNext(); }
      else if (a === 'retry') { this.hideModal(); this.app.restart(); }
      else if (a === 'quit') { this.hideModal(); this.app.quitToMenu(); }
      else if (a === 'upgrades') {
        this.hideModal();
        this.hideHud();
        this.menu.classList.remove('hidden');
        this.app.quitToMenu();
        this.showUpgrades(() => this.showMapSelect());
      }
    };
    if (won && earned > 0) {
      for (let i = 0; i < earned; i++) setTimeout(() => audio.play('star'), 480 + i * 340);
    }
  }

  /** The three towers that did the most damage this battle. */
  private topTowers(game: Game) {
    const top = [...game.towers].filter((t) => t.dealt > 0).sort((a, b) => b.dealt - a.dealt).slice(0, 3);
    if (!top.length) return '';
    const most = top[0].dealt;
    return `<div class="top-towers"><p class="eyebrow">Towers of the battle</p>${top.map((t) => `
      <div class="top-tower">
        <img src="${towerPortrait(t.type, t.level, t.branch)}" alt="">
        <div class="top-tower-body">
          <div class="top-tower-line"><b>${t.stats.name}</b><span>${fmt(t.dealt)} damage · ${fmt(t.kills)} kills</span></div>
          <div class="top-tower-bar"><i style="--w:${(t.dealt / most).toFixed(3)}"></i></div>
        </div>
      </div>`).join('')}</div>`;
  }

  /** Counts the results up from zero. */
  private countUp() {
    const els = [...this.modal.querySelectorAll<HTMLElement>('[data-count]')];
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / 1000);
      const eased = 1 - Math.pow(1 - k, 3);
      for (const el of els) {
        if (el.isConnected) el.textContent = fmt(+el.dataset.count! * eased);
      }
      if (k < 1 && els.some((el) => el.isConnected)) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  setSelectedMap(m: MapDef) {
    this.selectedMap = m;
  }

  get currentEndless() {
    return this.endless;
  }
}
