import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { getMetricsQuery } from "@/lib/api/metricsQuery";
import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";

export default function TableMapper() {
  const [microGrids, setMicroGrids] = useState<PrometheusMatrixResponse>()
  const [update, setUpdate] = useState<boolean>(false);

  /*useEffect(() => {
    const registerMetrics = async () => {
      // Register the metric
      await apiFetch<void>("/api/Metrics/metrics", {
        method: "POST",
        body: JSON.stringify({
          name: "Node Energy Consumption",
          description: "Node Energy Consumption in Watts",
          prometheusIdentifier: "jetson_pom_5v_in_watts",
          unit: "w",
        }),
      });

      // Fetch the metrics
      const response = await apiFetch<unknown>("/api/Metrics/metrics", {
        method: "GET",
      });
      console.log("Metrics fetched: ", response);
    };

    registerMetrics();
  }, []); */

  useEffect(() => {
    const fetchData = async () => {
      const date: Date = new Date(Date.now());
      const UTCDate: Date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds()))
      await getMetricsQuery(
        9,
        UTCDate,
        UTCDate,
        "60s",
        undefined
      ).then((response) => {
        console.log("Fetched Metrics Response:", response);
        console.log("Date: ", UTCDate.toISOString());
        const jsonResponse: PrometheusMatrixResponse = JSON.parse(response);
        setMicroGrids(jsonResponse);
      });
    };
    fetchData();
  }, [update]);

  return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
        }}
      >

      {microGrids && <MonitoringTable microgrid={microGrids} id={microGrids.data.result[0].metric.instance} key={microGrids.data.result[0].metric.instance}/>}
      </Paper>
    );
}