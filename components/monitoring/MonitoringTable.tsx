import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import NodeTable from "./NodeTable";
import { PrometheusMatrixResponse } from "@/models/prometheusMetrics";

export default function MonitoringTable(microgrid: {microgrid: PrometheusMatrixResponse, id:string}, ) {
    
    return (
      <>
        <Typography variant="h6" fontWeight={600} gutterBottom>
        {microgrid.id}
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
              {microgrid.microgrid.data.result.map((node) => (
                <NodeTable id={microgrid.id} key={node.metric.instance} node={node}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
}