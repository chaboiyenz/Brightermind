import { cookies } from "next/headers";
import { fetchJournalEntries, TOKEN_COOKIE, type JournalEntry } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { getMockJournalEntries } from "@/lib/mock/journalEntries";
import { JournalApp } from "./JournalApp";

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — matches
// home page.tsx's loadHeroBlock pattern: static fallback data when mock mode
// is on, real fetch otherwise, falling back to the same static data (rather
// than undefined) if that fetch errors — demo resilience if the API happens
// to be down, same as home's "on or on error" behavior.
async function loadJournalEntries(): Promise<JournalEntry[]> {
  if (isMockMode()) return getMockJournalEntries();

  // Phase 3's token cookie is same-origin (set by apps/web itself), so this
  // genuinely works now — see apps/web/src/app/mood/page.tsx for the fuller
  // explanation of what this replaced.
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  try {
    return await fetchJournalEntries(token);
  } catch {
    return getMockJournalEntries();
  }
}

export default async function JournalPage() {
  const entries = await loadJournalEntries();

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-lg font-medium text-stone-900">Journal</h1>
      <JournalApp initialEntries={entries} />
    </main>
  );
}
