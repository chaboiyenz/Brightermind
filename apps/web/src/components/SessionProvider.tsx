"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { RoleProvider, type Role } from "@/components/ui";
import { clearToken, fetchCurrentUser } from "@/lib/api";
import { isMockMode } from "@/lib/mock/mockMode";
import { LANDING } from "@/lib/session/access";
import { DISPLAY_NAMES } from "@/lib/session/displayNames";
import {
  GUEST_SESSION,
  browserStorage,
  clearStoredSession,
  readStoredSession,
  writeStoredSession,
  type PrototypeSession,
} from "@/lib/session/sessionStorage";

// One session for the whole app (docs/role-based-system-plan.md §4).
//
// The prototype entry ("Continue as a patient / psychologist" on /login)
// writes a local session; that always wins, in mock mode and in real mode,
// so the role shells can be demoed while real auth is still being built.
// When there is no local session and mock mode is off, the real
// GET /api/v2/auth/me/ check fills in the role exactly as AuthRoleProvider
// used to. RoleGate keeps working unchanged because RoleProvider is fed from
// here.

export interface Session extends PrototypeSession {
  /** True until the stored session has been read on the client. */
  readonly isLoading: boolean;
  /** Display name for the avatar menu; prototype placeholder per role. */
  readonly displayName: string;
  signIn(role: Role): void;
  signOut(): void;
}

const SessionContext = createContext<Session>({
  ...GUEST_SESSION,
  isLoading: true,
  displayName: "",
  signIn: () => {},
  signOut: () => {},
});

export function useSession(): Session {
  return useContext(SessionContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [local, setLocal] = useState<PrototypeSession>(GUEST_SESSION);
  const [hasReadStorage, setHasReadStorage] = useState(false);

  useEffect(() => {
    setLocal(readStoredSession(browserStorage()));
    setHasReadStorage(true);
  }, []);

  const useRealAuth = !isMockMode() && hasReadStorage && !local.isSignedIn;
  const realUser = useQuery({
    queryKey: ["current-user"],
    queryFn: () => fetchCurrentUser(),
    retry: false,
    enabled: useRealAuth,
  });

  const signIn = useCallback((role: Role) => {
    const next: PrototypeSession = { role, isSignedIn: true };
    writeStoredSession(browserStorage(), next);
    setLocal(next);
  }, []);

  // Sign-out is a full navigation to the landing page rather than a state
  // update: clearing the session while still on a protected route would let
  // AccessGate redirect the (now guest) user to /login?next=<that route>,
  // racing whatever navigation the caller started. A fresh load as a guest
  // has no such race and also drops any per-role client state.
  const signOut = useCallback(() => {
    clearStoredSession(browserStorage());
    clearToken();
    if (typeof window !== "undefined") {
      window.location.assign(LANDING);
      return;
    }
    setLocal(GUEST_SESSION);
  }, []);

  const value = useMemo<Session>(() => {
    const realRole = useRealAuth ? (realUser.data?.role ?? null) : null;
    const role: Role = local.isSignedIn ? local.role : (realRole ?? "student");
    const isSignedIn = local.isSignedIn || realRole !== null;
    const isLoading = !hasReadStorage || (useRealAuth && realUser.isLoading);
    const displayName = realUser.data
      ? `${realUser.data.first_name} ${realUser.data.last_name}`.trim() || realUser.data.username
      : DISPLAY_NAMES[role];
    return { role, isSignedIn, isLoading, displayName, signIn, signOut };
  }, [hasReadStorage, local, realUser.data, realUser.isLoading, signIn, signOut, useRealAuth]);

  return (
    <SessionContext.Provider value={value}>
      <RoleProvider role={value.isSignedIn ? value.role : null} isLoading={value.isLoading}>
        {children}
      </RoleProvider>
    </SessionContext.Provider>
  );
}
