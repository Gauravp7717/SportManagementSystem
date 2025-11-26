import React, { useState } from "react";
import {
  Building2,
  Globe,
  CreditCard,
  X,
  AlertCircle,
  CheckCircle,
  Tag,
  Activity,
} from "lucide-react";
import { createTenant } from "../../api/tennantsapi";

export default function AddTennants() {
  const [formData, setFormData] = useState({
    clubName: "",
    subDomain: "",
    plan: "FREE",
    status: "ACTIVE",
    metadata: {
      description: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const plans = [
    {
      value: "FREE",
      label: "Free",
      description: "Basic features for small clubs",
    },
    {
      value: "BASIC",
      label: "Basic",
      description: "Essential features for growing clubs",
    },
    {
      value: "PRO",
      label: "Pro",
      description: "Advanced features for established clubs",
    },
    {
      value: "ENTERPRISE",
      label: "Enterprise",
      description: "Full features for large organizations",
    },
  ];

  const statuses = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
    { value: "SUSPENDED", label: "Suspended" },
  ];

  // ---------------- VALIDATION ------------------
  const validateForm = () => {
    const newErrors = {};

    // Club Name
    if (!formData.clubName.trim()) {
      newErrors.clubName = "Club name is required";
    } else if (formData.clubName.length < 3) {
      newErrors.clubName = "Club name must be at least 3 characters";
    }

    // Subdomain
    if (!formData.subDomain.trim()) {
      newErrors.subDomain = "Subdomain is required";
    } else if (formData.subDomain.length < 3) {
      newErrors.subDomain = "Subdomain must be at least 3 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.subDomain)) {
      newErrors.subDomain =
        "Subdomain can only contain lowercase letters, numbers, and hyphens";
    } else if (
      formData.subDomain.startsWith("-") ||
      formData.subDomain.endsWith("-")
    ) {
      newErrors.subDomain = "Subdomain cannot start or end with a hyphen";
    }

    // Email validation
    if (
      formData.metadata.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.metadata.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone validation
    if (
      formData.metadata.contactPhone &&
      !/^[+]?[\d\s-()]+$/.test(formData.metadata.contactPhone)
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------- HANDLE INPUT CHANGE ------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Metadata inside object
    if (name in formData.metadata) {
      setFormData((prev) => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "subDomain" ? value.toLowerCase().trim() : value,
      }));
    }

    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ---------------- HANDLE SUBMIT ------------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const payload = {
      clubName: formData.clubName,
      subDomain: formData.subDomain,
      plan: formData.plan,
      status: formData.status,
      metadata: formData.metadata,
    };

    try {
      const res = await createTenant(payload);

      if (res.data.success) {
        setSubmitSuccess(true);

        setFormData({
          clubName: "",
          subDomain: "",
          plan: "FREE",
          status: "ACTIVE",
          metadata: {
            description: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
          },
        });

        setTimeout(() => setSubmitSuccess(false), 2000);
      } else {
        setErrors({ api: res.data.message });
      }
    } catch (err) {
      setErrors({ api: err.response?.data?.message || "Server error" });
    }

    setIsSubmitting(false);
  };

  const handleReset = () => {
    setFormData({
      clubName: "",
      subDomain: "",
      plan: "FREE",
      status: "ACTIVE",
      metadata: {
        description: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
      },
    });
    setErrors({});
    setSubmitSuccess(false);
  };

  // ---------------- UI ------------------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Club</h1>
          <p className="text-gray-600 mt-2">
            Create a new club (tenant) in the platform
          </p>
        </div>

        {/* API Error */}
        {errors.api && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            {errors.api}
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">
                Club created successfully!
              </p>
              <p className="text-green-700 text-sm">
                The club is now active and ready to use.
              </p>
            </div>
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Club Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Club Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="clubName"
                value={formData.clubName}
                onChange={handleChange}
                placeholder="Enter club name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.clubName
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
              />
            </div>
            {errors.clubName && (
              <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.clubName}
              </p>
            )}
          </div>

          {/* SubDomain */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subdomain <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="subDomain"
                value={formData.subDomain}
                onChange={handleChange}
                placeholder="elitefitness"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.subDomain
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
              />
            </div>
            {errors.subDomain && (
              <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.subDomain}
              </p>
            )}
          </div>

          {/* Plan */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Plan
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {plans.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-6 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-gray-500" /> Additional Information
            </h3>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.metadata.description}
                onChange={handleChange}
                rows="3"
                placeholder="Brief description of the club"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contactEmail"
                value={formData.metadata.contactEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.contactEmail
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
                placeholder="contact@club.com"
              />
              {errors.contactEmail && (
                <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.contactEmail}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.metadata.contactPhone}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                  errors.contactPhone
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-teal-500"
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.contactPhone && (
                <p className="mt-2 text-red-600 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.contactPhone}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.metadata.address}
                onChange={handleChange}
                rows="2"
                placeholder="123 Main St, City, State, ZIP"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Club...
                </>
              ) : (
                "Create Club"
              )}
            </button>

            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-semibold"
            >
              <X className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
