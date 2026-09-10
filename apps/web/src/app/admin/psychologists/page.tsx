import { RestrictedPageNotice } from "@/components/RestrictedPageNotice";
import { RoleGate } from "@/components/ui";
import { getMockPendingPsychologists } from "@/lib/mock/pendingPsychologists";
import { ApprovalQueue } from "./ApprovalQueue";

// AdminApprovalQueuePage (docs/frontend-migration-plan.md module 11). Server
// component behind RoleGate for "admin"; rows from the mock fixture, with a
// client-side ApprovalQueue for approve/reject interaction. Prototype-only:
// no persistence, no API call — see ApprovalRow's docblock. Under mock mode
// the gate is driven by the role switcher — demonstration only, the real
// page must also be enforced by the API (RoleGate docblock).
export default function AdminApprovalQueuePage() {
  const pending = getMockPendingPsychologists();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <RoleGate allow={["admin"]} fallback={<RestrictedPageNotice allow={["admin"]} />}>
        <header className="mb-6">
          <h1 className="text-lg font-medium text-stone-900">
            Psychologist approvals
          </h1>
          <p className="mt-1 text-sm text-stone-600">
            Review pending psychologist applications. Approve or reject each
            one below — mocked for this prototype, decisions are not saved.
          </p>
        </header>

        <ApprovalQueue pending={pending} />
      </RoleGate>
    </main>
  );
}
