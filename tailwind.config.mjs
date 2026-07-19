/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-deep':    '#0C0A09',
        'bg-panel':   '#151210',
        'bg-surface': '#1E1A17',
        steel:        '#8A95A5',
        'steel-dim':  'rgba(138,149,165,0.35)',
        'steel-faint':'rgba(138,149,165,0.18)',
        oak:          '#C29367',
        'oak-light':  '#D4A67B',
        'oak-dim':    '#8B6543',
        sand:         '#E8D5B5',
        cream:        '#F4EFEA',
        ink:          '#F0E6D8',
        'ink-dim':    '#9E8E7E',
        'ink-faint':  '#5E5248',
        border:       '#2A2420',
        'border-hi':  '#3D332B',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body:    ['"Instrument Sans"', 'system-ui', 'sans-serif'],
        quote:   ['"Fraunces"', 'serif'],
        serif:   ['"Fraunces"', 'serif'],
      },
      fontSize: {
        'hero':    ['clamp(3.5rem, 8vw, 7rem)',   { lineHeight: '1', letterSpacing: '-0.02em' }],
        'section': ['clamp(2.2rem, 5vw, 3.8rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '6px',
        full: '9999px',
      },
      // Custom animation tokens — used sparingly for CSS-only elements
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          to:   { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'marquee':   'marquee 42s linear infinite',
        'fade-up':   'fadeUp 0.65s cubic-bezier(0.23, 1, 0.32, 1) both',
        'modal-in':  'modalIn 0.2s cubic-bezier(0.23, 1, 0.32, 1) both',
      },
    },
  },
  plugins: [],
};
