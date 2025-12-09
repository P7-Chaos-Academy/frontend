import { Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { bundleByInstance, getMetricsQueryNotRange, InstanceBundle } from "@/lib/api/metricsQuery";
import { useCluster } from "@/contexts/ClusterContext";

export default function TableMapper() {
  const { selectedClusterId } = useCluster();
  const DummyInstanceBundles: InstanceBundle[] = [
    {instance: "node-1", metrics: {"cpu_usage":"45","memory_usage":"2048","power_usage":"150"}},
    {instance: "node-2", metrics: {"cpu_usage":"55","memory_usage":"3072","power_usage":"200"}},
    {instance: "node-3", metrics: {"cpu_usage":"35","memory_usage":"1024","power_usage":"100"}},
  ];
  const [microGrids, setMicroGrids] = useState<InstanceBundle[]>(DummyInstanceBundles);
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedClusterId) return;
      
      const date: Date = new Date(Date.now());
      const UTCDate: Date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(),
                date.getUTCDate(), date.getUTCHours(),
                date.getUTCMinutes(), date.getUTCSeconds()))
      await getMetricsQueryNotRange(
        [1, 2, 3, 4, 7],
        UTCDate,
        undefined,
        selectedClusterId
      ).then((response) => {
        const parsedResponse: InstanceBundle[] = bundleByInstance(response);
        setMicroGrids(parsedResponse);
      });
    };
    fetchData();
  }, [update, selectedClusterId]);

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
      {microGrids.length > 0 && (
        <MonitoringTable microgrid={microGrids} id="all-nodes" key="monitoring-table"/>
      )}
      </Paper>
    );
}