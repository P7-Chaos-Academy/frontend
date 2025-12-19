import { Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { bundleByInstance, getMetricsQueryNotRange, InstanceBundle } from "@/lib/api/metricsQuery";
import { useCluster } from "@/contexts/ClusterContext";

export default function TableMapper() {
  const { selectedClusterId, loading: clusterLoading } = useCluster();
  const [microGrids, setMicroGrids] = useState<InstanceBundle[]>([]);
  const [update, setUpdate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (clusterLoading || selectedClusterId === null || selectedClusterId <= 0) return;

      setLoading(true);
      
      const date: Date = new Date(Date.now());
      const UTCDate: Date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds()))
      try {
        const response = await getMetricsQueryNotRange(
          [1, 2, 3, 14, 15],
          UTCDate,
          undefined,
          selectedClusterId
        );
        const parsedResponse: InstanceBundle[] = bundleByInstance(response);
        setMicroGrids(parsedResponse);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [update, selectedClusterId, clusterLoading]);

  if (clusterLoading) {
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
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (!selectedClusterId) {
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
        <Typography color="text.secondary">
          Please select a cluster to view metrics.
        </Typography>
      </Paper>
    );
  }

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
      <Button onClick={() => setUpdate(!update)}>Refresh Data</Button>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : microGrids.length > 0 ? (
        <MonitoringTable microgrid={microGrids} id="all-nodes" key="monitoring-table" />
      ) : (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          No metrics data available.
        </Typography>
      )}
    </Paper>
  );
}