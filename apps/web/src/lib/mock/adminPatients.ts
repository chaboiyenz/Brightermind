import type { Severity } from "@/app/screening/gad7/gad7Data";
import type { ModuleScores } from "./scores";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/admin/patients/. Shape is
// docs/frontend-migration-plan.md module 15's PatientRow, unchanged (named
// PatientRowData here only because the component is also called PatientRow).
// Names are invented placeholders (ground rule 3).

export interface PatientRowData {
  userId: number;
  name: string;
  latestSeverity: Severity;
  scoreSummary: ModuleScores;
}

function scores(partial: Omit<ModuleScores, "total">): ModuleScores {
  const total = Object.values(partial).reduce((sum, value) => sum + value, 0);
  return { ...partial, total };
}

const MOCK_PATIENTS: readonly PatientRowData[] = [
  {
    userId: 1,
    name: "Bea Castillo",
    latestSeverity: "moderate",
    scoreSummary: scores({ tasks: 12, defusion: 8, exercise: 15, yoga: 6, distraction: 9, mindManagement: 11, relaxation: 7 }),
  },
  {
    userId: 2,
    name: "Carlo Navarro",
    latestSeverity: "severe",
    scoreSummary: scores({ tasks: 4, defusion: 3, exercise: 2, yoga: 0, distraction: 5, mindManagement: 6, relaxation: 3 }),
  },
  {
    userId: 3,
    name: "Dana Lim",
    latestSeverity: "mild",
    scoreSummary: scores({ tasks: 20, defusion: 14, exercise: 18, yoga: 12, distraction: 10, mindManagement: 16, relaxation: 13 }),
  },
  {
    userId: 4,
    name: "Eli Fernandez",
    latestSeverity: "minimal",
    scoreSummary: scores({ tasks: 25, defusion: 19, exercise: 22, yoga: 20, distraction: 17, mindManagement: 21, relaxation: 18 }),
  },
  {
    userId: 5,
    name: "Faye Ocampo",
    latestSeverity: "mild",
    scoreSummary: scores({ tasks: 9, defusion: 11, exercise: 7, yoga: 14, distraction: 6, mindManagement: 8, relaxation: 12 }),
  },
  {
    userId: 6,
    name: "Gio Ramos",
    latestSeverity: "moderate",
    scoreSummary: scores({ tasks: 7, defusion: 5, exercise: 10, yoga: 3, distraction: 8, mindManagement: 4, relaxation: 6 }),
  },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace with
 * GET /api/v2/admin/patients/. The N+1 query the audit flagged in v1's
 * viewpatient is the backend's problem to fix before that swap, not this
 * component's.
 */
export function getMockPatients(): readonly PatientRowData[] {
  return MOCK_PATIENTS;
}
