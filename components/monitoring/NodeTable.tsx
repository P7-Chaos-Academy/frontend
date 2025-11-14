import { Box, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NodeTable(node: {node: GridNode}) {
  const router = useRouter();

  return (
    <TableRow 
    hover
    sx={{ cursor: "pointer" }}
    onClick={() => router.push(`/monitoring/${node.node.node.id}?name=${encodeURIComponent(node.node.node.name)}`)
}
    key={node.node.node.id}
    >
        <TableCell>{node.node.node.id}</TableCell>
        <TableCell>{node.node.node.name}</TableCell>

        <TableCell>
            <Box
                sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor:
                    node.node.node.status === "Healthy"
                    ? "rgba(16,185,129,0.1)"
                    : node.node.node.status === "Terminated"
                    ? "rgba(245,158,11,0.1)"
                    : "rgba(239,68,68,0.1)",
                color:
                    node.node.node.status === "Healthy"
                    ? "#10b981"
                    : node.node.node.status === "Terminated"
                    ? "#f59e0b"
                    : "#ef4444",
                fontWeight: 500,
                fontSize: "0.875rem",
                }}
            >
                {node.node.node.status}
            </Box>
        </TableCell>

        <TableCell>{node.node.node.cpu}</TableCell>
        <TableCell>{node.node.node.memory}</TableCell>
        <TableCell>{node.node.node.uptime}</TableCell>
    </TableRow>
  );
}