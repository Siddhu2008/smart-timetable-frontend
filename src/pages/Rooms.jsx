import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import FormDialog from "../components/FormDialog.jsx";
import BulkUploadDialog from "../components/BulkUploadDialog.jsx";
import { api } from "../services/api.js";

const Rooms = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [form, setForm] = useState({
    roomName: "",
    capacity: 0,
    type: "lecture hall"
  });

  const columns = [
    { key: "roomName", label: "Room" },
    { key: "type", label: "Type" },
    { key: "capacity", label: "Capacity" }
  ];

  const load = async () => {
    const { data } = await api.get("/api/rooms");
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
            roomName: item.roomName,
            capacity: item.capacity,
            type: item.type
          }
        : { roomName: "", capacity: 0, type: "lecture hall" }
    );
    setOpen(true);
  };

  const handleSubmit = async () => {
    const payload = {
      roomName: form.roomName,
      capacity: Number(form.capacity) || 0,
      type: form.type
    };
    if (editing) {
      await api.put(`/api/rooms/${editing._id}`, payload);
    } else {
      await api.post("/api/rooms", payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this room?")) return;
    await api.delete(`/api/rooms/${item._id}`);
    load();
  };

  const handleBulkUpload = async (rowsData) => {
    const payloads = rowsData
      .map((row) => ({
        roomName: row.roomname,
        capacity: Number(row.capacity) || 0,
        type: (row.type || "lecture hall").toLowerCase()
      }))
      .filter((row) => row.roomName);

    const results = await Promise.allSettled(payloads.map((payload) => api.post("/api/rooms", payload)));
    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - success;
    alert(`Rooms uploaded: ${success}. Failed: ${failed}.`);
    setBulkOpen(false);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Rooms"
        subtitle="Manage lecture rooms and availability"
        kicker="Resources"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setBulkOpen(true)}>
              Bulk Upload
            </Button>
            <Button variant="contained" onClick={() => handleOpen(null)}>
              Add Room
            </Button>
          </Stack>
        }
      />
      <DataTable columns={columns} rows={rows} onEdit={handleOpen} onDelete={handleDelete} />
      <BulkUploadDialog
        open={bulkOpen}
        title="Bulk Upload Rooms"
        subtitle="Upload a CSV file to add multiple rooms at once."
        sampleHeaders="roomName, capacity, type"
        onClose={() => setBulkOpen(false)}
        onUpload={handleBulkUpload}
      />
      <FormDialog
        open={open}
        title={editing ? "Edit Room" : "Add Room"}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      >
        <TextField
          label="Room Name"
          value={form.roomName}
          onChange={(e) => setForm({ ...form, roomName: e.target.value })}
          required
        />
        <TextField
          label="Capacity"
          type="number"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
        />
        <TextField
          select
          label="Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <MenuItem value="lecture hall">Lecture Hall</MenuItem>
          <MenuItem value="seminar">Seminar</MenuItem>
          <MenuItem value="auditorium">Auditorium</MenuItem>
        </TextField>
      </FormDialog>
    </Box>
  );
};

export default Rooms;
