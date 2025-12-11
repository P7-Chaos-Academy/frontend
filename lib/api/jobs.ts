import { PromptFormData } from "@/components/deployments/PromptInputForm";
import { apiFetch } from "./client";

interface JobPostResponse {
  jobDetails: {
    status: string;
    job_name: string;
    namespace: string;
    uid: string;
    creation_timestamp: string;
  };
  estimatedTimeRemainingSeconds: number;
}

export async function postJob(
  data: PromptFormData,
  clusterId: number,
): Promise<JobPostResponse> {
  return apiFetch<JobPostResponse>("/api/Job", {
    method: "POST",
    body: JSON.stringify({
      prompt: data.prompt,
      n_predict: data.tokenUsage,
      temperature: data.temperature,
      clusterId: clusterId,
    }),
  });
}

export interface JobStatus {
  job_name: string;
  status: "succeeded" | "failed" | "running" | "pending";
  node_name: string | null;
  namespace: string;
}

interface JobQueueResponse {
  jobs: JobStatus[];
}

export async function fetchJobQueue(
  clusterId: number,
): Promise<JobQueueResponse> {
  return apiFetch<JobQueueResponse>(
    `/api/Job/all-jobs?clusterId=${clusterId}`,
    {
      method: "GET",
    },
  );
}

export interface JobDetailsResponse {
  id: number;
  job_name: string;
  namespace: string;
  pod_name: string;
  node_name: string | null;
  status: "succeeded" | "failed" | "running" | "pending";
  prompt: string;
  result: string;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  duration_seconds: number | null;
  power_consumed_wh: number | null;
  token_count: number | null;
}

export async function fetchJobDetails(
  jobName: string,
  clusterId: number,
): Promise<JobDetailsResponse> {
  return apiFetch<JobDetailsResponse>(
    `/api/Job/jobId/${jobName}?clusterId=${clusterId}`,
    {
      method: "GET",
    },
  );
}
