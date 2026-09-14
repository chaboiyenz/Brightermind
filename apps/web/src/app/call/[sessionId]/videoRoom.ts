// Room-name derivation for the Jitsi-backed video call (CallRoom.tsx).
//
// v1's flaw was ONE fixed, shared room name for every call, so any two
// sessions could collide. Every session here gets its own room instead.
//
// The room name must be DETERMINISTIC per sessionId — a random per-page-load
// suffix would put two people who open the same /call/[sessionId] URL into
// two different rooms, so they'd never actually connect. So: same sessionId
// → same room, for every participant; different sessionId → different room.
//
// FLAG (guessability): this is a salted hash so the room isn't the raw,
// predictable sessionId ("1", "2", …) verbatim — but the salt is public in
// client code, so anyone who knows a sessionId can derive its room. That is
// obfuscation, not secrecy. Genuine unguessability has to come from the
// backend issuing random, unpredictable session IDs (docs/audit-findings.md
// Ticket 4 — the real video-rooms endpoint), not from anything computed
// client-side from a known id. Today's mock sessions are simply the
// psychologist ids 1–6, so treat every room as public for now.

const ROOM_PREFIX = "brightermind";
const ROOM_SALT = "bm-v2-prototype";

export const JITSI_DOMAIN = "meet.jit.si";

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/** Deterministic, per-session Jitsi room name. Browser-only (Web Crypto). */
export async function deriveRoomName(sessionId: string): Promise<string> {
  const data = new TextEncoder().encode(`${ROOM_SALT}:${sessionId}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return `${ROOM_PREFIX}-${toHex(digest).slice(0, 20)}`;
}
