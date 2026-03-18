import React, { useEffect, useState } from "react";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import DataTable from "../components/DataTable.jsx";
import { api } from "../services/api.js";

const Timetables = () => {
  const [rows, setRows] = useState([]);
  const [type, setType] = useState("");
  const [refId, setRefId] = useState("");
  const [entities, setEntities] = useState([]);
  const navigate = useNavigate();

  const load = async () => {
    const { data } = await api.get("/api/timetable", { params: { type, refId } });
    setRows(data);
  };

  useEffect(() => {
    load();
  }, [type, refId]);

  useEffect(() => {
    const loadEntities = async () => {
      if (!type) return setEntities([]);
      const endpoint =
        type === "class"
          ? "/api/classes"
          : type === "teacher"
            ? "/api/teachers"
            : type === "room"
              ? "/api/rooms"
              : "/api/labs";
      const { data } = await api.get(endpoint);
      setEntities(data);
    };
    loadEntities();
  }, [type]);

  const columns = [
    { key: "type", label: "Type" },
    { key: "semester", label: "Semester" },
    { key: "academicYear", label: "Academic Year" }
  ];

  const handleDelete = async (item) => {
    if (!confirm("Delete this timetable?")) return;
    await api.delete(`/api/timetable/${item._id}`);
    load();
  };

  return (
    <Box>
      <PageHeader
        title="Timetables"
        subtitle="Browse generated timetables"
        kicker="Reports"
        action={<Button variant="contained" onClick={() => navigate("/generate")}>Generate New</Button>}
      />
      <Box sx={{ display: "flex", gap: 2, mb: 2, maxWidth: 720 }}>
        <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="class">Class</MenuItem>
          <MenuItem value="teacher">Teacher</MenuItem>
          <MenuItem value="room">Room</MenuItem>
          <MenuItem value="lab">Lab</MenuItem>
        </TextField>
        <TextField
          select
          label="Entity"
          value={refId}
          onChange={(e) => setRefId(e.target.value)}
          fullWidth
          disabled={!type}
        >
          <MenuItem value="">All</MenuItem>
          {entities.map((entity) => (
            <MenuItem key={entity._id} value={entity._id}>
              {entity.className || entity.name || entity.roomName || entity.labName}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <DataTable
        columns={columns}
        rows={rows}
        onEdit={(row) => navigate(`/timetable/${row._id}`)}
        onDelete={handleDelete}
      />
    </Box>
  );
};

export default Timetables;
