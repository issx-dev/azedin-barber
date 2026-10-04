/** @type {import('tailwindcss').Config} */

/**
 * MÁRMOL design system — Azedin Barber.
 *
 * Every colour below was sampled from the shop itself (4K video of the
 * premises, Av. José Barrionuevo Peña 14, Berja): polished black marble floor
 * with white veins, matt charcoal walls, vertical oak slats, chrome, white
 * furniture and a hexagonal LED ceiling. Nothing here is a "brand colour"
 * someone invented — if it is not in the room, it is not in the theme.
 *
 * `theme` replaces Tailwind's defaults instead of extending them, so the
 * generic palette, the radius scale and every blurred shadow cannot be written
 * by accident.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      marmol: '#0F0F14', // polished floor between veins — the canvas
      'marmol-2': '#16161C', // matt wall — raised planes, nav
      'marmol-3': '#212128', // shelving — hover, inputs
      piel: '#0D0D17', // leather chair — overlays on video/photo only
      veta: '#3A3A42', // vein shadow — hairlines, never text (1.7:1)
      'humo-lo': '#6E6E76', // lit wall — decorative, text ≥24px only (3.78)
      humo: '#9A9AA2', // dull reflection — metadata, hours (6.84 AA)
      'cal-dim': '#C4C4C2', // chrome / ring light — secondary text (10.94)
      cal: '#ECECEA', // white furniture — primary text, logo (16.16 AAA)
      roble: '#B3A98F', // oak slats — THE accent: CTA, prices, focus (8.18)
      'roble-hi': '#CFC5A8', // slat against light — CTA hover, star (11.11)
      'roble-lo': '#8E8468', // slat groove — CTA border, text ≥18px (5.14)
      pino: '#D9C979', // pallet table — ONE appearance per page (11.45)
      salvia: '#8FA070', // monstera — the "open now" dot, nothing else
    },

    fontFamily: {
      // Cinzel shares the Roman-capital genealogy of the "BARBER" in the logo.
      display: ['"Cinzel Variable"', '"Cinzel fallback"', 'Georgia', 'serif'],
      // Pinyon is the closest copperplate to the logo's "Azedin": one word per
      // page, at display size only. Imported where used, not in the layout.
      script: ['"Pinyon Script"', 'cursive'],
      body: ['"Hanken Grotesk Variable"', '"Hanken fallback"', 'ui-sans-serif', 'sans-serif'],
    },

    fontSize: {
      cap: ['var(--step--1)', { lineHeight: '1.45' }],
      base: ['var(--step-0)', { lineHeight: '1.55' }],
      sub: ['var(--step-1)', { lineHeight: '1.35' }],
      h3: ['var(--step-2)', { lineHeight: '1.05' }],
      sect: ['var(--step-3)', { lineHeight: '0.95' }],
      poster: ['var(--step-poster)', { lineHeight: '0.95' }],
    },

    // Slats, marble, LED panel: everything in the room is an edge.
    borderRadius: { none: '0', DEFAULT: '0', sm: '2px', full: '9999px' },

    // Depth is a reflection, like the floor — never a blur.
    boxShadow: {
      none: 'none',
      reflejo: 'inset 0 1px 0 0 rgb(236 236 234 / 0.06)',
      aro: '0 0 0 1px #C4C4C2, 0 0 0 7px rgb(236 236 234 / 0.06)',
    },

    borderWidth: { 0: '0', DEFAULT: '1px', 2: '2px' },
    letterSpacing: { normal: '0', wide: '0.18em', wider: '0.3em' },
    lineHeight: { none: '1', tight: '1.05', snug: '1.35', normal: '1.55' },
    opacity: { 0: '0', 6: '0.06', 20: '0.2', 40: '0.4', 60: '0.6', 80: '0.8', 100: '1' },

    extend: {
      fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
      transitionTimingFunction: {
        marmol: 'cubic-bezier(0.23, 1, 0.32, 1)', // micro-states
        lama: 'cubic-bezier(0.4, 0, 0, 1)', // slat reveals
        led: 'cubic-bezier(0.165, 0.84, 0.44, 1)', // lights coming on
        puerta: 'cubic-bezier(0.86, 0, 0.07, 1)', // overlays
      },
      transitionDuration: { 120: '120ms', 240: '240ms', 420: '420ms', 700: '700ms' },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
        lama: 'var(--lama)',
        ranura: 'var(--ranura)',
        gap: 'var(--gap)',
        safe: 'var(--safe)',
      },
      maxWidth: { measure: '66ch', frame: '88rem' },
      aspectRatio: { reel: '9 / 16', card: '3 / 4' },
      keyframes: {
        veta: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        reflejo: { from: { transform: 'translateX(-120%)' }, to: { transform: 'translateX(220%)' } },
      },
      animation: {
        veta: 'veta 420ms cubic-bezier(0.165, 0.84, 0.44, 1) both',
        marquee: 'marquee 48s linear infinite',
      },
    },
  },
  plugins: [],
};
