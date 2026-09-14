import { CrisisBanner } from "@/components/home/CrisisBanner";
import { HeroSection } from "@/components/home/HeroSection";
import { ScreeningSection } from "@/components/home/ScreeningSection";
import { CopingSection } from "@/components/home/CopingSection";
import { GamesSection } from "@/components/home/GamesSection";
import { TrackSection } from "@/components/home/TrackSection";
import { CounsellingSection } from "@/components/home/CounsellingSection";
import { CommunityLearnSection } from "@/components/home/CommunityLearnSection";
import { TrustStrip } from "@/components/home/TrustStrip";
import { HOME_FALLBACK } from "@/components/home/homeContent";
import { fetchContentBlock, type ContentBlock } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";

// The hero lede still comes from the CMS `home` block when the API is
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

// Section order follows the visitor's journey: check in, screen, cope, play,
// track, talk to someone, find others, understand, then evidence.
//
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
        <ScreeningSection />
        <CopingSection />
        <GamesSection />
        <TrackSection />
        <CounsellingSection />
        <CommunityLearnSection />
        <TrustStrip />
      </main>
    </>
  );
}
