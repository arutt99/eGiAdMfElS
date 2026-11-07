// Renderer, post-processing chain, and camera rig.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { clamp } from '../core/util';
import type { Biome } from './biomes';
import { inkShared, Mats } from './materials';
import { INK } from './style';

export type QualityId = 'low' | 'medium' | 'high' | 'ultra';

export interface Quality {
  label: string;
  dpr: number;
  shadow: number;
  msaa: number;
  tilt: boolean;
  painterly: boolean;
  grass: number;
  terrainStep: number;
  particles: number;
  rays: boolean;
  ambient: number;
}

export const QUALITY: Record<QualityId, Quality> = {
  low: { label: 'Low', dpr: 1, shadow: 1024, msaa: 0, tilt: false, painterly: false, grass: 5000, terrainStep: 1, particles: 5000, rays: false, ambient: 0.4 },
  medium: { label: 'Medium', dpr: 1.25, shadow: 2048, msaa: 2, tilt: true, painterly: false, grass: 20000, terrainStep: 0.5, particles: 9000, rays: true, ambient: 0.7 },
  high: { label: 'High', dpr: 1.25, shadow: 3072, msaa: 4, tilt: true, painterly: true, grass: 48000, terrainStep: 0.5, particles: 14000, rays: true, ambient: 1 },
  ultra: { label: 'Ultra', dpr: 2, shadow: 4096, msaa: 4, tilt: true, painterly: true, grass: 90000, terrainStep: 0.5, particles: 20000, rays: true, ambient: 1.4 },
};

// Removes invalid and extreme HDR values, which the bloom blur would otherwise spread across the whole frame.
const SanitizeShader = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; varying vec2 vUv;
    float fix(float v) { return (v == v && v < 1e6) ? clamp(v, 0.0, 24.0) : 0.0; }
    void main() { vec4 c = texture2D(tDiffuse, vUv); gl_FragColor = vec4(fix(c.r), fix(c.g), fix(c.b), 1.0); }
  `,
};

const PaintShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTexel: { value: new THREE.Vector2() },
    uRadius: { value: 2.2 },
    uAmt: { value: 0.8 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    // Anisotropy-free four-sector Kuwahara filter: flattens detail into brush-like patches.
    uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform float uRadius; uniform float uAmt;
    varying vec2 vUv;
    void sector(vec2 dir, inout float bestV, inout vec3 best) {
      vec3 m = vec3(0.0); vec3 s = vec3(0.0);
      for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
          vec2 o = vec2(float(i), float(j)) * 0.5 * uRadius * dir * uTexel;
          vec3 c = min(texture2D(tDiffuse, vUv + o).rgb, vec3(3.0));
          m += c; s += c * c;
        }
      }
      m /= 9.0; s = s / 9.0 - m * m;
      float v = s.r + s.g + s.b;
      if (v < bestV) { bestV = v; best = m; }
    }
    void main() {
      vec4 src = texture2D(tDiffuse, vUv);
      float bestV = 1e9; vec3 best = src.rgb;
      sector(vec2(-1.0, -1.0), bestV, best);
      sector(vec2( 1.0, -1.0), bestV, best);
      sector(vec2(-1.0,  1.0), bestV, best);
      sector(vec2( 1.0,  1.0), bestV, best);
      // Bright magic keeps its full HDR energy for bloom.
      float keep = smoothstep(1.2, 2.6, max(src.r, max(src.g, src.b)));
      gl_FragColor = vec4(mix(src.rgb, mix(src.rgb, best, uAmt), 1.0 - keep), src.a);
    }
  `,
};

const FinalShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTexel: { value: new THREE.Vector2() },
    uTilt: { value: 1 },
    uLift: { value: new THREE.Vector3() },
    uGain: { value: new THREE.Vector3(1, 1, 1) },
    uSat: { value: 1.1 },
    uVignette: { value: 0.32 },
    uTime: { value: 0 },
    uFade: { value: 0 },
    uDesat: { value: 0 },
  },
  vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform float uTilt, uSat, uVignette, uTime, uFade, uDesat;
    uniform vec3 uLift, uGain;
    varying vec2 vUv;
    float rnd(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      // Tilt-shift gives the battlefield the feel of a handcrafted miniature.
      float tilt = smoothstep(0.2, 0.62, abs(vUv.y - 0.5)) * uTilt * 5.5;
      if (tilt > 0.05) {
        vec3 sum = c;
        for (int i = 0; i < 8; i++) {
          float a = float(i) * 0.7854;
          sum += texture2D(tDiffuse, vUv + vec2(cos(a), sin(a)) * tilt * uTexel).rgb;
          sum += texture2D(tDiffuse, vUv + vec2(cos(a + 0.39), sin(a + 0.39)) * tilt * 0.5 * uTexel).rgb;
        }
        c = sum / 17.0;
      }
      c = c * uGain + uLift;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      c = mix(vec3(l), c, uSat * (1.0 - uDesat));
      vec2 q = vUv - 0.5;
      float v = 1.0 - dot(q, q) * 2.0 * uVignette * 2.0;
      c *= clamp(v, 0.0, 1.0);
      c += (rnd(vUv * 913.0 + uTime) - 0.5) * 0.006 * (l + 0.1);
      c *= 1.0 - uFade;
      gl_FragColor = vec4(max(c, 0.0), 1.0);
    }
  `,
};

/** Layered sines: looks random, but moves smoothly and the same at any frame rate. */
function shakeWave(t: number, seed: number) {
  return Math.sin(t * 47 + seed) * 0.5 + Math.sin(t * 73 + seed * 1.7) * 0.3 + Math.sin(t * 113 + seed * 2.3) * 0.2;
}

export class CameraRig {
  target = new THREE.Vector3(0, 1, 0);
  yaw = 0;
  pitch = 0.92;
  dist = 96;
  tTarget = new THREE.Vector3(0, 1, 0);
  tYaw = 0;
  tPitch = 0.92;
  tDist = 96;
  minDist = 26;
  maxDist = 140;
  boundsX = 50;
  boundsZ = 34;
  shake = 0;
  private shakeV = new THREE.Vector3();
  private shakeT = 0;

  constructor(public camera: THREE.PerspectiveCamera) {}

  snap() {
    this.target.copy(this.tTarget);
    this.yaw = this.tYaw;
    this.pitch = this.tPitch;
    this.dist = this.tDist;
  }

  pan(dx: number, dz: number) {
    // Screen-space motion mapped through the camera's current heading.
    const c = Math.cos(this.yaw), s = Math.sin(this.yaw);
    this.tTarget.x = clamp(this.tTarget.x + dx * c + dz * s, -this.boundsX, this.boundsX);
    this.tTarget.z = clamp(this.tTarget.z - dx * s + dz * c, -this.boundsZ, this.boundsZ);
  }

  zoom(factor: number) {
    this.tDist = clamp(this.tDist * factor, this.minDist, this.maxDist);
  }

  /** True while the camera is at rest, when a resolution change is least noticeable. */
  get settled() {
    return this.shake === 0
      && this.target.distanceToSquared(this.tTarget) < 0.01
      && Math.abs(this.dist - this.tDist) < 0.1
      && Math.abs(this.yaw - this.tYaw) < 0.01;
  }

  update(dt: number) {
    const k = 1 - Math.exp(-dt * 9);
    this.target.lerp(this.tTarget, k);
    this.yaw += (this.tYaw - this.yaw) * k;
    this.dist += (this.tDist - this.dist) * k;
    // Closer zoom lowers the camera for a more cinematic angle.
    const zoomT = clamp((this.dist - this.minDist) / (70 - this.minDist));
    const autoPitch = this.tPitch * (0.68 + 0.32 * zoomT);
    this.pitch += (autoPitch - this.pitch) * k;
    this.shake = Math.max(0, this.shake - dt * 2.4);
    const sh = this.shake * this.shake;
    this.shakeT += dt;
    this.shakeV.set(shakeWave(this.shakeT, 0) * sh * 1.2, shakeWave(this.shakeT, 2.1) * sh * 0.85, shakeWave(this.shakeT, 4.3) * sh * 1.2);
    const cp = Math.cos(this.pitch);
    this.camera.position.set(
      this.target.x + Math.sin(this.yaw) * cp * this.dist + this.shakeV.x,
      this.target.y + Math.sin(this.pitch) * this.dist + this.shakeV.y,
      this.target.z + Math.cos(this.yaw) * cp * this.dist + this.shakeV.z,
    );
    this.camera.lookAt(this.target.x + this.shakeV.x * 0.5, this.target.y, this.target.z + this.shakeV.z * 0.5);
  }
}

export class Engine {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  rig: CameraRig;
  composer!: EffectComposer;
  scene: THREE.Scene = new THREE.Scene();
  qualityId: QualityId = 'high';
  quality: Quality = QUALITY.high;
  renderScale = 1;
  painterlyOn = true;
  tiltOn = true;
  private renderPass!: RenderPass;
  private paintPass!: ShaderPass;
  private bloomPass!: UnrealBloomPass;
  private finalPass!: ShaderPass;
  private fade = 0;
  private fadeTarget = 0;
  desat = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', stencil: false });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    if (INK) {
      // The outline shell has no use in the shadow map, so shadows draw each mesh once.
      const shadows = this.renderer.shadowMap;
      const renderShadows = shadows.render;
      shadows.render = (...args: Parameters<typeof renderShadows>) => {
        Mats.outline.visible = Mats.outlineFoliage.visible = false;
        renderShadows.apply(shadows, args);
        Mats.outline.visible = Mats.outlineFoliage.visible = true;
      };
    }
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.camera = new THREE.PerspectiveCamera(30, 1, 2, 1600);
    this.rig = new CameraRig(this.camera);
    this.buildComposer();
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  private buildComposer() {
    const size = this.renderer.getDrawingBufferSize(new THREE.Vector2());
    const target = new THREE.WebGLRenderTarget(Math.max(1, size.x), Math.max(1, size.y), {
      type: THREE.HalfFloatType,
      samples: this.quality.msaa,
    });
    this.composer?.dispose();
    this.composer = new EffectComposer(this.renderer, target);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.paintPass = new ShaderPass(PaintShader);
    this.bloomPass = new UnrealBloomPass(new THREE.Vector2(size.x, size.y), INK ? 0.24 : 0.42, INK ? 0.5 : 0.72, INK ? 1.2 : 1.02);
    this.finalPass = new ShaderPass(FinalShader);
    const output = new OutputPass();
    this.composer.addPass(this.renderPass);
    this.composer.addPass(new ShaderPass(SanitizeShader));
    this.composer.addPass(this.paintPass);
    this.composer.addPass(this.bloomPass);
    this.composer.addPass(this.finalPass);
    this.composer.addPass(output);
    this.applyToggles();
  }

  private applyToggles() {
    this.paintPass.enabled = !INK && this.quality.painterly && this.painterlyOn;
    this.finalPass.uniforms.uTilt.value = !INK && this.quality.tilt && this.tiltOn ? 1 : 0;
  }

  setQuality(id: QualityId) {
    this.qualityId = id;
    this.quality = QUALITY[id];
    this.renderScale = 1;
    this.buildComposer();
    this.resize();
  }

  setToggles(painterly: boolean, tilt: boolean) {
    this.painterlyOn = painterly;
    this.tiltOn = tilt;
    this.applyToggles();
  }

  setScene(scene: THREE.Scene, biome: Biome) {
    this.scene = scene;
    this.renderPass.scene = scene;
    const g = biome.grade;
    this.finalPass.uniforms.uLift.value.set(...g.lift);
    this.finalPass.uniforms.uGain.value.set(...g.gain);
    this.finalPass.uniforms.uSat.value = g.sat;
  }

  /** Scales rendering resolution, used by automatic performance adjustment. */
  setRenderScale(s: number) {
    this.renderScale = s;
    this.resize();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality.dpr) * this.renderScale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(w, h);
    const texel = 1 / (w * dpr);
    const texelY = 1 / (h * dpr);
    this.paintPass.uniforms.uTexel.value.set(texel, texelY);
    this.finalPass.uniforms.uTexel.value.set(texel, texelY);
    this.paintPass.uniforms.uRadius.value = 2.4 * Math.max(1, dpr * 0.8);
    this.camera.aspect = w / h;
    inkShared.uAspect.value = w / h;
    // Keep the whole map in view on narrower windows.
    this.camera.fov = w / h < 1.6 ? 30 * (1.6 / (w / h)) : 30;
    this.camera.updateProjectionMatrix();
  }

  fadeTo(v: number) {
    this.fadeTarget = v;
  }

  render(dt: number, time: number) {
    this.rig.update(dt);
    this.fade += (this.fadeTarget - this.fade) * (1 - Math.exp(-dt * 7));
    const u = this.finalPass.uniforms;
    u.uFade.value = this.fade;
    u.uTime.value = time % 10;
    u.uDesat.value = this.desat;
    this.composer.render(dt);
  }
}
