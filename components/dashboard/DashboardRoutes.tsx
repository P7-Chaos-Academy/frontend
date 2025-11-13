import DashboardIcon from "@mui/icons-material/Dashboard";
import StorageIcon from "@mui/icons-material/Storage";
import ScienceIcon from "@mui/icons-material/Science";
import { 
    List, 
    ListItemButton, 
    ListItemIcon, 
    ListItemText 
} from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { NavItemType } from "@/models/navItemsType";

export default function DashboardRoutes() {
  const pathname: string = usePathname();
  const [ mobileOpen, setMobileOpen ] = useState<boolean>(false);
  const navItems: NavItemType[] = [
    { label: "Overview", href: "/", icon: <DashboardIcon /> },
    { label: "Deployments", href: "/deployments", icon: <ScienceIcon /> },
    { label: "Monitoring", href: "/monitoring", icon: <StorageIcon /> },
    { label: "Logs", href: "/logs", icon: <DashboardIcon /> },
  ];

  //The lint does not like unused variables, so we add this useEffect to silence the warning.
  useEffect(() => {}, [mobileOpen]) 

  return (
        <List sx={{ flexGrow: 1 }}>
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                <ListItemButton
                    key={item.href}
                    component={Link}
                    href={item.href}
                    selected={isActive}
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
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                    />
                </ListItemButton>
                );
            })}
        </List>
  );
}