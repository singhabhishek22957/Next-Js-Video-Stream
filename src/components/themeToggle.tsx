
"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedTheme = localStorage.getItem("theme");

    const isDark =
      savedTheme === "dark" ||
      (!savedTheme &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList.toggle("dark", isDark);

    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !dark;

    setDark(newTheme);

    document.documentElement.classList.toggle("dark", newTheme);

    localStorage.setItem(
      "theme",
      newTheme ? "dark" : "light"
    );
  };

  if (!mounted) {
    return (
      <button className="p-2">
        <Sun size={18} />
      </button>
    );
  }

  return (
    <button onClick={toggleTheme} className="p-2">
      {dark ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}