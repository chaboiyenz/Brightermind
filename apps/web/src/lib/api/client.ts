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

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/** Reads a cookie by name in the browser. Returns null server-side (no
 * `document`) or when the cookie isn't present. */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export interface ApiFetchOptions extends RequestInit {
  /**
   * Server Components only: the incoming request's Cookie header (e.g.
   * `cookies().toString()` from next/headers), forwarded manually since a
   * server-side fetch doesn't share the browser's cookie jar the way
   * `credentials: "include"` does client-side.
   */
  forwardCookie?: string;
}

export async function apiFetch<T>(path: string, options?: ApiFetchOptions): Promise<T> {
  const { forwardCookie, ...init } = options ?? {};
  const method = (init.method ?? "GET").toUpperCase();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  if (forwardCookie) {
    headers.Cookie = forwardCookie;
  }

  if (UNSAFE_METHODS.has(method)) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    method,
    headers,
    // Browser-side: sends/receives the session + csrftoken cookies
    // cross-origin. No effect server-side — that's what forwardCookie is for.
    credentials: "include",
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
