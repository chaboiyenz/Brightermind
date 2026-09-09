"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Play } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { MiniGameCanvas } from "./MiniGameCanvas";
import { ScoreSubmitPrompt } from "./ScoreSubmitPrompt";
import { GAME_META, type GameSlug } from "./gameData";

type Stage = { readonly kind: "intro" } | { readonly kind: "playing" } | { readonly kind: "done"; readonly score: number };

// Calm start and end screens around the actual game (module 8 design note),
// and a replay that remounts the game without leaving the page.
export function MiniGameShell({ slug }: { slug: GameSlug }) {
  const meta = GAME_META[slug];
  const [stage, setStage] = useState<Stage>({ kind: "intro" });
  const [playCount, setPlayCount] = useState(0);

  function start() {
    setPlayCount((count) => count + 1);
    setStage({ kind: "playing" });
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/coping"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-700 hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All coping techniques
        </Link>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{meta.kind}</Badge>
          <Badge tone="brand">{meta.technique}</Badge>
        </div>
      </div>

      <header>
        <h1 className="font-display text-headline-lg text-stone-900 sm:text-[36px] sm:leading-[1.15]">
          {meta.title}
        </h1>
        <p className="mt-2 text-lg text-stone-700">{meta.tagline}</p>
      </header>

      {stage.kind === "intro" && (
        <section className="grid gap-6 rounded-2xl border border-stone-200 bg-stone-25 p-6 shadow-soft sm:p-8">
          <p className="max-w-[60ch] leading-relaxed text-stone-800">{meta.intro}</p>
          <ol className="grid gap-2.5">
            {meta.howTo.map((step, index) => (
              <li key={step} className="grid grid-cols-[28px_1fr] items-start gap-3 text-[15px] text-stone-700">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 font-display text-label-md text-brand-700">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg" onClick={start}>
              <Play className="h-4 w-4" aria-hidden="true" />
              Start
            </Button>
            <span className="inline-flex items-center gap-1.5 text-sm text-stone-600">
              <Clock className="h-4 w-4" aria-hidden="true" />
              About {meta.minutes} min
            </span>
          </div>
        </section>
      )}

      {stage.kind === "playing" && (
        <section
          key={playCount}
          aria-label={`${meta.title} in progress`}
          className="rounded-2xl border border-stone-200 bg-stone-25 p-5 shadow-soft sm:p-8"
        >
          <MiniGameCanvas slug={slug} onFinish={(score) => setStage({ kind: "done", score })} />
        </section>
      )}

      {stage.kind === "done" && (
        <ScoreSubmitPrompt slug={slug} score={stage.score} onReplay={start} />
      )}
    </div>
  );
}
