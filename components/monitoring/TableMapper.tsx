import { Paper } from "@mui/material";
import { useEffect, useState } from "react";
import MonitoringTable from "./MonitoringTable";
import { microgridDummyData } from "@/models/nodeStatus";

export default function TableMapper() {
  const [microGrids, setMicroGrids] = useState<Microgrid[]>([])

  useEffect(() => {
    setMicroGrids(microgridDummyData);
  }, []);

  return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid rgba(15, 23, 42, 0.08)",
          backgroundColor: "#ffffff",
          boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
        }}
      >
      {microGrids?.map((grid) => (
        <MonitoringTable key={grid.id} microgrid={grid}/>
      ))}
      </Paper>
    );
}