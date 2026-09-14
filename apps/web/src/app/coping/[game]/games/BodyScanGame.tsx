"use client";

import { useEffect, useState } from "react";
import { Pause, Play, SkipForward, Square } from "lucide-react";
import { Button, cn } from "@/components/ui";
import type { GameProps } from "../gameData";
import { SCAN_STEPS, phaseSeconds, type BodyArea, type ScanPhase } from "./bodyScanData";

interface ScanState {
  readonly stepIndex: number;
  readonly phase: ScanPhase;
  readonly secondsLeft: number;
  readonly running: boolean;
  /** Areas fully tensed and released. Lives in the same state as the timer so one pure update owns both. */
  readonly completed: number;
}

const INITIAL: ScanState = {
  stepIndex: 0,
  phase: "tense",
  secondsLeft: phaseSeconds("tense"),
  running: true,
  completed: 0,
};

/** One second passes. Pure, so it is safe under Strict Mode's double-invoked updaters. */
export function tick(state: ScanState): ScanState {
  if (state.secondsLeft > 1) return { ...state, secondsLeft: state.secondsLeft - 1 };
  if (state.phase === "tense") {
    return { ...state, phase: "release", secondsLeft: phaseSeconds("release") };
  }
  return {
    ...state,
    stepIndex: state.stepIndex + 1,
    phase: "tense",
    secondsLeft: phaseSeconds("tense"),
    completed: state.completed + 1,
  };
}

function skipArea(state: ScanState): ScanState {
  return { ...state, stepIndex: state.stepIndex + 1, phase: "tense", secondsLeft: phaseSeconds("tense") };
}

// Progressive muscle relaxation with a body map. Score = areas completed out
// of eight; skipping an area (because it hurts to tense) does not count it,
// stopping early keeps what was done.
export function BodyScanGame({ onFinish }: GameProps) {
  const [state, setState] = useState<ScanState>(INITIAL);

  const finished = state.stepIndex >= SCAN_STEPS.length;
  const step = finished ? null : SCAN_STEPS[state.stepIndex];

  useEffect(() => {
    if (finished) onFinish(state.completed);
  }, [finished, state.completed, onFinish]);

  useEffect(() => {
    if (!state.running || finished) return;
    const timer = setInterval(() => setState(tick), 1000);
    return () => clearInterval(timer);
  }, [state.running, finished]);

  if (!step) return null;

  const total = phaseSeconds(state.phase);
  const progress = 1 - state.secondsLeft / total;
  const isTense = state.phase === "tense";

  return (
    <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
      <BodyMap active={step.area} tense={isTense} />

      <div className="grid gap-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
          <span className="tabular-nums">
            Area {state.stepIndex + 1} of {SCAN_STEPS.length}
          </span>
          <span className="tabular-nums">{state.completed} released</span>
        </div>

        <div aria-live="polite" className="grid gap-1">
          <p className="font-display text-label-md uppercase text-brand-700">{step.label}</p>
          <p className="font-display text-headline-md text-stone-900">
            {isTense ? "Tense and hold" : "Release"}
          </p>
          <p className="text-[15px] leading-relaxed text-stone-700">
            {isTense ? step.tenseCue : step.releaseCue}
          </p>
        </div>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between text-sm text-stone-600">
            <span>{isTense ? "Hold" : "Let go"}</span>
            <span className="font-display text-headline-sm tabular-nums text-stone-900">{state.secondsLeft}s</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-stone-200" role="presentation">
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-1000 ease-linear",
                isTense ? "bg-clay-400" : "bg-sage-500"
              )}
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setState((current) => ({ ...current, running: !current.running }))}
          >
            {state.running ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
            {state.running ? "Pause" : "Resume"}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setState(skipArea)}>
            <SkipForward className="h-4 w-4" aria-hidden="true" />
            Skip area
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onFinish(state.completed)}>
            <Square className="h-4 w-4" aria-hidden="true" />
            Stop here
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple seated figure; the active area fills brand (tense = clay). Purely
// visual, the live text above carries the instruction for assistive tech.
function BodyMap({ active, tense }: { active: BodyArea; tense: boolean }) {
  const fill = (area: BodyArea) =>
    area === active ? (tense ? "fill-clay-400" : "fill-brand-500") : "fill-stone-200";
  const cls = (area: BodyArea) => cn("transition-colors duration-500", fill(area));

  return (
    <svg aria-hidden="true" viewBox="0 0 120 260" className="mx-auto h-64 w-auto sm:h-72" focusable="false">
      <circle cx="60" cy="30" r="20" className={cls("face")} />
      <rect x="34" y="52" width="52" height="16" rx="8" className={cls("shoulders")} />
      <rect x="40" y="68" width="40" height="52" rx="10" className={cls("stomach")} />
      <rect x="20" y="66" width="14" height="60" rx="7" className={cls("arms")} />
      <rect x="86" y="66" width="14" height="60" rx="7" className={cls("arms")} />
      <circle cx="27" cy="136" r="9" className={cls("hands")} />
      <circle cx="93" cy="136" r="9" className={cls("hands")} />
      <rect x="40" y="122" width="18" height="60" rx="9" className={cls("thighs")} />
      <rect x="62" y="122" width="18" height="60" rx="9" className={cls("thighs")} />
      <rect x="41" y="184" width="16" height="50" rx="8" className={cls("calves")} />
      <rect x="63" y="184" width="16" height="50" rx="8" className={cls("calves")} />
      <rect x="36" y="236" width="22" height="12" rx="6" className={cls("feet")} />
      <rect x="62" y="236" width="22" height="12" rx="6" className={cls("feet")} />
    </svg>
  );
}
