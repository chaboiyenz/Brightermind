// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no backend call. FLAGGED per ground rule 3: unlike GAD-7 (a standardized
// clinical instrument with fixed text), there's no single "correct" routine
// library — these names/descriptions/durations are placeholder content for
// design review, not a real content decision. Needs a real content pass
// (and real images — none are hosted here, RoutineCard shows a placeholder
// visual instead) before this is anything but a design prototype.

export type MovementKind = "exercise" | "yoga";

export interface Routine {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
}

export const EXERCISE_ROUTINES: Routine[] = [
  {
    id: "morning-stretch",
    name: "Morning Stretch",
    description: "A gentle full-body stretch to start the day.",
    durationSeconds: 300,
  },
  {
    id: "desk-break",
    name: "Desk Break Reset",
    description: "Short movements to counter sitting for long periods.",
    durationSeconds: 180,
  },
  {
    id: "energy-boost",
    name: "Energy Boost Circuit",
    description: "Light cardio to shake off a slump.",
    durationSeconds: 420,
  },
];

export const YOGA_ROUTINES: Routine[] = [
  {
    id: "sun-salutation",
    name: "Sun Salutation Flow",
    description: "A calm, flowing sequence to open up the body.",
    durationSeconds: 600,
  },
  {
    id: "evening-wind-down",
    name: "Evening Wind-Down",
    description: "Slow poses to ease into rest.",
    durationSeconds: 480,
  },
  {
    id: "seated-calm",
    name: "Seated Calm",
    description: "A short seated sequence for when you need a reset at your desk.",
    durationSeconds: 240,
  },
];

export function routinesForKind(kind: MovementKind): Routine[] {
  return kind === "exercise" ? EXERCISE_ROUTINES : YOGA_ROUTINES;
}
