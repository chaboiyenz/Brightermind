/**
 * Minimal typed client for apps/api. Grows into per-resource functions as
 * real endpoints land; for now it only needs to prove the two apps can
 * talk to each other (health check) — see docs/TDD.md §3, §5.
 */

function getApiBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    throw new Error("NEXT_PUBLIC_API_URL is not set — copy .env.example to .env.local");
  }
  return url;
}

export interface HealthStatus {
  status: string;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const response = await fetch(`${getApiBaseUrl()}/health/`);

  if (!response.ok) {
    throw new Error(`API health check failed with status ${response.status}`);
  }

  return response.json() as Promise<HealthStatus>;
}
