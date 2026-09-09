import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
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
export default async function HomePage() {
  const block = await loadHeroBlock();

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <SiteHeader />
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
      <SiteFooter />
    </div>
  );
}
