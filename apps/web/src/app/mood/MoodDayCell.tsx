"use client";

// Needs to be a Client Component in practice since it takes an onClick —
// see docs/frontend-migration-plan.md module 3's note on this exact point.

import { cn } from "@/lib/cn";
import type { MoodValue } from "@/lib/api";
import { MOOD_COLOR_CLASSES } from "./moodDisplay";

interface MoodDayCellProps {
  day: number;
  mood?: MoodValue;
  isToday: boolean;
  onSelect: () => void;
}

export function MoodDayCell({ day, mood, isToday, onSelect }: MoodDayCellProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex h-20 flex-col items-center justify-center rounded-md border text-base transition-colors",
        mood ? MOOD_COLOR_CLASSES[mood] : "bg-stone-25 text-stone-700 hover:bg-stone-50",
        isToday ? "border-brand-500" : "border-stone-200"
      )}
    >
      <span className="font-medium">{day}</span>
    </button>
  );
}
