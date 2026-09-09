import type { MoodLevel } from "./homeContent";

export interface MoodSuggestion {
  readonly label: string;
  readonly href: string;
}

export interface MoodReply {
  readonly text: string;
  readonly suggestions: readonly MoodSuggestion[];
}

// Each mood maps to a short, non-judgemental reply and three next steps drawn
// from different coping kinds (see COPING_CATEGORIES). Heavier moods lead
// with people and crisis resources, lighter ones with habit-building.
const REPLIES: Readonly<Record<MoodLevel["value"], MoodReply>> = {
  1: {
    text: "That sounds like a lot to carry. Nothing to fix right now. A slow breath first, and a person is one message away if you want one.",
    suggestions: [
      { label: "Message a psychologist", href: "/psychologists" },
      { label: "Body Scan", href: "/coping/body-scan" },
      { label: "Crisis hotlines", href: "/resources/hotlines" },
    ],
  },
  2: {
    text: "Low days happen. Something small and kind counts: a few lines in the journal, or a room where others are having the same kind of day.",
    suggestions: [
      { label: "Write in the journal", href: "/journal" },
      { label: "Just checking in room", href: "/community" },
      { label: "Lavender breathing", href: "/coping/aromatherapy" },
    ],
  },
  3: {
    text: "Okay is a fine place to be. A short routine now can keep it that way.",
    suggestions: [
      { label: "10-minute stretch", href: "/coping/exercise" },
      { label: "Log today's mood", href: "/mood" },
      { label: "Play Defusion", href: "/coping/defusion" },
    ],
  },
  4: {
    text: "Good to hear. A good day is a good day to notice what helped, so it is easier to find again.",
    suggestions: [
      { label: "Note what helped", href: "/journal" },
      { label: "Tidy the to-do list", href: "/tools/todo" },
      { label: "Reply to someone", href: "/community" },
    ],
  },
  5: {
    text: "Bright days are worth marking. Log it, and consider a two-minute check-in so you have a baseline for later.",
    suggestions: [
      { label: "Log a bright day", href: "/mood" },
      { label: "Take a check-in", href: "/screening/gad7" },
      { label: "Yoga routine", href: "/coping/yoga" },
    ],
  },
};

export const DEFAULT_MOOD: MoodLevel["value"] = 3;

export function replyForMood(value: MoodLevel["value"]): MoodReply {
  return REPLIES[value];
}
