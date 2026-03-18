import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useParams } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import TimetableGrid from "../components/TimetableGrid.jsx";
import { api } from "../services/api.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const TimetablePreview = () => {
  const { id } = useParams();
  const [timetable, setTimetable] = useState(null);
  const [editingCell, setEditingCell] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [swapMode, setSwapMode] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [labs, setLabs] = useState([]);
  const [form, setForm] = useState({ teacherId: "", roomId: "", labId: "" });

  const load = async () => {
    const [tt, teachersRes, roomsRes, labsRes] = await Promise.all([
      api.get(`/api/timetable/${id}`),
      api.get("/api/teachers"),
      api.get("/api/rooms"),
      api.get("/api/labs")
    ]);
    setTimetable(tt.data);
    setTeachers(teachersRes.data);
    setRooms(roomsRes.data);
    setLabs(labsRes.data);
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleCellClick = (day, slotIndex) => {
    if (swapMode) {
      if (!selectedCell) {
        setSelectedCell({ day, slotIndex });
      } else {
        const updated = { ...timetable, schedule: { ...timetable.schedule } };
        const gridCopy = { ...updated.schedule.grid };
        const dayA = selectedCell.day;
        const dayB = day;
        const rowA = [...gridCopy[dayA]];
        const rowB = [...gridCopy[dayB]];
        const temp = rowA[selectedCell.slotIndex];
        rowA[selectedCell.slotIndex] = rowB[slotIndex];
        rowB[slotIndex] = temp;
        gridCopy[dayA] = rowA;
        gridCopy[dayB] = rowB;
        updated.schedule.grid = gridCopy;
        setTimetable(updated);
        setSelectedCell(null);
        api.put(`/api/timetable/${id}`, { schedule: updated.schedule });
      }
      return;
    }

    setEditingCell({ day, slotIndex });
    const entry = timetable.schedule.grid[day][slotIndex];
    setForm({
      teacherId: entry?.teacherId || "",
      roomId: entry?.roomId || "",
      labId: entry?.labId || ""
    });
  };

  const saveEdit = async () => {
    const updated = { ...timetable, schedule: { ...timetable.schedule } };
    const { day, slotIndex } = editingCell;
    const row = [...updated.schedule.grid[day]];
    const entry = row[slotIndex];
    if (entry) {
      const teacher = teachers.find((t) => t._id === form.teacherId);
      const room = rooms.find((r) => r._id === form.roomId);
      const lab = labs.find((l) => l._id === form.labId);
      row[slotIndex] = {
        ...entry,
        teacherId: teacher?._id || null,
        teacherName: teacher?.name || "TBD",
        roomId: room?._id || null,
        roomName: room?.roomName || null,
        labId: lab?._id || null,
        labName: lab?.labName || null
      };
    }
    updated.schedule.grid[day] = row;
    setTimetable(updated);
    await api.put(`/api/timetable/${id}`, { schedule: updated.schedule });
    setEditingCell(null);
  };

  const removeEntry = async () => {
    const updated = { ...timetable, schedule: { ...timetable.schedule } };
    const { day, slotIndex } = editingCell;
    const row = [...updated.schedule.grid[day]];
    row[slotIndex] = null;
    updated.schedule.grid[day] = row;
    setTimetable(updated);
    await api.put(`/api/timetable/${id}`, { schedule: updated.schedule });
    setEditingCell(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    const element = document.getElementById("timetable-grid");
    if (!element) return;
    const canvas = await html2canvas(element);
    const pdf = new jsPDF("landscape", "pt", "a4");
    const imgData = canvas.toDataURL("image/png");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, width - 40, height);
    pdf.save("timetable.pdf");
  };

  const handleExportExcel = () => {
    if (!timetable) return;
    const { days, slots, grid } = timetable.schedule;
    const data = [
      ["Time Slot", ...days],
      ...slots.map((slot, idx) => [
        slot,
        ...days.map((day) => {
          const entry = grid[day][idx];
          if (!entry || entry.isBreak) return entry?.label || "";
          return `${entry.subjectName} | ${entry.teacherName} | ${entry.roomName || entry.labName}`;
        })
      ])
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Timetable");
    XLSX.writeFile(wb, "timetable.xlsx");
  };

  if (!timetable) return null;

  return (
    <Box>
      <PageHeader
        title="Timetable Preview"
        subtitle={`${timetable.type.toUpperCase()} timetable for ${timetable.semester} (${timetable.academicYear})`}
        kicker="Timetable"
        action={
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ width: { xs: "100%", sm: "auto" } }}>
            <Button variant="outlined" onClick={handlePrint}>
              Print
            </Button>
            <Button variant="outlined" onClick={handleExportPdf}>
              Export PDF
            </Button>
            <Button variant="outlined" onClick={handleExportExcel}>
              Export Excel
            </Button>
          </Stack>
        }
      />
      <FormControlLabel
        control={<Switch checked={swapMode} onChange={(e) => setSwapMode(e.target.checked)} />}
        label="Swap Mode"
      />
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {swapMode
          ? "Click two cells to swap their entries."
          : "Click a cell to edit, change teacher or room/lab, or remove entry."}
      </Typography>
      <Box id="timetable-grid">
        <TimetableGrid schedule={timetable.schedule} onCellClick={handleCellClick} selectedCell={selectedCell} />
      </Box>

      <Dialog open={Boolean(editingCell)} onClose={() => setEditingCell(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Slot</DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            select
            label="Teacher"
            value={form.teacherId}
            onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
          >
            {teachers.map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Room"
            value={form.roomId}
            onChange={(e) => setForm({ ...form, roomId: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            {rooms.map((r) => (
              <MenuItem key={r._id} value={r._id}>
                {r.roomName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Lab"
            value={form.labId}
            onChange={(e) => setForm({ ...form, labId: e.target.value })}
          >
            <MenuItem value="">None</MenuItem>
            {labs.map((l) => (
              <MenuItem key={l._id} value={l._id}>
                {l.labName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={removeEntry}>
            Remove
          </Button>
          <Button onClick={() => setEditingCell(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimetablePreview;
