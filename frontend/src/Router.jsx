import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Applayout from "./applayout/Applayout";
import Dashboard from "./pages/SuperAdmin/Dashboard";
import ClubDashboard from "./pages/clubadmin/ClubDashboard"; // Create this page for club admin
import LoginPage from "./pages/Login";
import TennantsList from "./pages/SuperAdmin/TennantsList";
import UsersList from "./pages/SuperAdmin/UsersList";
import AddUser from "./pages/SuperAdmin/AddUser";
import AddTennants from "./pages/SuperAdmin/AddTennants";

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
      </Route>
    </Routes>
  );
}
