// Renders the game's real 3D models into icon images for the UI, so the HUD always matches the game.
import * as THREE from 'three';
import { ENEMIES, type EnemyId } from '../data/enemies';
import { HERO_ORDER, type HeroId } from '../data/meta';
import { TOWER_ORDER, type TowerId } from '../data/towers';
import { enemyRig, getHeroGeo } from './creature-models';
import { Mats } from './materials';
import { towerModel } from './towers-models';

const portraits = new Map<string, string>();

export const towerPortrait = (t: TowerId, level: number, branch: number) => portraits.get(`t:${t}:${level}:${level >= 2 ? branch : 0}`) ?? '';
export const enemyPortrait = (id: EnemyId) => portraits.get(`e:${id}`) ?? '';
export const heroPortrait = (id: HeroId) => portraits.get(`hero:${id}`) ?? '';

export async function renderPortraits(onProgress: (k: number) => void) {
  const size = 192;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  r.setSize(size, size, false);
  r.setClearColor(0, 0);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.02;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x6a5a40, 2.1));
  const sun = new THREE.DirectionalLight(0xffe6c0, 3.6);
  sun.position.set(-3, 5, 4);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9fb8ff, 1.2);
  fill.position.set(4, 2, -3);
  scene.add(fill);
  const cam = new THREE.PerspectiveCamera(24, 1, 0.1, 100);
  const holder = new THREE.Group();
  scene.add(holder);

  const shoot = (key: string, yaw = -0.5, pitch = 0.32, zoom = 1) => {
    const box = new THREE.Box3().setFromObject(holder);
    const center = box.getCenter(new THREE.Vector3());
    const radius = box.getSize(new THREE.Vector3()).length() * 0.5;
    const dist = (radius / Math.tan((12 * Math.PI) / 180)) * 0.92 * zoom;
    cam.position.set(center.x + Math.sin(yaw) * Math.cos(pitch) * dist, center.y + Math.sin(pitch) * dist, center.z + Math.cos(yaw) * Math.cos(pitch) * dist);
    cam.lookAt(center);
    r.render(scene, cam);
    portraits.set(key, canvas.toDataURL('image/png'));
    holder.clear();
  };

  const jobs: (() => void)[] = [];
  for (const t of TOWER_ORDER) {
    const variants: [number, number][] = [[0, 0], [1, 0], [2, 0], [3, 0], [2, 1], [3, 1]];
    for (const [level, branch] of variants) {
      jobs.push(() => {
        const m = towerModel(t, level, branch);
        holder.add(new THREE.Mesh(m.base, Mats.std));
        if (m.metal) holder.add(new THREE.Mesh(m.metal, Mats.metal));
        if (m.glow) holder.add(new THREE.Mesh(m.glow, Mats.glow));
        if (m.head) { const h = new THREE.Mesh(m.head, Mats.std); h.position.y = m.headY; h.rotation.y = -0.6; holder.add(h); }
        if (m.headGlow) { const h = new THREE.Mesh(m.headGlow, Mats.glow); h.position.y = m.headY; h.rotation.y = -0.6; holder.add(h); }
        if (m.orbit) { const o = new THREE.Mesh(m.orbit, Mats.glow); o.position.y = m.orbitY; holder.add(o); }
        shoot(`t:${t}:${level}:${branch}`);
      });
    }
  }
  for (const id of Object.keys(ENEMIES) as EnemyId[]) {
    jobs.push(() => {
      const rig = enemyRig(id);
      for (const p of rig.parts) {
        const mesh = new THREE.Mesh(p.geo, p.glow ? Mats.glow : Mats.std);
        mesh.position.set(p.pivot[0], p.pivot[1], p.pivot[2]);
        holder.add(mesh);
      }
      holder.updateMatrixWorld(true);
      shoot(`e:${id}`, 0.5, 0.26, 0.85);
    });
  }
  for (const heroId of HERO_ORDER) jobs.push(() => {
    const g = getHeroGeo(heroId);
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, rx = 0) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x, y, 0);
      m.rotation.x = rx;
      holder.add(m);
    };
    add(g.body, Mats.std);
    add(g.head, Mats.std, 0, 1.68);
    add(g.armR, Mats.std, 0.56, 1.48, 0.2);
    add(g.armL, Mats.std, -0.56, 1.48);
    add(g.glowArm, Mats.glow, -0.56, 1.48);
    add(g.legL, Mats.std, -0.2, 0.58);
    add(g.legR, Mats.std, 0.2, 0.58);
    shoot(`hero:${heroId}`, -0.35, 0.16, 0.8);
  });

  for (let i = 0; i < jobs.length; i++) {
    jobs[i]();
    if (i % 6 === 5) {
      onProgress(i / jobs.length);
      await new Promise((res) => setTimeout(res));
    }
  }
  r.dispose();
  r.forceContextLoss();
}
