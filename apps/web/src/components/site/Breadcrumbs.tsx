"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { GAME_TITLES, isGameSlug } from "@/app/coping/[game]/gameData";

interface Crumb {
  readonly label: string;
  // Omitted on the last crumb only — that's the current page, shown as
  // plain text rather than a link to itself.
  readonly href?: string;
}

const HOME: Crumb = { label: "Home", href: "/" };
const COPING: Crumb = { label: "Coping Techniques", href: "/coping/exercise" };

// One entry per real page (docs/frontend-migration-plan.md's route table).
// Exact-pathname keyed rather than derived from URL segments — segments
// like "admin", "resources", "tools", "screening" and "messages" are pure
// URL namespacing with no page of their own, and a couple of leaf labels
// (e.g. admin/psychologists vs top-level /psychologists) would collide if
// this were built generically from segment names alone. Explicit beats
// clever here: every route's trail is visible at a glance and can't drift
// from what the page actually shows.
const STATIC_ROUTE_CRUMBS: Record<string, Crumb[]> = {
  "/about": [HOME, { label: "About" }],
  "/community": [HOME, { label: "Community" }],
  "/coping/exercise": [HOME, COPING, { label: "Exercise" }],
  "/coping/yoga": [HOME, COPING, { label: "Yoga" }],
  "/coping/spirituality": [HOME, COPING, { label: "Spirituality" }],
  "/coping/aromatherapy": [HOME, COPING, { label: "Aromatherapy" }],
  "/dashboard": [HOME, { label: "Dashboard" }],
  "/journal": [HOME, { label: "Journal" }],
  "/login": [HOME, { label: "Log in" }],
  "/mood": [HOME, { label: "Mood tracker" }],
  "/profile": [HOME, { label: "Profile" }],
  "/psychologists": [HOME, { label: "Psychologists" }],
  "/resources/hotlines": [HOME, { label: "Crisis hotlines" }],
  "/screening/gad7": [HOME, { label: "GAD-7 screening" }],
  "/signup": [HOME, { label: "Sign up" }],
  "/signup/psychologist": [HOME, { label: "Sign up", href: "/signup" }, { label: "Psychologist" }],
  "/tools/todo": [HOME, { label: "To-do" }],
  "/admin/analytics": [HOME, { label: "Analytics" }],
  "/admin/patients": [HOME, { label: "Patients" }],
  "/admin/psychologists": [HOME, { label: "Psychologist approvals" }],
};

// Routes with a dynamic final segment — built from the pathname rather than
// looked up verbatim. Never includes /call/[sessionId]: the video call
// shell deliberately gets no back/breadcrumb navigation (see SiteChrome's
// docblock) so nothing here competes with its own "End call" exit.
function dynamicRouteCrumbs(pathname: string): Crumb[] | null {
  const gameMatch = pathname.match(/^\/coping\/([^/]+)$/);
  if (gameMatch && isGameSlug(gameMatch[1])) {
    return [HOME, COPING, { label: GAME_TITLES[gameMatch[1]] }];
  }
  if (/^\/messages\/[^/]+$/.test(pathname)) {
    return [HOME, { label: "Conversation" }];
  }
  return null;
}

function getCrumbs(pathname: string): Crumb[] | null {
  if (pathname === "/" || pathname.startsWith("/call/")) return null;
  return STATIC_ROUTE_CRUMBS[pathname] ?? dynamicRouteCrumbs(pathname);
}

// Replaces the old standalone "← Back" row (see SiteChrome's docblock) — a
// trail naming every level you can jump to reads as wayfinding rather than a
// single opaque "go back" action, and covers the same "get me back to where
// I came from" need without depending on browser history at all.
export function Breadcrumbs() {
  const pathname = usePathname();
  const crumbs = getCrumbs(pathname);
  if (!crumbs) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-stone-600">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-stone-400" aria-hidden="true" />
              )}
              {isLast || !crumb.href ? (
                <span
                  className={isLast ? "font-medium text-stone-900" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="hover:text-brand-700 hover:underline">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
