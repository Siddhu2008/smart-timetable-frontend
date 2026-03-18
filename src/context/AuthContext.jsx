import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("admin");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.response?.data?.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ token, admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
