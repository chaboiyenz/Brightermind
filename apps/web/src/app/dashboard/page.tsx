import { redirect } from "next/navigation";

// Retired URL (docs/role-based-system-plan.md §3): this page moved into the
// psychologist workspace. Kept as a redirect so bookmarks keep working;
// lib/session/access.ts LEGACY_REDIRECTS mirrors it client-side.
export default function PsychologistDashboardPage() {
  redirect("/psych/inbox");
}
