# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page static marketing site for a barbershop in Berja, Almería (Spanish-language copy). Astro 4 + Tailwind 3 + GSAP/Lenis, deployed on Netlify. No React: the README mentions `BookingModal.jsx`/React islands, but neither exists in the code or dependencies. Booking goes out to Booksy (see CSP in `netlify.toml`).

## Commands

Package manager is pnpm (Node version in `.nvmrc`).

- `pnpm dev` — dev server on `0.0.0.0:4321`
- `pnpm build` — static output to `dist/`
- `pnpm preview` — serve `dist/`
- `pnpm test:e2e` — Playwright (chromium only). It starts `pnpm preview` itself, so **run `pnpm build` first**; tests run against the built output, not the dev server.
- Single test: `pnpm exec playwright test e2e/mobile-nav.spec.js` (add `-g "test name"` to filter)
- `PLAYWRIGHT_TEST_BASE_URL=<url>` points the tests at another server; the config then starts a preview on port 4399.

CI (`.github/workflows/ci.yml`) runs `pnpm install --frozen-lockfile`, `pnpm build`, then the e2e suite.

## Architecture

- `src/pages/index.astro` composes the whole page from section components in `src/components/` (Hero, Barbers, Reviews, Lookbook, Services, About, Location, InstagramStrip, Footer, MobileNav). `404.astro` is the only other page.
- `src/layouts/Layout.astro` holds head metadata, JSON-LD structured data, and inline scripts.
- `src/data/content.js` is the single source of truth for copy, prices, gallery items, and barber images. Images are imported from `src/assets/img/` there so Astro's `<Image />` can optimize them. Edit content here, not in components.
- `src/scripts/animations.js` sets up Lenis smooth scroll (desktop only, disabled at ≤768px) and GSAP ScrollTrigger reveals/parallax, skipping parallax for `prefers-reduced-motion`.
- `src/styles/global.css` defines the design tokens (CSS variables like `--color-bg-deep`, `--color-steel`, `--color-oak`) used with `tailwind.config.mjs`. Oak is reserved for conversion CTAs and active states.

## Constraints enforced by tests

The e2e suite (`e2e/`) encodes requirements that are easy to break:

- `no-js.spec.js`: the page's key sections (Barbers, Lookbook, Servicios, Reseñas) must render with JavaScript disabled. Don't make content depend on GSAP/JS to be visible.
- `accessibility.spec.js`: axe-core checks.
- `visual.spec.js` / `regression.spec.js`: font families and layout stability. Section headings are matched by Spanish text, so changing copy can break tests.

`netlify.toml` sets a strict CSP (only self, Google Fonts, and `*.booksy.com`). Adding a new third-party script, font, or embed origin requires updating it.

`.agents/skills/` contains design/Playwright skills for other agents, and `.atl/skill-registry.md` is generated tooling output; neither is part of the site.
