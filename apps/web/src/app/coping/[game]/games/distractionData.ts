import type { LucideIcon } from "lucide-react";
import { Bird, Cloud, Flower2, Leaf, Moon, Sun } from "lucide-react";
import { shuffle } from "@/lib/shuffle";

export interface PairFace {
  readonly key: string;
  readonly label: string;
  readonly icon: LucideIcon;
}

export const PAIR_FACES: readonly PairFace[] = [
  { key: "leaf", label: "Leaf", icon: Leaf },
  { key: "cloud", label: "Cloud", icon: Cloud },
  { key: "sun", label: "Sun", icon: Sun },
  { key: "moon", label: "Moon", icon: Moon },
  { key: "flower", label: "Flower", icon: Flower2 },
  { key: "bird", label: "Bird", icon: Bird },
];

/** A flawless game (one try per pair) scores this. Every extra try costs PENALTY_PER_MISS. */
export const PERFECT_SCORE = 20;
export const PENALTY_PER_MISS = 2;
export const MIN_SCORE = 4;
/** How long a mismatched pair stays visible before turning back. */
export const MISMATCH_VISIBLE_MS = 900;
/** Brief pause so a matched pair is seen face up before it locks in. */
export const MATCH_SETTLE_MS = 350;

export interface CardState {
  readonly id: number;
  readonly faceKey: string;
  readonly matched: boolean;
}

export function dealCards(random: () => number = Math.random): readonly CardState[] {
  const faces = PAIR_FACES.flatMap((face) => [face.key, face.key]);
  return shuffle(faces, random).map((faceKey, id) => ({ id, faceKey, matched: false }));
}

export function scoreForMisses(misses: number): number {
  return Math.max(MIN_SCORE, PERFECT_SCORE - misses * PENALTY_PER_MISS);
}
