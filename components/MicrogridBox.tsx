import { Box, Paper, Typography } from "@mui/material";
import { useState } from "react";
import NodeBox from "./NodeBox";
import { microgridDummyData } from "@/models/nodeStatus";

export default function MicrogridBox() {
    // Dummy data for microgrids, nodes, and logs
    const [microgrids, setMicrogrids] = useState<Microgrid[]>(microgridDummyData);
  
  return (
    <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 3,
          justifyContent: "center", // center them nicely when there’s empty space
          alignItems: "flex-start", // Prevent boxes from stretching vertically when others open
        }}
      >
        {microgrids.map((grid) => (
          <Box
            key={grid.id}
            sx={{
              flex: "1 1 500px", // grow/shrink but prefer ~500px width
              maxWidth: "600px", // optional, prevents giant stretching on ultrawide screens
              minWidth: "300px",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                backgroundColor: "#ffffff",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.06)",
                height: "100%",
              }}
            >
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {grid.name}
              </Typography>

              {grid.nodes.map((node) => (
                <NodeBox node={node}/>
              ))}
            </Paper>
          </Box>
        ))}
      </Box>
  );
}