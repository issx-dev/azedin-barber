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
 *   RAIL    — the archive runs sideways while pinned (desktop only).
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mm;
let lenis;
let lenisRaf;

async function initLenis() {
  const { default: Lenis } = await import('lenis');
  if (!mm) return;
  lenis = new Lenis({ autoRaf: false, lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  lenisRaf = (t) => lenis?.raf(t * 1000);
  gsap.ticker.add(lenisRaf);
  gsap.ticker.lagSmoothing(0);
}

function teardownLenis() {
  if (lenisRaf) gsap.ticker.remove(lenisRaf);
  lenisRaf = null;
  lenis?.destroy();
  lenis = null;
}

/** TRAZO — stroke the logo paths, then fill. Once per session. */
function trazo() {
  const logo = document.querySelector('[data-logo]');
  if (!logo || sessionStorage.getItem('az-trazo')) return;
  sessionStorage.setItem('az-trazo', '1');
  const paths = logo.querySelectorAll('path');
  gsap.set(logo, { fill: 'transparent', stroke: 'currentColor', strokeWidth: 3 });
  paths.forEach((p) => {
    const len = p.getTotalLength();
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
  });
  gsap
    .timeline()
    .to(paths, { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.04 })
    .to(logo, { fill: 'currentColor', duration: 0.42, ease: 'power1.out' }, '-=0.2')
    .to(logo, { strokeWidth: 0, duration: 0.42 }, '<');
}

/** LAMA — reveal an image through 8 vertical slats. */
function lama(el) {
  const img = el.querySelector('img');
  if (!img) return;
  const N = 8;
  const slats = [];
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
  gsap.to(slats, {
    scaleY: 0,
    duration: 0.7,
    ease: 'power3.inOut',
    stagger: 0.03,
    scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    onComplete: () => slats.forEach((s) => s.remove()),
  });
}

function init() {
  mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('[data-tour-row]', { clearProps: 'all', opacity: 1 });
  });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    trazo();

    document.querySelectorAll('[data-lama-reveal]').forEach(lama);

    // ENCENDIDO: rows come on like LEDs — opacity + brightness settle, no travel.
    gsap.utils.toArray('[data-tour-row]').forEach((row) => {
      gsap.fromTo(
        row,
        { opacity: 0, filter: 'brightness(1.4)' },
        {
          opacity: 1,
          filter: 'brightness(1)',
          duration: 0.42,
          ease: 'power2.out',
          scrollTrigger: { trigger: row, start: 'top 88%', once: true },
          clearProps: 'filter',
        }
      );
    });
  });

  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    initLenis();

    // RAIL — the archive runs sideways while an inner box is pinned; the outer
    // track keeps its height in normal flow so the pin never shifts layout.
    const track = document.querySelector('[data-track]');
    const pinBox = document.querySelector('[data-pin]');
    const rail = document.querySelector('[data-rail]');
    if (track && pinBox && rail) {
      // Travel = the rail's overflow. The track's height is set to exactly
      // one viewport plus that travel, so there is no dead space after the pin
      // releases and the last cards do get reached.
      const travel = () => Math.max(0, rail.scrollWidth - window.innerWidth + 80);
      const sizeTrack = () => {
        track.style.height = `${window.innerHeight + travel()}px`;
      };
      sizeTrack();
      gsap.to(rail, {
        x: () => -travel(),
        ease: 'none',
        scrollTrigger: {
          trigger: track,
          pin: pinBox,
          pinSpacing: false,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefreshInit: sizeTrack,
          start: 'top top',
          end: () => '+=' + travel(),
        },
      });
    }

    return () => teardownLenis();
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function destroy() {
  mm?.revert();
  mm = null;
  ScrollTrigger.getAll().forEach((t) => t.kill());
  teardownLenis();
}

init();
window.addEventListener('pagehide', destroy);
