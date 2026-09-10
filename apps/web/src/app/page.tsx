import { CrisisBanner } from "@/components/home/CrisisBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HOME_FALLBACK } from "@/components/home/homeContent";
import { fetchContentBlock, type ContentBlock } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";

// The headline/subhead still come from the CMS `home` block when the API is
// reachable (migration plan module 17), falling back to the seed copy
// otherwise. Everything else on the page is static per the prototype pivot.
async function loadHeroBlock(): Promise<ContentBlock> {
  if (isMockMode()) return HOME_FALLBACK;
  try {
    return await fetchContentBlock("home");
  } catch {
    return HOME_FALLBACK;
  }
}

// SiteHeader/SiteFooter render from the root layout (SiteChrome) now — this
// page only owns the content between them. CrisisBanner stays home-page-only
// (see SiteChrome's docblock for why it wasn't lifted alongside the header).
export default async function HomePage() {
  const block = await loadHeroBlock();

  return (
    <>
      <CrisisBanner />
      <main className="flex-1">
        <HeroSection block={block} />
        <FeatureGrid />
      </main>
    </>
  );
}
