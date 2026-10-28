# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview` / `pnpm test:e2e` (Playwright, chromium only).
- Single test: `pnpm exec playwright test e2e/<file>`.
- Build first: the e2e config starts `pnpm preview`, which serves `dist/`.
  `PLAYWRIGHT_TEST_BASE_URL` points tests at an existing server (preview on :4399).
- Node version is in `.nvmrc`; package manager is pnpm.

## Architecture

Astro 4 static site, Spanish copy, no React. `src/pages/index.astro` composes, in
order: Header, LocalTour, Services, Lookbook (id `archivo`), Reviews, About
(`local`, "Equipo"), Location (`donde`, "Dónde"), InstagramFeed (optional), Footer,
MobileStickyCTA. `homepage.spec.js` asserts this order.

- `src/data/content.js` is the single source of truth: `business`, `hours` (verbatim
  from the Google listing), `services`, `barbers`, `reviews`, `galleryItems`,
  `shopImages`. Components import from it; do not hardcode facts in markup.
- LocalTour: `<canvas>` painted from 216 frames in `public/tour/{d,m}/NNN.avif`
  (frame 000 is a real `<img>`, the LCP). Frames are in `public/`, so Astro neither
  processes nor hashes them.
- Lookbook.astro: a CSS `position: sticky` horizontal reel driven by a small rAF scrub
  (no GSAP). An inline script adds `.is-live` before first paint so the section's
  scroll height is reserved up front (no layout shift, anchors land correctly);
  without JS or with reduced motion it is a native snap scroller. LocalTour reserves
  its height the same way (`is-tall`: 400svh desktop, 320svh phones). Each module sets
  `data-ready` when it evaluates; if it never does, the inline script drops the class
  after load (fail-safe back to the no-JS layout). Tour frames beyond the first window
  download only once the visitor starts walking.
- `src/scripts/motion.js` (Web Animations + IntersectionObserver; Lenis only for
  fine pointers) is dynamically imported from
  `Layout.astro` on idle, and only when `prefers-reduced-motion: no-preference`.
  Pages must be complete without it.
- InstagramFeed renders only if `PUBLIC_IG_FEED_URL` is set.
- Theme: `tailwind.config.mjs` REPLACES Tailwind's defaults (`theme`, not `extend`).
  Stock utilities such as `text-sm` or `rounded-lg` do not exist; use the custom
  scale (`text-cap`, `text-base`, `text-sub`, `text-h3`, `text-sect`, colours like
  `bg-marmol`, `text-roble`). Opacity steps are whitelisted (0, 5, 6, 10, 15, 20, 25,
  30, 40, 50, 60, 70, 75, 80, 85, 90, 95, 100): other values (e.g. `bg-marmol/55`)
  silently produce no CSS and no build error. Design rules are in the header of
  `src/styles/global.css` and `docs/identity-system.md`.

## Constraints locked by e2e (`e2e/`)

- `no-js.spec.js`: with JavaScript disabled, Precios, Archivo, El equipo and Dónde
  headings and the `.ledger-row` price rows are visible.
- `homepage.spec.js`: `#hero` has an img, rating "5,0" shown, sections follow the
  booking order above.
- `visual.spec.js`: no horizontal overflow at 1440x900 and 390x844; ledger rows stay
  inside the viewport; header logo stays inside the header.
- `regression.spec.js`: hero is a still (no video element); header logo fits and is
  not blend-screen; review dots are 44px targets; booking links open Booksy with a new
  tab; mobile booking link points at the Booksy profile; location lists the week.
- `mobile-nav.spec.js`: menu disclosure opens; Escape, Cerrar and anchor click close it.
- `lookbook*.spec.js`: the archive has no filters and no expander.
- `accessibility.spec.js`: axe WCAG 2 A/AA with no violations.

## CSP and deployment

`netlify.toml` sets a strict Content-Security-Policy: scripts, styles and fonts are
self-only, `frame-src 'none'`, and `connect-src` allows only Booksy and the
Behold/Instagram feed. Add any new third-party origin there or it will be blocked in
production. `/tour/*` is cached 30 days (not `immutable`: filenames are not hashed).

## Gotchas

- Cold `pnpm build` takes about 3.5 minutes (Astro image optimisation of
  `src/assets/img`).
- Footer "Hoy" is filled in on the client (Europe/Madrid weekday, from the `hours`
  JSON in `data-hours`); without JS it shows a neutral weekly-hours line. Never
  compute "today" in Astro frontmatter: the page is static.
- No GSAP anywhere: it was removed for main-thread cost (Lighthouse mobile 99).
- Logo.astro ships its paths once per page: `mode="symbol"` in Header, `mode="use"`
  in Header/Footer, inline only in the hero (the trazo intro animates real paths).
- Fonts come from `@fontsource-variable` (bundled under `/_astro`), not `public/`.
