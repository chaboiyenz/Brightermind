"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/components/ui";
import { BreathingPacer } from "./BreathingPacer";
import { MOOD_LEVELS, type MoodLevel } from "./homeContent";
import { DEFAULT_MOOD, replyForMood } from "./moodReplies";

// The hero's interactive moment: breathe, then say how today is. The reply
// routes into the coping library so the first click already teaches what the
// app does. Nothing here is saved — it is a preview of the mood tracker.
export function CheckInCard() {
  const [mood, setMood] = useState<MoodLevel["value"]>(DEFAULT_MOOD);
  const reply = replyForMood(mood);

  return (
    <section
      aria-label="Today's check-in"
      className="grid gap-5 rounded-2xl border border-stone-200 bg-stone-25 p-5 shadow-float sm:p-6"
    >
      <div className="flex items-center justify-between gap-3 text-[13px] text-stone-600">
        <strong className="font-display text-sm font-semibold text-stone-900">Today&apos;s check-in</strong>
        <span>Lavender pace · 4 in · 4 hold · 6 out</span>
      </div>

      <BreathingPacer />

      <div className="grid gap-3">
        <p id="mood-question" className="text-[15px] font-medium text-stone-900">
          How is today, so far?
        </p>
        <div role="group" aria-labelledby="mood-question" className="grid grid-cols-5 gap-2">
          {MOOD_LEVELS.map((level) => {
            const selected = level.value === mood;
            return (
              <button
                key={level.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setMood(level.value)}
                className={cn(
                  "grid justify-items-center gap-2 rounded-lg border px-1 pb-2.5 pt-3 text-xs transition-[border-color,background-color,transform] duration-200 ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 motion-safe:hover:-translate-y-px",
                  selected
                    ? "border-brand-300 bg-brand-300/20 font-semibold text-stone-900"
                    : "border-stone-200 bg-stone-50 text-stone-700 hover:border-brand-300"
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-[22px] w-[22px] rounded-full shadow-[inset_0_-3px_0_rgba(0,0,0,0.08)]"
                  style={{ backgroundColor: level.color }}
                />
                {level.label}
              </button>
            );
          })}
        </div>

        <div
          aria-live="polite"
          className="grid gap-2.5 border-t border-dashed border-stone-300 pt-3.5 text-sm text-stone-700"
        >
          <p>{reply.text}</p>
          <ul className="flex flex-wrap gap-2">
            {reply.suggestions.map((suggestion) => (
              <li key={suggestion.href + suggestion.label}>
                <Link
                  href={suggestion.href}
                  className="inline-flex h-8 items-center rounded-full border border-stone-200 bg-stone-25 px-3.5 font-display text-label-md text-stone-800 transition-colors hover:border-brand-300 hover:bg-brand-300/20"
                >
                  {suggestion.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
