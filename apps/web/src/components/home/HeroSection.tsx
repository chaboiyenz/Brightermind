import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui";
import type { ContentBlock } from "@/lib/api";
import { CheckInCard } from "./CheckInCard";
import { HERO } from "./homeContent";
import { CONTAINER_CLASS, Eyebrow } from "./SectionHeading";

// The hero lede comes from the CMS `home` block (migration plan module 17);
// everything else is static. The headline is deliberately not CMS-driven so
// the emphasised phrase keeps its typographic treatment.
export function HeroSection({ block }: { block: ContentBlock }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-14 sm:pb-20 sm:pt-20 lg:pt-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(60% 55% at 78% 40%, rgb(var(--brand-100)) 0%, transparent 70%), radial-gradient(40% 40% at 10% 90%, rgb(var(--clay-50)) 0%, transparent 70%)",
        }}
      />
      <div
        className={cn(
          CONTAINER_CLASS,
          "relative grid items-center gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16"
        )}
      >
        <div>
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
          <h1 className="mt-5 font-display text-display-sm font-semibold text-stone-900 sm:text-display lg:text-[60px] lg:leading-[1.04] lg:tracking-[-0.025em]">
            {HERO.headlineLead} <span className="text-brand-700">{HERO.headlineEmphasis}</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg leading-[1.65] text-stone-700 sm:text-[19px]">
            {block.content}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={HERO.primaryCta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
            >
              {HERO.primaryCta.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href={HERO.secondaryCta.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-stone-600">
            {HERO.notes.map((note) => (
              <li key={note} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sage-500" />
                {note}
              </li>
            ))}
          </ul>
        </div>

        <CheckInCard />
      </div>
    </section>
  );
}
