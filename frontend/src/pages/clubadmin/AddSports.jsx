import React, { useState } from "react";
import {
  List,
  PlusCircle,
  Edit2,
  Trash2,
  Gamepad2,
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Sports = () => {
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  const [sports, setSports] = useState([]);

  const [formData, setFormData] = useState({
    sportName: "",
    description: "",
    icon: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const validateForm = () => {
    const { sportName, description, icon } = formData;
    if (!sportName || !description || !icon) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    if (editId) {
      // Update existing sport
      setSports((prev) =>
        prev.map((s) => (s.id === editId ? { ...formData, id: editId } : s))
      );
      alert("Sport updated successfully!");
      setEditId(null);
    } else {
      // Add new sport
      setSports((prev) => [...prev, { id: Date.now(), ...formData }]);
      alert("Sport added successfully!");
    }

    // Reset form
    setFormData({
      sportName: "",
      description: "",
      icon: "",
      status: "Active",
    });
  };

  const handleEdit = (sport) => {
    setFormData({
      sportName: sport.sportName,
      description: sport.description,
      icon: sport.icon,
      status: sport.status,
    });

    setEditId(sport.id);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this sport?")) {
      setSports((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Toggle Btn */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowList(!showList)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
          >
            {showList ? <PlusCircle className="w-4 h-4" /> : <List className="w-4 h-4" />}
            {showList ? "Add Sport" : "View Sports"}
          </button>
        </div>

        {/* ADD / EDIT Sports Form */}
        {!showList ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Add / Edit Sport</h1>
              </div>
              <p className="text-sm text-gray-600">
                Create sports that will be available in your academy.
              </p>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 shadow p-6 space-y-5">

              {/* Sport Name */}
              <div>
                <label className="text-sm font-medium text-gray-700">Sport Name *</label>
                <input
                  type="text"
                  name="sportName"
                  value={formData.sportName}
                  onChange={handleChange}
                  placeholder="e.g., Cricket"
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              {/* Icon Selector */}
<div>
  <label className="text-sm font-medium text-gray-700">Sport Icon *</label>

  {/* Selected Icon Preview */}
  {formData.icon && (
    <div className="mb-2 flex items-center gap-2">
      <span className="text-2xl">{formData.icon}</span>
      <span className="text-sm text-gray-600">Selected Icon</span>
    </div>
  )}

  <select
    name="icon"
    value={formData.icon}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
  >
    <option value="">Select Icon</option>
    <option value="🏏">🏏 Cricket</option>
    <option value="⚽">⚽ Football</option>
    <option value="🏸">🏸 Badminton</option>
    <option value="🏀">🏀 Basketball</option>
    <option value="🎾">🎾 Tennis</option>
    <option value="🏊">🏊 Swimming</option>
    <option value="🏃">🏃 Running</option>
    <option value="🏐">🏐 Volleyball</option>
    <option value="🏓">🏓 Table Tennis</option>
  </select>

  {/* Manual Entry Option */}
  <input
    type="text"
    name="icon"
    value={formData.icon}
    onChange={handleChange}
    placeholder="Or type your own icon"
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
  />
</div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short description about the sport..."
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-sm"
                  rows="3"
                ></textarea>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium text-gray-700">Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium shadow hover:from-indigo-600 hover:to-purple-700"
                >
                  {editId ? "Update Sport" : "Add Sport"}
                </button>

                <button
                  onClick={() =>
                    setFormData({
                      sportName: "",
                      description: "",
                      icon: "",
                      status: "Active",
                    })
                  }
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* SPORTS LIST */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
                  <List className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Sports List</h1>
              </div>
              <p className="text-sm text-gray-600">Manage all sports in your academy.</p>
            </div>

            {sports.length === 0 ? (
              <div className="bg-white border shadow p-10 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-gray-800">No Sports Added</h3>
                <p className="text-sm text-gray-600 mb-4">Start by adding a sport.</p>

                <button
                  onClick={() => setShowList(false)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Sport
                </button>
              </div>
            ) : (
              <div className="bg-white border shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Sport</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sports.map((sport) => (
                      <tr key={sport.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          <span className="text-xl">{sport.icon}</span>
                          <div>
                            <p className="font-medium text-gray-800">{sport.sportName}</p>
                            <p className="text-xs text-gray-500">{sport.description}</p>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          {sport.status === "Active" ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="w-4 h-4" /> Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle className="w-4 h-4" /> Inactive
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 flex gap-3">
                          <button
                            onClick={() => handleEdit(sport)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(sport.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="bg-gray-50 px-4 py-3 border-t">
                  Total Sports: {sports.length}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Sports;
