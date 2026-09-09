import { cookies } from "next/headers";
import { fetchMoodEntries, TOKEN_COOKIE, type MoodEntry } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockMoodEntries } from "@/lib/mock/moodEntries";
import { MoodCalendar } from "./MoodCalendar";

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — matches
// home page.tsx's loadHeroBlock pattern: static fallback data when mock mode
// is on, real fetch otherwise, falling back to the same static data (rather
// than undefined) if that fetch errors — demo resilience if the API happens
// to be down, same as home's "on or on error" behavior.
async function loadMoodEntries(month: string): Promise<MoodEntry[]> {
  if (isMockMode()) return getMockMoodEntries(month);

  // Phase 3 fixes the cross-origin SSR gap documented here through Phase 2:
  // the token cookie is set by apps/web itself (not apps/api), so it's a
  // same-origin cookie the Next.js server actually receives and can read —
  // unlike the old session-cookie approach, this genuinely works.
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  try {
    return await fetchMoodEntries(month, token);
  } catch {
    return getMockMoodEntries(month);
  }
}

export default async function MoodTrackerPage() {
  const month = currentMonthKey();
  const entries = await loadMoodEntries(month);

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Mood Tracker</h1>
      <MoodCalendar initialMonth={month} initialEntries={entries} />
    </main>
  );
}
