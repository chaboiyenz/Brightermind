"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Save } from "lucide-react";
import { Button, Modal, buttonVariants } from "@/components/ui";
import { loginHref } from "@/lib/session/access";

interface KeepProgressSheetProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

// Guest trial gate (docs/role-based-system-plan.md §2). Games stay fully
// playable without an account; the nudge appears only at the save moment,
// as an invitation rather than a wall: create an account, log in, or keep
// playing as a guest. The current page is passed as `next` so signing in
// returns here.
export function KeepProgressSheet({ open, onOpenChange }: KeepProgressSheetProps) {
  const pathname = usePathname();

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Keep your progress"
      description="You are playing as a guest, so this round will not be saved."
      className="rounded-xl border border-stone-200 p-8 shadow-float"
    >
      <div className="grid gap-5">
        <span
          aria-hidden="true"
          className="grid h-12 w-12 place-items-center rounded-lg bg-brand-100 text-brand-700"
        >
          <Save className="h-[22px] w-[22px]" strokeWidth={1.8} />
        </span>
        <p className="text-[15px] leading-relaxed text-stone-700">
          Create a free account to see your progress over time and share it with a psychologist if you choose to,
          or log in if you already have one.
        </p>
        <div className="grid gap-2">
          <Link href={`/signup?next=${encodeURIComponent(pathname)}`} className={buttonVariants({ variant: "primary" })}>
            Create a free account
          </Link>
          <Link href={loginHref(pathname)} className={buttonVariants({ variant: "outline" })}>
            Log in
          </Link>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Continue as guest
          </Button>
        </div>
        <p className="text-center text-[13px] text-stone-600">
          Everything you played today stays open while you decide.
        </p>
      </div>
    </Modal>
  );
}
