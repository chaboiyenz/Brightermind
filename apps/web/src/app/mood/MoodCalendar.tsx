"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button, Skeleton } from "@/components/ui";
import { fetchMoodEntries, type MoodEntry } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockMoodEntries } from "@/lib/mock/moodEntries";
import { MoodDayCell } from "./MoodDayCell";
import { MoodEntryModal } from "./MoodEntryModal";
import { MOOD_COLOR_CLASSES, MOOD_LABELS, MOOD_OPTIONS } from "./moodDisplay";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MoodCalendarProps {
  initialMonth: string; // YYYY-MM
  initialEntries?: MoodEntry[];
}

function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [year, month] = monthKey.split("-").map(Number);
  return { year, month };
}

function shiftMonth(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey);
  const shifted = new Date(year, month - 1 + delta, 1);
  return `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}`;
}

function daysInMonth(monthKey: string): number {
  const { year, month } = parseMonthKey(monthKey);
  return new Date(year, month, 0).getDate();
}

// Which weekday (0 = Sunday) the 1st of the month falls on — without this,
// every month's day 1 rendered in the grid's top-left cell regardless of
// its actual weekday, so the calendar didn't line up with a real calendar
// at all.
function firstWeekdayOfMonth(monthKey: string): number {
  const { year, month } = parseMonthKey(monthKey);
  return new Date(year, month - 1, 1).getDay();
}

export function MoodCalendar({ initialMonth, initialEntries }: MoodCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Mock-mode retrofit: month navigation re-queries by queryKey, so the
  // fetch itself (not just the SSR initialData) has to stay mock-aware —
  // otherwise switching months here would hit the real API even under
  // NEXT_PUBLIC_MOCK_MODE=true.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mood-entries", visibleMonth],
    queryFn: () =>
      isMockMode() ? Promise.resolve(getMockMoodEntries(visibleMonth)) : fetchMoodEntries(visibleMonth),
    initialData: visibleMonth === initialMonth ? initialEntries : undefined,
  });

  const entriesByDate = useMemo(() => {
    const map = new Map<string, MoodEntry>();
    (data ?? []).forEach((entry) => map.set(entry.date, entry));
    return map;
  }, [data]);

  const today = new Date().toISOString().slice(0, 10);
  const { year, month } = parseMonthKey(visibleMonth);
  const totalDays = daysInMonth(visibleMonth);
  const leadingBlanks = firstWeekdayOfMonth(visibleMonth);
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setVisibleMonth((m) => shiftMonth(m, -1))}>
          ← Previous
        </Button>
        <h2 className="text-base font-medium text-stone-900">{monthLabel}</h2>
        <Button variant="ghost" size="sm" onClick={() => setVisibleMonth((m) => shiftMonth(m, 1))}>
          Next →
        </Button>
      </div>

      {isError && (
        <div className="flex items-center justify-between rounded-md border border-brick-100 bg-brick-50 p-3 text-sm text-brick-600">
          <span>Couldn&apos;t load this month&apos;s entries.</span>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* Weekday header — without this (and the leading blanks below) dates
          didn't line up with real weekdays at all; day 1 always rendered in
          the grid's top-left cell no matter what day it actually fell on. */}
      <div className="grid grid-cols-7 gap-3" aria-hidden="true">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium uppercase tracking-wide text-stone-600">
            {label}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-7 gap-3" aria-label="Loading mood calendar">
          {Array.from({ length: 42 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: leadingBlanks }).map((_, i) => (
            <div key={`blank-${i}`} aria-hidden="true" />
          ))}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            return (
              <MoodDayCell
                key={dateStr}
                day={day}
                mood={entriesByDate.get(dateStr)?.mood}
                isToday={dateStr === today}
                onSelect={() => setSelectedDate(dateStr)}
              />
            );
          })}
        </div>
      )}

      {/* Legend — the day cells convey mood purely through a color wash
          (moodDisplay.ts), which had no explanation anywhere on the page. */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-stone-200 pt-4">
        {MOOD_OPTIONS.map((option) => (
          <div key={option} className="flex items-center gap-1.5 text-xs text-stone-600">
            <span
              aria-hidden="true"
              className={`h-3 w-3 rounded-sm ${MOOD_COLOR_CLASSES[option].split(" ")[0]}`}
            />
            {MOOD_LABELS[option]}
          </div>
        ))}
      </div>

      {selectedDate && (
        <MoodEntryModal
          open={selectedDate !== null}
          onOpenChange={(open) => !open && setSelectedDate(null)}
          date={selectedDate}
          monthKey={visibleMonth}
        />
      )}
    </div>
  );
}
