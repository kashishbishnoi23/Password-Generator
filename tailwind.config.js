/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'bg-gray': "#24232B",
        'green': "#A4FFAF",
        'bg-black': '#18171F',
        'yellow':'#F6CD64'
      }
      
    },
  },
  plugins: [],
}