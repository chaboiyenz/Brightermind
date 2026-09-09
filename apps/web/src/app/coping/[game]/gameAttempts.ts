import type { GameSlug } from "./gameData";

// Local attempt history. Stands in for POST /api/v2/games/:slug/attempts/
// (migration plan module 8) until the endpoint exists; the shape matches the
// planned MiniGameAttempt plus the fields a profile page needs to render it.
export interface GameAttempt {
  readonly gameSlug: GameSlug;
  readonly score: number;
  readonly maxScore: number;
  readonly playedAt: string;
}

export const ATTEMPTS_STORAGE_KEY = "bm_game_attempts";
const MAX_STORED_ATTEMPTS = 50;

function isAttempt(value: unknown): value is GameAttempt {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.gameSlug === "string" &&
    typeof v.score === "number" &&
    typeof v.maxScore === "number" &&
    typeof v.playedAt === "string"
  );
}

export function readAttempts(): readonly GameAttempt[] {
  try {
    const raw = window.localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isAttempt) : [];
  } catch {
    return [];
  }
}

/** Returns the new list; never mutates the stored one. */
export function appendAttempt(
  attempts: readonly GameAttempt[],
  attempt: GameAttempt
): readonly GameAttempt[] {
  return [...attempts, attempt].slice(-MAX_STORED_ATTEMPTS);
}

export function saveAttempt(attempt: GameAttempt): readonly GameAttempt[] {
  const next = appendAttempt(readAttempts(), attempt);
  try {
    window.localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable: the round still counts for this session's UI.
  }
  return next;
}

export function bestScore(attempts: readonly GameAttempt[], slug: GameSlug): number | null {
  const scores = attempts.filter((a) => a.gameSlug === slug).map((a) => a.score);
  return scores.length === 0 ? null : Math.max(...scores);
}
