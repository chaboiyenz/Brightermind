import Link from "next/link";
import { Phone } from "lucide-react";
import { HOTLINES_LINK } from "@/components/site/siteLinks";
import { CRISIS_HOTLINE } from "./homeContent";

// Sits directly under the sticky header so it is visible before any
// scrolling — crisis resources must never be below the fold on this app.
export function CrisisBanner() {
  return (
    <aside
      aria-label="Crisis support"
      className="border-b border-clay-100 bg-clay-50 text-stone-800"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-clay-600" aria-hidden="true" />
          <span>
            In crisis? Call the{" "}
            <a
              href={CRISIS_HOTLINE.telHref}
              className="font-semibold text-clay-600 underline underline-offset-4"
            >
              {CRISIS_HOTLINE.name} {CRISIS_HOTLINE.number}
            </a>{" "}
            <span className="text-stone-600">({CRISIS_HOTLINE.note})</span>
          </span>
        </p>
        <Link
          href={HOTLINES_LINK.href}
          className="font-medium text-clay-600 underline-offset-4 hover:underline"
        >
          View all {HOTLINES_LINK.label.toLowerCase()} &rarr;
        </Link>
      </div>
    </aside>
  );
}
