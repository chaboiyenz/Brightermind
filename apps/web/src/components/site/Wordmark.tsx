import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";

// Shared between SiteHeader and MinimalSiteHeader so the brand mark never
// drifts between the two variants. Uses the actual BrighterMind logo (the
// same file behind the browser-tab favicon) plus an explicit text label —
// the logo does render a "BRIGHTER MIND" wordmark itself, but it's curved
// tiny text at the bottom of a square mark and reads as illegible/decorative
// at navbar height, so the name needs to be spelled out separately again.
export function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="BrighterMind, go to home"
    >
      <Image src={logo} alt="" priority className="h-9 w-auto" />
      <span className="text-lg font-semibold tracking-tight text-stone-900">
        BrighterMind
      </span>
    </Link>
  );
}
