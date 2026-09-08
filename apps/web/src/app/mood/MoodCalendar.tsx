"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Button, Skeleton } from "@/components/ui";
import { fetchMoodEntries, type MoodEntry } from "@/lib/api";
import { MoodDayCell } from "./MoodDayCell";
import { MoodEntryModal } from "./MoodEntryModal";

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

export function MoodCalendar({ initialMonth, initialEntries }: MoodCalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["mood-entries", visibleMonth],
    queryFn: () => fetchMoodEntries(visibleMonth),
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

      {isLoading ? (
        <div className="grid grid-cols-7 gap-2" aria-label="Loading mood calendar">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-2">
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
