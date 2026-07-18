/**
 * Azedin Barber — Animation Engine
 * GSAP ScrollTrigger + Lenis smooth scroll
 *
 * Emil Kowalski principles:
 * - UI transitions < 300ms
 * - Scroll reveals 600–800ms (decorative, seen once)
 * - Only animate transform + opacity
 * - prefers-reduced-motion respected
 * - ease-out for entering elements (starts fast, responsive)
 */

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Reduced motion check ────────────────────────────────────────────────────
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── Lenis smooth scroll ─────────────────────────────────────────────────────
const lenis = new Lenis({
  lerp: 0.08,           // buttery smooth, slight weight
  smoothWheel: true,
  touchInertiaMultiplier: 20,
});

// Sync Lenis with GSAP ticker
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

// Disable GSAP lag smoothing to prevent jitter with Lenis
gsap.ticker.lagSmoothing(0);

// ─── Easing curves (Emil Kowalski) ──────────────────────────────────────────
const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)';
const EASE_OUT_QUART = 'power4.out';   // GSAP equivalent
const EASE_IN_OUT = 'cubic-bezier(0.77, 0, 0.175, 1)';

// ─── Clip-path reveal — vertical (bottom-up curtain) ────────────────────────
function registerClipReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  els.forEach((el) => {
    const dir = el.dataset.reveal || 'up';   // up | left | right

    const fromMap = {
      up:    { clipPath: 'inset(100% 0 0 0)' },
      left:  { clipPath: 'inset(0 100% 0 0)' },
      right: { clipPath: 'inset(0 0 0 100%)' },
    };

    const from = fromMap[dir] ?? fromMap.up;

    if (prefersReduced) {
      // Reduced motion: simple opacity fade only
      gsap.fromTo(el, { opacity: 0 }, {
        opacity: 1,
        duration: 0.4,
        ease: EASE_OUT_QUART,
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
      return;
    }

    gsap.fromTo(el,
      { ...from, opacity: 0 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        duration: 0.85,
        ease: EASE_OUT_QUART,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─── Fade + translate reveal ─────────────────────────────────────────────────
function registerFadeReveal() {
  const els = document.querySelectorAll('[data-fade]');
  if (!els.length) return;

  els.forEach((el) => {
    const yOffset = prefersReduced ? 0 : 28;
    gsap.fromTo(el,
      { opacity: 0, y: yOffset },
      {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0.3 : 0.65,
        ease: EASE_OUT_QUART,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─── Stagger children ────────────────────────────────────────────────────────
function registerStagger() {
  const parents = document.querySelectorAll('[data-stagger]');
  if (!parents.length) return;

  parents.forEach((parent) => {
    const children = parent.children;
    if (!children.length) return;

    const yOffset = prefersReduced ? 0 : 16;
    gsap.fromTo(children,
      { opacity: 0, y: yOffset },
      {
        opacity: 1,
        y: 0,
        duration: prefersReduced ? 0.3 : 0.55,
        ease: EASE_OUT_QUART,
        stagger: prefersReduced ? 0 : 0.07,
        scrollTrigger: {
          trigger: parent,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─── BN → Color on scroll (barber photos) ───────────────────────────────────
function registerGrayscaleReveal() {
  const els = document.querySelectorAll('[data-color-reveal]');
  if (!els.length) return;

  els.forEach((el, i) => {
    if (prefersReduced) {
      el.style.filter = 'none';
      el.style.opacity = '1';
      return;
    }

    // Start: grayscale with warm sepia tint (matching barbershop mood)
    gsap.fromTo(el,
      {
        filter: 'grayscale(100%) sepia(15%) brightness(0.8)',
        clipPath: 'inset(0 0 100% 0)',
        scale: 1.04,
        opacity: 0,
      },
      {
        filter: 'sepia(12%) contrast(1.04) brightness(0.96) saturate(1.03)',
        clipPath: 'inset(0 0 0% 0)',
        scale: 1,
        opacity: 1,
        duration: 1.2,
        ease: EASE_OUT_QUART,
        delay: i * 0.15,
        clearProps: 'filter',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          toggleActions: 'play none none none',
        },
      }
    );
  });
}

// ─── Parallax (subtle, not dizzy) ───────────────────────────────────────────
function registerParallax() {
  if (prefersReduced) return;

  const els = document.querySelectorAll('[data-parallax]');
  els.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    gsap.to(el, {
      yPercent: speed * -30,
      ease: 'none',
      scrollTrigger: {
        trigger: el.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });
}

// ─── Hero text entrance (immediate, no scroll trigger) ──────────────────────
function registerHeroEntrance() {
  const heroText = document.querySelectorAll('[data-hero-text]');
  if (!heroText.length) return;

  if (prefersReduced) {
    gsap.set(heroText, { opacity: 1 });
    return;
  }

  gsap.fromTo(heroText,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: EASE_OUT_QUART,
      stagger: 0.12,
      delay: 0.2,
    }
  );
}

// ─── Smooth Anchor Scrolling via Lenis ───────────────────────────────────────
function registerAnchorSmoothScroll() {
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();

      // Header offset clearance
      const offset = window.innerWidth < 768 ? -20 : -30;

      lenis.scrollTo(targetEl, {
        offset: offset,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential out
      });
    }
  });
}

// ─── Init all ────────────────────────────────────────────────────────────────
function init() {
  registerHeroEntrance();
  registerClipReveal();
  registerFadeReveal();
  registerStagger();
  registerGrayscaleReveal();
  registerParallax();
  registerAnchorSmoothScroll();
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Cleanup on Astro view transitions (if used in future)
document.addEventListener('astro:before-swap', () => {
  lenis.destroy();
  ScrollTrigger.getAll().forEach((t) => t.kill());
});
