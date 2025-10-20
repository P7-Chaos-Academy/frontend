'use client';

import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Link from 'next/link';
import type { Test } from '@/lib/api/tests';

type Props = {
  health: string;
  tests: Test[];
  swaggerUrl: string;
  errors?: string[];
};

export default function Dashboard({ health, tests, swaggerUrl, errors = [] }: Props) {
  const isHealthy = health.toLowerCase() === 'ok';

  return (
    <Stack spacing={4}
      sx={{
        width: '100%'
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: 'radial-gradient(circle at top left, #60a5fa 0%, #2563eb 40%, #1e40af 100%)',
          color: '#f8fafc',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 35px 65px rgba(30, 64, 175, 0.35)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25) 0%, transparent 55%)',
            pointerEvents: 'none'
          }}
        />
        <Stack spacing={3} sx={{ position: 'relative' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} justifyContent="space-between">
            <Box>
              <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                Distributed operations
              </Typography>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Welcome to the Strato control plane
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Observe cluster posture at a glance, drill into workloads, and prepare automation for your edge fleet.
              </Typography>
            </Box>
            <Stack direction="column" spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Health endpoint status
              </Typography>
              <Chip
                label={isHealthy ? 'Operational' : health}
                color={isHealthy ? 'success' : 'warning'}
                variant="filled"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Responded: {health}
              </Typography>
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              href={swaggerUrl}
              variant="contained"
              color="secondary"
              sx={{
                color: '#0f172a',
                backgroundColor: '#f8fafc',
                '&:hover': { backgroundColor: '#e2e8f0' },
                fontWeight: 600
              }}
            >
              Explore API documentation
            </Button>
            <Button
              component={Link}
              href="/clusters"
              variant="outlined"
              color="inherit"
              sx={{
                borderColor: 'rgba(248, 250, 252, 0.4)',
                color: '#f8fafc',
                '&:hover': { borderColor: '#f8fafc' }
              }}
            >
              Review cluster plans
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {errors.map((message) => (
        <Alert key={message} severity="error">
          {message}
        </Alert>
      ))}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: '#ffffff',
              boxShadow: '0 24px 50px rgba(15, 23, 42, 0.06)'
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
              <Box>
                <Typography variant="h5" fontWeight={600}>
                  API connectivity test
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Results from `/api/test`
                </Typography>
              </Box>
              <Chip
                label={`${tests.length} records`}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} sx={{ textAlign: 'center', py: 4 }}>
                      No test records found. Seed the database from the backend to see data here.
                    </TableCell>
                  </TableRow>
                ) : (
                  tests.map((test) => (
                    <TableRow key={test.id}>
                      <TableCell>{test.id}</TableCell>
                      <TableCell>{test.name}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                backgroundColor: '#ffffff',
                boxShadow: '0 24px 50px rgba(15, 23, 42, 0.06)'
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Cluster posture snapshot
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Plug in metrics from your orchestration layer to populate trends on cluster uptime, capacity, and SLA adherence.
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Next sync window
                  </Typography>
                  <Chip label="Waiting for telemetry" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Automation status
                  </Typography>
                  <Chip label="Stubbed" size="small" color="warning" />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Target release
                  </Typography>
                  <Chip label="v0.2 roadmap" size="small" color="primary" variant="outlined" />
                </Box>
              </Stack>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                backgroundColor: '#ffffff',
                boxShadow: '0 24px 50px rgba(15, 23, 42, 0.06)'
              }}
            >
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Up next
              </Typography>
              <Box component="ul" sx={{ pl: 3, mb: 0, color: 'text.secondary' }}>
                <li>Wire the login flow to the real `strato-api` authentication endpoints.</li>
                <li>Surface distributed cluster inventory with live health scores.</li>
                <li>Trigger orchestration tasks (scale, repair, drain) directly from this console.</li>
              </Box>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
