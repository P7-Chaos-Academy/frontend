"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getTests, type Test } from "@/lib/api/tests";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function TestsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tests, setTests] = useState<Test[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || loading) {
      return;
    }

    let active = true;

    const fetchTests = async () => {
      try {
        const response = await getTests();
        if (active) {
          setTests(response);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError("Unable to fetch tests. Check the `/api/test` endpoint.");
        }
      }
    };

    fetchTests();

    return () => {
      active = false;
    };
  }, [user, loading]);

  if (loading || !user) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #a855f7 0%, #7c3aed 45%, #5b21b6 100%)",
          color: "#f8fafc",
          boxShadow: "0 35px 65px rgba(124, 58, 237, 0.32)",
        }}
      >
        <Stack spacing={1.5}>
          <Typography variant="overline" sx={{ letterSpacing: 2 }}>
            API verification
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            Test datasets sourced from the backend
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.85 }}>
            Use this space to validate CRUD operations, schema migrations, and
            seed data for the Strato platform.
          </Typography>
        </Stack>
      </Paper>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          backgroundColor: "#ffffff",
          boxShadow: "0 24px 50px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Box>
            <Typography variant="h5" fontWeight={600}>
              Records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pulled from `/api/test`
            </Typography>
          </Box>
          <Chip
            label={`${tests.length} rows`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell width="20%">ID</TableCell>
              <TableCell>Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} sx={{ textAlign: "center", py: 4 }}>
                  No test records found. Seed the database from the backend to
                  see data here.
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
    </Stack>
  );
}
