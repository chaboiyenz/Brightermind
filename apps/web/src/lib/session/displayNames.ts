import type { Role } from "@/components/ui/RoleGate";

// Prototype display names per role. One source for the avatar menu, the
// workspace sidebar and any greeting, so they never drift apart.
export const DISPLAY_NAMES: Record<Role, string> = {
  student: "Bea Castillo",
  psychologist: "Dr. Amara Villanueva",
  admin: "BrighterMind staff",
};

/** "Dr. Amara Villanueva" -> "Dr. Villanueva"; "Bea Castillo" -> "Bea". */
export function greetingName(displayName: string): string {
  const parts = displayName.split(" ");
  if (parts[0].endsWith(".") && parts.length > 2) return `${parts[0]} ${parts[parts.length - 1]}`;
  return parts[0];
}
