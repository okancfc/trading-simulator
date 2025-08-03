/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette that works well for both light and dark modes
        primary: {
          light: '#3B82F6', // blue-500
          DEFAULT: '#2563EB', // blue-600
          dark: '#1D4ED8', // blue-700
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
