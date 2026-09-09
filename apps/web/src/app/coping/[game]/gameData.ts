// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — matches
// docs/frontend-migration-plan.md module 8's MiniGameAttempt.gameSlug union.
// Per the pivot doc: "static shell + one working game interaction as a proof
// of concept" — only "defusion" has real gameplay (MiniGameCanvas.tsx);
// the other three render a calm "still being designed" placeholder in the
// same shell. No need to wait on Ticket 3 (MindManagement reconciliation)
// for a static prototype — see the pivot doc's own note on this game
// specifically.

export type GameSlug = "defusion" | "distraction" | "mind-management" | "body-scan";

export const GAME_SLUGS: GameSlug[] = ["defusion", "distraction", "mind-management", "body-scan"];

export const GAME_TITLES: Record<GameSlug, string> = {
  defusion: "Defusion",
  distraction: "Distraction",
  "mind-management": "Mind Management",
  "body-scan": "Body Scan",
};

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as string[]).includes(value);
}
