// Cross-module score summary shape from docs/frontend-migration-plan.md
// module 2 (Profile). Lives here rather than under a route so the admin
// patient list (module 15's ScoreSummaryCell "reuses module 2's aggregation
// data shape") and the future /profile page share one definition.
export interface ModuleScores {
  tasks: number;
  defusion: number;
  exercise: number;
  yoga: number;
  distraction: number;
  mindManagement: number;
  relaxation: number;
  total: number;
}

export const MODULE_SCORE_KEYS: readonly (keyof Omit<ModuleScores, "total">)[] = [
  "tasks",
  "defusion",
  "exercise",
  "yoga",
  "distraction",
  "mindManagement",
  "relaxation",
] as const;

export const MODULE_SCORE_LABELS: Record<keyof Omit<ModuleScores, "total">, string> = {
  tasks: "Tasks",
  defusion: "Defusion",
  exercise: "Exercise",
  yoga: "Yoga",
  distraction: "Distraction",
  mindManagement: "Mind mgmt",
  relaxation: "Relaxation",
};

// Per-module ceiling used to normalise raw points onto ScoreRing's 0-100
// scale. Prototype placeholder: the real ceiling belongs to module 2's
// /scores/ endpoint contract, not the frontend. Shared by the admin patient
// list and the profile page so both present the same points identically.
export const MODULE_SCORE_MAX = 25;

export function scoreToPercent(value: number): number {
  const clamped = Math.max(0, Math.min(MODULE_SCORE_MAX, value));
  return Math.round((clamped / MODULE_SCORE_MAX) * 100);
}
