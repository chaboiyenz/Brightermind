"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@/components/ui";
import type { MoodEntry, MoodValue } from "@/lib/api";
import { MOOD_COLOR_CLASSES, MOOD_LABELS } from "@/app/mood/moodDisplay";

const DAYS_SHOWN = 7;
const WEEKDAY_INITIALS = ["S", "M", "T", "W", "T", "F", "S"] as const;

interface StripDay {
  date: string;
  weekday: string;
  entry?: MoodEntry;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildStrip(recentMoods: MoodEntry[], today: Date): StripDay[] {
  const byDate = new Map(recentMoods.map((entry) => [entry.date, entry]));
  return Array.from({ length: DAYS_SHOWN }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (DAYS_SHOWN - 1 - index));
    const iso = isoDate(date);
    return { date: iso, weekday: WEEKDAY_INITIALS[date.getUTCDay()], entry: byDate.get(iso) };
  });
}

function mostCommonMood(recentMoods: MoodEntry[]): MoodValue | null {
  if (recentMoods.length === 0) return null;
  const counts = recentMoods.reduce<Partial<Record<MoodValue, number>>>(
    (acc, entry) => ({ ...acc, [entry.mood]: (acc[entry.mood] ?? 0) + 1 }),
    {}
  );
  return (Object.entries(counts) as [MoodValue, number][]).sort((a, b) => b[1] - a[1])[0][0];
}

function summary(recentMoods: MoodEntry[]): string {
  const top = mostCommonMood(recentMoods);
  if (!top) return "No check-ins yet this week. A quick one takes a few seconds.";
  const logged = recentMoods.length;
  return `Mostly ${MOOD_LABELS[top].toLowerCase()} this week, with ${logged} of ${DAYS_SHOWN} days checked in.`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

interface MoodSnapshotProps {
  recentMoods: MoodEntry[];
  /** ISO date (YYYY-MM-DD) for the strip's last day; passed from the server so
   * server and client agree and hydration stays stable. */
  today: string;
}

// Client component (module 2, REDESIGN): a soft 7-day strip with hover/focus
// detail, not the full calendar from /mood and not a raw list of entries.
// Reuses /mood's color wash so the same mood looks the same everywhere.
export function MoodSnapshot({ recentMoods, today }: MoodSnapshotProps) {
  const [active, setActive] = useState<string | null>(null);
  const strip = buildStrip(recentMoods, new Date(`${today}T00:00:00Z`));
  const activeDay = strip.find((day) => day.date === active);
  // Summarise only the seven days on screen, so a caller that passes a whole
  // month of entries (as the real /mood-entries/?month= fetch does) still
  // reads "this week" correctly.
  const shownEntries = strip.flatMap((day) => (day.entry ? [day.entry] : []));

  return (
    <Card>
      <CardHeader className="flex-col items-start gap-1">
        <CardTitle>This week&apos;s mood</CardTitle>
        <p className="text-sm text-stone-600">{summary(shownEntries)}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <ol className="grid grid-cols-7 gap-2" aria-label="Mood for the last seven days">
          {strip.map((day) => {
            const label = day.entry
              ? `${formatDate(day.date)}: ${MOOD_LABELS[day.entry.mood]}`
              : `${formatDate(day.date)}: no check-in`;
            return (
              <li key={day.date} className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  aria-label={label}
                  onMouseEnter={() => setActive(day.date)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(day.date)}
                  onBlur={() => setActive(null)}
                  className={cn(
                    "h-10 w-full rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    day.entry
                      ? MOOD_COLOR_CLASSES[day.entry.mood]
                      : "border-dashed border-stone-300 bg-stone-25",
                    active === day.date ? "border-brand-500" : "border-transparent"
                  )}
                />
                <span className="text-xs text-stone-600" aria-hidden="true">
                  {day.weekday}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="min-h-[1.25rem] text-xs text-stone-600" aria-live="polite">
          {activeDay
            ? activeDay.entry
              ? `${formatDate(activeDay.date)}: ${MOOD_LABELS[activeDay.entry.mood]}${activeDay.entry.note ? ` — ${activeDay.entry.note}` : ""}`
              : `${formatDate(activeDay.date)}: no check-in`
            : "Hover or focus a day for details."}
        </p>
      </CardContent>
    </Card>
  );
}
