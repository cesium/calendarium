module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Inter", "ui-sans-serif"],
    },
    extend: {
      spacing: {
        mobile: "calc(100vh - 5.2rem)",
      },
      colors: {
        cesium: {
          100: "#FFEDE7",
          200: "#FBE4DC",
          300: "#F9D7CA",
          400: "#F7C9B9",
          500: "#F5BCA7",
          600: "#F3AE95",
          700: "#F1A184",
          800: "#F5BCA7",
          900: "#ED8661",
        },
        highlight: "#7950ED",
        warning: "#EDC850",
        error: "#D53932",
      },
      boxShadow: {
        default: "0 0 10px rgba(0, 0, 0, 0.1)",
      },
      maxWidth: {
        "9/10": "90%",
        "8/10": "80%",
      },
    },
  },
  darkMode: "media",
  plugins: [require("@tailwindcss/forms")],
};
