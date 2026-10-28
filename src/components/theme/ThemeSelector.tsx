"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import {
  THEME_OPTIONS,
  applyTheme,
  readStoredPreference,
  resolveTheme,
  storePreference,
  type ThemePreference,
} from "@/lib/theme";

const OPTION_META = {
  light: { label: "Light", Icon: Sun },
  dark: { label: "Dark", Icon: Moon },
  system: { label: "System", Icon: Monitor },
} as const;

const DARK_QUERY = "(prefers-color-scheme: dark)";

export function ThemeSelector() {
  // Start with "system" on server and first client render to avoid hydration mismatch.
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setPreference(readStoredPreference());
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const media = window.matchMedia(DARK_QUERY);
    const update = () => applyTheme(resolveTheme(preference, media.matches));
    update();
    if (preference !== "system") return;
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [initialized, preference]);

  const select = (next: ThemePreference) => {
    storePreference(next);
    setPreference(next);
  };

  return (
    <div role="radiogroup" aria-label="Theme" className="theme-selector inline-flex rounded-lg border border-slate-300 dark:border-slate-600 p-0.5">
      {THEME_OPTIONS.map((option) => {
        const { label, Icon } = OPTION_META[option];
        const checked = preference === option;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={label}
            title={label}
            tabIndex={checked ? 0 : -1}
            onClick={() => select(option)}
            onKeyDown={(e) => {
              const i = THEME_OPTIONS.indexOf(option);
              let n = -1;
              if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % THEME_OPTIONS.length;
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i + THEME_OPTIONS.length - 1) % THEME_OPTIONS.length;
              if (n >= 0) {
                e.preventDefault();
                select(THEME_OPTIONS[n]);
                (e.currentTarget.parentElement?.children[n] as HTMLElement | undefined)?.focus();
              }
            }}
            className={`p-1.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              checked
                ? "bg-blue-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
