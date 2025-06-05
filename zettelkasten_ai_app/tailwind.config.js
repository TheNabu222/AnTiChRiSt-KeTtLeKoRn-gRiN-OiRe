
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '102': '1.02',
      },
      colors: {
        // Y2K Primary Colors
        'y2k-magenta': '#f312af',
        'y2k-cyan': '#00ffcc',
        'y2k-yellow': '#fffb01',
        'y2k-black': '#000000',
        'y2k-white': '#ffffff',
        
        // Four-tier Kasten System Colors
        'kasten-1': '#ff0080', // Hot Pink - Foundational concepts
        'kasten-2': '#00ff80', // Bright Green - Developing ideas
        'kasten-3': '#8000ff', // Electric Purple - Complex connections
        'kasten-4': '#ff8000', // Electric Orange - Mastery level
        
        // Additional Y2K Colors
        'y2k-purple': '#8000ff',
        'y2k-lime': '#80ff00',
        'y2k-orange': '#ff8000',
        'y2k-blue': '#0080ff',
        'y2k-red': '#ff0040',
        
        // Background variants
        'y2k-bg-dark': '#0a0a0a',
        'y2k-bg-medium': '#1a1a1a',
        'y2k-bg-light': '#2a2a2a',
      },
      fontFamily: {
        'vt323': ['VT323', 'monospace'],
        'tahoma': ['Tahoma', 'sans-serif'],
        'mono': ['VT323', 'Courier New', 'monospace'],
      },
      animation: {
        'glitch': 'glitch 0.3s infinite',
        'rainbow': 'rainbow 3s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'matrix-rain': 'matrix-rain 20s linear infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'flicker': 'flicker 0.15s infinite linear',
        'cyber-pulse': 'cyber-pulse 1.5s ease-in-out infinite',
        'data-stream': 'data-stream 4s linear infinite',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        rainbow: {
          '0%': { color: '#f312af' },
          '16.66%': { color: '#00ffcc' },
          '33.33%': { color: '#fffb01' },
          '50%': { color: '#8000ff' },
          '66.66%': { color: '#ff8000' },
          '83.33%': { color: '#80ff00' },
          '100%': { color: '#f312af' },
        },
        'pulse-glow': {
          '0%': { 
            boxShadow: '0 0 5px #f312af, 0 0 10px #f312af, 0 0 15px #f312af',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc',
            transform: 'scale(1.02)',
          },
        },
        'matrix-rain': {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter: 'brightness(1)',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'brightness(0.8)',
          },
        },
        'cyber-pulse': {
          '0%, 100%': { 
            borderColor: '#f312af',
            boxShadow: '0 0 5px #f312af',
          },
          '50%': { 
            borderColor: '#00ffcc',
            boxShadow: '0 0 20px #00ffcc, 0 0 30px #00ffcc',
          },
        },
        'data-stream': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100vw)' },
        },
      },
      backgroundImage: {
        'y2k-gradient': 'linear-gradient(45deg, #f312af, #00ffcc, #fffb01)',
        'kasten-gradient': 'linear-gradient(135deg, #ff0080, #00ff80, #8000ff, #ff8000)',
        'cyber-grid': 'linear-gradient(rgba(0,255,204,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.1) 1px, transparent 1px)',
        'matrix-bg': 'radial-gradient(ellipse at center, rgba(0,255,204,0.1) 0%, transparent 70%)',
      },
      backgroundSize: {
        'cyber-grid': '20px 20px',
      },
      boxShadow: {
        'y2k': '0 0 10px #f312af, 0 0 20px #f312af, 0 0 30px #f312af',
        'cyan-glow': '0 0 10px #00ffcc, 0 0 20px #00ffcc, 0 0 30px #00ffcc',
        'yellow-glow': '0 0 10px #fffb01, 0 0 20px #fffb01, 0 0 30px #fffb01',
        'kasten-glow': '0 0 15px currentColor, 0 0 30px currentColor',
      },
      textShadow: {
        'glow': '0 0 10px currentColor',
        'y2k': '0 0 10px #f312af, 0 0 20px #f312af',
        'cyber': '0 0 5px #00ffcc, 0 0 10px #00ffcc',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-shadow-y2k': {
          textShadow: '0 0 10px #f312af, 0 0 20px #f312af',
        },
        '.text-shadow-cyber': {
          textShadow: '0 0 5px #00ffcc, 0 0 10px #00ffcc',
        },
        '.bg-cyber-grid': {
          backgroundImage: 'linear-gradient(rgba(0,255,204,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,204,0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        },
        '.border-glow': {
          borderColor: 'currentColor',
          boxShadow: '0 0 10px currentColor',
        },
        '.hover-glitch:hover': {
          animation: 'glitch 0.3s infinite',
        },
        '.rainbow-text': {
          animation: 'rainbow 3s linear infinite',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
