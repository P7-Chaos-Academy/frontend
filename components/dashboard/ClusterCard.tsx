"use client";

import { Cluster } from "@/lib/api/clusters";
import {
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface ClusterCardProps {
  cluster: Cluster;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function ClusterCard({
  cluster,
  isSelected,
  isDeleting,
  onSelect,
  onEdit,
  onDelete,
}: ClusterCardProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    setDeleteConfirmOpen(false);
    onDelete(e);
  };
  return (
    <Paper
      elevation={0}
      onClick={onSelect}
      sx={{
        p: 3,
        borderRadius: 3,
        border: isSelected ? "2px solid" : "1px solid rgba(15, 23, 42, 0.08)",
        borderColor: isSelected ? "primary.main" : undefined,
        backgroundColor: isSelected ? "rgba(37, 99, 235, 0.04)" : "#ffffff",
        boxShadow: isSelected
          ? "0 24px 50px rgba(37, 99, 235, 0.15)"
          : "0 24px 50px rgba(15, 23, 42, 0.06)",
        height: "100%",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          borderColor: isSelected ? "primary.main" : "rgba(15, 23, 42, 0.2)",
          boxShadow: "0 24px 50px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={600}>
                {cluster.name}
              </Typography>
              {isSelected && <CheckCircleIcon color="primary" fontSize="small" />}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {cluster.description}
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Chip
              label={isSelected ? "Selected" : "Select"}
              size="small"
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
            />
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(37, 99, 235, 0.08)",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "error.main",
                  backgroundColor: "rgba(211, 47, 47, 0.08)",
                },
              }}
            >
              {isDeleting ? (
                <CircularProgress size={18} />
              ) : (
                <DeleteIcon fontSize="small" />
              )}
            </IconButton>
          </Stack>
        </Stack>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            API Endpoint
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {cluster.apiEndpoint}
          </Typography>
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" display="block">
            Prometheus Endpoint
          </Typography>
          <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
            {cluster.prometheusEndpoint}
          </Typography>
        </Box>
      </Stack>

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Delete Cluster</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the cluster "<strong>{cluster.name}</strong>"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
