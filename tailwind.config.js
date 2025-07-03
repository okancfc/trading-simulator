/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',     // App Router dosyaları
    './components/**/*.{js,ts,jsx,tsx}' // Tüm bileşenler
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
