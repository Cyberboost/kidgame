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
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
