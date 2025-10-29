'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import ScienceIcon from '@mui/icons-material/Science';
import LogoutIcon from '@mui/icons-material/Logout';
import HubIcon from '@mui/icons-material/Hub';
import { useAuth } from '@/contexts/AuthContext';

const drawerWidth = 280;

const navItems = [
  { label: 'Overview', href: '/', icon: <DashboardIcon /> },
  { label: 'Clusters', href: '/clusters', icon: <StorageIcon /> },
  { label: 'Tests', href: '/tests', icon: <ScienceIcon /> }
];

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = useMemo(() => {
    if (!user?.email) {
      return 'S';
    }
    return user?.email.charAt(0).toUpperCase();
  }, [user?.email]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)'
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

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, rgba(37,99,235,0.92) 0%, rgba(59,130,246,0.88) 50%, rgba(59,130,246,0.78) 100%)',
        color: '#f8fafc',
        p: 3
      }}
    >
      <Stack spacing={1.5} sx={{ mb: 5 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.28)'
          }}
        >
          <HubIcon />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
            Strato
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            Control Plane
          </Typography>
        </Box>
      </Stack>

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
                color: 'inherit',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(15, 23, 42, 0.25)',
                  backdropFilter: 'blur(8px)'
                },
                '&:hover': {
                  backgroundColor: 'rgba(15, 23, 42, 0.18)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.24)', mb: 2 }} />
      <Stack spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: 'rgba(15, 23, 42, 0.26)',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Avatar sx={{ bgcolor: 'rgba(15, 23, 42, 0.6)' }}>{initials}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Signed in as
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.email ?? 'Cluster Admin'}
            </Typography>
          </Box>
        </Paper>
        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="outlined"
          color="inherit"
          sx={{ borderColor: 'rgba(248, 250, 252, 0.4)', color: 'inherit' }}
          disabled={!user}
        >
          Sign out
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)' }}>
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
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'transparent',
              backgroundImage: 'none'
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              backgroundColor: 'transparent',
              backgroundImage: 'none'
            }
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
          minHeight: '100vh',
          px: { xs: 3, sm: 4, lg: 6 },
          py: { xs: 4, md: 6 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap'
          }}
        >
          <IconButton
            color="primary"
            aria-label="open navigation"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              ml: { xs: 'auto', sm: 0 },
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              borderRadius: 3,
              px: 3,
              py: 1.5,
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Current environment
            </Typography>
            <Chip label="Development" color="primary" variant="outlined" size="small" />
          </Stack>
        </Box>

        {children}
      </Box>
    </Box>
  );
}
