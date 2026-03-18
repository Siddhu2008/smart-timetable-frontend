import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Stack
} from "@mui/material";

const FormDialog = ({ open, title, children, onClose, onSubmit, submitLabel }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <Stack spacing={2} sx={{ mt: 1 }}>
        {children}
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onSubmit} variant="contained">
        {submitLabel || "Save"}
      </Button>
    </DialogActions>
  </Dialog>
);

export default FormDialog;
