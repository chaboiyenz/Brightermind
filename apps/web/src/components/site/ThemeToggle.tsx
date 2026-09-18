"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/components/ui";
import { DEFAULT_THEME, applyTheme, readStoredTheme, type ThemeChoice } from "./themeStorage";

// Light = docs/DESIGN.md "Serene Restorative Sanctuary"; dark = "Evening
// Pine". Until mounted we render a neutral button so server and client markup
// match; the stored choice is read in the effect. With nothing stored the
// theme is DEFAULT_THEME (light) regardless of the OS preference — see
// globals.css for why the OS is not followed.
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeChoice | null>(null);

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const nextTheme: ThemeChoice = theme === "dark" ? "light" : "dark";
    const button = event.currentTarget.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty("--theme-toggle-x", `${button.left + button.width / 2}px`);
    root.style.setProperty("--theme-toggle-y", `${button.top + button.height / 2}px`);

    const updateTheme = () => {
      applyTheme(nextTheme);
      setTheme(nextTheme);
    };

    const viewTransitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => void;
    };
    if (viewTransitionDocument.startViewTransition) {
      viewTransitionDocument.startViewTransition(updateTheme);
    } else {
      updateTheme();
    }
  }

  useEffect(() => {
    setTheme(readStoredTheme() ?? DEFAULT_THEME);
  }, []);

  const next: ThemeChoice = theme === "dark" ? "light" : "dark";
  const label = theme === null ? "Toggle theme" : `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun key="sun" className="theme-toggle-icon h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon key="moon" className="theme-toggle-icon h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
