"use client";

import { CreateClusterRequest } from "@/lib/api/clusters";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

interface CreateClusterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClusterRequest) => Promise<void>;
}

export default function CreateClusterDialog({
  open,
  onClose,
  onSubmit,
}: CreateClusterDialogProps) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateClusterRequest>({
    name: "",
    description: "",
    apiEndpoint: "",
    prometheusEndpoint: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setCreating(true);
      setError(null);
      await onSubmit(formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create cluster");
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      apiEndpoint: "",
      prometheusEndpoint: "",
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Cluster</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="API Endpoint"
            name="apiEndpoint"
            value={formData.apiEndpoint}
            onChange={handleInputChange}
            fullWidth
            required
            placeholder="http://cluster-api:8080/v1/"
          />
          <TextField
            label="Prometheus Endpoint"
            name="prometheusEndpoint"
            value={formData.prometheusEndpoint}
            onChange={handleInputChange}
            fullWidth
            placeholder="http://prometheus:9090/"
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={creating}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={creating || !formData.name || !formData.apiEndpoint}
        >
          {creating ? <CircularProgress size={20} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
