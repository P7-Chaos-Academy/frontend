import { apiFetch } from "./client";

export async function getMetricsQuery(
  metricIds: number[],
  startDate: Date,
  endDate: Date,
  step: string,
  instance: string | undefined | null
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
    })
  });
}