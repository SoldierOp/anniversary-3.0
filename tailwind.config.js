/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        mission: {
          black: '#080810',
          dark: '#0d0d1a',
          panel: '#12121f',
          border: '#1e1e3f',
          pink: '#ff1493',
          'pink-soft': '#ff69b4',
          'pink-light': '#ffb6c1',
          'pink-dim': '#cc1177',
          glow: '#ff4da6',
          red: '#ff2244',
          cyan: '#00ffff',
          gold: '#ffd700',
          silver: '#c0c0c0',
        },
      },
      fontFamily: {
        mono: ['"Space Mono"', 'Courier New', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'flicker': 'flicker 3s infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 10s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'type-cursor': 'typeCursor 1s step-end infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0,0,0.2,1) infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.85 },
          '75%': { opacity: 0.95 },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px #ff1493, 0 0 20px #ff149355' },
          '50%': { boxShadow: '0 0 25px #ff1493, 0 0 50px #ff149399, 0 0 80px #ff149333' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        typeCursor: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.15)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.1)' },
          '70%': { transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(30px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: 0, transform: 'translateX(50px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        zoomIn: {
          from: { opacity: 0, transform: 'scale(0.85)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon-pink': '0 0 10px #ff1493, 0 0 20px #ff149355, 0 0 40px #ff149322',
        'neon-strong': '0 0 20px #ff1493, 0 0 40px #ff1493aa, 0 0 80px #ff149355',
        'glass': '0 8px 32px rgba(0,0,0,0.5)',
        'panel': '0 0 0 1px rgba(255,20,147,0.15), 0 4px 24px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
