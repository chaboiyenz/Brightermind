import Link from "next/link";

// Shared between SiteHeader and MinimalSiteHeader so the brand mark never
// drifts between the two variants.
export function Wordmark() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-lg font-semibold tracking-tight text-stone-900"
    >
      <span
        aria-hidden="true"
        className="inline-block h-3 w-3 rounded-full bg-brand-600 ring-4 ring-brand-100"
      />
      BrighterMind
    </Link>
  );
}
