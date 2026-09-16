"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card, Textarea, cn, useToast } from "@/components/ui";
import { MOOD_LEVELS, type MoodLevel } from "@/components/home/homeContent";
import { DEFAULT_MOOD, replyForMood } from "@/components/home/moodReplies";

// Daily check-in on the patient's home (design canvas "Patient: Home").
// Same five mood swatches as the tracker and the landing-page preview.
// Prototype: logging shows a confirmation and keeps the reply's suggestion;
// the real version posts to the mood API the tracker page already uses.
export function HomeCheckIn({ moodDaysLogged }: { moodDaysLogged: number }) {
  const [mood, setMood] = useState<MoodLevel["value"]>(DEFAULT_MOOD);
  const [note, setNote] = useState("");
  const [hasLogged, setHasLogged] = useState(false);
  const { showToast } = useToast();
  const reply = replyForMood(mood);

  function handleLog() {
    setHasLogged(true);
    showToast({
      title: "Mood logged",
      description: "Prototype only. It will appear on your mood tracker once the API is wired.",
      tone: "success",
    });
  }

  return (
    <Card className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="checkin-heading" className="font-display text-base font-medium text-stone-900">
          How are you feeling right now?
        </h2>
        <span className="text-sm text-stone-600">Logged {moodDaysLogged} of the last 7 days</span>
      </div>

      <div role="group" aria-labelledby="checkin-heading" className="flex flex-wrap gap-2">
        {MOOD_LEVELS.map((level) => {
          const selected = level.value === mood;
          return (
            <button
              key={level.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setMood(level.value)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full border px-4 font-display text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                selected
                  ? "border-brand-300 bg-brand-300/20 text-stone-900"
                  : "border-stone-200 bg-stone-25 text-stone-800 hover:border-brand-300"
              )}
            >
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: level.color }} />
              {level.label}
            </button>
          );
        })}
      </div>

      <Textarea
        aria-label="Anything on your mind? (optional)"
        placeholder="Anything on your mind? (optional)"
        value={note}
        onChange={(event) => setNote(event.target.value)}
        className="min-h-[88px] rounded-md border-[1.5px] border-stone-200 px-4 py-3 text-[15px] leading-relaxed"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-stone-600">Only you and your psychologist can see this.</span>
        <Button size="sm" onClick={handleLog} aria-disabled={hasLogged} className="aria-disabled:opacity-60">
          {hasLogged ? "Logged" : "Log mood"}
        </Button>
      </div>

      {hasLogged && (
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
      )}
    </Card>
  );
}
