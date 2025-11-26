import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom"; // ✅ IMPORTANT FIX

const SuperAdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/app", // SUPER ADMIN dashboard root
    },
    {
      name: "Users",
      icon: Users,
      dropdown: [
        { name: "User List", path: "/app/userslist" }, // ROUTES MUST BE UNDER /app
      ],
    },
    {
      name: "Tenants",
      icon: Building2,
      path: "/app/tennantslist",
    },
  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Sidebar Body */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <div key={item.name} className="mb-1">
            {/* Top-Level Menu Button */}
            <div
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 group cursor-pointer"
              onClick={() => (item.dropdown ? toggleDropdown(item.name) : null)}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />

                {/* NORMAL LINK (no dropdown) */}
                {!item.dropdown && (
                  <Link to={item.path} className="font-medium text-sm">
                    {item.name}
                  </Link>
                )}

                {/* DROPDOWN TITLE (NO NAVIGATION) */}
                {item.dropdown && (
                  <span className="font-medium text-sm cursor-pointer">
                    {item.name}
                  </span>
                )}
              </div>

              {item.dropdown &&
                (openDropdown === item.name ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ))}
            </div>

            {/* Dropdown Items */}
            {item.dropdown && openDropdown === item.name && (
              <div className="ml-8 mt-1 space-y-1 animate-slideDown">
                {item.dropdown.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.path}
                    className="block w-full px-4 py-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded-lg transition-all duration-200 text-sm"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Version 1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 hover:text-white hover:border-emerald-500/50 transition-all shadow-lg"
        aria-label="Toggle sidebar menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 h-screen border-r border-slate-700/50
          transform transition-transform duration-300 ease-in-out
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <SidebarContent />
      </aside>

      {/* Animation Style */}
      <style>
        {`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.2s ease-out;
          }
        `}
      </style>
    </>
  );
};

export default SuperAdminSidebar;
