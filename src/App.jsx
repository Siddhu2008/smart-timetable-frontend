import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Teachers from "./pages/Teachers.jsx";
import Classes from "./pages/Classes.jsx";
import Rooms from "./pages/Rooms.jsx";
import Labs from "./pages/Labs.jsx";
import Subjects from "./pages/Subjects.jsx";
import Constraints from "./pages/Constraints.jsx";
import GenerateTimetable from "./pages/GenerateTimetable.jsx";
import TimetablePreview from "./pages/TimetablePreview.jsx";
import Timetables from "./pages/Timetables.jsx";

const App = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <Layout>
              <Teachers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <Layout>
              <Classes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <Layout>
              <Rooms />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/labs"
        element={
          <ProtectedRoute>
            <Layout>
              <Labs />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/subjects"
        element={
          <ProtectedRoute>
            <Layout>
              <Subjects />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/constraints"
        element={
          <ProtectedRoute>
            <Layout>
              <Constraints />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate"
        element={
          <ProtectedRoute>
            <Layout>
              <GenerateTimetable />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetable/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <TimetablePreview />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/timetables"
        element={
          <ProtectedRoute>
            <Layout>
              <Timetables />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  </AuthProvider>
);

export default App;
