import { WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockPatients } from "@/lib/mock/patients";
import { getMockUpcomingSessions } from "@/lib/mock/sessions";
import { PatientsTable } from "./PatientsTable";

// Caseload list (docs/role-based-system-plan.md §3, moved from
// /admin/patients and extended): filters, latest screening, seven-day mood,
// last activity, next session, and per-row actions. Server component; the
// table is a client component for the filter chips.
export default function PsychPatientsPage() {
  const patients = getMockPatients();
  const upcoming = getMockUpcomingSessions();

  return (
    <WorkspacePage>
      <WorkspaceHeading
        title="Patients"
        description="Everyone you are working with, their most recent screening, and how their week has been."
      />
      <PatientsTable patients={patients} upcomingSessions={upcoming} />
    </WorkspacePage>
  );
}
