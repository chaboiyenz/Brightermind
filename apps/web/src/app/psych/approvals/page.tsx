import { WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockPendingPsychologists } from "@/lib/mock/pendingPsychologists";
import { ApprovalQueue } from "./ApprovalQueue";

// Psychologist approvals (docs/frontend-migration-plan.md module 11; moved
// from /admin/psychologists into the workspace per
// docs/role-based-system-plan.md §0 so nothing is left behind
// while the admin role has no entry button). Prototype-only: approve/reject
// is local state, no API call — see ApprovalRow's docblock.
export default function PsychApprovalsPage() {
  const pending = getMockPendingPsychologists();

  return (
    <WorkspacePage>
      <WorkspaceHeading
        title="Psychologist approvals"
        description="Review pending applications. Approve or reject each one below. Mocked for this prototype, so decisions are not saved."
      />
      <ApprovalQueue pending={pending} />
    </WorkspacePage>
  );
}
