import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import NodeBox from "./NodeBox";
import { microgridDummyData } from "@/models/nodeStatus";
import { getMetricsQuery } from "@/lib/api/metricsQuery";
import McBox from "./McBox";

export default function MicrogridBox() {
    // Microgrids state
    const [microgrids, setMicrogrids] = useState<Microgrid[]>([]);

    useEffect(() => {
      async function fetchMetricsAndPopulate() {
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 5 * 60 * 1000); // 5 minutes earlier

        try {
          const text = await getMetricsQuery([3, 4, 5], startDate, endDate, "30s", null);

          let parsed: any;
          try {
            parsed = JSON.parse(text);
          } catch (err) {
            // If the API returns plain text or an unexpected format, fallback
            console.warn("metricsQuery returned non-JSON response, falling back to dummy data", err);
            setMicrogrids(microgridDummyData);
            return;
          }

          if (Array.isArray(parsed)) {
            setMicrogrids(parsed as Microgrid[]);
          } else if (parsed && Array.isArray(parsed.microgrids)) {
            setMicrogrids(parsed.microgrids as Microgrid[]);
          } else {
            console.warn("metricsQuery returned unknown shape, using dummy data", parsed);
            setMicrogrids(microgridDummyData);
          }
        } catch (err) {
          console.error("Error fetching metricsQuery:", err);
          setMicrogrids(microgridDummyData);
        }
      }

      fetchMetricsAndPopulate();
    }, []);

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

              <McBox grid={grid} />
            </Paper>
          </Box>
        ))}
      </Box>
  );
}