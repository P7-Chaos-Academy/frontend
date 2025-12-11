"use client";

import { Box, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getClustersHealth, getStratoHealth } from "@/lib/api/health";

interface HealthStatus {
  stratoApi: "loading" | "healthy" | "unhealthy";
  clusters: Record<string, string> | null;
  clustersLoading: boolean;
}

export default function HeroBanner() {
  const [health, setHealth] = useState<HealthStatus>({
    stratoApi: "loading",
    clusters: null,
    clustersLoading: true,
  });

  useEffect(() => {
    async function fetchHealth() {
      // Fetch strato-api health
      try {
        const stratoHealth = await getStratoHealth();
        setHealth((prev) => ({
          ...prev,
          stratoApi: stratoHealth === "Ok" ? "healthy" : "unhealthy",
        }));
      } catch {
        setHealth((prev) => ({ ...prev, stratoApi: "unhealthy" }));
      }

      // Fetch clusters health
      try {
        const clustersHealth = await getClustersHealth();
        setHealth((prev) => ({
          ...prev,
          clusters: clustersHealth,
          clustersLoading: false,
        }));
      } catch {
        setHealth((prev) => ({ ...prev, clusters: null, clustersLoading: false }));
      }
    }

    fetchHealth();
  }, []);

  const getChipProps = (status: "loading" | "healthy" | "unhealthy") => {
    switch (status) {
      case "loading":
        return { label: "Checking...", color: "default" as const };
      case "healthy":
        return { label: "Operational", color: "success" as const };
      case "unhealthy":
        return { label: "Unavailable", color: "error" as const };
    }
  };

  const getClusterChipProps = (status: string) => {
    const lower = status.toLowerCase();
    console.log("Lower: " + lower)
    if (lower === "healthy" || lower === "ok") {
      return { label: status, color: "success" as const };
    }
    return { label: status, color: "error" as const };
  };
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        borderRadius: 4,
        background:
          "radial-gradient(circle at top left, #60a5fa 0%, #2563eb 40%, #1e40af 100%)",
        color: "#f8fafc",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 35px 65px rgba(30, 64, 175, 0.35)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <Stack spacing={3} sx={{ position: "relative" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome to the Strato control plane
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Observe all the clusters
            </Typography>
          </Box>
          <Stack
            direction="column"
            spacing={2}
            alignItems={{ xs: "flex-start", md: "flex-end" }}
          >
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Strato API
              </Typography>
              <Chip
                {...getChipProps(health.stratoApi)}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                Clusters
              </Typography>
              {health.clustersLoading ? (
                <Chip
                  label="Checking..."
                  icon={<CircularProgress size={14} sx={{ color: "inherit" }} />}
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              ) : health.clusters ? (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {Object.entries(health.clusters).map(([name, status]) => (
                    <Chip
                      key={name}
                      label={name}
                      color={getClusterChipProps(status).color}
                      size="small"
                      variant="filled"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              ) : (
                <Chip
                  label="No clusters"
                  color="warning"
                  variant="filled"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
