"use client";

import { useCallback, useSyncExternalStore } from "react";
import { cn } from "@/components/ui";

// One availability value shared by the sidebar, top bar, inbox and settings
// (docs/role-based-system-plan.md §2). Prototype: kept in localStorage and
// broadcast with a custom event so every switch on the page agrees. When
// wired for real this becomes ONE current-status field on the psychologist
// (PATCH /api/v2/psychologists/me/availability/), never a log of rows.

export const AVAILABILITY_STORAGE_KEY = "bm_psych_available";
const CHANGE_EVENT = "bm-availability-change";

function readAvailable(): boolean {
  try {
    return window.localStorage.getItem(AVAILABILITY_STORAGE_KEY) !== "false";
  } catch {
    return true;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useAvailability(): { isAvailable: boolean; setAvailable: (next: boolean) => void } {
  const isAvailable = useSyncExternalStore(subscribe, readAvailable, () => true);
  const setAvailable = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(AVAILABILITY_STORAGE_KEY, next ? "true" : "false");
    } catch {
      // best-effort only
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);
  return { isAvailable, setAvailable };
}

// A DESIGN.md-style toggle: 40×24 pill, sage fill when on, stone when off.
export function AvailabilitySwitch({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const { isAvailable, setAvailable } = useAvailability();
  const label = isAvailable ? "Taking new conversations" : "Not taking new conversations";

  return (
    <label className={cn("flex items-center justify-between gap-3", className)}>
      <span className={cn("text-stone-700", compact ? "text-[13px]" : "text-sm")}>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isAvailable}
        aria-label="Available for new conversations"
        onClick={() => setAvailable(!isAvailable)}
        className={cn(
          "relative inline-flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50",
          isAvailable ? "bg-brand-300" : "bg-stone-300"
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            "h-5 w-5 rounded-full bg-stone-25 shadow-soft transition-transform duration-200 ease-gentle",
            isAvailable ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>
    </label>
  );
}

/** Read-only pill for the top bar. */
export function AvailabilityPill({ className }: { className?: string }) {
  const { isAvailable } = useAvailability();
  return (
    <span
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border px-3.5 font-display text-label-md",
        isAvailable
          ? "border-brand-300 bg-brand-300/20 text-stone-800"
          : "border-stone-200 bg-stone-25 text-stone-700",
        className
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-2 w-2 rounded-full", isAvailable ? "bg-sage-500" : "bg-stone-300")}
      />
      {isAvailable ? "Available" : "Unavailable"}
    </span>
  );
}
