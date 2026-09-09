import type { Severity } from "@/app/screening/gad7/gad7Data";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to GET /api/v2/admin/analytics/. Shape is
// docs/frontend-migration-plan.md module 15's AnalyticsSummary, unchanged.

export interface AnalyticsSummary {
  severityCounts: Record<Severity, number>;
  totalUsers: number;
  totalStaff: number;
}

const MOCK_ANALYTICS: AnalyticsSummary = {
  severityCounts: { minimal: 48, mild: 31, moderate: 19, severe: 8 },
  // Plausible placeholder counts. When this is wired for real, totalUsers
  // must come from a correct backend count — never v1's hardcoded
  // `Profile.objects.count() - 9` (docs/frontend-migration-plan.md module 15).
  totalUsers: 106,
  totalStaff: 6,
};

/**
 * Single swap point for the real fetch later (ground rule 5) — replace with
 * GET /api/v2/admin/analytics/.
 */
export function getMockAnalytics(): AnalyticsSummary {
  return MOCK_ANALYTICS;
}
