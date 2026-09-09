"use client";

import { useEffect, useState } from "react";

// 4 s in, 4 s hold, 6 s out — the "lavender" pace from
// app/coping/aromatherapy/aromatherapyData.ts. Must match the `breathe`
// keyframes in tailwind.config.ts (28% / 57% of a 14 s cycle).
const INHALE_SECONDS = 4;
const HOLD_SECONDS = 4;
const EXHALE_SECONDS = 6;
const CYCLE_SECONDS = INHALE_SECONDS + HOLD_SECONDS + EXHALE_SECONDS;

interface Phase {
  readonly word: string;
  readonly remaining: number;
}

export function phaseAt(elapsedSeconds: number): Phase {
  const t = ((elapsedSeconds % CYCLE_SECONDS) + CYCLE_SECONDS) % CYCLE_SECONDS;
  if (t < INHALE_SECONDS) return { word: "Breathe in", remaining: INHALE_SECONDS - Math.floor(t) };
  if (t < INHALE_SECONDS + HOLD_SECONDS) {
    return { word: "Hold", remaining: INHALE_SECONDS + HOLD_SECONDS - Math.floor(t) };
  }
  return { word: "Breathe out", remaining: CYCLE_SECONDS - Math.floor(t) };
}

const STATIC_PHASE: Phase = { word: "Breathe", remaining: 0 };

export function BreathingPacer() {
  const [phase, setPhase] = useState<Phase>({ word: "Breathe in", remaining: INHALE_SECONDS });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setReducedMotion(true);
      setPhase(STATIC_PHASE);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const next = phaseAt((now - start) / 1000);
      setPhase((current) =>
        current.word === next.word && current.remaining === next.remaining ? current : next
      );
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    // The rings are decorative; the phase word is real instruction and stays
    // readable by assistive tech. aria-live is deliberately off: the count
    // changes every second and would be noise, but the current phase can be
    // read on demand.
    <div className="relative grid h-[210px] place-items-center">
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-50 opacity-70 motion-safe:animate-breathe" />
      <span aria-hidden="true" className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-100 opacity-70 motion-safe:animate-breathe" />
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_20px_40px_-20px_rgb(var(--brand-700))] motion-safe:animate-breathe"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgb(var(--brand-300)), rgb(var(--brand-600)))",
        }}
      />
      <div className="relative z-10 text-center font-display text-on-brand" aria-live="off">
        <span className="block text-lg tracking-[0.02em]">{phase.word}</span>
        <span className="mt-0.5 block font-sans text-[12px] uppercase tracking-[0.06em] opacity-85">
          {reducedMotion ? "4 in · 4 hold · 6 out" : phase.remaining}
        </span>
      </div>
    </div>
  );
}
