import Link from "next/link";
import { HOTLINES_LINK } from "@/components/site/siteLinks";
import { CRISIS_HOTLINE } from "./homeContent";
import { CONTAINER_CLASS } from "./SectionHeading";

// Sits directly under the sticky header so it is visible before any
// scrolling — crisis resources must never be below the fold on this app.
export function CrisisBanner() {
  return (
    <aside
      aria-label="Crisis support"
      className="border-b border-clay-100 bg-clay-50 text-sm text-stone-700"
    >
      <div className={`${CONTAINER_CLASS} flex flex-wrap items-center justify-between gap-x-5 gap-y-1.5 py-2.5`}>
        <p className="flex items-center gap-2">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-clay-500" />
          <span>
            If you are in crisis right now, call the{" "}
            <a
              href={CRISIS_HOTLINE.telHref}
              className="font-semibold text-clay-600 underline underline-offset-4"
            >
              {CRISIS_HOTLINE.name} · {CRISIS_HOTLINE.number}
            </a>{" "}
            <span className="text-stone-600">({CRISIS_HOTLINE.note})</span>. You do not need an account.
          </span>
        </p>
        <Link
          href={HOTLINES_LINK.href}
          className="font-semibold text-clay-600 underline-offset-4 hover:underline"
        >
          All {HOTLINES_LINK.label.toLowerCase()} &rarr;
        </Link>
      </div>
    </aside>
  );
}
