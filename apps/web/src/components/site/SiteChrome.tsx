"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { MinimalSiteHeader } from "./MinimalSiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Breadcrumbs } from "./Breadcrumbs";

const AUTH_PATH_PREFIXES = ["/login", "/signup"];

function isAuthPath(pathname: string): boolean {
  return AUTH_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Lifted out of the home page (PR #53 deliberately scoped SiteHeader to `/`
 * only, flagged for "later" — this is that later) into the root layout, so
 * every route gets consistent header/footer/breadcrumb chrome without
 * importing them individually. A client component because it needs the
 * current path (usePathname) to pick the right header variant and build the
 * breadcrumb trail — the page content passed as `children` stays whatever it
 * already was (server or client), that's unaffected by being rendered inside
 * a client component.
 *
 * Two decisions made explicitly with the user rather than assumed:
 * - Auth routes (/login, /signup, /signup/psychologist) get MinimalSiteHeader
 *   (logo only) and no footer, instead of the full site chrome — keeps the
 *   signup/login flow focused.
 * - The video call shell (/call/[sessionId]) never gets breadcrumbs — it
 *   already has a deliberate exit ("End call"), and generic wayfinding
 *   competing with in-call controls risks an accidental exit from a live
 *   call. It still gets the normal full header/footer, since that wasn't
 *   part of what was decided.
 *
 * Breadcrumbs replaced a standalone "← Back" button (first a full-width row,
 * then briefly merged into the header itself) — both read as an opaque
 * single action; a "Home > Coping Techniques > Exercise" trail lets you jump
 * to any level directly instead. See Breadcrumbs.tsx for the route table and
 * why it's exact-pathname keyed rather than derived from URL segments.
 * Breadcrumbs.tsx itself decides when nothing renders (home, the call shell,
 * unmapped routes) — this file no longer computes that.
 *
 * CrisisBanner stays home-page-only (rendered by `/`'s own page.tsx, not
 * here) — confirmed rather than assumed: it's not part of this lift, and
 * showing a crisis banner on every route (including the call shell and
 * mini-games) would be visual clutter beyond what was asked.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const auth = isAuthPath(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {auth ? <MinimalSiteHeader /> : <SiteHeader />}
      <Breadcrumbs />
      {/* flex-1 (not flex-col too!) so this wrapper grows to push the footer
          to the bottom on short pages, while staying a plain block container
          for its own children. Making it a flex container itself (as an
          earlier version did with "flex flex-1 flex-col") put every page's
          own `mx-auto max-w-*` content in a nested flex cross-axis context,
          where it shrink-wrapped to its content's width instead of
          stretching to its max-width before centering — every page's main
          content column rendered far narrower than intended as a result,
          not just visually "compressed" but genuinely undersized. */}
      <div className="flex-1">{children}</div>
      {!auth && <SiteFooter />}
    </div>
  );
}
