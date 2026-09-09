"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Button, ScoreRing, useToast } from "@/components/ui";
import { bestScore, readAttempts, saveAttempt, type GameAttempt } from "./gameAttempts";
import { GAME_META, type GameSlug } from "./gameData";

interface ScoreSubmitPromptProps {
  readonly slug: GameSlug;
  readonly score: number;
  readonly onReplay: () => void;
}

// Post-game reflection over a bare number (module 8 design note). Saving
// writes to local attempt history; the toast wording stays the same once the
// real endpoint replaces it.
export function ScoreSubmitPrompt({ slug, score, onReplay }: ScoreSubmitPromptProps) {
  const meta = GAME_META[slug];
  const [hasSaved, setHasSaved] = useState(false);
  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setPreviousBest(bestScore(readAttempts(), slug));
  }, [slug]);

  const percent = Math.round((score / meta.maxScore) * 100);
  const isNewBest = previousBest !== null && score > previousBest;

  function handleSave() {
    if (hasSaved) return;
    const attempt: GameAttempt = {
      gameSlug: slug,
      score,
      maxScore: meta.maxScore,
      playedAt: new Date().toISOString(),
    };
    saveAttempt(attempt);
    setHasSaved(true);
    showToast({
      title: "Round saved",
      description: "It counts toward your coping progress.",
      tone: "success",
    });
  }

  return (
    <section
      aria-label="Round complete"
      className="grid gap-6 rounded-2xl border border-stone-200 bg-stone-25 p-6 text-center shadow-soft sm:p-8"
    >
      <div className="grid justify-items-center gap-3">
        <ScoreRing value={percent} label={meta.technique} size={112} />
        <p className="font-display text-headline-md text-stone-900 tabular-nums">
          {score} <span className="text-stone-600">/ {meta.maxScore}</span>
        </p>
        {isNewBest && <p className="text-sm font-medium text-sage-600">A new personal best.</p>}
        {previousBest !== null && !isNewBest && (
          <p className="text-sm text-stone-600">Your best so far is {previousBest}.</p>
        )}
      </div>
      <p className="mx-auto max-w-[52ch] leading-relaxed text-stone-700">{meta.reflection}</p>
      <div className="flex flex-wrap justify-center gap-2">
        {/* aria-disabled, not disabled: the button keeps focus after saving so
            the confirmation is not lost on keyboard users. handleSave guards. */}
        <Button onClick={handleSave} aria-disabled={hasSaved} className="aria-disabled:opacity-60">
          {hasSaved ? "Saved" : "Save this round"}
        </Button>
        <Button variant="outline" onClick={onReplay}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Play again
        </Button>
        <Link
          href="/coping"
          className="inline-flex h-11 items-center px-4 text-[15px] font-medium text-stone-700 hover:text-brand-700"
        >
          Back to coping
        </Link>
      </div>
    </section>
  );
}
