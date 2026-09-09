import Link from "next/link";
import { buttonVariants, cn } from "@/components/ui";
import { BOOK_LINK } from "@/components/site/siteLinks";
import { COUNSELLING_STEPS, EXAMPLE_PSYCHOLOGISTS, type Tone } from "./homeContent";
import { CONTAINER_CLASS, SECTION_CLASS } from "./SectionHeading";

// The one "evening" section: `theme-dark` (globals.css) applies the Evening
// Pine token set to this subtree in both site themes, so the booking CTA
// always sits in the calmest, most enclosed part of the page — and every
// color below is an ordinary token, not a pinned hex.
const AVATAR_TONES: Record<Tone, string> = {
  brand: "bg-brand-500",
  clay: "bg-clay-400",
  sage: "bg-sage-500",
  neutral: "bg-stone-600",
};

export function CounsellingSection() {
  return (
    <section
      id="counselling"
      aria-labelledby="counselling-heading"
      className={cn(SECTION_CLASS, "theme-dark relative overflow-hidden bg-brand-50 text-stone-900")}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 60% at 85% 20%, rgb(var(--brand-300) / 0.25), transparent 70%)" }}
      />
      <div className={cn(CONTAINER_CLASS, "relative grid items-center gap-10 lg:grid-cols-2 lg:gap-20")}>
        <div>
          <p className="inline-flex items-center gap-2 font-display text-label-md uppercase text-brand-700 before:h-0.5 before:w-[18px] before:rounded-full before:bg-current before:content-['']">
            Counselling
          </p>
          <h2
            id="counselling-heading"
            className="mt-3.5 font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] sm:text-headline-lg lg:text-[40px] lg:leading-[1.1]"
          >
            When you need more than an app, a person is here
          </h2>
          <p className="mt-4 max-w-[58ch] text-lg leading-[1.65] text-stone-700">
            Registered psychologists, one-on-one, by chat or video in a private room. No
            waiting room, no one else in the call, and your check-ins are only shared if you
            choose.
          </p>
          <ol className="mt-7 border-t border-brand-200">
            {COUNSELLING_STEPS.map((step, index) => (
              <li key={step.title} className="grid grid-cols-[44px_1fr] gap-4 border-b border-brand-200 py-4">
                <span className="font-display text-[26px] font-light leading-none tabular-nums text-brand-700">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold">{step.title}</p>
                  <p className="text-[15px] text-stone-700">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={BOOK_LINK.href} className={buttonVariants({ variant: "accent", size: "lg" })}>
              Schedule a counselling session
            </Link>
            <Link
              href="/psychologists"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-brand-200 hover:border-brand-500 hover:bg-brand-100"
              )}
            >
              See psychologists
            </Link>
          </div>
        </div>

        <div aria-label="Example psychologists" className="grid gap-3">
          {EXAMPLE_PSYCHOLOGISTS.map((psychologist) => (
            <div
              key={psychologist.name}
              className="grid grid-cols-[52px_1fr] items-center gap-4 rounded-lg border border-brand-200 bg-stone-25/60 px-4 py-4 sm:grid-cols-[52px_1fr_auto]"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid h-[52px] w-[52px] place-items-center rounded-full font-display text-lg font-medium text-on-brand",
                  AVATAR_TONES[psychologist.tone]
                )}
              >
                {psychologist.initials}
              </span>
              <div>
                <p className="text-[15.5px] font-semibold">{psychologist.name}</p>
                <p className="text-[13.5px] text-stone-700">{psychologist.focus}</p>
              </div>
              <span className="col-start-2 inline-flex items-center gap-1.5 whitespace-nowrap text-[12.5px] text-stone-700 sm:col-start-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-2 w-2 rounded-full",
                    psychologist.availability === "today" ? "bg-sage-500" : "bg-clay-400"
                  )}
                />
                {psychologist.availabilityLabel}
              </span>
            </div>
          ))}
          <p className="text-[13px] text-stone-600">
            Example listing. Real profiles are verified against the PRC register before they appear.
          </p>
        </div>
      </div>
    </section>
  );
}
