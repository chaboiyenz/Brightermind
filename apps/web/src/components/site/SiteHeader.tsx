"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, LogIn, Menu, X } from "lucide-react";
import { buttonVariants, cn } from "@/components/ui";
import { useSession } from "@/components/SessionProvider";
import { AvatarMenu } from "./AvatarMenu";
import { BrandMark } from "./BrandMark";
import { ThemeToggle } from "./ThemeToggle";
import { BOOK_LINK, LOGIN_LINK, PATIENT_MENU_LINKS, PATIENT_NAV, PRIMARY_NAV, type SiteLink } from "./siteLinks";

const NAV_LINK_CLASS =
  "rounded-full px-3.5 py-2 text-[15px] font-medium text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700";

const ACTIVE_LINK_CLASS = "bg-brand-50 text-brand-700";

// A link with a #fragment targets a *section* of a page, not the page — so it
// never claims the active state; the un-hashed link for that path owns it.
// Without this, "/home" and "/home#screening" (and "/coping" vs
// "/coping#games") both matched the same pathname and both lit up at once.
function isActive(link: SiteLink, pathname: string): boolean {
  if (link.href.includes("#")) return false;
  const path = link.href;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

// Sticky, frosted site chrome (docs/DESIGN.md "Frosted Ambient Layering").
// Two variants share one header (docs/role-based-system-plan.md §5):
//  - guest: the landing-page nav, a "Log in" icon and the coral booking CTA;
//  - signed-in patient: the same bar, but with "My care" in the nav and an
//    avatar menu in place of the login icon and booking button, so the page
//    keeps at most one accent.
// Client component for the mobile menu toggle and the session read.
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isSignedIn, isLoading } = useSession();
  const isPatient = isSignedIn && !isLoading;
  const navLinks = isPatient ? PATIENT_NAV : PRIMARY_NAV;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-frost/85 backdrop-blur-[12px]">
      <div className="mx-auto flex h-[68px] max-w-container items-center justify-between gap-6 px-5 sm:px-10 lg:px-14">
        <BrandMark />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(NAV_LINK_CLASS, isPatient && isActive(link, pathname) && ACTIVE_LINK_CLASS)}
              aria-current={isPatient && isActive(link, pathname) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle className="ml-1" />
          {isPatient ? (
            <>
              <Link
                href="/care"
                aria-label="Updates from your care team"
                title="Updates"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "relative ml-1 w-9 px-0")}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-1.5 h-2 w-2 rounded-full border-2 border-stone-25 bg-clay-500"
                />
              </Link>
              <AvatarMenu className="ml-1" />
            </>
          ) : (
            <>
              <Link
                href={LOGIN_LINK.href}
                aria-label={LOGIN_LINK.label}
                title={LOGIN_LINK.label}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "ml-1")}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={BOOK_LINK.href}
                className={cn(buttonVariants({ variant: "accent", size: "sm" }), "ml-1")}
              >
                {BOOK_LINK.label}
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          {isPatient && <AvatarMenu />}
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
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  NAV_LINK_CLASS,
                  "block rounded-lg",
                  isPatient && isActive(link, pathname) && ACTIVE_LINK_CLASS
                )}
                aria-current={isPatient && isActive(link, pathname) ? "page" : undefined}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isPatient ? (
            <li className="mt-2 border-t border-stone-200 pt-2">
              <ul className="flex flex-col gap-1">
                {PATIENT_MENU_LINKS.map((link) => (
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
              </ul>
            </li>
          ) : (
            <li className="flex flex-col gap-2 pt-3 sm:flex-row">
              <Link
                href={LOGIN_LINK.href}
                className={cn(buttonVariants({ variant: "outline", size: "md" }), "flex-1")}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
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
          )}
        </ul>
      </nav>
    </header>
  );
}
