import { useSearchParams } from "next/navigation";
import ChecklistIcon from '@mui/icons-material/Checklist';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import FitbitIcon from '@mui/icons-material/Fitbit';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import ChatIcon from '@mui/icons-material/Comment';
import { 
    List, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText,
    Collapse
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NavItemType } from "@/models/navItemsType";

export default function DashboardRoutes() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const nodeName = searchParams.get("name");
  const isNodePage = pathname.startsWith("/monitoring/") && pathname !== "/monitoring";


  const [ mobileOpen, setMobileOpen ] = useState<boolean>(false);

  const navItems: NavItemType[] = [
    { label: "Overview", href: "/", icon: <DashboardIcon /> },
    { label: "Deployments", href: "/deployments", icon: <FitbitIcon /> },
    { label: "Monitoring", href: "/monitoring", icon: <DataUsageIcon /> },
    { label: "Logs", href: "/logs", icon: <ChatIcon /> },
  ];

  // Detect node page format: /monitoring/{nodeId}
  const cleaned = pathname.replace(/\/+$/, ""); // Remove trailing slash
  const isMonitoringBase = cleaned === "/monitoring";
  const isMonitoringNodePage =
    cleaned.startsWith("/monitoring/") && !isMonitoringBase;
  const nodeId = isMonitoringNodePage ? cleaned.split("/")[2] || null : null;

  // Deployments → Jobs logic
  const isJobsPage = pathname.startsWith("/deployments/jobs");


  // The lint does not like unused variables, so we add this useEffect to silence the warning.
  useEffect(() => {}, [mobileOpen]) 

  return (
    <List sx={{ flexGrow: 1 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isMonitoringItem = item.href === "/monitoring";
        const isDeploymentsItem = item.href === "/deployments";

        return (
          <div key={item.href}>
            {/* Top-level item */}
            <ListItemButton
              component={Link}
              href={item.href}
              selected={
                isActive ||
                (isMonitoringItem && isMonitoringNodePage) ||
                (isDeploymentsItem && isJobsPage)
              }
              onClick={() => setMobileOpen(false)}
              sx={{
                mb: 1,
                borderRadius: 2,
                color: "inherit",
                "&.Mui-selected": {
                  backgroundColor: "rgba(15, 23, 42, 0.25)",
                  backdropFilter: "blur(8px)",
                },
                "&:hover": {
                  backgroundColor: "rgba(15, 23, 42, 0.18)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItemButton>

            {/* ============================
                DEPLOYMENTS → JOBS COLLAPSE
            ============================= */}
            {isDeploymentsItem && pathname.startsWith("/deployments") && (
              <Collapse in={true}>
                <List disablePadding>

                  {/* Jobs */}
                  <ListItemButton
                    component={Link}
                    href="/deployments/jobs"
                    selected={pathname.startsWith("/deployments/jobs")}
                    sx={{
                      pl: 6,
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: pathname.startsWith("/deployments/jobs")
                        ? "rgba(15, 23, 42, 0.12)"
                        : "transparent",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(15, 23, 42, 0.18)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                      <ChecklistIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Jobs"
                      primaryTypographyProps={{ fontSize: "0.9rem" }}
                    />
                  </ListItemButton>

                  {/* Queue */}
                  <ListItemButton
                    component={Link}
                    href="/deployments/queue"
                    selected={pathname.startsWith("/deployments/queue")}
                    sx={{
                      pl: 6,
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: pathname.startsWith("/deployments/queue")
                        ? "rgba(15, 23, 42, 0.12)"
                        : "transparent",
                      "&.Mui-selected": {
                        backgroundColor: "rgba(15, 23, 42, 0.18)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                      <FormatListNumberedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Queue"
                      primaryTypographyProps={{ fontSize: "0.9rem" }}
                    />
                  </ListItemButton>

                </List>
              </Collapse>
            )}

            {/* ============================
                MONITORING → NODE COLLAPSE
            ============================= */}
            {isMonitoringItem && isMonitoringNodePage && nodeId && (
              <Collapse in={true}>
                <List disablePadding>
                  {isNodePage && (
                    <ListItemButton
                      component={Link}
                      href={`/monitoring/${nodeId}`}
                      sx={{
                        pl: 6,
                        borderRadius: 2,
                        mb: 1,
                        backgroundColor: "rgba(15, 23, 42, 0.12)",
                      }}
                      selected={true}
                    >
                      <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                        <StorageIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={nodeName ?? "Node"}
                        primaryTypographyProps={{ fontSize: "0.9rem" }}
                      />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            )}
          </div>
        );
      })}
    </List>
  );
}