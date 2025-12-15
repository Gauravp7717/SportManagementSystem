import React, { useState, useEffect } from "react";
import {
  UserPlus,
  User,
  Calendar,
  Phone,
  List,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";

import { createStudent, getStudents } from "../../api/studentApi";
import { getSports } from "../../api/clubadminapi";
import { getBatches } from "../../api/batchapi";

const Student = () => {
  const [showStudentList, setShowStudentList] = useState(false);
  const [students, setStudents] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingBatches, setLoadingBatches] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    dob: "",
    joiningDate: "",
    sports: "",
    feeStatus: "PAID",
    batchId: "",
  });

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    fetchSports();
    fetchBatches();
  }, []);

  useEffect(() => {
    if (showStudentList) fetchStudents();
  }, [showStudentList]);

  const fetchSports = async () => {
    try {
      setLoadingSports(true);
      const res = await getSports();
      if (res?.success !== false) setSportsList(res.data || []);
    } finally {
      setLoadingSports(false);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoadingBatches(true);
      const res = await getBatches();
      if (res?.success !== false) setBatchesList(res.data || []);
    } finally {
      setLoadingBatches(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const res = await getStudents();
      if (res?.success !== false) setStudents(res.data || []);
    } finally {
      setLoadingStudents(false);
    }
  };

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "contact" ? value.replace(/\D/g, "") : value,
    }));
  };

  /* ===================== VALIDATION (BACKEND MATCH) ===================== */

  const validateForm = () => {
    const { name, email, contact, dob, joiningDate, sports, batchId } =
      formData;

    if (!name.trim()) return false;
    if (!email.trim()) return false;
    if (contact.length < 10) return false;
    if (!dob) return false;
    if (!joiningDate) return false;
    if (!sports) return false;
    if (!batchId) return false;

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contact: formData.contact,
        dob: formData.dob,
        joiningDate: formData.joiningDate,
        sports: formData.sports,
        feeStatus: formData.feeStatus,
        batchId: formData.batchId,
      };

      const res = await createStudent(payload);
      if (res?.success !== false) {
        alert("Student added successfully!");
        resetForm();
        if (showStudentList) fetchStudents();
      } else {
        alert(res?.message || "Failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      contact: "",
      dob: "",
      joiningDate: "",
      sports: "",
      feeStatus: "PAID",
      batchId: "",
    });
    setEditId(null);
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Toggle Button - Enhanced with icons */}
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowStudentList(!showStudentList)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all"
          >
            {showStudentList ? <UserPlus size={16} /> : <List size={16} />}
            {showStudentList ? "Add Student" : "View Students"}
          </button>
        </div>

        {!showStudentList ? (
          /* Add Student Form */
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Add Student</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Name */}
              <input
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />

              {/* Email */}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />

              {/* Contact */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  name="contact"
                  placeholder="Contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="border border-gray-300 pl-10 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full"
                />
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Joining Date
                </label>
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full"
                />
              </div>

              {/* Sport Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sport
                </label>
                <select
                  name="sports"
                  value={formData.sports}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full appearance-none bg-white"
                  disabled={loadingSports}
                >
                  <option value="">Select Sport</option>
                  {sportsList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.sportName}
                    </option>
                  ))}
                </select>
                {loadingSports && (
                  <div className="text-xs text-gray-500 mt-1">
                    Loading sports...
                  </div>
                )}
              </div>

              {/* Batch Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch
                </label>
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all w-full appearance-none bg-white"
                  disabled={loadingBatches}
                >
                  <option value="">Select Batch</option>
                  {batchesList.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name || b.batchName}
                    </option>
                  ))}
                </select>
                {loadingBatches && (
                  <div className="text-xs text-gray-500 mt-1">
                    Loading batches...
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Add Student"
              )}
            </button>
          </div>
        ) : (
          /* Student List */
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5" />
              Student List
            </h2>

            {loadingStudents ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : students.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No students found. Add your first student!
              </div>
            ) : (
              <div className="space-y-3">
                {students.map((s) => (
                  <div
                    key={s._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-sm text-gray-600">{s.email}</p>
                        <p className="text-sm text-gray-500">
                          {s.contact} •{" "}
                          {new Date(s.joiningDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Student;
