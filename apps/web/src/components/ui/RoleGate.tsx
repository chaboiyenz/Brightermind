"use client";

import { createContext, useContext, type ReactNode } from "react";

export type Role = "student" | "psychologist" | "admin";

interface RoleContextValue {
  role: Role | null;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextValue>({ role: null, isLoading: true });

/**
 * TODO(Ticket 2): this provider currently has no real backend to call — there
 * is no role field on the user model yet. Wire this up to the actual
 * /api/v2/auth/me/ (or wherever the role model surfaces) once Ticket 2 lands.
 * Until then, wrap the app in <RoleProvider role="student"> (or whichever role
 * you're testing) at the page/story level to develop against a mocked role —
 * never hardcode a role check directly in a page component, always go through
 * useRole()/RoleGate so the swap-in is a one-line change in this file only.
 */
export function RoleProvider({
  role,
  isLoading = false,
  children,
}: {
  role: Role | null;
  isLoading?: boolean;
  children: ReactNode;
}) {
  return <RoleContext.Provider value={{ role, isLoading }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  return useContext(RoleContext);
}

export interface RoleGateProps {
  allow: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Client-side gate — hides UI the current role shouldn't see or act on.
 * This is a UX convenience only, NOT a security boundary: every endpoint this
 * gates access to must independently enforce the same rule server-side via a
 * DRF permission class (see Ticket 2). Do not treat "RoleGate hid the button"
 * as equivalent to "the API rejects the request" — the audit's core finding
 * was exactly this gap (client-only checks with no server enforcement).
 */
export function RoleGate({ allow, children, fallback = null }: RoleGateProps) {
  const { role, isLoading } = useRole();
  if (isLoading) return null;
  if (!role || !allow.includes(role)) return <>{fallback}</>;
  return <>{children}</>;
}
