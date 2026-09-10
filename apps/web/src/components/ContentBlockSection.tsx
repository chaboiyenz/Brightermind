import type { ContentBlock } from "@/lib/api";

// Used by About only — Home moved to its own HeroSection/FeatureGrid layout
// in PR #53, so this is no longer shared per module 17's original note.
export function ContentBlockSection({ block }: { block: ContentBlock }) {
  return (
    <article className="mx-auto grid max-w-4xl items-center gap-10 px-6 py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
      <div>
        <h1 className="mb-4 text-2xl font-medium text-stone-900">{block.title}</h1>
        <p className="whitespace-pre-line text-stone-700">{block.content}</p>
      </div>
      {/* Decorative only. Illustration source: v1's asset audit
          (.references/_asset-audit) — a Freepik stock illustration, carried
          over as-is. Flagging per ground rule 3: confirm Freepik
          licensing/attribution requirements before a real launch. */}
      <div className="mx-auto w-full max-w-sm lg:max-w-none" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element -- plain <img>
            for a public/ SVG; next/image's optimizer doesn't apply to SVGs. */}
        <img src="/images/about-img.svg" alt="" className="h-auto w-full" />
      </div>
    </article>
  );
}
