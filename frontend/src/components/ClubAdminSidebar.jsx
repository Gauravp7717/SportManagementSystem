import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  BathIcon,
  BatteryCharging,
  PlusSquare,
  BadgeIndianRupee,
  CalendarCheck,
  IndianRupeeIcon,
  Clock1,
  Clock3,
  UserCheck2,
} from "lucide-react";

const ClubAdminSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Students",
      icon: Users,
      path : "/students",
    },
    {
      name: "Coaches",
      icon: UserCheck2,
      path: "/coaches",
    },
    {
      name :"Batches",
      icon : Clock3,
      path : "/batches"
    },
    {
      name : "Add Sport",
      icon : PlusSquare,
      path : "/addsport"
    },
    {
      name: "Fees",
      icon: IndianRupeeIcon,
      path: "/addfees"
    },
    {
      name : "Attendance",
      icon : CalendarCheck,
      path : "/attendance"
    }



  ];

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center space-x-3">
          <div>
            {/* <h1 className="text-lg font-semibold text-white">MxS Finance</h1> */}
            <p className="text-xs text-emerald-400 font-medium">Club Admin</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => (
          <div key={item.name} className="mb-1">
            <NavLink
               to={`/club${item.path}`}
                className={({ isActive }) =>
                `w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                   isActive
                ? "bg-slate-800 text-white"
               : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                               }`
                           }
                         >

              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {item.dropdown &&
                (openDropdown === item.name ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                ))}
            </NavLink>

            {/* Dropdown Items */}
            {item.dropdown && openDropdown === item.name && (
              <div className="ml-8 mt-1 space-y-1 animate-slideDown">
                {item.dropdown.map((subItem) => (
                  <button
                    key={subItem.name}
                    className="w-full text-left px-4 py-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/30 rounded-lg transition-all duration-200 text-sm"
                  >
                    {subItem.name}
                  </button>
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

export default ClubAdminSidebar;
