"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TableMapper from "@/components/monitoring/TableMapper";

export default function MonitoringPage() {
  const { user, loading } = useAuth();
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

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
