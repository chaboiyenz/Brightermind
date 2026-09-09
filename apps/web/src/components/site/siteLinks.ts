// Single source of truth for site-wide navigation targets, shared by
// SiteHeader and SiteFooter so the two never drift apart.
//
// Routes follow docs/frontend-migration-plan.md's master table. Every entry
// here points at a route that exists under src/app — a nav link to a missing
// page is worse than no link, so check before adding one.

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly SiteLink[] = [
  { label: "Screening", href: "/screening/gad7" },
  { label: "Coping", href: "/coping" },
  { label: "Games", href: "/coping/defusion" },
  { label: "Counselling", href: "/psychologists" },
  { label: "Community", href: "/community" },
];

export const LOGIN_LINK: SiteLink = { label: "Log in", href: "/login" };

// The one coral (accent) button in the site chrome. Booking lives on the
// psychologist directory until a dedicated booking flow exists.
export const BOOK_LINK: SiteLink = { label: "Book a session", href: "/psychologists" };

export const HOTLINES_LINK: SiteLink = {
  label: "Crisis hotlines",
  href: "/resources/hotlines",
};

export const FOOTER_TOOL_LINKS: readonly SiteLink[] = [
  { label: "Screening", href: "/screening/gad7" },
  { label: "Coping techniques", href: "/coping" },
  { label: "Mini-games", href: "/coping/defusion" },
  { label: "Mood tracker", href: "/mood" },
  { label: "Journal", href: "/journal" },
  { label: "To-do list", href: "/tools/todo" },
];

export const FOOTER_PEOPLE_LINKS: readonly SiteLink[] = [
  { label: "Counselling", href: "/psychologists" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
  LOGIN_LINK,
];
