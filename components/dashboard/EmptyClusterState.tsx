"use client";

import { Add as AddIcon, Storage as StorageIcon } from "@mui/icons-material";
import { Button, Paper, Typography } from "@mui/material";

interface EmptyClusterStateProps {
  onAddCluster: () => void;
}

export default function EmptyClusterState({ onAddCluster }: EmptyClusterStateProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px dashed rgba(15, 23, 42, 0.2)",
        backgroundColor: "#fafafa",
        textAlign: "center",
      }}
    >
      <StorageIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No clusters configured
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Add your first cluster to get started with monitoring and management.
      </Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={onAddCluster}>
        Add Cluster
      </Button>
    </Paper>
  );
}
