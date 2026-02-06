import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Dark navy background
        navy: {
          950: '#0f0f1a',
          900: '#161c28',
          800: '#1a1b2b',
          700: '#1e293b',
          600: '#20293a',
          500: '#252a3a',
          400: '#2c2c4a',
        },
        // Accent orange (HUMANITÉ+ brand)
        accent: {
          DEFAULT: '#FF6B35',
          light: '#ff8c5a',
          dark: '#e55a2b',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
