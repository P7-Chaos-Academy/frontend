import { apiFetch } from "./client";
/* eslint-disable comma-dangle */
export async function getMetricsQuery(
  metricId: number,
  startDate: Date,
  endDate: Date,
  step: string
): Promise<string> {
  return apiFetch<string>("/api/Metrics/query", {
    method: "POST",
    body: JSON.stringify({
      metricId: metricId,
      time: startDate.toISOString(),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      step: step,
      isRange: true,
    }),
  });
}
/* eslint-enable comma-dangle */
