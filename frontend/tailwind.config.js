/**
 * Tailwind CSS Configuration — Premium Design System v2.0
 * Uses Tailwind CSS v4 with @tailwindcss/vite plugin.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#050d1a',
          900: '#0a1628',
          800: '#0f2040',
          700: '#162d58',
        },
        teal: {
          400: '#2de8d0',
          500: '#00d4b8',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fadeInUp':    'fadeInUp 0.5s ease-out both',
        'fadeInLeft':  'fadeInLeft 0.5s ease-out both',
        'fadeInRight': 'fadeInRight 0.5s ease-out both',
        'scaleIn':     'scaleIn 0.4s ease-out both',
        'float':       'float 4s ease-in-out infinite',
        'spin-slow':   'spin-slow 8s linear infinite',
        'shimmer':     'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeInUp:    { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeInLeft:  { from: { opacity: '0', transform: 'translateX(-24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        fadeInRight: { from: { opacity: '0', transform: 'translateX(24px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:     { from: { opacity: '0', transform: 'scale(0.92)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float:       { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        'spin-slow':  { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      boxShadow: {
        'glow-teal':   '0 0 30px rgba(0, 212, 184, 0.25)',
        'glow-violet': '0 0 30px rgba(124, 58, 237, 0.25)',
        'card':        '0 4px 24px rgba(5, 13, 26, 0.08)',
        'card-hover':  '0 8px 40px rgba(5, 13, 26, 0.14)',
      },
    },
  },
  plugins: [],
};
