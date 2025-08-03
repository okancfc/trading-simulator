"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: "light" | "dark"; // Actual theme applied (resolves 'system' to light/dark)
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Handle system theme changes with a media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (themeMode === "system") {
        const newTheme = e.matches ? "dark" : "light";
        setCurrentTheme(newTheme);
        updateDocumentClass(newTheme);
      }
    };

    // Initial check
    handleSystemThemeChange(mediaQuery);
    
    // Listen for changes
    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, [themeMode]);

  // Load theme from localStorage on component mount
  useEffect(() => {
    const savedThemeMode = localStorage.getItem("themeMode") as ThemeMode | null;
    
    // If user has previously set a preference, use that
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);
      
      if (savedThemeMode === "light" || savedThemeMode === "dark") {
        setCurrentTheme(savedThemeMode);
        updateDocumentClass(savedThemeMode);
      } else {
        // For system mode, detect the system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const systemTheme = prefersDark ? "dark" : "light";
        setCurrentTheme(systemTheme);
        updateDocumentClass(systemTheme);
      }
    } else {
      // No saved preference, default to system theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setCurrentTheme(systemTheme);
      updateDocumentClass(systemTheme);
      // Don't save to localStorage yet - this is just the default
    }
  }, []);

  // Apply theme when mode changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("themeMode", themeMode);
    
    if (themeMode === "system") {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setCurrentTheme(systemTheme);
      updateDocumentClass(systemTheme);
    } else {
      // Apply specific theme
      setCurrentTheme(themeMode as "light" | "dark");
      updateDocumentClass(themeMode as "light" | "dark");
    }
  }, [themeMode]);

  const updateDocumentClass = (theme: "light" | "dark") => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, currentTheme, setThemeMode }}>
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
