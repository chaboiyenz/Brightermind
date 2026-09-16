"use client";

import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import { LOGIN_LINK } from "./siteLinks";

// The footer's account link: "Log in" for guests, "Your home" once a patient
// is signed in, so the website chrome never offers a sign-in to someone who
// already has. Tiny client island inside the otherwise server-rendered
// footer (psychologists never see the footer; PsychShell replaces it).
export function FooterSessionLink({ className }: { className?: string }) {
  const { isSignedIn, isLoading } = useSession();
  const link = isSignedIn && !isLoading ? { label: "Your home", href: "/home" } : LOGIN_LINK;

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
