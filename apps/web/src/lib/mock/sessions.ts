// Prototype pivot — static counselling sessions shared by the patient's
// /care page and the psychologist's /psych overview and /psych/sessions.
// Times are invented placeholders (ground rule 3). Session ids double as the
// /call/[sessionId] parameter: a psychologist calls a patient at the
// patient's id, a patient joins at the psychologist's id (see callSessions.ts).

export type SessionKind = "video" | "chat";
export type SessionStatus = "upcoming" | "completed" | "cancelled";

export interface CounsellingSession {
  readonly id: number;
  readonly patientId: number;
  readonly psychologistId: number;
  /** ISO datetime with offset. */
  readonly startsAt: string;
  readonly durationMinutes: number;
  readonly kind: SessionKind;
  readonly status: SessionStatus;
  readonly note: string;
}

// "Today" for every mock fixture is 16 September 2026 (matches the design
// canvas), so the overview always has something happening today.
export const MOCK_TODAY = "2026-09-16";
const TZ = "+08:00";

const MOCK_SESSIONS: readonly CounsellingSession[] = [
  { id: 1, patientId: 205, psychologistId: 1, startsAt: `2026-09-16T15:00:00${TZ}`, durationMinutes: 45, kind: "video", status: "upcoming", note: "Follow-up" },
  { id: 2, patientId: 204, psychologistId: 1, startsAt: `2026-09-16T16:30:00${TZ}`, durationMinutes: 60, kind: "video", status: "upcoming", note: "First session" },
  { id: 3, patientId: 201, psychologistId: 1, startsAt: `2026-09-18T15:00:00${TZ}`, durationMinutes: 45, kind: "video", status: "upcoming", note: "Follow-up" },
  { id: 4, patientId: 202, psychologistId: 1, startsAt: `2026-09-18T17:30:00${TZ}`, durationMinutes: 45, kind: "video", status: "upcoming", note: "Review PHQ-9 change" },
  { id: 5, patientId: 203, psychologistId: 1, startsAt: `2026-09-22T10:00:00${TZ}`, durationMinutes: 45, kind: "chat", status: "upcoming", note: "Check-in" },
  { id: 6, patientId: 201, psychologistId: 1, startsAt: `2026-09-25T15:00:00${TZ}`, durationMinutes: 45, kind: "video", status: "upcoming", note: "Follow-up" },
  { id: 7, patientId: 201, psychologistId: 1, startsAt: `2026-09-11T15:00:00${TZ}`, durationMinutes: 45, kind: "video", status: "completed", note: "Introduced defusion" },
  { id: 8, patientId: 206, psychologistId: 1, startsAt: `2026-09-10T14:00:00${TZ}`, durationMinutes: 45, kind: "video", status: "completed", note: "DASS-21 debrief" },
  { id: 9, patientId: 202, psychologistId: 1, startsAt: `2026-09-09T17:30:00${TZ}`, durationMinutes: 45, kind: "chat", status: "cancelled", note: "Rescheduled by patient" },
];

function byStart(a: CounsellingSession, b: CounsellingSession): number {
  return a.startsAt < b.startsAt ? -1 : a.startsAt > b.startsAt ? 1 : 0;
}

/** Single swap point for the real fetch later (GET /api/v2/sessions/). */
export function getMockSessions(): readonly CounsellingSession[] {
  return [...MOCK_SESSIONS].sort(byStart);
}

export function getMockSessionsForPatient(patientId: number): readonly CounsellingSession[] {
  return getMockSessions().filter((session) => session.patientId === patientId);
}

export function getMockUpcomingSessions(): readonly CounsellingSession[] {
  return getMockSessions().filter((session) => session.status === "upcoming");
}

export function getMockSessionsOn(date: string): readonly CounsellingSession[] {
  return getMockUpcomingSessions().filter((session) => session.startsAt.startsWith(date));
}

export function getMockPastSessions(): readonly CounsellingSession[] {
  return getMockSessions()
    .filter((session) => session.status !== "upcoming")
    .reverse();
}

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Asia/Manila",
});

const TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Manila",
});

export function formatSessionDate(startsAt: string): string {
  return DATE_FORMAT.format(new Date(startsAt));
}

export function formatSessionTime(startsAt: string): string {
  return TIME_FORMAT.format(new Date(startsAt));
}

export const SESSION_KIND_LABEL: Record<SessionKind, string> = {
  video: "Video call",
  chat: "Chat session",
};
