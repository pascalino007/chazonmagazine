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
        primary: {
          DEFAULT: '#0d2137',
          light: '#1a3a5c',
          dark: '#081525',
        },
        navy: {
          950: '#0f0f1a',
          900: '#161c28',
          800: '#1a2535',
          700: '#1e293b',
          600: '#20293a',
          500: '#252a3a',
          400: '#2c2c4a',
        },
        accent: {
          DEFAULT: '#FF6B35',
          light: '#ff8c5a',
          dark: '#e55a2b',
        },
        surface: {
          DEFAULT: '#faf9f7',
          card: '#ffffff',
          muted: '#f2f0ec',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        textFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,107,53,0)' },
          '50%': { boxShadow: '0 0 24px 6px rgba(255,107,53,0.25)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'float': 'float 4s ease-in-out infinite',
        'marquee': 'marquee 28s linear infinite',
        'text-fade': 'textFade 0.5s ease-out forwards',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config
