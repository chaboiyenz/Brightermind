import type { ContentBlock } from "@/lib/api";

// Prototype pivot (.references/roadmap/prototype-roadmap.MD), decision (b)
// retrofit — static data, no call to GET /v2/content/about/. Matches the
// seed data in apps/api/apps/content/migrations/0002_seed_home_about.py, the
// same fixture /about's page.tsx already used inline before this retrofit —
// moved here to follow the lib/mock/ convention (see HOME_FALLBACK in
// components/home/homeContent.ts for the equivalent "home" block, which
// stays where it is since it's bundled with other home-only content).
export const ABOUT_FALLBACK: ContentBlock = {
  id: 0,
  slug: "about",
  title: "About BrighterMind",
  content:
    "BrighterMind is a mental health support platform built for students. " +
    "It provides screening tools, mood tracking, coping technique modules, " +
    "and a way to connect with registered psychologists. It is a screening " +
    "and support tool, not a diagnostic one.",
  created_at: "",
};
