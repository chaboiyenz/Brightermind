import type { Role } from "@/components/ui/RoleGate";
import type { PrototypeSession } from "./sessionStorage";

// Route access rules for the role-based shells (docs/role-based-system-plan.md).
// Pure functions over a pathname and a session so SiteChrome, the login page
// and the tests all agree on one answer. This is UX routing only, not a
// security boundary — the API must enforce the same rules server-side.

export type Shell = "auth" | "public" | "patient" | "psych";

export type AccessDecision =
  | { readonly kind: "allow" }
  | { readonly kind: "redirect"; readonly to: string }
  | { readonly kind: "forbidden"; readonly allow: readonly Role[] };

export const LOGIN_PATH = "/login";
export const PSYCH_HOME = "/psych";
export const LANDING = "/";
/** Signed-in patients get a personalised home; the marketing page stays for guests. */
export const PATIENT_HOME = "/home";

const AUTH_PREFIXES = ["/login", "/signup"] as const;

// Everything a guest is sent to sign in for. Coping techniques and games are
// deliberately absent: they are the guest "trial", gated at the save moment
// instead (see KeepProgressSheet). "/community" is deliberately absent too,
// for a related but different reason — flagged in an earlier audit as a
// possible gating oversight (nav treats it like a members feature) until
// checked against the actual page: guests get a real read-only view there
// per the access matrix (docs/role-based-system-plan.md §2 "Community: read
// only"), enforced per-action inside the page rather than at the route gate
// — see PostList.tsx/VoteButton.tsx/CommentThread.tsx's `useSession()`
// checks and `SignInPrompt`. Adding "/community" here would turn that
// working guest trial into a hard sign-in wall — don't.
const SIGNED_IN_PREFIXES = [
  "/screening",
  "/mood",
  "/journal",
  "/tools",
  "/profile",
  "/psychologists",
  "/messages",
  "/call",
  "/care",
  "/home",
] as const;

// Personal tools. A psychologist reads a patient's mood, journal and screening
// results through the workspace, never through the patient's own pages
// (docs/role-based-system-plan.md §2), so these are students-only.
const PATIENT_ONLY_PREFIXES = [
  "/screening",
  "/mood",
  "/journal",
  "/tools",
  "/profile",
  "/psychologists",
  "/care",
  "/home",
] as const;

const PSYCH_PREFIXES = ["/psych"] as const;
const PSYCH_ROLES: readonly Role[] = ["psychologist", "admin"];
const PATIENT_ROLES: readonly Role[] = ["student"];

// Old prototype URLs, kept alive as redirects so bookmarks and the breadcrumb
// table keep working after the pages moved into the psychologist workspace.
export const LEGACY_REDIRECTS: Readonly<Record<string, string>> = {
  "/dashboard": "/psych/inbox",
  "/admin/patients": "/psych/patients",
  "/admin/analytics": "/psych/analytics",
  "/admin/psychologists": "/psych/approvals",
};

function startsWithAny(pathname: string, prefixes: readonly string[]): boolean {
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function isAuthPath(pathname: string): boolean {
  return startsWithAny(pathname, AUTH_PREFIXES);
}

export function isPsychPath(pathname: string): boolean {
  return startsWithAny(pathname, PSYCH_PREFIXES);
}

export function requiresSignIn(pathname: string): boolean {
  return startsWithAny(pathname, SIGNED_IN_PREFIXES) || isPsychPath(pathname);
}

export function isPatientOnlyPath(pathname: string): boolean {
  return startsWithAny(pathname, PATIENT_ONLY_PREFIXES);
}

export function isPsychRole(role: Role): boolean {
  return PSYCH_ROLES.includes(role);
}

/** Where a freshly signed-in user lands when no `next` was requested. */
export function homeFor(role: Role): string {
  return isPsychRole(role) ? PSYCH_HOME : PATIENT_HOME;
}

export function loginHref(next?: string | null): string {
  if (!next || next === LANDING || isAuthPath(next)) return LOGIN_PATH;
  return `${LOGIN_PATH}?next=${encodeURIComponent(next)}`;
}

/**
 * Only same-origin paths are honoured as a post-login destination, so a
 * crafted `next=https://evil.example` can never bounce a user off-site.
 */
export function safeNextPath(next: string | null | undefined, fallback: string): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || isAuthPath(next)) {
    return fallback;
  }
  return next;
}

export function resolveShell(pathname: string, session: PrototypeSession): Shell {
  if (isAuthPath(pathname)) return "auth";
  if (!session.isSignedIn) return "public";
  return isPsychRole(session.role) ? "psych" : "patient";
}

export function getAccessDecision(pathname: string, session: PrototypeSession): AccessDecision {
  const legacy = LEGACY_REDIRECTS[pathname];
  if (legacy) return { kind: "redirect", to: legacy };

  if (!session.isSignedIn) {
    return requiresSignIn(pathname)
      ? { kind: "redirect", to: loginHref(pathname) }
      : { kind: "allow" };
  }

  if (isPsychPath(pathname) && !isPsychRole(session.role)) {
    return { kind: "forbidden", allow: PSYCH_ROLES };
  }

  if (isPatientOnlyPath(pathname) && isPsychRole(session.role)) {
    return { kind: "forbidden", allow: PATIENT_ROLES };
  }

  // The marketing page is for guests: signed-in users go to their own home.
  if (pathname === LANDING) {
    return { kind: "redirect", to: homeFor(session.role) };
  }

  return { kind: "allow" };
}

/**
 * Where to send someone who has just picked a role on /login: the requested
 * `next` when that role may open it, otherwise the role's home. Without this
 * a patient arriving via `?next=/psych/inbox` would land on a restricted page
 * as their very first screen.
 */
export function postLoginDestination(next: string | null | undefined, role: Role): string {
  const home = homeFor(role);
  const candidate = safeNextPath(next, home);
  const decision = getAccessDecision(candidate, { role, isSignedIn: true });
  return decision.kind === "allow" ? candidate : home;
}
