// Decided copy (prototype pivot ground rule 3 — flagged and decided, not
// invented silently). Calm, human language — no technical jargon per the
// decision ("terminated"/"disconnected" are explicitly out).
export function connectingLabel(partnerName: string) {
  return `Connecting you with ${partnerName}...`;
}

export const CALL_ENDED_MESSAGE = "Session ended. Take care.";

// The ended screen is otherwise a dead end — this is the way out of the call
// shell. "Close" rather than "Back": the room is finished, not paused.
export const CALL_CLOSE_LABEL = "Close";
export const CALL_ERROR_MESSAGE = "Couldn't connect — retry?";

// Real error conditions now that the call is a live Jitsi session (these
// replaced the old "simulate connection issue" button). Same calm register.
export const CALL_LOAD_FAILED_MESSAGE =
  "The video service couldn't be loaded. Check your connection and retry.";
export const CAMERA_BLOCKED_MESSAGE =
  "Camera or microphone access was blocked. Allow it in your browser's site settings, then retry.";
export const NO_DEVICE_MESSAGE =
  "No camera or microphone was found on this device.";
