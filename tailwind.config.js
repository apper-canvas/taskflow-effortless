/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#F59E0B',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      animation: {
        'draw-check': 'draw-check 300ms ease-out forwards',
        'scale-in': 'scale-in 200ms ease-out',
        'slide-in': 'slide-in 300ms ease-out',
        'fade-out': 'fade-out 200ms ease-out forwards',
      },
      keyframes: {
        'draw-check': {
          '0%': { strokeDasharray: '0 16', strokeDashoffset: '0' },
          '100%': { strokeDasharray: '16 16', strokeDashoffset: '0' }
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-10px)' }
        }
      }
    },
  },
  plugins: [],
}