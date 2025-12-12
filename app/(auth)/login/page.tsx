"use client";

import {
  Box,
  Typography,
} from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {


  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(15, 23, 42, 0.28)",
            mb: 1.5,
          }}
        >
          <HubIcon />
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="subtitle2"
            sx={{ textTransform: "uppercase", letterSpacing: 2 }}
          >
            Strato
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            Control Plane
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "min(450px, 90%)",
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
}