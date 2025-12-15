import React, { useState, useEffect } from "react";
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
  Lock,
} from "lucide-react";

import {
  createCoach,
  getCoaches,
  deleteCoach,
  updateCoach,
} from "../../api/coachapi";

const AddCoaches = () => {
  const [showCoachList, setShowCoachList] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCoaches, setLoadingCoaches] = useState(true);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullname: "",
    salary: "",
  });

  // ✅ Fetch coaches on mount
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        setLoadingCoaches(true);
        const result = await getCoaches();
        if (result.success !== false) {
          setCoaches(result.data || result || []);
        }
      } catch (error) {
        console.error("Error fetching coaches:", error);
      } finally {
        setLoadingCoaches(false);
      }
    };
    fetchCoaches();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { username, password, fullname, salary } = formData;
    return username && password && fullname && salary;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert(
        "Please fill all required fields: username, password, fullname, salary"
      );
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        // ✅ Update coach
        const payload = {
          fullname: formData.fullname,
          salary: parseInt(formData.salary),
          ...(formData.password && { password: formData.password }),
        };

        const res = await updateCoach(editId, payload);

        if (res.success !== false) {
          setCoaches((prev) =>
            prev.map((c) => (c._id === editId ? { ...c, ...res.data } : c))
          );
          alert("Coach updated successfully!");
          setEditId(null);
        } else {
          alert(res.message || "Failed to update coach");
        }
      } else {
        // ✅ Create coach - EXACT backend fields
        const payload = {
          username: formData.username.toLowerCase(),
          password: formData.password,
          fullname: formData.fullname,
          salary: parseInt(formData.salary),
        };

        const res = await createCoach(payload);

        if (res.success !== false) {
          const createdCoach = res.data?.coach;
          setCoaches((prev) => [...prev, createdCoach]);
          alert(`Coach created! Password: ${res.data?.password}`);

          // Reset form
          setFormData({
            username: "",
            password: "",
            fullname: "",
            salary: "",
          });
        } else {
          alert(res.message || "Failed to create coach");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save coach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      username: "",
      password: "",
      fullname: "",
      salary: "",
    });
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coach?")) return;

    setLoading(true);
    try {
      const result = await deleteCoach(id);
      if (result.success !== false) {
        setCoaches((prev) => prev.filter((c) => c._id !== id));
        alert("Coach deleted successfully.");
      } else {
        alert(result.message || "Failed to delete coach");
      }
    } catch (error) {
      console.error("Error deleting coach:", error);
      alert("Failed to delete coach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (coach) => {
    setFormData({
      username: coach.username,
      fullname: coach.fullname,
      salary: coach.salary,
      password: "", // Don't prefill password
    });
    setEditId(coach._id);
    setShowCoachList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loadingCoaches) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading coaches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowCoachList(!showCoachList)}
            disabled={loading}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm disabled:opacity-60"
          >
            {showCoachList ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
            {showCoachList ? "Add Coach" : "View Coach List"}
          </button>
        </div>

        {!showCoachList ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <User className="w-12 h-12 text-indigo-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Add New Coach
                  </h1>
                  <p className="text-gray-600">
                    Create a new coach account for your academy
                  </p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    disabled={!!editId}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="coach_username"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Salary (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      placeholder="50000"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : editId ? (
                    "Update Coach"
                  ) : (
                    "Create Coach"
                  )}
                </button>
                <button
                  onClick={handleClear}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all shadow-sm disabled:opacity-60"
                >
                  {editId ? "Cancel Edit" : "Clear Form"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Coaches List Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <List className="w-12 h-12 text-indigo-600" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Coaches List
                  </h1>
                  <p className="text-gray-600">
                    Manage all your academy coaches ({coaches.length})
                  </p>
                </div>
              </div>
            </div>

            {/* Coaches Table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {coaches.length === 0 ? (
                <div className="text-center py-16">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No coaches found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Create your first coach to get started
                  </p>
                  <button
                    onClick={() => setShowCoachList(false)}
                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-all"
                  >
                    Add First Coach
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Coach
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                          Salary
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Username
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {coaches.map((coach) => (
                        <tr
                          key={coach._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-white" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-semibold text-gray-900">
                                  {coach.fullname}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Coach
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden md:table-cell">
                            <div className="flex items-center">
                              <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                              <span className="text-sm font-medium text-gray-900">
                                ₹{coach.salary?.toLocaleString()}
                              </span>
                              <span className="text-xs text-gray-500 ml-1">
                                /month
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden lg:table-cell">
                            <div className="flex items-center">
                              <Lock className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
                                {coach.username}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(coach)}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all hover:scale-105"
                                title="Edit coach"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(coach._id)}
                                disabled={loading}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-105 disabled:opacity-50"
                                title="Delete coach"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddCoaches;
