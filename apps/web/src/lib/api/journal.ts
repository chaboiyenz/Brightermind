import { apiFetch } from "./client";

export interface JournalEntry {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryInput {
  title: string;
  content: string;
}

export async function fetchJournalEntries(forwardCookie?: string): Promise<JournalEntry[]> {
  return apiFetch<JournalEntry[]>("/v2/journal-entries/", { forwardCookie });
}

export async function createJournalEntry(input: JournalEntryInput): Promise<JournalEntry> {
  return apiFetch<JournalEntry>("/v2/journal-entries/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateJournalEntry(
  id: number,
  input: Partial<JournalEntryInput>
): Promise<JournalEntry> {
  return apiFetch<JournalEntry>(`/v2/journal-entries/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteJournalEntry(id: number): Promise<void> {
  return apiFetch<void>(`/v2/journal-entries/${id}/`, { method: "DELETE" });
}
