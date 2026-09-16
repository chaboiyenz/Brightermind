"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, type ReactNode } from "react";
import { Skeleton, SkeletonCard } from "@/components/ui";
import { RestrictedPageNotice } from "@/components/RestrictedPageNotice";
import { useSession } from "@/components/SessionProvider";
import { getAccessDecision, type AccessDecision } from "@/lib/session/access";
import { GUEST_SESSION } from "@/lib/session/sessionStorage";

// Whole-route gating (docs/role-based-system-plan.md §4). Guests heading for
// a signed-in feature are sent to /login with a return path; a student on the
// psychologist workspace sees a notice; retired URLs redirect. UX routing
// only — the API must enforce the same rules server-side (see RoleGate).
//
// While the stored session is still being read (server render and the first
// client paint), anything a guest may see renders straight away so public
// pages never flash a skeleton; only protected routes wait for the answer.
export function AccessGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const session = useSession();
  const { isLoading, isSignedIn, role } = session;
  const decision = useMemo<AccessDecision | null>(() => {
    if (!isLoading) return getAccessDecision(pathname, { isSignedIn, role });
    const guestDecision = getAccessDecision(pathname, GUEST_SESSION);
    return guestDecision.kind === "allow" ? guestDecision : null;
  }, [isLoading, isSignedIn, pathname, role]);
  const redirectTo = decision?.kind === "redirect" ? decision.to : null;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  if (decision === null || decision.kind === "redirect") {
    return (
      <div className="mx-auto w-full max-w-3xl p-6" aria-busy="true" aria-label="Loading">
        <Skeleton className="mb-4 h-7 w-1/3" />
        <SkeletonCard />
      </div>
    );
  }

  if (decision.kind === "forbidden") {
    return (
      <div className="mx-auto w-full max-w-3xl p-6">
        <RestrictedPageNotice allow={decision.allow} />
      </div>
    );
  }

  return <>{children}</>;
}
