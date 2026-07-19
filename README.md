# Azedin Barber — Premium Web Experience

A high-performance, single-page editorial web application designed for a premium local barbershop in Berja, Almería. This project showcases modern front-end architecture, custom micro-interactions, responsive fluid grids, and optimal Core Web Vitals performance.

## 🛠️ Technology Stack

- **Core Framework**: [Astro](https://astro.build/) (Static Site Generation for sub-second load times)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS paired with custom variable design tokens)
- **Interactions & Islands**: [React](https://react.dev/) (Used selectively for state-driven modal components)
- **Animation Engine**: [GSAP](https://greensock.com/gsap/) + [Lenis](https://github.com/darkroomengineering/lenis) (Hardware-accelerated scroll reveals and smooth inertia scroll)
- **End-to-End Testing**: [Playwright](https://playwright.dev/) (Functional & visual regression suites)

---

## 📐 Architecture & Core Design Decisions

### 1. Minimalist Industrial Nocturno Design System
The visual architecture is inspired by premium studio aesthetics, utilizing a desaturated color strategy with controlled high-contrast focal points:
- **`--color-bg-deep` (`#0C0A09`)**: Deep dark marble canvas.
- **`--color-steel` (`#8A95A5`)**: Desaturated steel-gray for borders, dot-leaders, and metadata.
- **`--color-oak` (`#C29367`)**: Accent gold/wood tone reserved exclusively for conversion CTAs and active states.
- **Typography Hierarchy**:
  - **Display (Headings)**: `Bricolage Grotesque` (Highly geometric display face).
  - **Body**: `Instrument Sans` (Clean, highly legible body copy).
  - **Editorial Quotes**: `Fraunces` (Premium serif for human stories).

### 2. High-Performance & Core Web Vitals Optimization
- **Image Optimization**: Fully automated using Astro’s native `<Image />` component, converting raw images into WebP, generating responsive `srcset` configurations, and setting explicit aspect ratios to eliminate layout shifts (CLS).
- **Critical Asset Preloading**: Preconnects for Google Fonts and preloads critical variable font files.
- **Render Performance**: Conditional JS initialization and static markup representation for non-interactive elements keep initial bundle size near zero.

---

## 📁 Repository Structure

```
src/
  assets/img/           # Optimized raw image assets
  components/           # Modular Astro and React components
    Hero.astro          # Landing block with parallax and video loop
    Lookbook.astro      # 2-column mobile / 3-column desktop editorial work showcase
    BookingModal.jsx    # React state-driven booking overlay with B&W-to-color transitions
    Services.astro      # Dark services matrix with responsive leader lines
    About.astro         # Narrative section using unified single-column vertical flow
    InstagramStrip.astro# Responsive social grid strip
  data/
    content.js          # Centralized repository for copy, pricing, and social URLs
  layouts/
    Layout.astro        # Base HTML document layout and head metadata
  styles/
     global.css         # Styling system base, variable tokens, and keyframes
  scripts/
     animations.js      # Custom Lenis + GSAP scroll controller
```

---

## 🚀 Local Setup & Build

### Development Server
Run the local environment:
```bash
pnpm install
pnpm dev
```
Open `http://localhost:4321` in your browser.

### Production Build
Compile and optimize static files for production deployment:
```bash
pnpm build
pnpm preview
```
The output directory `dist/` is fully static and ready for direct deployment to Vercel, Netlify, Cloudflare Pages, or static object storage.

---

## 🧪 Automated Testing

This repository includes a full suite of automated Playwright end-to-end (E2E) tests covering responsive navigation overlay events, booking flows, visual font family checks, and layout container stability:

```bash
pnpm run test:e2e
```
