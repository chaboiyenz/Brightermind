"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useSession } from "@/components/SessionProvider";
import { PsychShell } from "@/components/psych/PsychShell";
import { resolveShell } from "@/lib/session/access";
import { AccessGate } from "./AccessGate";
import { SiteHeader } from "./SiteHeader";
import { MinimalSiteHeader } from "./MinimalSiteHeader";
import { SiteFooter } from "./SiteFooter";
import { Breadcrumbs } from "./Breadcrumbs";

/**
 * Picks the chrome for the current route and session
 * (docs/role-based-system-plan.md §4–5), then gates access:
 *
 * - auth routes (/login, /signup) keep the logo-only MinimalSiteHeader and
 *   no footer, so the sign-in flow stays focused;
 * - guests and signed-in patients share SiteHeader (it swaps its right-hand
 *   controls itself) plus breadcrumbs and the footer — the "website feel";
 * - psychologists and admins get PsychShell everywhere, including shared
 *   routes like /messages and /call, so the workspace never gives way to the
 *   marketing chrome.
 *
 * The video call shell (/call/[sessionId]) never gets breadcrumbs — it has a
 * deliberate exit ("End call") and generic wayfinding competing with in-call
 * controls risks an accidental exit. Breadcrumbs.tsx decides that itself.
 *
 * CrisisBanner stays home-page-only (rendered by `/`'s own page.tsx).
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const session = useSession();
  const shell = resolveShell(pathname, session);

  if (shell === "psych") {
    return (
      <PsychShell>
        <AccessGate>{children}</AccessGate>
      </PsychShell>
    );
  }

  const isAuth = shell === "auth";

  return (
    <div className="flex min-h-screen flex-col bg-stone-50">
      {isAuth ? <MinimalSiteHeader /> : <SiteHeader />}
      <Breadcrumbs />
      {/* flex-1 (not flex-col too!) so this wrapper grows to push the footer
          to the bottom on short pages while staying a plain block container,
          so every page's own `mx-auto max-w-*` column keeps its full width. */}
      <div className="flex-1">
        <AccessGate>{children}</AccessGate>
      </div>
      {!isAuth && <SiteFooter />}
    </div>
  );
}
