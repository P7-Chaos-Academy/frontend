import { MetricDataPoint } from "@/models/prometheusMetrics";
import { Box, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NodeTable(node: {node: MetricDataPoint}) {
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
        <TableCell>{node.node.metric.__name__}</TableCell>

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
                {node.node.metric.job}
            </Box>
        </TableCell>

        <TableCell>{node.node.values[0]}</TableCell>
    </TableRow>
  );
}