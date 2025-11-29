import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Applayout from "./applayout/Applayout";
import Dashboard from "./pages/SuperAdmin/Dashboard";
import ClubDashboard from "./pages/clubadmin/ClubDashboard"; // Create this page for club admin
import LoginPage from "./pages/Login";
<<<<<<< Updated upstream
import TennantsList from "./pages/SuperAdmin/TennantsList";
import UsersList from "./pages/SuperAdmin/UsersList";
import AddUser from "./pages/SuperAdmin/AddUser";
import AddTennants from "./pages/SuperAdmin/AddTennants";
=======
import Student from "./pages/clubadmin/Student";
import AddCoaches from "./pages/clubadmin/AddCoaches";
import AddBatch from "./pages/clubadmin/AddBatch";
import AddSports from "./pages/clubadmin/AddSports";
import FeeSection from "./pages/clubadmin/FeeSection";
import Attendance from "./pages/clubadmin/Attendance";
// Create this page for club admin
>>>>>>> Stashed changes

export default function Router() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LoginPage />} />

      {/* SuperAdmin Protected + Layout */}
      <Route
        path="/app/*"
        element={
          <ProtectedRoute>
            <Applayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tennantslist" element={<TennantsList />} />
        <Route path="userslist" element={<UsersList />} />
        <Route path="adduser" element={<AddUser />} />
        <Route path="addtennants" element={<AddTennants />} />
      </Route>

      {/* ClubAdmin Protected + Layout */}
      <Route
        path="/club/*"
        element={
          <ProtectedRoute>
            <Applayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClubDashboard />} />
        {/* Add other clubadmin routes here */}
        <Route path="dashboard" element={<ClubDashboard />} />
        <Route path="students" element={<Student />} />
        <Route path="coaches" element={<AddCoaches />} />
        <Route path="batches" element={<AddBatch />} />
        <Route path="addsport" element={<AddSports/>} />
        <Route path="addfees" element={<FeeSection/>} />
        <Route path="attendance" element={<Attendance/>} />
        
      </Route>
    </Routes>
  );
}
