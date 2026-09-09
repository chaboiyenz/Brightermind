"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { RoleProvider } from "@/components/ui";
import { fetchCurrentUser } from "@/lib/api";

/**
 * Wires RoleGate/RoleProvider (components/ui/RoleGate.tsx) to the real
 * GET /api/v2/auth/me/ endpoint — replacing the mocked role from Phase 0/2,
 * per docs/roadmap.md Phase 3. An anonymous visitor (no token, or a 401)
 * resolves to role: null, same as before — RoleGate already treats that as
 * "hide gated content," it just now reflects a real auth check.
 */
export function AuthRoleProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: () => fetchCurrentUser(),
    retry: false,
  });

  return (
    <RoleProvider role={data?.role ?? null} isLoading={isLoading}>
      {children}
    </RoleProvider>
  );
}
