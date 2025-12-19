/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'rgb(183, 43, 24)',
          yellow: 'rgb(250, 187, 37)',
          orange: 'rgb(237, 104, 67)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

