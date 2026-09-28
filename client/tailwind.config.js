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
        brown: {
          950: '#0d0805', // deep espresso obsidian
          900: '#160e08', // dark chocolate
          850: '#1e140c', // rich coffee
          800: '#281b11', // roasted cacao
          700: '#3d2b1c', // warm chestnut
          600: '#5a402a', // bronze hazel
          500: '#7d5a3c', // warm cedar
          400: '#a57c55', // caramel
          300: '#caa37d', // light amber wood
          200: '#e5cca8', // sand latte
          100: '#f5eadb', // cream silk
          50: '#faf6f0',  // soft parchment
        },
        gold: {
          900: '#78350f',
          800: '#92400e',
          700: '#b45309',
          600: '#d97706',
          500: '#f59e0b', // primary amber gold
          400: '#fbbf24', // luminous yellow gold
          300: '#fcd34d', // vibrant honey
          200: '#fde68a', // pale gold
          100: '#fef3c7', // gold tint
          50: '#fffbeb',
        },
        status: {
          active: '#10b981',      // emerald-500
          'active-bg': 'rgba(16, 185, 129, 0.12)',
          'active-border': 'rgba(16, 185, 129, 0.3)',
          warning: '#f59e0b',     // amber-500
          'warning-bg': 'rgba(245, 158, 11, 0.15)',
          'warning-border': 'rgba(245, 158, 11, 0.35)',
          expired: '#ef4444',     // red-500
          'expired-bg': 'rgba(239, 68, 68, 0.12)',
          'expired-border': 'rgba(239, 68, 68, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'gold-sm': '0 0 15px rgba(245, 158, 11, 0.15)',
        'gold-md': '0 0 25px rgba(245, 158, 11, 0.25)',
        'gold-lg': '0 0 40px rgba(251, 191, 36, 0.35)',
        'gold-glow': '0 0 20px -5px rgba(245, 158, 11, 0.5)',
        '3d-card': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(245, 158, 11, 0.12)',
        '3d-float': '0 30px 60px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.2)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float-3d': 'float3D 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float3D: {
          '0%, 100%': { transform: 'translateY(0px) rotateX(0deg)' },
          '50%': { transform: 'translateY(-10px) rotateX(2deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}
