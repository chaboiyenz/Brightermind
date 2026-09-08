import { cookies } from "next/headers";
import { fetchMoodEntries, TOKEN_COOKIE, type MoodEntry } from "@/lib/api";
import { MoodCalendar } from "./MoodCalendar";

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function MoodTrackerPage() {
  const month = currentMonthKey();
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  // Phase 3 fixes the cross-origin SSR gap documented here through Phase 2:
  // the token cookie is set by apps/web itself (not apps/api), so it's a
  // same-origin cookie the Next.js server actually receives and can read —
  // unlike the old session-cookie approach, this genuinely works.
  let entries: MoodEntry[] | undefined;
  try {
    entries = await fetchMoodEntries(month, token);
  } catch {
    // Still a reasonable fallback for a logged-out visitor or a down API —
    // MoodCalendar's client-side query surfaces its own error/retry state.
    entries = undefined;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Mood Tracker</h1>
      <MoodCalendar initialMonth={month} initialEntries={entries} />
    </main>
  );
}
