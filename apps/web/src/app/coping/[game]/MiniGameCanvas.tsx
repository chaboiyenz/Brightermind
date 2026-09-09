"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui";
import { ScoreSubmitPrompt } from "./ScoreSubmitPrompt";
import type { GameSlug } from "./gameData";

const TOTAL_ROUNDS = 8;
const GRID_SIZE = 9;
const ROUND_WINDOW_MS = 1400;

interface MiniGameCanvasProps {
  slug: GameSlug;
}

export function MiniGameCanvas({ slug }: MiniGameCanvasProps) {
  if (slug !== "defusion") {
    return <PlaceholderCanvas />;
  }
  return <DefusionGame />;
}

function PlaceholderCanvas() {
  return (
    <Card className="flex min-h-[240px] flex-col items-center justify-center gap-2 text-center">
      <p className="font-medium text-stone-900">Still being designed</p>
      <p className="max-w-sm text-sm text-stone-600">
        This game&apos;s interaction hasn&apos;t been built yet — check back
        once the design is settled.
      </p>
    </Card>
  );
}

// The one real, working interaction the pivot doc asks for as a proof of
// concept: a simple reaction game. A tile lights up briefly; clicking it in
// time scores a point. Runs for a fixed number of rounds, then hands off to
// ScoreSubmitPrompt. No backend involved anywhere in this.
function DefusionGame() {
  const [round, setRound] = useState(0);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone || round >= TOTAL_ROUNDS) {
      if (!isDone) setIsDone(true);
      return;
    }

    const nextTile = Math.floor(Math.random() * GRID_SIZE);
    setActiveTile(nextTile);

    const timeout = setTimeout(() => {
      setActiveTile(null);
      setRound((current) => current + 1);
    }, ROUND_WINDOW_MS);

    return () => clearTimeout(timeout);
  }, [round, isDone]);

  function handleTileClick(index: number) {
    if (index !== activeTile) return;
    setScore((current) => current + 1);
    setActiveTile(null);
    setRound((current) => current + 1);
  }

  function handleReplay() {
    setRound(0);
    setScore(0);
    setIsDone(false);
    setActiveTile(null);
  }

  if (isDone) {
    return <ScoreSubmitPrompt score={score} maxScore={TOTAL_ROUNDS} onReplay={handleReplay} />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm text-stone-600">
        Round {round + 1} of {TOTAL_ROUNDS} — tap the tile as it lights up.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: GRID_SIZE }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => handleTileClick(index)}
            className={`h-20 w-20 rounded-md border transition-colors ${
              activeTile === index
                ? "border-brand-500 bg-brand-200"
                : "border-stone-200 bg-stone-25"
            }`}
            aria-label={`Tile ${index + 1}`}
          />
        ))}
      </div>
      <p className="text-xs text-stone-600">Score: {score}</p>
    </div>
  );
}
