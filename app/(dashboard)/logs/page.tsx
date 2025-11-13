"use client";

import { 
  Stack, 
  Paper, 
  Typography,  
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import MicrogridBox from "@/components/MicrogridBox";

export default function LogsPage() {
  const { user, loading } = useAuth();
  const router = useRouter(); 
  
  /* useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  } */
  
  return (
    <Stack spacing={4}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 45%, #2563eb 100%)",
          color: "#f8fafc",
          boxShadow: "0 35px 65px rgba(14, 165, 233, 0.28)",
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            Distributed Logs
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Inspect task activity across your microgrids
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Each microgrid groups several nodes — open one to review real-time
            logs for every node running distributed workloads.
          </Typography>
        </Stack>
      </Paper>

      {/* Microgrid Log Containers */}
      <MicrogridBox />
    </Stack>
  );
}
