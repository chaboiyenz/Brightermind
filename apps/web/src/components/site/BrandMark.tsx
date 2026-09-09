import Link from "next/link";
import { cn } from "@/components/ui";

// Wordmark used in the header and footer. The mark is a soft ring around a
// filled circle with a small upward curve — calm, not clinical. Pure SVG on
// theme tokens so it recolors with the theme (apps/web/public has no assets).
export function BrandMark({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-stone-900",
        className
      )}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        aria-hidden="true"
        focusable="false"
        className="shrink-0"
      >
        <circle cx="16" cy="16" r="15" className="fill-brand-100" />
        <circle cx="16" cy="16" r="9.5" className="fill-brand-600" />
        <path
          d="M11 17.5c2 2.6 8 2.6 10 0"
          className="stroke-on-brand"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      BrighterMind
    </Link>
  );
}
