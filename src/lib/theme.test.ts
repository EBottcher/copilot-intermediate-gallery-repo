import { test } from "node:test";
import assert from "node:assert/strict";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  readStoredPreference,
  resolveTheme,
  storePreference,
} from "./theme.ts";

const g = globalThis as unknown as Record<string, unknown>;

function mockBrowser(storage: Partial<Storage> | null) {
  const classes = new Set<string>();
  g.window = { localStorage: storage };
  g.document = {
    documentElement: {
      style: {} as Record<string, string>,
      classList: {
        toggle: (c: string, on: boolean) => (on ? classes.add(c) : classes.delete(c)),
        has: (c: string) => classes.has(c),
      },
    },
  };
  return classes;
}

test("resolveTheme honours explicit choice and system preference", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme("system", true), "dark");
  assert.equal(resolveTheme("system", false), "light");
});

test("preference persists and invalid values fall back to system", () => {
  const data = new Map<string, string>();
  mockBrowser({
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  });
  assert.equal(readStoredPreference(), "system");
  storePreference("dark");
  assert.equal(data.get(THEME_STORAGE_KEY), "dark");
  assert.equal(readStoredPreference(), "dark");
  data.set(THEME_STORAGE_KEY, "bogus");
  assert.equal(readStoredPreference(), "system");
});

test("unavailable storage does not throw", () => {
  const throwing = () => {
    throw new Error("denied");
  };
  mockBrowser({ getItem: throwing, setItem: throwing });
  assert.equal(readStoredPreference(), "system");
  assert.doesNotThrow(() => storePreference("light"));
});

test("applyTheme toggles the dark class", () => {
  const classes = mockBrowser(null);
  applyTheme("dark");
  assert.ok(classes.has("dark"));
  applyTheme("light");
  assert.ok(!classes.has("dark"));
});
