import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { getMetricsQuery } from "@/lib/api/metricsQuery";
import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";

export default function TableMapper() {
  const [microGrids, setMicroGrids] = useState<PrometheusMatrixResponse>()
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const date: Date = new Date(Date.now());
      const UTCDate: Date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds()))
      await getMetricsQuery(
        3,
        UTCDate,
        UTCDate,
        "60s",
        "172.25.26.200:9100"
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
      {microGrids?.data.result.map((grid) => (
        <MonitoringTable key={grid.metric.instance} microgrid={microGrids.data.result}/>
      ))}
      </Paper>
    );
}