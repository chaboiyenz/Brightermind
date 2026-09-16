"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, PersonStanding, Puzzle, Sparkles, type LucideIcon } from "lucide-react";
import { Card, buttonVariants } from "@/components/ui";
import { bestScore, readAttempts, type GameAttempt } from "@/app/coping/[game]/gameAttempts";
import { GAME_META, GAME_SLUGS, type GameSlug } from "@/app/coping/[game]/gameData";

const ICONS: Readonly<Record<GameSlug, LucideIcon>> = {
  defusion: Leaf,
  distraction: Puzzle,
  "mind-management": Sparkles,
  "body-scan": PersonStanding,
};

interface ContinueItem {
  readonly slug: GameSlug;
  readonly detail: string;
  readonly cta: string;
}

function relativeDay(iso: string, now: Date): string {
  const days = Math.floor((now.getTime() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "played today";
  if (days === 1) return "played yesterday";
  return `played ${days} days ago`;
}

// "Continue where you left off": the game you played most recently and one
// you have not started, from the same local attempt history the game shell
// writes (bm_game_attempts). Rendered after mount so the server and first
// client paint agree; until then the card shows the two default games.
export function pickContinueItems(attempts: readonly GameAttempt[], now: Date): readonly ContinueItem[] {
  const latest = [...attempts].sort((a, b) => (a.playedAt < b.playedAt ? 1 : -1))[0];
  const played = new Set(attempts.map((attempt) => attempt.gameSlug));
  const unplayed = GAME_SLUGS.filter((slug) => !played.has(slug));

  const items: ContinueItem[] = [];
  if (latest) {
    const best = bestScore(attempts, latest.gameSlug);
    items.push({
      slug: latest.gameSlug,
      detail: `${GAME_META[latest.gameSlug].technique} · best ${best ?? latest.score} of ${latest.maxScore} · ${relativeDay(latest.playedAt, now)}`,
      cta: "Play again",
    });
  }
  for (const slug of unplayed) {
    if (items.length >= 2) break;
    const meta = GAME_META[slug];
    items.push({ slug, detail: `${meta.technique} · ${meta.minutes} minutes · not started`, cta: "Start" });
  }
  return items.slice(0, 2);
}

export function ContinueCard() {
  const [items, setItems] = useState<readonly ContinueItem[]>(() => pickContinueItems([], new Date()));

  useEffect(() => {
    setItems(pickContinueItems(readAttempts(), new Date()));
  }, []);

  return (
    <Card className="grid gap-1">
      <div className="flex items-center justify-between gap-3 pb-2">
        <h2 className="font-display text-base font-medium text-stone-900">Continue where you left off</h2>
        <Link href="/coping" className="text-sm font-medium text-brand-600 hover:text-brand-700">
          All coping techniques
        </Link>
      </div>
      <ul className="divide-y divide-stone-200">
        {items.map((item) => {
          const Icon = ICONS[item.slug];
          return (
            <li key={item.slug} className="flex flex-wrap items-center justify-between gap-3 py-3.5">
              <div className="flex items-center gap-3.5">
                <span className="grid h-11 w-11 place-items-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[15px] font-medium text-stone-900">{GAME_META[item.slug].title}</p>
                  <p className="text-sm text-stone-600">{item.detail}</p>
                </div>
              </div>
              <Link href={`/coping/${item.slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
                {item.cta}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
