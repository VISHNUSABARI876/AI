/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyan: {
          400: '#00f2fe',
          500: '#00bcd4',
        },
        purple: {
          500: '#7f00ff',
        }
      }
    },
  },
  plugins: [],
}
