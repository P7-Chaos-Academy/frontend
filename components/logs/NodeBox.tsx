import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
    Box, 
    Paper, 
    Typography, 
    Accordion, 
    AccordionDetails, 
    AccordionSummary, 
    List, 
    ListItem, 
    ListItemText, 
    Divider 
} from "@mui/material";

export default function NodeBox(node: { node: GridNode}) {
    return (
        <Accordion key={node.node.id} sx={{ mb: 1, borderRadius: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight={500}>{node.node.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Paper
                variant="outlined"
                sx={{
                backgroundColor: "#f8fafc",
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(15, 23, 42, 0.08)",
                }}
            >
                {node.node.logs && node.node.logs.length > 0 ? (
                <List dense>
                    {node.node.logs.map((log, index) => (
                    <Box key={index}>
                        <ListItem disablePadding>
                        <ListItemText
                            primary={
                            <Typography
                                variant="body2"
                                sx={{
                                fontFamily: "monospace",
                                color: "text.secondary",
                                }}
                            >
                                {log}
                            </Typography>
                            }
                        />
                        </ListItem>
                        {index < node.node.logs.length - 1 && <Divider />}
                    </Box>
                    ))}
                </List>
                ) : (
                <Typography
                    variant="body2"
                    sx={{
                    fontStyle: "italic",
                    color: "text.secondary",
                    }}
                >
                    No logs available for this node.
                </Typography>
                )}
            </Paper>
            </AccordionDetails>
        </Accordion>
    );
}