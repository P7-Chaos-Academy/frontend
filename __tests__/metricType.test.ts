import * as client from "../lib/api/client";
import { getMetricTypes, type MetricType } from "../lib/api/metricType";

describe("metricType api", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(client, "apiFetch");
    (client.apiFetch as jest.Mock).mockReset();
  });

  it("getMetricTypes calls GET on metrics endpoint and returns data", async () => {
    const items: MetricType[] = [
      {
        name: "Power",
        description: "Consumed power",
        prometheusIdentifier: "power_wh",
        unit: "Wh",
        id: 1,
        checked: true,
      },
    ];

    (client.apiFetch as jest.Mock).mockResolvedValue(items);

    const result = await getMetricTypes();
    expect(client.apiFetch).toHaveBeenCalledWith("/api/Metrics/metrics", {
      method: "GET",
    });
    expect(result).toEqual(items);
  });
});
