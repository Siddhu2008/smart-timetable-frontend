import React, { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Switch, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import { api } from "../services/api.js";

const Constraints = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    maxLecturesPerDay: 4,
    breakTime: "Break",
    workingDays: "Monday, Tuesday, Wednesday, Thursday, Friday",
    slotDuration: 60,
    teacherNoBackToBack: true,
    teacherMinGap: 0,
    roomCapacityStrict: true,
    roomTypeMatch: true,
    labCapacityStrict: false,
    labTypeMatch: true
  });

  const columns = [
    { key: "maxLecturesPerDay", label: "Max Lectures/Day" },
    { key: "slotDuration", label: "Slot Duration" },
    { key: "workingDays", label: "Working Days", render: (row) => row.workingDays?.join(", ") }
  ];

  const load = async () => {
    const { data } = await api.get("/api/constraints");
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
            maxLecturesPerDay: item.maxLecturesPerDay,
            breakTime: item.breakTime,
            workingDays: (item.workingDays || []).join(", "),
            slotDuration: item.slotDuration,
            teacherNoBackToBack: item.teacherRules?.noBackToBack ?? true,
            teacherMinGap: item.teacherRules?.minGap ?? 0,
            roomCapacityStrict: item.roomRules?.capacityStrict ?? true,
            roomTypeMatch: item.roomRules?.typeMatch ?? true,
            labCapacityStrict: item.labRules?.capacityStrict ?? true,
            labTypeMatch: item.labRules?.typeMatch ?? true
          }
        : {
            maxLecturesPerDay: 4,
            breakTime: "Break",
            workingDays: "Monday, Tuesday, Wednesday, Thursday, Friday",
            slotDuration: 60,
            teacherNoBackToBack: true,
            teacherMinGap: 0,
            roomCapacityStrict: true,
            roomTypeMatch: true,
            labCapacityStrict: false,
            labTypeMatch: true
          }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      maxLecturesPerDay: Number(form.maxLecturesPerDay) || 4,
      breakTime: form.breakTime,
      workingDays: form.workingDays.split(",").map((d) => d.trim()).filter(Boolean),
      slotDuration: Number(form.slotDuration) || 60,
      teacherRules: {
        noBackToBack: Boolean(form.teacherNoBackToBack),
        minGap: Number(form.teacherMinGap) || 0
      },
      roomRules: {
        capacityStrict: Boolean(form.roomCapacityStrict),
        typeMatch: Boolean(form.roomTypeMatch)
      },
      labRules: {
        capacityStrict: Boolean(form.labCapacityStrict),
        typeMatch: Boolean(form.labTypeMatch)
      }
    };

    if (editing) {
      await api.put(`/api/constraints/${editing._id}`, payload);
    } else {
      await api.post("/api/constraints", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this constraint set?")) return;
    await api.delete(`/api/constraints/${item._id}`);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Constraints"
        subtitle="Scheduling rules and system constraints"
        kicker="Scheduling"
        action={<Button variant="contained" onClick={() => handleOpen(null)}>Add Constraint</Button>}
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <FormDialog
        open={open}
        title={editing ? "Edit Constraints" : "Add Constraints"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Max Lectures Per Day"
          type="number"
          value={form.maxLecturesPerDay}
          onChange={(e) => setForm({ ...form, maxLecturesPerDay: e.target.value })}
        />
        <TextField
          label="Break Label"
          value={form.breakTime}
          onChange={(e) => setForm({ ...form, breakTime: e.target.value })}
        />
        <TextField
          label="Working Days (comma separated)"
          value={form.workingDays}
          onChange={(e) => setForm({ ...form, workingDays: e.target.value })}
        />
        <TextField
          label="Slot Duration (minutes)"
          type="number"
          value={form.slotDuration}
          onChange={(e) => setForm({ ...form, slotDuration: e.target.value })}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.teacherNoBackToBack}
              onChange={(e) => setForm({ ...form, teacherNoBackToBack: e.target.checked })}
            />
          }
          label="Prevent back-to-back lectures for teachers"
        />
        <TextField
          label="Minimum gap between teacher lectures (slots)"
          type="number"
          value={form.teacherMinGap}
          onChange={(e) => setForm({ ...form, teacherMinGap: e.target.value })}
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.roomCapacityStrict}
              onChange={(e) => setForm({ ...form, roomCapacityStrict: e.target.checked })}
            />
          }
          label="Enforce room capacity strictly"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.roomTypeMatch}
              onChange={(e) => setForm({ ...form, roomTypeMatch: e.target.checked })}
            />
          }
          label="Match room type to class requirement"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.labCapacityStrict}
              onChange={(e) => setForm({ ...form, labCapacityStrict: e.target.checked })}
            />
          }
          label="Enforce lab capacity strictly"
        />
        <FormControlLabel
          control={
            <Switch
              checked={form.labTypeMatch}
              onChange={(e) => setForm({ ...form, labTypeMatch: e.target.checked })}
            />
          }
          label="Match lab type to practical requirement"
        />
      </FormDialog>
    </Box>
  );
};

export default Constraints;
