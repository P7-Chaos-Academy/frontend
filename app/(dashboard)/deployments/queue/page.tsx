"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import QueueTable from "@/components/deployments/QueueTable";
import { fetchJobQueue, JobStatus } from "@/lib/api/jobs";

export default function QueuePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobStatus[]>([]);

  useEffect(() => {
    fetchJobQueue().then((data) => {
      setJobs(data.jobs);
    });
  }, []);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid rgba(15, 23, 42, 0.08)", backgroundColor: "#ffffff", boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)" }}>
      <QueueTable jobs={jobs} />
    </Paper>
  );
}
