import type { Role } from "@/components/ui/RoleGate";

// Prototype session persistence. Until real auth is wired, "being signed in"
// is a role plus a flag kept in localStorage so it survives navigation and
// reload. Everything here is pure over a storage-like object so it can be
// unit-tested without a browser.

export interface PrototypeSession {
  readonly role: Role;
  readonly isSignedIn: boolean;
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const ROLE_STORAGE_KEY = "bm_mock_role";
export const SIGNED_IN_STORAGE_KEY = "bm_session_signed_in";

export const SESSION_ROLES: readonly Role[] = ["student", "psychologist", "admin"];

export const GUEST_SESSION: PrototypeSession = { role: "student", isSignedIn: false };

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (SESSION_ROLES as readonly string[]).includes(value);
}

export function readStoredSession(storage: StorageLike | null | undefined): PrototypeSession {
  if (!storage) return GUEST_SESSION;
  try {
    const role = storage.getItem(ROLE_STORAGE_KEY);
    const signedIn = storage.getItem(SIGNED_IN_STORAGE_KEY) === "true";
    if (!isRole(role)) return GUEST_SESSION;
    return { role, isSignedIn: signedIn };
  } catch {
    return GUEST_SESSION;
  }
}

export function writeStoredSession(
  storage: StorageLike | null | undefined,
  session: PrototypeSession
): void {
  if (!storage) return;
  try {
    storage.setItem(ROLE_STORAGE_KEY, session.role);
    storage.setItem(SIGNED_IN_STORAGE_KEY, session.isSignedIn ? "true" : "false");
  } catch {
    // Storage unavailable (private mode etc.) — the in-memory session stands.
  }
}

export function clearStoredSession(storage: StorageLike | null | undefined): void {
  if (!storage) return;
  try {
    storage.removeItem(SIGNED_IN_STORAGE_KEY);
    storage.removeItem(ROLE_STORAGE_KEY);
  } catch {
    // best-effort only
  }
}

export function browserStorage(): StorageLike | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
