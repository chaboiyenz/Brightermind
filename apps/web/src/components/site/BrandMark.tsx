import Link from "next/link";
import { Brain } from "lucide-react";
import { cn } from "@/components/ui";

// The one brand mark for the site header, auth-flow header and footer, so it
// stays recognizable at both navbar and compact footer sizes.
export function BrandMark({ className, size = 30 }: { className?: string; size?: number }) {
  return (
    <Link
      href="/"
      aria-label="BrighterMind, go to home"
      className={cn(
        "inline-flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-stone-900",
        className
      )}
    >
      <span
        aria-hidden="true"
        className="grid shrink-0 place-items-center rounded-lg bg-brand-100 text-brand-700"
        style={{ height: size, width: size }}
      >
        <Brain className="h-[62%] w-[62%]" strokeWidth={1.8} />
      </span>
      BrighterMind
    </Link>
  );
}
