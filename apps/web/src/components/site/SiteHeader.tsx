"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";
import { BOOK_LINK, LOGIN_LINK, PRIMARY_NAV } from "./siteLinks";

const NAV_LINK_CLASS =
  "rounded-full px-3.5 py-2 text-[15px] font-medium text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700";

// Sticky, frosted site chrome (docs/DESIGN.md "Frosted Ambient Layering").
// Client component only because of the mobile menu toggle.
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-frost/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[68px] max-w-container items-center justify-between gap-6 px-5 sm:px-10 lg:px-14">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {PRIMARY_NAV.map((link) => (
            <Link key={link.href} href={link.href} className={NAV_LINK_CLASS}>
              {link.label}
            </Link>
          ))}
          <ThemeToggle className="ml-1" />
          <Link
            href={LOGIN_LINK.href}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "ml-1")}
          >
            {LOGIN_LINK.label}
          </Link>
          <Link
            href={BOOK_LINK.href}
            className={cn(buttonVariants({ variant: "accent", size: "sm" }), "ml-1")}
          >
            {BOOK_LINK.label}
          </Link>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Always mounted (toggled via the `hidden` attribute) so the toggle
          button's aria-controls target exists in the DOM in both states. */}
      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!isMenuOpen}
        className="border-t border-stone-200 bg-stone-25 px-5 pb-5 pt-2 lg:hidden"
      >
        <ul className="flex flex-col gap-1">
          {PRIMARY_NAV.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(NAV_LINK_CLASS, "block rounded-lg")}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-col gap-2 pt-3 sm:flex-row">
            <Link
              href={LOGIN_LINK.href}
              className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}
              onClick={() => setIsMenuOpen(false)}
            >
              {LOGIN_LINK.label}
            </Link>
            <Link
              href={BOOK_LINK.href}
              className={cn(buttonVariants({ variant: "accent", size: "md" }), "flex-1")}
              onClick={() => setIsMenuOpen(false)}
            >
              {BOOK_LINK.label}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
