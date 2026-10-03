/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE080',
          300: '#F7CC5F',
          400: '#F0B429',
          500: '#D4A017',
          600: '#946B0C',
          700: '#7A5808',
          800: '#604505',
          900: '#3D2B03',
        },
      },
      fontFamily: {
        sans: ['Schibsted Grotesk', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Instrument Serif', 'Georgia', 'serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
