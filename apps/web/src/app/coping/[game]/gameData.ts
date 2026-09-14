// Mini-game registry (docs/frontend-migration-plan.md module 8). One shell,
// four games, one attempt shape: { gameSlug, score, maxScore }.
//
// All four games are fully playable and client-side only. Scores are kept in
// localStorage (gameAttempts.ts) until POST /api/v2/games/:slug/attempts/
// exists; nothing here depends on the backend.

export type GameSlug = "defusion" | "distraction" | "mind-management" | "body-scan";

export const GAME_SLUGS: readonly GameSlug[] = [
  "defusion",
  "distraction",
  "mind-management",
  "body-scan",
];

export interface GameMeta {
  readonly title: string;
  /** Which of the four coping kinds this game practises. */
  readonly kind: "Emotion-focused" | "Meaning-focused";
  readonly technique: string;
  readonly tagline: string;
  readonly intro: string;
  readonly howTo: readonly string[];
  readonly minutes: number;
  readonly maxScore: number;
  readonly reflection: string;
}

export const GAME_META: Readonly<Record<GameSlug, GameMeta>> = {
  defusion: {
    title: "Leaves on a Stream",
    kind: "Meaning-focused",
    technique: "Defusion",
    tagline: "Notice a thought, name it, and let it float by.",
    intro:
      "Anxious thoughts drift past on leaves. You do not have to argue with them or push them away. Tap a leaf to notice the thought as a thought, and watch it carry on downstream.",
    howTo: [
      "A thought appears on a leaf and drifts across the stream.",
      "Tap it to say “I’m having the thought that…” and let it go.",
      "Leaves you do not tap reach the other side still carrying the thought.",
    ],
    minutes: 2,
    maxScore: 8,
    reflection:
      "Thoughts you notice lose some of their grip. The ones that floated by unnoticed are not failures, they are practice for next time.",
  },
  distraction: {
    title: "Calm Pairs",
    kind: "Meaning-focused",
    technique: "Distraction",
    tagline: "Give a racing mind one small, gentle job.",
    intro:
      "Twelve cards, six matching pairs. A short game of memory gives the worrying part of your mind something simple to hold while your body settles.",
    howTo: [
      "Turn over two cards at a time.",
      "Matching pairs stay face up; others turn back over.",
      "Fewer tries means a higher score, but there is no timer.",
    ],
    minutes: 2,
    maxScore: 20,
    reflection:
      "A few minutes somewhere else is not avoidance, it is a pause. If the worry is still there afterwards, it may be a little quieter.",
  },
  "mind-management": {
    title: "Reframe",
    kind: "Meaning-focused",
    technique: "Cognitive reframing",
    tagline: "Catch the distortion, choose the balanced thought.",
    intro:
      "Each round shows a thought many students have. Two of the responses repeat a thinking trap; one is balanced. Pick the balanced one and learn the name of the trap you avoided.",
    howTo: [
      "Read the thought, then the three responses.",
      "Choose the one that is fair and realistic, not just positive.",
      "Wrong picks show which trap they fall into, then you can try again.",
    ],
    minutes: 4,
    maxScore: 8,
    reflection:
      "Balanced thoughts are not rosy ones. They leave room for a bad grade and a good semester at the same time.",
  },
  "body-scan": {
    title: "Body Scan",
    kind: "Emotion-focused",
    technique: "Progressive muscle relaxation",
    tagline: "Tense, hold, release. One area at a time.",
    intro:
      "Progressive muscle relaxation moves through eight areas of the body. You tense each one for five seconds, then let it go for ten, noticing the difference between the two.",
    howTo: [
      "Sit or lie somewhere comfortable and follow the highlighted area.",
      "Tense on the cue, hold gently, release on the cue.",
      "Pause any time. Skip an area if it hurts to tense it.",
    ],
    minutes: 3,
    maxScore: 8,
    reflection:
      "Muscles you have just released feel heavier and warmer. That contrast is the whole point; the body learns what letting go feels like.",
  },
};

export const GAME_TITLES: Readonly<Record<GameSlug, string>> = {
  defusion: GAME_META.defusion.title,
  distraction: GAME_META.distraction.title,
  "mind-management": GAME_META["mind-management"].title,
  "body-scan": GAME_META["body-scan"].title,
};

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as readonly string[]).includes(value);
}

/** Shared props contract for every game component. */
export interface GameProps {
  readonly onFinish: (score: number) => void;
}
