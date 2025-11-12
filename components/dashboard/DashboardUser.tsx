import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function DashboardUser() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    
    const handleLogout = () => {
      logout();
      router.push("/login");
    };

    const emailDisplay = useMemo(() => {
      return user?.email?.charAt(0).toUpperCase();
    }, [user?.email]);

    return (
      <Stack spacing={2}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(15, 23, 42, 0.26)",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 2,
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
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="outlined"
          color="inherit"
          sx={{ borderColor: "rgba(248, 250, 252, 0.4)", color: "inherit" }}
          disabled={!user}
        >
          Sign out
        </Button>
      </Stack>
    );
}