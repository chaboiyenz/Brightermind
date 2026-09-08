import { apiFetch } from "./client";

// TEMPORARY — pairs with apps/api's dev-only /api/v2/auth/dev-login/ view.
// Remove alongside it once Phase 3's real login/signup flow lands (see
// docs/roadmap.md Phase 3).

export interface DevLoginInput {
  username: string;
  password: string;
}

export interface DevLoginResult {
  id: number;
  username: string;
  role: "student" | "psychologist" | "admin";
}

export async function devLogin(input: DevLoginInput): Promise<DevLoginResult> {
  return apiFetch<DevLoginResult>("/v2/auth/dev-login/", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
