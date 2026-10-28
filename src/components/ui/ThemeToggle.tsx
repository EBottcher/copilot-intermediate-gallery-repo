'use client';

import { useEffect, useState, type ChangeEvent } from 'react';

type Theme = 'light' | 'dark' | 'system';

const storageKey = 'photo-gallery-theme';

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system';
}

function applyTheme(theme: Theme) {
  const isDark = theme === 'dark' || (
    theme === 'system' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    let savedTheme: Theme = 'system';
    try {
      const storedTheme = localStorage.getItem(storageKey);
      if (isTheme(storedTheme)) {
        savedTheme = storedTheme;
      }
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }

    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => applyTheme('system');
    mediaQuery.addEventListener('change', syncTheme);
    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, [theme]);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTheme = event.target.value;
    if (!isTheme(nextTheme)) {
      return;
    }

    setTheme(nextTheme);

    try {
      localStorage.setItem(storageKey, nextTheme);
    } catch {
      // The selected theme still applies for this session.
    }

    applyTheme(nextTheme);
  };

  return (
    <select
      aria-label="Color theme"
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
      onChange={handleChange}
      value={theme}
    >
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
