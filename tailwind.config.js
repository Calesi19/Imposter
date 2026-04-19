/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        apple: {
          blue: '#0071e3',
          'blue-hover': '#0077ed',
          red: '#ff3b30',
          green: '#34c759',
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#aeaeb2',
            400: '#8e8e93',
            500: '#6e6e73',
            600: '#48484a',
            700: '#3a3a3c',
            800: '#2c2c2e',
            900: '#1c1c1e',
            950: '#000000',
          },
          label: '#1d1d1f',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tight: '-0.022em',
        tighter: '-0.03em',
      },
    },
  },
  plugins: [],
}
