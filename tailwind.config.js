/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0D0D12',
        'bg-secondary': '#1A1A24',
        'bg-surface': '#252532',
        'accent-primary': '#00FFAA',
        'accent-secondary': '#FF3366',
        'accent-tertiary': '#FFD700',
        'accent-blue': '#00D4FF',
        'text-primary': '#FFFFFF',
        'text-secondary': '#8888AA',
        'drum-kick': '#FF6B35',
        'drum-snare': '#FFD93D',
        'drum-hihat': '#6BCB77',
        'drum-tom': '#4D96FF',
        'drum-crash': '#C77DFF',
        'drum-ride': '#00C9A7',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 1s ease-in-out infinite',
        'step-active': 'step-active 0.1s ease-out',
        'pad-hit': 'pad-hit 0.15s ease-out',
        'particle': 'particle 0.5s ease-out forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 170, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 170, 0.6)' },
        },
        'step-active': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'pad-hit': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'particle': {
          '0%': { opacity: '1', transform: 'translate(0, 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(var(--tx), var(--ty)) scale(0)' },
        },
      },
    },
  },
  plugins: [],
}
