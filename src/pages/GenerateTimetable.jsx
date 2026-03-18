import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import { api } from "../services/api.js";
import LoadingOverlay from "../components/LoadingOverlay.jsx";

const steps = ["Select Type", "Configure", "Generate"];

const GenerateTimetable = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [type, setType] = useState("class");
  const [referenceId, setReferenceId] = useState("");
  const [semester, setSemester] = useState("Semester 1");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [workingDays, setWorkingDays] = useState("Monday, Tuesday, Wednesday, Thursday, Friday");
  const [slotsPerDay, setSlotsPerDay] = useState(6);
  const [breakAfter, setBreakAfter] = useState(3);
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEntities = async () => {
      let endpoint = "/api/classes";
      if (type === "teacher") endpoint = "/api/teachers";
      if (type === "room") endpoint = "/api/rooms";
      if (type === "lab") endpoint = "/api/labs";
      const { data } = await api.get(endpoint);
      setEntities(data);
      setReferenceId(data[0]?._id || "");
    };
    loadEntities();
  }, [type]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/timetable/generate", {
        type,
        referenceId,
        semester,
        academicYear,
        workingDays: workingDays.split(",").map((d) => d.trim()).filter(Boolean),
        slotsPerDay: Number(slotsPerDay),
        breakAfter: Number(breakAfter)
      });
      navigate(`/timetable/${data.timetable._id}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <LoadingOverlay open={loading} label="Generating timetable..." />
      <PageHeader
        title="Generate Timetable"
        subtitle="Auto-generate schedules based on constraints"
        kicker="Scheduling"
      />
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stepper activeStep={activeStep}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {activeStep === 0 && (
        <Card sx={{ maxWidth: 640 }}>
          <CardContent>
          <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth>
            <MenuItem value="class">Class</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
            <MenuItem value="room">Room</MenuItem>
            <MenuItem value="lab">Lab</MenuItem>
          </TextField>
          <TextField
            select
            label="Entity"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {entities.map((entity) => (
              <MenuItem key={entity._id} value={entity._id}>
                {entity.className || entity.name || entity.roomName || entity.labName}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" sx={{ mt: 3 }} onClick={() => setActiveStep(1)}>
            Next
          </Button>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card sx={{ maxWidth: 640 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label="Semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                fullWidth
              />
              <TextField
                label="Academic Year"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                fullWidth
              />
              <TextField
                label="Working Days (comma separated)"
                value={workingDays}
                onChange={(e) => setWorkingDays(e.target.value)}
                fullWidth
              />
              <TextField
                label="Slots Per Day"
                type="number"
                value={slotsPerDay}
                onChange={(e) => setSlotsPerDay(e.target.value)}
                fullWidth
              />
              <TextField
                label="Break After Slot"
                type="number"
                value={breakAfter}
                onChange={(e) => setBreakAfter(e.target.value)}
                fullWidth
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button variant="outlined" onClick={() => setActiveStep(0)}>
                  Back
                </Button>
                <Button variant="contained" onClick={() => setActiveStep(2)}>
                  Next
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {activeStep === 2 && (
        <Card sx={{ maxWidth: 640 }}>
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Review your selections and generate the timetable.
            </Typography>
            <Button variant="contained" onClick={handleGenerate}>
              Generate Timetable
            </Button>
            <Button variant="text" sx={{ ml: 2 }} onClick={() => setActiveStep(1)}>
              Back
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default GenerateTimetable;
