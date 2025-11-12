export type NodeStatus = {
  id: string;
  name: string;
  status: "Healthy" | "Degraded" | "Offline";
  cpu: string;
  memory: string;
  uptime: string;
};

export const nodeDummyData: NodeStatus[] = [
  {
    id: "node-1",
    name: "Compute Node A",
    status: "Healthy",
    cpu: "32%",
    memory: "58%",
    uptime: "12d 4h",
  },
  {
    id: "node-2",
    name: "Compute Node B",
    status: "Degraded",
    cpu: "76%",
    memory: "84%",
    uptime: "7d 11h",
  },
  {
    id: "node-3",
    name: "Compute Node C",
    status: "Offline",
    cpu: "—",
    memory: "—",
    uptime: "—",
  },
];
