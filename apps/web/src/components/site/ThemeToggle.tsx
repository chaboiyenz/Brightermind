"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/components/ui";
import { applyTheme, readStoredTheme, systemTheme, type ThemeChoice } from "./themeStorage";

const DARK_QUERY = "(prefers-color-scheme: dark)";

// Light = docs/DESIGN.md "Serene Restorative Sanctuary"; dark = "Evening
// Pine". Until mounted we render a neutral button so server and client markup
// match; the real theme is read from storage / the OS in the effect. While no
// explicit choice is stored, the icon follows live OS theme changes too.
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeChoice | null>(null);

  useEffect(() => {
    setTheme(readStoredTheme() ?? systemTheme());

    const media = window.matchMedia(DARK_QUERY);
    const followSystem = () => {
      if (readStoredTheme() === null) setTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const next: ThemeChoice = theme === "dark" ? "light" : "dark";
  const label = theme === null ? "Toggle theme" : `Switch to ${next} mode`;

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(next);
        setTheme(next);
      }}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition-colors hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" aria-hidden="true" />
      ) : (
        <Moon className="h-[18px] w-[18px]" aria-hidden="true" />
      )}
    </button>
  );
}
