/**
 * MÁRMOL motion layer.
 *
 * Principle: the room is still. Only the light moves — LEDs coming on,
 * reflections on the marble — and the barber's hand, once. Nothing bounces,
 * nothing floats. Loaded after first paint; if it never runs, the page is
 * already complete.
 *
 * Vocabulary (each tied to something in the room):
 *   TRAZO   — the logo draws itself, once per session.
 *   LAMA    — images reveal through vertical slats, like the oak wall.
 *   VETA    — a rule draws under each heading (CSS where supported).
 *   ENCENDIDO — rows and the 5.0 star come on with a brightness settle.
 *
 * Main-thread budget: this runs while the page is still loading on phones.
 * Three one-shot tweens do not need an animation library: they use the Web
 * Animations API, and the reveals an IntersectionObserver (no layout reads
 * at setup, nothing to refresh). Setup is split into short tasks. Lenis, the
 * only dependency, is fetched only for wheel/trackpad users and drives
 * itself (autoRaf).
 */

// GSAP eases, as CSS cubic-béziers.
const EASE = {
  power1Out: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  power2Out: 'cubic-bezier(0.5, 1, 0.89, 1)',
  power2InOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
  power3InOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
};

let alive = true;
let lenis;
const observers = new Map();
const reveals = new Map();

/** Let input and rendering in between setup steps. */
const yieldToMain = () =>
  globalThis.scheduler?.yield ? globalThis.scheduler.yield() : new Promise((r) => setTimeout(r, 0));

/** Wheel and trackpad only (fine pointer). Touch keeps the native scroll:
 *  taking it over fought the pinned reel. The tour eases its own frames on
 *  every device. Follows the media query if it changes (e.g. a tablet
 *  docking a trackpad). */
function smoothWheel() {
  const mq = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const apply = async () => {
    if (mq.matches && !lenis) {
      const { default: Lenis } = await import('lenis');
      if (!alive || !mq.matches || lenis) return;
      lenis = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.9 });
    } else if (!mq.matches && lenis) {
      lenis.destroy();
      lenis = null;
    }
  };
  mq.addEventListener?.('change', apply);
  apply();
}

/** TRAZO — stroke the logo paths, then fill. Once per session. */
function trazo() {
  const logo = document.querySelector('[data-logo]');
  if (!logo || sessionStorage.getItem('az-trazo')) return;
  // The logo is already painted solid; blanking it to redraw would flash.
  // Trade-off: on slow loads the intro is skipped (flag left unset, so a
  // later visit that loads fast can still play it).
  if (performance.now() > 600) return;
  sessionStorage.setItem('az-trazo', '1');
  const paths = [...logo.querySelectorAll('path')];
  const STROKE = 1200;
  const STAGGER = 40;
  const FILL = 420;
  Object.assign(logo.style, { fill: 'transparent', stroke: 'currentColor', strokeWidth: '3' });
  const strokes = paths.map((p, i) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = String(len);
    p.style.strokeDashoffset = String(len);
    return p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], {
      duration: STROKE,
      delay: i * STAGGER,
      easing: EASE.power2InOut,
      fill: 'forwards',
    });
  });
  // Fill comes in 0.2 s before the last stroke lands; the stroke thins away with it.
  const fillAt = STROKE + STAGGER * (paths.length - 1) - 200;
  const fill = logo.animate(
    [
      { fill: 'transparent', strokeWidth: 3 },
      { fill: 'currentColor', strokeWidth: 0 },
    ],
    { duration: FILL, delay: fillAt, easing: EASE.power1Out, fill: 'forwards' }
  );
  fill.finished
    .then(() => {
      // Hand the logo back to its markup: no inline styles, no held animations.
      paths.forEach((p) => p.style.removeProperty('stroke-dasharray'));
      paths.forEach((p) => p.style.removeProperty('stroke-dashoffset'));
      logo.style.removeProperty('fill');
      logo.style.removeProperty('stroke');
      logo.style.removeProperty('stroke-width');
      strokes.forEach((a) => a.cancel());
      fill.cancel();
    })
    .catch(() => {});
}

/**
 * One-shot reveal when `el` crosses `line` (fraction of the viewport from the
 * top, like ScrollTrigger's "top 80%"). `hide` runs for elements still below
 * the line, `show` when they cross it. Elements already scrolled past (a
 * reload mid-page) are left as they are.
 */
function onReveal(el, line, hide, show) {
  let io = observers.get(line);
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const r = reveals.get(e.target);
          if (!r) continue;
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            io.unobserve(e.target);
            reveals.delete(e.target);
            if (e.isIntersecting) {
              if (!r.hidden) r.hide();
              r.show();
            }
          } else if (!r.hidden) {
            r.hidden = true;
            r.hide();
          }
        }
      },
      { rootMargin: `0px 0px -${Math.round((1 - line) * 100)}% 0px` }
    );
    observers.set(line, io);
  }
  reveals.set(el, { hide, show, hidden: false });
  io.observe(el);
}

/** LAMA — reveal an image through 8 vertical slats. */
function lama(el) {
  const img = el.querySelector('img');
  if (!img) return;
  const N = 8;
  const slats = [];
  onReveal(
    el,
    0.8,
    () => {
      for (let i = 0; i < N; i++) {
        const s = document.createElement('span');
        s.setAttribute('aria-hidden', 'true');
        Object.assign(s.style, {
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${(i / N) * 100}%`,
          width: `${100 / N + 0.2}%`,
          background: 'var(--c-marmol-2)',
          transformOrigin: 'top',
        });
        el.appendChild(s);
        slats.push(s);
      }
    },
    () => {
      const anims = slats.map((s, i) =>
        s.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }], {
          duration: 700,
          delay: i * 30,
          easing: EASE.power3InOut,
          fill: 'forwards',
        })
      );
      Promise.all(anims.map((a) => a.finished))
        .then(() => slats.forEach((s) => s.remove()))
        .catch(() => {});
    }
  );
}

/** ENCENDIDO: rows come on like LEDs — opacity + brightness settle, no travel. */
function encendido(row) {
  onReveal(
    row,
    0.88,
    () => {
      row.style.opacity = '0';
      row.style.filter = 'brightness(1.4)';
    },
    () => {
      const a = row.animate(
        [
          { opacity: 0, filter: 'brightness(1.4)' },
          { opacity: 1, filter: 'brightness(1)' },
        ],
        { duration: 420, easing: EASE.power2Out }
      );
      // The end state is the element's own: drop the inline styles under the
      // running animation so nothing is left behind.
      row.style.removeProperty('opacity');
      row.style.removeProperty('filter');
      a.finished.catch(() => {});
    }
  );
}

async function init() {
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  // The intro first: it is the only part that is time-sensitive.
  trazo();
  await yieldToMain();
  if (!alive) return;

  // Only what is still below its line starts dark; the observer decides.
  document.querySelectorAll('[data-lama-reveal]').forEach(lama);
  document.querySelectorAll('[data-tour-row]').forEach(encendido);
  await yieldToMain();
  if (!alive) return;

  smoothWheel();
}

function destroy() {
  alive = false;
  observers.forEach((o) => o.disconnect());
  observers.clear();
  reveals.clear();
  lenis?.destroy();
  lenis = null;
}

init();
window.addEventListener('pagehide', destroy);
