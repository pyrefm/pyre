/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Electric Blue
        pyre: {
          primary: '#0066FF',
          'primary-light': '#3385FF',
          'primary-dark': '#0052CC',
        },
        // Accent - Neon Green (for gains/positive)
        accent: {
          DEFAULT: '#00FF88',
          light: '#33FFA3',
          dark: '#00CC6A',
        },
        // Burn - Orange/Red (for burns)
        burn: {
          DEFAULT: '#FF6B00',
          light: '#FF8533',
          dark: '#CC5500',
          red: '#FF3D00',
        },
        // Background - Dark Mode
        dark: {
          DEFAULT: '#0A0A0F',
          card: '#12121A',
          elevated: '#1A1A25',
          border: '#2A2A35',
        },
        // Text
        text: {
          primary: '#FFFFFF',
          secondary: '#A0A0B0',
          muted: '#606070',
        },
        // Tier Colors
        tier: {
          bronze: '#CD7F32',
          silver: '#C0C0C0',
          gold: '#FFD700',
          diamond: '#B9F2FF',
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'burn': 'burn 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
        'counter': 'counter 0.5s ease-out',
      },
      keyframes: {
        burn: {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
            filter: 'brightness(1)',
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)',
            filter: 'brightness(1.2)',
          },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 107, 0, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 107, 0, 0.6)',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'burn-gradient': 'linear-gradient(135deg, #FF6B00 0%, #FF3D00 50%, #FF6B00 100%)',
        'pyre-gradient': 'linear-gradient(135deg, #0066FF 0%, #00FF88 100%)',
      },
    },
  },
  plugins: [],
}
