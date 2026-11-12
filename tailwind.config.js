/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        java:   { DEFAULT: '#7C3AED', light: '#A78BFA', dark: '#4C1D95', gold: '#F59E0B', glow: 'rgba(124,58,237,0.4)' },
        python: { DEFAULT: '#D97706', light: '#FCD34D', dark: '#1C1917', glow: 'rgba(217,119,6,0.4)' },
        perl:   { DEFAULT: '#DC2626', light: '#FCA5A5', dark: '#7F1D1D', silver: '#94A3B8', glow: 'rgba(220,38,38,0.4)' },
        dark:   { 50: '#1E1E2E', 100: '#181825', 200: '#11111B', 300: '#0D0D14', 400: '#080810' },
        surface:{ card: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', hover: 'rgba(255,255,255,0.07)' },
      },
      backgroundImage: {
        'gold-gradient':   'linear-gradient(135deg, #F59E0B, #FBBF24, #D97706)',
        'java-gradient':   'linear-gradient(135deg, #7C3AED, #A78BFA)',
        'python-gradient': 'linear-gradient(135deg, #B45309, #F59E0B)',
        'perl-gradient':   'linear-gradient(135deg, #991B1B, #DC2626)',
        'dark-gradient':   'linear-gradient(135deg, #0D0D14 0%, #1a1a2e 100%)',
        'glass':           'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        'java':   '0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)',
        'python': '0 0 20px rgba(217,119,6,0.3), 0 0 60px rgba(217,119,6,0.1)',
        'perl':   '0 0 20px rgba(220,38,38,0.3), 0 0 60px rgba(220,38,38,0.1)',
        'gold':   '0 0 20px rgba(245,158,11,0.4)',
        'card':   '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.6)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'slide-up':   'slideUp 0.4s ease-out forwards',
        'fade-in':    'fadeIn 0.3s ease-out forwards',
        'shimmer':    'shimmer 2.5s infinite',
        'spin-slow':  'spin 8s linear infinite',
        'bounce-in':  'bounceIn 0.6s cubic-bezier(0.68,-0.55,0.265,1.55) forwards',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          from: { opacity: '0.6' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceIn: {
          '0%':   { opacity: '0', transform: 'scale(0.3)' },
          '50%':  { transform: 'scale(1.05)' },
          '70%':  { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: []
}
