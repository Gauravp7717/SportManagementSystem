const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    subdomain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    plan: {
      type: String,
      enum: ["FREE", "BASIC", "PRO", "ENTERPRISE"],
      default: "FREE",
      required: true,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed, // Flexible JSON object
      default: {},
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

module.exports = mongoose.model("Tenant", tenantSchema);
