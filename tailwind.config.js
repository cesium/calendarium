module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        mobile: "calc(100vh - 5.2rem)",
      },
      colors: {
        cesium: {
          400: "#ed7950",
          500: "#b55b3b",
        },
      },
      boxShadow: {
        default: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  darkMode: "media",
  plugins: [require("@tailwindcss/forms")],
};
