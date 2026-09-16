import Link from "next/link";
import { CalendarDays, NotebookPen, ListChecks, UserRound, Video, type LucideIcon } from "lucide-react";
import { Avatar, Card, buttonVariants, cn } from "@/components/ui";
import { CONTAINER_CLASS, Eyebrow } from "@/components/home/SectionHeading";
import { SCREENING_TOOLS } from "@/components/home/homeContent";
import { SeverityBadge } from "@/components/psych/SeverityBadge";
import { getMockJournalEntries } from "@/lib/mock/journalEntries";
import { getMockPatient, latestScreening } from "@/lib/mock/patients";
import { getMockPsychologists } from "@/lib/mock/psychologists";
import {
  MOCK_TODAY,
  SESSION_KIND_LABEL,
  formatSessionDate,
  formatSessionTime,
  getMockSessionsForPatient,
} from "@/lib/mock/sessions";
import { DISPLAY_NAMES, greetingName } from "@/lib/session/displayNames";
import { ContinueCard } from "./ContinueCard";
import { HomeCheckIn } from "./HomeCheckIn";

// The signed-in patient in the prototype (lib/mock/patients.ts) and their
// psychologist (lib/mock/psychologists.ts).
const MY_PATIENT_ID = 201;
const MY_PSYCHOLOGIST_ID = 1;

const QUICK_LINKS: readonly { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Mood tracker", href: "/mood", icon: CalendarDays },
  { label: "Journal", href: "/journal", icon: NotebookPen },
  { label: "To-do list", href: "/tools/todo", icon: ListChecks },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const TODAY_LABEL = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Manila",
});

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Personalised home for signed-in patients (docs/role-based-system-plan.md
// §5, "Patient: Home (signed in)" on the design canvas). Replaces the
// marketing landing page once someone has signed in: a check-in, what to
// pick up next, the next session, and the week so far. Server component over
// the mock fixtures; the two interactive cards are small client islands.
export default function PatientHomePage() {
  const now = new Date();
  const manilaHour = Number(
    new Intl.DateTimeFormat("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Manila" }).format(now)
  );
  const firstName = greetingName(DISPLAY_NAMES.student);
  const patient = getMockPatient(MY_PATIENT_ID);
  const psychologist = getMockPsychologists().find((p) => p.id === MY_PSYCHOLOGIST_ID);
  const nextSession = getMockSessionsForPatient(MY_PATIENT_ID).find(
    (session) => session.status === "upcoming" && session.startsAt >= MOCK_TODAY
  );
  const latest = patient ? latestScreening(patient) : null;
  const moodDays = patient ? patient.moodLast7.filter((value) => value !== null).length : 0;
  const journalCount = getMockJournalEntries().length;

  return (
    <main className={cn(CONTAINER_CLASS, "grid gap-8 pb-16 pt-12 sm:pt-14")}>
      <div className="max-w-[62ch]">
        <Eyebrow>{TODAY_LABEL.format(now)}</Eyebrow>
        <h1 className="mt-3 font-display text-display-sm text-stone-900">
          {greetingFor(manilaHour)}, {firstName}
        </h1>
        <p className="mt-3 text-lg leading-[1.65] text-stone-700">
          A quick check-in helps us suggest the right thing for today.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <HomeCheckIn moodDaysLogged={moodDays} />

          <ContinueCard />

          <Card id="screening" className="grid gap-4 scroll-mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-base font-medium text-stone-900">Screening</h2>
              {latest && <SeverityBadge severity={latest.severity} instrument={latest.instrument} />}
            </div>
            <p className="text-[15px] leading-relaxed text-stone-700">
              {latest
                ? `Your last ${latest.instrument} was two weeks ago. A fortnightly check helps you and your psychologist see the trend, not just one day.`
                : "You have not taken a screening yet. Each one takes a few minutes and gives you a starting point to talk from."}
            </p>
            <ul className="grid gap-2 sm:grid-cols-2" aria-label="Screening instruments">
              {SCREENING_TOOLS.map((tool) => (
                <li key={tool.code}>
                  <Link
                    href={tool.href}
                    className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-stone-25 px-4 py-3 transition-colors hover:border-brand-300"
                  >
                    <span>
                      <span className="block font-display text-[15px] font-semibold text-stone-900">
                        {tool.code} · {tool.name}
                      </span>
                      <span className="block text-sm text-stone-600">{tool.minutes} min</span>
                    </span>
                    <span className="text-sm font-medium text-brand-600">Start</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="grid gap-4">
            <h2 className="font-display text-base font-medium text-stone-900">Your next session</h2>
            {psychologist && nextSession ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={psychologist.name} imageUrl={psychologist.imageUrl} size="md" />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-stone-900">{psychologist.name}</p>
                    <p className="truncate text-sm text-stone-600">{psychologist.areaOfExpertise}</p>
                  </div>
                </div>
                <div className="grid gap-1 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3.5">
                  <p className="text-[15px] font-medium text-stone-900">{formatSessionDate(nextSession.startsAt)}</p>
                  <p className="text-sm text-stone-600">
                    {formatSessionTime(nextSession.startsAt)} · {nextSession.durationMinutes} minutes ·{" "}
                    {SESSION_KIND_LABEL[nextSession.kind]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/call/${psychologist.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Join call
                  </Link>
                  <Link href={`/messages/${psychologist.id}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                    Message
                  </Link>
                </div>
                <p className="text-sm text-stone-600">The room opens ten minutes before the session.</p>
              </>
            ) : (
              <>
                <p className="text-[15px] leading-relaxed text-stone-700">
                  Nothing booked yet. Browse registered psychologists and pick a time that fits your week.
                </p>
                <Link href="/psychologists" className={buttonVariants({ variant: "accent", size: "sm" })}>
                  Book a session
                </Link>
              </>
            )}
          </Card>

          <Card className="grid gap-1">
            <h2 className="pb-2 font-display text-base font-medium text-stone-900">This week</h2>
            <dl className="divide-y divide-stone-200 text-[15px]">
              <div className="flex items-center justify-between py-3">
                <dt className="text-stone-700">Mood logged</dt>
                <dd className="font-medium text-stone-900">{moodDays} of 7 days</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-stone-700">Journal entries</dt>
                <dd className="font-medium text-stone-900">{journalCount}</dd>
              </div>
              <div className="flex items-center justify-between py-3">
                <dt className="text-stone-700">Coping minutes</dt>
                <dd className="font-medium text-stone-900">26</dd>
              </div>
            </dl>
          </Card>

          <ul className="grid grid-cols-2 gap-3" aria-label="Your tools">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-25 px-4 py-3.5 font-display text-label-lg text-stone-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    <Icon className="h-5 w-5 text-brand-600" strokeWidth={1.8} aria-hidden="true" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
