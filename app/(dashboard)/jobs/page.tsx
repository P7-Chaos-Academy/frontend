"use client";

import PromptInputForm, { PromptFormData } from "@/components/deployments/PromptInputForm";
import { useAuth } from "@/contexts/AuthContext";
import { useCluster } from "@/contexts/ClusterContext";
import { postJob } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

export default function JobsPage() {
  const { user, loading } = useAuth();
  const { selectedClusterId, loading: clusterLoading, error: clusterError } = useCluster();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  if (clusterLoading) {
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

  const handlePromptSubmit = async (data: PromptFormData) => {
    try {
      const response = await postJob(data, selectedClusterId);
      router.push(`/queue/${response.jobDetails.job_name}`);
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div>
      <PromptInputForm onSubmit={handlePromptSubmit} />
    </div>
  );
}
