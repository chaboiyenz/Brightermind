import type { MoodEntry, MoodValue } from "@/lib/api";
import type { ModuleScores } from "./scores";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no calls to GET /api/v2/profile/me/ or /api/v2/profile/me/scores/. Shapes
// are docs/frontend-migration-plan.md module 2's Profile and ModuleScores,
// unchanged. The plan names a UserSummary type for ProfileHeader without
// spelling out its fields; this minimal version is the prototype's guess and
// is flagged in the Phase B profile PR. Name and details are invented
// placeholders (ground rule 3).

export interface UserSummary {
  id: number;
  name: string;
  username: string;
}

export interface Profile {
  image?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  phoneNumber?: string;
  grade?: string;
}

export interface ProfileSnapshot {
  user: UserSummary;
  profile: Profile;
  scores: ModuleScores;
  recentMoods: MoodEntry[];
}

const MOCK_USER: UserSummary = { id: 42, name: "Bea Castillo", username: "bea.castillo" };

const MOCK_PROFILE: Profile = {
  grade: "3rd year",
  address: "Indang, Cavite",
  instagram: "bea.c",
};

// Deliberately uneven so the ring set and trend language have something to
// say: strong on tasks/exercise, just starting on yoga.
const MOCK_SCORES: ModuleScores = {
  tasks: 21,
  defusion: 12,
  exercise: 19,
  yoga: 4,
  distraction: 9,
  mindManagement: 14,
  relaxation: 11,
  total: 90,
};

// Offsets in days before "today" -> mood. Day 3 is intentionally missing so
// the strip's empty-day state is visible in the prototype.
const MOCK_MOOD_PATTERN: readonly { daysAgo: number; mood: MoodValue; note?: string }[] = [
  { daysAgo: 6, mood: "anxious", note: "Exam week starting" },
  { daysAgo: 5, mood: "neutral" },
  { daysAgo: 4, mood: "sad", note: "Rough day" },
  { daysAgo: 2, mood: "happy", note: "Finished the big project" },
  { daysAgo: 1, mood: "excited" },
  { daysAgo: 0, mood: "happy" },
];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildRecentMoods(today: Date): MoodEntry[] {
  return MOCK_MOOD_PATTERN.map((item, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - item.daysAgo);
    return {
      id: index + 1,
      date: isoDate(date),
      mood: item.mood,
      note: item.note,
      created_at: date.toISOString(),
    };
  });
}

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with GET /api/v2/profile/me/ + /api/v2/profile/me/scores/ (and the
 * recent mood entries) and the component tree stays as-is. `today` is
 * injectable so the strip can be rendered deterministically in tests.
 */
export function getMockProfile(today: Date = new Date()): ProfileSnapshot {
  return {
    user: MOCK_USER,
    profile: MOCK_PROFILE,
    scores: MOCK_SCORES,
    recentMoods: buildRecentMoods(today),
  };
}
