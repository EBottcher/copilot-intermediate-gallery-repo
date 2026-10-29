"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [hasExplicitTheme, setHasExplicitTheme] = useState(false);

  useEffect(() => {
    if (hasExplicitTheme) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = (nextIsDark: boolean) => {
      document.documentElement.classList.toggle("dark", nextIsDark);
      setIsDark(nextIsDark);
    };

    try {
      const theme = localStorage.getItem("theme");
      if (theme === "dark" || theme === "light") {
        updateTheme(theme === "dark");
        setHasExplicitTheme(true);
        return;
      }
    } catch {
      // Follow the system preference when storage is unavailable.
    }

    updateTheme(mediaQuery.matches);
    const handlePreferenceChange = (event: MediaQueryListEvent) => updateTheme(event.matches);
    mediaQuery.addEventListener("change", handlePreferenceChange);
    return () => mediaQuery.removeEventListener("change", handlePreferenceChange);
  }, [hasExplicitTheme]);

  const toggleTheme = () => {
    const nextIsDark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);
    setHasExplicitTheme(true);

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
      aria-label={isDark ? "Light mode" : "Dark mode"}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
      <Icon className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}
