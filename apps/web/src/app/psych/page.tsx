import Link from "next/link";
import { Video } from "lucide-react";
import { Avatar, buttonVariants } from "@/components/ui";
import { SeverityBadge } from "@/components/psych/SeverityBadge";
import { SectionCard, StatTile, WorkspacePage } from "@/components/psych/WorkspacePage";
import { getMockInbox } from "@/lib/mock/inbox";
import { getMockPatient, getMockPatients, getMockRecentScreenings, latestScreening } from "@/lib/mock/patients";
import { MOCK_TODAY, SESSION_KIND_LABEL, formatSessionTime, getMockSessionsOn } from "@/lib/mock/sessions";
import { DISPLAY_NAMES, greetingName } from "@/lib/session/displayNames";
import { MessageStatusBadge } from "./inbox/MessageStatusBadge";

const GREETING_DATE = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date(`${MOCK_TODAY}T12:00:00`));

// Psychologist overview (docs/role-based-system-plan.md §3, /psych): the
// day at a glance — caseload counts, today's sessions, the inbox, and any
// screening result that needs a look. Server component over mock fixtures;
// each getMock* call is the swap point for the real endpoint later.
export default function PsychOverviewPage() {
  const patients = getMockPatients();
  const inbox = getMockInbox();
  const pending = inbox.filter((row) => row.status === "pending");
  const today = getMockSessionsOn(MOCK_TODAY);
  const attention = patients.filter((patient) => patient.needsAttention);
  const recentScreenings = getMockRecentScreenings().slice(0, 4);

  return (
    <WorkspacePage>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <h2 className="font-display text-headline-md text-stone-900">Good afternoon, {greetingName(DISPLAY_NAMES.psychologist)}</h2>
          <p className="text-sm text-stone-600">
            {GREETING_DATE} · {today.length} {today.length === 1 ? "session" : "sessions"} today,{" "}
            {pending.length} {pending.length === 1 ? "message" : "messages"} waiting
          </p>
        </div>
        <Link href="/psych/sessions" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Schedule a session
        </Link>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Patients" value={patients.length} hint="2 new this month" />
        <StatTile label="Awaiting reply" value={pending.length} hint={`Oldest: ${pending[0]?.waitingLabel ?? "none"}`} />
        <StatTile
          label="Sessions today"
          value={today.length}
          hint={today[0] ? `Next at ${formatSessionTime(today[0].startsAt)}` : "Nothing booked"}
        />
        <StatTile label="Needs attention" value={attention.length} hint="Screening result to review" />
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <SectionCard
            title="Today's sessions"
            action={
              <Link href="/psych/sessions" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Open calendar
              </Link>
            }
          >
            {today.length === 0 ? (
              <p className="text-sm text-stone-600">No sessions today.</p>
            ) : (
              <ul className="divide-y divide-stone-200">
                {today.map((session) => {
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
                      {session.kind === "video" ? (
                        <Link href={`/call/${patient.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Start call
                        </Link>
                      ) : (
                        <Link href={`/messages/${patient.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                          Open chat
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Inbox"
            action={
              <Link href="/psych/inbox" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                All messages
              </Link>
            }
          >
            <ul className="divide-y divide-stone-200">
              {inbox.slice(0, 3).map((row) => (
                <li key={row.messageId} className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <Link
                      href={`/messages/${row.partnerId}`}
                      className="text-[15px] font-medium text-stone-900 hover:text-brand-700"
                    >
                      {row.senderName}
                    </Link>
                    <p className="truncate text-sm text-stone-600">{row.preview}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
                    <MessageStatusBadge status={row.status} />
                    <span>{row.waitingLabel}</span>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="grid gap-6">
          <SectionCard title="Needs attention" className="border-clay-100">
            {attention.length === 0 ? (
              <p className="text-sm text-stone-600">Nothing flagged right now.</p>
            ) : (
              attention.map((patient) => {
                const latest = latestScreening(patient);
                return (
                  <div key={patient.id} className="grid gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={patient.name} size="md" />
                      <div>
                        <p className="text-[15px] font-medium text-stone-900">{patient.name}</p>
                        {latest && (
                          <p className="text-sm text-stone-600">
                            {latest.instrument} · {latest.date}
                          </p>
                        )}
                      </div>
                    </div>
                    {latest && <SeverityBadge severity={latest.severity} score={latest.score} />}
                    <p className="text-sm leading-relaxed text-stone-700">{patient.needsAttention}</p>
                    <div className="flex gap-2">
                      <Link href={`/psych/patients/${patient.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                        Open patient
                      </Link>
                      <Link href={`/messages/${patient.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Message
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </SectionCard>

          <SectionCard
            title="Recent screenings"
            action={
              <Link href="/psych/screenings" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                See all
              </Link>
            }
          >
            <ul className="divide-y divide-stone-200">
              {recentScreenings.map((result) => (
                <li key={`${result.patient.id}-${result.instrument}-${result.date}`} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-[15px] font-medium text-stone-900">{result.patient.name}</p>
                    <p className="text-sm text-stone-600">
                      {result.instrument} · {result.date}
                    </p>
                  </div>
                  <SeverityBadge severity={result.severity} />
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>
    </WorkspacePage>
  );
}
