// Common anxious thoughts students bring to the guidance office, phrased the
// way they arrive (fused). The game reframes each as "I'm having the thought
// that…", the ACT defusion move. Content flagged for clinical sign-off
// (prototype ground rule 3).
export const DEFUSION_THOUGHTS: readonly string[] = [
  "I'm going to fail this exam.",
  "Everyone else understands this but me.",
  "If I ask a question they'll think I'm stupid.",
  "I should be handling this better.",
  "I'll never catch up now.",
  "They only invited me to be polite.",
  "Something bad is about to happen.",
  "I can't cope with one more thing.",
];

export const DEFUSION_PREFIX = "I'm having the thought that…";

/** How long a leaf takes to cross the stream; also how long an untapped leaf stays. */
export const DRIFT_SECONDS = 11;
/** Delay before the very first leaf appears. */
export const FIRST_SPAWN_DELAY_MS = 400;
/** Gap between new leaves entering the stream. */
export const SPAWN_INTERVAL_MS = 3400;
/** Leaves visible at once. */
export const MAX_ACTIVE_LEAVES = 2;
/** How long the reframed wording shows before the leaf fades. */
export const RELEASE_HOLD_MS = 1300;
