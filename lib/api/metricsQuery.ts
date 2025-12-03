import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";
import { apiFetch } from "./client";
import { convertLength } from "@mui/material/styles/cssUtils";

export async function getMetricsQuery(
  metricIds: number[],
  startDate: Date,
  endDate: Date,
  step: string,
  instance: string | undefined | null,
): Promise<string> {
  return apiFetch<string>("/api/Metrics/query", {
    method: "POST",
    body: JSON.stringify({
      metricIds: metricIds,
      time: endDate.toISOString(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      step: step,
      isRange: true,
      instance: instance,
    }),
  });
}

export type InstanceBundle = {
  instance: string;
  metrics: Record<string, string>;
};

// Convert to an array of instance bundles
export function bundleByInstance(
  input: PrometheusMatrixResponse,
): InstanceBundle[] {
  const temp: Record<string, Record<string, string>> = {};

  if (!input.data?.result) {
    console.warn("No result data found");
    return [];
  }

  for (const item of input.data.result) {
    const instance = item.metric?.instance;
    const metricName = item.metric?.__name__;

    // Get the value from the API response - it's a pair [timestamp, value]
    const valueArray = (item as any).value;
    const metricValue = Array.isArray(valueArray) ? valueArray[1] : valueArray;

    if (!instance || !metricName || !metricValue) {
      continue;
    }

    if (!temp[instance]) {
      temp[instance] = {};
    }

    temp[instance][metricName] = metricValue;
  }

  // Turn the object-of-objects into a neat array
  return Object.entries(temp).map(([instance, metrics]) => ({
    instance,
    metrics,
  }));
}
export async function getMetricsQueryNotRange(
  metricIds: number[],
  time: Date,
  instance: string | undefined | null,
): Promise<string> {
  return apiFetch<string>("/api/Metrics/query", {
    method: "POST",
    body: JSON.stringify({
      metricIds: metricIds,
      time: time.toISOString(),
      isRange: false,
      instance: instance,
    }),
  });
}
