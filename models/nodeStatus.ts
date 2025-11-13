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
    status: "Terminated",
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

export const microgridDummyData: Microgrid[] = [
  {
      id: "grid-1",
      name: "AAU Microgrid",
      nodes: [
        {
          id: "node-1",
          name: "Node 1",
          logs: [
            "[12:03:22] Task #238 started on container X9",
            "[12:03:29] Health check passed ✅",
            "[12:05:02] Task #238 completed successfully",
          ],
          node: {
            id: "AAU-Microgrid-Node-1",
            name: "Node 1",
            status: "Healthy",
            cpu: "32%",
            memory: "58%",
            uptime: "12d 4h"
          }
        },
        {
          id: "node-2",
          name: "Node 2",
          logs: [
            "[09:44:10] Task #229 started on container Z3",
            "[09:45:01] Disk usage warning ⚠️",
            "[09:48:37] Task #229 terminated due to memory limit",
          ],
          node: {
            id: "AAU-Microgrid-Node-2",
            name: "Node 2",
            status: "Terminated",
            cpu: "76%",
            memory: "84%",
            uptime: "7d 11h"
          }
        },
      ],
    },
    {
      id: "grid-2",
      name: "Pop Microgrid",
      nodes: [
        {
          id: "node-3",
          name: "Node 3",
          logs: [
            "[11:01:11] Node rebooted after maintenance",
            "[11:03:45] New workload assigned: task #243",
          ],
          node: {
            id: "Pop-Microgrid-Node-3",
            name: "Node 3",
            status: "Terminated",
            cpu: "--",
            memory: "--",
            uptime: "--"
          }
        },
      ],
    }
]