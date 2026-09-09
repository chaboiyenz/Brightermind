import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  Compass,
  Heart,
  ListChecks,
  NotebookPen,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ContentBlock } from "@/lib/api";
import type { GameSlug } from "@/app/coping/[game]/gameData";

// Static landing-page content, per the prototype pivot (ground rule 1: no
// live data required for layout work). The CMS `home` block still supplies
// the hero lede when the API is reachable; this fallback should be mirrored
// into apps/api/apps/content/migrations (seed_home_about) when it changes.
export const HOME_FALLBACK: ContentBlock = {
  id: 0,
  slug: "home",
  title: "BrighterMind",
  content:
    "BrighterMind helps you notice how you are doing, understand what you are " +
    "feeling, practise ways to cope, and reach a registered psychologist when " +
    "you want a person, not an app.",
  created_at: "",
};

export const HERO = {
  eyebrow: "For students · Free · Private by default",
  headlineLead: "A steadier week starts with",
  headlineEmphasis: "one small check-in.",
  primaryCta: { label: "Take a 2-minute check-in", href: "/screening/gad7" },
  secondaryCta: { label: "Talk to a psychologist", href: "/psychologists" },
  notes: ["Anxiety, stress, low mood, sleep, burnout", "Screening and support, not a diagnosis"],
} as const;

// PLACEHOLDER — verify before any public launch (prototype-roadmap ground
// rule 3: flag, do not silently invent). 1553 is the NCMH Crisis Hotline
// toll-free landline number for Luzon; confirm coverage and wording with the
// team, and replace with the real hotline directory contents once
// /resources/hotlines lands.
export const CRISIS_HOTLINE = {
  name: "NCMH Crisis Hotline",
  number: "1553",
  telHref: "tel:1553",
  note: "toll-free, 24/7",
} as const;

export type Tone = "brand" | "clay" | "sage" | "neutral";

// ---- Screening -------------------------------------------------------------

export interface ScreeningTool {
  readonly code: string;
  readonly name: string;
  readonly meta: string;
  readonly minutes: number;
  readonly status: "available" | "planned";
  readonly href: string;
}

// Instrument set from the 2.0 proposal (c:\mental\proposal). Only GAD-7 has a
// route today; the others link to the screening hub until they are built.
export const SCREENING_TOOLS: readonly ScreeningTool[] = [
  {
    code: "GAD-7",
    name: "Anxiety",
    meta: "7 questions about worry, restlessness, and feeling on edge",
    minutes: 2,
    status: "available",
    href: "/screening/gad7",
  },
  {
    code: "PHQ-9",
    name: "Low mood",
    meta: "9 questions about interest, energy, sleep, and self-worth",
    minutes: 3,
    status: "planned",
    href: "/screening/gad7",
  },
  {
    code: "DASS-21",
    name: "Stress, anxiety, low mood",
    meta: "21 questions, three scores, one picture of the past week",
    minutes: 5,
    status: "planned",
    href: "/screening/gad7",
  },
  {
    code: "WHO-5",
    name: "Well-being",
    meta: "5 questions about what has gone well, for tracking over time",
    minutes: 1,
    status: "planned",
    href: "/screening/gad7",
  },
];

// ---- Coping taxonomy -------------------------------------------------------

export type TechniqueFormat = "Tool" | "Timer" | "Guide" | "Game" | "People";

export interface Technique {
  readonly name: string;
  readonly format: TechniqueFormat;
  readonly href: string;
  readonly available: boolean;
}

export interface CopingCategory {
  readonly kind: string;
  readonly title: string;
  readonly when: string;
  readonly tone: Tone;
  readonly icon: LucideIcon;
  readonly techniques: readonly Technique[];
}

// The four-way coping taxonomy (problem / emotion / meaning / social-seeking)
// is the content structure for the whole coping library, not just this page.
export const COPING_CATEGORIES: readonly CopingCategory[] = [
  {
    kind: "Problem-focused",
    title: "Change what you can",
    when: "When the stress has a source you can act on: deadlines, clutter, a body that has been sitting all day.",
    tone: "brand",
    icon: ListChecks,
    techniques: [
      { name: "To-do list", format: "Tool", href: "/tools/todo", available: true },
      { name: "Physical exercise", format: "Timer", href: "/coping/exercise", available: true },
      { name: "Aromatherapy breathing", format: "Timer", href: "/coping/aromatherapy", available: true },
    ],
  },
  {
    kind: "Emotion-focused",
    title: "Settle what you feel",
    when: "When the feeling is bigger than the problem, or the problem cannot be changed tonight.",
    tone: "clay",
    icon: Heart,
    techniques: [
      { name: "Journaling", format: "Tool", href: "/journal", available: true },
      { name: "Yoga routines", format: "Timer", href: "/coping/yoga", available: true },
      { name: "Progressive muscle relaxation", format: "Guide", href: "/coping/body-scan", available: true },
      { name: "Body Scan", format: "Game", href: "/coping/body-scan", available: true },
    ],
  },
  {
    kind: "Meaning-focused",
    title: "Reframe the story",
    when: "When a thought keeps replaying and you need distance from it, or a reason to keep going.",
    tone: "sage",
    icon: Compass,
    techniques: [
      { name: "Spiritual reflections", format: "Guide", href: "/coping/spirituality", available: true },
      { name: "Distraction activities", format: "Game", href: "/coping/distraction", available: true },
      { name: "Cognitive reframing", format: "Game", href: "/coping/mind-management", available: true },
      { name: "Defusion", format: "Game", href: "/coping/defusion", available: true },
    ],
  },
  {
    kind: "Social-seeking",
    title: "Reach for people",
    when: "When you have been carrying it alone for too long. Peers first, or a professional straight away.",
    tone: "neutral",
    icon: Users,
    techniques: [
      { name: "Community rooms", format: "People", href: "/community", available: true },
      { name: "Message a psychologist", format: "People", href: "/psychologists", available: true },
      { name: "Video or chat session", format: "People", href: "/psychologists", available: true },
    ],
  },
];

// ---- Mini-games ------------------------------------------------------------

export interface GameHighlight {
  readonly description: string;
  readonly status: "available" | "design";
}

// Titles come from app/coping/[game]/gameData.ts; all four are playable.
export const GAME_HIGHLIGHTS: Readonly<Record<GameSlug, GameHighlight>> = {
  defusion: {
    description:
      "Anxious thoughts drift past on leaves. Tap one to notice it as a thought and let it float by.",
    status: "available",
  },
  distraction: {
    description: "Six calm pairs, no timer. One small job for a racing mind while the body settles.",
    status: "available",
  },
  "mind-management": {
    description: "Pick the balanced response to a common thought and learn the name of the trap you avoided.",
    status: "available",
  },
  "body-scan": {
    description:
      "Tense, hold, release through eight areas of the body. Progressive muscle relaxation with a body map.",
    status: "available",
  },
};

// ---- Mood tracker & journal ------------------------------------------------

export interface MoodLevel {
  readonly value: 1 | 2 | 3 | 4 | 5;
  readonly label: string;
  /** Literal colors on purpose: mood swatches must read identically in both themes. */
  readonly color: string;
  /** Text color that passes WCAG AA on `color`; only the darkest swatch takes light ink. */
  readonly ink: string;
}

const DARK_INK = "#191C1B";
const LIGHT_INK = "#FFFFFF";

export const MOOD_LEVELS: readonly MoodLevel[] = [
  { value: 1, label: "Heavy", color: "#8F8E9C", ink: DARK_INK },
  { value: 2, label: "Low", color: "#7CAE9F", ink: DARK_INK },
  { value: 3, label: "Okay", color: "#3A7A6B", ink: LIGHT_INK },
  { value: 4, label: "Good", color: "#7FA37A", ink: DARK_INK },
  { value: 5, label: "Bright", color: "#D2A183", ink: DARK_INK },
];

// Example calendar (flagged as an example in the UI). null = no entry yet.
export const EXAMPLE_MOOD_MONTH: readonly (MoodLevel["value"] | null)[] = [
  3, 3, 2, 2, 1, 3, 4,
  4, 3, 3, 4, 5, 4, 4,
  null, null, null, null, null, null, null,
  null, null, null, null, null, null, null,
];

export interface TrackItem {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
  readonly tone: Tone;
}

export const TRACK_ITEMS: readonly TrackItem[] = [
  {
    title: "Daily mood, one tap",
    description: "Five moods, optional note, gentle reminder on your phone.",
    icon: CalendarDays,
    tone: "brand",
  },
  {
    title: "Private journal",
    description: "Entries only you can read, unless you share one with your psychologist.",
    icon: NotebookPen,
    tone: "clay",
  },
  {
    title: "Coping progress",
    description: "Every routine, game and journal entry counts. Progress, not perfection.",
    icon: TrendingUp,
    tone: "sage",
  },
];

// ---- Counselling -----------------------------------------------------------

export interface CounsellingStep {
  readonly title: string;
  readonly description: string;
}

// A real sequence, so the numbered list carries information.
export const COUNSELLING_STEPS: readonly CounsellingStep[] = [
  {
    title: "Browse registered psychologists",
    description: "See specialties, languages and availability before you say a word.",
  },
  {
    title: "Message privately first",
    description: "Ask a question or say hello. Reply times are shown honestly.",
  },
  {
    title: "Book chat or video",
    description: "Pick a time that fits your class schedule. Private rooms, one-on-one.",
  },
];

export interface ExamplePsychologist {
  readonly initials: string;
  readonly name: string;
  readonly focus: string;
  readonly availability: "today" | "later";
  readonly availabilityLabel: string;
  readonly tone: Tone;
}

// EXAMPLE listing (flagged in the UI). Real profiles come from lib/mock/psychologists
// today and the directory API later.
export const EXAMPLE_PSYCHOLOGISTS: readonly ExamplePsychologist[] = [
  {
    initials: "RM",
    name: "Dr. R. Mercado, RPsy",
    focus: "Anxiety, academic stress · Filipino, English",
    availability: "today",
    availabilityLabel: "Available today",
    tone: "brand",
  },
  {
    initials: "JS",
    name: "J. Santos, RPsy",
    focus: "Low mood, sleep · Filipino, English",
    availability: "today",
    availabilityLabel: "Available today",
    tone: "clay",
  },
  {
    initials: "AD",
    name: "A. Dela Cruz, RPsy",
    focus: "Burnout, grief · English",
    availability: "later",
    availabilityLabel: "Next opening Thu",
    tone: "sage",
  },
];

// ---- Community & Learn -----------------------------------------------------

export interface CommunityRoom {
  readonly name: string;
  readonly description: string;
}

export const COMMUNITY_ROOMS: readonly CommunityRoom[] = [
  { name: "Exam season", description: "Cramming, deadlines and the fear of the results page" },
  { name: "Sleep & rest", description: "For the nights that will not end and the mornings that come too soon" },
  { name: "Just checking in", description: "No topic. Say how you are, or read how others are." },
];

export interface LearnTopic {
  readonly title: string;
  readonly description: string;
  readonly wide?: boolean;
}

// No awareness route exists yet (migration plan has no module for it); the
// tiles link to /about until psychoeducation pages land.
export const LEARN_HREF = "/about";

export const LEARN_TOPICS: readonly LearnTopic[] = [
  { title: "Anxiety", description: "Worry that will not switch off, and why the body joins in" },
  { title: "Stress", description: "Pressure that is useful in small doses and harmful in long ones" },
  { title: "Low mood", description: "When nothing feels worth it, and how to tell a slump from something more" },
  { title: "Sleep", description: "Why racing thoughts arrive at night, and small changes that help" },
  {
    title: "Burnout",
    description: "Exhaustion, cynicism and a drop in performance. Common among students, and recoverable.",
    wide: true,
  },
];

// ---- Trust -----------------------------------------------------------------

export interface TrustFact {
  readonly figure: string;
  readonly label: string;
}

// Figures from the 1.0 case study in the 2.0 proposal.
export const TRUST_FACTS: readonly TrustFact[] = [
  { figure: "140", label: "students, faculty and IT professionals evaluated BrighterMind 1.0" },
  { figure: "Feb 2025", label: "Certificate of Utilization from the campus Educational Psychologist" },
  { figure: "4", label: "validated screening tools in 2.0, each with a built-in safety pathway" },
  { figure: "Yours", label: "Your data is private by default and never sold. Sharing is always your choice." },
];
