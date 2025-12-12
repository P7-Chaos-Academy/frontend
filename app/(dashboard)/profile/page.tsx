"use client";

import { Avatar, Box, Button, Container, Paper, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const emailDisplay = useMemo(() => {
    return user?.email?.charAt(0).toUpperCase();
  }, [user?.email]);

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 8,
          p: 6,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Avatar
          sx={{
            width: 120,
            height: 120,
            bgcolor: "primary.main",
            fontSize: "3rem",
          }}
        >
          {emailDisplay}
        </Avatar>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Signed in as
          </Typography>
          <Typography variant="h5" fontWeight={600}>
            {user?.email ?? "Cluster Admin"}
          </Typography>
        </Box>

        <Button
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={!user}
        >
          Sign out
        </Button>
      </Paper>
    </Container>
  );
}