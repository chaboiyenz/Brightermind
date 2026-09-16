import type { Severity } from "@/app/screening/gad7/gad7Data";
import type { ModuleScores } from "./scores";

// Prototype pivot — static caseload for the psychologist workspace
// (docs/role-based-system-plan.md §3, /psych/patients and /psych/patients/[id]).
// Supersedes adminPatients.ts. Names, scores and notes are invented
// placeholders for design review only (ground rule 3); none are real people.
//
// Patient ids live in the 200s so they never collide with psychologist ids
// (1–6): both are used as the partner id in /messages/[partnerId] and the
// session id in /call/[sessionId].

export type ScreeningSeverity = Severity | "moderately-severe";
export type ScreeningInstrument = "GAD-7" | "PHQ-9" | "DASS-21" | "WHO-5";

export interface ScreeningResult {
  readonly instrument: ScreeningInstrument;
  readonly severity: ScreeningSeverity;
  readonly score: number;
  /** ISO date (YYYY-MM-DD). */
  readonly date: string;
}

/** Mood value 1–5 (see MOOD_LEVELS in components/home/homeContent.ts), or null for no entry. */
export type MoodPoint = 1 | 2 | 3 | 4 | 5 | null;

export interface PatientRecord {
  readonly id: number;
  readonly name: string;
  readonly yearLevel: string;
  readonly location: string;
  readonly since: string;
  readonly lastActiveLabel: string;
  readonly screenings: readonly ScreeningResult[];
  /** Last seven days, oldest first. */
  readonly moodLast7: readonly MoodPoint[];
  readonly scores: ModuleScores;
  readonly needsAttention?: string;
}

function scores(partial: Omit<ModuleScores, "total">): ModuleScores {
  const total = Object.values(partial).reduce((sum, value) => sum + value, 0);
  return { ...partial, total };
}

const MOCK_PATIENTS: readonly PatientRecord[] = [
  {
    id: 201,
    name: "Bea Castillo",
    yearLevel: "3rd year",
    location: "Indang, Cavite",
    since: "August 2026",
    lastActiveLabel: "Today",
    screenings: [
      { instrument: "GAD-7", severity: "mild", score: 7, date: "2026-09-02" },
      { instrument: "PHQ-9", severity: "minimal", score: 4, date: "2026-08-20" },
      { instrument: "WHO-5", severity: "minimal", score: 68, date: "2026-08-05" },
    ],
    moodLast7: [3, 4, 3, 4, 3, 2, 4],
    scores: scores({ tasks: 12, defusion: 18, exercise: 15, yoga: 6, distraction: 9, mindManagement: 10, relaxation: 7 }),
  },
  {
    id: 202,
    name: "Carlo Navarro",
    yearLevel: "2nd year",
    location: "Trece Martires, Cavite",
    since: "July 2026",
    lastActiveLabel: "Yesterday",
    screenings: [
      { instrument: "PHQ-9", severity: "moderately-severe", score: 17, date: "2026-09-15" },
      { instrument: "PHQ-9", severity: "mild", score: 8, date: "2026-08-25" },
      { instrument: "GAD-7", severity: "moderate", score: 12, date: "2026-08-10" },
    ],
    moodLast7: [3, 2, 2, 2, 1, 2, 1],
    scores: scores({ tasks: 4, defusion: 3, exercise: 2, yoga: 0, distraction: 5, mindManagement: 6, relaxation: 3 }),
    needsAttention:
      "PHQ-9 rose from mild to moderately severe over two checks. Consider bringing the next session forward.",
  },
  {
    id: 203,
    name: "Dana Lim",
    yearLevel: "1st year",
    location: "Dasmariñas, Cavite",
    since: "September 2026",
    lastActiveLabel: "Today",
    screenings: [
      { instrument: "GAD-7", severity: "mild", score: 6, date: "2026-09-16" },
      { instrument: "WHO-5", severity: "minimal", score: 72, date: "2026-09-03" },
    ],
    moodLast7: [2, 3, 3, 4, 4, 5, 5],
    scores: scores({ tasks: 20, defusion: 14, exercise: 18, yoga: 12, distraction: 10, mindManagement: 16, relaxation: 13 }),
  },
  {
    id: 204,
    name: "Eli Fernandez",
    yearLevel: "4th year",
    location: "Tagaytay",
    since: "September 2026",
    lastActiveLabel: "2 days ago",
    screenings: [{ instrument: "WHO-5", severity: "minimal", score: 76, date: "2026-09-15" }],
    moodLast7: [null, null, null, null, 4, 4, 3],
    scores: scores({ tasks: 3, defusion: 0, exercise: 2, yoga: 0, distraction: 0, mindManagement: 0, relaxation: 1 }),
  },
  {
    id: 205,
    name: "Faye Ocampo",
    yearLevel: "3rd year",
    location: "Silang, Cavite",
    since: "June 2026",
    lastActiveLabel: "5 days ago",
    screenings: [],
    moodLast7: [3, 3, null, 4, null, null, 2],
    scores: scores({ tasks: 9, defusion: 11, exercise: 7, yoga: 14, distraction: 6, mindManagement: 8, relaxation: 12 }),
  },
  {
    id: 206,
    name: "Gio Ramos",
    yearLevel: "2nd year",
    location: "General Trias, Cavite",
    since: "May 2026",
    lastActiveLabel: "3 days ago",
    screenings: [
      { instrument: "DASS-21", severity: "moderate", score: 21, date: "2026-09-10" },
      { instrument: "GAD-7", severity: "moderate", score: 11, date: "2026-08-14" },
    ],
    moodLast7: [2, 3, 3, 2, 3, 3, 3],
    scores: scores({ tasks: 7, defusion: 5, exercise: 10, yoga: 3, distraction: 8, mindManagement: 4, relaxation: 6 }),
  },
];

/** Single swap point for the real fetch later (GET /api/v2/psychologists/me/patients/). */
export function getMockPatients(): readonly PatientRecord[] {
  return MOCK_PATIENTS;
}

export function getMockPatient(id: number): PatientRecord | null {
  return MOCK_PATIENTS.find((patient) => patient.id === id) ?? null;
}

export function latestScreening(patient: PatientRecord): ScreeningResult | null {
  return patient.screenings[0] ?? null;
}

/** Every screening across the caseload, newest first, with the patient attached. */
export function getMockRecentScreenings(): readonly (ScreeningResult & { patient: PatientRecord })[] {
  return MOCK_PATIENTS.flatMap((patient) =>
    patient.screenings.map((screening) => ({ ...screening, patient }))
  ).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export const SEVERITY_LABELS: Record<ScreeningSeverity, string> = {
  minimal: "Minimal",
  mild: "Mild",
  moderate: "Moderate",
  "moderately-severe": "Moderately severe",
  severe: "Severe",
};
