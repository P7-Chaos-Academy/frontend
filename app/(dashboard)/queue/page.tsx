"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useCluster } from "@/contexts/ClusterContext";
import { Paper, CircularProgress, Box, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QueueTable from "@/components/deployments/QueueTable";
import { fetchJobQueue, JobStatus } from "@/lib/api/jobs";

export default function QueuePage() {
  const { user, loading } = useAuth();
  const { selectedClusterId, loading: clusterLoading, error: clusterError } = useCluster();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobStatus[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    if (!selectedClusterId) return;

    setJobsLoading(true);
    fetchJobQueue(selectedClusterId)
      .then((data) => {
        setJobs(data.jobs);
      })
      .finally(() => {
        setJobsLoading(false);
      });
  }, [selectedClusterId]);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  if (clusterLoading || jobsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (clusterError || !selectedClusterId) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">
          {clusterError || "No cluster selected"}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)", backgroundColor: "#ffffff", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)" }}>
      <QueueTable jobs={jobs} />
    </Paper>
  );
}
