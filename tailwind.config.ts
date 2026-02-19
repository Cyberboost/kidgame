import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        livy: {
          green: '#5CB85C',
          blue: '#29ABE2',
          orange: '#F7941D',
          teal: '#26C6DA',
          gray: '#E8E8E8',
          darkgray: '#2D2D2D',
          pink: '#FFB6C1',
        },
        bunny: {
          50: '#fef7ee',
          100: '#fdecd7',
          200: '#fad6ae',
          300: '#f7b87a',
          400: '#f39144',
          500: '#f07220',
          600: '#e15716',
          700: '#ba4014',
          800: '#943418',
          900: '#772d16',
        },
        grass: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      fontFamily: {
        game: ['Nunito', 'Fredoka One', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      animation: {
        'livy-bob': 'livyBob 2s ease-in-out infinite',
        'livy-wave': 'livyWave 1s ease-in-out infinite',
      },
      keyframes: {
        livyBob: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        livyWave: {
          '0%, 100%': { transform: 'rotate(0deg)', transformOrigin: 'bottom center' },
          '25%': { transform: 'rotate(15deg)', transformOrigin: 'bottom center' },
          '75%': { transform: 'rotate(-5deg)', transformOrigin: 'bottom center' },
        },
      },
    },
  },
  plugins: [],
}
export default config
