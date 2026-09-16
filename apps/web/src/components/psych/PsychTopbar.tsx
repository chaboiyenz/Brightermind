"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useSession } from "@/components/SessionProvider";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { PSYCH_NAV } from "@/components/site/siteLinks";
import { AvailabilityPill } from "./AvailabilitySwitch";

// Page titles for shared routes that the sidebar does not list.
const EXTRA_TITLES: Readonly<Record<string, string>> = {
  "/messages": "Conversation",
  "/call": "Video call",
  "/profile": "Profile",
  "/coping": "Coping techniques",
  "/psych/patients/": "Patient",
};

function titleFor(pathname: string): string {
  const exact = PSYCH_NAV.find((link) => link.href === pathname);
  if (exact) return exact.label;
  const extra = Object.entries(EXTRA_TITLES).find(([prefix]) => pathname.startsWith(prefix));
  if (extra) return extra[1];
  const nested = PSYCH_NAV.find((link) => link.href !== "/psych" && pathname.startsWith(`${link.href}/`));
  return nested?.label ?? "Workspace";
}

// 64px workspace top bar (docs/role-based-system-plan.md §5): page title,
// search, availability pill, avatar. The search box is presentational in
// the prototype; patient filtering lives on /psych/patients.
export function PsychTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { displayName } = useSession();

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-stone-200 bg-frost/85 px-4 backdrop-blur-[12px] sm:px-8">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open workspace menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <h1 className="font-display text-headline-sm text-stone-900">{titleFor(pathname)}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="hidden items-center gap-2.5 rounded-md border-[1.5px] border-stone-200 bg-stone-25 px-3.5 text-sm text-stone-600 focus-within:border-brand-300 md:flex md:h-10 md:w-64">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search patients"
            aria-label="Search patients"
            className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-600 focus:outline-none"
          />
        </label>
        <AvailabilityPill className="hidden sm:inline-flex" />
        <ThemeToggle />
        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
        >
          <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
        <Avatar name={displayName} size="sm" />
      </div>
    </div>
  );
}
