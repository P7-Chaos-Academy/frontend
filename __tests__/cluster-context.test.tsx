import { jest } from '@jest/globals';
import { act, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ClusterProvider, useCluster } from '@/contexts/ClusterContext';
import { getClusters, type Cluster } from '@/lib/api/clusters';

type ClusterValue = ReturnType<typeof useCluster>;

jest.mock('@/lib/api/clusters', () => ({
  getClusters: jest.fn(),
}));

describe('ClusterContext', () => {
  const mockGetClusters = getClusters as jest.MockedFunction<typeof getClusters>;
  let latestCluster: ClusterValue | null = null;

  const renderWithProvider = () =>
    render(
      <ClusterProvider>
        <ClusterConsumer />
      </ClusterProvider>
    );

  function ClusterConsumer() {
    const value = useCluster();
    latestCluster = value;
    return null;
  }

  const clusterA: Cluster = {
    id: 1,
    name: 'A',
    description: 'a',
    apiEndpoint: 'api-a',
    prometheusEndpoint: 'prom-a',
    createdBy: 1,
    createdAt: 'now',
    updatedBy: 1,
    updatedAt: 'now',
    isDeleted: false,
  };

  const clusterB: Cluster = {
    id: 2,
    name: 'B',
    description: 'b',
    apiEndpoint: 'api-b',
    prometheusEndpoint: 'prom-b',
    createdBy: 2,
    createdAt: 'now',
    updatedBy: 2,
    updatedAt: 'now',
    isDeleted: false,
  };

  beforeEach(() => {
    latestCluster = null;
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('throws when useCluster is used outside provider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const Outside = () => {
      useCluster();
      return null;
    };

    expect(() => render(<Outside />)).toThrow('useCluster must be used within a ClusterProvider');
    consoleErrorSpy.mockRestore();
  });

  it('loads clusters and selects the first when no stored id', async () => {
    mockGetClusters.mockResolvedValue([clusterA, clusterB]);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    renderWithProvider();

    await waitFor(() => {
      expect(latestCluster?.loading).toBe(false);
      expect(latestCluster?.clusters).toHaveLength(2);
    });

    expect(latestCluster?.selectedClusterId).toBe(clusterA.id);
    expect(latestCluster?.selectedCluster).toEqual(clusterA);
    expect(setItemSpy).toHaveBeenCalledWith('selectedClusterId', clusterA.id.toString());
  });

  it('restores stored cluster when it exists', async () => {
    localStorage.setItem('selectedClusterId', clusterB.id.toString());
    mockGetClusters.mockResolvedValue([clusterA, clusterB]);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    renderWithProvider();

    await waitFor(() => {
      expect(latestCluster?.loading).toBe(false);
      expect(latestCluster?.selectedClusterId).toBe(clusterB.id);
    });

    expect(latestCluster?.selectedCluster).toEqual(clusterB);
    expect(setItemSpy).not.toHaveBeenCalledWith(
      'selectedClusterId',
      clusterA.id.toString(),
    );
  });

  it('defaults to first cluster when stored id is invalid', async () => {
    localStorage.setItem('selectedClusterId', '999');
    mockGetClusters.mockResolvedValue([clusterA, clusterB]);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    renderWithProvider();

    await waitFor(() => {
      expect(latestCluster?.loading).toBe(false);
    });

    expect(latestCluster?.selectedClusterId).toBe(clusterA.id);
    expect(setItemSpy).toHaveBeenCalledWith('selectedClusterId', clusterA.id.toString());
  });

  it('updates selection and localStorage when setSelectedClusterId is called', async () => {
    mockGetClusters.mockResolvedValue([clusterA, clusterB]);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    renderWithProvider();

    await waitFor(() => expect(latestCluster?.loading).toBe(false));

    await act(async () => {
      latestCluster?.setSelectedClusterId(clusterB.id);
    });

    expect(latestCluster?.selectedClusterId).toBe(clusterB.id);
    expect(latestCluster?.selectedCluster).toEqual(clusterB);
    expect(setItemSpy).toHaveBeenCalledWith('selectedClusterId', clusterB.id.toString());
  });

  it('surfaces fetch errors and stops loading', async () => {
    mockGetClusters.mockRejectedValue(new Error('fetch failed'));

    renderWithProvider();

    await waitFor(() => {
      expect(latestCluster?.loading).toBe(false);
      expect(latestCluster?.error).toBe('fetch failed');
    });

    expect(latestCluster?.clusters).toEqual([]);
  });

  it('refetches clusters and clears previous error', async () => {
    mockGetClusters.mockRejectedValueOnce(new Error('network'));
    mockGetClusters.mockResolvedValueOnce([clusterA]);

    renderWithProvider();

    await waitFor(() => expect(latestCluster?.loading).toBe(false));
    expect(latestCluster?.error).toBe('network');

    await act(async () => {
      await latestCluster?.refetchClusters();
    });

    await waitFor(() => {
      expect(latestCluster?.loading).toBe(false);
      expect(latestCluster?.clusters).toEqual([clusterA]);
    });

    expect(latestCluster?.error).toBeNull();
  });
});
