'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/Dashboard';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { getHealth } from '@/lib/api/health';
import { getTests, type Test } from '@/lib/api/tests';
import { API_BASE_URL } from '@/lib/api/client';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

export default function OverviewPage() {
  const [health, setHealth] = useState('Checking...');
  const [tests, setTests] = useState<Test[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    let active = true;
    if (!isAuthenticated || isLoading) {
      return undefined;
    }

    const fetchData = async () => {
      const collectedErrors: string[] = [];

      try {
        const healthResponse = await getHealth();
        if (active) {
          setHealth(healthResponse);
        }
      } catch (error) {
        collectedErrors.push('Unable to reach the health endpoint. Is the backend running?');
        if (active) {
          setHealth('Unavailable');
        }
      }

      try {
        const testsResponse = await getTests();
        if (active) {
          setTests(testsResponse);
        }
      } catch (error) {
        collectedErrors.push('Unable to fetch tests. Check the `/api/test` endpoint.');
        if (active) {
          setTests([]);
        }
      }

      if (active) {
        setErrors(collectedErrors);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, [isAuthenticated, isLoading]);

  const swaggerUrl = `${API_BASE_URL.replace(/\/?api$/, '')}/swagger/index.html`;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <CircularProgress size={24} />
          <Typography variant="body2" color="text.secondary">
            Restoring your session…
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <Dashboard health={health} tests={tests} swaggerUrl={swaggerUrl} errors={errors} />;
}
