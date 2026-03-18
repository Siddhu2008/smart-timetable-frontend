import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";

const StatCard = ({ label, value, icon, tone = "primary" }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Updated just now
        </Typography>
      </Box>
      <Box
        sx={{
          width: 54,
          height: 54,
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: `${tone}.main`,
          bgcolor: (theme) => alpha(theme.palette[tone].main, 0.14)
        }}
      >
        {icon}
      </Box>
    </CardContent>
  </Card>
);

export default StatCard;
