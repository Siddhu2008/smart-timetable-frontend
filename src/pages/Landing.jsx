import React from "react";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import {
  Menu as MenuIcon,
  AutoAwesome as AutoAwesomeIcon,
  Security as SecurityIcon,
  Print as PrintIcon,
  SettingsSuggest as SettingsIcon,
  MeetingRoom as RoomIcon,
  Science as LabIcon,
  Timeline as TimelineIcon,
  EditCalendar as EditIcon,
  TaskAlt as TaskAltIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Contact", href: "#contact" }
];

const features = [
  {
    title: "Automatic Timetable Generation",
    description: "Create conflict-free schedules in minutes with intelligent allocation.",
    icon: <AutoAwesomeIcon />
  },
  {
    title: "Teacher Conflict Detection",
    description: "Avoid overlapping lectures and keep faculty workload balanced.",
    icon: <SecurityIcon />
  },
  {
    title: "Room & Lab Allocation",
    description: "Assign the right room or lab based on capacity and type constraints.",
    icon: <RoomIcon />
  },
  {
    title: "Constraint-Based Scheduling",
    description: "Configure working days, breaks, and lecture limits with ease.",
    icon: <SettingsIcon />
  },
  {
    title: "Manual Editing & Adjustments",
    description: "Fine-tune schedules with swap and edit tools after generation.",
    icon: <EditIcon />
  },
  {
    title: "Export to PDF & Print",
    description: "Generate official printable timetables for faculty and students.",
    icon: <PrintIcon />
  },
  {
    title: "Secure Admin Dashboard",
    description: "Role-based access for confident institutional control.",
    icon: <SecurityIcon />
  }
];

const steps = [
  {
    title: "Enter Institutional Data",
    description: "Add teachers, classes, rooms, labs, and subjects."
  },
  {
    title: "Configure Constraints",
    description: "Set working days, breaks, and scheduling rules."
  },
  {
    title: "Generate Timetable",
    description: "Let the system build a conflict-free weekly schedule."
  },
  {
    title: "Edit & Export",
    description: "Make adjustments and export in official formats."
  }
];

const benefits = [
  { label: "Saves hours of manual work" },
  { label: "Eliminates scheduling conflicts" },
  { label: "Optimizes resource usage" },
  { label: "Easy to use for admins" },
  { label: "Accurate and reliable output" }
];

const Landing = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary" }} id="home">
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "rgba(15, 45, 58, 0.9)", backdropFilter: "blur(8px)" }}>
        <Toolbar sx={{ gap: 2, py: { xs: 1, md: 0 }, minHeight: { xs: 64, md: 72 } }}>
          <IconButton color="inherit" onClick={() => setOpen(true)} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(15,45,58,1) 0%, rgba(46,123,207,1) 55%, rgba(226,160,63,1) 100%)"
              }}
            />
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                lineHeight: 1.1
              }}
            >
              Smart Timetable
              <Box component="span" sx={{ display: { xs: "block", sm: "inline" } }}>
                {" "}Generator
              </Box>
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" spacing={2} sx={{ display: { xs: "none", md: "flex" } }}>
            {navLinks.map((link) => (
              <Button key={link.href} color="inherit" href={link.href}>
                {link.label}
              </Button>
            ))}
          </Stack>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="secondary"
            size="small"
            sx={{ ml: { md: 2 }, px: { xs: 2, sm: 3 } }}
          >
            Admin Login
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, p: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Smart Timetable Generator
          </Typography>
          <List>
            {navLinks.map((link) => (
              <ListItemButton key={link.href} component="a" href={link.href} onClick={() => setOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
            <ListItemButton component={Link} to="/login" onClick={() => setOpen(false)}>
              <ListItemText primary="Admin Login" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          background:
            "radial-gradient(900px 500px at 10% 10%, rgba(158, 208, 255, 0.35), transparent 60%), radial-gradient(800px 500px at 85% -10%, rgba(255, 207, 137, 0.4), transparent 60%), linear-gradient(180deg, #0b1220 0%, #0f172a 100%)",
          color: "#f8fafc"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Generate Conflict-Free Timetables in Seconds
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, mb: 3 }}>
                Smart Timetable Generator System automates scheduling for classes, teachers, rooms, and labs with
                constraint-aware intelligence. Build official timetables faster and with zero conflicts.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button component={Link} to="/login" variant="contained" color="secondary">
                  Admin Login
                </Button>
                <Button variant="outlined" color="inherit" href="#features">
                  Learn More
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background:
                    "linear-gradient(160deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.6)" }}>
                  Live Preview
                </Typography>
                <Box sx={{ mt: 2, display: "grid", gap: 1 }}>
                  {["Monday", "Tuesday", "Wednesday", "Thursday"].map((day) => (
                    <Box
                      key={day}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: "rgba(15, 23, 42, 0.6)",
                        border: "1px solid rgba(255,255,255,0.08)"
                      }}
                    >
                      <Typography variant="subtitle2">{day}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        08:00–09:00 • Data Structures • LH-101
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }} id="features">
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <AutoAwesomeIcon color="primary" />
          <Typography variant="h4" fontWeight={700}>
            Features
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {features.map((feature) => (
            <Grid item xs={12} sm={6} md={4} key={feature.title}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ mb: 2, color: "primary.main" }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }} id="how">
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <TimelineIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              How It Works
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={3} key={step.title}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="overline" color="text.secondary">
                      Step {index + 1}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <TaskAltIcon color="primary" />
          <Typography variant="h4" fontWeight={700}>
            Benefits
          </Typography>
        </Stack>
        <Grid container spacing={3}>
          {benefits.map((benefit) => (
            <Grid item xs={12} sm={6} md={4} key={benefit.label}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {benefit.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Deliver reliable schedules with accurate allocation and automated checks.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ bgcolor: "background.paper", py: { xs: 6, md: 10 } }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <LabIcon color="primary" />
            <Typography variant="h4" fontWeight={700}>
              Preview
            </Typography>
          </Stack>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Timetable Grid
                  </Typography>
                  <Box
                    sx={{
                      height: 220,
                      borderRadius: 2,
                      border: "1px dashed rgba(15, 23, 42, 0.2)",
                      bgcolor: "rgba(15, 23, 42, 0.03)"
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Admin Panel
                  </Typography>
                  <Box
                    sx={{
                      height: 220,
                      borderRadius: 2,
                      border: "1px dashed rgba(15, 23, 42, 0.2)",
                      bgcolor: "rgba(15, 23, 42, 0.03)"
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 6, md: 10 },
          background:
            "linear-gradient(120deg, rgba(15,45,58,1) 0%, rgba(27,77,99,1) 45%, rgba(46,123,207,1) 100%)",
          color: "#f8fafc"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Start Generating Smart Timetables Today
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Give your institution a modern scheduling advantage with conflict-free, professional timetables.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button component={Link} to="/login" variant="contained" color="secondary" fullWidth>
                Login as Administrator
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 6 }} id="contact">
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Smart Timetable Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A final-year project demonstration platform for intelligent scheduling.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={700}>
                Quick Links
              </Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                {navLinks.map((link) => (
                  <Button key={link.href} href={link.href} color="inherit" sx={{ justifyContent: "flex-start" }}>
                    {link.label}
                  </Button>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight={700}>
                Contact
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Email: admin@smarttimetable.edu
                <br />
                Phone: +91 98765 43210
                <br />
                Address: Pune, Maharashtra
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 4 }}>
            © {new Date().getFullYear()} Smart Timetable Generator System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;
