/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d1210",
        surface: "#16201c",
        surface2: "#1d2924",
        accent: "#ffb703",
        accent2: "#52b788",
        text: "#f1ede4",
        muted: "#9aa89f",
        line: "#2a3631",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
