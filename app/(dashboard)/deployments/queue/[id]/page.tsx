"use client";

import { useAuth } from "@/contexts/AuthContext";
import { fetchJobDetails, JobDetailsResponse } from "@/lib/api/jobs";
import {
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

function getStatusColor(status: JobDetailsResponse["status"]): "success" | "error" | "info" | "warning" {
  switch (status) {
    case "succeeded":
      return "success";
    case "failed":
      return "error";
    case "running":
      return "info";
    case "pending":
      return "warning";
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleString();
}

function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return "—";
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
}

export default function JobDetailsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const jobName = params.id as string;

  const [job, setJob] = useState<JobDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobName) return;

    setLoading(true);
    fetchJobDetails(jobName)
      .then((data) => {
        setJob(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [jobName]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || !user) return null;

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)", backgroundColor: "#ffffff" }}>
        <Typography color="error">Error: {error}</Typography>
      </Paper>
    );
  }

  if (!job) {
    return (
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)", backgroundColor: "#ffffff" }}>
        <Typography>Job not found</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)", backgroundColor: "#ffffff", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)", mt: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={600}>
          {job.job_name}
        </Typography>
        <Chip label={job.status} color={getStatusColor(job.status)} />
      </Box>

      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">Namespace</Typography>
          <Typography variant="body1" mb={2}>{job.namespace}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Pod Name</Typography>
          <Typography variant="body1" mb={2}>{job.pod_name ?? "—"}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Node</Typography>
          <Typography variant="body1" mb={2}>{job.node_name ?? "—"}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Token Count</Typography>
          <Typography variant="body1" mb={2}>{job.token_count ?? "—"}</Typography>
        </Grid>

        <Grid xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
          <Typography variant="body1" mb={2}>{formatDate(job.created_at)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Started At</Typography>
          <Typography variant="body1" mb={2}>{formatDate(job.started_at)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Completed At</Typography>
          <Typography variant="body1" mb={2}>{formatDate(job.completed_at)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
          <Typography variant="body1" mb={2}>{formatDuration(job.duration_seconds)}</Typography>

          <Typography variant="subtitle2" color="text.secondary">Power Consumed</Typography>
          <Typography variant="body1" mb={2}>{job.power_consumed_wh != null ? `${job.power_consumed_wh.toFixed(4)} Wh` : "—"}</Typography>
        </Grid>

        <Grid xs={12}>
          <Typography variant="subtitle2" color="text.secondary">Prompt</Typography>
          <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: "#f8fafc" }}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{job.prompt}</Typography>
          </Paper>
        </Grid>

        {job.result && (
          <Grid xs={12}>
            <Typography variant="subtitle2" color="text.secondary">Result</Typography>
            <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: "#f8fafc" }}>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>{job.result}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
