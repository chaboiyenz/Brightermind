import { RestrictedPageNotice } from "@/components/RestrictedPageNotice";
import { Card, CardContent, CardHeader, CardTitle, RoleGate } from "@/components/ui";
import { getMockInbox } from "@/lib/mock/inbox";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { InboxTable } from "./InboxTable";

// PsychologistDashboardPage (docs/frontend-migration-plan.md module 12).
// Server component; the inbox rows come from the mock fixture. The whole page
// sits behind RoleGate for "psychologist" — under NEXT_PUBLIC_MOCK_MODE that
// gate is driven by the bottom-left role switcher, so it demonstrates the
// gating without being real enforcement (RoleGate's docblock: UX only, the
// API must enforce the same rule server-side).
export default function PsychologistDashboardPage() {
  const rows = getMockInbox();
  const pendingCount = rows.filter((row) => row.status === "pending").length;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <RoleGate allow={["psychologist"]} fallback={<RestrictedPageNotice allow={["psychologist"]} />}>
        <header className="mb-6">
          <h1 className="text-lg font-medium text-stone-900">Your dashboard</h1>
          <p className="mt-1 text-sm text-stone-600">
            {pendingCount === 0
              ? "No messages are waiting for a reply."
              : `${pendingCount} ${pendingCount === 1 ? "message is" : "messages are"} waiting for a reply.`}
          </p>
        </header>

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <AvailabilityToggle />
            </CardContent>
          </Card>

          <section aria-labelledby="inbox-heading">
            <h2 id="inbox-heading" className="mb-3 text-base font-medium text-stone-900">
              Inbox
            </h2>
            <InboxTable rows={rows} />
          </section>
        </div>
      </RoleGate>
    </main>
  );
}
