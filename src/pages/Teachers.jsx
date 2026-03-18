import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import BulkUploadDialog from "../components/BulkUploadDialog.jsx";
import { api } from "../services/api.js";

const Teachers = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: "",
    subjects: "",
    maxLecturesPerDay: 4
  });

  const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "subjects", label: "Subjects", render: (row) => row.subjects?.join(", ") }
  ];

  const load = async () => {
    const { data } = await api.get("/api/teachers");
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (teacher) => {
    setEditing(teacher || null);
    setForm(
      teacher
        ? {
            name: teacher.name,
            department: teacher.department,
            subjects: (teacher.subjects || []).join(", "),
            maxLecturesPerDay: teacher.maxLecturesPerDay || 4
          }
        : { name: "", department: "", subjects: "", maxLecturesPerDay: 4 }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      name: form.name,
      department: form.department,
      subjects: form.subjects ? form.subjects.split(",").map((s) => s.trim()).filter(Boolean) : [],
      maxLecturesPerDay: Number(form.maxLecturesPerDay) || 4
    };
    if (editing) {
      await api.put(`/api/teachers/${editing._id}`, payload);
    } else {
      await api.post("/api/teachers", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (teacher) => {
    if (!confirm("Delete this teacher?")) return;
    await api.delete(`/api/teachers/${teacher._id}`);
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
        name: row.name,
        department: row.department,
        subjects: splitList(row.subjects),
        maxLecturesPerDay: Number(row.maxlecturesperday) || 4
      }))
      .filter((row) => row.name && row.department);

    const results = await Promise.allSettled(payloads.map((payload) => api.post("/api/teachers", payload)));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - success;
    alert(`Teachers uploaded: ${success}. Failed: ${failed}.`);
    setBulkOpen(false);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Teachers"
        subtitle="Manage teacher profiles and availability"
        kicker="Resources"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" onClick={() => handleOpen(null)}>
              Add Teacher
            </Button>
          </Stack>
        }
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload Teachers"
        subtitle="Upload a CSV file to add multiple teachers at once."
        sampleHeaders="name, department, subjects, maxLecturesPerDay"
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
      <FormDialog
        open={open}
        title={editing ? "Edit Teacher" : "Add Teacher"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <TextField
          label="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />
        <TextField
          label="Subjects (comma separated)"
          value={form.subjects}
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
        />
        <TextField
          label="Max Lectures Per Day"
          type="number"
          value={form.maxLecturesPerDay}
          onChange={(e) => setForm({ ...form, maxLecturesPerDay: e.target.value })}
        />
      </FormDialog>
    </Box>
  );
};

export default Teachers;
