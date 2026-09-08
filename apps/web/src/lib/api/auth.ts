import { apiFetch, TOKEN_COOKIE } from "./client";

export type Role = "student" | "psychologist" | "admin";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterStudentInput {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password1: string;
  password2: string;
}

export interface RegisterPsychologistInput extends RegisterStudentInput {
  license_number: string;
  qualification: string;
  years_of_experience: number;
  area_of_expertise: string;
  contact_number: string;
  bio?: string;
}

// 7 days — DRF's default TokenAuthentication tokens don't expire on their
// own, so this is purely the browser-side cookie lifetime, not a real
// session boundary. Revisit if/when token rotation or expiry is added.
const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function persistToken(token: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${TOKEN_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function clearToken(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export async function login(input: LoginInput): Promise<AuthUser> {
  const data = await apiFetch<AuthResponse>("/v2/auth/login/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  persistToken(data.token);
  return data.user;
}

export async function registerStudent(input: RegisterStudentInput): Promise<AuthUser> {
  const data = await apiFetch<AuthResponse>("/v2/auth/register/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  persistToken(data.token);
  return data.user;
}

export async function registerPsychologist(input: RegisterPsychologistInput): Promise<AuthUser> {
  const data = await apiFetch<AuthResponse>("/v2/auth/register/psychologist/", {
    method: "POST",
    body: JSON.stringify(input),
  });
  persistToken(data.token);
  return data.user;
}

export async function fetchCurrentUser(token?: string): Promise<AuthUser> {
  return apiFetch<AuthUser>("/v2/auth/me/", { token });
}
