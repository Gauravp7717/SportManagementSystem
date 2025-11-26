import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  User,
  Shield,
  Building2,
  Mail,
  Calendar,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterClub, setFilterClub] = useState("ALL");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const navigate = useNavigate();

  // Sample users data
  const users = [
    {
      _id: "1",
      username: "john.doe",
      email: "john.doe@elitefitness.com",
      role: "ADMIN",
      clubId: "elitefitness",
      clubName: "Elite Fitness Club",
      isActive: true,
      createdAt: "2024-01-15T10:30:00Z",
      lastLogin: "2024-11-26T09:15:00Z",
    },
    {
      _id: "2",
      username: "sarah.manager",
      email: "sarah@downtownsports.com",
      role: "MANAGER",
      clubId: "downtownsports",
      clubName: "Downtown Sports Center",
      isActive: true,
      createdAt: "2024-02-10T09:15:00Z",
      lastLogin: "2024-11-25T14:22:00Z",
    },
    {
      _id: "3",
      username: "mike.trainer",
      email: "mike@yogawellness.com",
      role: "STAFF",
      clubId: "yogawellness",
      clubName: "Yoga Wellness Studio",
      isActive: true,
      createdAt: "2024-03-22T14:20:00Z",
      lastLogin: "2024-11-24T11:30:00Z",
    },
    {
      _id: "4",
      username: "emma.wilson",
      email: "emma@elitefitness.com",
      role: "STAFF",
      clubId: "elitefitness",
      clubName: "Elite Fitness Club",
      isActive: true,
      createdAt: "2024-04-05T08:45:00Z",
      lastLogin: "2024-11-26T08:00:00Z",
    },
    {
      _id: "5",
      username: "admin.power",
      email: "admin@powergym.com",
      role: "ADMIN",
      clubId: "powergym",
      clubName: "Power Gym",
      isActive: false,
      createdAt: "2024-04-05T08:45:00Z",
      lastLogin: "2024-10-12T10:15:00Z",
    },
    {
      _id: "6",
      username: "coach.alex",
      email: "alex@crossfitarena.com",
      role: "TRAINER",
      clubId: "crossfitarena",
      clubName: "CrossFit Arena",
      isActive: true,
      createdAt: "2024-05-18T11:00:00Z",
      lastLogin: "2024-11-23T16:45:00Z",
    },
    {
      _id: "7",
      username: "lisa.receptionist",
      email: "lisa@pilatesplus.com",
      role: "STAFF",
      clubId: "pilatesplus",
      clubName: "Pilates Plus",
      isActive: true,
      createdAt: "2024-06-12T15:30:00Z",
      lastLogin: "2024-11-26T07:20:00Z",
    },
    {
      _id: "8",
      username: "james.coach",
      email: "james@downtownsports.com",
      role: "TRAINER",
      clubId: "downtownsports",
      clubName: "Downtown Sports Center",
      isActive: true,
      createdAt: "2024-07-20T10:00:00Z",
      lastLogin: "2024-11-25T18:30:00Z",
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-purple-100 text-purple-800";
      case "TRAINER":
        return "bg-blue-100 text-blue-800";
      case "STAFF":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "ADMIN":
        return Shield;
      case "MANAGER":
        return UserCog;
      case "TRAINER":
        return User;
      case "STAFF":
        return User;
      default:
        return User;
    }
  };

  const uniqueClubs = [...new Set(users.map((u) => u.clubId))];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.clubName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || user.role === filterRole;
    const matchesClub = filterClub === "ALL" || user.clubId === filterClub;
    return matchesSearch && matchesRole && matchesClub;
  });

  const roleStats = {
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
    MANAGER: users.filter((u) => u.role === "MANAGER").length,
    TRAINER: users.filter((u) => u.role === "TRAINER").length,
    STAFF: users.filter((u) => u.role === "STAFF").length,
  };

  const handeladd = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Users Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all users across different clubs
              </p>
            </div>
            <button
              onClick={() => {
                handeladd("/app/adduser");
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roleStats.ADMIN}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserCog className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Managers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roleStats.MANAGER}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Trainers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roleStats.TRAINER}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Staff</p>
                <p className="text-2xl font-bold text-gray-900">
                  {roleStats.STAFF}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users by name, email, or club..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="MANAGER">Manager</option>
                <option value="TRAINER">Trainer</option>
                <option value="STAFF">Staff</option>
              </select>
            </div>

            {/* Club Filter */}
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterClub}
                onChange={(e) => setFilterClub(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
              >
                <option value="ALL">All Clubs</option>
                {uniqueClubs.map((clubId) => (
                  <option key={clubId} value={clubId}>
                    {users.find((u) => u.clubId === clubId)?.clubName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Club
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-teal-100 p-2 rounded-full">
                            <User className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user._id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="w-4 h-4 text-gray-400" />
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getRoleColor(
                              user.role
                            )}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {user.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.clubName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.clubId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDateTime(user.lastLogin)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === user._id ? null : user._id
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {showActionMenu === user._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                                <Edit className="w-4 h-4" />
                                Edit User
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                                <Trash2 className="w-4 h-4" />
                                Delete User
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredUsers.length}</span> of{" "}
              <span className="font-semibold">{users.length}</span> users
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
