/**
 * Photoreal barber pole, built the way a real one is built:
 *   - an inner drum carrying the red/white/blue helix (a canvas texture whose
 *     offset scrolls, so the stripes "climb" exactly like the motor-driven one),
 *   - a clear glass sleeve over it (MeshPhysicalMaterial transmission),
 *   - polished chrome caps and a domed finial, turned on a lathe profile,
 *   - a wall bracket, because the real one is mounted to the façade.
 * Lit by a RoomEnvironment PMREM so chrome and glass have something real to
 * reflect. No external assets: everything is generated, so it costs 0 network
 * requests beyond the three.js chunk.
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
  Vector2,
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  PMREMGenerator,
  NeutralToneMapping,
  DirectionalLight,
  AmbientLight,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Colours sampled from the pole on the shop's façade.
const RED = '#C2272D';
const WHITE = '#F3F0E6';
const BLUE = '#26408F';

function stripeTexture() {
  // Built per pixel from phase = (x/W + y/H) mod 1. Because the phase is
  // periodic in BOTH axes with integer periods, the tile repeats with no seam
  // around the drum (u) or along it (v) — a rotated-rectangle drawing does
  // not, and showed hard cuts where tiles met.
  const W = 256;
  const H = 256;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const img = g.createImageData(W, H);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r, w, b] = [hex(RED), hex(WHITE), hex(BLUE)];
  // One period: red | white | blue | white, with a 1.5% soft edge so the
  // bands do not alias when the drum turns.
  const bands = [
    [0.0, r],
    [0.25, w],
    [0.5, b],
    [0.75, w],
  ];
  const soft = 0.015;
  const colourAt = (t) => {
    for (let k = 0; k < bands.length; k++) {
      const [s0, col] = bands[k];
      const s1 = k + 1 < bands.length ? bands[k + 1][0] : 1;
      if (t >= s0 && t < s1) {
        const next = bands[(k + 1) % bands.length][1];
        const f = Math.max(0, Math.min(1, (t - (s1 - soft)) / soft));
        return col.map((v, i) => v + (next[i] - v) * f);
      }
    }
    return w;
  };
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = (x / W + y / H) % 1;
      const [cr, cg, cb] = colourAt(t);
      const o = (y * W + x) * 4;
      img.data[o] = cr;
      img.data[o + 1] = cg;
      img.data[o + 2] = cb;
      img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  // 2 bands around the drum, 3 turns along it: the classic ~45° helix for a
  // 0.24 radius, 2.4 tall drum.
  t.repeat.set(2, 3);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Lathe profile for a cap: a turned chrome collar with a rounded lip. */
function capProfile(dome) {
  const p = [];
  if (dome) {
    // Finial: collar, neck, then a hemisphere.
    p.push(new Vector2(0, 0), new Vector2(0.34, 0), new Vector2(0.36, 0.04), new Vector2(0.36, 0.16));
    p.push(new Vector2(0.3, 0.2), new Vector2(0.22, 0.24));
    for (let a = 0; a <= 16; a++) {
      const t = (a / 16) * (Math.PI / 2);
      p.push(new Vector2(0.22 * Math.cos(t), 0.24 + 0.22 * Math.sin(t)));
    }
  } else {
    p.push(new Vector2(0, 0), new Vector2(0.3, 0), new Vector2(0.36, 0.03), new Vector2(0.37, 0.09));
    p.push(new Vector2(0.36, 0.15), new Vector2(0.32, 0.18), new Vector2(0, 0.18));
  }
  return p;
}

export function mountPole(canvas, { speed = 0.25 } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  // Khronos PBR Neutral keeps hue and saturation; ACES washed the red to pink
  // and the blue to sky. The pole's colours are the point, so they must hold.
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new PerspectiveCamera(22, 1, 0.1, 50);

  const chrome = new MeshStandardMaterial({ color: '#d9d9d9', metalness: 1, roughness: 0.16 });
  const pole = new Group();

  // Inner drum with the helix.
  const tex = stripeTexture();
  const drum = new Mesh(
    new CylinderGeometry(0.24, 0.24, 2.4, 64, 1, true),
    new MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0, envMapIntensity: 0.6 })
  );
  pole.add(drum);

  // Glass sleeve.
  const glass = new Mesh(
    new CylinderGeometry(0.3, 0.3, 2.42, 64, 1, true),
    // Thin-shell glass: reflection-only, no refraction pass. Transmission
    // refracts the drum through a blurred buffer, which doubled and smeared
    // the stripes; a real sleeve is thin enough that you see them crisp.
    new MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.02,
      transparent: true,
      opacity: 0.16,
      envMapIntensity: 2.2,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      depthWrite: false,
    })
  );
  pole.add(glass);

  // Caps.
  const top = new Mesh(new LatheGeometry(capProfile(true), 64), chrome);
  top.position.y = 1.2;
  pole.add(top);
  const bottom = new Mesh(new LatheGeometry(capProfile(false), 64), chrome);
  bottom.rotation.x = Math.PI;
  bottom.position.y = -1.2;
  pole.add(bottom);

  // Wall bracket: two arms back to a plate, like the one on the façade.
  const arm = new CylinderGeometry(0.035, 0.035, 0.34, 16);
  [1.28, -1.28].forEach((y) => {
    const a = new Mesh(arm, chrome);
    a.rotation.x = Math.PI / 2;
    a.position.set(0, y, -0.47);
    pole.add(a);
  });
  const plate = new Mesh(new BoxGeometry(0.16, 2.9, 0.03), chrome);
  plate.position.set(0, 0, -0.645);
  pole.add(plate);

  // Three-quarter view so the bracket and depth read.
  pole.rotation.y = -0.42;
  scene.add(pole);

  // A soft key from the street side, so the glass picks a highlight.
  const key = new DirectionalLight('#fff7ea', 1.6);
  key.position.set(-3, 4, 5);
  scene.add(key);
  scene.add(new AmbientLight('#ffffff', 0.15));

  function fit() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Frame the 3.1-unit-tall pole with a margin, whatever the box shape.
    const fov = (camera.fov * Math.PI) / 180;
    const distH = (3.1 / 2) / Math.tan(fov / 2);
    const distW = (1.1 / 2) / (Math.tan(fov / 2) * camera.aspect);
    camera.position.set(0, 0, Math.max(distH, distW) * 1.06);
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
    tex.offset.y -= dt * speed; // stripes climb, like the real motor
    renderer.render(scene, camera);
  }
  function start() {
    if (running) return;
    running = true;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  fit();
  renderer.render(scene, camera);
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);

  return {
    start,
    stop,
    renderOnce: () => renderer.render(scene, camera),
    dispose() {
      stop();
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
