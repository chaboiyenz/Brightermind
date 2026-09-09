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
