"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import type { Scent } from "./aromatherapyData";

type Phase = "idle" | "inhale" | "hold" | "exhale";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Ready when you are",
  inhale: "Breathe in",
  hold: "Hold",
  exhale: "Breathe out",
};

interface BreathingTimerProps {
  scent: Scent;
}

// Client component reusing module 7's timer pattern, but per the REDESIGN
// note this is "already the strongest interaction" — a full ambient visual
// (an expanding/contracting circle synced to the breath) rather than a bare
// text countdown. Genuinely functional client-side, no backend needed.
export function BreathingTimer({ scent }: BreathingTimerProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsInPhase, setSecondsInPhase] = useState(0);

  const phaseDuration: Record<Exclude<Phase, "idle">, number> = {
    inhale: scent.inhaleTime,
    hold: scent.holdTime,
    exhale: scent.exhaleTime,
  };

  // Reset whenever a different scent is picked.
  useEffect(() => {
    setPhase("idle");
    setSecondsInPhase(0);
  }, [scent]);

  useEffect(() => {
    if (phase === "idle") return;

    const duration = phaseDuration[phase];
    setSecondsInPhase(duration);

    const tick = setInterval(() => {
      setSecondsInPhase((current) => Math.max(current - 1, 0));
    }, 1000);

    const advance = setTimeout(() => {
      setPhase((current) => (current === "inhale" ? "hold" : current === "hold" ? "exhale" : "inhale"));
    }, duration * 1000);

    return () => {
      clearInterval(tick);
      clearTimeout(advance);
    };
    // phaseDuration is derived fresh from `scent` every render — including it
    // would re-trigger this effect on every tick's re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, scent]);

  const isExpanded = phase === "inhale" || phase === "hold";
  const transitionSeconds = phase === "inhale" ? scent.inhaleTime : phase === "exhale" ? scent.exhaleTime : 0;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="relative flex h-56 w-56 items-center justify-center">
        <div
          className="absolute rounded-full bg-brand-200"
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${isExpanded ? 1 : 0.55})`,
            transitionProperty: "transform",
            transitionDuration: `${transitionSeconds}s`,
            transitionTimingFunction: "ease-in-out",
          }}
        />
        <div className="relative flex flex-col items-center gap-1">
          <p className="text-base font-medium text-stone-900">{PHASE_LABEL[phase]}</p>
          {phase !== "idle" && <p className="text-3xl font-medium text-stone-900">{secondsInPhase}</p>}
        </div>
      </div>

      <Button onClick={() => setPhase((current) => (current === "idle" ? "inhale" : "idle"))}>
        {phase === "idle" ? "Start" : "Stop"}
      </Button>
    </div>
  );
}
