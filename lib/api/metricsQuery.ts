import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";
import { apiFetch } from "./client";

export async function getMetricsQuery(
  metricIds: number[],
  startDate: Date,
  endDate: Date,
  step: string,
  instance: string | undefined | null,
  clusterId: number,
): Promise<PrometheusMatrixResponse> {
  if (!clusterId || clusterId <= 0) {
    throw new Error("clusterId is required and must be greater than 0");
  }
  return apiFetch<PrometheusMatrixResponse>(
    `/api/Metrics/query?clusterId=${clusterId}`,
    {
      method: "POST",
      body: JSON.stringify({
        metricIds: metricIds,
        time: endDate.toISOString(),
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        step: step,
        isRange: true,
        instance: instance,
      }),
    },
  );
}

export type InstanceBundle = {
  instance: string;
  metrics: Record<string, string>;
};

export function bundleByInstance(
  input: PrometheusMatrixResponse,
): InstanceBundle[] {
  const temp: Record<string, Record<string, string>> = {};
  const allMetricNames = new Set<string>();

  if (!input.data?.result) {
    console.warn("No result data found");
    return [];
  }

  for (const item of input.data.result) {
    const instance = item.metric?.instance;
    const metricName = item.metric?.__name__;

    const valueArray = item.value;
    const metricValue = Array.isArray(valueArray) ? valueArray[1] : valueArray;

    if (!instance || !metricName || metricValue === undefined) {
      continue;
    }

    allMetricNames.add(metricName);

    if (!temp[instance]) {
      temp[instance] = {};
    }

    temp[instance][metricName] = metricValue;
  }

  return Object.entries(temp).map(([instance, metrics]) => {
    const filledMetrics: Record<string, string> = {};

    for (const metricName of Array.from(allMetricNames)) {
      // Use the actual value if present, otherwise use "N/A"
      filledMetrics[metricName] = metrics[metricName] ?? "N/A";
    }

    return {
      instance,
      metrics: filledMetrics,
    };
  });
}

export async function getMetricsQueryNotRange(
  metricIds: number[],
  time: Date,
  instance: string | undefined | null,
  clusterId: number,
): Promise<PrometheusMatrixResponse> {
  if (!clusterId || clusterId <= 0) {
    throw new Error("clusterId is required and must be greater than 0");
  }
  return apiFetch<PrometheusMatrixResponse>(
    `/api/Metrics/query?clusterId=${clusterId}`,
    {
      method: "POST",
      body: JSON.stringify({
        metricIds: metricIds,
        time: time.toISOString(),
        isRange: false,
        instance: instance,
      }),
    },
  );
}
