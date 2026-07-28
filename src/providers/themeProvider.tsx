"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

function themeChecker() {
  if (typeof window === "undefined") {
    // localStorage.setItem("theme", "light");
    return "light"; // Default theme during SSR
  }

  return localStorage.getItem("theme") === "dark"
    ? "dark"
    : "light";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemesProvider
      attribute="class"
       defaultTheme={themeChecker()}
      enableSystem={false}
      storageKey="desixyz-theme"
    >
      {children}
    </NextThemesProvider>
  );
}