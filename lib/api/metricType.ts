import { apiFetch } from "./client";

export interface MetricType {
  name: string;
  description: string;
  prometheusIdentifier: string;
  unit?: string | null;
  id: number;
  checked: boolean;
}

export async function getMetricTypes(): Promise<MetricType[]> {
  return apiFetch<MetricType[]>("/api/Metrics/metrics", {
    method: "GET",
  });
}
