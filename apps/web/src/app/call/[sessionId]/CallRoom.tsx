"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { useSession } from "@/components/SessionProvider";
import { Button, buttonVariants } from "@/components/ui";
import { isPsychRole } from "@/lib/session/access";
import {
  CALL_CLOSE_LABEL,
  CALL_ENDED_MESSAGE,
  CALL_ERROR_MESSAGE,
  CALL_LOAD_FAILED_MESSAGE,
  CAMERA_BLOCKED_MESSAGE,
  NO_DEVICE_MESSAGE,
  connectingLabel,
} from "./callContent";
import { JITSI_DOMAIN, deriveRoomName } from "./videoRoom";

type ConnectionState = "connecting" | "connected" | "error";

const EXTERNAL_API_SRC = `https://${JITSI_DOMAIN}/external_api.js`;

// Pre-fills Jitsi's pre-join name field so its "Join meeting" button is
// enabled immediately (meet.jit.si requires a display name). The real app
// should pass the logged-in user's name here once real sessions exist.
const DEFAULT_DISPLAY_NAME = "BrighterMind participant";

// Loads Jitsi's External API script once per page; resolves with the
// constructor. No package dependency — @jitsi/react-sdk was considered but
// it only wraps this same script, so a script tag keeps the dep count flat.
let externalApiPromise: Promise<JitsiMeetExternalAPIConstructor> | null = null;

function loadExternalApi(): Promise<JitsiMeetExternalAPIConstructor> {
  if (window.JitsiMeetExternalAPI) return Promise.resolve(window.JitsiMeetExternalAPI);
  if (externalApiPromise) return externalApiPromise;

  externalApiPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = EXTERNAL_API_SRC;
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) resolve(window.JitsiMeetExternalAPI);
      else reject(new Error("external_api.js loaded but JitsiMeetExternalAPI is missing"));
    };
    script.onerror = () => {
      externalApiPromise = null; // allow a retry to re-attempt the load
      reject(new Error("Failed to load external_api.js"));
    };
    document.head.appendChild(script);
  });
  return externalApiPromise;
}

// Jitsi reports device problems via cameraError/micError; map the ones a
// user can actually act on to the decided copy, and fall back generically.
function deviceErrorMessage(error: JitsiDeviceError): string {
  const type = error.type.toLowerCase();
  if (type.includes("permission") || type.includes("notallowed")) return CAMERA_BLOCKED_MESSAGE;
  if (type.includes("notfound") || type.includes("unavailable")) return NO_DEVICE_MESSAGE;
  return CALL_ERROR_MESSAGE;
}

interface CallRoomProps {
  sessionId: string;
  partnerName: string;
}

// Client component (docs/frontend-migration-plan.md module 14). A real call
// now: Jitsi Meet's public server via its External API, embedded in the same
// chrome the static shell had. Connection state is driven by Jitsi's own
// events (videoConferenceJoined / videoConferenceLeft / cameraError …), not
// the old timer — so what the UI says reflects what's actually happening.
//
// The "connecting" state is deliberately NOT a full-cover overlay: meet.jit.si
// forces its own pre-join screen (name + "Join meeting" button — the
// prejoinPageEnabled override is ignored on the public server), so covering
// the iframe would hide the very button the user has to press. It's a status
// caption instead; only errors block the video area.
//
// The page wraps this in `.theme-dark` (globals.css), so stone-50/100 are the
// dark room and stone-900 is light text in BOTH site themes.
//
// FLAG — public server: rooms live on meet.jit.si (8x8's free public
// instance). Fine for a free prototype demo; NOT appropriate once real
// patient sessions or data are involved — sessions are neither private nor
// self-hosted. Revisit with a paid provider (Amazon Chime SDK / Twilio, per
// docs/audit-findings.md Ticket 4 and the TDD) before any real use. Also note
// meet.jit.si has, since 2023, required the first participant of an
// anonymously-created room to sign in (Google/GitHub/etc.) to start it — no
// API key or app signup, but not fully frictionless for whoever opens the
// room first. See videoRoom.ts for the room-name guessability caveat.
export function CallRoom({ sessionId, partnerName }: CallRoomProps) {
  const { role } = useSession();
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<JitsiMeetExternalAPI | null>(null);

  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [errorMessage, setErrorMessage] = useState(CALL_ERROR_MESSAGE);
  const [hasEnded, setHasEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  // Incremented by Retry to re-run the join effect from scratch.
  const [attempt, setAttempt] = useState(0);

  const fail = useCallback((message: string) => {
    setErrorMessage(message);
    setConnectionState("error");
  }, []);

  useEffect(() => {
    if (hasEnded) return;
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    setConnectionState("connecting");

    (async () => {
      try {
        const [ExternalApi, roomName] = await Promise.all([
          loadExternalApi(),
          deriveRoomName(sessionId),
        ]);
        if (cancelled) return;

        const api = new ExternalApi(JITSI_DOMAIN, {
          roomName,
          parentNode: container,
          width: "100%",
          height: "100%",
          userInfo: { displayName: DEFAULT_DISPLAY_NAME },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
        });
        apiRef.current = api;

        api.addListener("videoConferenceJoined", () => setConnectionState("connected"));
        api.addListener("videoConferenceLeft", () => setHasEnded(true));
        api.addListener("readyToClose", () => setHasEnded(true));
        api.addListener("cameraError", (error) => fail(deviceErrorMessage(error)));
        api.addListener("micError", (error) => fail(deviceErrorMessage(error)));
        api.addListener("audioMuteStatusChanged", ({ muted }) => setIsMuted(muted));
        api.addListener("videoMuteStatusChanged", ({ muted }) => setIsVideoOff(muted));
      } catch {
        if (!cancelled) fail(CALL_LOAD_FAILED_MESSAGE);
      }
    })();

    return () => {
      cancelled = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
    // `attempt` is a deliberate dependency: Retry bumps it to re-run this.
  }, [sessionId, hasEnded, attempt, fail]);

  function retry() {
    setErrorMessage(CALL_ERROR_MESSAGE);
    setAttempt((n) => n + 1);
  }

  function endCall() {
    // hangup makes Jitsi fire videoConferenceLeft → hasEnded; set it directly
    // too so ending works even if the API never finished initialising.
    apiRef.current?.executeCommand("hangup");
    setHasEnded(true);
  }

  if (hasEnded) {
    // Where Close goes: the list the call was started from — patients join
    // from /care, psychologists run their day from /psych/sessions. Leaving
    // the dark call shell is the point, so this is a real navigation rather
    // than router.back(), which could bounce a directly-opened room off-site.
    const closeHref = isPsychRole(role) ? "/psych/sessions" : "/care";
    return (
      <div
        data-call-state="ended"
        className="flex flex-1 flex-col items-center justify-center gap-5 text-center"
      >
        <p className="text-lg font-medium text-stone-900">{CALL_ENDED_MESSAGE}</p>
        <Link href={closeHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
          {CALL_CLOSE_LABEL}
        </Link>
      </div>
    );
  }

  return (
    <div data-call-state={connectionState} className="flex flex-1 flex-col">
      {/* Non-blocking status caption — see the docblock on why this must not
          cover the iframe. Rendered above the video so the pre-join screen's
          "Join meeting" stays fully clickable. */}
      {connectionState === "connecting" && (
        <p
          className="flex items-center justify-center gap-2 px-4 pt-4 text-sm font-medium text-stone-900"
          role="status"
        >
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          {connectingLabel(partnerName)}
        </p>
      )}

      <div className="relative m-4 flex flex-1 overflow-hidden rounded-lg bg-stone-100">
        {/* Jitsi mounts its iframe here (it sets allow="camera; microphone"
            on the iframe itself). Always in the DOM so the API has a
            parentNode to attach to. */}
        <div ref={containerRef} className="h-full w-full" />

        {connectionState === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-50/90 px-6 text-center text-stone-900">
            <p className="max-w-sm text-sm font-medium" role="alert">
              {errorMessage}
            </p>
            <Button variant="outline" size="sm" onClick={retry}>
              Retry
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 pb-4">
        <Button
          variant={isMuted ? "secondary" : "outline"}
          size="sm"
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute" : "Mute"}
          disabled={connectionState !== "connected"}
          onClick={() => apiRef.current?.executeCommand("toggleAudio")}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant={isVideoOff ? "secondary" : "outline"}
          size="sm"
          aria-pressed={isVideoOff}
          aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}
          disabled={connectionState !== "connected"}
          onClick={() => apiRef.current?.executeCommand("toggleVideo")}
        >
          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
        <Button variant="danger" size="sm" onClick={endCall}>
          <PhoneOff className="h-4 w-4" />
          End call
        </Button>
      </div>
    </div>
  );
}
