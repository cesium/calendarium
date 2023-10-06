// DarkModeContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for context and props
interface DarkModeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

interface DarkModeProviderProps {
  children: ReactNode;
}

// Create a new context
const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

// Create a context provider component
export function DarkModeProvider({ children }: DarkModeProviderProps) {
  // Initialize the dark mode state with a default value
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem("theme",isDarkMode? "dark":"light")
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Create a custom hook for using the context
export function useDarkMode(): DarkModeContextType {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
}
