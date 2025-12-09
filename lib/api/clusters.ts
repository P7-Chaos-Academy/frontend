import { apiFetch } from "./client";

export interface Cluster {
    name: string;
    description: string;
    apiEndpoint: string;
    prometheusEndpoint: string;
    id: number;
    createdBy: number;
    createdAt: string;
    updatedBy: number;
    updatedAt: string;
    isDeleted: boolean;
}

export async function getClusters(): Promise<Cluster[]> {
    return apiFetch<Cluster[]>("/api/cluster/cluster", {
        method: "GET",
    });
}

export interface CreateClusterRequest {
    name: string;
    description: string;
    apiEndpoint: string;
    prometheusEndpoint: string;
}

export async function createCluster(data: CreateClusterRequest): Promise<void> {
    await apiFetch<string>("/api/cluster/cluster", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Accept": "text/plain",
        },
    });
}

export async function deleteCluster(id: number): Promise<void> {
    await apiFetch<string>(`/api/cluster/cluster/${id}`, {
        method: "DELETE",
    });
}