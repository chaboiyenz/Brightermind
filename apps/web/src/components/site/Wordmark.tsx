import Image from "next/image";
import Link from "next/link";
import logo from "@/app/icon.png";

// Shared between SiteHeader and MinimalSiteHeader so the brand mark never
// drifts between the two variants. Uses the actual BrighterMind logo (the
// same file behind the browser-tab favicon) instead of the placeholder dot
// + text lockup — the logo already renders the "BrighterMind" wordmark
// itself, so there's no separate text alongside it here.
export function Wordmark() {
  return (
    <Link href="/" className="flex items-center" aria-label="BrighterMind, go to home">
      <Image src={logo} alt="BrighterMind" priority className="h-11 w-auto" />
    </Link>
  );
}
