"use client";

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from "@mui/material";
import { JobStatus } from "@/lib/api/jobs";
import { useRouter } from "next/navigation";

export interface QueueTableProps {
  readonly jobs: JobStatus[];
}

function getStatusColor(status: JobStatus["status"]): "success" | "error" | "info" | "warning" {
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

export default function QueueTable({ jobs }: QueueTableProps) {
  const router = useRouter();

  const handleRowClick = (jobName: string) => {
    router.push(`/deployments/queue/${jobName}`);
  };

  return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Job Name</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Node</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Namespace</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {jobs?.map((job) => (
                    <TableRow
                        key={job.job_name}
                        onClick={() => handleRowClick(job.job_name)}
                        sx={{ cursor: "pointer", "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" } }}
                    >
                        <TableCell>{job.job_name}</TableCell>
                        <TableCell>{job.node_name ?? "—"}</TableCell>
                        <TableCell>{job.namespace ?? "—"}</TableCell>
                        <TableCell>
                            <Chip
                                label={job.status}
                                color={getStatusColor(job.status)}
                                size="small"
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
  );
}