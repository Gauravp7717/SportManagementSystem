import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import { useAuth } from "../context/Authprovider";
import SuperAdminSidebar from "../components/SuperAdminSidebar";
import ClubAdminSidebar from "../components/ClubAdminSidebar";

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // If not logged in → go to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  let SidebarComponent = null;

  // Correct backend roles:
  // SUPER_ADMIN & CLUB_ADMIN
  const role = user.role;

  if (role === "SUPER_ADMIN") {
    SidebarComponent = SuperAdminSidebar;
  } else if (role === "CLUB_ADMIN") {
    SidebarComponent = ClubAdminSidebar;
  } else {
    return <Navigate to="/" replace />;
  }

  // Auto-correct wrong route access
  const path = location.pathname;

  if (role === "SUPER_ADMIN" && !path.startsWith("/app")) {
    return <Navigate to="/app" replace />;
  }

  if (role === "CLUB_ADMIN" && !path.startsWith("/club")) {
    return <Navigate to="/club" replace />;
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      {/* Sidebar */}
      <div className="fixed top-[64px] left-0 w-64 h-[calc(100vh-64px)] bg-white z-40 overflow-y-auto sidebar-hidden-scroll">
        <SidebarComponent />
      </div>

      {/* Page Content */}
      <main
        className="
          ml-60 
          mt-[64px]
          h-[calc(100vh-64px)]
          overflow-y-auto
          p-6
          bg-white
        "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
