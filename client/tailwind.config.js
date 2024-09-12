/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage :{
        'bgr' : 'radial-gradient(79.46% 70.78% at 18.43% 48.12%, #000 0%, #710404 62.8%, #8B0404 85.8%, #B90000 100%);',
        'bq' : 'linear-gradient(180deg, #000 0.23%, #710404 40.29%, #8B0404 55.32%, #B90000 102.14%);'
      },
    },
  },
  plugins: [],
}