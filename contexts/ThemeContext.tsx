"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  currentTheme: "light" | "dark"; // Actual theme applied (resolves 'system' to light/dark)
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Helper function to safely check if we're on client side
const isClient = typeof window !== "undefined";

// Helper function to safely get system preference
const getSystemTheme = (): "light" | "dark" => {
  if (!isClient) return "light";
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
};

// Helper function to safely get localStorage
const getSavedThemeMode = (): ThemeMode | null => {
  if (!isClient) return null;
  try {
    return localStorage.getItem("themeMode") as ThemeMode | null;
  } catch {
    return null;
  }
};

// Helper function to safely set localStorage
const saveThemeMode = (mode: ThemeMode) => {
  if (!isClient) return;
  try {
    localStorage.setItem("themeMode", mode);
  } catch {
    // localStorage might not be available
  }
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  const updateDocumentClass = (theme: "light" | "dark") => {
    if (!isClient) return;
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // document might not be available
    }
  };

  // Set mounted to true after first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle system theme changes with a media query
  useEffect(() => {
    if (!mounted || !isClient) return;

    let mediaQuery: MediaQueryList;
    try {
      mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    } catch {
      return;
    }

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
  }, [themeMode, mounted]);

  // Load theme from localStorage on component mount
  useEffect(() => {
    if (!mounted || !isClient) return;

    const savedThemeMode = getSavedThemeMode();

    // If user has previously set a preference, use that
    if (savedThemeMode) {
      setThemeMode(savedThemeMode);

      if (savedThemeMode === "light" || savedThemeMode === "dark") {
        setCurrentTheme(savedThemeMode);
        updateDocumentClass(savedThemeMode);
      } else {
        // For system mode, detect the system preference
        const systemTheme = getSystemTheme();
        setCurrentTheme(systemTheme);
        updateDocumentClass(systemTheme);
      }
    } else {
      // No saved preference, default to system theme
      const systemTheme = getSystemTheme();
      setCurrentTheme(systemTheme);
      updateDocumentClass(systemTheme);
    }
  }, [mounted]);

  // Apply theme when mode changes
  useEffect(() => {
    if (!mounted || !isClient) return;

    // Save to localStorage
    saveThemeMode(themeMode);

    if (themeMode === "system") {
      // Detect system preference
      const systemTheme = getSystemTheme();
      setCurrentTheme(systemTheme);
      updateDocumentClass(systemTheme);
    } else {
      // Apply specific theme
      setCurrentTheme(themeMode as "light" | "dark");
      updateDocumentClass(themeMode as "light" | "dark");
    }
  }, [themeMode, mounted]);

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
