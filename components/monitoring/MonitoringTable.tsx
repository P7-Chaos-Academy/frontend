import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import NodeTable from "./NodeTable";
import { InstanceBundle } from "@/lib/api/metricsQuery";

export default function MonitoringTable(microgrid: {microgrid: InstanceBundle[], id:string}, ) {
    return (
      <>
        <Typography variant="h6" fontWeight={600} gutterBottom>
        {microgrid.id === "all-nodes" ? "All Nodes Overview" : `Monitoring Data for ${microgrid.id}`}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Node ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>CPU Usage</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Memory Usage</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Power Usage</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {microgrid.microgrid.map((node) => (
                <NodeTable id={node.instance} key={node.instance} node={node.metrics}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
}