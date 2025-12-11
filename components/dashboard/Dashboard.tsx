"use client";

import { useCluster } from "@/contexts/ClusterContext";
import { Cluster, createCluster, deleteCluster, updateCluster } from "@/lib/api/clusters";
import { Add as AddIcon } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ClusterCard from "./ClusterCard";
import CreateClusterDialog from "./CreateClusterDialog";
import EditClusterDialog from "./EditClusterDialog";
import EmptyClusterState from "./EmptyClusterState";
import HeroBanner from "./HeroBanner";

export default function Dashboard() {
  const { clusters, loading, error, refetchClusters, selectedClusterId, setSelectedClusterId } =
    useCluster();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingCluster, setEditingCluster] = useState<Cluster | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDeleteCluster = async (e: React.MouseEvent, clusterId: number) => {
    e.stopPropagation();
    if (deletingId) return;

    try {
      setDeletingId(clusterId);
      await deleteCluster(clusterId);
      await refetchClusters();
    } catch (err) {
      console.error("Failed to delete cluster:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCreateCluster = async (data: Parameters<typeof createCluster>[0]) => {
    await createCluster(data);
    await refetchClusters();
  };

  const handleEditCluster = (e: React.MouseEvent, cluster: Cluster) => {
    e.stopPropagation();
    setEditingCluster(cluster);
  };

  const handleUpdateCluster = async (id: number, data: Parameters<typeof updateCluster>[1]) => {
    await updateCluster(id, data);
    await refetchClusters();
  };

  const renderClusterContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid rgba(211, 47, 47, 0.3)",
            backgroundColor: "rgba(211, 47, 47, 0.05)",
          }}
        >
          <Typography color="error">{error}</Typography>
        </Paper>
      );
    }

    if (clusters.length === 0) {
      return <EmptyClusterState onAddCluster={() => setCreateDialogOpen(true)} />;
    }

    return (
      <Grid container spacing={3}>
        {clusters.map((cluster) => (
          <Grid item xs={12} md={6} lg={4} key={cluster.id}>
            <ClusterCard
              cluster={cluster}
              isSelected={cluster.id === selectedClusterId}
              isDeleting={deletingId === cluster.id}
              onSelect={() => setSelectedClusterId(cluster.id)}
              onEdit={(e) => handleEditCluster(e, cluster)}
              onDelete={(e) => handleDeleteCluster(e, cluster.id)}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Stack spacing={4} sx={{ width: "100%" }}>
      <HeroBanner />

      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" fontWeight={600}>
            Clusters
          </Typography>
          <IconButton
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Stack>

        {renderClusterContent()}
      </Box>

      <CreateClusterDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateCluster}
      />

      <EditClusterDialog
        open={editingCluster !== null}
        cluster={editingCluster}
        onClose={() => setEditingCluster(null)}
        onSubmit={handleUpdateCluster}
      />
    </Stack>
  );
}
