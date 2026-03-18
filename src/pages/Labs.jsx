import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import BulkUploadDialog from "../components/BulkUploadDialog.jsx";
import { api } from "../services/api.js";

const Labs = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({
    labName: "",
    capacity: 0,
    labType: "",
    equipment: ""
  });

  const columns = [
    { key: "labName", label: "Lab" },
    { key: "labType", label: "Type" },
    { key: "capacity", label: "Capacity" }
  ];

  const load = async () => {
    const { data } = await api.get("/api/labs");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (item) => {
    setEditing(item || null);
    setForm(
      item
        ? {
            labName: item.labName,
            capacity: item.capacity,
            labType: item.labType,
            equipment: (item.equipment || []).join(", ")
          }
        : { labName: "", capacity: 0, labType: "", equipment: "" }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      labName: form.labName,
      capacity: Number(form.capacity) || 0,
      labType: form.labType,
      equipment: form.equipment ? form.equipment.split(",").map((s) => s.trim()).filter(Boolean) : []
    };
    if (editing) {
      await api.put(`/api/labs/${editing._id}`, payload);
    } else {
      await api.post("/api/labs", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this lab?")) return;
    await api.delete(`/api/labs/${item._id}`);
    load();
  };

  const splitList = (value) => {
    if (!value) return [];
    if (value.includes("|")) return value.split("|").map((v) => v.trim()).filter(Boolean);
    if (value.includes(";")) return value.split(";").map((v) => v.trim()).filter(Boolean);
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  };

  const handleBulkUpload = async (rowsData) => {
    const payloads = rowsData
      .map((row) => ({
        labName: row.labname,
        capacity: Number(row.capacity) || 0,
        labType: row.labtype,
        equipment: splitList(row.equipment)
      }))
      .filter((row) => row.labName && row.labType);

    const results = await Promise.allSettled(payloads.map((payload) => api.post("/api/labs", payload)));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - success;
    alert(`Labs uploaded: ${success}. Failed: ${failed}.`);
    setBulkOpen(false);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Labs"
        subtitle="Manage laboratory rooms and equipment"
        kicker="Resources"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" onClick={() => handleOpen(null)}>
              Add Lab
            </Button>
          </Stack>
        }
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload Labs"
        subtitle="Upload a CSV file to add multiple labs at once."
        sampleHeaders="labName, capacity, labType, equipment"
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
      <FormDialog
        open={open}
        title={editing ? "Edit Lab" : "Add Lab"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Lab Name"
          value={form.labName}
          onChange={(e) => setForm({ ...form, labName: e.target.value })}
          required
        />
        <TextField
          label="Capacity"
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <TextField
          label="Lab Type"
          value={form.labType}
          onChange={(e) => setForm({ ...form, labType: e.target.value })}
          required
        />
        <TextField
          label="Equipment (comma separated)"
          value={form.equipment}
          onChange={(e) => setForm({ ...form, equipment: e.target.value })}
        />
      </FormDialog>
    </Box>
  );
};

export default Labs;
