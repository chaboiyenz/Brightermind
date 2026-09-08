/** Shared plumbing for every apps/api resource module — see health.ts, mood.ts. */

export function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not set — copy .env.example to .env.local");
  }
  return url;
}

/** Thrown for any non-ok API response. Carries the HTTP status so callers
 * can distinguish cases (e.g. 409 duplicate vs. 400 validation) without
 * re-parsing the response body themselves. */
export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

/** Best-effort extraction of a human-readable message from a DRF error
 * response body — either {"detail": "..."} (APIException) or
 * {"field": ["msg", ...]} (serializer validation errors). */
function extractMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    if ("detail" in body && typeof (body as { detail: unknown }).detail === "string") {
      return (body as { detail: string }).detail;
    }
    const firstValue = Object.values(body as Record<string, unknown>)[0];
    if (Array.isArray(firstValue) && typeof firstValue[0] === "string") {
      return firstValue[0];
    }
  }
  return fallback;
}

// Token-auth cookie (Phase 3 — see docs/roadmap.md). Not httpOnly: client-side
// code needs to read it to attach the Authorization header on every request,
// since a bearer token in a header (unlike a session cookie) never crosses
// the origin boundary automatically. It's readable by JS the same way a
// localStorage token would be — an accepted tradeoff for the simplicity of
// not needing a Next.js backend-for-frontend proxy just to keep it httpOnly.
export const TOKEN_COOKIE = "bm_token";

function getClientToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export interface ApiFetchOptions extends RequestInit {
  /**
   * Server Components only: the token to authenticate as. There's no
   * `document.cookie` server-side, so read it via `cookies()` from
   * next/headers and pass it here explicitly. Client-side calls don't need
   * this — apiFetch reads the token cookie itself.
   */
  token?: string;
}

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  const { token, ...init } = options ?? {};
  const method = (init.method ?? "GET").toUpperCase();
  const authToken = token ?? getClientToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers.Authorization = `Token ${authToken}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    method,
    headers,
  });

  if (!response.ok) {
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      // Non-JSON error body (e.g. a 502 from an intermediary) — fall through
      // with body left null, extractMessage below falls back to statusText.
    }
    throw new ApiError(
      response.status,
      extractMessage(body, response.statusText || `Request failed with status ${response.status}`),
      body
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
