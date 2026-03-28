/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: '#070b14',
          card: 'rgba(20, 31, 58, 0.45)',
          line: 'rgba(148, 163, 184, 0.2)'
        }
      },
      boxShadow: {
        glass: '0 12px 30px rgba(10, 14, 33, 0.45)'
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif']
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite'
      }
    }
  },
  plugins: []
};
