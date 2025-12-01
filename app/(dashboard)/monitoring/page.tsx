"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import TableMapper from "@/components/monitoring/TableMapper";
import HeaderCard from "@/components/monitoring/HeaderCard";

export default function MonitoringPage() {
  const { user, loading } = useAuth();
  const router: AppRouterInstance = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <Stack spacing={4}>
      <HeaderCard />
      <TableMapper />
    </Stack>
  );
}
