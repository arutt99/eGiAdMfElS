// Application shell: boot, the main loop, player input, and game flow.
import './ui/style.css';
import * as THREE from 'three';
import { audio } from './audio/audio';
import { FrameSmoother, ResolutionGovernor } from './core/pacing';
import { Save } from './core/save';
import { clamp } from './core/util';
import type { EnemyId } from './data/enemies';
import { MAPS, type MapDef } from './data/maps';
import { CHAPTERS, EPILOGUE } from './data/story';
import { SPELLS, SPELL_ORDER, type Difficulty, type SpellId } from './data/meta';
import { TOWERS, TOWER_ORDER, towerStats, type TowerId } from './data/towers';
import { Engine, type QualityId } from './render/engine';
import { GameView } from './render/gameview';
import { initMaterials, shared } from './render/materials';
import { renderPortraits } from './render/portraits';
import { Stage } from './render/stage';
import { applyArtStyle, artStylePending } from './render/style';
import { Game, TARGET_MODES, type BattleSnapshot, type Tower } from './sim/game';
import { World, type RoadPath } from './sim/world';
import { buzz, isTouch } from './ui/touch';
import { UI, type ActionBar, type AppActions, type BuildPicker } from './ui/ui';

const FIXED_DT = 1 / 60;
/** Milliseconds between a battle ending and its results appearing, so the final moment can play out. */
const END_DELAY_WON = 2600;
const END_DELAY_LOST = 2300;
/** How far above the lantern's base its health bar floats. */
const LANTERN_HP_HEIGHT = 8.6;
const SPEEDS = [1, 2, 3];
/** How far a finger may wander, in pixels, before a touch counts as a drag instead of a tap. */
const TAP_SLOP = 10;
/** A second tap this close to a tower preview, in world units, builds it. */
const CONFIRM_RADIUS = 1.1;
/** Phones held upright show a "turn sideways" screen, so a battle pauses behind it. */
const PORTRAIT_PHONE = '(orientation: portrait) and (max-width: 600px) and (hover: none)';
/** Real seconds between saves of a battle that sits between waves. */
const BATTLE_SAVE_INTERVAL = 2;
/** How long to wait for lost graphics to come back before suggesting a reload. */
const GFX_RESTORE_WAIT_MS = 4000;

function detectQuality(renderer: THREE.WebGLRenderer): QualityId {
  const gl = renderer.getContext();
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)).toLowerCase() : '';
  if (/swiftshader|llvmpipe|software|basic render/.test(name)) return 'low';
  if (/intel(\(r\))? (hd|uhd) graphics|adreno|mali/.test(name)) return 'medium';
  return 'high';
}

class App implements AppActions {
  save = new Save();
  engine: Engine;
  ui: UI;
  stage: Stage | null = null;
  stageMapId = '';
  game: Game | null = null;
  view: GameView | null = null;
  currentMap: MapDef = MAPS[0];
  difficulty: Difficulty = 'normal';
  endless = false;
  /** Demo mode only: the Endless wave the battle begins at. */
  startWave = 1;
  paused = false;
  speedIdx = 0;
  private announcedWave = 0;
  /** Slow motion: 1 is normal time, and it eases back to 1 at dilationRate per second. */
  private dilation = 1;
  private dilationRate = 1;
  /** An in-game story scene moving the camera. A null road circles the lantern instead. */
  private cine: { t: number; dur: number; road: RoadPath | null } | null = null;
  private cineSample = { x: 0, z: 0, dx: 0, dz: 0 };
  acc = 0;
  last = performance.now();
  time = 0;
  menuOrbit = true;
  private revealed = false;

  buildType: TowerId | null = null;
  spell: SpellId | null = null;
  selected: Tower | null = null;
  heroOrdered = false;
  upgraded = false;
  finished = false;
  /** Touch only: waiting for a tap on the map to send the hero there. */
  heroMode = false;
  /**
   * Touch only: where the build preview or spell target sits. A tower preview stays put until
   * the player confirms it; a spell target only shows while a finger rests on the map.
   */
  private aim: { x: number; z: number } | null = null;
  /** The open ground the player tapped or clicked to build on. The tower picker floats beside it. */
  private site: { x: number; z: number } | null = null;
  /** Mouse only: the picker card under the pointer, previewed at the build site. */
  private hoverType: TowerId | null = null;

  private pointer = { x: 0, y: 0, inside: false, drag: 0 as 0 | 1 | 2 | 3, sx: 0, sy: 0, moved: false, lx: 0, ly: 0 };
  /** Fingers currently on the map, and the two-finger gesture they make. */
  private touches = new Map<number, { x: number; y: number }>();
  private gesture: { dist: number; angle: number; mx: number; my: number } | null = null;
  private keys = new Set<string>();
  private raycaster = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private rayDir = new THREE.Vector3();
  private projectV = new THREE.Vector3();
  private frameSmoother = new FrameSmoother();
  private governor = new ResolutionGovernor();
  private previewTimer = 0;
  /** The graphics context is gone. Nothing draws, so the battle must not move either. */
  private gfxLost = false;
  private gfxTimer = 0;
  private battleSaveT = 0;
  private savedCheckpoint: BattleSnapshot | null = null;

  constructor() {
    const canvas = document.getElementById('scene') as HTMLCanvasElement;
    this.engine = new Engine(canvas);
    this.ui = new UI(this.save, this);
  }

  async boot() {
    const s = this.save.data.settings;
    if (!this.save.data.qualityChosen) {
      s.quality = detectQuality(this.engine.renderer);
    }
    this.engine.setQuality(s.quality);
    this.applySettings();
    this.ui.setLoading(0.05, 'Mixing the paints');
    await tick();
    initMaterials();
    this.ui.setLoading(0.15, 'Carving the towers');
    await renderPortraits((k) => this.ui.setLoading(0.15 + k * 0.5));
    this.ui.setLoading(0.7, 'Raising the islands');
    await tick();
    const map = MAPS.find((m) => m.id === this.save.data.lastMap) ?? MAPS[0];
    this.loadStage(map);
    this.resetCameraForMenu();
    this.engine.rig.snap();
    this.ui.setLoading(1, 'Lighting the lantern');
    this.bindInput();
    this.watchGraphics();
    this.ui.showTitle();
    audio.setTheme(this.stage!.biome.music);
    requestAnimationFrame((t) => this.frame(t));
  }

  private loadStage(map: MapDef) {
    // A quality change during a battle keeps the old island until the next load, so compare quality too.
    if (this.stageMapId === map.id && this.stage?.q === this.engine.quality) return;
    this.stage?.dispose();
    const dpr = this.engine.renderer.getPixelRatio();
    this.stage = new Stage(World.get(map), this.engine.quality, dpr);
    this.stage.bakeEnvironment(this.engine.renderer);
    this.stageMapId = map.id;
    this.engine.setScene(this.stage.scene, this.stage.biome);
  }

  private resetCameraForMenu() {
    const rig = this.engine.rig;
    rig.tTarget.set(0, 1, 0);
    rig.tDist = 112;
    rig.tPitch = 0.62;
    rig.tYaw = 0.5;
    this.menuOrbit = true;
  }

  private resetCameraForGame() {
    const rig = this.engine.rig;
    this.fitBattlefield();
    rig.boundsX = this.currentMap.halfW + 4;
    rig.boundsZ = this.currentMap.halfH + 4;
    this.menuOrbit = false;
  }

  // ---------- AppActions ----------

  previewMap(map: MapDef) {
    // Debounced so that clicking across maps stays responsive.
    const wasPending = this.previewTimer !== 0;
    clearTimeout(this.previewTimer);
    this.previewTimer = 0;
    if (map.id === this.stageMapId) {
      // Returning to the loaded map cancels a pending preview, so undo the fade that preview began.
      if (wasPending) this.engine.fadeTo(0);
      return;
    }
    this.engine.fadeTo(1);
    this.previewTimer = window.setTimeout(() => {
      this.previewTimer = 0;
      this.loadStage(map);
      this.resetCameraForMenu();
      audio.setTheme(this.stage!.biome.music);
      this.engine.fadeTo(0);
    }, 240);
  }

  startGame(map: MapDef, difficulty: Difficulty, endless: boolean, startWave = 1) {
    this.beginBattle(map, difficulty, endless, startWave, null);
  }

  resumeBattle() {
    const snap = this.save.battle;
    const map = snap && MAPS.find((m) => m.id === snap.map);
    if (!snap || !map) {
      this.save.clearBattle();
      this.ui.showTitle();
      return;
    }
    this.ui.menu.classList.add('hidden');
    this.beginBattle(map, snap.difficulty, snap.endless, snap.startWave, snap);
  }

  /** Starts a new battle, or rebuilds a saved one when given a snapshot. */
  private beginBattle(map: MapDef, difficulty: Difficulty, endless: boolean, startWave: number, snap: BattleSnapshot | null) {
    // A new battle replaces any saved one.
    if (!snap) this.save.clearBattle();
    clearTimeout(this.previewTimer);
    this.previewTimer = 0;
    audio.unlock();
    this.currentMap = map;
    this.difficulty = difficulty;
    this.endless = endless;
    this.startWave = endless ? startWave : 1;
    this.ui.setSelectedMap(map);
    this.engine.fadeTo(1);
    window.setTimeout(() => {
      this.cleanupGame();
      this.loadStage(map);
      let game: Game | null = null;
      if (snap) {
        try {
          game = Game.restore(map, snap);
        } catch (err) {
          console.error('Could not resume the saved battle', err);
          this.save.clearBattle();
        }
      }
      this.game = game ?? new Game({ map, difficulty, endless, meta: this.save.data.meta, cleared: this.save.cleared, hero: this.save.activeHero, startWave: this.startWave });
      this.announcedWave = this.game.wave;
      this.savedCheckpoint = this.game.checkpoint;
      this.battleSaveT = 0;
      this.view = new GameView(this.game, this.stage!, this.engine);
      const s = this.save.data.settings;
      this.view.showNumbers = s.numbers;
      this.view.shakeEnabled = s.shake;
      this.view.onFloat = (x, y, z, text, cls) => this.ui.float(x, y, z, text, cls);
      this.view.onCoin = (x, y, z, amount) => this.ui.flyCoin(x, y, z, amount);
      this.view.onIncome = (amount) => this.ui.incomePop(amount);
      this.view.onBoss = () => this.ui.alarm();
      this.view.onBossDown = () => this.slowTime(0.3, 1.2);
      this.closeSite();
      this.buildType = null;
      this.spell = null;
      this.selected = null;
      this.paused = false;
      this.finished = false;
      this.speedIdx = 0;
      this.acc = 0;
      this.dilation = 1;
      this.cine = null;
      this.heroOrdered = false;
      this.upgraded = false;
      this.engine.desat = 0;
      this.resetCameraForGame();
      this.engine.rig.snap();
      this.ui.showHud(this.game);
      audio.setTheme(this.stage!.biome.music);
      audio.setIntensity(0);
      this.engine.fadeTo(0);
      const firstVisit = !endless && map.index >= this.save.cleared && !this.save.data.seenChapters.includes(map.id);
      if (game) {
        // A resumed battle opens paused, so the player can get their bearings first.
        this.ui.banner(map.name, `Battle resumed · wave ${game.wave + 1}`);
        this.togglePause();
      } else if (firstVisit) this.playChapterOpening(map);
      else this.ui.banner(map.name, endless ? (this.startWave > 1 ? `Endless Night · from wave ${this.startWave}` : 'Endless Night') : map.subtitle);
    }, 300);
  }

  /** Opens a chapter by following the road from the rift to the lantern while the narration plays. */
  private playChapterOpening(map: MapDef) {
    const g = this.game!;
    this.save.data.seenChapters.push(map.id);
    this.save.write();
    this.paused = true;
    const rig = this.engine.rig;
    const road = g.world.roads[0];
    road.sample(0, this.cineSample);
    rig.tTarget.set(this.cineSample.x, 1, this.cineSample.z);
    rig.tDist = 58;
    rig.tPitch = 0.72;
    rig.tYaw = 0;
    rig.snap();
    const dur = this.ui.playCinematic({ eyebrow: `Chapter ${map.index + 1}`, title: map.name, subtitle: map.subtitle, lines: CHAPTERS[map.id].opening }, () => {
      this.cine = null;
      this.paused = false;
      this.resetCameraForGame();
      this.ui.banner(map.name, map.subtitle);
    });
    this.cine = { t: 0, dur, road };
  }

  private updateCinematicCamera(dt: number) {
    const c = this.cine!;
    c.t += dt;
    const rig = this.engine.rig;
    if (!c.road) {
      rig.tYaw += dt * 0.07;
      return;
    }
    const k = clamp(c.t / c.dur);
    c.road.sample(c.road.length * k * k * (3 - 2 * k), this.cineSample);
    rig.tTarget.set(this.cineSample.x, 1, this.cineSample.z);
  }

  /** Slows time to the given rate, then eases back to normal over the given seconds. */
  private slowTime(rate: number, seconds: number) {
    this.dilation = Math.min(this.dilation, rate);
    this.dilationRate = (1 - rate) / seconds;
  }

  private cleanupGame() {
    this.view?.dispose();
    this.view = null;
    this.game = null;
    this.selected = null;
    this.closeSite();
    this.buildType = null;
    this.spell = null;
    this.heroMode = false;
    this.aim = null;
    this.touches.clear();
    this.gesture = null;
    if (this.stage) {
      const u = this.stage.uniforms;
      u.uRing.value.w = 0;
      u.uRing2.value.w = 0;
      u.uBuildOn.value = 0;
      this.stage.setLanternLife(1, 0);
    }
  }

  quitToMenu() {
    this.save.clearBattle();
    // The battle is over, so leaving the page during the fade must not save it again.
    this.finished = true;
    // A new art style waits for the battle to end, and switching it reloads the page.
    if (artStylePending()) {
      applyArtStyle();
      return;
    }
    this.engine.fadeTo(1);
    this.engine.desat = 0;
    this.ui.hideHud();
    window.setTimeout(() => {
      this.cleanupGame();
      this.paused = false;
      this.resetCameraForMenu();
      this.engine.rig.snap();
      audio.setIntensity(0);
      this.engine.fadeTo(0);
    }, 280);
    this.ui.menu.classList.remove('hidden');
    this.ui.showMapSelect();
  }

  restart() {
    this.ui.hideHud();
    this.startGame(this.currentMap, this.difficulty, this.endless, this.startWave);
  }

  resume() {
    this.paused = false;
    this.ui.hideModal();
  }

  applySettings() {
    const s = this.save.data.settings;
    audio.setVolumes(s.music, s.sfx);
    if (s.quality !== this.engine.qualityId) {
      this.engine.setQuality(s.quality);
      this.governor.reset();
      // Geometry detail and foliage density depend on quality, so rebuild the island.
      if (this.stage && !this.game) {
        const map = MAPS.find((m) => m.id === this.stageMapId)!;
        this.stageMapId = '';
        this.loadStage(map);
      } else if (this.stage) {
        this.engine.setScene(this.stage.scene, this.stage.biome);
      }
    }
    if (!s.autoRes && this.engine.renderScale !== 1) {
      this.engine.setRenderScale(1);
      this.governor.reset();
    }
    this.engine.setToggles(s.painterly, s.tilt);
    if (this.view) {
      this.view.showNumbers = s.numbers;
      this.view.shakeEnabled = s.shake;
    }
  }

  pickTower(t: TowerId) {
    if (!this.game || this.paused) return;
    if (!this.game.isTowerUnlocked(t)) return;
    if (this.site) {
      this.buildAtSite(t);
      return;
    }
    this.spell = null;
    this.selected = null;
    this.heroMode = false;
    this.aim = null;
    this.buildType = this.buildType === t ? null : t;
    audio.play('click');
  }

  /**
   * A card in the tower picker. A mouse click builds at once. On touch the first tap previews the
   * tower and its range at the site, and a second tap on the same card (or on the preview) builds it.
   */
  private buildAtSite(t: TowerId) {
    const g = this.game!;
    const site = this.site!;
    if (isTouch() && this.buildType !== t) {
      this.buildType = t;
      this.aim = { x: site.x, z: site.z };
      audio.play('click');
      buzz(6);
      return;
    }
    const problem = g.canBuild(t, site.x, site.z);
    if (problem) {
      audio.play('error');
      this.flashHint(problem);
      return;
    }
    if (g.build(t, site.x, site.z)) {
      // Building leaves the new tower unselected; tapping it opens its panel.
      this.closeSite();
      this.selected = null;
      buzz(14);
    }
  }

  /** Mouse only: previews the picker card under the pointer at the build site. */
  hoverTower(t: TowerId | null) {
    this.hoverType = t;
  }

  /** Opens the tower picker on open ground, or explains why a tower can't go there. */
  private openSite(hit: { x: number; z: number }) {
    const g = this.game!;
    const x = this.snap(hit.x), z = this.snap(hit.z);
    const problem = g.placementProblem(x, z);
    if (problem) {
      this.flashHint(problem, false);
      return;
    }
    this.site = { x, z };
    this.buildType = null;
    this.aim = null;
    this.selected = null;
    audio.play('click');
    buzz(6);
  }

  /** Closes the tower picker and drops whatever it was previewing. */
  closeSite() {
    if (!this.site) return;
    this.site = null;
    this.hoverType = null;
    this.buildType = null;
    this.aim = null;
  }

  pickSpell(id: SpellId) {
    const g = this.game;
    if (!g || this.paused || !g.isSpellUnlocked(id)) return;
    if (g.spellCd[id] > 0) {
      audio.play('error');
      return;
    }
    if (SPELLS[id].instant) {
      if (g.castSpell(id, 0, 0)) audio.play('click');
      this.spell = null;
      return;
    }
    this.closeSite();
    this.buildType = null;
    this.selected = null;
    this.heroMode = false;
    this.aim = null;
    this.spell = this.spell === id ? null : id;
    audio.play('click');
  }

  callWave() {
    const g = this.game;
    if (!g || this.paused) return;
    g.callNextWave();
  }

  /** Announces each new wave, whether the player called it or the timer did. */
  private noteNewWave() {
    const g = this.game!;
    if (g.wave === this.announcedWave) return;
    this.announcedWave = g.wave;
    if (!g.started) return;
    const title = !g.endless && g.wave === g.totalWaves ? 'Final Wave' : `Wave ${g.wave}`;
    if (g.waveHasBoss(g.wave - 1)) this.ui.banner(title, g.bossAnnouncement(g.wave - 1), 'boss');
    else this.ui.banner(title);
  }

  cycleSpeed() {
    this.speedIdx = (this.speedIdx + 1) % SPEEDS.length;
  }

  togglePause() {
    if (!this.game || this.finished) return;
    this.paused = !this.paused;
    if (this.paused) {
      const menu = () => {
        this.ui.showPause(
          () => this.ui.showSettings(menu),
          () => this.ui.showCheats(this.game!, menu),
        );
      };
      menu();
    } else {
      this.ui.hideModal();
    }
  }

  /** Opens the cheat menu straight from play. Closing it resumes the battle. */
  openCheats() {
    if (!this.game || this.finished || this.paused) return;
    this.paused = true;
    this.ui.showCheats(this.game, () => this.resume());
  }

  useAbility(index: number) {
    if (!this.game || this.paused) return;
    if (!this.game.useAbility(index)) audio.play('error');
  }

  upgrade(branch: number) {
    const g = this.game;
    const t = this.selected;
    if (!g || !t || this.paused) return;
    if (g.upgrade(t, branch)) this.upgraded = true;
    else audio.play('error');
  }

  sell() {
    const g = this.game;
    const t = this.selected;
    if (!g || !t || this.paused) return;
    g.sell(t);
    this.selected = null;
  }

  setTargetMode(m: Tower['mode']) {
    if (this.selected) this.selected.mode = m;
  }

  /** The whole map, square on, as a battle starts. Undoes any pan, zoom or twist. */
  fitBattlefield() {
    const rig = this.engine.rig;
    rig.tTarget.set(0, 1, 2);
    rig.tDist = 110;
    rig.tPitch = 0.95;
    rig.tYaw = 0;
  }

  centerHero() {
    const h = this.game?.hero;
    if (!h || h.dead) return;
    this.engine.rig.tTarget.x = h.x;
    this.engine.rig.tTarget.z = h.z;
  }

  deselect() {
    this.selected = null;
  }

  // ---------- Input ----------

  private bindInput() {
    const canvas = this.engine.renderer.domElement;
    const p = this.pointer;
    void audio.prepare();
    window.addEventListener('pointerdown', () => audio.unlock(), { capture: true });
    window.addEventListener('keydown', () => audio.unlock(), { capture: true });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    canvas.addEventListener('pointerdown', (e) => {
      canvas.setPointerCapture(e.pointerId);
      if (e.pointerType === 'touch') {
        this.touchDown(e);
        return;
      }
      p.x = p.sx = p.lx = e.clientX;
      p.y = p.sy = p.ly = e.clientY;
      p.inside = true;
      p.moved = false;
      p.drag = e.button === 0 ? 1 : e.button === 1 ? 3 : 2;
    });
    // Fires after pointerup, and also when a drag is cut short without one (touch cancel, focus loss).
    canvas.addEventListener('lostpointercapture', (e) => {
      if (e.pointerType === 'touch') this.touchUp(e, false);
      else p.drag = 0;
    });
    window.addEventListener('pointercancel', (e) => {
      if (e.pointerType === 'touch') this.touchUp(e, false);
    });
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') {
        this.touchMove(e);
        return;
      }
      p.x = e.clientX;
      p.y = e.clientY;
      p.inside = e.target === canvas;
      if (!p.drag) return;
      const dx = e.clientX - p.lx;
      const dy = e.clientY - p.ly;
      p.lx = e.clientX;
      p.ly = e.clientY;
      if (Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > 5) p.moved = true;
      if (!p.moved) return;
      const rig = this.engine.rig;
      if (p.drag === 2) {
        rig.tYaw -= dx * 0.005;
        rig.tPitch = Math.max(0.5, Math.min(1.35, rig.tPitch + dy * 0.003));
        this.menuOrbit = false;
      } else if ((p.drag === 1 && !this.buildType && !this.spell) || p.drag === 3) {
        this.panBy(dx, dy);
      }
    });
    window.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'touch') {
        this.touchUp(e, e.target === canvas);
        return;
      }
      const drag = p.drag;
      p.drag = 0;
      if (!drag || p.moved || e.target !== canvas) return;
      if (drag === 1) this.leftClick(e);
      else if (drag === 2) this.rightClick();
    });
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (!this.game) return;
      this.engine.rig.zoom(Math.exp(e.deltaY * 0.0011));
    }, { passive: false });
    window.addEventListener('keydown', (e) => this.onKey(e));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
    // The page may never come back from the background, so save the battle on the way out.
    window.addEventListener('pagehide', () => this.persistBattle());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.persistBattle();
      audio.suspend(document.hidden);
      this.last = performance.now();
      if (document.hidden && this.game && !this.paused && !this.finished) this.togglePause();
    });
    // Turning a phone upright covers the battle, so pause it.
    matchMedia(PORTRAIT_PHONE).addEventListener('change', (e) => {
      if (e.matches && this.game && !this.paused && !this.finished && !this.ui.cineActive) this.togglePause();
    });
  }

  /** Moves the camera with the screen-space motion of a drag. */
  private panBy(dx: number, dy: number) {
    if (!this.game) return;
    const rig = this.engine.rig;
    const k = (rig.dist / window.innerHeight) * 0.56;
    rig.pan(-dx * k, -dy * k * 1.3);
  }

  // ---------- Touch ----------
  // One finger drags the camera, and a tap acts like a click. Two fingers pinch to zoom, twist to
  // rotate, and move together to pan.

  private touchDown(e: PointerEvent) {
    const p = this.pointer;
    this.touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    p.inside = false;
    if (this.touches.size === 1) {
      p.x = p.sx = p.lx = e.clientX;
      p.y = p.sy = p.ly = e.clientY;
      p.moved = false;
      p.drag = 1;
      // Resting a finger on the map while a spell is chosen shows where it will land.
      if (this.spell && this.game) this.aim = this.pick();
    } else if (this.touches.size === 2) {
      // A second finger turns this into a gesture, so neither finger can end as a tap.
      p.moved = true;
      p.drag = 0;
      if (this.spell) this.aim = null;
      this.gesture = this.measureGesture();
    }
  }

  private touchMove(e: PointerEvent) {
    const t = this.touches.get(e.pointerId);
    if (!t) return;
    t.x = e.clientX;
    t.y = e.clientY;
    const p = this.pointer;
    if (this.touches.size >= 2) {
      const prev = this.gesture;
      const next = this.measureGesture();
      if (!prev || !next) return;
      this.gesture = next;
      if (!this.game) return;
      const rig = this.engine.rig;
      if (next.dist > 0 && prev.dist > 0) rig.zoom(prev.dist / next.dist);
      let turn = next.angle - prev.angle;
      if (turn > Math.PI) turn -= Math.PI * 2;
      else if (turn < -Math.PI) turn += Math.PI * 2;
      rig.tYaw += turn;
      this.panBy(next.mx - prev.mx, next.my - prev.my);
      return;
    }
    if (!p.drag) return;
    p.x = e.clientX;
    p.y = e.clientY;
    const dx = e.clientX - p.lx;
    const dy = e.clientY - p.ly;
    p.lx = e.clientX;
    p.ly = e.clientY;
    if (!p.moved && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) > TAP_SLOP) {
      p.moved = true;
      // The finger is dragging the map after all, so it no longer aims a spell.
      if (this.spell) this.aim = null;
    }
    if (p.moved) this.panBy(dx, dy);
  }

  private touchUp(e: PointerEvent, onCanvas: boolean) {
    if (!this.touches.delete(e.pointerId)) return;
    const p = this.pointer;
    if (this.touches.size === 1) {
      // Lifting one finger of a gesture leaves the other dragging the map.
      const [rest] = this.touches.values();
      this.gesture = null;
      p.lx = rest.x;
      p.ly = rest.y;
      p.drag = 1;
      p.moved = true;
      return;
    }
    if (this.touches.size > 1) {
      this.gesture = this.measureGesture();
      return;
    }
    this.gesture = null;
    const tapped = p.drag === 1 && !p.moved && onCanvas;
    p.drag = 0;
    if (this.spell) this.aim = null;
    if (tapped) {
      p.x = e.clientX;
      p.y = e.clientY;
      this.touchTap();
    }
  }

  /** The distance, angle and midpoint between the first two fingers on the map. */
  private measureGesture() {
    const it = this.touches.values();
    const a = it.next().value, b = it.next().value;
    if (!a || !b) return null;
    return { dist: Math.hypot(b.x - a.x, b.y - a.y), angle: Math.atan2(b.y - a.y, b.x - a.x), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
  }

  /** A tap on the map: place or confirm a tower, cast a spell, send the hero, or select a tower. */
  private touchTap() {
    const g = this.game;
    if (!g || this.paused || this.finished) return;
    const hit = this.pick();
    if (this.heroMode) {
      this.heroMode = false;
      if (hit) this.orderHeroAt(hit);
      return;
    }
    if (this.site) {
      // A second tap on the previewed tower builds it. Any other tap closes the picker.
      if (this.buildType && hit && Math.hypot(hit.x - this.site.x, hit.z - this.site.z) <= CONFIRM_RADIUS) {
        this.confirmAction();
        return;
      }
      this.closeSite();
      this.selected = this.towerUnderPointer();
      if (this.selected) audio.play('click');
      return;
    }
    if (this.buildType) {
      if (!hit) return;
      const x = this.snap(hit.x), z = this.snap(hit.z);
      // A second tap on the preview builds it. A tap anywhere else moves the preview there.
      if (this.aim && Math.hypot(x - this.aim.x, z - this.aim.z) <= CONFIRM_RADIUS) {
        this.confirmAction();
        return;
      }
      this.aim = { x, z };
      buzz(6);
      return;
    }
    if (this.spell) {
      if (!hit) return;
      if (g.castSpell(this.spell, hit.x, hit.z)) {
        this.spell = null;
        buzz(12);
      } else audio.play('error');
      return;
    }
    this.selectOrOpenSite(hit);
  }

  /**
   * A tap or click with nothing armed: select the tower there, or open the tower picker on open ground.
   * With a tower panel already open it only closes the panel, so a tap away never builds by surprise.
   */
  private selectOrOpenSite(hit: { x: number; z: number } | null) {
    const had = this.selected;
    this.selected = this.towerUnderPointer();
    if (this.selected) audio.play('click');
    else if (this.pointerOnLantern()) this.ui.toggleLanternHp();
    else if (!had && hit) this.openSite(hit);
  }

  // ---------- Touch action bar ----------

  /** Builds the tower previewed on the map. */
  confirmAction() {
    const g = this.game;
    const type = this.buildType;
    const at = this.aim;
    if (!g || !type || !at || this.paused) return;
    const problem = g.canBuild(type, at.x, at.z);
    if (problem) {
      audio.play('error');
      this.flashHint(problem);
      return;
    }
    const built = g.build(type, at.x, at.z);
    if (built) {
      // Building leaves the new tower unselected; tapping it opens its panel.
      this.closeSite();
      this.buildType = null;
      this.aim = null;
      this.selected = null;
      buzz(14);
    }
  }

  /** Leaves build, spell or hero mode. */
  cancelAction() {
    this.closeSite();
    this.buildType = null;
    this.spell = null;
    this.heroMode = false;
    this.aim = null;
  }

  /** Touch: the hero portrait arms a hero order, and the next tap on the map sends them. */
  toggleHeroMode() {
    const g = this.game;
    if (!g || this.paused || this.finished) return;
    if (this.heroMode) {
      this.heroMode = false;
      return;
    }
    if (g.hero.dead) {
      audio.play('error');
      this.flashHint(`Your hero returns in ${Math.ceil(g.heroRespawnT)}s`);
      return;
    }
    this.closeSite();
    this.buildType = null;
    this.spell = null;
    this.aim = null;
    this.selected = null;
    this.heroMode = true;
    audio.play('click');
  }

  /** Where the tower picker sits on screen and what its caption says, or null when it is closed. */
  private picker(): BuildPicker | null {
    const g = this.game;
    const site = this.site;
    if (!g || !site || this.finished || this.paused) return null;
    const p = this.project(site.x, g.world.height(site.x, site.z) + 0.3, site.z);
    const touch = isTouch();
    const blocked = TOWER_ORDER.filter((id) => g.isTowerUnlocked(id) && g.placementProblem(site.x, site.z, id));
    const type = this.buildType ?? this.hoverType;
    if (!type) return { x: p.x, y: p.y, title: 'Build here', text: touch ? 'Tap a tower to see its range' : 'Choose a tower', bad: false, blocked, armed: null };
    const s = towerStats(type, 0, 0);
    const problem = g.canBuild(type, site.x, site.z);
    const text = problem ?? (touch ? `Tap again to build for ${g.costOf(s)} gold` : `Click to build for ${g.costOf(s)} gold`);
    return { x: p.x, y: p.y, title: s.name, text, bad: !!problem, blocked, armed: this.buildType };
  }

  /** What the touch action bar should say, or null to hide it. */
  private actionBar(): ActionBar | null {
    const g = this.game;
    if (!g || this.finished) return null;
    if (this.heroMode) return { kind: 'hero', title: g.heroDef.name, text: 'Tap the map to send your hero there', confirm: null };
    // The tower picker carries its own caption.
    if (this.site) return null;
    if (this.buildType) {
      const s = towerStats(this.buildType, 0, 0);
      const cost = g.costOf(s);
      if (!this.aim) return { kind: 'build', title: s.name, text: `${cost} gold · tap open ground beside the road`, confirm: null };
      const problem = g.placementProblem(this.aim.x, this.aim.z, this.buildType);
      const poor = g.gold < cost;
      const text = problem ?? (poor ? 'Not enough gold' : `Tap ✓ or the preview again to build for ${cost} gold`);
      return { kind: 'build', title: s.name, text, bad: !!(problem || poor), confirm: problem || poor ? 'off' : 'Build' };
    }
    if (this.spell && !SPELLS[this.spell].instant) return { kind: 'spell', title: SPELLS[this.spell].name, text: 'Tap the map to cast', confirm: null };
    return null;
  }

  private onKey(e: KeyboardEvent) {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'SELECT') return;
    if (this.ui.cineActive) {
      if (e.repeat) return;
      if (e.code === 'Escape') this.ui.cineSkip();
      else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.ui.cineNext();
      }
      return;
    }
    this.keys.add(e.code);
    const g = this.game;
    if (!g || this.finished) return;
    if (e.code === 'Escape' || e.code === 'KeyP') {
      e.preventDefault();
      if (e.repeat) return;
      if (e.code === 'Escape' && (this.buildType || this.spell || this.site)) {
        this.closeSite();
        this.buildType = null;
        this.spell = null;
      } else if (e.code === 'Escape' && this.selected && !this.paused) {
        this.selected = null;
      } else {
        this.togglePause();
      }
      return;
    }
    if (this.paused || e.repeat) return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.callWave();
        break;
      case 'KeyF': this.cycleSpeed(); break;
      case 'Backquote': this.openCheats(); break;
      case 'KeyV': this.useAbility(0); break;
      case 'KeyB': this.useAbility(1); break;
      case 'KeyN': this.useAbility(2); break;
      case 'KeyH': this.centerHero(); break;
      case 'Home': this.fitBattlefield(); break;
      case 'KeyR': {
        const t = this.selected;
        if (t && t.level !== 1) this.upgrade(t.branch);
        else if (t) this.flashHint('Choose a specialization in the tower panel', false);
        break;
      }
      case 'Delete':
      case 'Backspace':
        if (this.selected) this.sell();
        break;
      case 'KeyT': {
        const t = this.selected;
        if (t && !t.stats.aura && !t.stats.pulse && !t.stats.garrison) {
          const i = TARGET_MODES.findIndex((m) => m.id === t.mode);
          t.mode = TARGET_MODES[(i + 1) % TARGET_MODES.length].id;
        }
        break;
      }
      default: {
        for (const id of TOWER_ORDER) {
          if (e.code === `Digit${TOWERS[id].hotkey}` || e.code === `Numpad${TOWERS[id].hotkey}`) this.pickTower(id);
        }
        for (const id of SPELL_ORDER) {
          if (e.code === `Key${SPELLS[id].hotkey}`) this.pickSpell(id);
        }
      }
    }
  }

  /** Whether the pointer is over the lantern: within a short reach of the line from its base to its top on screen. */
  private pointerOnLantern() {
    const l = this.stage?.lanternPos;
    if (!l) return false;
    const a = this.project(l.x, l.y, l.z);
    const b = this.project(l.x, l.y + LANTERN_HP_HEIGHT - 1.5, l.z);
    if (!a.visible && !b.visible) return false;
    const px = this.pointer.x, py = this.pointer.y;
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((px - a.x) * dx + (py - a.y) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(px - (a.x + dx * t), py - (a.y + dy * t)) < 36;
  }

  /** Intersects the pointer ray with the terrain. */
  private pick(): { x: number; z: number } | null {
    const g = this.game;
    if (!g) return null;
    this.ndc.set((this.pointer.x / window.innerWidth) * 2 - 1, -(this.pointer.y / window.innerHeight) * 2 + 1);
    this.raycaster.setFromCamera(this.ndc, this.engine.camera);
    const ray = this.raycaster.ray;
    const w = g.world;
    this.rayDir.copy(ray.direction);
    const o = ray.origin;
    let t = 5;
    let prevT = t;
    for (let i = 0; i < 400; i++) {
      const x = o.x + this.rayDir.x * t;
      const y = o.y + this.rayDir.y * t;
      const z = o.z + this.rayDir.z * t;
      const inExt = Math.abs(x) < w.extW && Math.abs(z) < w.extH;
      const h = inExt ? Math.max(w.height(x, z), w.hasWater ? w.waterLevel : -100) : -100;
      if (y <= h) {
        let a = prevT, b = t;
        for (let k = 0; k < 8; k++) {
          const m = (a + b) / 2;
          const mx = o.x + this.rayDir.x * m, my = o.y + this.rayDir.y * m, mz = o.z + this.rayDir.z * m;
          const mh = Math.max(w.height(mx, mz), w.hasWater ? w.waterLevel : -100);
          if (my <= mh) b = m; else a = m;
        }
        return { x: o.x + this.rayDir.x * b, z: o.z + this.rayDir.z * b };
      }
      prevT = t;
      t += 1.2;
      if (y < -40) break;
    }
    return null;
  }

  private snap(v: number) {
    return Math.round(v * 2) / 2;
  }

  private leftClick(e: PointerEvent) {
    const g = this.game;
    if (!g || this.paused || this.finished) return;
    const hit = this.pick();
    if (this.site) {
      // A click away closes the picker, and selects the tower it lands on.
      this.closeSite();
      this.selected = this.towerUnderPointer();
      if (this.selected) audio.play('click');
      return;
    }
    if (this.buildType) {
      if (!hit) return;
      const x = this.snap(hit.x), z = this.snap(hit.z);
      const problem = g.canBuild(this.buildType, x, z);
      if (problem) {
        audio.play('error');
        this.flashHint(problem);
        return;
      }
      const built = g.build(this.buildType, x, z);
      if (built && !e.shiftKey) {
        this.buildType = null;
        this.selected = null;
      }
      return;
    }
    if (this.spell) {
      if (!hit) return;
      const id = this.spell;
      if (g.castSpell(id, hit.x, hit.z)) this.spell = null;
      else audio.play('error');
      return;
    }
    this.selectOrOpenSite(hit);
  }

  private rightClick() {
    const g = this.game;
    if (!g || this.paused || this.finished) return;
    if (this.buildType || this.spell || this.site) {
      this.closeSite();
      this.buildType = null;
      this.spell = null;
      return;
    }
    const hit = this.pick();
    if (hit) this.orderHeroAt(hit);
  }

  private orderHeroAt(hit: { x: number; z: number }) {
    const g = this.game!;
    if (!g.moveHero(hit.x, hit.z)) {
      audio.play('error');
      return;
    }
    this.heroOrdered = true;
    audio.play('order');
    buzz(10);
    const v = this.view!;
    v.rings.add(hit.x, g.world.height(hit.x, hit.z) + 0.4, hit.z, 1.5, new THREE.Color(1.2, 0.9, 0.35).multiplyScalar(2), 0.42);
  }

  private towerUnderPointer(): Tower | null {
    const g = this.game;
    if (!g || !this.view) return null;
    let best: Tower | null = null;
    let bestD = 46 * 46;
    for (const t of g.towers) {
      const v = this.view.towerViews.get(t.id);
      if (!v) continue;
      // Test against both the base and the top of the tower so tall models are easy to click.
      for (const k of [0.25, 0.65, 1]) {
        const s = this.project(t.x, v.y + v.model.height * k, t.z);
        if (!s.visible) continue;
        const d = (s.x - this.pointer.x) ** 2 + (s.y - this.pointer.y) ** 2;
        if (d < bestD) {
          bestD = d;
          best = t;
        }
      }
    }
    return best;
  }

  private hintTimer = 0;
  private flashHint(text: string, bad = true) {
    this.ui.hint(text, bad);
    this.hintTimer = 1.6;
  }

  private project = (x: number, y: number, z: number) => {
    const v = this.projectV.set(x, y, z).project(this.engine.camera);
    return { x: (v.x * 0.5 + 0.5) * window.innerWidth, y: (-v.y * 0.5 + 0.5) * window.innerHeight, visible: v.z < 1 };
  };

  // ---------- Frame ----------

  private updateCameraKeys(dt: number) {
    const rig = this.engine.rig;
    const k = this.keys;
    const speed = rig.dist * 0.75 * dt;
    let px = 0, pz = 0;
    if (k.has('KeyW') || k.has('ArrowUp')) pz -= speed;
    if (k.has('KeyS') || k.has('ArrowDown')) pz += speed;
    if (k.has('KeyA') || k.has('ArrowLeft')) px -= speed;
    if (k.has('KeyD') || k.has('ArrowRight')) px += speed;
    if (px || pz) rig.pan(px, pz);
    if (k.has('KeyQ')) rig.tYaw += dt * 1.4;
    if (k.has('KeyE')) rig.tYaw -= dt * 1.4;
  }

  private updateInteraction() {
    const g = this.game!;
    const v = this.view!;
    // With touch there is no hovering pointer, so previews sit where the player last tapped.
    const touch = isTouch();
    const hit = touch ? this.aim : this.pointer.inside ? this.pick() : null;
    if (this.selected && !g.towers.includes(this.selected)) this.selected = null;
    if (this.site && this.paused) this.closeSite();

    const site = this.site;
    const siteType = site ? this.buildType ?? this.hoverType : null;
    if (site && siteType) {
      // The tower picker previews the chosen (or hovered) tower and its range at the site.
      v.setBuildOverlay(1);
      const problem = g.canBuild(siteType, site.x, site.z);
      v.setGhost(siteType, site.x, site.z, !problem);
      v.setRangeRing(site.x, site.z, towerStats(siteType, 0, 0).range * (1 + g.rank('towerRange') * 0.03), problem ? 0xff5a4a : 0xffe2a0, 1);
    }
    else if (site) {
      // A small ring marks the spot the picker will build on.
      v.setBuildOverlay(1);
      v.setGhost(null, 0, 0, false);
      v.setRangeRing(site.x, site.z, 1.4, 0xffe2a0, 1);
    }
    if (site) {
      v.setTargetRing(0, 0, 0, 0xffffff, 0);
      if (this.hintTimer <= 0) this.ui.hint(null);
      return;
    }

    if (this.buildType) {
      v.setBuildOverlay(1);
      if (touch) {
        // The action bar explains placement problems, so the hint line only shows flashed messages.
        if (this.hintTimer <= 0) this.ui.hint(null);
      }
      if (hit) {
        const x = this.snap(hit.x), z = this.snap(hit.z);
        const problem = g.placementProblem(x, z, this.buildType);
        const poor = g.gold < g.costOf(towerStats(this.buildType, 0, 0));
        v.setGhost(this.buildType, x, z, !problem && !poor);
        v.setRangeRing(x, z, towerStats(this.buildType, 0, 0).range * (1 + g.rank('towerRange') * 0.03), problem || poor ? 0xff5a4a : 0xffe2a0, 1);
        if (touch || this.hintTimer > 0) { /* The action bar or a flashed hint covers this. */ }
        else if (problem) this.ui.hint(problem, true);
        else if (poor) this.ui.hint('Not enough gold', true);
        else this.ui.hint(null);
      } else {
        v.setGhost(null, 0, 0, false);
        v.setRangeRing(0, 0, 0, 0xffffff, 0);
      }
    } else {
      v.setBuildOverlay(0);
      v.setGhost(null, 0, 0, false);
      if (this.selected) {
        const t = this.selected;
        v.setRangeRing(t.x, t.z, t.range, t.stats.aura ? 0x6effc8 : 0xffe2a0, 0.85);
      } else {
        v.setRangeRing(0, 0, 0, 0xffffff, 0);
      }
      if (this.hintTimer <= 0) this.ui.hint(null);
    }
    if (this.spell && hit) {
      const color = SPELLS[this.spell].color;
      if (this.spell === 'guards') {
        const p = g.nearestRoadPoint(hit.x, hit.z);
        v.setTargetRing(p.x, p.z, 2.4, color, 1);
      } else {
        v.setTargetRing(hit.x, hit.z, g.spellRadius(this.spell), color, 1);
      }
    } else {
      v.setTargetRing(0, 0, 0, 0xffffff, 0);
    }
  }

  private noteNewEnemies() {
    const g = this.game!;
    const seen = this.save.data.seen;
    for (const e of g.enemies) {
      const id = e.def.id;
      if (!seen.includes(id)) {
        seen.push(id);
        this.save.write();
        this.ui.announceEnemy(id as EnemyId);
        break;
      }
    }
  }

  private checkEnd() {
    const g = this.game!;
    if (this.finished || g.state === 'playing') return;
    this.finished = true;
    this.save.clearBattle();
    this.closeSite();
    this.buildType = null;
    this.spell = null;
    this.selected = null;
    this.heroMode = false;
    this.aim = null;
    const won = g.state === 'won';
    audio.fanfare(won);
    const clearedBefore = this.save.cleared;
    let gained = 0;
    if (g.endless) gained = this.save.recordEndless(g.map.id, g.wavesCompleted);
    else if (won) gained = this.save.recordWin(g.map.id, g.difficulty, g.starsEarned());
    if (!won) this.engine.desat = 0.55;
    // The final moment plays in slow motion, with the camera closing in on what decided it.
    this.slowTime(won ? 0.16 : 0.3, 2.2);
    const rig = this.engine.rig;
    const lantern = this.stage!.lanternPos;
    if (won) {
      rig.tTarget.set(g.lastKill.x, 1, g.lastKill.z);
      this.view!.celebrate();
    } else {
      rig.tTarget.set(lantern.x, lantern.y + 2, lantern.z);
      this.view!.extinguish();
    }
    rig.tDist = Math.min(rig.tDist, 64);
    const clearedAfter = this.save.cleared;
    const unlocks: string[] = [];
    if (clearedAfter > clearedBefore) {
      for (const id of TOWER_ORDER) if (TOWERS[id].unlockAfter === clearedAfter) unlocks.push(TOWERS[id].name);
      for (const id of SPELL_ORDER) if (SPELLS[id].unlockAfter === clearedAfter) unlocks.push(SPELLS[id].name);
      if (clearedAfter === 1) unlocks.push('Endless Night');
      if (clearedAfter < MAPS.length) unlocks.push(MAPS[clearedAfter].name);
      if (unlocks.length) audio.play('unlock');
    }
    const next = g.map.index + 1 < MAPS.length ? MAPS[g.map.index + 1] : null;
    const results = () => this.ui.showEnd(g, won, gained, next, () => {
      this.ui.hideHud();
      this.startGame(next!, this.difficulty, false);
    }, unlocks);
    const finishedCampaign = won && !g.endless && !next && clearedBefore < MAPS.length;
    window.setTimeout(() => {
      if (this.game !== g) return;
      if (!finishedCampaign) {
        results();
        return;
      }
      rig.tTarget.set(lantern.x, lantern.y + 2, lantern.z);
      rig.tDist = 60;
      rig.tPitch = 0.55;
      const dur = this.ui.playCinematic(EPILOGUE, () => {
        this.ui.showCredits(() => {
          this.cine = null;
          results();
        });
      });
      this.cine = { t: 0, dur, road: null };
    }, won ? END_DELAY_WON : END_DELAY_LOST);
  }

  /** Saves the battle so a reload can resume it: as it stands between waves, or from the start of the current wave. */
  private persistBattle() {
    const g = this.game;
    if (!g || this.finished || g.state !== 'playing') return;
    const snap = g.betweenWaves ? g.serialize() : g.checkpoint;
    if (snap) this.save.writeBattle(snap);
  }

  private autosaveBattle(dt: number) {
    const g = this.game!;
    if (g.checkpoint !== this.savedCheckpoint) {
      // A wave was just called: keep the battle as it stood the moment before.
      this.savedCheckpoint = g.checkpoint;
      this.persistBattle();
      return;
    }
    this.battleSaveT -= dt;
    if (this.battleSaveT > 0 || !g.betweenWaves) return;
    this.battleSaveT = BATTLE_SAVE_INTERVAL;
    this.persistBattle();
  }

  /** Pauses everything while the browser has taken the graphics away, and rebuilds what it lost when they return. */
  private watchGraphics() {
    const canvas = this.engine.renderer.domElement;
    canvas.addEventListener('webglcontextlost', (e) => {
      // Without this the browser never offers the context back.
      e.preventDefault();
      if (this.gfxLost) return;
      this.gfxLost = true;
      this.persistBattle();
      audio.suspend(true);
      this.ui.showGfxLost(() => {
        this.persistBattle();
        location.reload();
      });
      clearTimeout(this.gfxTimer);
      this.gfxTimer = window.setTimeout(() => this.ui.gfxLostStalled(), GFX_RESTORE_WAIT_MS);
    });
    canvas.addEventListener('webglcontextrestored', () => {
      clearTimeout(this.gfxTimer);
      // three.js uploads meshes and textures again by itself. The baked sky lighting was drawn on the GPU, so redraw it.
      this.stage?.rebakeEnvironment(this.engine.renderer);
      this.governor.reset();
      this.gfxLost = false;
      this.last = performance.now();
      this.ui.hideGfxLost();
      audio.suspend(document.hidden);
      // Hand control back through the pause menu rather than dropping the player into a running battle.
      if (this.game && !this.finished && !this.paused && !this.cine) this.togglePause();
    });
  }

  private frame(now: number) {
    requestAnimationFrame((t) => this.frame(t));
    const rawDt = (now - this.last) / 1000;
    this.last = now;
    if (rawDt <= 0 || this.gfxLost) return;
    const dt = this.frameSmoother.next(rawDt);
    this.time += dt;
    shared.uTime.value = this.time;
    if (this.dilation < 1) this.dilation = Math.min(1, this.dilation + dt * this.dilationRate);

    const g = this.game;
    if (g && this.view) {
      if (this.cine) this.updateCinematicCamera(dt);
      else this.updateCameraKeys(dt);
      if (this.hintTimer > 0) this.hintTimer -= dt;
      if (!this.paused && !this.finished) {
        const speed = SPEEDS[this.speedIdx];
        const rate = speed * this.dilation;
        this.acc += dt * rate;
        g.timeScale = rate;
        let steps = 0;
        while (this.acc >= FIXED_DT && steps < 16) {
          g.step(FIXED_DT);
          this.acc -= FIXED_DT;
          steps++;
        }
        if (steps === 16) this.acc = 0;
        this.noteNewWave();
        this.noteNewEnemies();
        this.checkEnd();
        this.autosaveBattle(dt);
        const fighting = g.enemies.length > 0 || g.spawnQueue.length > 0;
        const bossHere = g.enemies.some((e) => e.def.boss);
        const desperate = fighting && (bossHere || g.lives / g.maxLives < 0.4 || (!g.endless && g.wave >= g.totalWaves));
        audio.setIntensity(desperate ? 2 : fighting ? 1 : 0);
      }
      this.updateInteraction();
      this.view.update(this.paused && !this.cine ? 0.0001 : dt * this.dilation, clamp(this.acc / FIXED_DT));
      this.ui.update(g, { selected: this.selected, speed: SPEEDS[this.speedIdx], buildType: this.buildType, spell: this.spell, heroOrdered: this.heroOrdered, upgraded: this.upgraded, heroMode: this.heroMode, action: this.paused ? null : this.actionBar(), picker: this.picker() });
      this.ui.updateFloats(dt, this.project);
      const lantern = this.stage!.lanternPos;
      this.ui.updateLanternHp(g, this.project(lantern.x, lantern.y + LANTERN_HP_HEIGHT, lantern.z));
    } else if (this.menuOrbit) {
      this.engine.rig.tYaw += dt * 0.035;
    }
    this.stage?.update(this.time);
    this.engine.render(dt, this.time);
    if (!this.revealed) {
      // The first frame compiles every shader, so the loading screen stays up until it has drawn.
      this.revealed = true;
      this.ui.hideLoading();
    }
    this.watchPerformance(Math.min(0.1, rawDt));
  }

  private watchPerformance(dt: number) {
    if (!this.save.data.settings.autoRes || document.hidden) return;
    const scale = this.governor.sample(dt, this.engine.renderScale, this.engine.rig.settled);
    if (scale !== null) this.engine.setRenderScale(scale);
  }
}

const tick = () => new Promise<void>((res) => setTimeout(res, 16));

function showFatal(message: string) {
  const el = document.createElement('div');
  el.className = 'fatal';
  el.innerHTML = `<h1>Lanternfall could not start</h1><p>${message}</p><p>This game needs a browser with WebGL 2 enabled, such as a current version of Chrome, Edge, or Firefox. If you are using one, check that hardware acceleration is turned on in the browser's settings.</p>`;
  document.body.appendChild(el);
  document.getElementById('loading')?.remove();
}

try {
  const app = new App();
  // A debugging handle, available only when previewing from the development server.
  if (location.hostname === 'localhost') Object.assign(window, { __lanternfall: app, __audio: audio });
  app.boot().catch((err) => {
    console.error(err);
    showFatal(String(err?.message ?? err));
  });
} catch (err) {
  console.error(err);
  showFatal(String((err as Error)?.message ?? err));
}
