"use client";

import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

interface HeroBannerProps {
  baseUrl?: string;
}

export default function HeroBanner({ baseUrl }: HeroBannerProps) {
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
            <Typography variant="overline" sx={{ letterSpacing: 2 }}>
              Distributed operations
            </Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome to the Strato control plane
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.85 }}>
              Observe all the clusters
            </Typography>
          </Box>
          <Stack
            direction="column"
            spacing={1}
            alignItems={{ xs: "flex-start", md: "flex-end" }}
          >
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Health endpoint status
            </Typography>
            <Chip
              label="Operational"
              color="success"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
