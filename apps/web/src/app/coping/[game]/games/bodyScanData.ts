// Progressive muscle relaxation sequence (Jacobson-style, shortened for
// students between classes). Cue wording flagged for clinical sign-off.

export type BodyArea =
  | "feet"
  | "calves"
  | "thighs"
  | "stomach"
  | "hands"
  | "arms"
  | "shoulders"
  | "face";

export interface ScanStep {
  readonly area: BodyArea;
  readonly label: string;
  readonly tenseCue: string;
  readonly releaseCue: string;
}

export const SCAN_STEPS: readonly ScanStep[] = [
  { area: "feet", label: "Feet", tenseCue: "Curl your toes down and tighten your feet.", releaseCue: "Let your feet go soft and heavy." },
  { area: "calves", label: "Calves", tenseCue: "Point your toes up toward your knees.", releaseCue: "Let the calves loosen and sink." },
  { area: "thighs", label: "Thighs", tenseCue: "Press your knees together and tighten your thighs.", releaseCue: "Let your legs rest wide and loose." },
  { area: "stomach", label: "Stomach", tenseCue: "Pull your stomach in gently, as if bracing.", releaseCue: "Let your belly rise and fall on its own." },
  { area: "hands", label: "Hands", tenseCue: "Make loose fists and squeeze.", releaseCue: "Open your hands and let the fingers uncurl." },
  { area: "arms", label: "Arms", tenseCue: "Bend your elbows and tighten your upper arms.", releaseCue: "Let your arms drop and hang loose." },
  { area: "shoulders", label: "Shoulders", tenseCue: "Lift your shoulders up toward your ears.", releaseCue: "Let them drop. Feel the space in your neck." },
  { area: "face", label: "Face", tenseCue: "Scrunch your face: eyes, nose, jaw.", releaseCue: "Smooth your forehead, unclench your jaw." },
];

export const TENSE_SECONDS = 5;
export const RELEASE_SECONDS = 10;

export type ScanPhase = "tense" | "release";

export function phaseSeconds(phase: ScanPhase): number {
  return phase === "tense" ? TENSE_SECONDS : RELEASE_SECONDS;
}
