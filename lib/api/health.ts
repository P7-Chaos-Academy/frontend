import { apiFetch } from "./client";

export async function getStratoHealth(): Promise<string> {
  return apiFetch<string>("/api/Health");
}

export async function getClustersHealth(): Promise<Record<string, string>> {
  return apiFetch<Record<string, string>>("/api/cluster/health");
}
