import Link from "next/link";
import { Phone } from "lucide-react";
import { FOOTER_LINKS, HOTLINES_LINK } from "./siteLinks";

const FOOTER_LINK_CLASS =
  "text-sm text-stone-600 transition-colors hover:text-brand-700";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-100">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-base font-semibold text-stone-900">BrighterMind</p>
          <p className="max-w-xs text-sm text-stone-600">
            Mental health support for students. A screening and support tool,
            not a diagnostic one.
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-stone-600">
            Explore
          </p>
          <ul className="grid grid-cols-2 gap-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={FOOTER_LINK_CLASS}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Deliberately the most visually weighted footer column: the
            migration plan (module 16) notes the hotline directory is opened
            in a crisis, so it must never be buried. */}
        <div className="rounded-lg border border-clay-100 bg-clay-50 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-clay-600">
            <Phone className="h-4 w-4" aria-hidden="true" />
            Need help right now?
          </p>
          <p className="mb-3 text-sm text-stone-700">
            If you are in immediate danger, contact local emergency services.
            For someone to talk to, our hotline list is always available.
          </p>
          <Link
            href={HOTLINES_LINK.href}
            className="text-sm font-medium text-clay-600 underline underline-offset-4 hover:text-clay-500"
          >
            View {HOTLINES_LINK.label.toLowerCase()}
          </Link>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-stone-600 sm:px-6">
          &copy; {year} BrighterMind. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
