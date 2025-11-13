type LogEntry = string;

interface GridNode {
  id: string;
  name: string;
  logs: LogEntry[];
  node: NodeStatus
}

interface Microgrid {
  id: string;
  name: string;
  nodes: GridNode[];
}

interface NodeStatus {
  id: string;
  name: string;
  status: "Healthy" | "Terminated" | "Offline";
  cpu: string;
  memory: string;
  uptime: string;
};