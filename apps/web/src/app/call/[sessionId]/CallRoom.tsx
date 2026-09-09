"use client";

import { useEffect, useState } from "react";
import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui";
import { CALL_ENDED_MESSAGE, CALL_ERROR_MESSAGE, connectingLabel } from "./callContent";

type ConnectionState = "connecting" | "connected" | "error";

// Client component (module 14) — wraps what would be the Chime SDK's browser
// APIs. This is explicitly a shell (plan: "fully blocked on Ticket 4"), so
// there is no SDK here at all: connection state is driven locally on a timer
// to demo the chrome, and the camera feed is a static placeholder graphic,
// never a real getUserMedia() request (decision: avoid fake functionality
// and permission friction in a prototype).
//
// The page wraps this in `.theme-dark` (globals.css), so stone-50/100 are the
// dark room and stone-900 is light text in BOTH site themes.
export function CallRoom({ partnerName }: { partnerName: string }) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Simulates the SDK's async connect. Real integration (Ticket 4) replaces
  // this effect with actual meeting-join logic; the connectionState shape
  // stays the same either way.
  useEffect(() => {
    if (connectionState !== "connecting") return;
    const timer = setTimeout(() => setConnectionState("connected"), 1500);
    return () => clearTimeout(timer);
  }, [connectionState]);

  if (hasEnded) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
        <p className="text-lg font-medium text-stone-900">{CALL_ENDED_MESSAGE}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-stone-100 m-4">
        {/* Static placeholder graphic standing in for the real video feed. */}
        <div className="flex flex-col items-center gap-2 text-stone-600">
          <VideoOff className="h-12 w-12" aria-hidden="true" />
          <p className="text-sm">Camera preview placeholder</p>
        </div>

        {connectionState !== "connected" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-stone-50/80 text-stone-900">
            {connectionState === "connecting" && (
              <>
                <span
                  className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium">{connectingLabel(partnerName)}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-stone-900 hover:bg-stone-900/10"
                  onClick={() => setConnectionState("error")}
                >
                  Simulate connection issue
                </Button>
              </>
            )}
            {connectionState === "error" && (
              <>
                <p className="text-sm font-medium">{CALL_ERROR_MESSAGE}</p>
                <Button variant="outline" size="sm" onClick={() => setConnectionState("connecting")}>
                  Retry
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3 pb-4">
        <Button
          variant={isMuted ? "secondary" : "outline"}
          size="sm"
          aria-pressed={isMuted}
          aria-label={isMuted ? "Unmute" : "Mute"}
          onClick={() => setIsMuted((v) => !v)}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant={isVideoOff ? "secondary" : "outline"}
          size="sm"
          aria-pressed={isVideoOff}
          aria-label={isVideoOff ? "Turn camera on" : "Turn camera off"}
          onClick={() => setIsVideoOff((v) => !v)}
        >
          {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
        <Button variant="danger" size="sm" onClick={() => setHasEnded(true)}>
          <PhoneOff className="h-4 w-4" />
          End call
        </Button>
      </div>
    </div>
  );
}
