// Theme persistence shared by the root layout (pre-paint script) and the
// header toggle. Resolution order is documented in globals.css: no attribute
// = follow the OS, data-theme="light" / "dark" = explicit choice.

export type ThemeChoice = "light" | "dark";

export const THEME_STORAGE_KEY = "bm-theme";

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

export function systemTheme(): ThemeChoice {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
