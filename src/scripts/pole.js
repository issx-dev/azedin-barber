/**
 * Barber pole modelled on a real wall-mounted unit (proportions measured from
 * the product reference): domed chrome caps with a collar band where they
 * meet the glass, a clear glass tube, an inner drum carrying wide red / white /
 * blue bands, and a satin wall plate on the left joined by two short arms.
 *
 * Realism comes from the lighting, not the mesh count: chrome only looks like
 * chrome when it has something sharp to reflect, so the environment is a
 * small photo studio (tall strip boxes, an overhead softbox, a dim floor
 * bounce) baked into a PMREM. The glass is additive specular only — a black
 * dielectric drawn with additive blending contributes nothing but its
 * reflections and Fresnel edges, so the stripes behind it stay crisp.
 */
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  Mesh,
  CylinderGeometry,
  LatheGeometry,
  BoxGeometry,
  SphereGeometry,
  Vector2,
  Vector3,
  Box3,
  Color,
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  MeshStandardMaterial,
  MeshBasicMaterial,
  PMREMGenerator,
  NeutralToneMapping,
  BackSide,
  DoubleSide,
  AdditiveBlending,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const RED = '#C8102E';
const WHITE = '#F7F5EF';
const BLUE = '#1F3A93';

// Dimensions (scene units ≈ 1 per 100px of the reference photo).
// Caps ≈1.45× the tube, as on the reference unit.
const GLASS_R = 0.39;
const GLASS_H = 2.45;
// Close to the glass: at grazing angles a wider gap showed as dark seams at
// the tube's silhouette, which the real (backlit) unit never has.
const DRUM_R = 0.378;
const HALF = GLASS_H / 2;

/**
 * A white product studio, like the one the reference was shot in. Polished
 * chrome is a mirror: it reads as silver only if most of what it reflects is
 * bright. The dark vertical flags are what give chrome its characteristic
 * dark bands; the hot strips give the specular highlights. HDR values on
 * purpose.
 */
function studio() {
  const s = new Scene();
  s.add(new Mesh(new SphereGeometry(20, 32, 16), new MeshBasicMaterial({ color: new Color(0xffffff).multiplyScalar(0.78), side: BackSide })));
  const box = (w, h, d, x, y, z, k) => {
    const m = new Mesh(new BoxGeometry(w, h, d), new MeshBasicMaterial({ color: new Color(0xffffff).multiplyScalar(k) }));
    m.position.set(x, y, z);
    s.add(m);
  };
  // Hot strips: the bright vertical highlights.
  box(0.9, 16, 0.9, -4.5, 0, 5, 6);
  box(0.5, 16, 0.5, 5, 0, 3.5, 4);
  // Black flags: the dark bands that make chrome read as chrome.
  box(1.6, 16, 0.2, 2.2, 0, 6, 0.02);
  box(1.1, 16, 0.2, -7, 0, -1, 0.02);
  box(2.2, 16, 0.2, 0, 0, -8, 0.04);
  // Overhead softbox and a bright floor sweep, as on a seamless backdrop.
  box(10, 0.2, 8, 0, 8, 0, 2.2);
  box(18, 0.1, 18, 0, -8, 0, 1.1);
  return s;
}

/** Bands as a doubly periodic phase, so the tile has no seam around the drum. */
function stripeTexture() {
  const W = 512;
  const H = 512;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const img = g.createImageData(W, H);
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const cols = [rgb(RED), rgb(WHITE), rgb(BLUE), rgb(WHITE)];
  const soft = 0.006; // a hair of antialiasing between bands
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = (x / W + y / H) % 1;
      const k = Math.floor(t * 4);
      const local = t * 4 - k;
      const a = cols[k];
      const b = cols[(k + 1) % 4];
      const f = Math.max(0, Math.min(1, (local - (1 - soft * 4)) / (soft * 4)));
      const o = (y * W + x) * 4;
      img.data[o] = a[0] + (b[0] - a[0]) * f;
      img.data[o + 1] = a[1] + (b[1] - a[1]) * f;
      img.data[o + 2] = a[2] + (b[2] - a[2]) * f;
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  // One period around the drum (integer = seamless), ~1.25 along the visible
  // glass: wide bands at the reference's ~40° rake.
  t.repeat.set(1, 1.45);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Quarter-circle helper for lathe profiles. */
function arc(cx, cy, r, a0, a1, n = 10) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    out.push(new Vector2(cx + r * Math.cos(a), cy + r * Math.sin(a)));
  }
  return out;
}

/**
 * Cap profile, from the glass joint (y = 0) up: collar band, a step in, the
 * cap body with one fine groove, and a broad rounded dome.
 */
function capProfile() {
  return [
    new Vector2(0.37, 0.0),
    new Vector2(0.5, 0.0),
    new Vector2(0.552, 0.018),
    new Vector2(0.565, 0.06),
    new Vector2(0.565, 0.11),
    new Vector2(0.552, 0.148),
    new Vector2(0.522, 0.162),
    new Vector2(0.516, 0.18),
    new Vector2(0.516, 0.33),
    new Vector2(0.506, 0.344),
    new Vector2(0.516, 0.358),
    new Vector2(0.516, 0.5),
    ...arc(0.296, 0.5, 0.22, 0, Math.PI / 2, 14).slice(1),
    new Vector2(0.16, 0.728),
    new Vector2(0.0, 0.734),
  ];
}

export function mountPole(canvas, { speed = 0.22 } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(studio(), 0.015).texture;

  const chrome = new MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: 0.07, side: DoubleSide });
  const satin = new MeshStandardMaterial({ color: 0xe2e2e2, metalness: 1, roughness: 0.32 });

  const pole = new Group();

  // Inner drum: the bands, faintly self-lit like the real backlit tube.
  const tex = stripeTexture();
  pole.add(
    new Mesh(
      new CylinderGeometry(DRUM_R, DRUM_R, GLASS_H, 96, 1, true),
      new MeshStandardMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: 0xffffff,
        emissiveIntensity: 0.2,
        roughness: 0.62,
        metalness: 0,
        envMapIntensity: 0.38,
      })
    )
  );

  // Glass: reflections and Fresnel edges only.
  pole.add(
    new Mesh(
      new CylinderGeometry(GLASS_R, GLASS_R, GLASS_H, 96, 1, true),
      new MeshStandardMaterial({
        color: 0x000000,
        metalness: 0,
        roughness: 0.02,
        transparent: true,
        blending: AdditiveBlending,
        depthWrite: false,
        envMapIntensity: 0.55,
      })
    )
  );

  // Caps.
  const capGeo = new LatheGeometry(capProfile(), 96);
  const top = new Mesh(capGeo, chrome);
  top.position.y = HALF;
  pole.add(top);
  const bottom = new Mesh(capGeo, chrome);
  bottom.rotation.x = Math.PI;
  bottom.position.y = -HALF;
  pole.add(bottom);

  // Wall bracket on the left: satin plate + two polished arms.
  const plateX = -0.86;
  const plate = new Mesh(new RoundedBoxGeometry(0.06, 3.05, 0.3, 3, 0.02), satin);
  plate.position.set(plateX, 0, 0);
  pole.add(plate);
  const armLen = Math.abs(plateX) - 0.035 - 0.5;
  const armGeo = new CylinderGeometry(0.034, 0.034, armLen, 24);
  [HALF + 0.25, -(HALF + 0.25)].forEach((y) => {
    const a = new Mesh(armGeo, chrome);
    a.rotation.z = Math.PI / 2;
    a.position.set(plateX + 0.035 + armLen / 2, y, 0);
    pole.add(a);
  });

  // Three-quarter view so the plate's face and the arms read, as in the photo.
  pole.rotation.y = -0.55;
  // Centre the whole assembly (plate included) on the origin.
  const wrap = new Group();
  wrap.add(pole);
  const bb = new Box3().setFromObject(wrap);
  const centre = bb.getCenter(new Vector3());
  pole.position.sub(centre);
  const sizeV = bb.getSize(new Vector3());
  scene.add(wrap);

  const camera = new PerspectiveCamera(20, 1, 0.1, 60);

  function fit() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const f = Math.tan((camera.fov * Math.PI) / 360);
    const distH = sizeV.y / 2 / f;
    const distW = sizeV.x / 2 / (f * camera.aspect);
    camera.position.set(0, 0.15, Math.max(distH, distW) * 1.08 + sizeV.z / 2);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  let raf = 0;
  let last = 0;
  let running = false;
  function frame(t) {
    raf = requestAnimationFrame(frame);
    const dt = last ? Math.min(0.05, (t - last) / 1000) : 0;
    last = t;
    tex.offset.y -= dt * speed; // bands climb, like the motor-driven drum
    renderer.render(scene, camera);
  }

  fit();
  renderer.render(scene, camera);
  const ro = new ResizeObserver(() => {
    fit();
    if (!running) renderer.render(scene, camera);
  });
  ro.observe(canvas);

  return {
    start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    renderOnce: () => renderer.render(scene, camera),
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((o) => {
        o.geometry?.dispose();
        if (o.material) [].concat(o.material).forEach((m) => { m.map?.dispose(); m.dispose(); });
      });
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
