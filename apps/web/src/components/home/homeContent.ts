import type { LucideIcon } from "lucide-react";
import { CalendarHeart, ClipboardCheck, Leaf, Stethoscope } from "lucide-react";
import type { ContentBlock } from "@/lib/api";
import { PRIMARY_HOTLINE } from "./hotlinesData";

// Static landing-page content, per the prototype pivot (ground rule 1: no
// live data required for layout work). Matches the seed copy in
// apps/api/apps/content/migrations/0002_seed_home_about.py so the page reads
// the same whether or not the CMS block is fetched.
export const HOME_FALLBACK: ContentBlock = {
  id: 0,
  slug: "home",
  title: "BrighterMind",
  content:
    "Mental health support for students — screening tools, mood tracking, " +
    "coping techniques, and support from registered psychologists, all in " +
    "one place.",
  created_at: "",
};

export const HERO_EYEBROW = "Built for students";

export const PRIMARY_CTA = { label: "Get started", href: "/signup" } as const;
export const SECONDARY_CTA = { label: "Learn more", href: "/about" } as const;

// Primary crisis number shown on the home banner. Real data — see
// hotlinesData.ts for the full 8-entry directory and sourcing notes. Still
// web-sourced rather than independently re-verified by a human; do not
// remove that caveat from the UI until someone has actually confirmed it.
export const CRISIS_HOTLINE = {
  name: PRIMARY_HOTLINE.name,
  number: PRIMARY_HOTLINE.number,
  telHref: PRIMARY_HOTLINE.telHref,
  note: "24/7",
} as const;

export type FeatureTone = "brand" | "clay" | "sage";

export interface FeatureHighlight {
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly icon: LucideIcon;
  readonly tone: FeatureTone;
}

export const FEATURE_HIGHLIGHTS: readonly FeatureHighlight[] = [
  {
    title: "GAD-7 screening",
    description:
      "A short, validated anxiety check-in. Get a clear picture in under two minutes, with no alarming labels.",
    href: "/screening/gad7",
    icon: ClipboardCheck,
    tone: "brand",
  },
  {
    title: "Mood tracker",
    description:
      "Log how each day felt on a calendar and notice patterns over weeks, not just moments.",
    href: "/mood",
    icon: CalendarHeart,
    tone: "clay",
  },
  {
    title: "Coping techniques",
    description:
      "Guided breathing, movement routines, and grounding exercises you can do between classes.",
    href: "/coping/exercise",
    icon: Leaf,
    tone: "sage",
  },
  {
    title: "Psychologist access",
    description:
      "Browse registered psychologists, message them privately, and book a session when you are ready.",
    href: "/psychologists",
    icon: Stethoscope,
    tone: "brand",
  },
];
