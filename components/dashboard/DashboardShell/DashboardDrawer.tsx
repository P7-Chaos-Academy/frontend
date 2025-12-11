"use client";

import { Box, Divider } from "@mui/material";
import DashboardLogo from "./DashboardLogo";
import DashboardRoutes from "./DashboardRoutes";
import DashboardUser from "./DashboardUser";

export default function DashboardDrawer() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, rgba(37,99,235,0.92) 0%, rgba(59,130,246,0.88) 50%, rgba(59,130,246,0.78) 100%)",
        color: "#f8fafc",
        p: 3,
      }}
    >
      <DashboardLogo />

      <DashboardRoutes />

      <Divider sx={{ borderColor: "rgba(148, 163, 184, 0.24)", mb: 2 }} />

      <DashboardUser />
    </Box>
  );
}
