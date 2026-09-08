import { cookies } from "next/headers";
import { fetchJournalEntries, TOKEN_COOKIE, type JournalEntry } from "@/lib/api";
import { JournalApp } from "./JournalApp";

export default async function JournalPage() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  // Phase 3's token cookie is same-origin (set by apps/web itself), so this
  // genuinely works now — see apps/web/src/app/mood/page.tsx for the fuller
  // explanation of what this replaced.
  let entries: JournalEntry[] | undefined;
  try {
    entries = await fetchJournalEntries(token);
  } catch {
    entries = undefined;
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Journal</h1>
      <JournalApp initialEntries={entries} />
    </main>
  );
}
