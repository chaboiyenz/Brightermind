import { Phone } from "lucide-react";
import { HOTLINES } from "@/components/home/hotlinesData";

// Full directory of real Philippine crisis/psychological support hotlines.
// See hotlinesData.ts for sourcing notes — these are web-sourced, not yet
// independently re-verified by a human against each live number.
//
// Header/footer come from the root layout's SiteChrome now (lifted there
// after this page was first written) — don't render SiteHeader/SiteFooter
// here too, that's what caused the doubled navbar.
//
// No CrisisBanner here either — the directory below already leads with the
// same NCMH entry the banner would show, so it was just repeating the first
// list item above itself.
export default function HotlinesPage() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-semibold text-stone-900">
          Crisis hotlines
        </h1>
        <p className="mt-2 text-stone-600">
          If you or someone you know is in immediate danger, contact local
          emergency services right away.
        </p>
        <p className="mt-2 text-sm text-stone-500">
          These numbers were sourced from official and independent public
          listings but have not yet been individually re-verified by a
          human — please confirm a number is current before relying on it
          in an emergency.
        </p>

        <ul className="mt-8 flex flex-col gap-4">
          {HOTLINES.map((hotline) => (
            <li
              key={hotline.name}
              className="rounded-lg border border-clay-100 bg-clay-50 p-5"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-clay-600">
                <Phone className="h-4 w-4" aria-hidden="true" />
                {hotline.name}
              </p>
              <a
                href={hotline.telHref}
                className="mt-1 block text-2xl font-semibold text-stone-900 underline-offset-4 hover:underline"
              >
                {hotline.number}
              </a>
              <p className="mt-1 text-sm text-stone-600">
                {hotline.description}
              </p>
              <p className="mt-2 text-xs text-stone-400">
                Source: {hotline.source}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
