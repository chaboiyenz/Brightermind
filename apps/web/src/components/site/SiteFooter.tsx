import Link from "next/link";
import { CRISIS_HOTLINE } from "@/components/home/homeContent";
import { BrandMark } from "./BrandMark";
import { FOOTER_PEOPLE_LINKS, FOOTER_TOOL_LINKS, HOTLINES_LINK, type SiteLink } from "./siteLinks";

const FOOTER_LINK_CLASS = "text-sm text-stone-700 transition-colors hover:text-brand-700";

function FooterColumn({ title, links }: { title: string; links: readonly SiteLink[] }) {
  return (
    <nav aria-label={`Footer: ${title}`}>
      <p className="mb-3 font-display text-label-sm uppercase text-stone-600">{title}</p>
      <ul className="grid gap-2">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className={FOOTER_LINK_CLASS}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-container gap-8 px-5 py-14 sm:grid-cols-2 sm:px-10 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr] lg:px-14">
        <div className="space-y-3">
          <BrandMark size={24} className="text-lg" />
          <p className="max-w-[32ch] text-sm leading-relaxed text-stone-700">
            Mental health support for students. A screening and self-help tool that
            complements care. It does not diagnose or treat, and it is not an emergency
            service.
          </p>
        </div>

        <FooterColumn title="Tools" links={FOOTER_TOOL_LINKS} />
        <FooterColumn title="People" links={FOOTER_PEOPLE_LINKS} />

        {/* Deliberately the most visually weighted footer column: the
            migration plan (module 16) notes the hotline directory is opened
            in a crisis, so it must never be buried. */}
        <div className="grid gap-2 rounded-xl border border-clay-100 bg-clay-50 p-5">
          <p className="font-display text-[15px] font-semibold text-clay-600">Need help right now?</p>
          <p className="text-sm leading-relaxed text-stone-700">
            If you are in immediate danger, contact local emergency services. For someone to
            talk to, call the{" "}
            <a
              href={CRISIS_HOTLINE.telHref}
              className="font-semibold text-clay-600 underline underline-offset-4"
            >
              {CRISIS_HOTLINE.name}, {CRISIS_HOTLINE.number}
            </a>
            , {CRISIS_HOTLINE.note}.
          </p>
          <Link
            href={HOTLINES_LINK.href}
            className="text-sm font-semibold text-clay-600 underline underline-offset-4 hover:text-clay-500"
          >
            View all {HOTLINES_LINK.label.toLowerCase()}
          </Link>
        </div>
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-container flex-wrap justify-between gap-2 px-5 py-4 text-[13px] text-stone-600 sm:px-10 lg:px-14">
          <span>&copy; {year} BrighterMind. All rights reserved.</span>
          <span>Privacy &middot; Terms &middot; Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
