import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Initialize with a function to avoid SSR issues
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Return initial value during SSR
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const [isHydrated, setIsHydrated] = useState(false);

  // Mark as hydrated after first render on client
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Re-sync with localStorage after hydration
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const parsedItem = JSON.parse(item);
        setStoredValue(parsedItem);
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key, isHydrated]);

  const setValue = useCallback((value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
