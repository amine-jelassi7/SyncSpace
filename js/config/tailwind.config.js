

tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#080a10',
          card: '#0f1422',
          border: '#1e293b',
          accent: '#00f0ff',
          pink: '#ff007f',
          purple: '#8b5cf6'
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 'box-shadow': '0 0 15px rgba(0, 240, 255, 0.3)' },
          '100%': { 'box-shadow': '0 0 30px rgba(0, 240, 255, 0.7)' }
        }
      }
    }
  }
}
