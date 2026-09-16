"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Heart, Stethoscope, type LucideIcon } from "lucide-react";
import { Button, Card, type Role } from "@/components/ui";
import { useSession } from "@/components/SessionProvider";
import { postLoginDestination } from "@/lib/session/access";

interface RoleEntry {
  readonly role: Role;
  readonly icon: LucideIcon;
  readonly iconClass: string;
  readonly title: string;
  readonly description: string;
  readonly chips: readonly string[];
  readonly cta: string;
  readonly variant: "primary" | "secondary";
}

// Prototype entry (docs/role-based-system-plan.md §1): two role cards stand
// in for authentication until real sign-in is wired. Picking one writes the
// local session and lands the user where they were heading (`next`), or on
// that role's home.
const ENTRIES: readonly RoleEntry[] = [
  {
    role: "student",
    icon: Heart,
    iconClass: "bg-brand-100 text-brand-700",
    title: "I'm here for myself",
    description:
      "Check in, screen, cope, and talk to a psychologist. It looks like the website you already know, just signed in.",
    chips: ["Mood and journal", "Screening", "Counselling"],
    cta: "Continue as a patient",
    variant: "primary",
  },
  {
    role: "psychologist",
    icon: Stethoscope,
    iconClass: "bg-stone-100 text-stone-800",
    title: "I'm a psychologist",
    description:
      "Manage your patients, inbox, sessions, and analytics from a workspace built for your caseload.",
    chips: ["Patients", "Inbox", "Analytics"],
    cta: "Continue as a psychologist",
    variant: "secondary",
  },
];

export function RoleEntryCards() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useSession();

  function enterAs(role: Role) {
    signIn(role);
    router.push(postLoginDestination(searchParams.get("next"), role));
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2" aria-label="Choose how to continue">
      {ENTRIES.map((entry) => {
        const Icon = entry.icon;
        return (
          <li key={entry.role}>
            <Card className="flex h-full flex-col gap-5 p-6 sm:p-8">
              <span
                aria-hidden="true"
                className={`grid h-[52px] w-[52px] place-items-center rounded-lg ${entry.iconClass}`}
              >
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="grid gap-2">
                <h2 className="font-display text-headline-md text-stone-900">{entry.title}</h2>
                <p className="text-[15px] leading-relaxed text-stone-700">{entry.description}</p>
              </div>
              <ul className="flex flex-wrap gap-2" aria-label="Included">
                {entry.chips.map((chip) => (
                  <li
                    key={chip}
                    className="inline-flex h-8 items-center rounded-full border border-stone-200 bg-stone-25 px-3.5 font-display text-label-md text-stone-800"
                  >
                    {chip}
                  </li>
                ))}
              </ul>
              <Button
                variant={entry.variant}
                className="mt-auto self-start"
                onClick={() => enterAs(entry.role)}
              >
                {entry.cta}
              </Button>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
