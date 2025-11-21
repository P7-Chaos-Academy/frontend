import { apiFetch } from "./client";

export async function getMetricsQuery(
  metricId: number,
  startDate: Date,
  endDate: Date,
  step: string,
  instance: string | undefined
): Promise<string> {
  return apiFetch<string>("/api/Metrics/query", {
    method: "POST",
    body: JSON.stringify({
      metricId: metricId,
      time: endDate.toISOString(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      step: step,
      isRange: true,
      instance: instance
    }),
  });
}