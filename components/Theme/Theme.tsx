import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface IThemeContextProps {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}
const ThemeContext = createContext({} as IThemeContextProps);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children, initialState = "light" }) => {
  const [theme, setTheme] = useState(initialState as Theme);

  const isDark = theme === "dark";

  useEffect(() => {
    const fetchTheme = localStorage.getItem("theme") as Theme;
    setTheme(fetchTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((mode) => (mode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
