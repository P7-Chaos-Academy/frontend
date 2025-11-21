import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import NodeTable from "./NodeTable";
import { MetricDataPoint } from "@/models/prometheusMetrics";

export default function MonitoringTable(microgrid: {microgrid: MetricDataPoint[]}) {
    
    return (
      <>
        <Typography variant="h6" fontWeight={600} gutterBottom>
        {"BingBong" + microgrid.microgrid[0].metric.instance}
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
                <TableCell sx={{ fontWeight: 600 }}>Uptime</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {microgrid.microgrid.map((node) => (
                <NodeTable key={node.metric.instance} node={node}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
}