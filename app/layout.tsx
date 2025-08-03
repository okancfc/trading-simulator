import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter } from "next/font/google";
import { ThemeProviderClient } from "../components/ThemeProviderClient";
import "./globals.css";

// Note: The "use client" directive is in ThemeProviderClient to avoid conflicts with metadata export

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trading Simulator",
  description: "Realistic trading simulator for practice without real money",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProviderClient>
          {children}
          <Analytics />
        </ThemeProviderClient>
      </body>
    </html>
  );
}
