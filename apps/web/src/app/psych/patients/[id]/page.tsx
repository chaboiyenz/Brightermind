import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Video } from "lucide-react";
import { Avatar, Badge, Card, buttonVariants } from "@/components/ui";
import { MoodBars } from "@/components/psych/MoodBars";
import { NotScreenedBadge, SeverityBadge } from "@/components/psych/SeverityBadge";
import { SectionCard, WorkspacePage } from "@/components/psych/WorkspacePage";
import { ScoreSummaryPanel } from "@/app/profile/ScoreSummaryPanel";
import { getMockPatient, getMockPatients } from "@/lib/mock/patients";
import {
  SESSION_KIND_LABEL,
  formatSessionDate,
  formatSessionTime,
  getMockSessionsForPatient,
} from "@/lib/mock/sessions";
import { SessionNotes } from "./SessionNotes";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return getMockPatients().map((patient) => ({ id: String(patient.id) }));
}

const LONG_DATE = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Patient detail (docs/role-based-system-plan.md §3, new): screening
// history, mood, coping progress and private session notes for one patient.
// The coping panel is the same ScoreSummaryPanel the patient sees on their
// own profile, so both sides read the same picture.
export default async function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = await params;
  const patient = getMockPatient(Number(id));
  if (!patient) notFound();

  const sessions = getMockSessionsForPatient(patient.id);
  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status !== "upcoming").reverse();

  return (
    <WorkspacePage>
      <Link
        href="/psych/patients"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        All patients
      </Link>

      <Card className="flex flex-wrap items-center gap-4">
        <Avatar name={patient.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-headline-md text-stone-900">{patient.name}</h2>
          <p className="text-sm text-stone-600">
            {patient.yearLevel} · {patient.location} · Working together since {patient.since}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href={`/messages/${patient.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
            Message
          </Link>
          <Link href={`/call/${patient.id}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <Video className="h-4 w-4" aria-hidden="true" />
            Start call
          </Link>
          <Link href="/psych/sessions" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            Schedule
          </Link>
        </div>
      </Card>

      {patient.needsAttention && (
        <Card className="grid gap-2 border-clay-100 bg-clay-50">
          <p className="font-display text-base font-medium text-stone-900">Worth a closer look</p>
          <p className="text-sm leading-relaxed text-stone-700">{patient.needsAttention}</p>
        </Card>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <SectionCard title="Screening history">
            {patient.screenings.length === 0 ? (
              <div className="flex items-center gap-3 text-sm text-stone-600">
                <NotScreenedBadge />
                No screening completed yet. You can suggest one in your next message.
              </div>
            ) : (
              <ul className="divide-y divide-stone-200">
                {patient.screenings.map((result) => (
                  <li key={`${result.instrument}-${result.date}`} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-[15px] font-medium text-stone-900">{result.instrument}</p>
                      <p className="text-sm text-stone-600">{LONG_DATE.format(new Date(result.date))}</p>
                    </div>
                    <SeverityBadge severity={result.severity} score={result.score} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <ScoreSummaryPanel scores={patient.scores} subjectName={patient.name.split(" ")[0]} />

          <SectionCard title="Sessions">
            <p className="font-display text-label-md uppercase text-stone-600">Upcoming</p>
            {upcoming.length === 0 ? (
              <p className="text-sm text-stone-600">Nothing scheduled.</p>
            ) : (
              <ul className="divide-y divide-stone-200">
                {upcoming.map((session) => (
                  <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-[15px] font-medium text-stone-900">
                        {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)}
                      </p>
                      <p className="text-sm text-stone-600">
                        {session.note} · {SESSION_KIND_LABEL[session.kind]} · {session.durationMinutes} min
                      </p>
                    </div>
                    <Badge tone="brand">Upcoming</Badge>
                  </li>
                ))}
              </ul>
            )}
            {past.length > 0 && (
              <>
                <p className="pt-2 font-display text-label-md uppercase text-stone-600">Past</p>
                <ul className="divide-y divide-stone-200">
                  {past.map((session) => (
                    <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-[15px] font-medium text-stone-900">
                          {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)}
                        </p>
                        <p className="text-sm text-stone-600">{session.note}</p>
                      </div>
                      <Badge tone={session.status === "completed" ? "success" : "neutral"}>
                        {session.status === "completed" ? "Completed" : "Cancelled"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-6">
          <SectionCard title="Mood, last 7 days">
            <MoodBars values={patient.moodLast7} className="[&>div]:h-14 [&>div]:gap-2 [&_span]:w-6" />
            <p className="text-sm text-stone-600">
              Last active {patient.lastActiveLabel.toLowerCase()}. Bars follow the patient&apos;s own mood swatches.
            </p>
          </SectionCard>

          <SessionNotes patientId={patient.id} />
        </div>
      </div>
    </WorkspacePage>
  );
}
