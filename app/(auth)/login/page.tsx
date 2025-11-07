"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";
import PersonIcon from "@mui/icons-material/Person";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    
    
    
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);

      // Small delay to ensure auth state is updated
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#1976d2",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "30px", // space between logo box and login box
      }}
    >
      {/* Logo + Title Box */}
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

      {/* Center Login Box */}
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
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              mb: "40px",
            }}
          >
            <FormControl>
              <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  sx={{
                    "&::placeholder": {
                      fontSize: {
                        xs: "12px",
                        sm: "13px",
                        md: "14px",
                        lg: "15px",
                      },
                      opacity: 0.7,
                    },
                  }}
                />
            </FormControl>

            <FormControl>
              <FormLabel>Password</FormLabel>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  sx={{
                    "&::placeholder": {
                      fontSize: {
                        xs: "12px",
                        sm: "13px",
                        md: "14px",
                        lg: "15px",
                      },
                      opacity: 0.7,
                    },
                  }}
                />
            </FormControl>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            startIcon={<PersonIcon />}
            sx={{ width: "100%" }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Box>
    </Box>
  );
}