import React from "react";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

const LoadingOverlay = ({ open, label = "Working..." }) => (
  <Backdrop
    open={open}
    sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.drawer + 2,
      backdropFilter: "blur(4px)",
      flexDirection: "column",
      gap: 2
    }}
  >
    <CircularProgress color="inherit" />
    <Typography variant="body2">{label}</Typography>
  </Backdrop>
);

export default LoadingOverlay;
