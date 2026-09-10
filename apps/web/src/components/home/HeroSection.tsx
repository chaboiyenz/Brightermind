import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui";
import type { ContentBlock } from "@/lib/api";
import { HERO_EYEBROW, PRIMARY_CTA, SECONDARY_CTA } from "./homeContent";

export function HeroSection({ block }: { block: ContentBlock }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-stone-50">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:py-24">
        <div>
          <p className="mb-4 inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {HERO_EYEBROW}
          </p>
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            {block.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-700 sm:text-xl">
            {block.content}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={PRIMARY_CTA.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "sm:min-w-44")}
            >
              {PRIMARY_CTA.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={SECONDARY_CTA.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "sm:min-w-44")}
            >
              {SECONDARY_CTA.label}
            </Link>
          </div>
          <p className="mt-6 text-sm text-stone-600">
            Free for students. Private by default. Not a substitute for a
            professional diagnosis.
          </p>
        </div>

        <HeroGraphic />
      </div>
    </section>
  );
}

// Decorative only — hidden from assistive tech. Illustration source: v1's
// asset audit (.references/_asset-audit) — a Freepik stock illustration,
// carried over as-is. Flagging per ground rule 3: confirm Freepik licensing/
// attribution requirements are met before this goes anywhere near a real
// launch, same as the other content flagged throughout the prototype.
function HeroGraphic() {
  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-none" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- plain <img>
          for a public/ SVG; next/image's optimizer doesn't apply to SVGs. */}
      <img src="/images/home-img.svg" alt="" className="h-auto w-full" />
    </div>
  );
}
