import React, { useState } from "react";
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

const AddBatch = () => {
  const [showBatchList, setShowBatchList] = useState(false);
  const [batches, setBatches] = useState([]);
  const [editId, setEditId] = useState(null);

  // Dummy arrays (replace later with API)
  const sports = ["Cricket", "Football", "Badminton", "Basketball"];
  const coaches = ["Amit Sir", "John Coach", "Priya Madam", "Arjun Coach"];
  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [formData, setFormData] = useState({
    batchName: "",
    assignedSport: "",
    assignedCoach: "",
    startTime: "",
    endTime: "",
    capacity: "",
    days: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const toggleDay = (day) => {
    setFormData((prev) => {
      const exists = prev.days.includes(day);
      return {
        ...prev,
        days: exists ? prev.days.filter((d) => d !== day) : [...prev.days, day],
      };
    });
  };

  const validateForm = () => {
    const { batchName, assignedSport, assignedCoach, startTime, endTime, capacity, days } =
      formData;

    if (
      !batchName ||
      !assignedSport ||
      !assignedCoach ||
      !startTime ||
      !endTime ||
      !capacity ||
      days.length === 0
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill all required fields & select days.");
      return;
    }

    if (editId) {
      setBatches((prev) =>
        prev.map((b) => (b.id === editId ? { ...b, ...formData } : b))
      );
      alert("Batch updated successfully!");
      setEditId(null);
    } else {
      setBatches((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
      alert("Batch added successfully!");
    }

    setFormData({
      batchName: "",
      assignedSport: "",
      assignedCoach: "",
      startTime: "",
      endTime: "",
      capacity: "",
      days: [],
    });
  };

  const handleEdit = (batch) => {
    setFormData({ ...batch });
    setEditId(batch.id);
    setShowBatchList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this batch?")) {
      setBatches((prev) => prev.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowBatchList(!showBatchList)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm"
          >
            {showBatchList ? <UserPlus className="w-4 h-4" /> : <List className="w-4 h-4" />}
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
                <h1 className="text-2xl font-bold text-gray-800">Add / Edit Batch</h1>
              </div>
              <p className="text-sm text-gray-600">Manage batches, sports, and coaches</p>
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., Morning Batch"
                  />
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select Sport</option>
                    {sports.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Assigned Coach */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Coach <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="assignedCoach"
                    value={formData.assignedCoach}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="">Select Coach</option>
                    {coaches.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
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
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm"
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
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm"
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g., 20"
                  />
                </div>

                {/* Days */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays.map((day) => {
                      const checked = formData.days.includes(day);
                      return (
                        <label
                          key={day}
                          className={`px-3 py-2 border rounded-lg cursor-pointer text-sm ${
                            checked
                              ? "bg-indigo-50 border-indigo-300"
                              : "bg-white border-gray-300"
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
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:from-indigo-600 hover:to-purple-700"
                >
                  {editId ? "Update Batch" : "Add Batch"}
                </button>

                <button
                  onClick={() =>
                    setFormData({
                      batchName: "",
                      assignedSport: "",
                      assignedCoach: "",
                      startTime: "",
                      endTime: "",
                      capacity: "",
                      days: [],
                    })
                  }
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Batch List Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Batches List</h1>
              </div>
              <p className="text-sm text-gray-600">Manage all created batches</p>
            </div>

            {/* Batch List */}
            {batches.length === 0 ? (
              <div className="bg-white border shadow-md p-10 text-center rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">No Batches Added Yet</h3>
                <p className="text-sm text-gray-600 mb-4">Start by adding a new batch.</p>

                <button
                  onClick={() => setShowBatchList(false)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg"
                >
                  Add Batch
                </button>
              </div>
            ) : (
              <div className="bg-white border shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Batch</th>
                      <th className="px-4 py-3 text-left font-semibold">Sport</th>
                      <th className="px-4 py-3 text-left font-semibold">Coach</th>
                      <th className="px-4 py-3 text-left font-semibold">Timing</th>
                      <th className="px-4 py-3 text-left font-semibold">Days</th>
                      <th className="px-4 py-3 text-left font-semibold">Capacity</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {batches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{batch.batchName}</td>
                        <td className="px-4 py-3">{batch.assignedSport}</td>
                        <td className="px-4 py-3">{batch.assignedCoach}</td>
                        <td className="px-4 py-3">
                          {batch.startTime} - {batch.endTime}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {batch.days.map((d) => (
                              <span key={d} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {d}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">{batch.capacity}</td>

                        <td className="px-4 py-3 flex gap-3">
                          <button
                            onClick={() => handleEdit(batch)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(batch.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Footer */}
                <div className="bg-gray-50 px-4 py-3 border-t">
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
