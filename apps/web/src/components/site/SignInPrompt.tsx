"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants, cn } from "@/components/ui";
import { loginHref } from "@/lib/session/access";

// Soft in-page invitation for guests on read-only surfaces (community
// composer, replies). Calm copy, one primary action, and a return path so
// signing in brings the person straight back (docs/role-based-system-plan.md §2).
export function SignInPrompt({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-stone-300 bg-stone-25 px-5 py-4",
        className
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <p className="text-sm text-stone-600">{description}</p>
      </div>
      <div className="flex gap-2">
        <Link href={loginHref(pathname)} className={buttonVariants({ variant: "primary", size: "sm" })}>
          Log in
        </Link>
        <Link href="/signup" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          Create account
        </Link>
      </div>
    </div>
  );
}
