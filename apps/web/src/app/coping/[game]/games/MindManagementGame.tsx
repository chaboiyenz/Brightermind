"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button, cn } from "@/components/ui";
import type { GameProps } from "../gameData";
import { shuffle } from "@/lib/shuffle";
import { REFRAME_ROUNDS, type ReframeOption } from "./mindManagementData";

interface RoundState {
  readonly index: number;
  readonly options: readonly ReframeOption[];
  readonly chosen: ReframeOption | null;
  readonly firstTryCorrect: boolean | null;
}

function buildRound(index: number): RoundState {
  const round = REFRAME_ROUNDS[index];
  return {
    index,
    options: shuffle([{ text: round.balanced }, ...round.traps]),
    chosen: null,
    firstTryCorrect: null,
  };
}

// "Reframe": pick the balanced thought out of three. A wrong pick names the
// thinking trap and lets you choose again; only first-try picks score, so the
// game rewards recognising the trap, not guessing through the list.
export function MindManagementGame({ onFinish }: GameProps) {
  const [round, setRound] = useState<RoundState>(() => buildRound(0));
  const [score, setScore] = useState(0);

  const data = REFRAME_ROUNDS[round.index];
  const solved = round.chosen !== null && round.chosen.distortion === undefined;
  const isLast = round.index === REFRAME_ROUNDS.length - 1;

  function choose(option: ReframeOption) {
    if (solved) return;
    const correct = option.distortion === undefined;
    const firstTry = round.firstTryCorrect === null;
    if (correct && firstTry) setScore((current) => current + 1);
    setRound((current) => ({
      ...current,
      chosen: option,
      firstTryCorrect: current.firstTryCorrect ?? correct,
    }));
  }

  function next() {
    if (isLast) {
      onFinish(score);
      return;
    }
    setRound(buildRound(round.index + 1));
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
        <span>Which response is balanced?</span>
        <span className="tabular-nums">
          Round {round.index + 1} of {REFRAME_ROUNDS.length} · {score} balanced
        </span>
      </div>

      <blockquote className="rounded-xl border-l-4 border-clay-400 bg-clay-50 px-5 py-4 text-[17px] leading-relaxed text-stone-900">
        “{data.thought}”
      </blockquote>

      <ul className="grid gap-2.5" aria-label="Responses">
        {round.options.map((option) => {
          const isChosen = round.chosen?.text === option.text;
          const isTrap = option.distortion !== undefined;
          const revealTrap = isChosen && isTrap;
          const revealBalanced = solved && !isTrap;
          return (
            <li key={option.text}>
              {/* aria-disabled keeps focus on the option just chosen so the
                  feedback below is reached in reading order; choose() guards. */}
              <button
                type="button"
                onClick={() => (solved || revealTrap ? undefined : choose(option))}
                aria-disabled={solved || revealTrap}
                className={cn(
                  "grid w-full grid-cols-[1fr_auto] items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-[15px] leading-relaxed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                  revealBalanced
                    ? "border-sage-500 bg-sage-50 text-stone-900"
                    : revealTrap
                      ? "border-brick-500/60 bg-brick-50 text-stone-700"
                      : "border-stone-200 bg-stone-25 text-stone-800 hover:border-brand-300 aria-disabled:opacity-70"
                )}
              >
                <span>{option.text}</span>
                {revealBalanced && <Check className="mt-0.5 h-5 w-5 text-sage-600" aria-hidden="true" />}
                {revealTrap && (
                  <span className="rounded-sm bg-brick-100 px-2 py-0.5 font-display text-label-sm uppercase text-brick-600">
                    {option.distortion}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      <div aria-live="polite" className="min-h-[3.5rem] text-[15px] leading-relaxed text-stone-700">
        {solved && (
          <p>
            <span className="font-semibold text-sage-600">
              {round.firstTryCorrect ? "Balanced, first try." : "That's the balanced one."}
            </span>{" "}
            {data.why}
          </p>
        )}
        {round.chosen !== null && !solved && (
          <p>
            That one is <span className="font-semibold text-brick-600">{round.chosen.distortion?.toLowerCase()}</span>.
            Try another response.
          </p>
        )}
      </div>

      {solved && (
        <div className="flex justify-end">
          <Button onClick={next}>
            {isLast ? "See your result" : "Next thought"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
