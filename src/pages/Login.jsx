import React, { useState } from "react";
import { Box, Button, Card, CardContent, Chip, Divider, TextField, Typography } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingOverlay from "../components/LoadingOverlay.jsx";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading, token } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (!result.ok) setError(result.message);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        p: 2
      }}
    >
      <LoadingOverlay open={loading} />
      <Card
        sx={{
          width: { xs: "100%", md: 920 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr" },
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            color: "#f8fafc",
            background:
              "linear-gradient(135deg, rgba(15,45,58,1) 0%, rgba(17,78,99,1) 45%, rgba(46,123,207,1) 100%)"
          }}
        >
          <Chip
            label="Admin Portal"
            size="small"
            sx={{
              bgcolor: "rgba(255,255,255,0.18)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
              fontWeight: 600
            }}
          />
          <Typography variant="h4" fontWeight={700} sx={{ mt: 3 }}>
            Smart Timetable Generator
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.5, opacity: 0.85 }}>
            Generate conflict-free schedules, manage constraints, and keep academic resources in sync.
          </Typography>
          <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.2)" }} />
          {[
            "Secure JWT-based authentication",
            "Automated timetable generation",
            "Manual edits with audit-ready exports"
          ].map((item) => (
            <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <CheckIcon fontSize="small" />
              <Typography variant="body2">{item}</Typography>
            </Box>
          ))}
        </Box>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Admin Login
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sign in to continue managing your institution timetable.
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign in
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
