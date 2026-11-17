/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4fd',
          100: '#dce5fb',
          200: '#bfcff7',
          300: '#94b2f1',
          400: '#638ee9',
          500: '#416ce0',
          600: '#2b50cc',
          700: '#233fa6',
          800: '#1b2f7d',
          900: '#0f172a',
          950: '#080d1a',
        },
        brand: {
          primary: '#4338ca', // deep indigo
          electric: '#3b82f6', // electric blue
          cyan: '#06b6d4', // cyan accent
          emerald: '#10b981', // available green
          amber: '#f59e0b', // reserved/hold amber
          rose: '#f43f5e', // occupied rose
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-indigo': '0 0 25px -5px rgba(67, 56, 202, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-emerald': '0 0 20px -5px rgba(16, 185, 129, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
