import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  MessageCircle,
  ShieldCheck,
  Settings2,
  Users,
} from "lucide-react";

// Single source of truth for site-wide navigation targets, shared by
// SiteHeader, SiteFooter, the patient avatar menu and the psychologist
// sidebar so none of them drift apart (docs/role-based-system-plan.md §5).
//
// Routes follow docs/frontend-migration-plan.md's master table. Screening
// intentionally targets the home section so people can choose an instrument
// before starting an assessment.

export interface SiteLink {
  readonly label: string;
  readonly href: string;
}

export interface IconLink extends SiteLink {
  readonly icon: LucideIcon;
}

/** Guest header (the public landing page is unchanged by the role shells). */
export const PRIMARY_NAV: readonly SiteLink[] = [
  { label: "Screening", href: "/#screening" },
  { label: "Coping", href: "/#coping" },
  { label: "Games", href: "/#games" },
  { label: "Counselling", href: "/#counselling" },
  { label: "Community", href: "/#community" },
];

/** Signed-in patient header: same website feel, "My care" replaces Counselling. */
export const PATIENT_NAV: readonly SiteLink[] = [
  { label: "Home", href: "/home" },
  { label: "Screening", href: "/home#screening" },
  { label: "Coping", href: "/coping" },
  { label: "Games", href: "/coping#games" },
  { label: "My care", href: "/care" },
  { label: "Community", href: "/community" },
];

/** Patient avatar menu. */
export const PATIENT_MENU_LINKS: readonly SiteLink[] = [
  { label: "Profile", href: "/profile" },
  { label: "Mood tracker", href: "/mood" },
  { label: "Journal", href: "/journal" },
  { label: "To-do list", href: "/tools/todo" },
];

/** Psychologist workspace sidebar, in display order. */
export const PSYCH_NAV: readonly IconLink[] = [
  { label: "Overview", href: "/psych", icon: LayoutDashboard },
  { label: "Patients", href: "/psych/patients", icon: Users },
  { label: "Inbox", href: "/psych/inbox", icon: Inbox },
  { label: "Sessions", href: "/psych/sessions", icon: CalendarDays },
  { label: "Screenings", href: "/psych/screenings", icon: ClipboardList },
  { label: "Analytics", href: "/psych/analytics", icon: BarChart3 },
  { label: "Community", href: "/community", icon: MessageCircle },
  { label: "Approvals", href: "/psych/approvals", icon: ShieldCheck },
  { label: "Settings", href: "/psych/settings", icon: Settings2 },
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
  { label: "Screening", href: "/#screening" },
  { label: "Coping techniques", href: "/#coping" },
  { label: "Mini-games", href: "/#games" },
  { label: "Mood tracker", href: "/mood" },
  { label: "Journal", href: "/journal" },
  { label: "To-do list", href: "/tools/todo" },
];

// The account link ("Log in" / "My care") is appended by SiteFooter via
// FooterSessionLink, since it depends on the session.
export const FOOTER_PEOPLE_LINKS: readonly SiteLink[] = [
  { label: "Counselling", href: "/#counselling" },
  { label: "Community", href: "/#community" },
  { label: "About", href: "/about" },
];
