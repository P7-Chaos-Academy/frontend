import {
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default function HeaderCard() {
  return (
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
            Monitoring dashboard
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Cluster nodes 
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Here you can see live metrics on each node’s health, workload, temperature, and power usage.
          </Typography>
        </Stack>
      </Paper>
  )
}
