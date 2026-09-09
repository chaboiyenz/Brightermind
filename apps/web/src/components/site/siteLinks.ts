// Single source of truth for site-wide navigation targets, shared by
// SiteHeader and SiteFooter so the two never drift apart.
//
// Routes follow docs/frontend-migration-plan.md's master table. Some targets
// (/coping/*, /community, /resources/hotlines) are planned prototype routes
// that may not exist yet on this branch — they resolve as pages land under
// .references/roadmap/prototype-roadmap.MD Phases A–C.

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly SiteLink[] = [
  { label: "Screening", href: "/screening/gad7" },
  { label: "Coping Techniques", href: "/coping/exercise" },
  { label: "Community", href: "/community" },
];

export const LOGIN_LINK: SiteLink = { label: "Login", href: "/login" };

export const HOTLINES_LINK: SiteLink = {
  label: "Crisis hotlines",
  href: "/resources/hotlines",
};

export const FOOTER_LINKS: readonly SiteLink[] = [
  { label: "About", href: "/about" },
  ...PRIMARY_NAV,
  LOGIN_LINK,
];
