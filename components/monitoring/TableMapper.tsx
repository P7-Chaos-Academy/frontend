import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { getMetricsQuery } from "@/lib/api/metricsQuery";
import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";

export default function TableMapper() {
  const [microGrids, setMicroGrids] = useState<PrometheusMatrixResponse>()

  useEffect(() => {
    const fetchData = async () => {
      await getMetricsQuery(
        3,
        new Date(Date.now()),
        new Date(Date.now()),
        "60s",
        undefined
      ).then((response) => {
        const jsonResponse: PrometheusMatrixResponse = JSON.parse(response);
        setMicroGrids(jsonResponse);
      });
    };
    fetchData();
  }, []);

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