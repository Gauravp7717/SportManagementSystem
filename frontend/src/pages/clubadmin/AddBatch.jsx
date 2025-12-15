import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  User,
  UserPlus,
  List,
  Edit2,
  Trash2,
  Layers,
} from "lucide-react";
import { createBatch, deleteBatch } from "../../api/batchapi"; // ✅ FIXED: Added getBatches import
import { getSports } from "../../api/clubadminapi";
import { getCoaches } from "../../api/coachapi";

const AddBatch = () => {
  const [showBatchList, setShowBatchList] = useState(false);
  const [batches, setBatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingCoaches, setLoadingCoaches] = useState(true);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // ✅ FIXED: assignedCoach is now ARRAY
  const [formData, setFormData] = useState({
    batchName: "",
    sportId: "",
    assignedCoach: [], // ✅ FIXED: Array instead of string
    batchStartTime: "",
    batchEndTime: "",
    capacity: "",
    schedule: [],
  });

  // Fetch sports
  useEffect(() => {
    const fetchSports = async () => {
      try {
        setLoadingSports(true);
        const result = await getSports();
        if (result.success !== false) {
          setSports(result.data || result || []);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      } finally {
        setLoadingSports(false);
      }
    };
    fetchSports();
  }, []);

  // Fetch coaches
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

  // Fetch batches when showing list
  useEffect(() => {
    if (showBatchList) {
      fetchBatches();
    }
  }, [showBatchList]);

  const fetchBatches = async () => {
    try {
      const result = await getBatches();
      if (result.success !== false) {
        setBatches(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  // ✅ FIXED: Regular handleChange for text/number fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ✅ NEW: Coach toggle handler (prevents double array)
  const toggleCoach = (coachId) => {
    setFormData((prev) => {
      const currentCoaches = Array.isArray(prev.assignedCoach)
        ? prev.assignedCoach
        : [];
      const isSelected = currentCoaches.includes(coachId);

      const newCoaches = isSelected
        ? currentCoaches.filter((id) => id !== coachId)
        : [...currentCoaches, coachId];

      console.log("🔧 Coaches updated:", newCoaches); // Debug
      return { ...prev, assignedCoach: newCoaches };
    });
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.schedule.includes(day);
      return {
        ...prev,
        schedule: exists
          ? prev.schedule.filter((d) => d !== day)
          : [...prev.schedule, day],
      };
    });
  };

  // ✅ FIXED: Validation for array coaches
  const validateForm = () => {
    const {
      batchName,
      sportId,
      assignedCoach,
      batchStartTime,
      batchEndTime,
      capacity,
      schedule,
    } = formData;

    if (
      !batchName.trim() ||
      !sportId ||
      !assignedCoach ||
      assignedCoach.length === 0 || // ✅ FIXED: Array check
      !batchStartTime ||
      !batchEndTime ||
      !capacity ||
      parseInt(capacity) < 1 ||
      schedule.length === 0
    ) {
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      batchName: "",
      sportId: "",
      assignedCoach: [], // ✅ FIXED: Reset to empty array
      batchStartTime: "",
      batchEndTime: "",
      capacity: "",
      schedule: [],
    });
    setEditId(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert(
        "Please fill all required fields & select at least one coach and day."
      );
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Sending payload:", formData);
      const payload = {
        batchName: formData.batchName.trim(),
        capacity: parseInt(formData.capacity),
        batchStartTime: formData.batchStartTime,
        batchEndTime: formData.batchEndTime,
        sportId: formData.sportId,
        coaches: formData.assignedCoach, // ✅ FIXED: Direct array (no wrapping)
        students: [],
        schedule: formData.schedule,
      };

      console.log("📦 Final payload:", payload);

      const res = await createBatch(payload);

      if (res.success !== false) {
        alert("✅ Batch created successfully!");
        resetForm();
        if (showBatchList) {
          fetchBatches();
        }
      } else {
        alert(res.message || "Failed to create batch");
      }
    } catch (error) {
      console.error("❌ Create batch error:", error);
      const message =
        error.message || "Failed to save batch. Please try again.";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: handleEdit for multiple coaches
  const handleEdit = (batch) => {
    setFormData({
      batchName: batch.batchName || "",
      sportId: batch.sportId?._id || batch.sportId || "",
      assignedCoach: Array.isArray(batch.coaches)
        ? batch.coaches.map((c) => c._id || c)
        : [batch.assignedCoach || ""], // ✅ FIXED: Handle array
      batchStartTime: batch.batchStartTime || batch.startTime || "",
      batchEndTime: batch.batchEndTime || batch.endTime || "",
      capacity: batch.capacity || "",
      schedule: batch.schedule || batch.days || [],
    });
    setEditId(batch._id || batch.id);
    setShowBatchList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this batch?")) return;

    setLoading(true);
    try {
      const result = await deleteBatch(id);
      if (result.success !== false) {
        setBatches((prev) => prev.filter((b) => b._id !== id && b.id !== id));
        alert("✅ Batch deleted successfully.");
      } else {
        alert(result.message || "Failed to delete batch");
      }
    } catch (error) {
      console.error("❌ Delete batch error:", error);
      alert("Failed to delete batch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ JSX (Coaches section updated with toggleCoach)
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowBatchList(!showBatchList)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            {showBatchList ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
            {showBatchList ? "Add Batch" : "View Batches"}
          </button>
        </div>

        {!showBatchList ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Add / Edit Batch
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Manage batches, sports, and coaches
              </p>
            </div>

            {/* Form */}
            <div className="bg-white border border-gray-200 shadow p-6 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Batch Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="batchName"
                    value={formData.batchName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Morning Batch"
                  />
                </div>

                {/* Sport Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Sport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="sportId"
                    value={formData.sportId}
                    onChange={handleChange}
                    disabled={loadingSports}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">
                      {loadingSports ? "Loading sports..." : "Select Sport"}
                    </option>
                    {sports.map((sport) => (
                      <option key={sport._id} value={sport._id}>
                        {sport.sportName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ FIXED: Multi Coach Selector */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Coaches <span className="text-red-500">*</span>{" "}
                    (Select multiple)
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    {coaches.map((coach) => {
                      const coachId = coach._id;
                      const isSelected =
                        formData.assignedCoach?.includes(coachId);
                      return (
                        <label
                          key={coachId}
                          className={`flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer w-full ${
                            isSelected
                              ? "bg-indigo-50 border border-indigo-200"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                            checked={isSelected}
                            onChange={() => toggleCoach(coachId)} // ✅ FIXED: Custom handler
                          />
                          <span className="text-sm text-gray-700 select-none">
                            {coach.fullname ||
                              coach.fullName ||
                              coach.name ||
                              "Unnamed Coach"}
                          </span>
                        </label>
                      );
                    })}
                    {loadingCoaches && (
                      <div className="flex items-center p-2 text-sm text-gray-500">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                        Loading coaches...
                      </div>
                    )}
                  </div>
                  {formData.assignedCoach?.length > 0 && (
                    <p className="mt-1 text-sm text-indigo-600">
                      {formData.assignedCoach.length} coach
                      {formData.assignedCoach.length > 1 ? "es" : ""} selected
                    </p>
                  )}
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="batchStartTime"
                      value={formData.batchStartTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="time"
                      name="batchEndTime"
                      value={formData.batchEndTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 20"
                  />
                </div>

                {/* Days */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days <span className="text-red-500">*</span> (Select at
                    least one)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const checked = formData.schedule.includes(day);
                      return (
                        <label
                          key={day}
                          className={`px-3 py-2 border rounded-lg cursor-pointer text-sm transition-all ${
                            checked
                              ? "bg-indigo-100 border-indigo-300 text-indigo-800 shadow-sm"
                              : "bg-white border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={checked}
                            onChange={() => toggleDay(day)}
                          />
                          {day}
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading || loadingSports || loadingCoaches}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:from-indigo-600 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                >
                  {loading
                    ? "Saving..."
                    : editId
                    ? "Update Batch"
                    : "Add Batch"}
                </button>

                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-60 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        ) : (
          // Batch List (unchanged - perfect)
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Batches List
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Manage all created batches
              </p>
            </div>

            {batches.length === 0 ? (
              <div className="bg-white border shadow-md p-10 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No Batches Added Yet
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Start by adding a new batch.
                </p>
                <button
                  onClick={() => setShowBatchList(false)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all"
                >
                  Add Batch
                </button>
              </div>
            ) : (
              <div className="bg-white border shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Batch
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Sport
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Coaches
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Timing
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Days
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Capacity
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {batches.map((batch) => (
                        <tr
                          key={batch._id || batch.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {batch.batchName}
                          </td>
                          <td className="px-6 py-4">
                            {batch.sportId?.sportName ||
                              batch.assignedSport ||
                              "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {Array.isArray(batch.coaches) &&
                            batch.coaches.length > 0
                              ? batch.coaches
                                  .map(
                                    (c) =>
                                      c.fullname ||
                                      c.fullName ||
                                      c.name ||
                                      "Coach"
                                  )
                                  .join(", ")
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            {batch.batchStartTime || batch.startTime} -{" "}
                            {batch.batchEndTime || batch.endTime}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1 flex-wrap">
                              {(batch.schedule || batch.days || []).map((d) => (
                                <span
                                  key={d}
                                  className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {batch.capacity}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(batch)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(batch._id || batch.id)
                                }
                                className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-lg transition-all"
                                title="Delete"
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
                <div className="bg-gray-50 px-6 py-4 border-t text-sm text-gray-700 font-medium">
                  Total Batches: {batches.length}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AddBatch;
