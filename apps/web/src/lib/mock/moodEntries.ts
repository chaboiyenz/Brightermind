import type { MoodEntry, MoodValue } from "@/lib/api";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD), decision (b)
// retrofit — static data, no call to GET /v2/mood-entries/. Shape is
// exactly MoodEntry from lib/api/mood.ts. Notes are invented placeholder
// content for design review only (ground rule 3).

const MOCK_DAY_MOODS: readonly { day: number; mood: MoodValue; note?: string }[] = [
  { day: 2, mood: "anxious", note: "Big exam coming up." },
  { day: 5, mood: "neutral" },
  { day: 9, mood: "happy", note: "Caught up with an old friend." },
  { day: 14, mood: "sad" },
  { day: 18, mood: "excited", note: "Finished a big assignment early." },
  { day: 23, mood: "neutral" },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Single swap point for the real fetch later (ground rule 5) — replace with
 * GET /v2/mood-entries/?month=. Scoped to whichever month is requested (not
 * hardcoded to one calendar month) so both the initial view and in-app month
 * navigation stay populated under mock mode — see MoodCalendar's queryFn.
 * Days not in MOCK_DAY_MOODS are left empty on purpose, so the calendar's
 * populated and empty-day states are both visible by default.
 */
export function getMockMoodEntries(month: string): MoodEntry[] {
  const [yearStr, monthStr] = month.split("-");
  const daysInThisMonth = new Date(Number(yearStr), Number(monthStr), 0).getDate();

  return MOCK_DAY_MOODS.filter((entry) => entry.day <= daysInThisMonth).map((entry, index) => {
    const dateStr = `${yearStr}-${monthStr}-${pad(entry.day)}`;
    return {
      id: index + 1,
      date: dateStr,
      mood: entry.mood,
      note: entry.note,
      created_at: `${dateStr}T12:00:00Z`,
    };
  });
}
