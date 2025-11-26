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

export default function AddTennants() {
  const [formData, setFormData] = useState({
    name: "",
    subdomain: "",
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
    { value: "ACTIVE", label: "Active", color: "text-green-600" },
    { value: "INACTIVE", label: "Inactive", color: "text-gray-600" },
    { value: "SUSPENDED", label: "Suspended", color: "text-red-600" },
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Club name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Club name must be at least 3 characters";
    }

    // Subdomain validation
    if (!formData.subdomain.trim()) {
      newErrors.subdomain = "Subdomain is required";
    } else if (formData.subdomain.length < 3) {
      newErrors.subdomain = "Subdomain must be at least 3 characters";
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain =
        "Subdomain can only contain lowercase letters, numbers, and hyphens";
    } else if (
      formData.subdomain.startsWith("-") ||
      formData.subdomain.endsWith("-")
    ) {
      newErrors.subdomain = "Subdomain cannot start or end with a hyphen";
    }

    // Email validation (optional but must be valid if provided)
    if (
      formData.metadata.contactEmail &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.metadata.contactEmail)
    ) {
      newErrors.contactEmail = "Please enter a valid email address";
    }

    // Phone validation (optional but must be valid if provided)
    if (
      formData.metadata.contactPhone &&
      !/^[+]?[\d\s-()]+$/.test(formData.metadata.contactPhone)
    ) {
      newErrors.contactPhone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

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
        [name]: name === "subdomain" ? value.toLowerCase().trim() : value,
      }));
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", {
        name: formData.name,
        subdomain: formData.subdomain,
        plan: formData.plan,
        status: formData.status,
        metadata: formData.metadata,
      });

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: "",
          subdomain: "",
          plan: "FREE",
          status: "ACTIVE",
          metadata: {
            description: "",
            contactEmail: "",
            contactPhone: "",
            address: "",
          },
        });
        setSubmitSuccess(false);
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      subdomain: "",
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

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div>
            {/* Club Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Club Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter club name"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.name
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                />
              </div>
              {errors.name && (
                <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                The display name for the club (e.g., "Elite Fitness Club")
              </p>
            </div>

            {/* Subdomain Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Subdomain <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="subdomain"
                  value={formData.subdomain}
                  onChange={handleChange}
                  placeholder="elitefitness"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.subdomain
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                />
              </div>
              {errors.subdomain && (
                <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.subdomain}
                </div>
              )}
              {formData.subdomain && !errors.subdomain && (
                <p className="mt-2 text-xs text-teal-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Club will be accessible at:{" "}
                  <span className="font-mono font-semibold">
                    {formData.subdomain}.yourplatform.com
                  </span>
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Unique subdomain (lowercase, numbers, hyphens only)
              </p>
            </div>

            {/* Plan Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
                >
                  {plans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {plans.find((p) => p.value === formData.plan)?.description}
              </p>
            </div>

            {/* Status Field */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none bg-white"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {formData.status === "ACTIVE" &&
                  "Club is operational and accessible"}
                {formData.status === "INACTIVE" &&
                  "Club is temporarily disabled"}
                {formData.status === "SUSPENDED" && "Club access is suspended"}
              </p>
            </div>

            {/* Metadata Section */}
            <div className="mb-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-500" />
                Additional Information
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
                  placeholder="Brief description of the club"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Optional description for internal reference
                </p>
              </div>

              {/* Contact Email */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.metadata.contactEmail}
                  onChange={handleChange}
                  placeholder="contact@club.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.contactEmail
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                />
                {errors.contactEmail && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactEmail}
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.metadata.contactPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.contactPhone
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-teal-500"
                  }`}
                />
                {errors.contactPhone && (
                  <div className="mt-2 flex items-center gap-1 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {errors.contactPhone}
                  </div>
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
                  placeholder="123 Main St, City, State, ZIP"
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
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
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 text-gray-700 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-900 font-medium text-sm">
                Important Information
              </p>
              <ul className="mt-2 text-blue-800 text-sm space-y-1 list-disc list-inside">
                <li>Each club requires a unique name and subdomain</li>
                <li>Subdomain cannot be changed after creation</li>
                <li>Plan determines available features and limits</li>
                <li>
                  Timestamps (createdAt, updatedAt) are managed automatically
                </li>
                <li>Metadata is flexible and can store custom fields</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
