import { render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NodeDetailPage from '@/app/(dashboard)/monitoring/[nodeID]/page';
import * as clusterContext from '@/contexts/ClusterContext';
import * as metricsApi from '@/lib/api/metricsQuery';
import * as metricTypeApi from '@/lib/api/metricType';
import { jest } from '@jest/globals';
import type { PrometheusMatrixResponse } from '@/models/prometheusMetrics';

jest.mock('@/contexts/ClusterContext');
jest.mock('@/lib/api/metricsQuery');
jest.mock('@/lib/api/metricType');

jest.mock('next/navigation', () => ({
  useParams: () => ({ nodeID: encodeURIComponent('192.168.1.201:9100') }),
}));

// Mock recharts ResponsiveContainer to avoid width/height issues in jsdom
jest.mock('recharts', () => {
  const React = require('react');
  const Stub: React.FC<any> = ({ children }: any) => <div>{children}</div>;
  const Responsive: React.FC<any> = ({ width = 800, height = 300, children }: any) => (
    <div style={{ width, height }}>{children}</div>
  );
  return {
    LineChart: Stub,
    Line: Stub,
    XAxis: Stub,
    YAxis: Stub,
    Tooltip: Stub,
    ResponsiveContainer: Responsive,
  };
});

function buildMatrixResponse(series: Array<{ name: string; points: Array<[number, string]> }>) {
  return {
    status: 'success',
    data: {
      resultType: 'matrix',
      result: series.map((s) => ({
        metric: { __name__: s.name, instance: '192.168.1.201:9100', job: 'jetson-metrics' } as any,
        values: s.points,
      })),
    },
  } as any;
}

const mockMetricTypes: metricTypeApi.MetricType[] = [
  { id: 2, name: 'CPU Load', description: '', unit: '%', prometheusIdentifier: 'jetson_cpu_load_percent', checked: true },
  { id: 4, name: 'GPU Load', description: '', unit: '%', prometheusIdentifier: 'jetson_gpu_load_percent', checked: true },
  { id: 5, name: 'CPU Temp', description: '', unit: '°C', prometheusIdentifier: 'jetson_cpu_temp', checked: true },
];

describe('NodeDetailPage', () => {
  const originalError = console.error;

  beforeAll(() => {
    // Suppress React act() warnings during tests
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('Warning: An update to') &&
        message.includes('inside a test was not wrapped in act')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    console.error = originalError;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-01T00:30:00Z'));

    (clusterContext.useCluster as jest.Mock).mockReturnValue({
      selectedClusterId: 1,
      loading: false,
      error: null,
    });

    (metricTypeApi.getMetricTypes as jest.MockedFunction<typeof metricTypeApi.getMetricTypes>).mockResolvedValue(mockMetricTypes);

    const matrix: PrometheusMatrixResponse = buildMatrixResponse([
      { name: 'jetson_cpu_load_percent', points: [ [1704068400, '12.3'], [1704068460, '15.1'] ] },
      { name: 'jetson_gpu_load_percent', points: [ [1704068400, '7.0'], [1704068460, '9.5'] ] },
      { name: 'jetson_cpu_temp', points: [ [1704068400, '40'], [1704068460, '41.5'] ] },
    ]);
    (metricsApi.getMetricsQuery as jest.MockedFunction<typeof metricsApi.getMetricsQuery>).mockResolvedValue(matrix);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders charts for selected metrics', async () => {
    render(<NodeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Node 192.168.1.201:9100 — Metrics Overview')).toBeInTheDocument();
    });

    expect(screen.getAllByText('CPU Load (%)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('GPU Load (%)').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('CPU Temp (°C)').length).toBeGreaterThanOrEqual(1);

    await waitFor(() => {
      expect(metricsApi.getMetricsQuery).toHaveBeenCalled();
    });

    const calls1 = (metricsApi.getMetricsQuery as jest.MockedFunction<typeof metricsApi.getMetricsQuery>).mock.calls;
    const call = calls1[calls1.length - 1]!;
    const [metricIds, startDate, endDate, step, instance, clusterId] = call;

    expect(metricIds).toEqual([2, 4, 5]);
    expect(step).toBe('2m');
    expect(instance).toBe('192.168.1.201:9100');
    expect(clusterId).toBe(1);

    expect((endDate as Date).toISOString()).toBe('2024-01-01T00:30:00.000Z');
    expect((startDate as Date).toISOString()).toBe('2024-01-01T00:00:00.000Z');
  });

  it('allows toggling metrics to hide all charts', async () => {
    render(<NodeDetailPage />);

    await waitFor(() => {
      expect(screen.getByText('Select Metrics')).toBeInTheDocument();
    });

    // Uncheck all metrics
    for (const mt of mockMetricTypes) {
      const label = `${mt.name}${mt.unit ? ` (${mt.unit})` : ''}`;
      const checkbox = screen.getByLabelText(label);
      if ((checkbox as HTMLInputElement).checked) {
        fireEvent.click(checkbox);
      }
    }

    expect(
      screen.getByText('Select at least one metric to display charts')
    ).toBeInTheDocument();
  });

  it('updates query when changing Step and Time Range', async () => {
    render(<NodeDetailPage />);

    await waitFor(() => {
      // Two sliders present: first is Step (1-5), second is Time Range (10-60)
      expect(screen.getAllByRole('slider').length).toBeGreaterThanOrEqual(2);
    });

    const sliders = screen.getAllByRole('slider') as HTMLInputElement[];
    const stepInput = sliders[0];
    const rangeInput = sliders[1];

    fireEvent.change(stepInput, { target: { value: '5' } });

    fireEvent.change(rangeInput, { target: { value: '60' } });

    await waitFor(() => {
      expect((metricsApi.getMetricsQuery as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(3);
    });

    const calls2 = (metricsApi.getMetricsQuery as jest.MockedFunction<typeof metricsApi.getMetricsQuery>).mock.calls;
    const last = calls2[calls2.length - 1]!;
    const [metricIds, startDate, endDate, step] = last;

    expect(metricIds).toEqual([2, 4, 5]);
    expect(step).toBe('5m');

    const end = (endDate as Date).getTime();
    const start = (startDate as Date).getTime();
    const fixed = new Date('2024-01-01T00:30:00.000Z').getTime();
    const sixtyMin = 60 * 60 * 1000;
    expect(Math.abs(end - fixed)).toBeLessThan(1000);
    expect(Math.abs(start - (fixed - sixtyMin))).toBeLessThan(1000);
  });
});
