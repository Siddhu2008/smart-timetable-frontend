import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import {
  People as PeopleIcon,
  Class as ClassIcon,
  MeetingRoom as RoomIcon,
  Science as LabIcon,
  TableView as TableIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader.jsx";
import StatCard from "../components/StatCard.jsx";
import { api } from "../services/api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({
    teachers: 0,
    classes: 0,
    rooms: 0,
    labs: 0,
    timetables: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [teachers, classes, rooms, labs, timetables] = await Promise.all([
          api.get("/api/teachers"),
          api.get("/api/classes"),
          api.get("/api/rooms"),
          api.get("/api/labs"),
          api.get("/api/timetable")
        ]);
        setStats({
          teachers: teachers.data.length,
          classes: classes.data.length,
          rooms: rooms.data.length,
          labs: labs.data.length,
          timetables: timetables.data.length
        });
      } catch (err) {
        console.error("Failed to load dashboard stats", err);
      }
    };
    load();
  }, []);

  return (
    <Box>
      <PageHeader title="Dashboard" subtitle="Your control center for timetable planning" kicker="Overview" />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight={700}>
                Build a conflict-free timetable in minutes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
                Start by adding your academic resources, configure scheduling constraints, and let the
                generator do the heavy lifting. You can always refine the timetable manually afterward.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                <Button variant="contained" onClick={() => navigate("/generate")}>
                  Generate timetable
                </Button>
                <Button variant="outlined" onClick={() => navigate("/constraints")}>
                  Review constraints
                </Button>
                <Button variant="text" onClick={() => navigate("/teachers")}>
                  Add teachers
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                System readiness
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Make sure the essentials are configured before generation.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 2 }}>
                {[
                  { label: "Teachers added", count: stats.teachers },
                  { label: "Classes configured", count: stats.classes },
                  { label: "Rooms available", count: stats.rooms },
                  { label: "Labs available", count: stats.labs }
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.2,
                      borderRadius: 2,
                      border: "1px solid rgba(15, 23, 42, 0.08)"
                    }}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Chip
                      label={item.count > 0 ? "Ready" : "Needs setup"}
                      size="small"
                      color={item.count > 0 ? "success" : "warning"}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <StatCard label="Teachers" value={stats.teachers} icon={<PeopleIcon fontSize="large" />} tone="info" />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard label="Classes" value={stats.classes} icon={<ClassIcon fontSize="large" />} tone="primary" />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard label="Rooms" value={stats.rooms} icon={<RoomIcon fontSize="large" />} tone="secondary" />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard label="Labs" value={stats.labs} icon={<LabIcon fontSize="large" />} tone="success" />
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard
                label="Timetables"
                value={stats.timetables}
                icon={<TableIcon fontSize="large" />}
                tone="info"
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700}>
                Admin checklist
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Recommended workflow based on your SRS requirements.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                {[
                  "Add teachers, classes, rooms, and labs",
                  "Assign subjects with weekly hours",
                  "Define constraints and working days",
                  "Generate and review timetables"
                ].map((step, index) => (
                  <Box
                    key={step}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: 2,
                      border: "1px dashed rgba(15, 23, 42, 0.2)",
                      backgroundColor: "rgba(15, 23, 42, 0.02)"
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Step {index + 1}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
