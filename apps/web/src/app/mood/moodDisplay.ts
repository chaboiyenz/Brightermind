import type { MoodValue } from "@/lib/api";

export const MOOD_LABELS: Record<MoodValue, string> = {
  happy: "Happy",
  excited: "Excited",
  neutral: "Neutral",
  sad: "Sad",
  anxious: "Anxious",
};

// Soft color wash per mood (REDESIGN note in docs/frontend-migration-plan.md
// module 3) — reuses the existing design tokens, deliberately not a bare
// emoji-in-a-grid-cell.
export const MOOD_COLOR_CLASSES: Record<MoodValue, string> = {
  happy: "bg-sage-100 text-sage-600",
  excited: "bg-brand-100 text-brand-700",
  neutral: "bg-stone-100 text-stone-700",
  sad: "bg-clay-100 text-clay-600",
  anxious: "bg-brick-100 text-brick-600",
};

export const MOOD_OPTIONS: MoodValue[] = ["happy", "excited", "neutral", "sad", "anxious"];
