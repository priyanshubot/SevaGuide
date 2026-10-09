/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amoled: {
          bg: '#000000',
          card: '#0a0a0a',
          cardElevated: '#121212',
          border: '#1f1f1f',
          borderSubtle: '#141414',
          hover: '#171717',
          input: '#0d0d0d',
        },
      },
    },
  },
  plugins: [],
};