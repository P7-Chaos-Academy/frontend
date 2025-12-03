"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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

  useEffect(() => {
    setJobs([
      {
        id: "job-1",
        type: "LLM Query – Type A",
        node: "Node-03",
        submittedAt: "2025-05-12 14:02",
        status: "Pending"
      },
      {
        id: "job-2",
        type: "LLM Query – Type B",
        node: "Node-07",
        submittedAt: "2025-05-12 13:47",
        status: "Running"
      },
      {
        id: "job-3",
        type: "LLM Query – Type C",
        node: "Node-02",
        submittedAt: "2025-05-12 13:10",
        status: "Failed"
      }
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
          boxShadow: "0 35px 65px rgba(14, 165, 233, 0.28)"
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

      {/* TABLE VERSION OF QUEUE */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 25px 60px rgba(15, 23, 42, 0.06)",
          p: 2,
        }}
      >
        <TableContainer
          sx={{
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              "@keyframes fadeInUp": {
                from: { opacity: 0, transform: "translateY(10px)" },
                to: { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
          <Table
             sx={{
              "& th": {
                py: 2.2,
                px: 2.5,          
                textAlign: "left",
                fontWeight: 700,
                color: "rgba(15, 23, 42, 0.8)",
              },

              "& td": {
                py: 2.2,
                px: 2.5,          
                textAlign: "left",
              },

              "& th:last-child, & td:last-child": {
                textAlign: "center",
                width: "120px",
              },

              "& tbody tr:hover": {
                backgroundColor: "rgba(148, 163, 184, 0.08)", // soft slate hover
                transition: "background-color 0.2s ease",
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  "& th": {
                    fontWeight: 700,
                    backgroundColor: "rgba(15, 23, 42, 0.03)"
                  }
                }}
              >
                <TableCell>#</TableCell>
                <TableCell>Job Type</TableCell>
                <TableCell>Node</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {jobs.map((job, index) => (
                <TableRow key={job.id}>
                  {/* Numbering */}
                  <TableCell
                    sx={{ width: 50, fontWeight: 600, opacity: 0.7 }}
                  >{`#${index + 1}`}</TableCell>

                  {/* Job Type */}
                  <TableCell sx={{ fontWeight: 600 }}>{job.type}</TableCell>

                  {/* Node */}
                  <TableCell>{job.node}</TableCell>

                  {/* Submitted */}
                  <TableCell>{job.submittedAt}</TableCell>

                  {/* Status chip */}
                  <TableCell>
                    <Chip
                      label={job.status}
                      sx={{
                        fontWeight: 600,
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
                            : "#ef4444"
                      }}
                    />
                  </TableCell>

                  {/* Cancel button */}
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        setJobs(prev => prev.filter(j => j.id !== job.id))
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        px: 2,
                        py: 0.8
                      }}
                    >
                      <DeleteOutlineIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ opacity: 0.7 }}>
                      No jobs in queue.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </Box>
        </TableContainer>
      </Paper>
    </Stack>
  );
}
