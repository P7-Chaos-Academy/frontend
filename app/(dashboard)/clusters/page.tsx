'use client';

import { Box, Grid, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ClustersPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #38bdf8 0%, #0ea5e9 45%, #2563eb 100%)',
          color: '#f8fafc',
          boxShadow: '0 35px 65px rgba(14, 165, 233, 0.28)'
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            Fleet management
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Cluster visibility is on the horizon
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            This workspace will chart every distributed cluster under Strato control—topology, workloads,
            health, and actionable runbooks.
          </Typography>
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Planned telemetry
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: 'text.secondary', mb: 0 }}>
              <li>Cluster uptime, SLA tracking, and noisy-node alerts.</li>
              <li>Capacity dashboards with autoscale recommendations.</li>
              <li>Deployment history and drift detection.</li>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 45px rgba(15, 23, 42, 0.06)'
            }}
          >
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Automation roadmap
            </Typography>
            <Box component="ul" sx={{ pl: 3, color: 'text.secondary', mb: 0 }}>
              <li>Rolling upgrades with workload safety checks.</li>
              <li>Workload migration when hardware degradation is detected.</li>
              <li>Self-healing primitives for quorum recovery.</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
}
