// GPU particle system, shockwave rings, energy ribbons, and health bars.
import * as THREE from 'three';

const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aVel;
  attribute vec4 aTime; // birth, life, sizeStart, sizeEnd
  attribute vec4 aColor;
  attribute vec2 aMotion; // gravity, drag
  uniform float uNow, uScale;
  varying vec4 vC;
  void main() {
    float t = uNow - aTime.x;
    float k = t / aTime.y;
    if (k < 0.0 || k > 1.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; vC = vec4(0.0); return; }
    float drag = aMotion.y > 0.0 ? (1.0 - exp(-aMotion.y * t)) / aMotion.y : t;
    vec3 p = position + aVel * drag + vec3(0.0, -aMotion.x * t * t * 0.5, 0.0);
    vec4 mv = viewMatrix * vec4(p, 1.0);
    gl_PointSize = mix(aTime.z, aTime.w, k) * uScale / -mv.z;
    gl_Position = projectionMatrix * mv;
    vC = aColor;
    vC.a *= smoothstep(0.0, 0.08, k) * (1.0 - k * k);
  }
`;
const PARTICLE_FRAG = /* glsl */ `
  uniform float uSoft;
  varying vec4 vC;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    float a = pow(1.0 - d, uSoft);
    gl_FragColor = vec4(vC.rgb, vC.a * a);
  }
`;

export interface EmitOpts {
  x: number; y: number; z: number;
  vx?: number; vy?: number; vz?: number;
  life: number;
  size: number;
  sizeEnd?: number;
  color: THREE.Color;
  alpha?: number;
  gravity?: number;
  drag?: number;
}

const STRIDE = 16;

export class Particles {
  mesh: THREE.Points;
  private data: Float32Array;
  private buffer: THREE.InterleavedBuffer;
  private head = 0;
  private dirtyFrom = -1;
  private dirtyTo = -1;
  private wrapped = false;
  mat: THREE.ShaderMaterial;
  now = 0;

  constructor(public capacity: number, additive: boolean, soft = 1.6) {
    this.data = new Float32Array(capacity * STRIDE);
    this.buffer = new THREE.InterleavedBuffer(this.data, STRIDE);
    this.buffer.setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.InterleavedBufferAttribute(this.buffer, 3, 0));
    geo.setAttribute('aVel', new THREE.InterleavedBufferAttribute(this.buffer, 3, 3));
    geo.setAttribute('aTime', new THREE.InterleavedBufferAttribute(this.buffer, 4, 6));
    geo.setAttribute('aColor', new THREE.InterleavedBufferAttribute(this.buffer, 4, 10));
    geo.setAttribute('aMotion', new THREE.InterleavedBufferAttribute(this.buffer, 2, 14));
    // Particles start "dead" until they are written.
    for (let i = 0; i < capacity; i++) this.data[i * STRIDE + 6] = -1e6;
    this.mat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { uNow: { value: 0 }, uScale: { value: 500 }, uSoft: { value: soft } },
    });
    this.mesh = new THREE.Points(geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 10;
  }

  emit(o: EmitOpts) {
    const i = this.head;
    const d = this.data;
    const k = i * STRIDE;
    d[k] = o.x; d[k + 1] = o.y; d[k + 2] = o.z;
    d[k + 3] = o.vx ?? 0; d[k + 4] = o.vy ?? 0; d[k + 5] = o.vz ?? 0;
    d[k + 6] = this.now; d[k + 7] = o.life; d[k + 8] = o.size; d[k + 9] = o.sizeEnd ?? o.size;
    d[k + 10] = o.color.r; d[k + 11] = o.color.g; d[k + 12] = o.color.b; d[k + 13] = o.alpha ?? 1;
    d[k + 14] = o.gravity ?? 0; d[k + 15] = o.drag ?? 0;
    if (this.dirtyFrom < 0) { this.dirtyFrom = i; this.dirtyTo = i; }
    else if (i < this.dirtyFrom) { this.wrapped = true; }
    else this.dirtyTo = Math.max(this.dirtyTo, i);
    this.head = (i + 1) % this.capacity;
  }

  update(now: number, scale: number) {
    this.now = now;
    this.mat.uniforms.uNow.value = now;
    this.mat.uniforms.uScale.value = scale;
    if (this.dirtyFrom >= 0) {
      this.buffer.clearUpdateRanges();
      if (!this.wrapped) this.buffer.addUpdateRange(this.dirtyFrom * STRIDE, (this.dirtyTo - this.dirtyFrom + 1) * STRIDE);
      this.buffer.needsUpdate = true;
      this.dirtyFrom = this.dirtyTo = -1;
      this.wrapped = false;
    }
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mat.dispose();
  }
}

const RING_VERT = /* glsl */ `
  attribute vec4 aParams; // birth, life, radius, thickness
  attribute vec3 aRingColor;
  uniform float uNow;
  varying vec2 vP; varying float vK; varying vec3 vC; varying float vT;
  void main() {
    float k = (uNow - aParams.x) / aParams.y;
    vK = k;
    vC = aRingColor;
    vT = aParams.w;
    vP = position.xz * 2.0;
    float grow = 1.0 - pow(1.0 - clamp(k, 0.0, 1.0), 2.4);
    vec3 p = position * aParams.z * 2.0 * grow;
    if (k < 0.0 || k > 1.0) p = vec3(0.0);
    vec4 w = instanceMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const RING_FRAG = /* glsl */ `
  varying vec2 vP; varying float vK; varying vec3 vC; varying float vT;
  void main() {
    float r = length(vP);
    if (r > 1.0) discard;
    float th = vT * (1.0 - vK * 0.5);
    float band = smoothstep(1.0 - th, 1.0 - th * 0.25, r) * (1.0 - smoothstep(0.965, 1.0, r));
    float inner = (1.0 - r) * 0.1;
    gl_FragColor = vec4(vC, (band + inner) * (1.0 - vK) * (1.0 - vK));
  }
`;

export class Rings {
  mesh: THREE.InstancedMesh;
  private params: THREE.InstancedBufferAttribute;
  private colors: THREE.InstancedBufferAttribute;
  private head = 0;
  private m = new THREE.Matrix4();
  private mat: THREE.ShaderMaterial;
  now = 0;

  constructor(private capacity = 96) {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    this.params = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 4).fill(-100), 4);
    this.colors = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    this.params.setUsage(THREE.DynamicDrawUsage);
    this.colors.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aParams', this.params);
    geo.setAttribute('aRingColor', this.colors);
    this.mat = new THREE.ShaderMaterial({
      vertexShader: RING_VERT,
      fragmentShader: RING_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      uniforms: { uNow: { value: 0 } },
    });
    this.mesh = new THREE.InstancedMesh(geo, this.mat, capacity);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 9;
  }

  add(x: number, y: number, z: number, radius: number, color: THREE.Color, life = 0.55, thickness = 0.22) {
    const i = this.head;
    this.head = (i + 1) % this.capacity;
    this.params.setXYZW(i, this.now, life, radius, thickness);
    this.colors.setXYZ(i, color.r, color.g, color.b);
    this.m.makeTranslation(x, y, z);
    this.mesh.setMatrixAt(i, this.m);
    this.mesh.instanceMatrix.needsUpdate = true;
    this.params.needsUpdate = true;
    this.colors.needsUpdate = true;
  }

  update(now: number) {
    this.now = now;
    this.mat.uniforms.uNow.value = now;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mat.dispose();
    this.mesh.dispose();
  }
}

const RIBBON_VERT = /* glsl */ `
  attribute vec4 aColor;
  attribute float aAcross;
  varying vec4 vC; varying float vA;
  void main() {
    vC = aColor; vA = aAcross;
    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  }
`;
const RIBBON_FRAG = /* glsl */ `
  varying vec4 vC; varying float vA;
  void main() {
    float d = abs(vA);
    float core = pow(1.0 - d, 2.4);
    gl_FragColor = vec4(vC.rgb * (1.0 + core * 2.0), vC.a * core);
  }
`;

interface Ribbon { pts: THREE.Vector3[]; width: number; color: THREE.Color; t: number; life: number }

/** Camera-facing energy strips, used for lightning and beams. */
export class Ribbons {
  mesh: THREE.Mesh;
  private pos: Float32Array;
  private col: Float32Array;
  private across: Float32Array;
  private geo: THREE.BufferGeometry;
  private active: Ribbon[] = [];
  private oneFrame: Ribbon[] = [];
  private oneFrameN = 0;
  private mat: THREE.ShaderMaterial;
  private a = new THREE.Vector3();
  private b = new THREE.Vector3();
  private side = new THREE.Vector3();
  private view = new THREE.Vector3();

  constructor(private maxSegs = 1400) {
    this.pos = new Float32Array(maxSegs * 18);
    this.col = new Float32Array(maxSegs * 24);
    this.across = new Float32Array(maxSegs * 6);
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aAcross', new THREE.BufferAttribute(this.across, 1).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      vertexShader: RIBBON_VERT,
      fragmentShader: RIBBON_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 11;
  }

  add(pts: THREE.Vector3[], width: number, color: THREE.Color, life: number) {
    this.active.push({ pts, width, color, t: 0, life });
  }

  /** A strip that only exists for the current frame (continuous beams). */
  frame(pts: THREE.Vector3[], width: number, color: THREE.Color) {
    const r = this.oneFrame[this.oneFrameN];
    if (r) {
      r.pts = pts;
      r.width = width;
      r.color = color;
    } else {
      this.oneFrame.push({ pts, width, color, t: 0, life: 1 });
    }
    this.oneFrameN++;
  }

  update(dt: number, camera: THREE.Camera) {
    let seg = 0;
    const write = (r: Ribbon, alpha: number) => {
      const { pts } = r;
      for (let i = 0; i < pts.length - 1 && seg < this.maxSegs; i++) {
        this.a.copy(pts[i]);
        this.b.copy(pts[i + 1]);
        this.view.subVectors(camera.position, this.a);
        this.side.subVectors(this.b, this.a).cross(this.view).normalize().multiplyScalar(r.width);
        const p = this.pos;
        const k = seg * 18;
        p[k] = this.a.x + this.side.x; p[k + 1] = this.a.y + this.side.y; p[k + 2] = this.a.z + this.side.z;
        p[k + 3] = this.a.x - this.side.x; p[k + 4] = this.a.y - this.side.y; p[k + 5] = this.a.z - this.side.z;
        p[k + 6] = this.b.x + this.side.x; p[k + 7] = this.b.y + this.side.y; p[k + 8] = this.b.z + this.side.z;
        p[k + 9] = this.b.x + this.side.x; p[k + 10] = this.b.y + this.side.y; p[k + 11] = this.b.z + this.side.z;
        p[k + 12] = this.a.x - this.side.x; p[k + 13] = this.a.y - this.side.y; p[k + 14] = this.a.z - this.side.z;
        p[k + 15] = this.b.x - this.side.x; p[k + 16] = this.b.y - this.side.y; p[k + 17] = this.b.z - this.side.z;
        const ac = this.across;
        const ak = seg * 6;
        ac[ak] = 1; ac[ak + 1] = -1; ac[ak + 2] = 1; ac[ak + 3] = 1; ac[ak + 4] = -1; ac[ak + 5] = -1;
        const ck = seg * 24;
        for (let v = 0; v < 6; v++) {
          this.col[ck + v * 4] = r.color.r;
          this.col[ck + v * 4 + 1] = r.color.g;
          this.col[ck + v * 4 + 2] = r.color.b;
          this.col[ck + v * 4 + 3] = alpha;
        }
        seg++;
      }
    };
    for (let i = this.active.length - 1; i >= 0; i--) {
      const r = this.active[i];
      r.t += dt;
      if (r.t >= r.life) {
        this.active.splice(i, 1);
        continue;
      }
      write(r, 1 - r.t / r.life);
    }
    for (let i = 0; i < this.oneFrameN; i++) write(this.oneFrame[i], 1);
    this.oneFrameN = 0;
    this.geo.setDrawRange(0, seg * 6);
    (this.geo.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.getAttribute('aColor') as THREE.BufferAttribute).needsUpdate = true;
    (this.geo.getAttribute('aAcross') as THREE.BufferAttribute).needsUpdate = true;
  }

  dispose() {
    this.geo.dispose();
    this.mat.dispose();
  }
}

// Life bars keep a fixed size on screen, so they stay readable when the camera is zoomed out.
const BAR_VERT = /* glsl */ `
  attribute vec3 aBar; // value, width, kind (0 enemy, 1 elite or hero, 2 soldier, 3 boss)
  uniform vec2 uView; // canvas size in CSS pixels
  varying vec2 vUv; varying vec3 vBar; varying vec2 vPx;
  void main() {
    vUv = uv; vBar = aBar;
    vPx = aBar.z > 2.5 ? vec2(96.0, 10.0) : vec2(aBar.y * 22.0, 5.0);
    vec4 c = projectionMatrix * viewMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
    c.xy += position.xy * vPx * 2.0 / uView * c.w;
    c.z -= 0.0015 * c.w;
    gl_Position = c;
  }
`;
const BAR_FRAG = /* glsl */ `
  varying vec2 vUv; varying vec3 vBar; varying vec2 vPx;
  void main() {
    // A one-pixel dark outline, measured in screen pixels.
    vec2 edge = (0.5 - abs(vUv - 0.5)) * vPx;
    float border = step(min(edge.x, edge.y), 1.0);
    vec3 full = vBar.z > 2.5 ? mix(vec3(0.62, 0.22, 1.1), vec3(1.35, 0.35, 1.15), vUv.x) : vBar.z > 1.5 ? vec3(0.45, 0.75, 1.2) : vBar.z > 0.5 ? vec3(1.3, 0.92, 0.3) : mix(vec3(1.25, 0.2, 0.14), vec3(0.42, 1.05, 0.28), smoothstep(0.2, 0.62, vBar.x));
    vec3 col = vUv.x < vBar.x ? full : vec3(0.05, 0.03, 0.07);
    if (border > 0.0) col = vec3(0.03, 0.02, 0.04);
    gl_FragColor = vec4(col, 0.94);
  }
`;

export class HealthBars {
  mesh: THREE.InstancedMesh;
  private attr: THREE.InstancedBufferAttribute;
  private mat: THREE.ShaderMaterial;
  private n = 0;
  private m = new THREE.Matrix4();

  constructor(private capacity = 500) {
    const geo = new THREE.PlaneGeometry(1, 1);
    this.attr = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3), 3);
    this.attr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aBar', this.attr);
    this.mat = new THREE.ShaderMaterial({ uniforms: { uView: { value: new THREE.Vector2(1280, 720) } }, vertexShader: BAR_VERT, fragmentShader: BAR_FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    this.mesh = new THREE.InstancedMesh(geo, this.mat, capacity);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 20;
  }

  begin() {
    this.n = 0;
  }

  add(x: number, y: number, z: number, value: number, width: number, kind = 0) {
    if (this.n >= this.capacity) return;
    this.m.makeTranslation(x, y, z);
    this.mesh.setMatrixAt(this.n, this.m);
    this.attr.setXYZ(this.n, value, width, kind);
    this.n++;
  }

  end() {
    (this.mat.uniforms.uView.value as THREE.Vector2).set(Math.max(1, innerWidth), Math.max(1, innerHeight));
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.attr.needsUpdate = true;
  }

  dispose() {
    this.mesh.geometry.dispose();
    this.mat.dispose();
    this.mesh.dispose();
  }
}
