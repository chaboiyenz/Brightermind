// Prototype pivot — static data, no call to
// GET /api/v2/psychologists/?status=pending. Shape is
// docs/frontend-migration-plan.md module 11's PendingPsychologist, unchanged.
// Names, license numbers and qualifications are invented placeholders for
// design review only (ground rule 3) — none of these are real applicants.

import type { PsychologistAvailability } from "./psychologists";

export interface PendingPsychologist {
  id: number;
  name: string;
  imageUrl?: string;
  areaOfExpertise: string;
  availability: PsychologistAvailability;
  licenseNumber: string;
  qualification: string;
  yearsOfExperience: number;
}

const MOCK_PENDING_PSYCHOLOGISTS: readonly PendingPsychologist[] = [
  {
    id: 101,
    name: "Dr. Celine Aquino",
    areaOfExpertise: "Trauma & PTSD",
    availability: "unknown",
    licenseNumber: "PRC-0198234",
    qualification: "PhD Clinical Psychology, Ateneo de Manila University",
    yearsOfExperience: 7,
  },
  {
    id: 102,
    name: "Dr. Benjamin Cruz",
    areaOfExpertise: "Family & couples counselling",
    availability: "unknown",
    licenseNumber: "PRC-0204591",
    qualification: "MA Psychology, University of the Philippines Diliman",
    yearsOfExperience: 4,
  },
  {
    id: 103,
    name: "Dr. Isabel Torres",
    areaOfExpertise: "Eating disorders",
    availability: "unknown",
    licenseNumber: "PRC-0176820",
    qualification: "PhD Clinical Psychology, De La Salle University",
    yearsOfExperience: 10,
  },
];

/**
 * Single swap point for the real fetch later (ground rule 5) — replace the
 * body with a call to GET /api/v2/psychologists/?status=pending and nothing
 * else changes.
 */
export function getMockPendingPsychologists(): readonly PendingPsychologist[] {
  return MOCK_PENDING_PSYCHOLOGISTS;
}
