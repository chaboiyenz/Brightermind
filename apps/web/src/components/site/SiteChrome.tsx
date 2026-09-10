"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { MinimalSiteHeader } from "./MinimalSiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BackButton } from "./BackButton";

const AUTH_PATH_PREFIXES = ["/login", "/signup"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Lifted out of the home page (PR #53 deliberately scoped SiteHeader to `/`
 * only, flagged for "later" — this is that later) into the root layout, so
 * every route gets consistent header/footer/back-button chrome without
 * importing them individually. A client component because it needs the
 * current path (usePathname) to pick the right header variant and decide
 * whether the back button applies — the page content passed as `children`
 * stays whatever it already was (server or client), that's unaffected by
 * being rendered inside a client component.
 *
 * Two decisions made explicitly with the user rather than assumed:
 * - Auth routes (/login, /signup, /signup/psychologist) get MinimalSiteHeader
 *   (logo only) and no footer, instead of the full site chrome — keeps the
 *   signup/login flow focused.
 * - The video call shell (/call/[sessionId]) never gets the back button — it
 *   already has a deliberate exit ("End call"), and a generic back button
 *   competing with in-call controls risks an accidental exit from a live
 *   call. It still gets the normal full header/footer, since that wasn't
 *   part of what was decided.
 *
 * CrisisBanner stays home-page-only (rendered by `/`'s own page.tsx, not
 * here) — confirmed rather than assumed: it's not part of this lift, and
 * showing a crisis banner on every route (including the call shell and
 * mini-games) would be visual clutter beyond what was asked.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);
  const isHome = pathname === "/";
  const isCallShell = pathname.startsWith("/call/");
  const showBackButton = !isHome && !isCallShell;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {auth ? <MinimalSiteHeader /> : <SiteHeader />}
      {showBackButton && (
        <div className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
          <BackButton />
        </div>
      )}
      {/* flex-1 here, not just on this outer wrapper's min-h-screen — a
          page's own <main> doesn't reliably carry flex-1 itself (most don't;
          only home's did), so without this a short page left the footer
          stranded mid-viewport instead of pinned to the bottom. */}
      <div className="flex flex-1 flex-col">{children}</div>
      {!auth && <SiteFooter />}
    </div>
  );
}
