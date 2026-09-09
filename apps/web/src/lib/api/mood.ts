import { apiFetch, ApiError } from "./client";

// Exact shapes from docs/frontend-migration-plan.md module 3.
export type MoodValue = "happy" | "neutral" | "sad" | "excited" | "anxious";

export interface MoodEntry {
  id: number;
  date: string;
  mood: MoodValue;
  note?: string;
  created_at: string;
}

export interface CreateMoodEntryInput {
  date: string;
  mood: MoodValue;
  note?: string;
}

/** Thrown specifically for a 409 duplicate-day response, so callers (e.g.
 * MoodEntryModal) can show a targeted message without inspecting status
 * codes themselves. */
export class DuplicateMoodEntryError extends ApiError {
  constructor(message: string, body: unknown) {
    super(409, message, body);
    this.name = "DuplicateMoodEntryError";
  }
}

export async function fetchMoodEntries(month: string, token?: string): Promise<MoodEntry[]> {
  return apiFetch<MoodEntry[]>(`/v2/mood-entries/?month=${encodeURIComponent(month)}`, { token });
}

export async function createMoodEntry(input: CreateMoodEntryInput): Promise<MoodEntry> {
  try {
    return await apiFetch<MoodEntry>("/v2/mood-entries/", {
      method: "POST",
      body: JSON.stringify(input),
    });
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      throw new DuplicateMoodEntryError(error.message, error.body);
    }
    throw error;
  }
}
