import Link from "next/link";
import { Video } from "lucide-react";
import { Avatar, Badge, buttonVariants } from "@/components/ui";
import { SectionCard, WorkspaceHeading, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockPatient } from "@/lib/mock/patients";
import {
  MOCK_TODAY,
  SESSION_KIND_LABEL,
  formatSessionDate,
  formatSessionTime,
  getMockPastSessions,
  getMockUpcomingSessions,
  type CounsellingSession,
} from "@/lib/mock/sessions";

function groupByDay(sessions: readonly CounsellingSession[]): readonly [string, readonly CounsellingSession[]][] {
  const groups = sessions.reduce<Record<string, CounsellingSession[]>>((acc, session) => {
    const day = session.startsAt.slice(0, 10);
    return { ...acc, [day]: [...(acc[day] ?? []), session] };
  }, {});
  return Object.entries(groups);
}

// Sessions (docs/role-based-system-plan.md §3, new): upcoming calls grouped
// by day, then the recent past. Scheduling and rescheduling are prototype
// placeholders; the real page books against POST /api/v2/sessions/.
export default function PsychSessionsPage() {
  const upcomingByDay = groupByDay(getMockUpcomingSessions());
  const past = getMockPastSessions();

  return (
    <WorkspacePage>
      <WorkspaceHeading
        title="Sessions"
        description="Upcoming video and chat sessions, grouped by day."
        actions={
          <Link href="/psych/patients" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Schedule a session
          </Link>
        }
      />

      <div className="grid gap-6">
        {upcomingByDay.map(([day, sessions]) => (
          <SectionCard
            key={day}
            title={day === MOCK_TODAY ? "Today" : formatSessionDate(sessions[0].startsAt)}
          >
            <ul className="divide-y divide-stone-200">
              {sessions.map((session) => {
                const patient = getMockPatient(session.patientId);
                if (!patient) return null;
                return (
                  <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                    <div className="flex items-center gap-3.5">
                      <span className="w-[72px] font-display text-[15px] font-semibold text-stone-900">
                        {formatSessionTime(session.startsAt)}
                      </span>
                      <Avatar name={patient.name} size="sm" />
                      <div>
                        <Link
                          href={`/psych/patients/${patient.id}`}
                          className="text-[15px] font-medium text-stone-900 hover:text-brand-700"
                        >
                          {patient.name}
                        </Link>
                        <p className="text-sm text-stone-600">
                          {session.note} · {SESSION_KIND_LABEL[session.kind]} · {session.durationMinutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {session.kind === "video" ? (
                        <Link href={`/call/${patient.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Start call
                        </Link>
                      ) : (
                        <Link href={`/messages/${patient.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                          Open chat
                        </Link>
                      )}
                      <Link href={`/psych/patients/${patient.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Prepare
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        ))}

        <SectionCard title="Recent">
          <ul className="divide-y divide-stone-200">
            {past.map((session) => {
              const patient = getMockPatient(session.patientId);
              if (!patient) return null;
              return (
                <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[15px] font-medium text-stone-900">
                      {patient.name} · {formatSessionDate(session.startsAt)}, {formatSessionTime(session.startsAt)}
                    </p>
                    <p className="text-sm text-stone-600">{session.note}</p>
                  </div>
                  <Badge tone={session.status === "completed" ? "success" : "neutral"}>
                    {session.status === "completed" ? "Completed" : "Cancelled"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </WorkspacePage>
  );
}
