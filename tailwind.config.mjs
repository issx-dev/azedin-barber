/** @type {import('tailwindcss').Config} */

/**
 * PLOMO design system — Azedin Barber.
 *
 * Deliberate choice: `theme` replaces Tailwind's defaults instead of extending
 * them. The whole generic palette (indigo/violet/purple/slate…), the full radius
 * scale and every blurred shadow simply do not exist here, so they cannot be
 * written by accident. Structural guardrail beats a style guide in prose.
 */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },

    // Mineral palette sampled from Berja: lead ore of Sierra de Gádor, lime
    // render, and the gules red of the town's coat of arms as the only accent.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#0E0F0F', // mineral black — never #0F172A
      'ink-2': '#161818', // raised plane
      'ink-3': '#1F2122', // deepest raise, borders on dark
      // `lead` is the measured AA-safe lead grey: 5.07:1 on ink and 4.71:1 on
      // ink-2. The "correct" ore colour #6E7378 only reaches 4.01:1 and fails
      // body text, so it survives only as `lead-lo` for hairlines.
      lead: '#7E8489', // metadata, rules — AA on both dark planes
      'lead-dim': '#6E7378', // large text / decorative only (4.01:1)
      'lead-lo': '#3A3E41', // hairlines on ink, never text
      caliza: '#EDE8DF', // lime paper — never #FFFFFF
      'caliza-dim': '#C8C2B8',
      gules: '#B4291F', // the single accent. Display/UI only, never body copy
      'gules-hi': '#E05046', // AA-safe gules on ink for small text (4.94:1)
      oro: '#A6791F', // matte gold of the castle — never #FFD700
    },

    fontFamily: {
      // Archivo variable carries both the condensed and expanded widths, so the
      // extreme scale/width contrast costs one file instead of two families.
      display: ['"Archivo Variable"', 'ui-sans-serif', 'sans-serif'],
      body: ['"Hanken Grotesk Variable"', 'ui-sans-serif', 'sans-serif'],
      mono: ['"Archivo Variable"', 'ui-monospace', 'monospace'],
    },

    fontSize: {
      cap: ['var(--step--1)', { lineHeight: '1.45' }],
      base: ['var(--step-0)', { lineHeight: '1.55' }],
      // Named `sub`, not `lead`: a `lead` size token would collide with the
      // `lead` colour token and `text-lead` would silently set both.
      sub: ['var(--step-1)', { lineHeight: '1.35' }],
      sect: ['var(--step-3)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      poster: ['var(--step-poster)', { lineHeight: '0.84', letterSpacing: '-0.04em' }],
    },

    // Three values. Default is 0. `full` is reserved for the single status pill.
    borderRadius: {
      none: '0',
      DEFAULT: '0',
      sm: '2px',
      full: '9999px',
    },

    // Displaced solid shadow or nothing. No blur anywhere.
    boxShadow: {
      none: 'none',
      hard: '5px 5px 0 0 var(--c-ink)',
      'hard-caliza': '5px 5px 0 0 var(--c-caliza)',
    },

    borderWidth: { 0: '0', DEFAULT: '1px', 2: '2px', 4: '4px' },
    letterSpacing: { tight: '-0.03em', normal: '0', wide: '0.08em' },
    lineHeight: { none: '1', tight: '1.1', snug: '1.35', normal: '1.55' },
    opacity: { 0: '0', 5: '0.05', 20: '0.2', 40: '0.4', 60: '0.6', 80: '0.8', 100: '1' },

    extend: {
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        black: '800',
      },
      transitionTimingFunction: {
        // One curve for the whole site. No back/elastic/bounce, ever.
        plomo: 'cubic-bezier(0.23, 1, 0.32, 1)',
        gleasing: 'cubic-bezier(0.4, 0, 0, 1)',
        'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      transitionDuration: { 120: '120ms', 150: '150ms', 250: '250ms', 400: '400ms', 600: '600ms' },
      spacing: { 18: '4.5rem', 22: '5.5rem', 30: '7.5rem', gap: 'var(--gap)', safe: 'var(--safe)' },
      maxWidth: { measure: '66ch', frame: '88rem' },
      aspectRatio: { reel: '9 / 16', card: '3 / 4' },
      keyframes: {
        // Rule drawn left→right: the only decorative motion allowed in CSS.
        ruleIn: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: {
        'rule-in': 'ruleIn 0.4s cubic-bezier(0.2, 0.7, 0.2, 1) both',
        marquee: 'marquee 48s linear infinite',
      },
    },
  },
  plugins: [],
};
