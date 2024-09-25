/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          300: "#8891a2",
          400: "#363844",
          500: "#2D2F3AFF",
          600: "#2F303B",
          700: "#272932",
        },
        red: {
          800: "#B24C4C"
        }
      },
    },
  },
  plugins: [],
};
