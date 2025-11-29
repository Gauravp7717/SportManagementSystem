import React, { useState } from "react";
import {
  UserPlus,
  User,
  Calendar,
  Phone,
  DollarSign,
  Clock,
  List,
  Edit2,
  Trash2,
  Award,
  FileText,
} from "lucide-react";

const AddCoaches = () => {
  const [showCoachList, setShowCoachList] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    assignedSport: "",
    salary: "",
    contactNumber: "",
    joiningDate: "",
    experienceYears: "",
    age: "",
    gender: "",
    assignedBatches: [], // multiple
    qualification: "",
  });

  // Predefined lists (you can expand later or fetch from API)
  const sports = ["Cricket", "Football", "Badminton", "Basketball"];
  const batches = [
    "Morning Batch (6AM - 8AM)",
    "Evening Batch (5PM - 7PM)",
    "Weekend Batch (8AM - 10AM)",
  ];
  const genders = ["Male", "Female", "Other", "Prefer not to say"];

  const sportColors = {
    Cricket: "bg-emerald-100 text-emerald-700",
    Football: "bg-blue-100 text-blue-700",
    Badminton: "bg-purple-100 text-purple-700",
    Basketball: "bg-orange-100 text-orange-700",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBatchToggle = (batch) => {
    setFormData((prev) => {
      const exists = prev.assignedBatches.includes(batch);
      return {
        ...prev,
        assignedBatches: exists
          ? prev.assignedBatches.filter((b) => b !== batch)
          : [...prev.assignedBatches, batch],
      };
    });
  };

  const validateForm = () => {
    const {
      fullName,
      assignedSport,
      salary,
      contactNumber,
      joiningDate,
      experienceYears,
      age,
      gender,
      assignedBatches,
      qualification,
    } = formData;

    if (
      !fullName ||
      !assignedSport ||
      !salary ||
      !contactNumber ||
      !joiningDate ||
      !experienceYears ||
      !age ||
      !gender ||
      assignedBatches.length === 0 ||
      !qualification
    ) {
      return false;
    }
    // contact number basic check
    if (!/^\d{10}$/.test(contactNumber)) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly (10-digit contact, batches selection).");
      return;
    }

    if (editId) {
      // update
      setCoaches((prev) =>
        prev.map((c) => (c.id === editId ? { ...c, ...formData } : c))
      );
      alert("Coach updated successfully!");
      setEditId(null);
    } else {
      // add
      const newCoach = {
        id: Date.now(),
        ...formData,
      };
      setCoaches((prev) => [...prev, newCoach]);
      alert("Coach added successfully!");
    }

    // reset
    setFormData({
      fullName: "",
      assignedSport: "",
      salary: "",
      contactNumber: "",
      joiningDate: "",
      experienceYears: "",
      age: "",
      gender: "",
      assignedBatches: [],
      qualification: "",
    });
  };

  const handleClear = () => {
    setFormData({
      fullName: "",
      assignedSport: "",
      salary: "",
      contactNumber: "",
      joiningDate: "",
      experienceYears: "",
      age: "",
      gender: "",
      assignedBatches: [],
      qualification: "",
    });
    setEditId(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coach?")) {
      setCoaches((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (coach) => {
    setFormData({
      fullName: coach.fullName,
      assignedSport: coach.assignedSport,
      salary: coach.salary,
      contactNumber: coach.contactNumber,
      joiningDate: coach.joiningDate,
      experienceYears: coach.experienceYears,
      age: coach.age,
      gender: coach.gender,
      assignedBatches: coach.assignedBatches || [],
      qualification: coach.qualification,
    });
    setEditId(coach.id);
    setShowCoachList(false); // open form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCoachList(!showCoachList)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            {showCoachList ? <UserPlus className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {showCoachList ? "Add Coach" : "View Coach List"}
          </button>
        </div>

        {!showCoachList ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Add / Edit Coach</h1>
              </div>
              <p className="text-sm text-gray-600">Add coaches and assign them to sports & batches</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="Enter coach full name"
                    />
                  </div>
                </div>

                {/* Assigned Sport */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Sport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assignedSport"
                    value={formData.assignedSport}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-white"
                  >
                    <option value="">Select a sport</option>
                    {sports.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      min="0"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="10-digit mobile number"
                    />
                  </div>
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Experience Years */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience (Years) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                      min="0"
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all bg-white"
                  >
                    <option value="">Select gender</option>
                    {genders.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assigned Batches (multi) */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Batch(es) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {batches.map((batch) => {
                      const checked = formData.assignedBatches.includes(batch);
                      return (
                        <label
                          key={batch}
                          className={`flex items-center gap-2 px-3 py-2 border ${
                            checked ? "bg-indigo-50 border-indigo-300" : "bg-white border-gray-200"
                          } rounded-lg cursor-pointer text-sm`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleBatchToggle(batch)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">{batch}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Qualification */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification / Certificate <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Award className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                      placeholder="e.g., B.P.Ed / Level 1 Coaching Certificate"
                    />
                  </div>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md"
                >
                  {editId ? "Update Coach" : "Add Coach"}
                </button>

                <button
                  onClick={handleClear}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> All fields marked with <span className="text-red-500">*</span> are required. Make sure contact number is 10 digits.
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Coach List Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Coach List</h1>
              </div>
              <p className="text-sm text-gray-600">View and manage all coaches</p>
            </div>

            {/* Coach List */}
            {coaches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
                <div className="max-w-sm mx-auto">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Coaches Added Yet</h3>
                  <p className="text-sm text-gray-600 mb-4">Start by adding your first coach to the club</p>
                  <button
                    onClick={() => setShowCoachList(false)}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all inline-flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Add Coach
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Sport</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Batches</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Experience</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Salary</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Qualification</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {coaches.map((coach) => (
                        <tr key={coach.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{coach.fullName.charAt(0)}</span>
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{coach.fullName}</div>
                                <div className="text-xs text-gray-500">{coach.gender} • {coach.age} yrs</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${sportColors[coach.assignedSport] || "bg-gray-100 text-gray-800"}`}>
                              {coach.assignedSport}
                            </span>
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">
                            {coach.assignedBatches && coach.assignedBatches.length ? (
                              <div className="flex flex-wrap gap-2">
                                {coach.assignedBatches.map((b) => (
                                  <span key={b} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{b}</span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Not assigned</span>
                            )}
                          </td>

                          <td className="px-4 py-3 text-sm text-gray-700">{coach.experienceYears} yrs</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{coach.contactNumber}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">₹{coach.salary}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{coach.qualification}</td>

                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex gap-3">
                            <button
                              onClick={() => handleEdit(coach)}
                              className="text-indigo-600 hover:text-indigo-900 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDelete(coach.id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total Coaches: <span className="font-semibold text-gray-800">{coaches.length}</span>
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddCoaches;
