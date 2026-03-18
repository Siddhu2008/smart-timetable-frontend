import axios from "axios";

// Prefer env override; fall back to deployed backend in production and localhost in dev.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://smart-timetable-backend-ru9m.onrender.com"
    : "http://localhost:5000");

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});
