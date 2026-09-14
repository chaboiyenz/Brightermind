import { EmptyState } from "@/components/ui";
import { getMockPsychologists } from "@/lib/mock/psychologists";
import { PsychologistCard } from "./PsychologistCard";

// PsychologistDirectoryPage (docs/frontend-migration-plan.md module 11).
// Server component fed by the mock fixture — swap getMockPsychologists for
// the real fetch when the API is wired. Open to every role: v1's `prof`
// directory was student-facing, and nothing here is privileged. The admin
// approval queue lives at /admin/psychologists (AdminApprovalQueuePage),
// mocked with local-state-only approve/reject since it's backend-dependent.
export default function PsychologistDirectoryPage() {
  const psychologists = getMockPsychologists();

  return (
    <main className="mx-auto max-w-4xl p-6">
      <header className="mb-6">
        <h1 className="text-lg font-medium text-stone-900">Psychologists</h1>
        <p className="mt-1 text-sm text-stone-600">
          Registered psychologists you can reach out to. Availability shows whether
          they are currently taking new conversations.
        </p>
      </header>

      {psychologists.length === 0 ? (
        <EmptyState
          title="No psychologists yet"
          description="Approved psychologists will appear here once they join."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {psychologists.map((psychologist) => (
            <li key={psychologist.id}>
              <PsychologistCard psychologist={psychologist} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
