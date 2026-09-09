// Decided copy (prototype pivot ground rule 3 — flagged and decided, not
// invented silently). Calm, human language — no technical jargon per the
// decision ("terminated"/"disconnected" are explicitly out).
export function connectingLabel(partnerName: string) {
  return `Connecting you with ${partnerName}...`;
}

export const CALL_ENDED_MESSAGE = "Session ended. Take care.";
export const CALL_ERROR_MESSAGE = "Couldn't connect — retry?";
