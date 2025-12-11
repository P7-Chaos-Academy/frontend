"use client";

import { useState } from "react";
import {
  Box,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardRoutes from "./DashboardRoutes";
import DashboardLogo from "./DashboardLogo";
import DashboardUser from "./DashboardUser";
import { useAuth } from "@/contexts/AuthContext";
import { useCluster } from "@/contexts/ClusterContext";

const drawerWidth = 280;

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const { loading } = useAuth();
  const { selectedCluster } = useCluster();
 
  const env = selectedCluster ? selectedCluster.name : "unknown";

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">
            Preparing dashboard…
          </Typography>
        </Stack>
      </Box>
    );
  }

  const drawer: JSX.Element = (
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

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
      }}
    >
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="dashboard navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "transparent",
              backgroundImage: "none",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              backgroundColor: "transparent",
              backgroundImage: "none",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          px: { xs: 3, sm: 4, lg: 6 },
          py: { xs: 4, md: 6 },
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <IconButton
            color="primary"
            aria-label="open navigation"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              ml: { xs: "auto", sm: 0 },
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              borderRadius: 3,
              px: 3,
              py: 1.5,
              boxShadow: "0 20px 45px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Current environment
            </Typography>
            <Chip
              label={env}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
