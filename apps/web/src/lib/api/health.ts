import { apiFetch } from "./client";

export interface HealthStatus {
  status: string;
}

export async function fetchHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>("/health/");
}
