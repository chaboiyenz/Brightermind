"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui";
import type { GameProps } from "../gameData";
import {
  MATCH_SETTLE_MS,
  MISMATCH_VISIBLE_MS,
  PAIR_FACES,
  dealCards,
  scoreForMisses,
  type CardState,
} from "./distractionData";

const FACE_BY_KEY = Object.fromEntries(PAIR_FACES.map((face) => [face.key, face]));

// "Calm Pairs": a memory match with no timer. Distraction as a coping
// technique is about giving the mind one small job, so the pace is the
// player's own. Score = 20 for a flawless game, minus 2 per extra try.
export function DistractionGame({ onFinish }: GameProps) {
  const [cards, setCards] = useState<readonly CardState[]>(() => dealCards());
  const [faceUp, setFaceUp] = useState<readonly number[]>([]);
  const [misses, setMisses] = useState(0);
  const [tries, setTries] = useState(0);

  const matchedCount = cards.filter((card) => card.matched).length;
  const allMatched = matchedCount === cards.length;

  // Resolve a pair once two cards are face up.
  useEffect(() => {
    if (faceUp.length !== 2) return;
    const [first, second] = faceUp.map((id) => cards[id]);
    const isMatch = first.faceKey === second.faceKey;
    const timer = setTimeout(
      () => {
        if (isMatch) {
          setCards((current) =>
            current.map((card) => (faceUp.includes(card.id) ? { ...card, matched: true } : card))
          );
        } else {
          setMisses((count) => count + 1);
        }
        setFaceUp([]);
      },
      isMatch ? MATCH_SETTLE_MS : MISMATCH_VISIBLE_MS
    );
    return () => clearTimeout(timer);
  }, [faceUp, cards]);

  useEffect(() => {
    if (allMatched) onFinish(scoreForMisses(misses));
  }, [allMatched, misses, onFinish]);

  function flip(id: number) {
    if (faceUp.length === 2 || faceUp.includes(id) || cards[id].matched) return;
    setFaceUp((current) => [...current, id]);
    if (faceUp.length === 1) setTries((count) => count + 1);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-stone-600">
        <span>Turn over two cards. Take your time.</span>
        <span className="tabular-nums">
          {matchedCount / 2} of {cards.length / 2} pairs · {tries} tries
        </span>
      </div>

      <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3" aria-label="Cards">
        {cards.map((card) => {
          const face = FACE_BY_KEY[card.faceKey];
          const Icon = face.icon;
          const isUp = card.matched || faceUp.includes(card.id);
          return (
            <li key={card.id}>
              {/* aria-disabled rather than disabled: a native disabled button
                  drops keyboard focus the moment it is flipped. flip() guards. */}
              <button
                type="button"
                onClick={() => flip(card.id)}
                aria-disabled={isUp}
                aria-label={
                  card.matched ? `${face.label}, matched` : isUp ? `${face.label}, face up` : "Face-down card"
                }
                className={cn(
                  "grid aspect-[4/5] w-full place-items-center rounded-xl border transition-[background-color,border-color,transform] duration-300 ease-gentle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300",
                  card.matched
                    ? "border-sage-500 bg-sage-50 text-sage-600"
                    : isUp
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-stone-200 bg-stone-100 text-stone-300 hover:border-brand-300 hover:bg-stone-25 motion-safe:hover:-translate-y-0.5"
                )}
              >
                {isUp ? (
                  <span className="grid justify-items-center gap-1.5">
                    <Icon className="h-8 w-8 sm:h-9 sm:w-9" aria-hidden="true" strokeWidth={1.6} />
                    <span className="font-display text-label-sm uppercase">{face.label}</span>
                  </span>
                ) : (
                  <span aria-hidden="true" className="h-3 w-3 rounded-full bg-current opacity-60" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
