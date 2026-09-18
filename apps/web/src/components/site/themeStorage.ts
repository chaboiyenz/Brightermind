// Theme persistence shared by the root layout (pre-paint script) and the
// header toggle. Resolution order is documented in globals.css: light is the
// default for everyone, and data-theme="dark" is the only way to get dark.

export type ThemeChoice = "light" | "dark";

export const THEME_STORAGE_KEY = "bm-theme";

/**
 * What a visitor gets before they touch the toggle. Light by decision, not by
 * OS preference: the product's resting state is the light sanctuary palette,
 * and a dark-mode OS should not silently override it.
 */
export const DEFAULT_THEME: ThemeChoice = "light";

export function isThemeChoice(value: unknown): value is ThemeChoice {
  return value === "light" || value === "dark";
}

export function readStoredTheme(): ThemeChoice | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemeChoice(value) ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(choice: ThemeChoice): void {
  document.documentElement.setAttribute("data-theme", choice);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    // Private browsing or blocked storage: the attribute still applies for
    // this page load, the choice just does not persist.
  }
}

// Inlined into <body> by app/layout.tsx. Kept minimal and dependency-free so
// it can run before hydration. Mirrors readStoredTheme() above.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark"){document.documentElement.setAttribute("data-theme",t);}}catch(e){}})();`;
