import { ContentBlockSection } from "@/components/ContentBlockSection";
import { fetchContentBlock, type ContentBlock } from "@/lib/api";

// Matches the seed data in apps/api/apps/content/migrations/0002_seed_home_about.py —
// used only if the ISR fetch below fails (API unreachable at build/revalidate
// time), per the migration plan's "falls back to last-known-good content" note.
const FALLBACK: ContentBlock = {
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

export default async function AboutPage() {
  let block: ContentBlock;
  try {
    block = await fetchContentBlock("about");
  } catch {
    block = FALLBACK;
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <ContentBlockSection block={block} />
    </main>
  );
}
