import React, { useState, useEffect } from "react";
import {
  List,
  PlusCircle,
  Edit2,
  Trash2,
  Gamepad2,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { createSport } from "../../api/clubadminapi";
import { useNavigate } from "react-router-dom";

const Sports = () => {
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  const [sports, setSports] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sportName: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const { sportName, description } = formData;
    return sportName && description;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields.");
      return;
    }

    const payload = {
      sportName: formData.sportName,
      description: formData.description,
      status: formData.status === "Active",
    };

    const res = await createSport(payload);

    if (res.success) {
      alert("Sport created successfully!");

      setFormData({
        sportName: "",
        description: "",
        status: "Active",
      });
    } else {
      alert(res.message);
    }
  };

  const handleEdit = (sport) => {
    setFormData({
      sportName: sport.name,
      description: sport.description,
      icon: sport.icon || "",
      status: sport.active ? "Active" : "Inactive",
    });

    setEditId(sport._id);
    setShowList(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handelview = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Toggle Btn */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => {
              handelview("/club/sportslist");
            }}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
          >
            View Sports List
          </button>
        </div>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Add / Edit Sport
            </h1>
          </div>
          <p className="text-sm text-gray-600">
            Create sports that will be available in your academy.
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6 space-y-5">
          {/* Sport Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Sport Name *
            </label>
            <input
              type="text"
              name="sportName"
              value={formData.sportName}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          {/* Icon Selector
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Sport Icon *
                </label>

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
                </select>
              </div> */}

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg text-sm"
              rows="3"
            ></textarea>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Status *
            </label>
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
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg"
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
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sports;
