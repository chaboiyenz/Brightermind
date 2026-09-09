// Single source of truth for site-wide navigation targets, shared by
// SiteHeader and SiteFooter so the two never drift apart.
//
// Routes follow docs/frontend-migration-plan.md's master table.
//
// "Community" is intentionally omitted from PRIMARY_NAV — it's a genuinely
// unbuilt Phase C route (see docs/prototype-roadmap.md) and a nav link to a
// missing page is worse than no link. Re-add it once /community exists.

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly SiteLink[] = [
  { label: "Screening", href: "/screening/gad7" },
  { label: "Coping Techniques", href: "/coping/exercise" },
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
