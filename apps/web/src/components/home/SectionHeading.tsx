import type { ReactNode } from "react";
import { cn } from "@/components/ui";

// docs/DESIGN.md layout: 1160px max content width, 1.25 / 2.5 / 3.5 rem margins.
export const CONTAINER_CLASS = "mx-auto w-full max-w-container px-5 sm:px-10 lg:px-14";

export const SECTION_CLASS = "py-16 sm:py-20 lg:py-24";

export const TONE_CHIP_CLASSES = {
  brand: "bg-brand-100 text-brand-700",
  clay: "bg-clay-100 text-clay-600",
  sage: "bg-sage-100 text-sage-600",
  neutral: "bg-stone-200 text-stone-700",
} as const;

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2 font-display text-label-md uppercase text-brand-700 before:h-0.5 before:w-[18px] before:rounded-full before:bg-brand-600 before:content-['']",
        className
      )}
    >
      {children}
    </p>
  );
}

interface SectionHeadingProps {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly lede: string;
  readonly className?: string;
}

export function SectionHeading({ id, eyebrow, title, lede, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-10 grid max-w-[64ch] gap-3.5 sm:mb-12", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2
        id={id}
        className="font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.01em] text-stone-900 sm:text-headline-lg lg:text-[40px] lg:leading-[1.1]"
      >
        {title}
      </h2>
      <p className="max-w-[58ch] text-lg leading-[1.65] text-stone-700">{lede}</p>
    </div>
  );
}
