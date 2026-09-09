import { Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { CrisisBanner } from "@/components/home/CrisisBanner";
import { CRISIS_HOTLINE } from "@/components/home/homeContent";

// Minimal stub — the directory itself isn't built yet, but the footer/nav
// already link here, so this must exist rather than 404. Reuses the same
// (still-placeholder, see homeContent.ts) hotline entry shown on the home
// page; do not add more numbers here until they're verified.
export default function HotlinesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      <SiteHeader />
      <CrisisBanner />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <h1 className="text-2xl font-semibold text-stone-900">
            Crisis hotlines
          </h1>
          <p className="mt-2 text-stone-600">
            If you or someone you know is in immediate danger, contact local
            emergency services right away.
          </p>

          <div className="mt-8 rounded-lg border border-clay-100 bg-clay-50 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-clay-600">
              <Phone className="h-4 w-4" aria-hidden="true" />
              {CRISIS_HOTLINE.name}
            </p>
            <a
              href={CRISIS_HOTLINE.telHref}
              className="mt-1 block text-2xl font-semibold text-stone-900 underline-offset-4 hover:underline"
            >
              {CRISIS_HOTLINE.number}
            </a>
            <p className="mt-1 text-sm text-stone-600">
              {CRISIS_HOTLINE.note} — placeholder number, not yet verified for
              public launch.
            </p>
          </div>

          <p className="mt-8 text-sm text-stone-600">
            A fuller directory of hotlines and support resources is coming
            soon.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
