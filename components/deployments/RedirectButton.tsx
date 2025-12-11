"use client";

import { Button, Stack } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export default function RedirectButton() {
  const router: AppRouterInstance = useRouter();

return(<Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/deployments/jobs")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
          }}
        >
          Go to Jobs
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/deployments/queue")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            px: 4,
          }}
        >
          Go to Queue
        </Button>
    </Stack>)
}