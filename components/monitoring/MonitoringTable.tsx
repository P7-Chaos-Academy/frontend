import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import NodeTable from "./NodeTable";

export default function MonitoringTable(microgrid: {microgrid: Microgrid}) {
    
    return (
      <>
        <Typography variant="h6" fontWeight={600} gutterBottom>
        {microgrid.microgrid.name
        ? microgrid.microgrid.name
        : "BingBong"}
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
              {microgrid.microgrid.nodes.map((node) => (
                <NodeTable key={node.id} node={node}/>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
}