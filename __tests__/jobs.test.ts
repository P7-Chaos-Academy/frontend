import * as client from "../lib/api/client";
import {
  postJob,
  fetchJobQueue,
  fetchJobDetails,
  type JobStatus,
  type JobDetailsResponse,
} from "../lib/api/jobs";

describe("jobs api", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(client, "apiFetch");
    (client.apiFetch as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("postJob serializes PromptFormData and posts to /api/Job", async () => {
    const mockResponse = {
      jobDetails: {
        status: "running",
        job_name: "job-1",
        namespace: "ns",
        uid: "uid-123",
        creation_timestamp: "2025-01-01T00:00:00Z",
      },
      estimatedTimeRemainingSeconds: 12,
    };
    (client.apiFetch as jest.Mock).mockResolvedValue(mockResponse);

    const formData = {
      prompt: "Hello",
      tokenUsage: 64,
      temperature: 0.7,
    };

    const result = await postJob(formData as any, 5);

    const call = (client.apiFetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("/api/Job");
    expect(call[1]).toEqual(
      expect.objectContaining({
        method: "POST",
      }),
    );
    const body = call[1].body as string;
    expect(JSON.parse(body)).toEqual({
      prompt: "Hello",
      n_predict: 64,
      temperature: 0.7,
      clusterId: 5,
    });
    expect(result).toBe(mockResponse);
  });

  it("fetchJobQueue requests GET to /api/Job/all-jobs with clusterId", async () => {
    const mockQueue: { jobs: JobStatus[] } = {
      jobs: [
        { job_name: "job-1", status: "running", node_name: null, namespace: "ns" },
      ],
    };
    (client.apiFetch as jest.Mock).mockResolvedValue(mockQueue);

    const result = await fetchJobQueue(9);
    expect(client.apiFetch).toHaveBeenCalledWith(
      "/api/Job/all-jobs?clusterId=9",
      { method: "GET" },
    );
    expect(result).toEqual(mockQueue);
  });

  it("fetchJobDetails requests GET to /api/Job/jobId/{name} with clusterId", async () => {
    const mockDetails: JobDetailsResponse = {
      id: 1,
      job_name: "job-xyz",
      namespace: "ns",
      pod_name: "pod-1",
      node_name: null,
      status: "succeeded",
      prompt: "p",
      result: "r",
      created_at: "2025-01-01T00:00:00Z",
      started_at: "2025-01-01T00:00:01Z",
      completed_at: "2025-01-01T00:00:02Z",
      duration_seconds: 1,
      power_consumed_wh: null,
      token_count: 123,
    };
    (client.apiFetch as jest.Mock).mockResolvedValue(mockDetails);

    const result = await fetchJobDetails("job-xyz", 4);
    expect(client.apiFetch).toHaveBeenCalledWith(
      "/api/Job/jobId/job-xyz?clusterId=4",
      { method: "GET" },
    );
    expect(result).toEqual(mockDetails);
  });
});
