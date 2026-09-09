import { getMockPsychologists } from "./psychologists";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD) — static data,
// no call to POST /api/v2/video-rooms/. Shape is loosely
// docs/frontend-migration-plan.md module 14's CallSession, trimmed to what a
// static shell needs (no real meetingToken/attendeeId — those only exist
// once Ticket 4 ships server-side, see the plan's "fully blocked" note).

export interface MockCallSession {
  sessionId: string;
  partnerName: string;
}

/**
 * Session ids reuse the mock psychologist ids for this prototype only, so a
 * "start a call" link can point at /call/{psychologistId} — this shell isn't
 * validating a real session ownership check (Ticket 2 dependency, per the
 * plan). Any other id resolves to no session, same as an expired/invalid one
 * would.
 */
export function getMockCallSession(sessionId: string): MockCallSession | null {
  const partnerId = Number(sessionId);
  if (!Number.isInteger(partnerId)) return null;
  const partner = getMockPsychologists().find((p) => p.id === partnerId);
  return partner ? { sessionId, partnerName: partner.name } : null;
}
