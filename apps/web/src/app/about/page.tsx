import { ContentBlockSection } from "@/components/ContentBlockSection";
import { fetchContentBlock, type ContentBlock } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { ABOUT_FALLBACK } from "@/lib/mock/contentBlocks";

// Mock-mode retrofit (decision (b), docs/prototype-roadmap.md) — matches
// home page.tsx's loadHeroBlock exactly: static fallback content when mock
// mode is on, real ISR fetch otherwise, falling back to the same static
// content if that fetch errors (API unreachable at build/revalidate time).
async function loadAboutBlock(): Promise<ContentBlock> {
  if (isMockMode()) return ABOUT_FALLBACK;
  try {
    return await fetchContentBlock("about");
  } catch {
    return ABOUT_FALLBACK;
  }
}

export default async function AboutPage() {
  const block = await loadAboutBlock();

  return (
    <main className="min-h-screen bg-stone-50">
      <ContentBlockSection block={block} />
    </main>
  );
}
