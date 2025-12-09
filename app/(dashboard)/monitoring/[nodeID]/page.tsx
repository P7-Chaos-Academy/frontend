"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCluster } from "@/contexts/ClusterContext";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Stack,
  Button,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getMetricsQuery } from "@/lib/api/metricsQuery";
import { getMetricTypes, MetricType } from "@/lib/api/metricType";

interface MetricEntry {
  time: string;
  value: number;
}

interface NodeMetrics {
  id: string;
  metricData: Record<string, MetricEntry[]>;
}

export default function NodeDetailPage() {
  const params = useParams();
  const { selectedClusterId } = useCluster();
  const nodeId = decodeURIComponent((params?.nodeID as string) || "");
  const [data, setData] = useState<NodeMetrics | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [stepMinutes, setStepMinutes] = useState<number>(2);
  const [startDateMinutes, setStartDateMinutes] = useState<number>(30);
  const [metricTypes, setMetricTypes] = useState<MetricType[]>([]);
  const [selectedMetricIds, setSelectedMetricIds] = useState<number[]>([2, 4, 5]);

  useEffect(() => {
    getMetricTypes()
      .then((types) => setMetricTypes(types))
      .catch((err) => {
        console.error("Error fetching metric types:", err);
      });
  }, [])

  useEffect(() => {
    async function fetchMetrics() {
      if (!nodeId || !selectedClusterId) return;

      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - startDateMinutes * 60 * 1000);
      const step = `${stepMinutes}m`;

      try {
        const resp = await getMetricsQuery(selectedMetricIds, startDate, endDate, step, nodeId as string, selectedClusterId);

        const metricData: Record<string, MetricEntry[]> = {};

        const results = resp.data?.result ?? [];

        for (const item of results) {
          const metricName: string = item.metric?.__name__ ?? "unknown";
          
          let dataPoints: Array<[number, string]> = [];
          if (item.values && Array.isArray(item.values)) {
            dataPoints = item.values;
          } else if (item.value && Array.isArray(item.value)) {
            dataPoints = [item.value];
          }

          const series: MetricEntry[] = [];

          for (const pair of dataPoints) {
            if (!Array.isArray(pair) || pair.length < 2) continue;

            const ts = pair[0];
            const val = pair[1];

            // Prometheus returns timestamps as seconds; convert to ms for Date constructor
            const tsNum = Number(ts);
            const date = new Date(tsNum * 1000);

            const timeLabel = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
            const valueNum = Number(val);

            series.push({ time: timeLabel, value: Number.isFinite(valueNum) ? valueNum : 0 });
          }

          metricData[metricName] = series;
        }

        setData({ id: String(nodeId), metricData });
      } catch (err) {
        // fallback to empty data on error
        console.error("Error fetching metrics:", err);
        setData({ id: String(nodeId), metricData: {} });
      }
    }

    fetchMetrics();
  }, [nodeId, update, stepMinutes, startDateMinutes, selectedMetricIds, selectedClusterId]);

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  function MetricTypeView() {
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
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Select Metrics
        </Typography>
        <FormGroup>
          {metricTypes.map((metric) => (
            <FormControlLabel
              key={metric.id}
              control={
                <Checkbox
                  checked={selectedMetricIds.includes(metric.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedMetricIds([...selectedMetricIds, metric.id]);
                    } else {
                      setSelectedMetricIds(
                        selectedMetricIds.filter((id) => id !== metric.id)
                      );
                    }
                  }}
                />
              }
              label={`${metric.name}${metric.unit ? ` (${metric.unit})` : ""}`}
            />
          ))}
        </FormGroup>
      </Paper>
    );
  }

  return (
    <Stack spacing={4}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h4" fontWeight={700}>
          Node {data.id} — Metrics Overview
        </Typography>
        <Button variant="outlined" size="small" onClick={() => setUpdate(!update)}>
          Refresh Data
        </Button>
      </Box>

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
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Query Step: {stepMinutes} minute{stepMinutes !== 1 ? "s" : ""}
            </Typography>
            <Slider
              value={stepMinutes}
              onChange={(e, newValue) => setStepMinutes(newValue as number)}
              min={1}
              max={5}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Time Range: Last {startDateMinutes} minute{startDateMinutes !== 1 ? "s" : ""}
            </Typography>
            <Slider
              value={startDateMinutes}
              onChange={(e, newValue) => setStartDateMinutes(newValue as number)}
              min={10}
              max={60}
              step={5}
              marks={[
                { value: 10, label: "10m" },
                { value: 30, label: "30m" },
                { value: 60, label: "1h" },
              ]}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `${val}m`}
            />
          </Box>
        </Stack>
      </Paper>

      <MetricTypeView />

      {selectedMetricIds.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          Select at least one metric to display charts
        </Typography>
      ) : (
        metricTypes
          .filter((metric) => selectedMetricIds.includes(metric.id))
          .map((metric) => (
            <MetricBox
              key={metric.id}
              title={`${metric.name}${metric.unit ? ` (${metric.unit})` : ""}`}
              data={data.metricData[metric.prometheusIdentifier] || []}
            />
          ))
      )}
    </Stack>
  );
}

function MetricBox({
  title,
  data,
}: {
  title: string;
  data: MetricEntry[];
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "#ffffff",
        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
        height: 300,
      }}
    >
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
