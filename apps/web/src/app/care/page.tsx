import Link from "next/link";
import { ArrowRight, Video } from "lucide-react";
import { Avatar, Badge, Card, buttonVariants, cn } from "@/components/ui";
import { CONTAINER_CLASS, Eyebrow } from "@/components/home/SectionHeading";
import { HOTLINES_LINK } from "@/components/site/siteLinks";
import { CURRENT_USER_ID, getMockConversation } from "@/lib/mock/conversations";
import { getMockPsychologists, type PsychologistSummary } from "@/lib/mock/psychologists";
import {
  SESSION_KIND_LABEL,
  formatSessionDate,
  formatSessionTime,
  getMockSessionsForPatient,
} from "@/lib/mock/sessions";

// The signed-in patient's id in the prototype (lib/mock/patients.ts) and the
// psychologist they work with (lib/mock/psychologists.ts).
const MY_PATIENT_ID = 201;
const MY_PSYCHOLOGIST_ID = 1;

const AVAILABILITY_BADGE: Record<PsychologistSummary["availability"], { tone: "success" | "neutral"; label: string }> = {
  available: { tone: "success", label: "Available now" },
  unavailable: { tone: "neutral", label: "Away right now" },
  unknown: { tone: "neutral", label: "Availability unknown" },
};

// My care (docs/role-based-system-plan.md §3, new patient page): the one
// place for the patient's psychologist, upcoming sessions and messages. It
// also carries the page's single coral CTA (booking), which left the header
// when the avatar menu arrived. Server component over the mock fixtures.
export default function MyCarePage() {
  const psychologists = getMockPsychologists();
  const mine = psychologists.find((p) => p.id === MY_PSYCHOLOGIST_ID) ?? psychologists[0];
  const others = psychologists.filter((p) => p.id !== mine.id && p.availability === "available").slice(0, 2);
  const upcoming = getMockSessionsForPatient(MY_PATIENT_ID).filter((s) => s.status === "upcoming");
  const [nextSession, ...laterSessions] = upcoming;
  const thread = getMockConversation(mine.id).messages.slice(-3);
  const availability = AVAILABILITY_BADGE[mine.availability];

  return (
    <main className={cn(CONTAINER_CLASS, "grid gap-8 pb-16 pt-12 sm:pt-14")}>
      <div className="max-w-[62ch]">
        <Eyebrow>My care</Eyebrow>
        <h1 className="mt-3 font-display text-display-sm text-stone-900">Your support, in one place</h1>
        <p className="mt-3 text-lg leading-[1.65] text-stone-700">
          Your psychologist, upcoming sessions, and messages. Nothing here is shared with anyone else.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-6">
          <Card className="grid gap-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-medium text-stone-900">Your psychologist</h2>
              <Badge tone={availability.tone}>{availability.label}</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Avatar name={mine.name} imageUrl={mine.imageUrl} size="lg" />
              <div className="min-w-0">
                <p className="font-display text-headline-sm text-stone-900">{mine.name}</p>
                <p className="text-sm text-stone-600">{mine.areaOfExpertise} · Working together since August</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href={`/messages/${mine.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                Message
              </Link>
              <Link href="/psychologists" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Book another session
              </Link>
            </div>

            <div>
              <p className="pb-1 font-display text-label-md uppercase text-stone-600">Upcoming</p>
              {upcoming.length === 0 ? (
                <p className="py-3 text-sm text-stone-600">No sessions booked yet.</p>
              ) : (
                <ul className="divide-y divide-stone-200">
                  {upcoming.map((session, index) => (
                    <li key={session.id} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
                      <div>
                        <p className="text-[15px] font-medium text-stone-900">
                          {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)}
                        </p>
                        <p className="text-sm text-stone-600">
                          {SESSION_KIND_LABEL[session.kind]} · {session.durationMinutes} minutes
                        </p>
                      </div>
                      {index === 0 && session.kind === "video" ? (
                        <Link href={`/call/${mine.id}`} className={buttonVariants({ variant: "primary", size: "sm" })}>
                          <Video className="h-4 w-4" aria-hidden="true" />
                          Join call
                        </Link>
                      ) : (
                        <span className="text-sm text-stone-600">Reminder set</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {nextSession && laterSessions.length === 0 && (
                <p className="pt-1 text-sm text-stone-600">The room opens ten minutes before the session.</p>
              )}
            </div>
          </Card>

          <Card className="grid gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-medium text-stone-900">Messages with {mine.name}</h2>
              <Link href={`/messages/${mine.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                Open full thread
              </Link>
            </div>
            {thread.length === 0 ? (
              <p className="text-sm text-stone-600">No messages yet. Say hello whenever you are ready.</p>
            ) : (
              <ul className="grid gap-2.5">
                {thread.map((message) => {
                  const mineMsg = message.senderId === CURRENT_USER_ID;
                  return (
                    <li
                      key={message.id}
                      className={cn(
                        "max-w-[78%] rounded-lg px-3.5 py-2.5 text-[15px] leading-relaxed",
                        mineMsg
                          ? "justify-self-end rounded-tr-sm bg-brand-100 text-brand-800"
                          : "justify-self-start rounded-tl-sm bg-stone-100 text-stone-900"
                      )}
                    >
                      {message.content}
                    </li>
                  );
                })}
              </ul>
            )}
            <Link
              href={`/messages/${mine.id}`}
              className="flex h-11 items-center justify-between rounded-md border-[1.5px] border-stone-200 bg-stone-25 px-4 text-[15px] text-stone-600 transition-colors hover:border-brand-300"
            >
              Write a message
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card className="grid gap-4">
            <h2 className="font-display text-base font-medium text-stone-900">Looking for someone else?</h2>
            <p className="text-[15px] leading-relaxed text-stone-700">
              You can talk to more than one registered psychologist. These are taking new conversations.
            </p>
            <ul className="divide-y divide-stone-200">
              {others.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <Avatar name={p.name} imageUrl={p.imageUrl} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-stone-900">{p.name}</p>
                    <p className="truncate text-sm text-stone-600">{p.areaOfExpertise}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/psychologists" className={buttonVariants({ variant: "accent", size: "md" })}>
              Book a session
            </Link>
            <Link href="/psychologists" className="text-center text-sm font-medium text-brand-600 hover:text-brand-700">
              Browse all psychologists
            </Link>
          </Card>

          <Card className="grid gap-3 border-clay-100 bg-clay-50">
            <h2 className="font-display text-base font-medium text-stone-900">Need help right now?</h2>
            <p className="text-[15px] leading-relaxed text-stone-700">
              If you are in immediate danger or feel you might hurt yourself, please reach a crisis line first. They
              are open around the clock.
            </p>
            <Link
              href={HOTLINES_LINK.href}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "justify-self-start border-clay-400 text-clay-600 hover:border-clay-500")}
            >
              {HOTLINES_LINK.label}
            </Link>
          </Card>
        </div>
      </div>
    </main>
  );
}
