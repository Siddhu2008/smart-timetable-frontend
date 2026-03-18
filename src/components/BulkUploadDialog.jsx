import React, { useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { parseCsv } from "../utils/csv.js";

const BulkUploadDialog = ({ open, title, subtitle, sampleHeaders, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setError("");
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        setError("No rows found in the CSV.");
        return;
      }
      await onUpload(rows);
      setFile(null);
    } catch (err) {
      setError("Upload failed. Please check your CSV values.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ mb: 2 }}>
          <input type="file" accept=".csv" onChange={handleFileChange} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Expected headers (CSV): {sampleHeaders}
        </Typography>
        {error && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkUploadDialog;
