"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui";
import { LOGIN_LINK, PRIMARY_NAV } from "./siteLinks";

const NAV_LINK_CLASS =
  "rounded-md px-3 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700";

// Sticky site chrome. Client component only because of the mobile menu
// toggle — everything else is static markup.
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-stone-25/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Wordmark />

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {PRIMARY_NAV.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <Link
            href={LOGIN_LINK.href}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "ml-2")}
          >
            {LOGIN_LINK.label}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-stone-700 hover:bg-stone-100 md:hidden"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Always mounted (toggled via the `hidden` attribute) so the toggle
          button's aria-controls target exists in the DOM in both states. */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!isMenuOpen}
        className="border-t border-stone-200 bg-stone-25 px-4 pb-4 pt-2 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(NAV_LINK_CLASS, "block")}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link
              href={LOGIN_LINK.href}
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "w-full")}
              onClick={() => setIsMenuOpen(false)}
            >
              {LOGIN_LINK.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Wordmark() {
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
