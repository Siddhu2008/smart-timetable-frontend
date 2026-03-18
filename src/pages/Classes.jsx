import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import BulkUploadDialog from "../components/BulkUploadDialog.jsx";
import { api } from "../services/api.js";

const Classes = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({
    className: "",
    department: "",
    studentCount: 0,
    subjects: ""
  });

  const columns = [
    { key: "className", label: "Class" },
    { key: "department", label: "Department" },
    { key: "studentCount", label: "Students" }
  ];

  const load = async () => {
    const { data } = await api.get("/api/classes");
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
            className: item.className,
            department: item.department,
            studentCount: item.studentCount,
            subjects: (item.subjects || []).join(", ")
          }
        : { className: "", department: "", studentCount: 0, subjects: "" }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      className: form.className,
      department: form.department,
      studentCount: Number(form.studentCount) || 0,
      subjects: form.subjects ? form.subjects.split(",").map((s) => s.trim()).filter(Boolean) : []
    };

    if (editing) {
      await api.put(`/api/classes/${editing._id}`, payload);
    } else {
      await api.post("/api/classes", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this class?")) return;
    await api.delete(`/api/classes/${item._id}`);
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
        className: row.classname,
        department: row.department,
        studentCount: Number(row.studentcount) || 0,
        subjects: splitList(row.subjects)
      }))
      .filter((row) => row.className && row.department);

    const results = await Promise.allSettled(payloads.map((payload) => api.post("/api/classes", payload)));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - success;
    alert(`Classes uploaded: ${success}. Failed: ${failed}.`);
    setBulkOpen(false);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Classes"
        subtitle="Manage class groups and department details"
        kicker="Resources"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" onClick={() => handleOpen(null)}>
              Add Class
            </Button>
          </Stack>
        }
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload Classes"
        subtitle="Upload a CSV file to add multiple classes at once."
        sampleHeaders="className, department, studentCount, subjects"
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
      <FormDialog
        open={open}
        title={editing ? "Edit Class" : "Add Class"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Class Name"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
          required
        />
        <TextField
          label="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          required
        />
        <TextField
          label="Student Count"
          type="number"
          value={form.studentCount}
          onChange={(e) => setForm({ ...form, studentCount: e.target.value })}
        />
        <TextField
          label="Subjects (comma separated)"
          value={form.subjects}
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
        />
      </FormDialog>
    </Box>
  );
};

export default Classes;
