/** @type {import('tailwindcss').Config} */
module.exports = {
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
          700: "#272932",
        },
      },
    },
  },
  plugins: [],
};
