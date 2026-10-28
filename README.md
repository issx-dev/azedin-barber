# Azedin Barber

One-page static site for a barbershop in Berja (Almería). Spanish copy, design
system **MÁRMOL** (colours sampled from the shop itself; see `docs/identity-system.md`).
The home page is a booking funnel: every CTA opens the Booksy profile in a new tab.

## Stack

- [Astro](https://astro.build/) 4, fully static output, no UI framework islands.
- [Tailwind CSS](https://tailwindcss.com/) 3. `tailwind.config.mjs` **replaces**
  Tailwind's default theme (colours, radius, shadows, font sizes, opacity steps).
- Fonts: `@fontsource-variable/cormorant` (display) and
  `@fontsource-variable/source-sans-3` (body), self-hosted.
- Motion with the Web Animations API and Lenis (`src/scripts/motion.js`), imported dynamically
  after first paint (idle callback) and only when `prefers-reduced-motion: no-preference`.
  Without JS the page is complete.
- Playwright + axe-core for end-to-end and accessibility tests.

## Page structure

`src/pages/index.astro` composes, in order: Header, **LocalTour** (scroll-scrubbed
walkthrough of the shop), **Services** (`#servicios`, prices), **Lookbook**
(`#archivo`, pinned horizontal reel), **Reviews** (`#resenas`), **About**
(`#local`, the team), **Location** (`#donde`), **InstagramFeed** (optional), then
Footer and MobileStickyCTA.

## Content

All business data lives in `src/data/content.js`: `business`, `hours` (copied
from the Google listing), `services`, `barbers`, `reviews`, `galleryItems`,
`shopImages`. Edit it there, not in components. Gallery photos are in
`src/assets/img/` and optimised by Astro at build time. Client originals are kept
in `azedin-images/` and are not part of the build.

## Tour frame sequence

`LocalTour.astro` paints a `<canvas>` from 216 frames (24 fps) extracted from the
shop walkthrough: `public/tour/d/NNN.avif` (desktop crop) and
`public/tour/m/NNN.avif` (phone), `NNN` = `000`..`215`; frame 000 also has a
`.webp` fallback and is a real `<img>` (the LCP). Frames live in `public/`, so
Astro does not process or content-hash them: if you replace a frame, keep the
name and expect stale browser caches.

## Commands

```
pnpm install
pnpm dev          # dev server on :4321
pnpm build        # static build to dist/ (slow: image optimisation)
pnpm preview      # serve dist/
pnpm test:e2e     # Playwright (chromium)
```

## Tests

`e2e/` runs against `pnpm preview` (started by `playwright.config.mjs`), so
**build first**. Set `PLAYWRIGHT_TEST_BASE_URL` to test an already-running
server (previewed on port 4399). In sandboxes the bundled Chromium may be missing;
point Playwright at a system browser with `launchOptions.executablePath`.
Run one file with `pnpm exec playwright test e2e/no-js.spec.js`.
CI (`.github/workflows/ci.yml`) runs install, build, then the suite on pushes and
PRs to `main`.

## Environment

`PUBLIC_IG_FEED_URL` (optional): JSON endpoint (e.g. a Behold.so feed) for the
Instagram section. Without it the section is not rendered. `URL` sets the
canonical site URL for the sitemap (Netlify provides it).

## Deployment

Netlify (`netlify.toml`): `pnpm build`, publish `dist`. It also sets security
headers (CSP, HSTS, frame denial) and immutable caching for `/_astro/*`. Any new
third-party origin (scripts, fonts, images, fetch targets, iframes) must be
added to the CSP there.
