/**
 * Data types for Prometheus API responses
 */

export interface PrometheusMetric {
  __name__: string;
  instance: string;
  job: string;
  [key: string]: string;
}

export interface MetricDataPoint {
  metric: PrometheusMetric;
  value: Array<[number, string]>;
}

export interface PrometheusMatrixResponse {
  status: "success" | "error";
  data: {
    resultType: "matrix" | "vector" | "scalar" | "string";
    result: MetricDataPoint[];
  };
  error?: string;
  warnings?: string[];
}

/**
 * Helper type for extracting metric values as numbers
 */
export interface MetricDataPointWithNumbers {
  metric: PrometheusMetric;
  values: Array<[number, number]>;
}

export interface MicrogridArray {
  microgrids: PrometheusMatrixResponse[];
}
