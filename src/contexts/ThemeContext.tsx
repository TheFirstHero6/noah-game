"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Theme =
  | "royal-court"
  | "forest-kingdom"
  | "mystical-wizard"
  | "dragons-lair";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("royal-court");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from database on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const response = await fetch("/api/dashboard/theme");
        if (response.ok) {
          const data = await response.json();
          setThemeState(data.theme);
        } else {
          // Fallback to localStorage
          const savedTheme = localStorage.getItem("medieval-theme") as Theme;
          if (
            savedTheme &&
            [
              "royal-court",
              "forest-kingdom",
              "mystical-wizard",
              "dragons-lair",
            ].includes(savedTheme)
          ) {
            setThemeState(savedTheme);
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to localStorage
        const savedTheme = localStorage.getItem("medieval-theme") as Theme;
        if (
          savedTheme &&
          [
            "royal-court",
            "forest-kingdom",
            "mystical-wizard",
            "dragons-lair",
          ].includes(savedTheme)
        ) {
          setThemeState(savedTheme);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!isLoading) {
      console.log("Applying theme:", theme);
      // Remove all theme classes
      document.documentElement.classList.remove(
        "royal-court",
        "forest-kingdom",
        "mystical-wizard",
        "dragons-lair"
      );
      // Add current theme class
      document.documentElement.classList.add(theme);
      console.log(
        "Document classes:",
        document.documentElement.classList.toString()
      );

      // Save to localStorage
      localStorage.setItem("medieval-theme", theme);
    }
  }, [theme, isLoading]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    // Only save to localStorage for immediate UI updates
    localStorage.setItem("medieval-theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
