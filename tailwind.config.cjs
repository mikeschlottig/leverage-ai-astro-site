// ============================================================
// TAILWIND CONFIG — Leverage AI LLC Design System
//
// Colors reference CSS custom properties in global.css.
// All brand-*, neutral-* Tailwind classes are CSS var proxies —
// update values in global.css to retheme everything at once.
//
// Also adds: cream text color, background/foreground HSL vars
// to support Leverage AI's noir design language.
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      // ─── Brand Color Scale ──────────────────────────────────
      // All values are CSS custom properties — update in global.css
      colors: {
        brand: {
          50:  'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          400: 'var(--brand-400)',
          500: 'var(--brand-500)',  // ← Primary accent color
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
          800: 'var(--brand-800)',
          900: 'var(--brand-900)',
        },
        neutral: {
          50:  'var(--neutral-50)',
          100: 'var(--neutral-100)',
          200: 'var(--neutral-200)',
          300: 'var(--neutral-300)',
          400: 'var(--neutral-400)',
          500: 'var(--neutral-500)',
          600: 'var(--neutral-600)',
          700: 'var(--neutral-700)',
          800: 'var(--neutral-800)',
          900: 'var(--neutral-900)',
        },
      },

      // ─── Font Families ──────────────────────────────────────
      fontFamily: {
        serif:  ['var(--font-heading)', 'Georgia', 'serif'],
        sans:   ['var(--font-body)', 'system-ui', 'sans-serif'],
        accent: ['var(--font-accent)', 'cursive'],
      },

      // ─── Type Scale ─────────────────────────────────────────
      fontSize: {
        'display': ['5.5rem',  { lineHeight: '1.1' }],
        'h1':      ['4.5rem',  { lineHeight: '1.15' }],
        'h2':      ['3.6rem',  { lineHeight: '1.2' }],
        'h3':      ['2.5rem',  { lineHeight: '1.25' }],
        'h4':      ['2rem',    { lineHeight: '1.3' }],
        'h5':      ['1.5rem',  { lineHeight: '1.4' }],
        'h6':      ['1.25rem', { lineHeight: '1.5' }],
      },

      // ─── Extra Spacing ──────────────────────────────────────
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },

      // ─── Keyframe Animations ────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'kenburns': {
          '0%':   { transform: 'scale(1) translate(0, 0)' },
          '50%':  { transform: 'scale(1.08) translate(-1%, -1%)' },
          '100%': { transform: 'scale(1) translate(0, 0)' },
        },
        'breathe': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
      },

      animation: {
        'fade-up':        'fade-up 0.6s ease-out forwards',
        'fade-in':        'fade-in 0.4s ease-out forwards',
        'slide-in-left':  'slide-in-left 0.7s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.7s ease-out forwards',
        'scale-in':       'scale-in 0.6s ease-out forwards',
        'marquee':        'marquee 40s linear infinite',
        'kenburns':       'kenburns 12s ease-in-out infinite',
        'breathe':        'breathe 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
