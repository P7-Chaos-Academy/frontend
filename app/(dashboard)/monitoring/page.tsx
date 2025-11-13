"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nodeDummyData } from "@/models/nodeStatus";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import NodeTable from "@/components/monitoring/NodeTable";
import MonitoringTable from "@/components/monitoring/MonitoringTable";
import TableMapper from "@/components/monitoring/TableMapper";

export default function MonitoringPage() {
  const { user, loading } = useAuth();
  const router: AppRouterInstance = useRouter();

  //Fake node data, to test if compilation and rendering works
  const [nodes, setNodes] = useState<NodeStatus[]>(nodeDummyData);

  /* useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  } */

  return (
    <Stack spacing={4}>
      {/* Header Card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 45%, #2563eb 100%)",
          color: "#f8fafc",
          boxShadow: "0 35px 65px rgba(14, 165, 233, 0.28)",
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            Monitoring dashboard
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Cluster node visibility in real-time
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Stay informed with live metrics on each node’s health, workload, and uptime.
          </Typography>
        </Stack>
      </Paper>

      {/* Monitoring Table */}
      <TableMapper />
    </Stack>
  );
}
