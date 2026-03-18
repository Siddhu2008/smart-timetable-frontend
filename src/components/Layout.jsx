import React from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Class as ClassIcon,
  MeetingRoom as RoomIcon,
  Science as LabIcon,
  MenuBook as SubjectIcon,
  Tune as ConstraintIcon,
  CalendarMonth as CalendarIcon,
  TableView as TableIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext.jsx";
import { useColorMode } from "../theme.jsx";

const drawerWidth = 270;

const navSections = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> }]
  },
  {
    title: "Resources",
    items: [
      { label: "Teachers", path: "/teachers", icon: <PeopleIcon /> },
      { label: "Classes", path: "/classes", icon: <ClassIcon /> },
      { label: "Rooms", path: "/rooms", icon: <RoomIcon /> },
      { label: "Labs", path: "/labs", icon: <LabIcon /> },
      { label: "Subjects", path: "/subjects", icon: <SubjectIcon /> }
    ]
  },
  {
    title: "Scheduling",
    items: [
      { label: "Constraints", path: "/constraints", icon: <ConstraintIcon /> },
      { label: "Generate", path: "/generate", icon: <CalendarIcon /> },
      { label: "Timetables", path: "/timetables", icon: <TableIcon /> }
    ]
  }
];

const Layout = ({ children }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [desktopOpen, setDesktopOpen] = React.useState(true);
  const { logout, admin } = useAuth();
  const { mode, toggleColorMode } = useColorMode();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, pb: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            mb: 1,
            background:
              "linear-gradient(140deg, rgba(15,45,58,1) 0%, rgba(46,123,207,1) 55%, rgba(226,160,63,1) 100%)",
            boxShadow: "0 14px 30px rgba(15, 23, 42, 0.2)"
          }}
        />
        <Typography variant="subtitle1" fontWeight={700} lineHeight={1.1}>
          Smart Timetable
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Generator System
        </Typography>
      </Box>
      <Box
        sx={{
          px: 1.25,
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(15, 23, 42, 0.2)",
            borderRadius: 8
          },
          "&::-webkit-scrollbar-track": { backgroundColor: "transparent" }
        }}
      >
        {navSections.map((section) => (
          <Box key={section.title} sx={{ mb: 1.5 }}>
            <Typography
              variant="overline"
              sx={{ px: 1.25, color: "text.secondary", fontWeight: 700, letterSpacing: 1.1 }}
            >
              {section.title}
            </Typography>
            <List dense disablePadding sx={{ mt: 0.4 }}>
              {section.items.map((item) => {
                const selected = location.pathname === item.path;
                return (
                  <ListItemButton
                    key={item.path}
                    component={Link}
                    to={item.path}
                    selected={selected}
                    onClick={() => {
                      if (!isDesktop) setMobileOpen(false);
                    }}
                    sx={{
                      borderRadius: 2,
                      mb: 0.4,
                      px: 1.25,
                      minHeight: 40,
                      gap: 1.25,
                      transition: "all 180ms ease",
                      "& .MuiListItemIcon-root": {
                        minWidth: 0,
                        color: "text.secondary"
                      },
                      "& .MuiListItemText-root": {
                        margin: 0
                      },
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(135deg, rgba(15,45,58,0.15) 0%, rgba(46,123,207,0.12) 100%)",
                        color: "primary.main",
                        "& .MuiListItemIcon-root": { color: "primary.main" }
                      },
                      "&.Mui-selected:hover": {
                        background:
                          "linear-gradient(135deg, rgba(15,45,58,0.22) 0%, rgba(46,123,207,0.18) 100%)"
                      }
                    }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: 13.5,
                        fontWeight: selected ? 600 : 500
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>
      <Box sx={{ p: 1.75 }}>
        <Box
          sx={{
            p: 1.25,
            borderRadius: 2,
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? "rgba(15, 23, 42, 0.04)" : "rgba(148, 163, 184, 0.12)",
            border: (theme) =>
              theme.palette.mode === "light" ? "1px solid rgba(15, 23, 42, 0.08)" : "1px solid rgba(148, 163, 184, 0.24)"
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Signed in as
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {admin?.name || "Administrator"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {admin?.email || "admin@example.com"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      className={`app-shell${mobileOpen ? " mobile-nav-open" : ""}`}
      sx={{ display: "flex", minHeight: "100vh" }}
    >
      <AppBar
        className="app-navbar"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          width: { md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard
            })
        }}
        elevation={0}
      >
        <Toolbar sx={{ minHeight: { xs: 72, md: 78 }, gap: 2 }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => (isDesktop ? setDesktopOpen((prev) => !prev) : setMobileOpen(true))}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ lineHeight: 1 }}>
              Smart Timetable Generator
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Admin Control Center
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label={admin?.name || "Administrator"}
            sx={{
              display: { xs: "none", sm: "inline-flex" },
              color: "#fff",
              bgcolor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              fontWeight: 600
            }}
          />
          <IconButton color="inherit" onClick={toggleColorMode} sx={{ ml: 1 }}>
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <Button
            variant="contained"
            color="secondary"
            onClick={logout}
            startIcon={<LogoutIcon />}
            sx={{
              ml: 1,
              color: "#1d1403",
              bgcolor: "rgba(226,160,63,0.95)",
              display: { xs: "none", md: "inline-flex" }
            }}
          >
            Logout
          </Button>
          <IconButton color="inherit" onClick={logout} sx={{ display: { xs: "inline-flex", md: "none" } }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        className="app-sidebar"
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth }
        }}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
      <Drawer
        className="app-sidebar"
        variant="persistent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard
              }),
            overflowX: "hidden"
          }
        }}
        open={desktopOpen}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        className="app-main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, md: 3.5 },
          mt: { xs: 9, md: 10 },
          width: { md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : "100%" },
          ml: { md: desktopOpen ? `${drawerWidth}px` : 0 },
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard
            })
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
