import React, { useState, useEffect } from "react";
import {
  Phone,
  Loader2,
  User,
  Mail,
  Calendar,
  Trophy,
  Users,
} from "lucide-react";

import { createStudent } from "../../api/studentApi";
import { getSports } from "../../api/clubadminapi";
import { getBatches } from "../../api/batchapi";

const Student = () => {
  const [sportsList, setSportsList] = useState([]);
  const [batchesList, setBatchesList] = useState([]);

  const [loading, setLoading] = useState(false);
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

  /* ===================== HANDLERS ===================== */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "contact" ? value.replace(/\D/g, "") : value,
    }));
  };

  /* ===================== VALIDATION ===================== */

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
      } else {
        alert(res?.message || "Failed to add student");
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
  };

  /* ===================== UI ===================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Add New Student
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Fill in the details to register a new student
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Name Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="email"
                  type="email"
                  placeholder="student@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Contact Input */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  name="contact"
                  placeholder="10-digit number"
                  value={formData.contact}
                  onChange={handleChange}
                  maxLength="10"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Joining Date */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Joining Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300"
                />
              </div>
            </div>

            {/* Sports Select */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sport <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Trophy className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  name="sports"
                  value={formData.sports}
                  onChange={handleChange}
                  disabled={loadingSports}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300 appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingSports ? "Loading sports..." : "Select a sport"}
                  </option>
                  {sportsList.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.sportName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {loadingSports ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            {/* Batch Select */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Batch <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                <select
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  disabled={loadingBatches}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 hover:border-gray-300 appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {loadingBatches ? "Loading batches..." : "Select a batch"}
                  </option>
                  {batchesList.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name || b.batchName}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  {loadingBatches ? (
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            {/* Fee Status - Full Width on Mobile */}
            <div className="group md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Status
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-3 cursor-pointer group/radio">
                  <input
                    type="radio"
                    name="feeStatus"
                    value="PAID"
                    checked={formData.feeStatus === "PAID"}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium group-hover/radio:text-indigo-600 transition-colors">
                    Paid
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group/radio">
                  <input
                    type="radio"
                    name="feeStatus"
                    value="UNPAID"
                    checked={formData.feeStatus === "UNPAID"}
                    onChange={handleChange}
                    className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 focus:ring-2"
                  />
                  <span className="text-gray-700 font-medium group-hover/radio:text-indigo-600 transition-colors">
                    Unpaid
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 text-base sm:text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving Student...</span>
              </>
            ) : (
              <>
                <User className="w-5 h-5" />
                <span>Add Student</span>
              </>
            )}
          </button>
        </div>
      </div>

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

        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: 0.6;
        }

        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Student;
