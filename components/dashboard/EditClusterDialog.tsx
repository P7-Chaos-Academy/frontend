"use client";

import { Cluster, UpdateClusterRequest } from "@/lib/api/clusters";
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
import React, { useEffect, useState } from "react";

interface EditClusterDialogProps {
  open: boolean;
  cluster: Cluster | null;
  onClose: () => void;
  onSubmit: (id: number, data: UpdateClusterRequest) => Promise<void>;
}

export default function EditClusterDialog({
  open,
  cluster,
  onClose,
  onSubmit,
}: EditClusterDialogProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpdateClusterRequest>({
    name: "",
    description: "",
    apiEndpoint: "",
    prometheusEndpoint: "",
  });

  useEffect(() => {
    if (cluster) {
      setFormData({
        name: cluster.name,
        description: cluster.description,
        apiEndpoint: cluster.apiEndpoint,
        prometheusEndpoint: cluster.prometheusEndpoint,
      });
    }
  }, [cluster]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!cluster) return;

    try {
      setSaving(true);
      setError(null);
      await onSubmit(cluster.id, formData);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update cluster");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Cluster</DialogTitle>
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
        <Button onClick={handleClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving || !formData.name || !formData.apiEndpoint}
        >
          {saving ? <CircularProgress size={20} /> : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
