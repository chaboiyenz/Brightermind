/**
 * Prototype pivot (.references/roadmap/prototype-roadmap.MD): every page
 * built under that track uses static/mock data instead of real API calls,
 * and a static role switcher instead of real login. This flag is the single
 * on/off switch for that — set NEXT_PUBLIC_MOCK_MODE=true to demo the
 * prototype pages with zero backend running.
 */
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_MOCK_MODE === "true";
}
