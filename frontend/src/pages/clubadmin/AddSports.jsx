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

import { createSport } from "../../api/clubAdminapi.js";
import { useNavigate } from "react-router-dom";

const Sports = () => {
  const [showList, setShowList] = useState(false);
  const [editId, setEditId] = useState(null);

  const [sports, setSports] = useState([]);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    sportName: "",
    description: "",
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
    };

    const res = await createSport(payload);

    if (res.success) {
      alert("Sport created successfully!");

      setFormData({
        sportName: "",
        description: "",
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
