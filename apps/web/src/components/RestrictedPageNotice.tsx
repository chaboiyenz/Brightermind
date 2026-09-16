import { EmptyState } from "@/components/ui";
import type { Role } from "@/components/ui";

const ROLE_LABEL: Record<Role, string> = {
  student: "students",
  psychologist: "psychologists",
  admin: "staff",
};

/**
 * Fallback for whole-route gating (AccessGate, the /psych/* workspace).
 * Composes the shared EmptyState rather than introducing a new primitive. It
 * is a UX hint, not enforcement (see the RoleGate docblock): the API must
 * reject the same requests server-side.
 */
export function RestrictedPageNotice({ allow }: { allow: readonly Role[] }) {
  const audience = allow.map((role) => ROLE_LABEL[role]).join(" and ");
  return (
    <EmptyState
      title={`This page is for ${audience}`}
      description="Your current account can't view it. To preview it in the prototype, log out and pick the other role on the sign-in page."
    />
  );
}
