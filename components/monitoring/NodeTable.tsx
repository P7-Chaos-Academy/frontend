import { MetricDataPoint } from "@/models/prometheusMetrics";
import { Box, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NodeTable(node: {node: MetricDataPoint, id:string}) {
  const router = useRouter();

  return (
    <TableRow 
    hover
    sx={{ cursor: "pointer" }}
    onClick={() => router.push(`/monitoring/${node.node.metric.instance}?name=${encodeURIComponent(node.node.metric.instance)}`)
}
    key={node.node.metric.instance}
    >
        <TableCell>{node.node.metric.instance}</TableCell>
        <TableCell></TableCell>

        <TableCell>
            <Box
                sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: "rgba(16,185,129,0.1)",
                color: "#10b981",
                fontWeight: 500,
                fontSize: "0.875rem",
                }}
            >
                {node.node.values[0][1] ? "Online" : "Offline"}
            </Box>
        </TableCell>

        <TableCell>{}</TableCell>
        <TableCell>{}</TableCell>
        <TableCell>{node.node.values[0][1]}</TableCell>
    </TableRow>
  );
}