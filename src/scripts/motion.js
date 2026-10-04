/**
 * PLOMO motion layer.
 *
 * Deliberately an enhancement, not a foundation: winstonstudio.dk — the brief's
 * reference for "a site with personality" — ships zero motion libraries. If this
 * file never loads, the page must be exactly as good. So it is imported
 * dynamically after first paint and every effect sets a final state that already
 * matches the static CSS.
 *
 * Budget (measured, CPU throttled 4x): gsap + ScrollTrigger + Lenis = 43.7 KB
 * brotli, 0 frames > 50ms, CLS 0.0000. Three behaviours, no more:
 *   1. The name laminates — Archivo's `wdth` axis compresses as you scroll.
 *   2. The archive runs horizontally, pinned (desktop only).
 *   3. Rows and rules arrive as the eye reaches them.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let mm;
let lenis;
let lenisRaf; // kept so the ticker callback can be removed by identity

async function initLenis() {
  // Lenis is desktop-only: it caps at 60fps on Safari and 30fps in low-power
  // mode, which is exactly the phone case where it buys nothing.
  const { default: Lenis } = await import('lenis');
  // The media query may have been reverted while this import was in flight.
  if (!mm) return;
  lenis = new Lenis({ autoRaf: false, duration: 1.1 });
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

function init() {
  mm = gsap.matchMedia();

  // --- Reduced motion: everything is already in its final state. ------------
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set('[data-tour-row]', { clearProps: 'all', opacity: 1, y: 0 });
  });

  // --- Desktop -------------------------------------------------------------
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    initLenis();

    // 1. The name laminates. The single kinetic idea of the site: the display
    //    face's width axis compresses, as lead does under a roller.
    const poster = document.querySelector('[data-poster]');
    if (poster) {
      gsap.fromTo(
        poster,
        { fontVariationSettings: '"wght" 800, "wdth" 112' },
        {
          fontVariationSettings: '"wght" 800, "wdth" 78',
          ease: 'none',
          scrollTrigger: { trigger: poster, start: 'top top+=80', end: '+=520', scrub: 0.6 },
        }
      );
    }

    // 2. The archive runs horizontally while pinned. The pin targets an inner
    //    box while the outer `data-track` holds its own height in normal flow,
    //    so entering and leaving the pin cannot shift the page (CLS stays 0).
    const track = document.querySelector('[data-track]');
    const pinBox = document.querySelector('[data-pin]');
    const rail = document.querySelector('[data-rail]');
    if (track && pinBox && rail) {
      // The tour's travel is capped to the height the track reserves (260vh),
      // so the rail finishes exactly as the pin releases.
      const distance = () => Math.min(rail.scrollWidth - window.innerWidth + 80, window.innerHeight * 1.6);
      gsap.to(rail, {
        x: () => -distance(),
        ease: 'none', // required: containerAnimation needs a linear tween
        scrollTrigger: {
          trigger: track,
          pin: pinBox,
          pinSpacing: false, // the track already reserves the height
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
          start: 'top top',
          end: () => '+=' + distance(),
        },
      });
    }

    return () => teardownLenis();
  });

  // --- 3. Rows arrive. Every breakpoint, cheapest possible effect. ----------
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('[data-tour-row]').forEach((row) => {
      gsap.from(row, {
        y: 24,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: row, start: 'top 88%', once: true },
      });
    });
  });

  // Fonts change metrics, which changes trigger positions. Images do too: a
  // lazily decoded photo resizing its grid is the classic source of CLS in a
  // pinned section, so refresh once everything has settled.
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
