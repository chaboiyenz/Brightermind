"use client";

import { useEffect, useRef, useState } from "react";
import { Leaf } from "lucide-react";
import { cn } from "@/components/ui";
import type { GameProps } from "../gameData";
import {
  DEFUSION_PREFIX,
  DEFUSION_THOUGHTS,
  DRIFT_SECONDS,
  FIRST_SPAWN_DELAY_MS,
  MAX_ACTIVE_LEAVES,
  RELEASE_HOLD_MS,
  SPAWN_INTERVAL_MS,
} from "./defusionData";

type LeafStatus = "waiting" | "drifting" | "releasing" | "released" | "passed";

interface LeafState {
  readonly id: number;
  readonly thought: string;
  readonly status: LeafStatus;
  /** Vertical lane, as a percentage of the stream height. */
  readonly lane: number;
}

const LANES = [12, 52] as const;

const INITIAL_LEAVES: readonly LeafState[] = DEFUSION_THOUGHTS.map((thought, index) => ({
  id: index,
  thought,
  status: "waiting",
  lane: LANES[index % LANES.length],
}));

/** Moves one leaf `from` one status `to` another; a no-op if it is not in `from`. */
function transition(
  leaves: readonly LeafState[],
  id: number,
  from: LeafStatus,
  to: LeafStatus
): readonly LeafState[] {
  return leaves.map((leaf) => (leaf.id === id && leaf.status === from ? { ...leaf, status: to } : leaf));
}

const isActive = (leaf: LeafState) => leaf.status === "drifting" || leaf.status === "releasing";

// "Leaves on a stream" (ACT defusion). Thoughts drift across; tapping one
// reframes it as a thought and lets it fade. Untapped leaves reach the far
// bank still carrying the thought. Passing is driven by a JS timer, not the
// CSS animation, so the rules are identical for reduced-motion users (whose
// leaves sit still) and every timer is cleared on unmount.
export function DefusionGame({ onFinish }: GameProps) {
  const [leaves, setLeaves] = useState<readonly LeafState[]>(INITIAL_LEAVES);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const released = leaves.filter((leaf) => leaf.status === "released").length;
  const resolved = leaves.filter((leaf) => leaf.status === "released" || leaf.status === "passed").length;
  const waiting = leaves.filter((leaf) => leaf.status === "waiting");
  const active = leaves.filter(isActive);

  function schedule(callback: () => void, ms: number) {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, ms);
    timers.current.add(timer);
  }

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Spawn: put the next waiting leaf on the stream when there is room, and
  // let it pass once it has had its full drift.
  useEffect(() => {
    if (waiting.length === 0 || active.length >= MAX_ACTIVE_LEAVES) return;
    const delay = active.length === 0 && resolved === 0 ? FIRST_SPAWN_DELAY_MS : SPAWN_INTERVAL_MS;
    const next = waiting[0];
    const timer = setTimeout(() => {
      setLeaves((current) => transition(current, next.id, "waiting", "drifting"));
      schedule(
        () => setLeaves((current) => transition(current, next.id, "drifting", "passed")),
        DRIFT_SECONDS * 1000
      );
    }, delay);
    return () => clearTimeout(timer);
    // `waiting[0]` is derived from `leaves`; the primitive deps below are what actually change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting.length, active.length, resolved]);

  // Finish once every leaf has either been released or has passed.
  useEffect(() => {
    if (resolved === leaves.length) onFinish(released);
  }, [resolved, released, leaves.length, onFinish]);

  function release(id: number) {
    const leaf = leaves.find((candidate) => candidate.id === id);
    if (leaf?.status !== "drifting") return;
    setLeaves((current) => transition(current, id, "drifting", "releasing"));
    schedule(() => setLeaves((current) => transition(current, id, "releasing", "released")), RELEASE_HOLD_MS);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
        <span>Tap a leaf to notice the thought and let it go.</span>
        <span className="tabular-nums">
          {resolved} of {leaves.length} leaves · {released} let go
        </span>
      </div>

      <div
        role="group"
        aria-label="Stream"
        className="relative h-72 overflow-hidden rounded-xl border border-brand-100"
        style={{
          background: "linear-gradient(180deg, rgb(var(--brand-50)) 0%, rgb(var(--brand-100)) 100%)",
        }}
      >
        <Ripples />
        {active.map((leaf) => {
          const releasing = leaf.status === "releasing";
          return (
            // aria-disabled rather than disabled so a tapped leaf keeps focus
            // while its reframed wording shows; release() guards re-taps.
            <button
              key={leaf.id}
              type="button"
              onClick={() => release(leaf.id)}
              aria-disabled={releasing}
              style={{ top: `${leaf.lane}%`, animationDuration: `${DRIFT_SECONDS}s` }}
              className={cn(
                "absolute left-[-45%] w-[42%] min-w-[180px] max-w-[260px] rounded-2xl border bg-stone-25 px-4 py-3 text-left text-[14.5px] leading-snug shadow-soft transition-[opacity,transform] duration-700 ease-gentle motion-safe:animate-drift motion-reduce:left-[8%] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                releasing
                  ? "border-sage-500 text-stone-700 opacity-0 [animation-play-state:paused] motion-safe:-translate-y-4"
                  : "border-brand-200 text-stone-900 hover:border-brand-500"
              )}
            >
              <span className="mb-1.5 flex items-center gap-1.5 font-display text-label-sm uppercase text-brand-700">
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                {releasing ? "Noticed" : "A thought"}
              </span>
              {releasing ? (
                <span>
                  <span className="text-stone-600">{DEFUSION_PREFIX}</span>{" "}
                  <span className="italic">{leaf.thought}</span>
                </span>
              ) : (
                leaf.thought
              )}
            </button>
          );
        })}
        {active.length === 0 && resolved < leaves.length && (
          <p className="absolute inset-x-0 bottom-4 text-center text-sm text-stone-600">
            The next thought is on its way.
          </p>
        )}
      </div>

      <p className="text-center text-sm text-stone-600">
        You are not the thought. You are the one watching it drift by.
      </p>
    </div>
  );
}

// Decorative water lines. Hidden from assistive tech.
function Ripples() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full stroke-brand-200"
      viewBox="0 0 400 288"
      preserveAspectRatio="none"
      fill="none"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M-10 90c40-10 80 10 120 0s80-10 120 0 80 10 120 0 40-6 60 0" opacity=".9" />
      <path d="M-10 170c40-10 80 10 120 0s80-10 120 0 80 10 120 0 40-6 60 0" opacity=".7" />
      <path d="M-10 250c40-10 80 10 120 0s80-10 120 0 80 10 120 0 40-6 60 0" opacity=".5" />
    </svg>
  );
}
