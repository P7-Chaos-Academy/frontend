import { useSearchParams } from "next/navigation";
import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import ScienceIcon from "@mui/icons-material/Science";
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
    { label: "Deployments", href: "/deployments", icon: <ScienceIcon /> },
    { label: "Monitoring", href: "/monitoring", icon: <DataUsageIcon /> },
    { label: "Logs", href: "/logs", icon: <ChatIcon /> },
  ];

  // Detect node page format: /monitoring/{nodeId}
  const cleaned = pathname.replace(/\/+$/, ""); // remove trailing slash
  const isMonitoringBase = cleaned === "/monitoring";
  const isMonitoringNodePage =
    cleaned.startsWith("/monitoring/") && !isMonitoringBase;
  const nodeId = isMonitoringNodePage ? cleaned.split("/")[2] || null : null;




  // The lint does not like unused variables, so we add this useEffect to silence the warning.
  useEffect(() => {}, [mobileOpen]) 

  return (
    <List sx={{ flexGrow: 1 }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const isMonitoringItem = item.href === "/monitoring";

        return (
          <div key={item.href}>
            <ListItemButton
              component={Link}
              href={item.href}
              selected={isActive || (isMonitoringItem && isMonitoringNodePage)}
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

            {/* show indented node item when we're on /monitoring/{nodeId} */}
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