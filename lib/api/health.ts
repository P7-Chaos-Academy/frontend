import { apiFetch } from "./client";

export async function getHealth(): Promise<string> {
  return apiFetch<string>("/health");
}
