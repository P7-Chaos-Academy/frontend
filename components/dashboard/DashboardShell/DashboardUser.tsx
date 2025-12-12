import { Avatar, Box, Button, Paper, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function DashboardUser() {
    const { user, logout } = useAuth();
    const router: AppRouterInstance = useRouter();
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
    
    const handleLogoutClick = () => {
      setLogoutConfirmOpen(true);
    };

    const handleConfirmLogout = () => {
      setLogoutConfirmOpen(false);
      logout();
      router.push("/login");
    };

    const handleProfileClick = () => {
      router.push("/profile");
    };

    const emailDisplay: string | undefined = useMemo(() => {
      return user?.email?.charAt(0).toUpperCase();
    }, [user?.email]);

    return (
      <Stack spacing={2}>
        <Paper
          elevation={0}
          onClick={handleProfileClick}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(15, 23, 42, 0.26)",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "rgba(15, 23, 42, 0.4)",
            },
          }}
        >
          <Avatar sx={{ bgcolor: "rgba(15, 23, 42, 0.6)" }}>
            {emailDisplay}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Signed in as
            </Typography>
            <Typography variant="subtitle1" fontWeight={600}>
              {user?.email ?? "Cluster Admin"}
            </Typography>
          </Box>
        </Paper>
        <Button
          onClick={handleLogoutClick}
          startIcon={<LogoutIcon />}
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "rgba(248, 250, 252, 0.4)", color: "inherit" }}
          disabled={!user}
        >
          Sign out
        </Button>

        <Dialog open={logoutConfirmOpen} onClose={() => setLogoutConfirmOpen(false)}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to sign out?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmLogout} color="error" variant="contained">
              Sign out
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
}