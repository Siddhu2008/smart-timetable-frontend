import React from "react";
import { Box, Chip, Typography } from "@mui/material";

const PageHeader = ({ title, subtitle, action, kicker = "Module" }) => (
  <Box
    sx={{
      mb: 3,
      display: "flex",
      alignItems: { xs: "flex-start", sm: "center" },
      justifyContent: "space-between",
      flexDirection: { xs: "column", sm: "row" },
      gap: 2
    }}
  >
    <Box sx={{ width: "100%" }}>
      <Chip
        label={kicker}
        size="small"
        sx={{
          mb: 1,
          bgcolor: "rgba(15,45,58,0.1)",
          color: "primary.main",
          fontWeight: 700
        }}
      />
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{action}</Box>
  </Box>
);

export default PageHeader;
