const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  variants: {
    extend: {
      borderRadius: ['hover'],
    },
  },
  theme: {
    extend: {
      screens: {
        'tb': '640px',
        // => @media (min-width: 640px) { ... }
  
        'lp': '1244px',
        // => @media (min-width: 1024px) { ... }
  
        'dp': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      fontWeight: {
        light: 1,
      },
      colors: {
        primary: {
          900: '#060d17',
          800: '#0c1829',
          700: '#121f33',
          600: '#1a293e',
          400: '#25354b',
          300: '#36404f',
          200: '#6f757e',
          100: '#e8eaee',
        },
      },
      keyframes: {
        fadeJump: {
          '0%': { opacity: '0', transform: 'translateY(-15%)'},
          '7%': { opacity: '100', transform: 'translateY(0%)'},
        },
        fade: {
          '0%': { opacity: '0'},
          '20%': { opacity: '100'},
        }
      },
      animation: {
        fadeJump: 'fadeJump 1s ease-in',
        fade: 'fade 1s ease-in',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar'),
  ],
}