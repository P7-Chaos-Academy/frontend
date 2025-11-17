"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [runningJob, setRunningJob] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  // Dummy API job runner — replace later
  const runJob = async (jobType: string) => {
    setRunningJob(jobType);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log(`Job started: ${jobType}`);
      alert(`Started job: ${jobType}`);
    } catch (err) {
      console.error(err);
      alert("Failed to start job.");
    }

    setRunningJob(null);
  };

  const jobs = [
    {
      id: "query-basic",
      title: "Basic LLM Query",
      description: "Runs a simple prompt on the node's lightweight model.",
    },
    {
      id: "query-contextual",
      title: "Contextual Analysis",
      description: "Performs a contextual comprehension task on the LLM.",
    },
    {
      id: "query-advanced",
      title: "Advanced Reasoning Job",
      description: "Executes a deeper reasoning query for benchmarking.",
    },
  ];

  return (
    <Stack spacing={4}>
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
            LLM Workloads
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Run jobs across your distributed cluster
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Select from predefined LLM query workloads. These will execute on
            each node equipped with a local model runtime.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid key={job.id} item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {job.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", flexGrow: 1 }}
              >
                {job.description}
              </Typography>

              <Button
                variant="contained"
                sx={{ mt: 3 }}
                disabled={runningJob !== null}
                onClick={() => runJob(job.id)}
              >
                {runningJob === job.id ? "Running..." : "Run Job"}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
