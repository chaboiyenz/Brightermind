"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, cn } from "@/components/ui";
import { useSession } from "@/components/SessionProvider";
import { PATIENT_MENU_LINKS, type SiteLink } from "./siteLinks";

const ITEM_CLASS =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-stone-800 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:bg-brand-50";

// Signed-in header control (docs/role-based-system-plan.md §5): replaces the
// "Log in" icon and the coral booking button so the patient header keeps at
// most one accent. A small hand-rolled popover (no dropdown-menu dependency
// in the project yet): Escape and outside clicks close it, the trigger
// exposes aria-expanded/aria-controls.
export function AvatarMenu({
  links = PATIENT_MENU_LINKS,
  className,
}: {
  links?: readonly SiteLink[];
  className?: string;
}) {
  const { displayName, signOut } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const firstName = displayName.split(" ")[0] ?? displayName;

  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  function handleSignOut() {
    setIsOpen(false);
    signOut(); // navigates to the landing page itself (see SessionProvider)
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex h-10 items-center gap-2 rounded-full pl-1 pr-2 text-[15px] font-medium text-stone-900 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
      >
        <Avatar name={displayName} size="sm" />
        <span className="hidden sm:inline">{firstName}</span>
        <ChevronDown className="h-4 w-4 text-stone-600" aria-hidden="true" />
      </button>

      <div
        id={menuId}
        role="menu"
        hidden={!isOpen}
        className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 rounded-lg border border-stone-200 bg-stone-25 p-1.5 shadow-float"
      >
        <p className="px-3 pb-2 pt-1.5 text-xs text-stone-600">Signed in as {displayName}</p>
        {links.map((link) => (
          <Link
            key={link.href}
            role="menuitem"
            href={link.href}
            className={ITEM_CLASS}
            onClick={() => setIsOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="my-1 border-t border-stone-200" role="separator" />
        <button type="button" role="menuitem" className={ITEM_CLASS} onClick={handleSignOut}>
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
