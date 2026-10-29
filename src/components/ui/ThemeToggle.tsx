"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);

    try {
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    } catch {
      // Theme selection still works for the current page if storage is unavailable.
    }
  };

  const Icon = isDark ? Sun : Moon;

  return (
    <button
      type="button"
      className="btn-secondary inline-flex items-center gap-2"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
