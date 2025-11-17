"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

type QueueJob = {
  id: string;
  type: string;
  node: string;
  submittedAt: string;
  status: "Pending" | "Running" | "Failed";
};

export default function QueuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<QueueJob[]>([]);

  // Dummy API fetch (replace later)
  useEffect(() => {
    setJobs([
      {
        id: "job-1",
        type: "LLM Query – Type A",
        node: "Node-03",
        submittedAt: "2025-05-12 14:02",
        status: "Pending",
      },
      {
        id: "job-2",
        type: "LLM Query – Type B",
        node: "Node-07",
        submittedAt: "2025-05-12 13:47",
        status: "Running",
      },
      {
        id: "job-3",
        type: "LLM Query – Type C",
        node: "Node-02",
        submittedAt: "2025-05-12 13:10",
        status: "Failed",
      },
    ]);
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <Stack spacing={4}>
      {/* PAGE HEADER */}
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
            Job Queue
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Monitoring active and pending jobs
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Review queued jobs in your cluster and manage workloads efficiently.
          </Typography>
        </Stack>
      </Paper>

      {/* JOB QUEUE LIST */}
        <Grid container spacing={3}>
        {jobs.map((job, index) => (
            <Grid
            key={job.id}
            item
            xs={12}
            sm={6}
            md={4}
            display="flex"
            justifyContent="center"

            minWidth="310px"
            flexGrow="1"
            flexBasis="300px"
            >
                <Paper
                    elevation={0}
                    sx={{
                    p: 3,
                    borderRadius: 3,
                    border: "1px solid rgba(15, 23, 42, 0.08)",
                    backgroundColor: "#ffffff",
                    boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                    maxWidth: "400px",
                    minWidth: "300px",
                    width: "100%",
                    }}
                >
                    <Stack spacing={2}>
                    {/* NUMBERING */}
                    <Typography
                        variant="overline"
                        sx={{ fontWeight: 700, opacity: 0.6 }}
                    >
                        #{index + 1}
                    </Typography>

                        <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                            width: "100%",
                        }}
                        >
                        {/* JOB INFO */}
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                {job.type}
                                </Typography>

                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Node: {job.node}
                                </Typography>

                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                Submitted: {job.submittedAt}
                                </Typography>
                            </Box>

                        {/* STATUS BADGE */}
                            <Chip
                                label={job.status}
                                sx={{
                                fontWeight: 600,
                                px: 1.5,
                                py: 0.5,
                                alignSelf: "flex-start",
                                backgroundColor:
                                    job.status === "Pending"
                                    ? "rgba(245, 158, 11, 0.15)"
                                    : job.status === "Running"
                                    ? "rgba(16, 185, 129, 0.15)"
                                    : "rgba(239, 68, 68, 0.15)",
                                color:
                                    job.status === "Pending"
                                    ? "#f59e0b"
                                    : job.status === "Running"
                                    ? "#10b981"
                                    : "#ef4444",
                                }}
                            />

                        {/* CANCEL BUTTON */}
                            <Button
                                variant="contained"
                                color="error"
                                sx={{
                                borderRadius: 2,
                                textTransform: "none",
                                fontWeight: 600,
                                py: 1,
                                px: 3,
                                width: "100%",         // full width, clean mobile look
                                alignSelf: "stretch",  // prevents any overflow anywhere
                                }}
                                onClick={() => {
                                setJobs((prev) => prev.filter((j) => j.id !== job.id));
                                }}
                            >
                                <DeleteOutlineIcon sx={{ mr: 1 }} />
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        ))}
        </Grid>
    </Stack>
  );
}
