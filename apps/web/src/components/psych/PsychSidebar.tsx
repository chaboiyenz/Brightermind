"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { Avatar, cn } from "@/components/ui";
import { useSession } from "@/components/SessionProvider";
import { BrandMark } from "@/components/site/BrandMark";
import { PSYCH_NAV } from "@/components/site/siteLinks";
import { getMockInbox } from "@/lib/mock/inbox";
import { AvailabilitySwitch } from "./AvailabilitySwitch";

function isActive(href: string, pathname: string): boolean {
  if (href === "/psych") return pathname === "/psych";
  return pathname === href || pathname.startsWith(`${href}/`);
}

// Psychologist workspace navigation (docs/role-based-system-plan.md §5):
// 264px white surface, hairline right border, 44px items with a 12px radius
// and a brand-50 active state. Collapses to an icon rail below 1024px and is
// replaced by the top bar's menu below 640px (see PsychShell).
export function PsychSidebar({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { displayName, signOut } = useSession();
  const pendingCount = getMockInbox().filter((row) => row.status === "pending").length;


  return (
    <aside
      className={cn(
        "flex h-full w-[264px] shrink-0 flex-col border-r border-stone-200 bg-stone-25 p-4",
        className
      )}
    >
      <div className="flex h-[52px] items-center px-2">
        <BrandMark />
      </div>

      <p className="px-3 pb-2 pt-5 font-display text-label-sm uppercase text-stone-600">Workspace</p>
      <nav aria-label="Workspace" className="flex flex-col gap-0.5">
        {PSYCH_NAV.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href, pathname);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-3 text-[15px] font-medium text-stone-700 transition-colors hover:bg-brand-50 hover:text-brand-700",
                active && "bg-brand-50 text-brand-700"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
              <span className="flex-1">{link.label}</span>
              {link.href === "/psych/inbox" && pendingCount > 0 && (
                <span
                  className="grid h-[22px] min-w-[22px] place-items-center rounded-full bg-brand-100 px-1.5 font-display text-label-sm text-brand-700"
                  aria-label={`${pendingCount} waiting`}
                >
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto grid gap-3 rounded-lg border border-stone-200 bg-stone-50 p-3.5">
        <div className="flex items-center gap-2.5">
          <Avatar name={displayName} size="sm" />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-stone-900">{displayName}</p>
            <p className="text-xs text-stone-600">Psychologist</p>
          </div>
        </div>
        <AvailabilitySwitch compact />
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-stone-600 transition-colors hover:text-brand-700"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
