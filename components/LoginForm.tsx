import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import PersonIcon from "@mui/icons-material/Person";

export default function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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
            type="password"
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
  )
}