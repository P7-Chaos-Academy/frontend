import { Box, TableCell, TableRow } from "@mui/material";
import { useRouter } from "next/navigation";

export default function NodeTable(node: {node: Record<string, string>, id:string}) {
  const router = useRouter();

  const jetsonPower = node.node.jetson_pom_5v_in_watts || "N/A";
  const jetsonCpuTemp = node.node.jetson_cpu_temp || "N/A";
  const upStatus = node.node.up === "1" ? "Online" : "Offline";
  const nodeInstance = node.id;
  const statusColor = upStatus === "Online" ? "#10b981" : "#ef4444";
  const statusBgColor = upStatus === "Online" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)";

  return (
    <TableRow 
      hover
      sx={{ cursor: "pointer" }}
      onClick={() => router.push(`/monitoring/${nodeInstance}?name=${encodeURIComponent(nodeInstance)}`)}
      key={nodeInstance}
    >
        <TableCell>{nodeInstance}</TableCell>
        <TableCell>{nodeInstance}</TableCell>

        <TableCell>
            <Box
                sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: statusBgColor,
                color: statusColor,
                fontWeight: 500,
                fontSize: "0.875rem",
                }}  
            >
              {upStatus}
            </Box>
        </TableCell>

        <TableCell>{}</TableCell>
        <TableCell>{jetsonCpuTemp}°C</TableCell>
        <TableCell>{jetsonPower} W</TableCell>
    </TableRow>
  );
}