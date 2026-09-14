import Image from "next/image";
import Link from "next/link";
import { cn } from "@/components/ui";
import logo from "@/app/icon.png";

// The one brand mark for the site header, the auth-flow header and the
// footer, so it never drifts between them. Uses the actual BrighterMind logo
// (the same file behind the browser-tab favicon) plus the name spelled out —
// the logo's own curved "BRIGHTER MIND" text is illegible at navbar height.
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
      <Image
        src={logo}
        alt=""
        priority
        className="shrink-0"
        style={{ height: size, width: "auto" }}
      />
      BrighterMind
    </Link>
  );
}
