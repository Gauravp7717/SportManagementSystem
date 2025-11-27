import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Shield,
  Building2,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { getAllTenants, createClubAdmin } from "../../api/tennantsapi";

export default function AddUser() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "CLUB_ADMIN",
    clubId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Dynamic clubs from backend
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    async function fetchClubs() {
      try {
        const res = await getAllTenants();
        if (res.data.success) {
          setClubs(res.data.tenants);
        }
      } catch (err) {
        console.log("Error loading clubs:", err);
      }
    }
    fetchClubs();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.role === "CLUB_ADMIN" && !formData.clubId) {
      newErrors.clubId = "Club selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      username: formData.username,
      email: formData.username + "@gmail.com", // temporary
      role: formData.role,
      password: formData.password,
      clubName: formData.clubId, // backend expects clubName
    };

    try {
      const res = await createClubAdmin(payload);

      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({
          username: "",
          password: "",
          confirmPassword: "",
          role: "CLUB_ADMIN",
          clubId: "",
        });
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (err) {
      setErrors({
        api: err.response?.data?.message || "Server error while creating admin",
      });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      role: "CLUB_ADMIN",
      clubId: "",
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Add New User</h1>

        {errors.api && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {errors.api}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800">User created successfully!</p>
          </div>
        )}

        {/* Username */}
        <div className="mb-5">
          <label className="font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-5">
          <label className="font-semibold">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="CLUB_ADMIN">Club Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {/* Club selection */}
        {formData.role === "CLUB_ADMIN" && (
          <div className="mb-5">
            <label className="font-semibold">Assign Club</label>
            <select
              name="clubId"
              value={formData.clubId}
              onChange={handleChange}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="">Select Club</option>
              {clubs.map((club) => (
                <option key={club._id} value={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>
            {errors.clubId && (
              <p className="text-red-500 text-sm">{errors.clubId}</p>
            )}
          </div>
        )}

        {/* Password */}
        <div className="mb-5">
          <label className="font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="font-semibold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-teal-500 text-white py-2 rounded disabled:bg-teal-300"
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </button>

          <button
            onClick={handleReset}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-400 rounded"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
