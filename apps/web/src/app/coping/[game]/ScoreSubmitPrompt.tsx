"use client";

import { useState } from "react";
import { Button, useToast } from "@/components/ui";

interface ScoreSubmitPromptProps {
  score: number;
  maxScore: number;
  onReplay: () => void;
}

// Post-game reflection micro-copy over a bare score number, per the
// REDESIGN note — and lets a user replay immediately without navigating
// away. Submission is mocked (no POST /api/v2/games/:slug/attempts/).
export function ScoreSubmitPrompt({ score, maxScore, onReplay }: ScoreSubmitPromptProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { showToast } = useToast();

  function handleSubmit() {
    setHasSubmitted(true);
    showToast({ title: "Nice round!", tone: "success" });
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <p className="text-3xl font-medium text-stone-900">
        {score} / {maxScore}
      </p>
      <p className="max-w-sm text-sm text-stone-600">
        However that went, showing up for it is the part that counts.
      </p>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} disabled={hasSubmitted}>
          {hasSubmitted ? "Saved" : "Save this round"}
        </Button>
        <Button variant="outline" onClick={onReplay}>
          Play again
        </Button>
      </div>
    </div>
  );
}
