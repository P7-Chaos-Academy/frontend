import { Box, Stack, Typography } from "@mui/material";
import HubIcon from "@mui/icons-material/Hub";

export default function DashboardLogo() {
    return (
        <Stack spacing={1.5} sx={{ mb: 5 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(15, 23, 42, 0.28)",
              }}
            >
                <HubIcon />
            </Box>
            <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ textTransform: "uppercase", letterSpacing: 2 }}
                >
                  Strato
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  Control Plane
                </Typography>
            </Box>
        </Stack>
    );
}