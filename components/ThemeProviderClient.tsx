"use client";

import React from "react";
import { ThemeProvider } from "../contexts/ThemeContext";

export function ThemeProviderClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
