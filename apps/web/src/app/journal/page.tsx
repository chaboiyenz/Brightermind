import { cookies } from "next/headers";
import { fetchJournalEntries, type JournalEntry } from "@/lib/api";
import { JournalApp } from "./JournalApp";

export default async function JournalPage() {
  const cookieStore = await cookies();

  let entries: JournalEntry[] | undefined;
  try {
    entries = await fetchJournalEntries(cookieStore.toString());
  } catch {
    // Same cross-origin cookie limitation documented in apps/web/src/app/mood/page.tsx —
    // JournalApp's client-side query is the real data source.
    entries = undefined;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Journal</h1>
      <JournalApp initialEntries={entries} />
    </main>
  );
}
