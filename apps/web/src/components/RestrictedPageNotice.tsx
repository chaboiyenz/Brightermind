import { EmptyState } from "@/components/ui";
import type { Role } from "@/components/ui";

const ROLE_LABEL: Record<Role, string> = {
  student: "students",
  psychologist: "psychologists",
  admin: "staff",
};

/**
 * RoleGate fallback for whole-page gating (/dashboard, /admin/*). Composes the
 * shared EmptyState rather than introducing a new primitive. Under the
 * prototype's mock mode this is what you see until you pick the right role in
 * the bottom-left role switcher — it is a UX hint, not enforcement (see the
 * RoleGate docblock).
 */
export function RestrictedPageNotice({ allow }: { allow: Role[] }) {
  const audience = allow.map((role) => ROLE_LABEL[role]).join(" and ");
  return (
    <EmptyState
      title={`This page is for ${audience}`}
      description="Your current role can't view it. In the prototype, use the role switcher in the bottom-left corner to preview this page as a different role."
    />
  );
}
