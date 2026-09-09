// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/scents/. Shape is docs/frontend-migration-plan.md
// module 9's Scent, unchanged. Names/descriptions are placeholders (ground
// rule 3); imageUrl is omitted — no real asset pipeline yet, ScentPicker
// shows a soft color placeholder instead, same approach as RoutineCard.

export interface Scent {
  id: string;
  name: string;
  description: string;
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
}

export const SCENTS: Scent[] = [
  {
    id: "lavender",
    name: "Lavender",
    description: "Soft and calming — a gentler pace for winding down.",
    inhaleTime: 4,
    holdTime: 4,
    exhaleTime: 6,
  },
  {
    id: "citrus",
    name: "Citrus",
    description: "Bright and grounding — a slightly quicker, energizing pace.",
    inhaleTime: 4,
    holdTime: 2,
    exhaleTime: 4,
  },
  {
    id: "eucalyptus",
    name: "Eucalyptus",
    description: "Clear and steady — an even, balanced pace.",
    inhaleTime: 5,
    holdTime: 5,
    exhaleTime: 5,
  },
];
