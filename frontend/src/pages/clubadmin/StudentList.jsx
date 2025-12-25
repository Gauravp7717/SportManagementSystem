import React, { useEffect, useState } from "react";
import {
  User,
  Edit2,
  Trash2,
  Loader2,
  X,
  Mail,
  Phone,
  Filter,
  Trophy,
  Users,
  DollarSign,
  Search,
  Calendar,
} from "lucide-react";

import {
  getStudents,
  deleteStudent,
  getStudentById,
  updateStudent,
} from "../../api/studentApi";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* ================= FILTER STATE ================= */
  const [sportFilter, setSportFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [feeFilter, setFeeFilter] = useState("");

  /* ================= EDIT STATE ================= */
  const [editStudent, setEditStudent] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH STUDENTS ================= */
  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sportFilter, batchFilter, feeFilter, students, searchQuery]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await getStudents();
      if (res?.success !== false) {
        setStudents(res.data || []);
        setFilteredStudents(res.data || []);
      }
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ================= FILTER LOGIC ================= */
  const applyFilters = () => {
    let data = [...students];

    if (searchQuery) {
      data = data.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.contact?.includes(searchQuery)
      );
    }

    if (sportFilter) {
      data = data.filter((s) =>
        s.sports?.some((sport) => sport._id === sportFilter)
      );
    }

    if (batchFilter) {
      data = data.filter((s) => s.batchId && s.batchId._id === batchFilter);
    }

    if (feeFilter) {
      data = data.filter((s) => s.feeStatus === feeFilter);
    }

    setFilteredStudents(data);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    const res = await deleteStudent(id);
    if (res?.success !== false) {
      fetchStudents();
    } else {
      alert(res?.message || "Delete failed");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = async (id) => {
    const res = await getStudentById(id);
    if (res?.success !== false) {
      setEditStudent(res.data);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    const res = await updateStudent(editStudent._id, editStudent);
    setSaving(false);

    if (res?.success !== false) {
      setEditStudent(null);
      fetchStudents();
    } else {
      alert(res?.message || "Update failed");
    }
  };

  const clearFilters = () => {
    setSportFilter("");
    setBatchFilter("");
    setFeeFilter("");
    setSearchQuery("");
  };

  /* ================= FILTER OPTIONS ================= */
  const sportOptions = [
    ...new Map(
      students.flatMap((s) => s.sports || []).map((sport) => [sport._id, sport])
    ).values(),
  ];

  const batchOptions = [
    ...new Map(
      students.filter((s) => s.batchId).map((s) => [s.batchId._id, s.batchId])
    ).values(),
  ];

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-4 h-4 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300">
            <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <p className="text-gray-600 text-sm sm:text-base">
            Manage and view all registered students
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search by name, email, or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold text-gray-700">Filters</h3>
              {(sportFilter || batchFilter || feeFilter) && (
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Sport Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Trophy className="inline w-4 h-4 mr-1" />
                  Sport
                </label>
                <div className="relative">
                  <select
                    value={sportFilter}
                    onChange={(e) => setSportFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="">All Sports</option>
                    {sportOptions.map((s) => (
                      <option key={`sport-${s._id}`} value={s._id}>
                        {s.sportName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Batch Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  Batch
                </label>
                <div className="relative">
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="">All Batches</option>
                    {batchOptions.map((b) => (
                      <option key={`batch-${b._id}`} value={b._id}>
                        {b.name || b.batchName}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Fee Filter */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline w-4 h-4 mr-1" />
                  Fee Status
                </label>
                <div className="relative">
                  <select
                    value={feeFilter}
                    onChange={(e) => setFeeFilter(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300 appearance-none bg-white"
                  >
                    <option value="">All Fees</option>
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-indigo-600">
                {filteredStudents.length}
              </span>{" "}
              of <span className="font-semibold">{students.length}</span>{" "}
              students
            </p>
          </div>

          {/* Students List */}
          {loadingStudents ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
              <p className="text-gray-600">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg font-medium mb-2">
                No students found
              </p>
              <p className="text-gray-500 text-sm">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((s) => (
                <div
                  key={s._id}
                  className="group bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">
                            {s.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate">{s.email}</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300">
                              •
                            </span>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{s.contact}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="flex flex-wrap gap-2 ml-0 sm:ml-15">
                        {/* Sports Badge */}
                        {s.sports && s.sports.length > 0 && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <Trophy className="w-3 h-3" />
                            {s.sports
                              .map((sport) => sport.sportName)
                              .join(", ")}
                          </span>
                        )}

                        {/* Batch Badge */}
                        {s.batchId && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-lg">
                            <Users className="w-3 h-3" />
                            {s.batchId.name || s.batchId.batchName}
                          </span>
                        )}

                        {/* Fee Status Badge */}
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-lg ${
                            s.feeStatus === "PAID"
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          <DollarSign className="w-3 h-3" />
                          {s.feeStatus}
                        </span>

                        {/* Dates */}
                        {s.joiningDate && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg">
                            <Calendar className="w-3 h-3" />
                            Joined:{" "}
                            {new Date(s.joiningDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => handleEdit(s._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all duration-300 font-medium group-hover:shadow-md"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all duration-300 font-medium group-hover:shadow-md"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= EDIT MODAL ================= */}
      {editStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform animate-slideUp">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Edit Student
                </h3>
              </div>
              <button
                onClick={() => setEditStudent(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Name Input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    value={editStudent.name}
                    onChange={(e) =>
                      setEditStudent({ ...editStudent, name: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    value={editStudent.email}
                    onChange={(e) =>
                      setEditStudent({ ...editStudent, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300"
                  />
                </div>
              </div>

              {/* Fee Status Select */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee Status
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                  <select
                    value={editStudent.feeStatus}
                    onChange={(e) =>
                      setEditStudent({
                        ...editStudent,
                        feeStatus: e.target.value,
                      })
                    }
                    className="w-full pl-11 pr-10 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 appearance-none bg-white"
                  >
                    <option value="PAID">PAID</option>
                    <option value="UNPAID">UNPAID</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setEditStudent(null)}
                className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-5 h-5" />
                    <span>Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 20s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StudentList;
