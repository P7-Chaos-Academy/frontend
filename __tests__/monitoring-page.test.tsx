import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MonitoringPage from '@/app/(dashboard)/monitoring/page';
import * as metricsApi from '@/lib/api/metricsQuery';
import * as authContext from '@/contexts/AuthContext';
import * as clusterContext from '@/contexts/ClusterContext';
import { jest } from '@jest/globals';

jest.mock('@/lib/api/metricsQuery');
jest.mock('@/contexts/AuthContext');
jest.mock('@/contexts/ClusterContext');

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      replace: jest.fn(),
      push: jest.fn(),
    };
  },
}));

// Build a Prometheus-like instant vector response
function buildPrometheusVector(result: Array<{ name: string; instance: string; value: string }>) {
  return {
    status: 'success',
    data: {
      resultType: 'vector',
      result: result.map((r) => ({
        metric: { __name__: r.name, instance: r.instance, job: 'jetson-metrics' },
        value: [1765726703, r.value],
      })),
    },
  } as any;
}

const baseDataset = [
  { name: 'up', instance: '192.168.1.202:9100', value: '1' },
  { name: 'up', instance: '192.168.1.203:9100', value: '1' },
  { name: 'up', instance: '192.168.1.201:9100', value: '1' },
  { name: 'jetson_pom_5v_in_watts', instance: '192.168.1.201:9100', value: '1.034' },
  { name: 'jetson_pom_5v_in_watts', instance: '192.168.1.203:9100', value: '1.032' },
  { name: 'jetson_pom_5v_in_watts', instance: '192.168.1.202:9100', value: '1.034' },
  { name: 'jetson_cpu_temp', instance: '192.168.1.201:9100', value: '28' },
  { name: 'jetson_cpu_temp', instance: '192.168.1.203:9100', value: '27.5' },
  { name: 'jetson_cpu_temp', instance: '192.168.1.202:9100', value: '28.5' },
  { name: 'jetson_cpu_load_percent', instance: '192.168.1.201:9100', value: '7.6' },
  { name: 'jetson_cpu_load_percent', instance: '192.168.1.203:9100', value: '7.6' },
  { name: 'jetson_cpu_load_percent', instance: '192.168.1.202:9100', value: '1.3' },
  { name: 'jetson_gpu_load_percent', instance: '192.168.1.201:9100', value: '0' },
  { name: 'jetson_gpu_load_percent', instance: '192.168.1.203:9100', value: '0' },
  { name: 'jetson_gpu_load_percent', instance: '192.168.1.202:9100', value: '0' },
];

// Function to simulate one offline instance by setting its 'up' metric to 0
function withOfflineInstance(base: typeof baseDataset, offlineInstance: string) {
  const keep = base.filter((r) => r.instance !== offlineInstance || r.name === 'up');
  return keep.map((r) => (r.instance === offlineInstance && r.name === 'up' ? { ...r, value: '0' } : r));
}

describe('MonitoringPage - Metrics Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const actual = jest.requireActual<typeof import('@/lib/api/metricsQuery')>('@/lib/api/metricsQuery');
    (metricsApi.bundleByInstance as jest.MockedFunction<typeof metricsApi.bundleByInstance>).mockImplementation(actual.bundleByInstance);

    (authContext.useAuth as jest.Mock).mockReturnValue({
      user: { id: 'u1', email: 'user@example.com' },
      loading: false,
    });

    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: 1,
      loading: false,
      error: null,
    });
  });

  it('renders nodes and metrics when all nodes are online', async () => {
    const allOnline = buildPrometheusVector(baseDataset);
    (metricsApi.getMetricsQueryNotRange as unknown as jest.Mock<any>).mockResolvedValue(allOnline);

    render(<MonitoringPage />);

    await waitFor(() => {
      expect(screen.getByText('All Nodes Overview')).toBeInTheDocument();
      ['192.168.1.201:9100', '192.168.1.202:9100', '192.168.1.203:9100'].forEach((instance) => {
        const rowsWithInstance = screen.getAllByText(instance);
        // Node ID and Name is the same, so we check for at least 2 of each IP
        expect(rowsWithInstance.length).toBeGreaterThanOrEqual(2);
      });
    });

    await waitFor(() => {
      const statuses = screen.getAllByText('Online');
      expect(statuses.length).toBe(3);
    });

    await waitFor(() => {
      expect(screen.getAllByText('7.6%').length).toBeGreaterThan(0);
      expect(screen.getAllByText('0%').length).toBeGreaterThan(0);
      expect(screen.getAllByText('28°C').length).toBeGreaterThan(0);
      expect(screen.getAllByText('1.034 W').length).toBeGreaterThan(0);
    });
  });

  it('renders an offline node with N/A metrics when instance is down', async () => {
    const offlineInstance = '192.168.1.203:9100';
    const manipulated = withOfflineInstance(baseDataset, offlineInstance);
    const response = buildPrometheusVector(manipulated);
    (metricsApi.getMetricsQueryNotRange as unknown as jest.Mock<any>).mockResolvedValue(response);

    render(<MonitoringPage />);

    await waitFor(() => {
      const rowId = screen.getAllByText(offlineInstance)[0];
      expect(rowId).toBeInTheDocument();

      const offlineChip = screen.getByText('Offline');
      expect(offlineChip).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText('N/A%').length).toBeGreaterThan(0);
      expect(screen.getAllByText('N/A°C').length).toBeGreaterThan(0);
      expect(screen.getAllByText('N/A W').length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      const onlineChips = screen.getAllByText('Online');
      expect(onlineChips.length).toBe(2);
    });
  });
});
