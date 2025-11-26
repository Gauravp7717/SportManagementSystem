import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Plus,
  Building2,
  Globe,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TennantsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const navigate = useNavigate();

  // Sample clubs data
  const clubs = [
    {
      _id: "1",
      name: "Elite Fitness Club",
      subdomain: "elitefitness",
      plan: "PRO",
      status: "ACTIVE",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-11-20T14:22:00Z",
      metadata: { members: 245, revenue: 125000 },
    },
    {
      _id: "2",
      name: "Downtown Sports Center",
      subdomain: "downtownsports",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      createdAt: "2024-02-10T09:15:00Z",
      updatedAt: "2024-11-25T11:45:00Z",
      metadata: { members: 580, revenue: 350000 },
    },
    {
      _id: "3",
      name: "Yoga Wellness Studio",
      subdomain: "yogawellness",
      plan: "BASIC",
      status: "ACTIVE",
      createdAt: "2024-03-22T14:20:00Z",
      updatedAt: "2024-11-18T16:30:00Z",
      metadata: { members: 120, revenue: 45000 },
    },
    {
      _id: "4",
      name: "Power Gym",
      subdomain: "powergym",
      plan: "FREE",
      status: "INACTIVE",
      createdAt: "2024-04-05T08:45:00Z",
      updatedAt: "2024-10-12T10:15:00Z",
      metadata: { members: 35, revenue: 0 },
    },
    {
      _id: "5",
      name: "CrossFit Arena",
      subdomain: "crossfitarena",
      plan: "PRO",
      status: "SUSPENDED",
      createdAt: "2024-05-18T11:00:00Z",
      updatedAt: "2024-11-10T09:20:00Z",
      metadata: { members: 180, revenue: 95000 },
    },
    {
      _id: "6",
      name: "Pilates Plus",
      subdomain: "pilatesplus",
      plan: "BASIC",
      status: "ACTIVE",
      createdAt: "2024-06-12T15:30:00Z",
      updatedAt: "2024-11-22T13:10:00Z",
      metadata: { members: 95, revenue: 38000 },
    },
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "INACTIVE":
        return "bg-gray-100 text-gray-800";
      case "SUSPENDED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "FREE":
        return "bg-slate-100 text-slate-800";
      case "BASIC":
        return "bg-blue-100 text-blue-800";
      case "PRO":
        return "bg-purple-100 text-purple-800";
      case "ENTERPRISE":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClubs = clubs.filter((club) => {
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.subdomain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "ALL" || club.status === filterStatus;
    const matchesPlan = filterPlan === "ALL" || club.plan === filterPlan;
    return matchesSearch && matchesStatus && matchesPlan;
  });

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
                Clubs Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all registered clubs and tenants
              </p>
            </div>
            <button
              onClick={() => {
                handeladd("/app/addtennants");
              }}
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Club
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clubs by name or subdomain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
              >
                <option value="ALL">All Plans</option>
                <option value="FREE">Free</option>
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total Clubs</p>
            <p className="text-2xl font-bold text-gray-900">{clubs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-600">
              {clubs.filter((c) => c.status === "ACTIVE").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Inactive</p>
            <p className="text-2xl font-bold text-gray-600">
              {clubs.filter((c) => c.status === "INACTIVE").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Suspended</p>
            <p className="text-2xl font-bold text-red-600">
              {clubs.filter((c) => c.status === "SUSPENDED").length}
            </p>
          </div>
        </div>

        {/* Clubs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Club Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Subdomain
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Members
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Revenue
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
                {filteredClubs.map((club) => (
                  <tr
                    key={club._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <Building2 className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {club.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            ID: {club._id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700 font-medium">
                          {club.subdomain}
                        </span>
                        <span className="text-gray-400">.mxs.com</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(
                          club.plan
                        )}`}
                      >
                        {club.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          club.status
                        )}`}
                      >
                        {club.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-semibold">
                        {club.metadata.members}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <p className="text-gray-900 font-semibold">
                          ₹{club.metadata.revenue.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(club.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setShowActionMenu(
                              showActionMenu === club._id ? null : club._id
                            )
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {showActionMenu === club._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                              <Eye className="w-4 h-4" />
                              View Details
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                              <Edit className="w-4 h-4" />
                              Edit Club
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600">
                              <Trash2 className="w-4 h-4" />
                              Delete Club
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredClubs.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No clubs found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredClubs.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredClubs.length}</span> of{" "}
              <span className="font-semibold">{clubs.length}</span> clubs
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
