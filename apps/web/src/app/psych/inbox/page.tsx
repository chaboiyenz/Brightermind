import { Card } from "@/components/ui";
import { AvailabilitySwitch } from "@/components/psych/AvailabilitySwitch";
import { WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockInbox } from "@/lib/mock/inbox";
import { InboxTable } from "./InboxTable";

// Inbox (docs/frontend-migration-plan.md module 12; moved from /dashboard into
// the psychologist workspace per docs/role-based-system-plan.md §3). Rows come from the mock fixture; the
// availability switch is the same shared value shown in the sidebar.
export default function PsychInboxPage() {
  const rows = getMockInbox();
  const pendingCount = rows.filter((row) => row.status === "pending").length;

  return (
    <WorkspacePage>
      <WorkspaceHeading
        title="Inbox"
        description={
          pendingCount === 0
            ? "No messages are waiting for a reply."
            : `${pendingCount} ${pendingCount === 1 ? "message is" : "messages are"} waiting for a reply.`
        }
      />

      <Card className="grid gap-2">
        <h3 className="font-display text-base font-medium text-stone-900">Availability</h3>
        <AvailabilitySwitch />
        <p className="text-xs text-stone-600">
          Students see this on the psychologist directory. Prototype note: saved in this browser only.
        </p>
      </Card>

      <section aria-labelledby="inbox-heading" className="grid gap-3">
        <h3 id="inbox-heading" className="font-display text-base font-medium text-stone-900">
          Messages
        </h3>
        <InboxTable rows={rows} />
      </section>
    </WorkspacePage>
  );
}
