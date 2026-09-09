import type { JournalEntry } from "@/lib/api";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD), decision (b)
// retrofit — static data, no call to GET /v2/journal-entries/. Shape is
// exactly JournalEntry from lib/api/journal.ts. Content is invented
// placeholder writing for design review only (ground rule 3) — Journal's
// empty-list state is already handled separately, so this fixture is about
// demonstrating the populated list instead.

const MOCK_JOURNAL_ENTRIES: readonly JournalEntry[] = [
  {
    id: 1,
    title: "Midterms are finally over",
    content:
      "I've been dreading this week for a month, and it's actually done. I " +
      "didn't sleep much the last few nights, but the breathing exercises " +
      "from the coping section helped me get through the anatomy exam this " +
      "morning. Going to spend the weekend doing absolutely nothing school-related.",
    created_at: "2026-09-05T21:14:00Z",
    updated_at: "2026-09-05T21:14:00Z",
  },
  {
    id: 2,
    title: "A weird, quiet Tuesday",
    content:
      "Nothing really happened today, but it was the good kind of nothing. " +
      "Went to class, ate lunch outside for once, and actually finished my " +
      "readings ahead of time. I keep forgetting that days like this count too.",
    created_at: "2026-09-08T19:02:00Z",
    updated_at: "2026-09-08T19:02:00Z",
  },
  {
    id: 3,
    title: "Talked to Dr. Villanueva today",
    content:
      "Brought up the exam stress from a few weeks ago and it helped to say " +
      "it out loud instead of just journaling about it. She suggested trying " +
      "the mood tracker daily instead of only on bad days, so I'll give that a shot.",
    created_at: "2026-09-09T08:47:00Z",
    updated_at: "2026-09-09T08:47:00Z",
  },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with GET /v2/journal-entries/.
 */
export function getMockJournalEntries(): JournalEntry[] {
  return [...MOCK_JOURNAL_ENTRIES];
}
