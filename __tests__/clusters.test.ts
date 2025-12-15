import * as client from "../lib/api/client";
import {
  getClusters,
  createCluster,
  deleteCluster,
  updateCluster,
  type CreateClusterRequest,
  type UpdateClusterRequest,
} from "../lib/api/clusters";

describe("clusters api", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    (global as any).fetch = jest.fn();
    jest.spyOn(client, "apiFetch");
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("getClusters calls GET on clusters endpoint and returns data", async () => {
    const clusters = [
      {
        name: "c1",
        description: "d1",
        apiEndpoint: "http://api",
        prometheusEndpoint: "http://prom",
        id: 1,
        createdBy: 1,
        createdAt: "2025-01-01",
        updatedBy: 1,
        updatedAt: "2025-01-01",
        isDeleted: false,
      },
    ];

    (client.apiFetch as jest.Mock).mockResolvedValue(clusters);

    const result = await getClusters();

    expect(client.apiFetch).toHaveBeenCalledWith("/api/cluster/cluster", {
      method: "GET",
    });
    expect(result).toEqual(clusters);
  });

  it("createCluster posts JSON body with Accept text/plain", async () => {
    (client.apiFetch as jest.Mock).mockResolvedValue("ok");

    const payload: CreateClusterRequest = {
      name: "name",
      description: "desc",
      apiEndpoint: "http://api",
      prometheusEndpoint: "http://prom",
    };

    await createCluster(payload);

    const call = (client.apiFetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("/api/cluster/cluster");
    expect(call[1]).toEqual(
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Accept: "text/plain" }),
      }),
    );

    const body = call[1].body as string;
    expect(() => JSON.parse(body)).not.toThrow();
    expect(JSON.parse(body)).toEqual(payload);
  });

  it("deleteCluster sends DELETE to the resource URL", async () => {
    (client.apiFetch as jest.Mock).mockResolvedValue("ok");
    await deleteCluster(42);
    expect(client.apiFetch).toHaveBeenCalledWith("/api/cluster/cluster/42", {
      method: "DELETE",
    });
  });

  it("updateCluster sends PUT with serialized body", async () => {
    (client.apiFetch as jest.Mock).mockResolvedValue("ok");
    const payload: UpdateClusterRequest = {
      name: "n",
      description: "d",
      apiEndpoint: "http://api",
      prometheusEndpoint: "http://prom",
    };
    await updateCluster(7, payload);

    const call = (client.apiFetch as jest.Mock).mock.calls[0];
    expect(call[0]).toBe("/api/cluster/cluster/7");
    expect(call[1]).toEqual(
      expect.objectContaining({
        method: "PUT",
      }),
    );
    const body = call[1].body as string;
    expect(JSON.parse(body)).toEqual(payload);
  });
});
