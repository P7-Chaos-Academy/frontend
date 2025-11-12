"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { nodeDummyData, NodeStatus } from "@/models/nodeStatus";

export default function MonitoringPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  //Fake node data, to test if compilation and rendering works
  const [nodes, setNodes] = useState<NodeStatus[]>(nodeDummyData);

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
      {/* 💠 Header Card */}
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

      {/* 📊 Monitoring Table */}
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
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Node Status Overview
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Node ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CPU Usage</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Memory Usage</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uptime</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell>{node.id}</TableCell>
                  <TableCell>{node.name}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        backgroundColor:
                          node.status === "Healthy"
                            ? "rgba(16,185,129,0.1)"
                            : node.status === "Degraded"
                            ? "rgba(245,158,11,0.1)"
                            : "rgba(239,68,68,0.1)",
                        color:
                          node.status === "Healthy"
                            ? "#10b981"
                            : node.status === "Degraded"
                            ? "#f59e0b"
                            : "#ef4444",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                      }}
                    >
                      {node.status}
                    </Box>
                  </TableCell>
                  <TableCell>{node.cpu}</TableCell>
                  <TableCell>{node.memory}</TableCell>
                  <TableCell>{node.uptime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
