// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/psychologists/. Shape is docs/frontend-migration-plan.md
// module 11's PsychologistSummary, unchanged. Names, specialties and bios are
// invented placeholders for design review only (ground rule 3) — none of
// these are real providers.

export type PsychologistAvailability = "available" | "unavailable" | "unknown";

export interface PsychologistSummary {
  id: number;
  name: string;
  imageUrl?: string;
  areaOfExpertise: string;
  availability: PsychologistAvailability;
}

const MOCK_PSYCHOLOGISTS: readonly PsychologistSummary[] = [
  { id: 1, name: "Dr. Amara Villanueva", areaOfExpertise: "Anxiety & stress management", availability: "available" },
  { id: 2, name: "Dr. Miguel Santos", areaOfExpertise: "Adolescent & student counselling", availability: "available" },
  { id: 3, name: "Dr. Hana Reyes", areaOfExpertise: "Cognitive behavioural therapy", availability: "unavailable" },
  { id: 4, name: "Dr. Joaquin Dela Cruz", areaOfExpertise: "Depression & mood disorders", availability: "available" },
  { id: 5, name: "Dr. Lea Mendoza", areaOfExpertise: "Grief & life transitions", availability: "unknown" },
  { id: 6, name: "Dr. Rafael Bautista", areaOfExpertise: "Sleep & burnout", availability: "unavailable" },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with a call to GET /api/v2/psychologists/ and nothing else changes.
 */
export function getMockPsychologists(): readonly PsychologistSummary[] {
  return MOCK_PSYCHOLOGISTS;
}
