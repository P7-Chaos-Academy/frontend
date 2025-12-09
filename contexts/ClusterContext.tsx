"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Cluster, getClusters } from "@/lib/api/clusters";

const STORAGE_KEY = "selectedClusterId";

interface ClusterContextType {
  clusters: Cluster[];
  selectedClusterId: number | null;
  selectedCluster: Cluster | null;
  setSelectedClusterId: (id: number) => void;
  loading: boolean;
  error: string | null;
  refetchClusters: () => Promise<void>;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export function ClusterProvider({ children }: { children: React.ReactNode }) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedClusterId, setSelectedClusterIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchClusters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedClusters = await getClusters();
      setClusters(fetchedClusters);

      // If we have clusters and no selection, select the first one
      if (fetchedClusters.length > 0) {
        const storedId = localStorage.getItem(STORAGE_KEY);
        const parsedId = storedId ? parseInt(storedId, 10) : null;

        // Check if stored ID exists in fetched clusters
        const storedClusterExists = parsedId && fetchedClusters.some(c => c.id === parsedId);

        if (storedClusterExists) {
          setSelectedClusterIdState(parsedId);
        } else {
          // Default to first cluster
          setSelectedClusterIdState(fetchedClusters[0].id);
          localStorage.setItem(STORAGE_KEY, fetchedClusters[0].id.toString());
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch clusters");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    fetchClusters();
  }, [mounted, fetchClusters]);

  const setSelectedClusterId = (id: number) => {
    setSelectedClusterIdState(id);
    localStorage.setItem(STORAGE_KEY, id.toString());
  };

  const selectedCluster = clusters.find(c => c.id === selectedClusterId) ?? null;

  return (
    <ClusterContext.Provider
      value={{
        clusters,
        selectedClusterId,
        selectedCluster,
        setSelectedClusterId,
        loading,
        error,
        refetchClusters: fetchClusters,
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
}

export function useCluster() {
  const context = useContext(ClusterContext);
  if (context === undefined) {
    throw new Error("useCluster must be used within a ClusterProvider");
  }
  return context;
}
