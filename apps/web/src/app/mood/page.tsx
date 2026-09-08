import { cookies } from "next/headers";
import { fetchMoodEntries, type MoodEntry } from "@/lib/api";
import { MoodCalendar } from "./MoodCalendar";

function currentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default async function MoodTrackerPage() {
  const month = currentMonthKey();
  const cookieStore = await cookies();

  let entries: MoodEntry[] | undefined;
  try {
    entries = await fetchMoodEntries(month, cookieStore.toString());
  } catch {
    // Known limitation, not a bug: apps/web and apps/api are different
    // origins, so the Django session cookie set for localhost:8000 is never
    // sent by the browser to this Next.js server (localhost:3000) in the
    // first place — cookieStore.toString() above has nothing real to
    // forward. This SSR fetch is therefore best-effort/anonymous until
    // Phase 3 designs real cross-origin auth (e.g. a bearer token instead
    // of cookies). MoodCalendar's client-side query is the actual data
    // source — it talks to apps/api directly from the browser, where
    // credentialed cross-origin requests do work (verified), right after
    // hydration. Net effect: a brief skeleton instead of instant SSR data.
    entries = undefined;
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Mood Tracker</h1>
      <MoodCalendar initialMonth={month} initialEntries={entries} />
    </main>
  );
}
