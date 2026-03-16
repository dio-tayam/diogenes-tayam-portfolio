/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
      },
      colors: {
        primary: "#6366f1",
        "primary-dark": "#4f46e5",
        secondary: "#ec4899",
        accent: "#f59e0b",
      },
    },
  },
  plugins: [],
};