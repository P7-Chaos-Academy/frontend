"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricEntry {
  time: string;
  value: number;
}

interface NodeMetrics {
  id: string;
  cpu: MetricEntry[];
  temperature: MetricEntry[];
  power: MetricEntry[];
}

export default function NodeDetailPage() {
  const { nodeId } = useParams();
  const [data, setData] = useState<NodeMetrics | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      // replace this with real API call later
      const dummy: NodeMetrics = {
        id: nodeId as string,
        cpu: [
          { time: "10:00", value: 20 },
          { time: "10:05", value: 45 },
          { time: "10:10", value: 35 },
        ],
        temperature: [
          { time: "10:00", value: 50 },
          { time: "10:05", value: 55 },
          { time: "10:10", value: 58 },
        ],
        power: [
          { time: "10:00", value: 100 },
          { time: "10:05", value: 140 },
          { time: "10:10", value: 110 },
        ],
      };

      setData(dummy);
    }

    fetchMetrics();
  }, [nodeId]);

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Node {data.id} — Metrics Overview
      </Typography>

      <MetricBox title="CPU Utilisation" data={data.cpu} />
      <MetricBox title="Temperature" data={data.temperature} />
      <MetricBox title="Power Consumption" data={data.power} />
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
