import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import BulkUploadDialog from "../components/BulkUploadDialog.jsx";
import { api } from "../services/api.js";

const Subjects = () => {
  const [rows, setRows] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({
    subjectName: "",
    class: "",
    teacher: "",
    hoursPerWeek: 3,
    type: "theory"
  });

  const columns = [
    { key: "subjectName", label: "Subject" },
    { key: "class", label: "Class", render: (row) => row.class?.className || "-" },
    { key: "teacher", label: "Teacher", render: (row) => row.teacher?.name || "-" },
    { key: "type", label: "Type" }
  ];

  const load = async () => {
    const [subjects, classesRes, teachersRes] = await Promise.all([
      api.get("/api/subjects"),
      api.get("/api/classes"),
      api.get("/api/teachers")
    ]);
    setRows(subjects.data);
    setClasses(classesRes.data);
    setTeachers(teachersRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpen = (item) => {
    setEditing(item || null);
    setForm(
      item
        ? {
            subjectName: item.subjectName,
            class: item.class?._id || item.class,
            teacher: item.teacher?._id || item.teacher,
            hoursPerWeek: item.hoursPerWeek,
            type: item.type
          }
        : { subjectName: "", class: "", teacher: "", hoursPerWeek: 3, type: "theory" }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      subjectName: form.subjectName,
      class: form.class,
      teacher: form.teacher,
      hoursPerWeek: Number(form.hoursPerWeek) || 1,
      type: form.type
    };
    if (editing) {
      await api.put(`/api/subjects/${editing._id}`, payload);
    } else {
      await api.post("/api/subjects", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this subject?")) return;
    await api.delete(`/api/subjects/${item._id}`);
    load();
  };

  const handleBulkUpload = async (rowsData) => {
    const payloads = [];
    const skipped = [];

    rowsData.forEach((row) => {
      const classDoc = classes.find((c) => c.className?.toLowerCase() === row.classname?.toLowerCase());
      const teacherDoc = teachers.find((t) => t.name?.toLowerCase() === row.teachername?.toLowerCase());
      if (!classDoc || !teacherDoc) {
        skipped.push(row.subjectname || "Unknown");
        return;
      }
      payloads.push({
        subjectName: row.subjectname,
        class: classDoc._id,
        teacher: teacherDoc._id,
        hoursPerWeek: Number(row.hoursperweek) || 3,
        type: row.type?.toLowerCase() === "practical" ? "practical" : "theory"
      });
    });

    const results = await Promise.allSettled(payloads.map((payload) => api.post("/api/subjects", payload)));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - success + skipped.length;
    alert(`Subjects uploaded: ${success}. Failed/skipped: ${failed}.`);
    setBulkOpen(false);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Subjects"
        subtitle="Assign subjects to classes and teachers"
        kicker="Resources"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" onClick={() => handleOpen(null)}>
              Add Subject
            </Button>
          </Stack>
        }
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload Subjects"
        subtitle="Upload a CSV file to add multiple subjects at once."
        sampleHeaders="subjectName, className, teacherName, hoursPerWeek, type"
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
      <FormDialog
        open={open}
        title={editing ? "Edit Subject" : "Add Subject"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Subject Name"
          value={form.subjectName}
          onChange={(e) => setForm({ ...form, subjectName: e.target.value })}
          required
        />
        <TextField
          select
          label="Class"
          value={form.class}
          onChange={(e) => setForm({ ...form, class: e.target.value })}
          required
        >
          {classes.map((c) => (
            <MenuItem key={c._id} value={c._id}>
              {c.className}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Teacher"
          value={form.teacher}
          onChange={(e) => setForm({ ...form, teacher: e.target.value })}
          required
        >
          {teachers.map((t) => (
            <MenuItem key={t._id} value={t._id}>
              {t.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Hours Per Week"
          type="number"
          value={form.hoursPerWeek}
          onChange={(e) => setForm({ ...form, hoursPerWeek: e.target.value })}
        />
        <TextField select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <MenuItem value="theory">Theory</MenuItem>
          <MenuItem value="practical">Practical</MenuItem>
        </TextField>
      </FormDialog>
    </Box>
  );
};

export default Subjects;
