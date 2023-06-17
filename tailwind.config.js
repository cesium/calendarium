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
        cesium: "#ed7950",
      },
    },
  },
  darkMode: "media",
  plugins: [],
};
